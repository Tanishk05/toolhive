import { Suspense, type ReactNode } from "react";

export function SuspenseBoundary({
  children,
  fallback,
}: Readonly<{
  children: ReactNode;
  fallback: ReactNode;
}>) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}