export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">{eyebrow}</p>
      )}
      <h2 className="line-clamp-2 break-words text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 line-clamp-3 break-words opacity-75 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
