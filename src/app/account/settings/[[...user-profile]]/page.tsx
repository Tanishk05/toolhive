import { UserProfile } from "@clerk/nextjs";

export default function AccountSettingsPage() {
  return (
    <section className="flex justify-center">
      <UserProfile path="/account/settings" routing="path" />
    </section>
  );
}
