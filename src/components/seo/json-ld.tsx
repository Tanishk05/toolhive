export function JsonLd({ data }: Readonly<{ data: unknown }>) {
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
