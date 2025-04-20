import { ContactUsSchema } from "@/lib/validationSchemas";
import { NextResponse, NextRequest } from "next/server";
import { ContactUsDto } from "@/lib/dtos";
import { sendContactUsEmail } from "@/lib/mail/contactUs";

/**
 *  @method  POST
 *  @route   ~/api/contact
 *  @desc    Send contact us email
 *  @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactUsDto;
    const validation = ContactUsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, message } = validation.data;

    try {
      await sendContactUsEmail(name, email, message);
    } catch (emailError) {
      console.error("Error sending contact us email:", emailError);

      return NextResponse.json(
        {
          message: "Error sending the email. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Your message has been sent successfully, ${name}. We will respond shortly.`,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Contact Us Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
