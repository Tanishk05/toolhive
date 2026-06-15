# ToolHive 🐝

ToolHive is a modern, ultra-fast, and minimal collection of web utilities designed for developers, creators, and everyday users. Built with a strict "Server-First" architecture, ToolHive prioritizes performance, technical SEO, and exceptional user experience.

## ✨ Features

ToolHive provides a growing registry of 100% free, client-side, privacy-focused tools:

- **Developer Tools**: JWT Decoder, JSON Formatter, Base64 Encoder/Decoder, UUID Generator
- **Content & Media**: Image Compressor (Offline/Client-side WebP/JPEG/PNG optimization)
- **Business & Finance**: EMI Calculator, GST Calculator
- **Productivity**: Secure Password Generator, QR Code Generator, Age Calculator, Unit Converter
- **Content Hub**: Fully integrated SEO-optimized Blog and Category pages with structured data.

### ⚡ Performance & SEO First
- **Lighthouse Scores**: Engineered to achieve > 95 in Performance, SEO, and Accessibility.
- **Server Components**: Leverages Next.js App Router and Server Components to minimize hydration overhead and bundle sizes.
- **Dynamic Imports**: Heavy components and icons are dynamically loaded to keep initial loads blazing fast.
- **Rich Structured Data**: Automatic generation of `WebSite`, `FAQPage`, `CollectionPage`, and `BlogPosting` JSON-LD schemas.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI Components**: Radix UI primitives, custom minimal tokens
- **Deployment**: [Vercel](https://vercel.com/)
- **Analytics**: Custom lightweight edge tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanishk05/toolhive.git
   cd toolhive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your database URL:
   ```env
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/toolhive"
   ```

4. **Initialize the Database:**
   Push the Prisma schema and seed the initial tool registry:
   ```bash
   npx prisma db push
   npx prisma generate
   npm run seed
   ```
   *(Note: You can run `node prisma/seed.js` manually if the npm script is absent).*

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to explore ToolHive.

## 🏗️ Architecture Notes

- **Admin Dashboard**: Contains a robust `/admin` route for managing the tool registry, blog posts, feature flags, and viewing edge analytics.
- **Tool Registry (`src/features/tools`)**: A central dynamic registry connecting category mappings, search term indexing, and popularity scoring.
- **Linting & Code Quality**: The project enforces a strictly 0-warning build policy across ESLint and TypeScript.

## 📄 License

This project is open-source. Please see the [LICENSE](LICENSE) file for more information.
