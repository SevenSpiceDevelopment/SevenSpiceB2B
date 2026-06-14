import Link from "next/link";
import { getProducts, getBlogPosts, getInquiries, getQuoteRequests } from "@/lib/db";
import { 
  Package, 
  FileText, 
  Inbox, 
  ClipboardList, 
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";

export const revalidate = 0; // Disable caching for admin dashboard

export default async function AdminDashboardPage() {
  const [products, blogPosts, inquiries, quotes] = await Promise.all([
    getProducts(true),
    getBlogPosts(true),
    getInquiries(),
    getQuoteRequests()
  ]);

  // Aggregate stats
  const stats = [
    {
      name: "Total Products",
      value: products.length,
      icon: <Package className="text-primary w-6 h-6" />,
      href: "/admin/products",
      color: "bg-primary-fixed text-primary-fixed-dim"
    },
    {
      name: "Total Blog Articles",
      value: blogPosts.length,
      icon: <FileText className="text-secondary w-6 h-6" />,
      href: "/admin/blog",
      color: "bg-secondary-fixed text-secondary-fixed-dim"
    },
    {
      name: "Unread Inquiries",
      value: inquiries.filter(i => i.status === "unread").length,
      icon: <Inbox className="text-primary w-6 h-6" />,
      href: "/admin/inquiries",
      color: "bg-error-container text-on-error-container"
    },
    {
      name: "Pending Quotes",
      value: quotes.filter(q => q.status === "pending").length,
      icon: <ClipboardList className="text-secondary w-6 h-6" />,
      href: "/admin/quotes",
      color: "bg-surface-container-high text-on-surface"
    }
  ];

  // Merge recent activity
  const mergedActivity = [
    ...inquiries.map(i => ({
      id: i.id,
      type: "inquiry",
      title: `Contact Inquiry: ${i.name}`,
      subtitle: `${i.company} • Interested in ${i.product_interest}`,
      date: new Date(i.created_at),
      status: i.status,
      href: "/admin/inquiries"
    })),
    ...quotes.map(q => ({
      id: q.id,
      type: "quote",
      title: `Quote Request: ${q.name}`,
      subtitle: `${q.company} • Vol: ${q.quantity} of ${q.product_name}`,
      date: new Date(q.created_at),
      status: q.status,
      href: "/admin/quotes"
    }))
  ];

  // Sort by date descending and slice top 6
  const recentActivities = mergedActivity
    .sort((a, b) => b.date - a.date)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className="bg-surface border border-on-surface/10 rounded-lg p-6 flex items-center justify-between hover:shadow-sm transition-all shadow-[0_2px_4px_rgba(87,0,19,0.01)]"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono text-on-surface-variant/70 uppercase tracking-wider block">
                {stat.name}
              </span>
              <p className="text-3xl font-bold font-serif text-primary">
                {stat.value}
              </p>
              <Link 
                href={stat.href}
                className="text-xs text-secondary hover:text-primary flex items-center gap-0.5 mt-2 hover:underline font-semibold"
              >
                Manage list <ChevronRight size={12} />
              </Link>
            </div>
            <div className={`p-4 rounded-lg bg-surface-container border border-on-surface/5`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main dashboard content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Recent Activity stream (Takes 7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-on-surface/10 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-on-surface/10 pb-4 mb-4">
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <Clock size={18} className="text-secondary" /> Recent B2B Activities
            </h3>
            <span className="text-xs font-mono bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10">
              Live Stream
            </span>
          </div>

          {recentActivities.length > 0 ? (
            <div className="divide-y divide-on-surface/5">
              {recentActivities.map((act, idx) => {
                const dateStr = act.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 group">
                    <div className="space-y-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded ${
                        act.type === "quote" 
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-primary-container text-on-primary-container"
                      }`}>
                        {act.type}
                      </span>
                      <h4 className="font-semibold text-on-surface text-sm pt-1">
                        {act.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-mono">
                        {act.subtitle}
                      </p>
                      <span className="text-[10px] text-on-surface-variant/60 block font-mono">
                        {dateStr}
                      </span>
                    </div>

                    <Link 
                      href={act.href}
                      className="text-xs border border-on-surface/10 px-3 py-1.5 rounded text-on-surface-variant hover:border-primary hover:text-primary transition-all shrink-0 flex items-center gap-1 font-mono"
                    >
                      Review <ChevronRight size={10} />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-12 text-on-surface-variant/80 text-sm">No recent inquiries or quote requests logged.</p>
          )}
        </div>

        {/* Quick Actions / Sourcing Alerts (Takes 5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-on-surface/10 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-on-surface/10 pb-4 mb-4">
              <TrendingUp size={18} className="text-secondary" />
              <h3 className="font-title-lg text-title-lg text-primary">Logistics Shortcuts</h3>
            </div>
            
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              Quick commands for catalog updates, writing analysis reports, reviewing pending shipments, and changing access keys.
            </p>

            <div className="space-y-3">
              <Link 
                href="/admin/products?new=true"
                className="w-full text-left bg-surface-container hover:bg-surface-container-high px-4 py-3 rounded border border-on-surface/5 text-sm font-semibold text-primary transition-colors flex items-center justify-between"
              >
                <span>Add Product to Catalog</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                href="/admin/blog?new=true"
                className="w-full text-left bg-surface-container hover:bg-surface-container-high px-4 py-3 rounded border border-on-surface/5 text-sm font-semibold text-primary transition-colors flex items-center justify-between"
              >
                <span>Publish New Industry Insight</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                href="/admin/settings"
                className="w-full text-left bg-surface-container hover:bg-surface-container-high px-4 py-3 rounded border border-on-surface/5 text-sm font-semibold text-primary transition-colors flex items-center justify-between"
              >
                <span>Update Contact Details & Social Links</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="border-t border-on-surface/10 pt-4 mt-6 text-xs text-on-surface-variant/70 text-center font-mono">
            Secure admin connection. Active session expires in 24 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
