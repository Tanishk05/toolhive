import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { 
  User, Settings, Bell, Folder, History,
  LayoutGrid, TrendingUp, Sparkles, Star,
  Info, Mail, FileText, Briefcase,
  HelpCircle, MessageCircleQuestion, MessageSquare, AlertTriangle,
  ShieldCheck, FileSignature, Cookie,
  Palette, LogOut, LogIn, UserPlus, ChevronRight,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export const metadata = {
  title: "More - ToolHive",
  description: "Navigation hub for settings, support, and account management.",
};

export default async function MorePage() {
  const user = await currentUser();
  const isSignedIn = !!user;

  const EXPLORE_GROUP = {
    title: "Explore",
    items: [
      { label: "Categories", icon: LayoutGrid, href: "/categories" },
      { label: "Trending Tools", icon: TrendingUp, href: "/trending" },
      { label: "New Tools", icon: Sparkles, href: "/new" },
      { label: "Popular Tools", icon: Star, href: "/popular" },
    ],
  };

  const COMPANY_GROUP = {
    title: "Company",
    items: [
      { label: "About Us", icon: Info, href: "/about" },
      { label: "Contact Us", icon: Mail, href: "/contact" },
      { label: "Blog", icon: FileText, href: "/blog" },
      { label: "Careers", icon: Briefcase, href: "/careers" },
    ],
  };

  const SUPPORT_GROUP = {
    title: "Support",
    items: [
      { label: "Help Center", icon: HelpCircle, href: "/help" },
      { label: "FAQ", icon: MessageCircleQuestion, href: "/faq" },
      { label: "Feedback", icon: MessageSquare, href: "/feedback" },
      { label: "Report Issue", icon: AlertTriangle, href: "/report" },
    ],
  };

  const LEGAL_GROUP = {
    title: "Legal",
    items: [
      { label: "Privacy Policy", icon: ShieldCheck, href: "/privacy-policy" },
      { label: "Terms & Conditions", icon: FileSignature, href: "/terms-of-service" },
      { label: "Cookie Policy", icon: Cookie, href: "/cookie-policy" },
    ],
  };

  const LOGGED_IN_PROFILE_GROUP = {
    title: "Profile",
    items: [
      { label: "My Profile", icon: User, href: "/profile" },
      { label: "Settings", icon: Settings, href: "/settings" },
      { label: "Notifications", icon: Bell, href: "/notifications" },
      { label: "Collections", icon: Folder, href: "/collections" },
      { label: "Usage History", icon: History, href: "/history" },
    ],
  };

  const LOGGED_OUT_ACCOUNT_GROUP = {
    title: "Account",
    items: [
      { label: "Sign In", icon: LogIn, action: "signin" },
      { label: "Create Account", icon: UserPlus, action: "signup" },
    ],
  };

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4 pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-6">Menu</h1>

      <div className="space-y-8">
        {/* Profile Card */}
        {isSignedIn ? (
          <Card className="overflow-hidden p-5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border border-border shrink-0">
                {user.imageUrl ? (
                   
                  <img src={user.imageUrl} alt={user.fullName || "User"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg truncate text-foreground">{user.fullName || "User"}</h2>
                <p className="text-sm text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center w-full rounded-md bg-primary/10 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Card>
        ) : (
          <Card className="overflow-hidden p-6 text-center flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Save your favorite tools</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              Create an account to save tools, create collections, and sync across devices.
            </p>
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
              <SignInButton mode="modal">
                <button className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 rounded-md border border-border bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </Card>
        )}

        {/* Dynamic Groups */}
        <div className="space-y-6">
          {/* Account Group (Logged out) */}
          {!isSignedIn && (
            <MenuSection title={LOGGED_OUT_ACCOUNT_GROUP.title}>
              {LOGGED_OUT_ACCOUNT_GROUP.items.map((item, idx) => (
                item.action === "signin" ? (
                  <SignInButton mode="modal" key={idx}>
                    <button className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
                      <div className="flex items-center gap-3 text-foreground">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </SignInButton>
                ) : (
                  <SignUpButton mode="modal" key={idx}>
                    <button className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
                      <div className="flex items-center gap-3 text-foreground">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </SignUpButton>
                )
              ))}
            </MenuSection>
          )}

          {/* Profile Group (Logged in) */}
          {isSignedIn && (
            <MenuSection title={LOGGED_IN_PROFILE_GROUP.title}>
              {LOGGED_IN_PROFILE_GROUP.items.map((item) => (
                <MenuLink key={item.href} item={item} />
              ))}
            </MenuSection>
          )}

          <MenuSection title={EXPLORE_GROUP.title}>
            {EXPLORE_GROUP.items.map((item) => <MenuLink key={item.href} item={item} />)}
          </MenuSection>

          <MenuSection title={COMPANY_GROUP.title}>
            {COMPANY_GROUP.items.map((item) => <MenuLink key={item.href} item={item} />)}
          </MenuSection>

          <MenuSection title={SUPPORT_GROUP.title}>
            {SUPPORT_GROUP.items.map((item) => <MenuLink key={item.href} item={item} />)}
          </MenuSection>

          <MenuSection title={LEGAL_GROUP.title}>
            {LEGAL_GROUP.items.map((item) => <MenuLink key={item.href} item={item} />)}
          </MenuSection>

          <MenuSection title="Appearance">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 text-foreground">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Theme Settings</span>
              </div>
              <ThemeSwitcher />
            </div>
          </MenuSection>

          {/* Logout Group (Logged in) */}
          {isSignedIn && (
            <MenuSection title="Account">
              <SignOutButton>
                <button className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
                  <div className="flex items-center gap-3 text-red-500">
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Logout</span>
                  </div>
                </button>
              </SignOutButton>
            </MenuSection>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="px-1">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 ml-2">{title}</h2>
      <Card className="overflow-hidden divide-y divide-border">
        {children}
      </Card>
    </div>
  );
}

function MenuLink({ item }: { item: { href: string; label: string; icon: any } }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="flex items-center justify-between p-4 min-h-[44px] hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 text-foreground">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{item.label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
