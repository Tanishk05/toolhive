import Link from "next/link";
import type { ReactNode } from "react";
import { compile, run } from "@mdx-js/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import * as jsxRuntime from "react/jsx-runtime";

const prettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
} as const;

type MdxRendererProps = Readonly<{
  source: string;
}>;

export async function renderBlogMdx({ source }: MdxRendererProps) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm, remarkMdx],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], [rehypePrettyCode, prettyCodeOptions]],
  });

  const { default: Content } = await run(compiled, jsxRuntime);

  return <Content components={blogMdxComponents} />;
}

type MdxAnchorProps = Readonly<{
  href?: string;
  children?: ReactNode;
}>;

const blogMdxComponents = {
  a({ href = "#", children, ...props }: MdxAnchorProps) {
    const isInternal = href.startsWith("/") || href.startsWith("#");

    if (isInternal && href.startsWith("/")) {
      return (
        <Link className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition hover:text-primary/80" href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition hover:text-primary/80"
        href={href}
        {...props}
      >
        {children}
      </a>
    );
  },
  h2({ children }: Readonly<{ children?: ReactNode }>) {
    return <h2 className="scroll-mt-28 text-3xl font-bold tracking-tight text-foreground">{children}</h2>;
  },
  h3({ children }: Readonly<{ children?: ReactNode }>) {
    return <h3 className="scroll-mt-28 text-2xl font-bold tracking-tight text-foreground">{children}</h3>;
  },
  p({ children }: Readonly<{ children?: ReactNode }>) {
    return <p className="text-base leading-8 text-muted-foreground">{children}</p>;
  },
  ul({ children }: Readonly<{ children?: ReactNode }>) {
    return <ul className="list-disc space-y-3 pl-6 text-base leading-8 text-muted-foreground">{children}</ul>;
  },
  ol({ children }: Readonly<{ children?: ReactNode }>) {
    return <ol className="list-decimal space-y-3 pl-6 text-base leading-8 text-muted-foreground">{children}</ol>;
  },
  li({ children }: Readonly<{ children?: ReactNode }>) {
    return <li className="pl-1">{children}</li>;
  },
  blockquote({ children }: Readonly<{ children?: ReactNode }>) {
    return <blockquote className="border-l-2 border-primary/30 pl-5 text-lg italic leading-8 text-foreground/80">{children}</blockquote>;
  },
  hr() {
    return <hr className="border-border" />;
  },
  table({ children }: Readonly<{ children?: ReactNode }>) {
    return <div className="overflow-x-auto rounded-2xl bg-surface"><table className="min-w-full divide-y divide-border text-left text-sm text-muted-foreground">{children}</table></div>;
  },
  thead({ children }: Readonly<{ children?: ReactNode }>) {
    return <thead className="bg-white/[0.03] text-foreground">{children}</thead>;
  },
  tbody({ children }: Readonly<{ children?: ReactNode }>) {
    return <tbody className="divide-y divide-border">{children}</tbody>;
  },
  tr({ children }: Readonly<{ children?: ReactNode }>) {
    return <tr>{children}</tr>;
  },
  th({ children }: Readonly<{ children?: ReactNode }>) {
    return <th className="px-4 py-3 font-medium text-foreground">{children}</th>;
  },
  td({ children }: Readonly<{ children?: ReactNode }>) {
    return <td className="px-4 py-3 align-top">{children}</td>;
  },
  pre({ children }: Readonly<{ children?: ReactNode }>) {
    return <pre className="overflow-x-auto rounded-2xl bg-surface p-5 text-sm leading-7 text-foreground/80">{children}</pre>;
  },
  code({ children }: Readonly<{ children?: ReactNode }>) {
    return <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] text-primary">{children}</code>;
  },
};
