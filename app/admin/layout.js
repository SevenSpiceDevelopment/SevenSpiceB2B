import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import AdminShell from "@/components/AdminShell";

export const metadata = {
  title: "Admin Dashboard | TheSevenSpice",
  description: "Secure B2B admin content management system.",
  robots: "noindex, nofollow"
};

export default function AdminLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <AdminShell>
        {children}
      </AdminShell>
    </SessionProviderWrapper>
  );
}
