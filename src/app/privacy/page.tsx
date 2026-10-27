import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy notice: Executive Assistant",
  description:
    "What the Executive Assistant can access when an owner connects their Google or Microsoft account, what it does with it, and how to stop it.",
  alternates: { canonical: "/privacy" },
};

const CONTACT = "sales@agent1000.co.za";

/**
 * The privacy notice for the Executive Assistant's Connect Google / Connect
 * Microsoft sign-in. Google's OAuth consent screen links here, and its Limited
 * Use statement below is required wording, so change it only with that in
 * mind. Scoped to the Executive Assistant on purpose: the site-wide notice the
 * /legal stub promises is still the operator's to write.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-[640px] px-6 py-12 text-body text-ink">
          <h1 className="font-display text-head font-semibold tracking-tight">Privacy notice</h1>
          <p className="mt-2 text-meta text-muted">Executive Assistant · last updated 27 October 2026</p>

          <p className="mt-6 text-lede text-muted">
            The Executive Assistant is an Agent1000 agent that works for one person, its owner, in
            their organisation&rsquo;s Rocket.Chat. This notice covers what it can access when the
            owner connects their Google or Microsoft account, what it does with that access, and how
            to stop it.
          </p>

          <Section title="What the owner grants">
            <p>
              When an owner chooses <em>Connect Google</em> or <em>Connect Microsoft</em>, they sign in
              with their own account and approve access to:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li><strong>Email:</strong> reading their inbox and sent mail, and sending email on their behalf.</li>
              <li><strong>Calendar:</strong> reading when they are busy, and creating and changing calendar entries.</li>
              <li><strong>Their email address</strong>, to identify which account was connected.</li>
            </ul>
            <p className="mt-3">Only the owner can grant this access. An administrator cannot grant it for them.</p>
          </Section>

          <Section title="What the assistant does with it">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Reads incoming email</strong> to recognise requests and deadlines, and turns
                them into tasks in the owner&rsquo;s ClickUp workspace.
              </li>
              <li>
                <strong>Reads sent email</strong> only to notice when a task has been done, such as a
                report that was sent, so it can ask the owner whether to close the task.
              </li>
              <li>
                <strong>Reads busy times</strong> to suggest and arrange meetings. When it arranges a
                meeting with another person&rsquo;s assistant it shares <strong>only free and busy
                times</strong>, never meeting titles, attendees, locations or descriptions.
              </li>
              <li>
                <strong>Writes calendar entries</strong> it was asked to: tentative holds while a
                meeting is being arranged, confirmed meetings, and leave the owner declared. A hold is
                removed if the meeting does not go ahead.
              </li>
              <li>
                <strong>Sends email only with the owner&rsquo;s approval.</strong> It drafts the
                message, shows the owner the recipients and the wording in their Rocket.Chat direct
                message, and sends only what they approve. It never sends email on its own.
              </li>
            </ul>
          </Section>

          <Section title="Artificial intelligence">
            <p>
              To recognise requests in email, and in documents the owner shares with it, the assistant
              sends the relevant text to an AI model (Claude, provided by Anthropic) for analysis. This
              is used only to provide the assistant&rsquo;s features to its owner. Data obtained
              through Google or Microsoft is <strong>not</strong> used to train or improve AI models,
              ours or anyone else&rsquo;s.
            </p>
          </Section>

          <Section title="What is stored, and where">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Access tokens</strong> issued by Google or Microsoft, so the assistant can work
                while the owner is away. The owner&rsquo;s password is never seen or stored.
              </li>
              <li>
                <strong>Tasks and reminders</strong> it created, the state of meetings it is
                arranging, and an activity log of what it did and when.
              </li>
              <li>
                No copy of the owner&rsquo;s mailbox or calendar is kept. Email is read as it arrives,
                and only what a task needs, such as its title and due date, is kept.
              </li>
            </ul>
            <p className="mt-3">
              Everything is stored on Agent1000&rsquo;s own server in Microsoft Azure&rsquo;s South
              Africa North region, and only the administrators who operate the service can reach it.
            </p>
          </Section>

          <Section title="Sharing">
            <p>
              Data obtained through Google or Microsoft is not sold, not used for advertising, and not
              shared except as described here: task details go to the owner&rsquo;s ClickUp
              workspace; free and busy times go to another person&rsquo;s assistant when a meeting is
              being arranged; text for analysis goes to Anthropic as described above; and anything
              the law requires.
            </p>
          </Section>

          <Section title="Google user data">
            <p>
              The Executive Assistant&rsquo;s use and transfer to any other app of information
              received from Google APIs will adhere to the{" "}
              <a
                className="text-signal underline"
                href="https://developers.google.com/terms/api-services-user-data-policy"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </Section>

          <Section title="Stopping access and deleting data">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Revoke access at any time</strong> from your account: Google at{" "}
                <a className="text-signal underline" href="https://myaccount.google.com/permissions">
                  myaccount.google.com/permissions
                </a>
                ; Microsoft at{" "}
                <a className="text-signal underline" href="https://myapps.microsoft.com">
                  myapps.microsoft.com
                </a>{" "}
                for work accounts or{" "}
                <a className="text-signal underline" href="https://account.live.com/consent/Manage">
                  account.live.com/consent/Manage
                </a>{" "}
                for personal accounts. The assistant stops reading and writing straight away.
              </li>
              <li>
                <strong>Ask for removal</strong> by writing to us. Removing an assistant deletes its
                stored access tokens and stops all access. The activity log is kept as the record of
                what the assistant did.
              </li>
            </ul>
          </Section>

          <Section title="Contact">
            <p>
              Questions or requests:{" "}
              <a className="text-signal underline" href={`mailto:${CONTACT}`}>
                {CONTACT}
              </a>
              .
            </p>
          </Section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-card font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-muted">{children}</div>
    </section>
  );
}
