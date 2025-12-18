import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
}

