import {
  ApprovalItem,
  EmailPreview,
  NotificationItem,
  PlatformMetric,
  PlatformNavItem,
  PlatformRole,
  QueueItem,
  ReviewFormTemplate,
  WorkflowItem
} from "@/types/platform";

export const platformRoles: { id: PlatformRole; label: string; summary: string }[] = [
  { id: "author", label: "Author", summary: "Submission progress, revision requests, and active article packets." },
  { id: "reviewer", label: "Reviewer", summary: "Assigned manuscripts, scoring forms, and confidential recommendation notes." },
  { id: "managingEditor", label: "Managing Editor", summary: "Workflow orchestration, routing, scheduling, and issue readiness." },
  { id: "chiefEditor", label: "Chief Editor", summary: "Final approvals, high-risk editorial review, and publication sign-off." },
  { id: "productionEditor", label: "Production Editor", summary: "Publication queue, outbound notifications, and delivery quality control." }
];

export const platformNavigation: PlatformNavItem[] = [
  { label: "Dashboard", href: "/platform", roles: ["author", "reviewer", "managingEditor", "chiefEditor", "productionEditor"] },
  { label: "Workflow Detail", href: "/platform/workflows/quantum-sensors-in-noisy-labs", roles: ["author", "reviewer", "managingEditor", "chiefEditor"] },
  { label: "Review Forms", href: "/platform/reviews", roles: ["reviewer", "managingEditor", "chiefEditor"] },
  { label: "Chief Editor", href: "/platform/approvals", roles: ["chiefEditor", "managingEditor"] },
  { label: "Publication Queue", href: "/platform/queue", roles: ["productionEditor", "managingEditor", "chiefEditor"] },
  { label: "Notifications", href: "/platform/notifications", roles: ["author", "reviewer", "managingEditor", "chiefEditor", "productionEditor"] },
  { label: "Email Previews", href: "/platform/email-previews", roles: ["productionEditor", "managingEditor", "chiefEditor"] }
];

export const roleMetrics: Record<PlatformRole, PlatformMetric[]> = {
  author: [
    { label: "Active submissions", value: "04", delta: "+1 this week", tone: "blue" },
    { label: "Awaiting revisions", value: "02", delta: "1 high-priority", tone: "amber" },
    { label: "Accepted pieces", value: "11", delta: "92% completion", tone: "emerald" }
  ],
  reviewer: [
    { label: "Assigned manuscripts", value: "06", delta: "3 due in 48 hours", tone: "cyan" },
    { label: "Completed reviews", value: "28", delta: "Median turnaround 3.2 days", tone: "emerald" },
    { label: "Conflict checks", value: "01", delta: "Awaiting declaration", tone: "amber" }
  ],
  managingEditor: [
    { label: "Live workflows", value: "19", delta: "7 across physics desk", tone: "blue" },
    { label: "Issue-ready articles", value: "08", delta: "2 moved to queue", tone: "emerald" },
    { label: "Delayed tasks", value: "03", delta: "One escalation required", tone: "amber" }
  ],
  chiefEditor: [
    { label: "Pending approvals", value: "05", delta: "2 elevated-risk features", tone: "violet" },
    { label: "Approved today", value: "03", delta: "Queue fully supplied", tone: "emerald" },
    { label: "Editorial holds", value: "01", delta: "Methodology clarification", tone: "amber" }
  ],
  productionEditor: [
    { label: "Scheduled releases", value: "14", delta: "Next issue package in 3 days", tone: "blue" },
    { label: "Ready assets", value: "09", delta: "All covers QC passed", tone: "emerald" },
    { label: "Blocked deliveries", value: "02", delta: "Email proofing required", tone: "amber" }
  ]
};

export const workflowItems: WorkflowItem[] = [
  {
    slug: "quantum-sensors-in-noisy-labs",
    title: "Quantum Sensors in Noisy Laboratories",
    category: "Physics",
    author: "Dr Evelyn Hart",
    status: "under_review",
    priority: "High",
    submittedAt: "2026-03-01",
    updatedAt: "2026-03-06",
    assignedTo: "Noor Ellison",
    summary: "Long-form feature on why practical laboratory conditions are becoming the real bottleneck in quantum sensing.",
    currentStep: "Peer review round two",
    reviewers: ["Prof Elias Mercer", "Dr Hana Vesik"],
    tags: ["Quantum sensing", "Instrumentation", "Cover candidate"],
    timeline: [
      { label: "Submission received", detail: "Author packet validated with references and figure permissions.", date: "1 March 2026", complete: true },
      { label: "Managing editor triage", detail: "Commissioning note approved for review assignment.", date: "2 March 2026", complete: true },
      { label: "Reviewer response", detail: "One reviewer requested clarification on noise characterization claims.", date: "5 March 2026", complete: true },
      { label: "Revision window", detail: "Awaiting updated methods paragraph and figure caption language.", date: "8 March 2026", complete: false }
    ]
  },
  {
    slug: "microscopy-and-the-politics-of-resolution",
    title: "Microscopy and the Politics of Resolution",
    category: "Technology & Innovation",
    author: "Dr Marcus Lee",
    status: "accepted",
    priority: "Standard",
    submittedAt: "2026-01-10",
    updatedAt: "2026-01-18",
    assignedTo: "Helen Ivey",
    summary: "A feature package about image authority, sample preparation, and interpretive risk in advanced microscopy.",
    currentStep: "Approved for production",
    reviewers: ["Dr Marta Volkov"],
    tags: ["Microscopy", "Visual analysis", "Issue 12"],
    timeline: [
      { label: "Submission received", detail: "Feature brief entered the production system.", date: "10 January 2026", complete: true },
      { label: "Review complete", detail: "Scientific reviewer accepted methodological framing.", date: "14 January 2026", complete: true },
      { label: "Editorial polish", detail: "Display deck and image callouts approved.", date: "17 January 2026", complete: true },
      { label: "Queue handoff", detail: "Ready for issue packaging and newsletter promotion.", date: "18 January 2026", complete: true }
    ]
  }
];

