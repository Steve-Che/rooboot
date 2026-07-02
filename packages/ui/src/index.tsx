import type { PropsWithChildren } from "react";

export function SectionCard({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-zinc-900">{title}</h3>
      <div className="text-sm text-zinc-700">{children}</div>
    </section>
  );
}
