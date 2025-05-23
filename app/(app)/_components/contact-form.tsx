"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, User, MessageCircle } from "lucide-react";
import { ContactUs } from "@/actions/contact-us/schema";
import { submitContactForm } from "@/actions/contact-us";
import { useAction } from "@/hooks/use-action";

export default function ContactForm() {
  const form = useForm<z.infer<typeof ContactUs>>({
    resolver: zodResolver(ContactUs),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { execute, isLoading } = useAction(submitContactForm, {
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (data: z.infer<typeof ContactUs>) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md"
      >
        <h1 className="text-xl font-semibold text-center mb-1 tracking-wide text-gray-900 dark:text-white">
          Contact Us
        </h1>

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span>Name</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...field}
                  disabled={isLoading}
                  className="bg-transparent border-gray-300 dark:border-gray-600 focus:border-indigo-400 dark:focus:border-indigo-300 focus:ring-indigo-400 dark:focus:ring-indigo-300 transition-all duration-300 hover:border-blue-700 dark:hover:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span>Email</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  {...field}
                  disabled={isLoading}
                  className="bg-transparent border-gray-300 dark:border-gray-600 focus:border-indigo-400 dark:focus:border-indigo-300 focus:ring-indigo-400 dark:focus:ring-indigo-300 transition-all duration-300 hover:border-blue-700 dark:hover:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span>Message</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Your message..."
                  {...field}
                  disabled={isLoading}
                  className="bg-transparent border-gray-300 dark:border-gray-600 focus:border-indigo-400 dark:focus:border-indigo-300 focus:ring-indigo-400 dark:focus:ring-indigo-300 transition-all duration-300 hover:border-blue-700 dark:hover:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-br from-violet-900 via-blue-800 to-violet-900 font-medium transition-all duration-300 hover:brightness-125 hover:scale-105 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>

        {/* Support Link */}
        <p className="text-center mt-6 text-xs text-gray-600 dark:text-gray-400">
          For any questions, please contact us at{" "}
          <Link
            href="#"
            className="text-blue-800 dark:text-blue-400 underline font-medium"
          >
            our support
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}