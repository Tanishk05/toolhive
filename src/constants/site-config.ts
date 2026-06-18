const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_APP_URL || "https://toolhive.in";
  if (url.includes("toolhive.in") && url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }
  return url;
};

export const siteConfig = {
  name: "ToolHive",
  description: "A modern platform for utility tools, editorial content, subscriptions, and analytics.",
  url: getBaseUrl(),
  locale: "en_US",
  author: "ToolHive",
} as const;