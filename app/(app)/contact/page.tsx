import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "../_components/contact-form";


export default function ContactUs() {
  return (
    <main className="flex h-screen justify-center items-center bg-white dark:bg-gray-900 p-6">
      <div className="w-full max-w-xl flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
          Contact Us
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4 text-center max-w-2xl">
          Have a question or need help? Fill out the form below.
        </p>
        <ContactForm />
        <div className="mt-6 space-y-4 text-center text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-center gap-3">
            <Mail className="w-5 h-5" />
            <span>contact@sirius.com</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Phone className="w-5 h-5" />
            <span>+33 1 23 45 67 89</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <MapPin className="w-5 h-5" />
            <span>123 Innovation Street, Paris, France</span>
          </div>
        </div>
      </div>
    </main>
  );
}