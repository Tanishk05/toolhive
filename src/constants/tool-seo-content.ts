export const toolSeoContent: Record<
  string,
  {
    howToUse: { title: string; description: string }[];
    benefits: { title: string; description: string }[];
    faqs: { question: string; answer: string }[];
  }
> = {
  "jwt-decoder": {
    howToUse: [
      {
        title: "Paste your JWT",
        description: "Copy your JSON Web Token and paste it into the input field.",
      },
      {
        title: "View the decoded payload",
        description: "The tool automatically decodes the token and displays the header and payload data.",
      },
      {
        title: "Verify the signature (optional)",
        description: "If you have the secret key, you can input it to verify the token's authenticity.",
      },
    ],
    benefits: [
      {
        title: "100% Client-Side",
        description: "Your tokens never leave your browser. All decoding happens locally for maximum security.",
      },
      {
        title: "Instant Decoding",
        description: "See the payload and header contents immediately as you paste.",
      },
    ],
    faqs: [
      {
        question: "Is it safe to decode my JWT here?",
        answer: "Yes. Our JWT decoder runs entirely in your browser. We do not send your tokens to any server, ensuring your sensitive data remains private.",
      },
      {
        question: "What is a JWT?",
        answer: "A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used for authentication.",
      },
    ],
  },
  "base64": {
    howToUse: [
      {
        title: "Select the mode",
        description: "Choose whether you want to encode text to Base64 or decode Base64 back to text.",
      },
      {
        title: "Input your text",
        description: "Paste the text or Base64 string into the input area.",
      },
      {
        title: "Copy the result",
        description: "The encoded or decoded result will appear instantly. Click copy to use it elsewhere.",
      },
    ],
    benefits: [
      {
        title: "Fast and Reliable",
        description: "Encode and decode strings instantly without any server delays.",
      },
      {
        title: "Privacy First",
        description: "All processing happens locally on your device.",
      },
    ],
    faqs: [
      {
        question: "What is Base64 encoding used for?",
        answer: "Base64 is commonly used to encode binary data, especially when that data needs to be stored and transferred over media that are designed to deal with text.",
      },
    ],
  },
};
