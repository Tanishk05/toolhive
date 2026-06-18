import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { AccountShell } from "@/components/account/account-shell";

export default async function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  await auth.protect();

  return <AccountShell>{children}</AccountShell>;
}
