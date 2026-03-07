export const emailTemplateCatalog = {
  issueLaunch: {
    slug: "issue-launch",
    subject: "Issue {{issueNumber}} is live: {{issueTitle}}",
    preheader: "New reporting, issue highlights, and the editor’s note.",
    bodyText:
      "Issue {{issueNumber}} is now live. Lead with the opening editorial frame, highlight the primary feature, and close with upcoming laboratory-world coverage."
  },
  revisionRequested: {
    slug: "revision-requested",
    subject: "Revision requested: {{articleTitle}}",
    preheader: "Editorial feedback and next steps are now available in your author workspace.",
    bodyText:
      "A revision has been requested for {{articleTitle}}. Please review required changes, optional improvements, and the requested turnaround in the protected platform."
  }
} as const;
