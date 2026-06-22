"use client";

import { Link, Type, Mail, Phone, MessageSquare, Wifi, Contact2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { QrData, QrFormat } from "../lib/qr-formats";

type Props = {
  data: QrData;
  onChange: (data: Partial<QrData>) => void;
};

const FORMATS: { value: QrFormat; label: string; icon: React.ReactNode }[] = [
  { value: "url", label: "URL", icon: <Link className="h-4 w-4" /> },
  { value: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { value: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { value: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
  { value: "sms", label: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  { value: "vcard", label: "vCard", icon: <Contact2 className="h-4 w-4" /> },
];

export function QrContentForm({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Format Selector */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange({ format: f.value })}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              data.format === f.value
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        {/* URL */}
        {data.format === "url" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Website URL</label>
            <Input
              value={data.url}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}

        {/* Text */}
        {data.format === "text" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Plain Text</label>
            <Textarea
              value={data.text}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Enter your message here..."
              size="lg"
            />
          </div>
        )}

        {/* Email */}
        {data.format === "email" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input
                type="email"
                value={data.emailAddress}
                onChange={(e) => onChange({ emailAddress: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input
                value={data.emailSubject}
                onChange={(e) => onChange({ emailSubject: e.target.value })}
                placeholder="Message Subject"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Body</label>
              <Textarea
                value={data.emailBody}
                onChange={(e) => onChange({ emailBody: e.target.value })}
                placeholder="Message Body"
              />
            </div>
          </div>
        )}

        {/* Phone */}
        {data.format === "phone" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <Input
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              placeholder="+1 234 567 8900"
            />
          </div>
        )}

        {/* SMS */}
        {data.format === "sms" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={data.smsNumber}
                onChange={(e) => onChange({ smsNumber: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea
                value={data.smsMessage}
                onChange={(e) => onChange({ smsMessage: e.target.value })}
                placeholder="Text message..."
              />
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {data.format === "whatsapp" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
              <Input
                type="tel"
                value={data.whatsappNumber}
                onChange={(e) => onChange({ whatsappNumber: e.target.value })}
                placeholder="12345678900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea
                value={data.whatsappMessage}
                onChange={(e) => onChange({ whatsappMessage: e.target.value })}
                placeholder="Hello there..."
              />
            </div>
          </div>
        )}

        {/* WiFi */}
        {data.format === "wifi" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Network Name (SSID)</label>
              <Input
                value={data.wifiSsid}
                onChange={(e) => onChange({ wifiSsid: e.target.value })}
                placeholder="Network Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                value={data.wifiPassword}
                onChange={(e) => onChange({ wifiPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Encryption</label>
                <Select
                  value={data.wifiEncryption}
                  onChange={(e) => onChange({ wifiEncryption: e.target.value as "WPA" | "WEP" | "nopass" })}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="wifiHidden"
                  checked={data.wifiHidden}
                  onChange={(e) => onChange({ wifiHidden: e.target.checked })}
                  className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary/50"
                />
                <label htmlFor="wifiHidden" className="text-sm text-foreground">
                  Hidden Network
                </label>
              </div>
            </div>
          </div>
        )}

        {/* vCard */}
        {data.format === "vcard" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <Input
                  value={data.vcardFirstName}
                  onChange={(e) => onChange({ vcardFirstName: e.target.value })}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <Input
                  value={data.vcardLastName}
                  onChange={(e) => onChange({ vcardLastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  value={data.vcardPhone}
                  onChange={(e) => onChange({ vcardPhone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={data.vcardEmail}
                  onChange={(e) => onChange({ vcardEmail: e.target.value })}
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company</label>
                <Input
                  value={data.vcardCompany}
                  onChange={(e) => onChange({ vcardCompany: e.target.value })}
                  placeholder="Acme Inc"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={data.vcardTitle}
                  onChange={(e) => onChange({ vcardTitle: e.target.value })}
                  placeholder="Product Manager"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Website</label>
              <Input
                value={data.vcardWebsite}
                onChange={(e) => onChange({ vcardWebsite: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
