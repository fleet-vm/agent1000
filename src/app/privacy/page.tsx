import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How Agent1000 handles personal information: on this website, in the work our agents do for institutions, and when someone connects their Google or Microsoft account.",
  alternates: { canonical: "/privacy" },
};

const CONTACT = "sales@agent1000.co.za";

/**
 * The platform's privacy notice. Google's OAuth consent screen for the
 * Executive Assistant's Connect Google links here, so the "Google user data"
 * section carries required Limited Use wording: change it only with that in
 * mind. Every claim below is checked against what the system actually does --
 * the forms Worker stores nothing, the site sets no cookies and runs no
 * analytics, agents are hosted in Azure South Africa North, and model calls go
 * to Anthropic. If one of those changes, this page changes with it.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-[640px] px-6 py-12 text-body text-ink">
          <h1 className="font-display text-head font-semibold tracking-tight">Privacy notice</h1>
          <p className="mt-2 text-meta text-muted">Agent1000 · last updated 27 October 2026</p>

          <p className="mt-6 text-lede text-muted">
            Agent1000 provides AI agents that do repetitive work for South African public
            institutions, with a named official approving every binding action. This notice explains
            what personal information we handle, why, where it is kept, and the choices you have.
          </p>

          <Section title="Who this covers">
            <ul className="list-disc space-y-2 pl-6">
              <li><strong>Visitors to this website</strong>, including anyone who requests a demo or applies to resell.</li>
              <li>
                <strong>People whose information our agents handle</strong> while working for an
                institution: its staff, the officials who approve the agents&rsquo; work, and members
                of the public who write to it.
              </li>
              <li>
                <strong>People who connect their own account</strong> to an agent, such as an owner
                connecting Google or Microsoft to their Executive Assistant.
              </li>
            </ul>
          </Section>

          <Section title="This website">
            <p>
              The site sets no cookies and runs no analytics or advertising trackers. If you request a
              demo or apply to resell, the form sends what you typed (your name, email address,
              institution or company, phone number and message) by email to our sales inbox. The
              service that forwards it keeps no copy. We use it only to reply to you.
            </p>
          </Section>

          <Section title="The work agents do for institutions">
            <p>
              An institution decides what its agents do and which of its systems they work in: email,
              WhatsApp, Rocket.Chat, a web console, a payroll or leave portal, a website content
              system, a task list. In doing that work an agent reads and writes the information those
              systems hold, which can include names, contact details, leave and claim records, and
              correspondence.
            </p>
            <p className="mt-3">
              We process that information on the institution&rsquo;s behalf and on its instructions,
              only to do the work it has asked for. The institution remains responsible for it, and
              questions about a particular record are best taken to the institution first.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>A person approves every binding action.</strong> An agent stops before
                anything is sent, published, captured or changed, and waits for a named official.
              </li>
              <li>
                <strong>Every approval is logged</strong> against the person who gave it, with what
                was approved and when. The log is kept as the record of the work.
              </li>
              <li>
                <strong>Access is limited</strong> to what each agent needs for its work, using
                credentials the institution or the account holder grants and can withdraw.
              </li>
            </ul>
          </Section>

          <Section title="Connected Google and Microsoft accounts">
            <p>
              Some agents, such as the Executive Assistant, work for one person. That person can choose{" "}
              <em>Connect Google</em> or <em>Connect Microsoft</em>, sign in with their own account,
              and approve access to their email and calendar. Only they can grant it. With that access
              the agent:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>reads incoming email to recognise requests and deadlines and turn them into tasks;</li>
              <li>reads sent email only to notice when a task has been done;</li>
              <li>
                reads busy times to arrange meetings, and when it arranges one with another
                person&rsquo;s agent it shares <strong>only free and busy times</strong>, never
                meeting titles, attendees, locations or descriptions;
              </li>
              <li>writes the calendar entries it was asked to: holds, confirmed meetings and declared leave;</li>
              <li>
                sends email <strong>only after the owner approves</strong> the recipients and the
                wording, and never on its own.
              </li>
            </ul>
            <p className="mt-3">
              The agent keeps the access tokens Google or Microsoft issue, so it can work while the
              owner is away. It never sees or stores the owner&rsquo;s password, and it keeps no copy
              of the mailbox or calendar: only what a task needs, such as its title and due date.
            </p>
          </Section>

          <Section title="Google user data">
            <p>
              Agent1000&rsquo;s use and transfer to any other app of information received from Google
              APIs will adhere to the{" "}
              <a
                className="text-signal underline"
                href="https://developers.google.com/terms/api-services-user-data-policy"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </Section>

          <Section title="Artificial intelligence">
            <p>
              Agents use an AI model (Claude, provided by Anthropic) to read and draft text: to
              recognise what an email or document is asking for, and to prepare work for a person to
              approve. The relevant text is sent to the model for that purpose only. Information our
              agents handle, including data obtained through Google or Microsoft, is{" "}
              <strong>not</strong> used to train or improve AI models, ours or anyone else&rsquo;s.
            </p>
          </Section>

          <Section title="Where information is kept">
            <p>
              The agents run on Agent1000&rsquo;s own servers in Microsoft Azure&rsquo;s South Africa
              North region. Credentials are kept there with access restricted to the administrators
              who operate the service, and are deleted when an agent is removed.
            </p>
          </Section>

          <Section title="Sharing">
            <p>
              We do not sell personal information or use it for advertising. We share it only as this
              notice describes: with the systems an institution has told its agents to work in; with
              another person&rsquo;s agent, limited to free and busy times, when arranging a meeting;
              with Anthropic, for the analysis described above; with the services that carry our email;
              and where the law requires it.
            </p>
          </Section>

          <Section title="Your choices and rights">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Revoke a connected account</strong> at any time: Google at{" "}
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
                for personal accounts. The agent stops reading and writing straight away.
              </li>
              <li>
                <strong>Ask what we hold, or ask us to correct or delete it.</strong> Under the
                Protection of Personal Information Act you may request access to, correction of, or
                deletion of your personal information, and object to how it is processed. Where we hold
                it for an institution, we will work with that institution on your request.
              </li>
              <li>
                <strong>Complain to the Information Regulator</strong> if you are not satisfied with
                how we have handled your information.
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
