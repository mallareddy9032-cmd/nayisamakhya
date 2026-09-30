export type DeskStatus = "pending" | "approved" | "rejected" | "flagged";

type WithStatus = { status: string };

export function buildDeskCounts(
  items: WithStatus[],
): Record<"all" | DeskStatus, number> {
  return {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
    flagged: items.filter((i) => i.status === "flagged").length,
  };
}
