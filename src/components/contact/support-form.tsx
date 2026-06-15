"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LifeBuoy, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  supportRequestSchema,
  supportCategories,
  supportCategoryLabels,
  supportPriorities,
  supportPriorityLabels,
  type SupportFormValues,
} from "@/lib/validations/contact";

export function SupportForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: undefined,
      priority: "normal",
      message: "",
      website: "",
      _gotcha: "",
      _timestamp: 0,
    },
  });

  useEffect(() => {
    setValue("_timestamp", Date.now());
  }, [setValue]);

  async function onSubmit(data: SupportFormValues) {
    try {
      const response = await fetch("/api/support", {
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
      toast.success("Support request submitted successfully!");
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
        <h3 className="text-xl font-semibold text-white">Request submitted!</h3>
        <p className="max-w-sm text-sm text-slate-400">
          Our support team has received your request and will follow up via email.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSubmitted(false)}
          className="mt-2"
        >
          Submit another request
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
      {/* Honeypot fields */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        <input type="text" tabIndex={-1} autoComplete="off" {...register("_gotcha")} />
      </div>
      <input type="hidden" {...register("_timestamp")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="support-name" className="text-sm font-medium text-slate-300">
            Name
          </label>
          <Input
            id="support-name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="support-email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <Input
            id="support-email"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="support-category" className="text-sm font-medium text-slate-300">
            Category
          </label>
          <Select
            id="support-category"
            error={errors.category?.message}
            {...register("category")}
          >
            <option value="" disabled>
              Select category
            </option>
            {supportCategories.map((c) => (
              <option key={c} value={c}>
                {supportCategoryLabels[c]}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="support-priority" className="text-sm font-medium text-slate-300">
            Priority
          </label>
          <Select
            id="support-priority"
            error={errors.priority?.message}
            {...register("priority")}
          >
            {supportPriorities.map((p) => (
              <option key={p} value={p}>
                {supportPriorityLabels[p]}
              </option>
            ))}
          </Select>
          {errors.priority && (
            <p className="text-xs text-destructive">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="support-subject" className="text-sm font-medium text-slate-300">
          Subject
        </label>
        <Input
          id="support-subject"
          placeholder="Brief summary of your issue"
          error={errors.subject?.message}
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="support-message" className="text-sm font-medium text-slate-300">
          Message
        </label>
        <Textarea
          id="support-message"
          placeholder="Describe your issue in detail..."
          size="lg"
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
            Submitting…
          </>
        ) : (
          <>
            <LifeBuoy className="h-4 w-4" />
            Submit request
          </>
        )}
      </Button>
    </motion.form>
  );
}
