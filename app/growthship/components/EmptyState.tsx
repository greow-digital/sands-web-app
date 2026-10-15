export default function EmptyState({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="gs-empty">
      <p>{title}</p>
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}
