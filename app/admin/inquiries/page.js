import { getInquiries } from "@/lib/db";
import InquiriesManager from "@/components/admin/InquiriesManager";

export const revalidate = 0; // Disable caching for admin routes

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline-md-mobile text-primary font-semibold">B2B Wholesale Inquiries</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Review general sales messages, corporate proposals, and blending requests submitted via public contact pages.
        </p>
      </div>

      <InquiriesManager initialInquiries={inquiries} />
    </div>
  );
}
