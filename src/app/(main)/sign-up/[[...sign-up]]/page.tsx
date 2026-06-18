import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-16rem)] items-center justify-center py-10">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
