import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import BatchControls from "@/components/BatchControls";
import ArticleTable from "@/components/ArticleTable";
import QuickWinsPanel from "@/components/QuickWinsPanel";

export default function Home() {
  return (
    <>
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mh-black">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Operational status of MarketerHire organic search
          </p>
        </div>

        {/* Summary cards */}
        <section className="mb-8">
          <SummaryCards />
        </section>

        {/* Batch controls */}
        <section className="mb-8">
          <BatchControls />
        </section>

        {/* Main content: table + quick wins */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* Article table */}
          <section>
            <h2 className="text-lg font-semibold text-mh-black mb-4">
              Articles
            </h2>
            <ArticleTable />
          </section>

          {/* Quick wins sidebar */}
          <aside className="xl:mt-10">
            <QuickWinsPanel />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-gray-400">
          <span>SEO Dashboard -- MarketerHire</span>
          <span>Powered by Supabase + Next.js</span>
        </div>
      </footer>
    </>
  );
}
