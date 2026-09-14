/**
 * Recorded threads -- the demos on `/` and `/use-cases`.
 *
 * These are illustrative, not reports. The content rules in `agents.ts` apply
 * here in full and one of them bites hardest in this file: no client
 * institution is ever named. A thread may name a *system* an institution runs
 * (Persal, ClickUp, a CMS) and it may name a statutory counterparty every
 * department reports to, but the institution in the scenario is always just
 * "the department". Where the source material named one, it has been taken
 * out.
 *
 * Two sets, deliberately different in kind:
 *
 *  - `officeThreads` are the desks -- the everyday administrative work any
 *    institution recognises. They open the site because a reader meets their
 *    own working week in them before they meet a product.
 *  - `catalogueThreads` are the agents in `agents.ts`, one thread each. They
 *    live on `/use-cases`, next to the agent each one belongs to.
 */

export type ThreadIcon =
  | "people"
  | "assistant"
  | "mail"
  | "projects"
  | "security"
  | "publishing"
  | "documents"
  | "data";

export type Step =
  /** The person. Always the only thing on the right-hand side. */
  | { type: "user"; text: string; time: string }
  | { type: "agent"; text: string }
  /** A system the agent reached for, named so the reader can see the blast
      radius of what they would be connecting. */
  | { type: "connect"; system: string }
  /** Work that took time. `trace` is what it actually did, collapsed by
      default -- available to anyone who wants to check, in the way of nobody
      who does not. */
  | { type: "work"; took: string; trace: string[] }
  /** A structured answer: a brief, a status. Prose would bury it. */
  | { type: "card"; title: string; sections: { heading: string; lines: string[] }[] }
  /** The point of the whole site: a binding action, stopped, waiting for a
      named human. */
  | { type: "gate"; title: string; body: string }
  | { type: "approved"; text: string }
  /** A one-off request becoming standing work. */
  | { type: "auto"; title: string; body: string };

export type Thread = {
  id: string;
  name: string;
  icon: ThreadIcon;
  /** What it is connected to, as the reader would name those systems. */
  tools: string;
  /** The outcome, in one line, before the reader watches anything. Written
      verb-first and ending at the approval boundary, because the boundary is
      the thing being sold -- not the automation. */
  value: string;
  title: string;
  /** Set where the thread belongs to an agent in the catalogue, so the demo
      can link to the page that says what that agent actually is. */
  slug?: string;
  steps: Step[];
};

/* ------------------------------------------------------------------ desks */

