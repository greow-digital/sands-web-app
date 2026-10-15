import Nav from "../Nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gs-shell">
      <Nav />
      <main className="gs-main">{children}</main>
    </div>
  );
}
