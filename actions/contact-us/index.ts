"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { sendContactUsEmail } from "@/lib/mail/contactUs";
import { InputType, ReturnType } from "./types";
import { ContactUs } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const validation = ContactUs.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const { name, email, message } = validation.data;

  try {
    await sendContactUsEmail(name, email, message);
    return {
      data: {
        message: `Your message has been sent successfully, ${name}. We will respond shortly.`,
      },
    };
  } catch (emailError) {
    console.error("Error sending contact us email:", emailError);
    return {
      error: "Error sending the email. Please try again later.",
    };
  }
};

export const submitContactForm = createSafeAction(ContactUs, handler);