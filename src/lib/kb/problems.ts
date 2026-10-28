// Splits a merged ticket into the problems its reports describe. causes.ts decides parser vs hint by
// tenant; a report the desk read as a one-day move (desk-notes.json) is a different bug, whatever its tenant.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift' | 'unplaced';

export const PROBLEMS: Record<Problem, string> = {
  parser: 'Day-first dates are parsed month first: day and month swap',
  hint: 'booking-v3 form hint says MM/DD/YYYY, but the form reads day first',
  shift: 'Invite lands one day off (time zone), not swapped',
  unplaced: 'No tenant on file: cause unknown',
};

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = { problem: Problem; reports: Report[]; tenants: number; firstSeen: string; lastSeen: string };

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { rows: number; merged: Report[]; groups: ProblemGroup[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const groups = [...by.entries()]
    .map(([problem, reports]) => {
      const days = reports.map((r) => r.receivedAt.slice(0, 10)).sort();
      return { problem, reports, tenants: new Set(reports.map((r) => r.tenant)).size, firstSeen: days[0], lastSeen: days[days.length - 1] };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { rows: all.length, merged, groups };
}
