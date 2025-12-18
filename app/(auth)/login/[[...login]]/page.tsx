import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        path="/login"
        signUpUrl="/register"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}

