"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  contactFormSchema,
  contactSubjects,
  contactSubjectLabels,
  type ContactFormValues,
} from "@/lib/validations/contact";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: undefined,
      message: "",
      website: "",
      _gotcha: "",
      _timestamp: 0,
    },
  });

  useEffect(() => {
    setValue("_timestamp", Date.now());
  }, [setValue]);

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.error?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      reset();
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-300" />
        </div>
        <h3 className="text-xl font-semibold text-white">Message sent!</h3>
        <p className="max-w-sm text-sm text-slate-400">
          Thank you for reaching out. We&rsquo;ll review your message and get back to you within 1–2 business days.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSubmitted(false)}
          className="mt-2"
        >
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Honeypot fields — hidden from users */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        <input type="text" tabIndex={-1} autoComplete="off" {...register("_gotcha")} />
      </div>
      <input type="hidden" {...register("_timestamp")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-slate-300">
            Name
          </label>
          <Input
            id="contact-name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm font-medium text-slate-300">
          Subject
        </label>
        <Select
          id="contact-subject"
          error={errors.subject?.message}
          {...register("subject")}
        >
          <option value="" disabled>
            Select a subject
          </option>
          {contactSubjects.map((s) => (
            <option key={s} value={s}>
              {contactSubjectLabels[s]}
            </option>
          ))}
        </Select>
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium text-slate-300">
          Message
        </label>
        <Textarea
          id="contact-message"
          placeholder="How can we help?"
          error={errors.message?.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </Button>
    </motion.form>
  );
}
