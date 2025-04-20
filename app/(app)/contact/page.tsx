import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "../_components/contact-form";
import Image from "next/image";

export default function ContactUs() {
  return (
    <main className="flex h-screen">
      {/* Left Section (Image & Contact Info) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-10">
        <Image
          src="/sign in.png"
          alt="Contactez-nous"
          width={500}
          height={500}
        />
        {/* Contact Information */}
        <div className="mt-6 space-y-4 text-center">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-white" />
            <span>contact@sirius.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-white" />
            <span>+33 1 23 45 67 89</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <span>123 Innovation Street, Paris, France</span>
          </div>
        </div>
      </div>

      {/* Right Section (Centered Form) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Contact Us
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-3 text-center max-w-2xl">
          Have a question or need help? Fill out the form below.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
