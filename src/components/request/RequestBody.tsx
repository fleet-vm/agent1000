"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { agentMeta } from "@/data/agents";
import { matchAgents } from "@/lib/match";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TextField } from "@/components/ui/TextField";

export function RequestBody() {
  const searchParams = useSearchParams();
  const task = (searchParams.get("q") ?? "").trim();

  const matches = useMemo(() => matchAgents(task, 3), [task]);
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-8">
      {task ? (
        <>
          <h1 className="text-micro tracking-[0.06em] text-muted uppercase">
            The work you described
          </h1>
          <p className="mt-2 text-body text-ink">{task}</p>
        </>
      ) : (
        <>
          <h1 className="text-head text-ink">Describe the work</h1>
          <p className="mt-1 text-ui text-muted">
            Tell us the task and we will say which agent covers it, or whether
            one has to be built.
          </p>
        </>
      )}

      {task && (
        <section className="mt-8 border-t border-rule pt-4">
          <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
            {matches.length > 0 ? "Closest agents" : "No close match"}
          </h2>

          {matches.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {matches.map((agent) => (
                <li key={agent.slug}>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="block rounded-lg border border-rule bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-signal"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-card font-medium text-ink">
                        {agent.name}
                      </span>
                      <StatusBadge status={agent.status} />
                    </div>
                    <p className="mt-1.5 text-ui text-muted">{agent.summary}</p>
                    <p className="mt-2 text-meta text-muted">
                      {agentMeta(agent)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-body text-ink">
              Nothing in the catalogue covers this yet.{" "}
              <Link href="/agents" className="text-signal hover:underline">
                See all agents
              </Link>
              .
            </p>
          )}
        </section>
      )}

      <section className="mt-8 border-t border-rule pt-4">
        <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
          Have someone contact me
        </h2>

        {sent ? (
          <p className="mt-3 text-body text-ink">
            Nothing was sent. This form is not connected yet — see the README for
            the address it will post to.
          </p>
        ) : (
          <form
            className="mt-3 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: post to [CONTACT] once that address is settled. The site is
              // a static export, so this needs an external form endpoint or a
              // mailto fallback -- there is no route handler to receive it.
              setSent(true);
            }}
          >
            <div>
              <label htmlFor="req-name" className="text-ui text-muted">
                Your name
              </label>
              <TextField id="req-name" name="name" required className="mt-1" />
            </div>

            <div>
              <label htmlFor="req-email" className="text-ui text-muted">
                Work email
              </label>
              <TextField
                id="req-email"
                name="email"
                type="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="req-task" className="text-ui text-muted">
                The work
              </label>
              <textarea
                id="req-task"
                name="task"
                rows={3}
                defaultValue={task}
                className="mt-1 w-full rounded-sm border border-rule bg-surface px-2.5 py-1.5 text-ui text-ink transition-colors duration-150 hover:border-muted focus:border-signal"
              />
            </div>

            <button
              type="submit"
              className="self-start rounded-sm bg-signal px-3.5 py-2 text-ui text-surface"
            >
              Have someone contact me
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
