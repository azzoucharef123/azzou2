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

export const platformRoles = [
  {
    id: "author" as PlatformRole,
    label: "Author",
    summary: "Submission progress, revision requests, and active article packets.",
    viewableBy: ["author", "editor"] as PlatformRole[]
  },
  {
    id: "editor" as PlatformRole,
    label: "Editor",
    summary: "Workflow orchestration, article management, publication scheduling, and editorial decision-making.",
    viewableBy: ["editor"] as PlatformRole[]
  }
];

export const platformNavigation: PlatformNavItem[] = [
  { label: "Dashboard", href: "/platform", roles: ["author", "editor"] },
  { label: "Submission Board", href: "/platform/reviews", roles: ["editor"] },
  { label: "Editorial Decisions", href: "/platform/approvals", roles: ["editor"] },
  { label: "Publication Queue", href: "/platform/queue", roles: ["editor"] },
  { label: "Notifications", href: "/platform/notifications", roles: ["author", "editor"] },
  { label: "Email Briefs", href: "/platform/email-previews", roles: ["editor"] },
  { label: "Accepted Manuscripts", href: "/platform/accepted", roles: ["editor"] },
  { label: "Accepted Articles", href: "/platform/author/accepted", roles: ["author"] }
];

export const roleMetrics: Record<PlatformRole, PlatformMetric[]> = {
  author: [
    { label: "My submissions", value: "04", delta: "1 updated this week", tone: "blue" },
    { label: "Pending decisions", value: "02", delta: "Editorial review in progress", tone: "amber" },
    { label: "Accepted articles", value: "02", delta: "Ready for publication", tone: "emerald" }
  ],
  editor: [
    { label: "Pending submissions", value: "09", delta: "Needs editorial triage", tone: "amber" },
    { label: "Under review", value: "05", delta: "Active assessment", tone: "blue" },
    { label: "Published this cycle", value: "06", delta: "Across current issue lanes", tone: "emerald" }
  ]
};