export const officeThreads: Thread[] = [
  {
    id: "people-desk",
    name: "People Desk",
    icon: "people",
    tools: "Persal · Outlook · Teams",
    value:
      "Check the balance, apply the leave policy, and hand the supervisor one decision to make.",
    title: "Process a leave request",
    steps: [
      { type: "user", text: "Process the leave request from employee 4471 — 5 days annual leave, 22–26 September.", time: "9:02 AM" },
      { type: "agent", text: "I'll check the balance on Persal, validate it against leave policy, and route it to the supervisor before anything is recorded." },
      { type: "connect", system: "Persal" },
      { type: "work", took: "24s", trace: ["Opened the employee record on Persal", "Read the leave balance — 18 days", "Checked the dates against policy: no restricted period, no team-leave overlap"] },
      { type: "agent", text: "The balance covers it — five days of eighteen — and nothing in policy blocks these dates." },
      { type: "gate", title: "Needs your approval", body: "Leave requires supervisor sign-off before it is captured.\n\nSending to M. Dlamini. Nothing touches Persal until they approve." },
      { type: "approved", text: "Approved by M. Dlamini · 9:04 AM" },
      { type: "work", took: "11s", trace: ["Captured the leave on Persal — ref LV-4471-0922", "Balance updated, 18 days to 13", "Emailed the employee and notified the team on Teams"] },
      { type: "agent", text: "Captured and confirmed. The record shows M. Dlamini approved it, not me." },
      { type: "user", text: "Do this for every leave request that comes in.", time: "9:05 AM" },
      { type: "auto", title: "Process incoming leave requests", body: "On any new request — check the balance, validate policy, route to the supervisor, capture once approved. The supervisor step is never skipped." },
    ],
  },
  {
    id: "executive-assistant",
    name: "Executive Assistant",
    icon: "assistant",
    tools: "Outlook · Teams · Calendar",
    value:
      "Your calendar, your unread mail and your open tasks, in one brief, before seven.",
    title: "The morning brief",
    steps: [
      { type: "user", text: "Give me my morning brief.", time: "7:00 AM" },
      { type: "connect", system: "Outlook · Calendar" },
      { type: "work", took: "16s", trace: ["Read today's calendar", "Read the unread mail", "Pulled the open task list"] },
      {
        type: "card",
        title: "Your day — Monday 14 September",
        sections: [
          { heading: "Schedule", lines: ["09:00 — Budget review, Boardroom 2", "11:30 — Interview panel, IT Officer post", "14:00 — Quarterly targets, the DG's office"] },
          { heading: "Needs a reply", lines: ["Treasury — due today at 16:00", "Supplier query — open two days", "Staff bursary query"] },
          { heading: "Open tasks", lines: ["Four open. One overdue: the annual performance plan report."] },
        ],
      },
      { type: "user", text: "Remind me about the ones I still need to answer.", time: "7:02 AM" },
      { type: "auto", title: "Unanswered-email reminder", body: "Twice a day, at 11:00 and 15:00 — flag any email older than 24 hours with no reply. The Treasury one is time-critical, so it leads." },
      { type: "user", text: "Send me the brief every weekday at 7am.", time: "7:03 AM" },
      { type: "auto", title: "Daily brief", body: "At 07:00, Monday to Friday — calendar, unread mail and open tasks, in that order." },
    ],
  },
  {
    id: "correspondence",
    name: "Correspondence",
    icon: "mail",
    tools: "Outlook",
    value:
      "A reply written in your voice, waiting in your drafts. Nothing sends without you.",
    title: "Draft a reply for sign-off",
    steps: [
      { type: "user", text: "Draft a reply to the Treasury email about the quarterly submission.", time: "7:05 AM" },
      { type: "agent", text: "I've read the thread. I'll draft a reply confirming the submission and the date — it saves as a draft, and nothing is sent." },
      { type: "connect", system: "Outlook" },
      { type: "work", took: "9s", trace: ["Read the thread back to the original request", "Checked the date against the reporting calendar", "Saved the reply as a draft"] },
      { type: "gate", title: "Draft ready — for your review", body: "To: Treasury · Re: Q2 expenditure submission\n\n\"Thank you for the reminder. I confirm our Q2 expenditure report will be submitted via the portal by 16:00 today. The signed CFO cover letter is attached. Please advise if further schedules are required.\"" },
      { type: "approved", text: "Approved and sent · 7:06 AM" },
      { type: "agent", text: "Sent, and filed against the thread. Nothing has left your outbox without your sign-off." },
    ],
  },
  {
    id: "project-desk",
    name: "Project Desk",
    icon: "projects",
    tools: "ClickUp · Teams · SharePoint",
    value:
      "What is overdue, what is blocked, and the chase-ups already drafted for approval.",
    title: "Where the project stands",
    steps: [
      { type: "user", text: "Where are we on the departmental website project?", time: "8:10 AM" },
      { type: "connect", system: "ClickUp · SharePoint" },
      { type: "work", took: "31s", trace: ["Pulled the task list from ClickUp", "Read the latest documents on SharePoint", "Compared every due date against today"] },
      {
        type: "card",
        title: "Departmental website — status",
        sections: [
          { heading: "Overdue", lines: ["UAT sign-off — two days late, with T. Mokoena"] },
          { heading: "Blocked", lines: ["Content migration — waiting on client approval"] },
          { heading: "On track", lines: ["Everything else. Three items fall due this week."] },
        ],
      },
      { type: "user", text: "Chase the overdue one and flag the blocker to the client.", time: "8:11 AM" },
      { type: "work", took: "7s", trace: ["Messaged T. Mokoena on Teams about the UAT sign-off"] },
      { type: "gate", title: "Draft ready — note to the client", body: "Re: content migration approval\n\n\"To proceed with content migration we need sign-off on the migrated pages. Could you confirm approval by Wednesday so we hold the go-live date?\"" },
      { type: "approved", text: "Approved and sent · 8:12 AM" },
      { type: "agent", text: "Chase sent, client flagged. I'll track both and report back tomorrow." },
      { type: "user", text: "Give me this status every Monday at 8am.", time: "8:12 AM" },
      { type: "auto", title: "Weekly project status", body: "At 08:00 on Mondays — pull the tasks, flag what is overdue and what is blocked, draft the chase-ups for approval." },
    ],
  },
];

