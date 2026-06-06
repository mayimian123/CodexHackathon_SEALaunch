import type { DepartmentResult } from "@/lib/types";
import { StatusText } from "./status";

export function DeptRow({
  index,
  dept,
  onClick,
  active,
}: {
  index: number;
  dept: DepartmentResult;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-8 border-t hairline py-5 text-left last:border-b"
    >
      <span className="font-mono text-sm text-ink-faint w-9 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`font-display text-2xl font-semibold tracking-tight w-56 shrink-0 transition-colors group-hover:text-orange ${
          active ? "text-orange" : "text-ink"
        }`}
      >
        {dept.shortName}
      </span>
      <span className="font-display text-lg font-light italic text-ink-soft flex-1">
        {dept.question}
      </span>
      <StatusText status={dept.status} />
    </button>
  );
}
