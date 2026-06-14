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
  ArrowRight,
  AlertTriangle,
  Database,
  Key,
  Settings,
  RefreshCw
} from "lucide-react";

export const revalidate = 0; // Disable caching for admin dashboard

export default async function AdminDashboardPage() {
  let products = [];
  let blogPosts = [];
  let inquiries = [];
  let quotes = [];
  let dbError = null;

  try {
    const [_products, _blogPosts, _inquiries, _quotes] = await Promise.all([
      getProducts(true),
      getBlogPosts(true),
      getInquiries(),
      getQuoteRequests()
    ]);
    products = _products;
    blogPosts = _blogPosts;
    inquiries = _inquiries;
    quotes = _quotes;
  } catch (err) {
    console.error("Database fetch error in AdminDashboardPage:", err);
    dbError = err.message || String(err);
  }

  if (dbError) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-8 bg-surface border border-error/20 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 border-b border-error/10 pb-6 mb-6">
          <div className="p-3 bg-error/10 text-error rounded-full animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-headline-md text-error font-bold font-serif text-2xl">Database Connection Error</h2>
            <p className="text-sm text-on-surface-variant mt-1 font-mono">
              The Seven Spice logistics dashboard could not connect to the database.
            </p>
          </div>
        </div>

        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded-md font-mono text-sm mb-8 overflow-x-auto">
          <p className="font-bold mb-1">Diagnostic Log:</p>
          <pre className="whitespace-pre-wrap font-mono text-xs">{dbError}</pre>
        </div>

        <div className="space-y-6">
          <h3 className="font-title-lg text-primary font-bold text-lg">Recommended Resolution Steps</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-on-surface/10 rounded-lg p-5 hover:border-primary/30 transition-all space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Database className="w-4 h-4 text-secondary" />
                <span>1. Verify Turso Database Config</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Confirm your database credentials. Ensure the following environment variables are set in your Vercel Project Settings:
              </p>
              <ul className="text-xs font-mono text-on-surface-variant/80 bg-surface-container p-3 rounded space-y-1.5 border border-on-surface/5">
                <li>TURSO_DATABASE_URL</li>
                <li>TURSO_AUTH_TOKEN</li>
              </ul>
            </div>

            <div className="border border-on-surface/10 rounded-lg p-5 hover:border-primary/30 transition-all space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Key className="w-4 h-4 text-secondary" />
                <span>2. Verify NextAuth Settings</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Authentication requires valid secret/keys. Verify these environment variables are set in Vercel settings:
              </p>
              <ul className="text-xs font-mono text-on-surface-variant/80 bg-surface-container p-3 rounded space-y-1.5 border border-on-surface/5">
                <li>NEXTAUTH_SECRET</li>
                <li>NEXTAUTH_URL</li>
              </ul>
            </div>
          </div>

          <div className="border border-on-surface/10 rounded-lg p-5 hover:border-primary/30 transition-all space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Settings className="w-4 h-4 text-secondary" />
              <span>3. Initialize & Seeding</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              If this is the first time deploying, ensure that your Turso database instance is online and reachable. Next-Auth and DB client will automatically try to create and seed the database tables upon connection.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="/admin/login"
                className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-xs px-4 py-2.5 rounded hover:bg-primary/90 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