/* -------------------------------------------------------------- catalogue */

export const catalogueThreads: Thread[] = [
  {
    id: "vulnwatch",
    slug: "vulnwatch",
    name: "VulnWatch",
    icon: "security",
    tools: "Code repositories · Dependency registries",
    value:
      "Know what needs patching before anyone else finds it. The patch waits for an administrator.",
    title: "Patch the citizen portal",
    steps: [
      { type: "user", text: "What needs patching on the citizen portal this week?", time: "8:00 AM" },
      { type: "agent", text: "Checking the portal's dependencies against the advisory registries. I only report — nothing gets changed without an administrator approving it." },
      { type: "connect", system: "Code repositories" },
      { type: "work", took: "41s", trace: ["Read the dependency manifest", "Compared it against the advisory registries", "Ranked what it found by severity and exposure"] },
      { type: "agent", text: "The image-processing library is the urgent one — there is a remote-code-execution advisory against the version in use, and the portal's upload form runs through it. The rest can wait for the next maintenance window." },
      { type: "gate", title: "Needs an administrator's approval", body: "Raise the patch to the current release on a branch, for review before merge.\n\nNothing is deployed. The branch sits there until a person merges it." },
      { type: "approved", text: "Approved by N. Khumalo · 8:06 AM" },
      { type: "work", took: "12s", trace: ["Opened a patch branch", "Ran the portal's test suite against it"] },
      { type: "agent", text: "Branch is open and the tests pass. Merging it is still yours." },
      { type: "user", text: "Do this check every morning.", time: "8:07 AM" },
      { type: "auto", title: "Daily dependency check", body: "Every weekday at 06:00 — check the portal's dependencies, rank what is urgent, email the administrator. Patches still wait for approval." },
    ],
  },
  {
    id: "contentdesk",
    slug: "contentdesk",
    name: "ContentDesk",
    icon: "publishing",
    tools: "Website CMS",
    value:
      "An emailed statement becomes a staged page. It goes live when the officer says so.",
    title: "Publish a media statement",
    steps: [
      { type: "user", text: "Publish the media statement on the new bursary round.", time: "10:12 AM" },
      { type: "agent", text: "I have the statement and the attachment from your email. I'll build the page against the media-release template and hold it as a preview — nothing goes live until you approve it." },
      { type: "connect", system: "Website CMS" },
      { type: "work", took: "28s", trace: ["Read the emailed statement and its attachment", "Built the page from the media-release template", "Checked the headings, the links and the attached PDF"] },
      { type: "gate", title: "Preview ready — for your approval", body: "Media statement · New bursary round opens\n\nStaged, not published. The PDF is linked at the foot of the page and the date line matches the statement." },
      { type: "approved", text: "Approved and published by T. Mokoena · 10:15 AM" },
      { type: "agent", text: "Live, and the link is on its way back to you by email. It went out under your name — the approval is on the record, not mine." },
    ],
  },
  {
    id: "recordsdesk",
    slug: "recordsdesk",
    name: "RecordsDesk",
    icon: "documents",
    tools: "Document management system · Shared mailboxes",
    value:
      "Every letter filed against the right case — and the ambiguous one held back for the clerk.",
    title: "File this morning's registry mail",
    steps: [
      { type: "user", text: "File what came into the registry mailbox this morning.", time: "7:40 AM" },
      { type: "agent", text: "Reading the mailbox now. I'll match each item to a case record and show you the match before anything is filed against it." },
      { type: "connect", system: "Document management system" },
      { type: "work", took: "53s", trace: ["Read the registry mailbox", "Matched senders and references against open cases", "Set aside anything without a confident match"] },
      { type: "agent", text: "Most of it matched cleanly. One item is ambiguous — a supplier letter that could belong to either of two open procurement cases." },
      { type: "gate", title: "Needs the registry clerk", body: "Supplier letter, dated 11 September.\n\nThe reference in the subject line points to one case. The sender's earlier correspondence sits on another. I am not guessing between them." },
      { type: "approved", text: "Case confirmed by S. Naidoo · 7:46 AM" },
      { type: "agent", text: "All filed, each against its case record, with a filing note naming who confirmed it." },
    ],
  },
  {
    id: "reportpack",
    slug: "reportpack",
    name: "ReportPack",
    icon: "data",
    tools: "Reporting database · Spreadsheet templates",
    value:
      "The same pack from the same sources every month. Assembled, flagged, never submitted.",
    title: "Assemble the monthly pack",
    steps: [
      { type: "user", text: "Start the monthly reporting pack for September.", time: "6:02 AM" },
      { type: "agent", text: "Pulling the same sources into the same template as last month. I assemble it — I never submit it." },
      { type: "connect", system: "Reporting database" },
      { type: "work", took: "1m 20s", trace: ["Pulled the month's figures from the reporting database", "Filled the standard template", "Compared every sheet against last month"] },
      { type: "agent", text: "The pack is assembled. One sheet moved sharply against last month, so I've flagged it at the top of the summary rather than letting it pass through quietly." },
      { type: "gate", title: "For the responsible manager to sign off", body: "September reporting pack · the standard set of sheets.\n\nFlagged: the expenditure sheet differs materially from August. Everything else is in line with the trend." },
      { type: "approved", text: "Signed off by M. Dlamini · 9:20 AM" },
      { type: "agent", text: "Signed pack saved and returned to the manager. Submitting it stays a human step." },
      { type: "user", text: "Do this on the first working day of every month.", time: "9:21 AM" },
      { type: "auto", title: "Monthly reporting pack", body: "First working day at 06:00 — pull, assemble, compare against last month, send to the responsible manager. Sign-off stays human." },
    ],
  },
  {
    id: "sitewatch",
    slug: "sitewatch",
    name: "SiteWatch",
    icon: "security",
    tools: "Public websites · Certificate authorities",
    value:
      "A certificate expiring, or a page changed overnight. You hear it at 05:00, not from the public.",
    title: "Check the public sites",
    steps: [
      { type: "user", text: "Anything wrong with our public sites this morning?", time: "5:30 AM" },
      { type: "agent", text: "Checking each one — whether it answers, what its certificate says, and whether any page changed overnight." },
      { type: "connect", system: "Public websites" },
      { type: "work", took: "19s", trace: ["Requested every public site", "Read the certificate on each host", "Compared the key pages against yesterday"] },
      { type: "agent", text: "Two things. The bursaries site's certificate expires on Friday. And the contact page on the main site changed overnight — a phone number is different." },
      { type: "agent", text: "I've touched neither. Renewing a certificate and changing a page are both administrator work." },
      { type: "user", text: "Warn me the moment a certificate is inside 14 days.", time: "5:33 AM" },
      { type: "auto", title: "Certificate expiry warning", body: "Every morning at 05:00 — flag any certificate inside 14 days, and any page that changed without a ticket behind it. Changes still wait for an administrator." },
    ],
  },
];
