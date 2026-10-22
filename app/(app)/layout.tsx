import AppShell from "@/components/layouts/AppShell";
import { getSession } from "@/lib/auth-server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <AppShell
      user={
        session
          ? { name: session.name, email: session.email, role: session.role }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
