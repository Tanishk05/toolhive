import { NextResponse } from "next/server";
import { getBlogPosts } from "@/features/blog/blog-registry";
import { siteConfig } from "@/constants/site-config";

export async function GET() {
  const posts = await getBlogPosts();
  const items = posts
    .map(
      (post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${siteConfig.url}${post.canonical}</link>
          <guid isPermaLink="true">${siteConfig.url}${post.canonical}</guid>
          <pubDate>${post.publishedAt.toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt}]]></description>
        </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${siteConfig.name} Blog</title>
        <link>${siteConfig.url}/blog</link>
        <description>${siteConfig.description}</description>
        <language>en-us</language>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
