"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validations/contact";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", website: "" },
  });

  async function onSubmit(data: NewsletterFormValues) {
    try {
      setErrorMessage("");
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus("error");
        setErrorMessage(result.error?.message ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3"
          >
            <Check className="h-4 w-4 text-emerald-300" />
            <span className="text-sm font-medium text-emerald-200">
              You&rsquo;re subscribed! Check your inbox.
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 sm:flex-row"
            noValidate
          >
            {/* Honeypot */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
              <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="shrink-0">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Subscribe
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {errors.email && (
        <p className="text-xs text-destructive">{errors.email.message}</p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
