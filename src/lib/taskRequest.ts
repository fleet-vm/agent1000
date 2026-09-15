/**
 * "Have someone contact me" from `/request`.
 *
 * Same two delivery paths as the other two forms -- the Worker in `worker/`
 * when `NEXT_PUBLIC_FORM_ENDPOINT` is set, a prefilled `mailto:` otherwise --
 * see `src/lib/demoRequest.ts` for why.
 *
 * It is its own `kind` rather than a demo request with a blank agent: the
 * payload is a described task and the agents the site guessed at, which is a
 * different thing to answer. Whoever picks it up needs to know whether they are
 * booking a demo of something that exists or being asked whether it could.
 */

import { FORM_ENDPOINT, SALES_EMAIL } from "@/lib/demoRequest";

export { FORM_ENDPOINT, SALES_EMAIL };

export type TaskRequest = {
  name: string;
  email: string;
  task: string;
  /**
   * What the matcher put in front of them, comma-separated. Sent because the
   * reply depends on it: "no close match" is a different conversation to "three
   * agents nearly cover this", and the sender cannot be asked what they saw.
   */
  matches: string;
  /** Honeypot. See `worker/src/index.ts`. */
  address: string;
};

/** Newlines flattened and truncated -- it goes in a subject line. */
function taskSummary(task: string): string {
  const flat = task.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  return flat.length > 60 ? `${flat.slice(0, 60)}…` : flat;
}

export function taskSubject(r: TaskRequest): string {
  const summary = taskSummary(r.task);
  return summary ? `Task request: ${summary}` : "Task request";
}

/** Plain text, because it is read in an inbox and nowhere else. */
export function taskBody(r: TaskRequest): string {
  const lines = [`Name: ${r.name}`, `Work email: ${r.email}`];
  if (r.task.trim()) {
    lines.push("", "The work:", r.task.trim());
  }
  lines.push(
    "",
    `Closest agents shown to them: ${r.matches || "none, the matcher found nothing close"}`,
  );
  return lines.join("\n");
}

export function taskMailtoHref(r: TaskRequest): string {
  const query = new URLSearchParams({
    subject: taskSubject(r),
    body: taskBody(r),
  });
  // URLSearchParams encodes spaces as '+', which mail clients render literally
  // in the subject line rather than as spaces.
  return `mailto:${SALES_EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
}

/** Resolves true only on a response the Worker accepted. See postDemoRequest. */
export async function postTaskRequest(r: TaskRequest): Promise<boolean> {
  if (!FORM_ENDPOINT) return false;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind: "task", ...r }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
