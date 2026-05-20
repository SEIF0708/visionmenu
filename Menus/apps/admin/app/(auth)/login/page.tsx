import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-950 text-neutral-50 dark">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">AR Menu Admin</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Sign in to your account
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-center">Loading...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
