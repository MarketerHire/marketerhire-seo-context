import type { HealthStatus } from "@/lib/types";

const CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  green: {
    label: "Healthy",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  yellow: {
    label: "Warning",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  red: {
    label: "Critical",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  none: {
    label: "No data",
    bg: "bg-gray-100",
    text: "text-gray-500",
  },
};

interface HealthBadgeProps {
  status: HealthStatus | null | undefined;
}

export default function HealthBadge({ status }: HealthBadgeProps) {
  const cfg = CONFIG[status ?? "none"] ?? CONFIG.none;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "green"
            ? "bg-emerald-500"
            : status === "yellow"
            ? "bg-amber-500"
            : status === "red"
            ? "bg-red-500"
            : "bg-gray-400"
        }`}
      />
      {cfg.label}
    </span>
  );
}