export const reviewTemplates: ReviewFormTemplate[] = [
  {
    id: "rf-physics-01",
    title: "Physics Feature Review",
    description: "Structured scoring for long-form features balancing scientific precision, evidence framing, and editorial readability.",
    recommendation: "minor_revision",
    criteria: [
      { label: "Methodological accuracy", score: 4.7, note: "Strong overall, but one claim on environmental noise needs narrowing." },
      { label: "Evidence proportionality", score: 4.4, note: "Well judged, with only minor rhetorical compression in the opening section." },
      { label: "Narrative clarity", score: 4.8, note: "Exceptional pacing and highly readable transitions." }
    ]
  },
  {
    id: "rf-chem-02",
    title: "Chemistry Commentary Review",
    description: "Assessment template for essays involving catalysis, materials claims, and translational chemistry workflows.",
    recommendation: "accept",
    criteria: [
      { label: "Chemical fidelity", score: 4.9, note: "No substantive technical corrections required." },
      { label: "Industrial relevance framing", score: 4.6, note: "Appropriately grounded in scale and process realities." },
      { label: "Reference support", score: 4.8, note: "Citation strategy is clear and proportionate." }
    ]
  }
];

export const approvalItems: ApprovalItem[] = [
  {
    id: "ap-401",
    articleTitle: "Quantum Sensors in Noisy Laboratories",
    section: "Physics",
    leadEditor: "Noor Ellison",
    riskLevel: "Elevated",
    status: "pending-chief-editor",
    deadline: "10 March 2026",
    summary: "Requires final sign-off because the opening argument contrasts benchmark claims with operational reliability in a commercially sensitive area."
  },
  {
    id: "ap-402",
    articleTitle: "Microscopy and the Politics of Resolution",
    section: "Technology & Innovation",
    leadEditor: "Helen Ivey",
    riskLevel: "Routine",
    status: "approved-for-production",
    deadline: "Completed",
    summary: "All methodology caveats integrated. Ready for issue and newsletter packaging."
  },
  {
    id: "ap-403",
    articleTitle: "Battery Interfaces Under Stress",
    section: "Chemistry",
    leadEditor: "Adrian Nash",
    riskLevel: "Sensitive",
    status: "hold",
    deadline: "12 March 2026",
    summary: "Holding for one final source confirmation on industrial degradation pathways before publication."
  }
];

export const publicationQueue: QueueItem[] = [
  {
    id: "q-001",
    title: "Microscopy and the Politics of Resolution",
    destination: "Issue 12 launch package",
    channel: "Website + newsletter",
    publishAt: "11 March 2026, 08:00 GMT",
    owner: "Production desk",
    status: "scheduled"
  },
  {
    id: "q-002",
    title: "Spectroscopy After the Hype",
    destination: "Research summaries rail",
    channel: "Website",
    publishAt: "9 March 2026, 09:30 GMT",
    owner: "Research desk",
    status: "ready"
  },
  {
    id: "q-003",
    title: "Quantum Sensors in Noisy Laboratories",
    destination: "Homepage lead",
    channel: "Website + social teaser",
    publishAt: "Pending approval",
    owner: "Managing editor",
    status: "blocked"
  },
  {
    id: "q-004",
    title: "Issue 12 editor’s note",
    destination: "Issue landing page",
    channel: "Website + email",
    publishAt: "10 March 2026, 07:30 GMT",
    owner: "Chief editor",
    status: "awaiting-assets"
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "n-100",
    title: "Reviewer note returned with one flagged claim",
    body: "Quantum Sensors in Noisy Laboratories needs a revised sentence on operational precision before final acceptance.",
    when: "18 minutes ago",
    audience: ["author", "reviewer", "managingEditor", "chiefEditor"],
    tone: "warning"
  },
  {
    id: "n-101",
    title: "Issue 12 package moved into production readiness",
    body: "Five supporting assets have passed proofing. Remaining dependency is editor’s note image treatment.",
    when: "1 hour ago",
    audience: ["managingEditor", "chiefEditor", "productionEditor"],
    tone: "success"
  },
  {
    id: "n-102",
    title: "Submission desk opened for April features",
    body: "Authors can now pitch April feature packages and laboratory-world essays inside the protected submission flow.",
    when: "Today",
    audience: ["author"],
    tone: "info"
  }
];

export const emailPreviews: EmailPreview[] = [
  {
    slug: "issue-launch-12",
    name: "Issue 12 Launch",
    subject: "Issue 12 is live: Boundaries of Observation",
    preheader: "New features on microscopy, catalytic interfaces, and scientific judgment under uncertainty.",
    audience: "Subscriber newsletter",
    summary: "Launch email for the issue package with lead story, highlights, and editor’s note.",
    bodySections: [
      "Open with a sharp editor’s line that frames observation as both technical and editorial judgment.",
      "Feature the microscopy essay as the primary card with one-line summary and issue CTA.",
      "Close with highlights rail and a short note on upcoming laboratory-world coverage."
    ]
  },
  {
    slug: "revision-request-author",
    name: "Author Revision Request",
    subject: "Revision requested: Quantum Sensors in Noisy Laboratories",
    preheader: "One reviewer request and two line-level editorial refinements are awaiting your response.",
    audience: "Author communication",
    summary: "Operational email that summarises review recommendations and expected turnaround.",
    bodySections: [
      "State the recommendation and deadline in the opening block.",
      "List required changes separately from optional editorial improvements.",
      "Link directly to the workflow detail page and protected submission desk."
    ]
  }
];
