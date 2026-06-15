export type QrFormat =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "wifi"
  | "vcard";

export type QrData = {
  // General
  format: QrFormat;
  // URL / Text
  url: string;
  text: string;
  // Email
  emailAddress: string;
  emailSubject: string;
  emailBody: string;
  // Phone / SMS / WhatsApp
  phoneNumber: string;
  smsNumber: string;
  smsMessage: string;
  whatsappNumber: string;
  whatsappMessage: string;
  // WiFi
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: "WPA" | "WEP" | "nopass";
  wifiHidden: boolean;
  // vCard
  vcardFirstName: string;
  vcardLastName: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardCompany: string;
  vcardTitle: string;
  vcardWebsite: string;
};

export const defaultQrData: QrData = {
  format: "url",
  url: "https://toolhive.dev",
  text: "",
  emailAddress: "",
  emailSubject: "",
  emailBody: "",
  phoneNumber: "",
  smsNumber: "",
  smsMessage: "",
  whatsappNumber: "",
  whatsappMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
  vcardFirstName: "",
  vcardLastName: "",
  vcardPhone: "",
  vcardEmail: "",
  vcardCompany: "",
  vcardTitle: "",
  vcardWebsite: "",
};

export function generateQrValue(data: QrData): string {
  switch (data.format) {
    case "url":
      return data.url || "https://";
    case "text":
      return data.text || " ";
    case "email":
      return `mailto:${data.emailAddress}?subject=${encodeURIComponent(
        data.emailSubject
      )}&body=${encodeURIComponent(data.emailBody)}`;
    case "phone":
      return `tel:${data.phoneNumber}`;
    case "sms":
      return `smsto:${data.smsNumber}:${data.smsMessage}`;
    case "whatsapp":
      return `https://wa.me/${data.whatsappNumber.replace(
        /[^\d+]/g,
        ""
      )}?text=${encodeURIComponent(data.whatsappMessage)}`;
    case "wifi":
      return `WIFI:T:${data.wifiEncryption};S:${data.wifiSsid};P:${
        data.wifiPassword
      };H:${data.wifiHidden ? "true" : "false"};;`;
    case "vcard":
      return `BEGIN:VCARD\nVERSION:3.0\nN:${data.vcardLastName};${data.vcardFirstName}\nFN:${data.vcardFirstName} ${data.vcardLastName}\nORG:${data.vcardCompany}\nTITLE:${data.vcardTitle}\nTEL:${data.vcardPhone}\nEMAIL:${data.vcardEmail}\nURL:${data.vcardWebsite}\nEND:VCARD`;
    default:
      return "";
  }
}
