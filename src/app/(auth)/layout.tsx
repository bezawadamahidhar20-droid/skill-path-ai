import type { ReactNode } from "react";
import { Providers } from "@/components/layout/providers";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
