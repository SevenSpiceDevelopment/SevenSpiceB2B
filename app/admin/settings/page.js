import { getSiteSettingsFresh } from "@/lib/db";
import SettingsManager from "@/components/admin/SettingsManager";

export const revalidate = 0; // Disable cache for admin routes

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsFresh();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline-md-mobile text-primary font-semibold">General Site Configurations</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Update site branding parameters, change homepage hero content, modify corporate mailing addresses, update social directories, and change admin login passwords.
        </p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
