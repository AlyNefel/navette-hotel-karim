"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormValues) {
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setStatus("success");
      reset();
      
      // Reset success state after a few seconds
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
    >
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mediterranean-blue/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-terracotta-warmth/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-mediterranean-blue dark:text-white font-heading">Send us a message</h3>
        <p className="text-slate-600 dark:text-slate-300 mt-2 font-sans">We'll get back to you as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">Full Name</Label>
            <Input 
              id="name"
              placeholder="John Doe" 
              {...register("name")} 
              className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-mediterranean-blue/50 transition-all duration-300"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">Email Address</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="john@example.com" 
              {...register("email")} 
              className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-mediterranean-blue/50 transition-all duration-300"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 dark:text-slate-200">Phone Number (Optional)</Label>
            <Input 
              id="phone"
              type="tel" 
              placeholder="+216 71 123 456" 
              {...register("phone")} 
              className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-mediterranean-blue/50 transition-all duration-300"
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-slate-700 dark:text-slate-200">Subject</Label>
            <Input 
              id="subject"
              placeholder="How can we help?" 
              {...register("subject")} 
              className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-mediterranean-blue/50 transition-all duration-300"
            />
            {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-slate-700 dark:text-slate-200">Message</Label>
          <Textarea 
            id="message"
            placeholder="Tell us more about your inquiry..." 
            className="min-h-[150px] resize-none bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-mediterranean-blue/50 transition-all duration-300"
            {...register("message")} 
          />
          {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={status === "submitting" || status === "success"}
          className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-500 overflow-hidden relative ${
            status === "success" ? "bg-green-500 hover:bg-green-600" : "bg-mediterranean-blue hover:bg-mediterranean-blue/90"
          }`}
        >
          <motion.div
            initial={false}
            animate={{
              y: status === "submitting" ? -40 : status === "success" ? -80 : 0,
            }}
            className="flex flex-col items-center justify-start h-[120px]"
          >
            <div className="h-12 flex items-center justify-center w-full">
              Send Message
            </div>
            <div className="h-12 flex items-center justify-center w-full text-white">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </div>
            <div className="h-12 flex items-center justify-center w-full text-white">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Message Sent!
            </div>
          </motion.div>
        </Button>

        {status === "error" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-red-500 text-sm mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Something went wrong. Please try again later.
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
