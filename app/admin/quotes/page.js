import { getQuoteRequests } from "@/lib/db";
import QuotesManager from "@/components/admin/QuotesManager";

export const revalidate = 0; // Disable caching for admin routes

export default async function AdminQuotesPage() {
  const quotes = await getQuoteRequests();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline-md-mobile text-primary font-semibold">B2B Quote Requests</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Manage pricing requests submitted by wholesale buyers directly through the product catalog. Export lists to standard CSV format.
        </p>
      </div>

      <QuotesManager initialQuotes={quotes} />
    </div>
  );
}
