import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GlobalSearchWrapper } from "@/components/search/global-search-wrapper";
import { AssistantPanel } from "@/components/ai/assistant-panel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-4 sm:px-6 lg:px-8 lg:py-6">
      <SiteHeader />
      <div className="flex-1 w-full">
        {children}
      </div>
      <SiteFooter />
      <GlobalSearchWrapper />
      <AssistantPanel />
    </div>
  );
}
