interface SummaryCardProps {
  title: string;
  value: string;
  hint: string;
}

export function SummaryCard({ title, value, hint }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p className="muted">{hint}</p>
    </article>
  );
}
