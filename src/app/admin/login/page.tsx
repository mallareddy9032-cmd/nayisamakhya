import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#FBFBFA] px-4">
      <p className="font-telugu text-sm text-muted">లోడ్ అవుతోంది…</p>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
