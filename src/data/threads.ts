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
  | "data"
  | "finance";

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
  /** The beat that follows the thread: what the reader just watched, and why
      it is worth anything. Without these the page is four transcripts in a
      column, and a reader skims the first and scrolls past the rest. */
  takeaway: { title: string; body: string };
  /** Set where the thread belongs to an agent in the catalogue, so the demo
      can link to the page that says what that agent actually is. */
  slug?: string;
  steps: Step[];
};

/* ------------------------------------------------------------------ desks */

export const officeThreads: Thread[] = [
  {
    id: "leavedesk-desk",
    slug: "leavedesk",
    name: "LeaveDesk",
    icon: "people",
    tools: "Persal · Outlook · Teams",
    value:
      "Check the balance, apply the leave policy, and hand the line manager and HR one decision each.",
    title: "Process a leave request",
    takeaway: {
      title: "It works the system, not a spreadsheet about the system",
      body:
        "The agent signed in to Persal, read the real balance and wrote the real record. Nothing was re-keyed into a side file and nothing was exported to be imported later, which is where most automation in an institution quietly goes wrong.",
    },
    steps: [
      { type: "user", text: "Process the leave request from employee 4471, 5 days annual leave, 22 to 26 September.", time: "9:02 AM" },
      { type: "agent", text: "I'll check the balance on Persal, validate it against leave policy, and route it to the line manager and HR before anything is recorded." },
      { type: "connect", system: "Persal" },
      { type: "work", took: "24s", trace: ["Opened the employee record on Persal", "Read the leave balance: 18 days", "Checked the dates against policy: no restricted period, no team-leave overlap"] },
      { type: "agent", text: "The balance covers it, five days of eighteen, and nothing in policy blocks these dates." },
      { type: "gate", title: "Needs the line manager, then HR", body: "Leave needs the line manager's recommendation and HR's approval before it is captured.\n\nSending to M. Dlamini, then HR. Nothing touches Persal until both have signed." },
      { type: "approved", text: "Recommended by M. Dlamini · 9:04 AM · Approved by HR, P. Naidoo · 9:31 AM" },
      { type: "work", took: "11s", trace: ["Captured the leave on Persal, ref LV-4471-0922", "Balance updated, 18 days to 13", "Emailed the employee and notified the team on Teams"] },
      { type: "agent", text: "Captured and confirmed. The record shows M. Dlamini and P. Naidoo signed it, not me." },
      { type: "user", text: "Do this for every leave request that comes in.", time: "9:05 AM" },
      { type: "auto", title: "Process incoming leave requests", body: "On any new request: check the balance, validate policy, route to the line manager and HR, capture once both have signed. Neither step is ever skipped." },
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
    takeaway: {
      title: "Three systems, one answer",
      body:
        "A calendar, a mailbox and a task list are three places to look before seven in the morning. This is one place, and the second request turned it into something nobody has to ask for again.",
    },
    steps: [
      { type: "user", text: "Give me my morning brief.", time: "7:00 AM" },
      { type: "connect", system: "Outlook · Calendar" },
      { type: "work", took: "16s", trace: ["Read today's calendar", "Read the unread mail", "Pulled the open task list"] },
      {
        type: "card",
        title: "Your day, Monday 14 September",
        sections: [
          { heading: "Schedule", lines: ["09:00 Budget review, Boardroom 2", "11:30 Interview panel, IT Officer post", "14:00 Quarterly targets, the DG's office"] },
          { heading: "Needs a reply", lines: ["Treasury, due today at 16:00", "Supplier query, open two days", "Staff bursary query"] },
          { heading: "Open tasks", lines: ["Four open. One overdue: the annual performance plan report."] },
        ],
      },
      { type: "user", text: "Remind me about the ones I still need to answer.", time: "7:02 AM" },
      { type: "auto", title: "Unanswered-email reminder", body: "Twice a day, at 11:00 and 15:00: flag any email older than 24 hours with no reply. The Treasury one is time-critical, so it leads." },
      { type: "user", text: "Send me the brief every weekday at 7am.", time: "7:03 AM" },
      { type: "auto", title: "Daily brief", body: "At 07:00, Monday to Friday: calendar, unread mail and open tasks, in that order." },
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
    takeaway: {
      title: "Your voice, your outbox, your name",
      body:
        "The agent writes; you send. An institution's correspondence is a record that can be produced in an enquiry years later, so the last click stays with the person whose name is at the bottom of it.",
    },
    steps: [
      { type: "user", text: "Draft a reply to the Treasury email about the quarterly submission.", time: "7:05 AM" },
      { type: "agent", text: "I've read the thread. I'll draft a reply confirming the submission and the date. It saves as a draft, and nothing is sent." },
      { type: "connect", system: "Outlook" },
      { type: "work", took: "9s", trace: ["Read the thread back to the original request", "Checked the date against the reporting calendar", "Saved the reply as a draft"] },
      { type: "gate", title: "Draft ready for your review", body: "To: Treasury · Re: Q2 expenditure submission\n\n\"Thank you for the reminder. I confirm our Q2 expenditure report will be submitted via the portal by 16:00 today. The signed CFO cover letter is attached. Please advise if further schedules are required.\"" },
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
    takeaway: {
      title: "Once is a favour. Every Monday is a colleague.",
      body:
        "Every thread here ends with the same move: say it again, and the one-off becomes standing work at a fixed hour. That is the difference between a tool you remember to use and work that simply gets done.",
    },
    steps: [
      { type: "user", text: "Where are we on the departmental website project?", time: "8:10 AM" },
      { type: "connect", system: "ClickUp · SharePoint" },
      { type: "work", took: "31s", trace: ["Pulled the task list from ClickUp", "Read the latest documents on SharePoint", "Compared every due date against today"] },
      {
        type: "card",
        title: "Departmental website status",
        sections: [
          { heading: "Overdue", lines: ["UAT sign-off, two days late, with T. Mokoena"] },
          { heading: "Blocked", lines: ["Content migration, waiting on client approval"] },
          { heading: "On track", lines: ["Everything else. Three items fall due this week."] },
        ],
      },
      { type: "user", text: "Chase the overdue one and flag the blocker to the client.", time: "8:11 AM" },
      { type: "work", took: "7s", trace: ["Messaged T. Mokoena on Teams about the UAT sign-off"] },
      { type: "gate", title: "Draft ready: note to the client", body: "Re: content migration approval\n\n\"To proceed with content migration we need sign-off on the migrated pages. Could you confirm approval by Wednesday so we hold the go-live date?\"" },
      { type: "approved", text: "Approved and sent · 8:12 AM" },
      { type: "agent", text: "Chase sent, client flagged. I'll track both and report back tomorrow." },
      { type: "user", text: "Give me this status every Monday at 8am.", time: "8:12 AM" },
      { type: "auto", title: "Weekly project status", body: "At 08:00 on Mondays: pull the tasks, flag what is overdue and what is blocked, draft the chase-ups for approval." },
    ],
  },
];

/* -------------------------------------------------------------- catalogue */

export const catalogueThreads: Thread[] = [
  {
    id: "leavedesk",
    slug: "leavedesk",
    name: "LeaveDesk",
    icon: "people",
    tools: "Persal · Document management system · Email",
    value:
      "Book leave in one message. It is checked against the determination, then signed by you, your line manager and HR.",
    title: "Book sick leave",
    takeaway: {
      title: "The rules are checked before anyone is asked",
      body:
        "The certificate was read against the dates, the balance against Persal and the eight-week rule against the record before the line manager saw anything. They get one decision to make, not a form to audit. Both signatures the determination asks for were collected, and the agent gave neither.",
    },
    steps: [
      { type: "user", text: "Book sick leave for me, 13 to 15 October. My medical certificate is attached.", time: "7:40 AM" },
      { type: "agent", text: "I'll check it against the leave determination and your balance on Persal, read the certificate, and send it to your line manager. Nothing is captured until your line manager and HR have both signed." },
      { type: "connect", system: "Persal" },
      { type: "work", took: "18s", trace: ["Read the sick-leave balance on Persal: 26 days left in the cycle", "Counted 3 working days, excluding weekends and public holidays", "Read the certificate: issued 13 October, covers 13 to 15 October, name matches", "Checked the eight-week rule: first sick absence in the window"] },
      { type: "card", title: "Leave application SL-2026-0312", sections: [
        { heading: "Leave", lines: ["Sick leave · 3 working days", "Monday 13 to Wednesday 15 October"] },
        { heading: "Balance", lines: ["26 days before, 23 after"] },
        { heading: "Checks", lines: ["Certificate covers the first day of absence", "No overlapping leave", "All checks passed"] },
        { heading: "Route", lines: ["Line manager: M. Dlamini", "Then the HR pool"] },
      ] },
      { type: "gate", title: "Ready for your signature", body: "SL-2026-0312 · Sick leave, 13 to 15 October.\n\nSigning submits it to M. Dlamini, then HR. Nothing touches Persal until both have signed." },
      { type: "approved", text: "Signed and submitted by you · 7:42 AM" },
      { type: "gate", title: "Needs the line manager, then HR", body: "With M. Dlamini for a recommendation, then an HR practitioner approves for the head of department.\n\nEach sees the certificate and the checks, and signs their own decision." },
      { type: "approved", text: "Recommended by M. Dlamini · 9:15 AM · Approved by HR, P. Naidoo · 11:02 AM" },
      { type: "work", took: "9s", trace: ["Captured the leave on Persal against the sick-leave sub-category", "Balance updated, 26 days to 23", "Saved the application pack and the signed Z1 to your file"] },
      { type: "agent", text: "Captured. Your balance is 23 days, and the Z1 is on your file, signed by you, your line manager and HR. Get well soon." },
      { type: "user", text: "Do this whenever I book leave.", time: "11:05 AM" },
      { type: "auto", title: "Book leave on request", body: "On any request: check it against the determination and the balance, read the documents, route to the line manager and HR, capture on Persal once both have signed. Neither signature is ever skipped." },
    ],
  },
  {
    id: "claimsdesk",
    slug: "claimsdesk",
    name: "ClaimsDesk",
    icon: "finance",
    tools: "Travel approvals · Persal · BAS",
    value:
      "A travel claim built from the approved trip and checked receipt by receipt. Finance verifies it and your supervisor approves it.",
    title: "Claim for a work trip",
    takeaway: {
      title: "Finance decides, with the evidence in front of it",
      body:
        "The meal limit, the pro-forma slip and the deadline were caught before the claim left the traveller, so it reached Finance clean. Finance still decided every receipt, and the supervisor still approved the total. The agent applied the rates; it set none of them and signed nothing.",
    },
    steps: [
      { type: "user", text: "Do my travel claim for yesterday's workshop in Polokwane. Receipts attached.", time: "3:10 PM" },
      { type: "agent", text: "I'll build it from your approved travel request, apply the rates and limits in force, and check every receipt. You sign it, Finance verifies it and your supervisor approves it before anything goes to Persal." },
      { type: "connect", system: "Travel approvals" },
      { type: "work", took: "22s", trace: ["Found the approved VA26A for the Polokwane workshop: 06:10 to 19:40, same day", "Under 24 hours away: no daily allowance, three meals claimable", "Read the three receipts against the expense lines", "Checked the claim against the 30-day deadline: 29 days left"] },
      { type: "agent", text: "Two things before you sign. Lunch was R180 against a limit of R170, so I've capped it. And the dinner slip is a pro-forma invoice, not proof of payment." },
      { type: "card", title: "Travel claim TC-2026-0418", sections: [
        { heading: "Trip", lines: ["Polokwane workshop · 14 October · same day"] },
        { heading: "Expenses", lines: ["Breakfast R95", "Lunch R170, capped from R180", "Dinner R150, proof of payment needed"] },
        { heading: "Checks", lines: ["Inside the 30-day deadline", "Every line matches the approved trip"] },
      ] },
      { type: "user", text: "Here's the card slip for dinner.", time: "3:14 PM" },
      { type: "agent", text: "That is proof of payment, and the amount matches. The claim comes to R415." },
      { type: "gate", title: "Ready for your signature", body: "TC-2026-0418 · Polokwane workshop · R415.00\n\nSigning sends it to Finance to verify, then to your supervisor. Nothing is captured until both have signed." },
      { type: "approved", text: "Signed and submitted by you · 3:16 PM" },
      { type: "gate", title: "Needs Finance, then your supervisor", body: "Finance sees each receipt with my findings beside it and decides every one. Your supervisor approves the verified total." },
      { type: "approved", text: "Verified by Finance, S. Khoza · 10:20 AM · Approved by T. Mabena · 1:05 PM" },
      { type: "work", took: "8s", trace: ["Captured the claim on Persal for payment", "Generated the BAS form with every signature and the receipts appended", "Filed it against the trip"] },
      { type: "agent", text: "Captured for payment. The BAS form is on file, signed by you, Finance and your supervisor." },
      { type: "user", text: "Remind me whenever a trip has no claim, a week before the deadline.", time: "1:08 PM" },
      { type: "auto", title: "Claim deadline reminder", body: "Every morning: find approved trips with no claim, and remind the traveller a week before the 30-day deadline. Every claim still goes to Finance and the supervisor." },
    ],
  },
  {
    id: "vulnwatch",
    slug: "vulnwatch",
    name: "VulnWatch",
    icon: "security",
    tools: "Code repositories · Dependency registries",
    value:
      "Know what needs patching before anyone else finds it. The patch waits for an administrator.",
    title: "Patch the citizen portal",
    takeaway: {
      title: "Finding is safe. Fixing is not.",
      body:
        "Scanning and reporting run on standing approval, because they change nothing. The patch is a change, so it stops and waits for an administrator. Same agent, two different permissions, which is what makes standing approval safe to give.",
    },
    steps: [
      { type: "user", text: "What needs patching on the citizen portal this week?", time: "8:00 AM" },
      { type: "agent", text: "Checking the portal's dependencies against the advisory registries. I only report. Nothing gets changed without an administrator approving it." },
      { type: "connect", system: "Code repositories" },
      { type: "work", took: "41s", trace: ["Read the dependency manifest", "Compared it against the advisory registries", "Ranked what it found by severity and exposure"] },
      { type: "agent", text: "The image-processing library is the urgent one. There is a remote-code-execution advisory against the version in use, and the portal's upload form runs through it. The rest can wait for the next maintenance window." },
      { type: "gate", title: "Needs an administrator's approval", body: "Raise the patch to the current release on a branch, for review before merge.\n\nNothing is deployed. The branch sits there until a person merges it." },
      { type: "approved", text: "Approved by N. Khumalo · 8:06 AM" },
      { type: "work", took: "12s", trace: ["Opened a patch branch", "Ran the portal's test suite against it"] },
      { type: "agent", text: "Branch is open and the tests pass. Merging it is still yours." },
      { type: "user", text: "Do this check every morning.", time: "8:07 AM" },
      { type: "auto", title: "Daily dependency check", body: "Every weekday at 06:00: check the portal's dependencies, rank what is urgent, email the administrator. Patches still wait for approval." },
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
    takeaway: {
      title: "Nothing is published by a machine",
      body:
        "The page existed, finished, before anyone approved it. That is deliberate: the officer reviews the real thing rather than a description of it, and their approval is the act that puts it online.",
    },
    steps: [
      { type: "user", text: "Publish the media statement on the new bursary round.", time: "10:12 AM" },
      { type: "agent", text: "I have the statement and the attachment from your email. I'll build the page against the media-release template and hold it as a preview. Nothing goes live until you approve it." },
      { type: "connect", system: "Website CMS" },
      { type: "work", took: "28s", trace: ["Read the emailed statement and its attachment", "Built the page from the media-release template", "Checked the headings, the links and the attached PDF"] },
      { type: "gate", title: "Preview ready for your approval", body: "Media statement · New bursary round opens\n\nStaged, not published. The PDF is linked at the foot of the page and the date line matches the statement." },
      { type: "approved", text: "Approved and published by T. Mokoena · 10:15 AM" },
      { type: "agent", text: "Live, and the link is on its way back to you by email. It went out under your name. The approval is on the record, not mine." },
    ],
  },
  {
    id: "recordsdesk",
    slug: "recordsdesk",
    name: "RecordsDesk",
    icon: "documents",
    tools: "Document management system · Shared mailboxes",
    value:
      "Every letter filed against the right case, and the ambiguous one held back for the clerk.",
    title: "File this morning's registry mail",
    takeaway: {
      title: "It says when it does not know",
      body:
        "An agent that guesses on the ambiguous one is worse than no agent, because you can no longer tell which filings to trust. This one files what is certain and hands over what is not, which is the only version a registry can actually use.",
    },
    steps: [
      { type: "user", text: "File what came into the registry mailbox this morning.", time: "7:40 AM" },
      { type: "agent", text: "Reading the mailbox now. I'll match each item to a case record and show you the match before anything is filed against it." },
      { type: "connect", system: "Document management system" },
      { type: "work", took: "53s", trace: ["Read the registry mailbox", "Matched senders and references against open cases", "Set aside anything without a confident match"] },
      { type: "agent", text: "Most of it matched cleanly. One item is ambiguous: a supplier letter that could belong to either of two open procurement cases." },
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
    takeaway: {
      title: "The same way, every month",
      body:
        "The value here is not speed. It is that the pack is assembled identically each month from identical sources, so when a number moves, the number moved, and not the method.",
    },
    steps: [
      { type: "user", text: "Start the monthly reporting pack for September.", time: "6:02 AM" },
      { type: "agent", text: "Pulling the same sources into the same template as last month. I assemble it. I never submit it." },
      { type: "connect", system: "Reporting database" },
      { type: "work", took: "1m 20s", trace: ["Pulled the month's figures from the reporting database", "Filled the standard template", "Compared every sheet against last month"] },
      { type: "agent", text: "The pack is assembled. One sheet moved sharply against last month, so I've flagged it at the top of the summary rather than letting it pass through quietly." },
      { type: "gate", title: "For the responsible manager to sign off", body: "September reporting pack · the standard set of sheets.\n\nFlagged: the expenditure sheet differs materially from August. Everything else is in line with the trend." },
      { type: "approved", text: "Signed off by M. Dlamini · 9:20 AM" },
      { type: "agent", text: "Signed pack saved and returned to the manager. Submitting it stays a human step." },
      { type: "user", text: "Do this on the first working day of every month.", time: "9:21 AM" },
      { type: "auto", title: "Monthly reporting pack", body: "First working day at 06:00: pull, assemble, compare against last month, send to the responsible manager. Sign-off stays human." },
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
    takeaway: {
      title: "You hear it first",
      body:
        "A lapsed certificate or an altered contact number is found either at five in the morning by an agent, or at nine by a member of the public. Both are notifications. Only one of them is a good morning.",
    },
    steps: [
      { type: "user", text: "Anything wrong with our public sites this morning?", time: "5:30 AM" },
      { type: "agent", text: "Checking each one: whether it answers, what its certificate says, and whether any page changed overnight." },
      { type: "connect", system: "Public websites" },
      { type: "work", took: "19s", trace: ["Requested every public site", "Read the certificate on each host", "Compared the key pages against yesterday"] },
      { type: "agent", text: "Two things. The bursaries site's certificate expires on Friday. And the contact page on the main site changed overnight. A phone number is different." },
      { type: "agent", text: "I've touched neither. Renewing a certificate and changing a page are both administrator work." },
      { type: "user", text: "Warn me the moment a certificate is inside 14 days.", time: "5:33 AM" },
      { type: "auto", title: "Certificate expiry warning", body: "Every morning at 05:00: flag any certificate inside 14 days, and any page that changed without a ticket behind it. Changes still wait for an administrator." },
    ],
  },
];
