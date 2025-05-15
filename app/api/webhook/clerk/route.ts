import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const headerList = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET! || "");
  let payload;

  try {
    payload = await req.json();
    wh.verify(JSON.stringify(payload), {
      "svix-id": headerList.get("svix-id") || "",
      "svix-timestamp": headerList.get("svix-timestamp") || "",
      "svix-signature": headerList.get("svix-signature") || "",
    });
  } catch (err) {
    // console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = payload.type;

  // Handle user events
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses, username, image_url } = payload.data;

    const email = email_addresses?.[0]?.email_address || "no-email";
    const firstName = first_name || "Unknown";
    const lastName = last_name || "";
    const userName = username || `${firstName}${lastName}`.replace(/\s/g, "").toLowerCase() || "unknown";
    const photo = image_url || "";

    await db.user.upsert({
      where: { id },
      update: {
        email,
        username: userName,
        firstName,
        lastName,
        photo,
      },
      create: {
        id,
        email,
        username: userName,
        firstName,
        lastName,
        photo,
      },
    });
  }

  // Handle organization events
  if (eventType === "organization.created" || eventType === "organization.updated") {
    const { id, name, slug, logo_url } = payload.data;

    await db.organization.upsert({
      where: { id },
      update: { name, slug, logo: logo_url },
      create: {
        id,
        name,
        slug,
        logo: logo_url,
      },
    });
  }

  // Handle membership events (includes role data)
  if (eventType === "organizationMembership.created" || eventType === "organizationMembership.updated") {
    const { id, organization, role, public_user_data } = payload.data;
    const userId = public_user_data?.user_id;
    const orgId = organization?.id;

    if (!userId || !orgId) {
      console.error("Missing userId or orgId in membership payload");
      return new Response("Invalid payload", { status: 400 });
    }

    // Ensure the role exists in the database
    await db.role.upsert({
      where: { id: role },
      update: { name: role },
      create: {
        id: role,
        name: role,
        orgId,
      },
    });

    // Create or update the membership
    await db.member.upsert({
      where: {
        userId_orgId: { userId, orgId },
      },
      update: {
        roleId: role,
      },
      create: {
        userId,
        orgId,
        roleId: role,
      },
    });
  }
  // Handle delete events
  if (eventType === "user.deleted") {
    const { id } = payload.data;
    await db.user.deleteMany({
      where: { id },
    });
  }

  if (eventType === "organization.deleted") {
    const { id } = payload.data;
    await db.organization.deleteMany({
      where: { id },
    });
  }

  if (eventType === "organizationMembership.deleted") {
    const { public_user_data, organization } = payload.data;
    const userId = public_user_data?.user_id;
    const orgId = organization?.id;
    if (!userId || !orgId) {
      console.error("Missing userId or orgId in membership delete payload");
      return new Response("Invalid payload", { status: 400 });
    }
    await db.member.deleteMany({
      where: {
        userId,
        orgId,
      },
    });
  }

  return new Response("OK", { status: 200 });
}