export const workflowItems: WorkflowItem[] = [
  {
    id: "wf-qsnl",
    slug: "quantum-sensors-in-noisy-labs",
    title: "Quantum Sensors in Noisy Laboratories",
    category: "Physics",
    categorySlug: "physics",
    author: "Dr Evelyn Hart",
    authorId: "author-fallback",
    status: "under_review",
    priority: "High",
    submittedAt: "2026-03-01",
    updatedAt: "2026-03-06",
    assignedTo: "Noor Ellison",
    summary: "Long-form feature on why practical laboratory conditions are becoming the real bottleneck in quantum sensing.",
    currentStep: "Editorial assessment underway",
    assignedEditors: ["Noor Ellison"],
    tags: ["Quantum sensing", "Instrumentation", "Cover candidate"],
    timeline: [
      { label: "Submission received", detail: "Author packet validated with references and figure permissions.", date: "1 March 2026", complete: true },
      { label: "Editorial triage", detail: "Commissioning note approved for internal review assignment.", date: "2 March 2026", complete: true },
      { label: "Editorial assessment", detail: "Lead editor requested clarification on noise characterization claims.", date: "5 March 2026", complete: true },
      { label: "Revision window", detail: "Awaiting updated methods paragraph and figure caption language.", date: "8 March 2026", complete: false }
    ]
  },
  {
    id: "wf-mar",
    slug: "microscopy-and-the-politics-of-resolution",
    title: "Microscopy and the Politics of Resolution",
    category: "Technology & Innovation",
    categorySlug: "technology-innovation",
    author: "Dr Marcus Lee",
    status: "accepted",
    priority: "Standard",
    submittedAt: "2026-01-10",
    updatedAt: "2026-01-18",
    assignedTo: "Helen Ivey",
    summary: "A feature package about image authority, sample preparation, and interpretive risk in advanced microscopy.",
    currentStep: "Accepted and queued for issue packaging",
    assignedEditors: ["Helen Ivey"],
    tags: ["Microscopy", "Visual analysis", "Issue 12"],
    timeline: [
      { label: "Submission received", detail: "Feature brief entered the production system.", date: "10 January 2026", complete: true },
      { label: "Editorial review complete", detail: "Internal editorial review accepted the methodological framing.", date: "14 January 2026", complete: true },
      { label: "Editorial polish", detail: "Display deck and image callouts approved.", date: "17 January 2026", complete: true },
      { label: "Queue handoff", detail: "Ready for issue packaging and newsletter promotion.", date: "18 January 2026", complete: true }
    ]
  },
  {
    id: "wf-bi",
    slug: "battery-interfaces-under-stress",
    title: "Battery Interfaces Under Stress",
    category: "Chemistry",
    categorySlug: "chemistry",
    author: "Dr Evelyn Hart",
    authorId: "author-fallback",
    status: "submitted",
    priority: "Standard",
    submittedAt: "2026-03-04",
    updatedAt: "2026-03-07",
    assignedTo: "Editorial desk",
    summary: "Analysis of degradation pathways at battery interfaces and how lab evidence translates into industrial claims.",
    currentStep: "Awaiting editorial triage",
    assignedEditors: ["Noor Ellison"],
    tags: ["Electrochemistry", "Batteries", "Materials"],
    timeline: [
      { label: "Draft finalised", detail: "The author completed the submission packet with references and figures.", date: "4 March 2026", complete: true },
      { label: "Submission received", detail: "The manuscript entered the editorial pipeline for first-pass review.", date: "5 March 2026", complete: true },
      { label: "Initial editorial triage", detail: "Awaiting assignment to the chemistry desk editor.", date: "7 March 2026", complete: false }
    ]
  },
  {
    id: "wf-sah",
    slug: "spectroscopy-after-the-hype",
    title: "Spectroscopy After the Hype",
    category: "Research Summaries",
    categorySlug: "research-summaries",
    author: "Dr Evelyn Hart",
    authorId: "author-fallback",
    status: "rejected",
    priority: "Low",
    submittedAt: "2026-02-11",
    updatedAt: "2026-02-15",
    assignedTo: "Noor Ellison",
    summary: "A concise feature examining which spectroscopy claims survive contact with production environments.",
    currentStep: "Rejected after editorial review",
    assignedEditors: ["Noor Ellison"],
    tags: ["Spectroscopy", "Instrumentation"],
    timeline: [
      { label: "Submission received", detail: "Article packet entered the editorial queue.", date: "11 February 2026", complete: true },
      { label: "Editorial assessment", detail: "The desk requested a narrower angle and stronger source support.", date: "13 February 2026", complete: true },
      { label: "Decision issued", detail: "The feature was declined for publication in its current form.", date: "15 February 2026", complete: true }
    ]
  },
  {
    id: "wf-ppl",
    slug: "particle-probes-in-liquid-media",
    title: "Particle Probes in Liquid Media",
    category: "Physics",
    categorySlug: "physics",
    author: "Dr Marcus Lee",
    status: "published",
    priority: "Standard",
    submittedAt: "2026-01-02",
    updatedAt: "2026-01-29",
    assignedTo: "Helen Ivey",
    summary: "Feature coverage on liquid-phase measurement constraints and why instrumentation claims need tighter reporting language.",
    currentStep: "Published",
    assignedEditors: ["Helen Ivey"],
    tags: ["Measurement", "Instrumentation", "Issue 11"],
    timeline: [
      { label: "Submission received", detail: "The article entered the January issue pipeline.", date: "2 January 2026", complete: true },
      { label: "Editorial development", detail: "The methods section and framing were refined for clarity.", date: "9 January 2026", complete: true },
      { label: "Accepted", detail: "The final package was approved for publication.", date: "18 January 2026", complete: true },
      { label: "Published", detail: "The article went live on the website and issue page.", date: "29 January 2026", complete: true }
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
    status: "pending",
    deadline: "10 March 2026",
    summary: "Awaiting the final editor decision on evidence framing before the article can move into the accepted lane."
  },
  {
    id: "ap-402",
    articleTitle: "Microscopy and the Politics of Resolution",
    section: "Technology & Innovation",
    leadEditor: "Helen Ivey",
    riskLevel: "Routine",
    status: "accepted",
    deadline: "Completed",
    summary: "All methodology caveats integrated. Ready for issue and newsletter packaging."
  },
  {
    id: "ap-403",
    articleTitle: "Battery Interfaces Under Stress",
    section: "Chemistry",
    leadEditor: "Adrian Nash",
    riskLevel: "Sensitive",
    status: "rejected",
    deadline: "12 March 2026",
    summary: "Rejected after editorial screening because the industrial claims currently outpace the supporting evidence."
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
    owner: "Editor",
    status: "blocked"
  },
  {
    id: "q-004",
    title: "Issue 12 editor’s note",
    destination: "Issue landing page",
    channel: "Website + email",
    publishAt: "10 March 2026, 07:30 GMT",
    owner: "Editor",
    status: "awaiting-assets"
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "n-100",
    title: "Editorial note returned with one flagged claim",
    body: "Quantum Sensors in Noisy Laboratories needs a revised sentence on operational precision before final acceptance.",
    when: "18 minutes ago",
    audience: ["author", "editor"],
    tone: "warning"
  },
  {
    id: "n-101",
    title: "Issue 12 package moved into production readiness",
    body: "Five supporting assets have passed proofing. Remaining dependency is editor’s note image treatment.",
    when: "1 hour ago",
    audience: ["editor"],
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
    preheader: "One editorial request and two line-level refinements are awaiting your response.",
    audience: "Author communication",
    summary: "Operational email that summarises review recommendations and expected turnaround.",
    bodySections: [
      "State the recommendation and deadline in the opening block.",
      "List required changes separately from optional editorial improvements.",
      "Link directly to the workflow detail page and protected submission desk."
    ]
  }
];
