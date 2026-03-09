import { PrismaClient, UserRole, ArticleStatus, ReviewRecommendation, NotificationType } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const sampleUsers = [
  { email: "author@microscope-magazine.com", password: "Author123!", fullName: "Dr Evelyn Hart", role: UserRole.author },
  { email: "azzoucharef3@gmail.com", password: "Editor123!", fullName: "Azzou Charef", role: UserRole.editor },
  { email: "editor@microscope-magazine.com", password: "Editor123!", fullName: "Noor Ellison", role: UserRole.editor }
];

function looksLikePlaceholder(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;

  if (normalized.includes("example.com") || normalized.includes("example.org") || normalized.includes("example.net")) {
    return true;
  }

  return [
    "changeme",
    "change-me",
    "replace-me",
    "replace_this",
    "replace-this",
    "your-",
    "your_",
    "todo",
    "tbd",
    "placeholder",
    "<password>",
    "<your",
    "${",
    "xxx",
    "xxxx",
    "000000"
  ].some((token) => normalized.includes(token));
}

function toInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function createSupabaseSeedUsers() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    return new Map<string, string>();
  }

  if (looksLikePlaceholder(url) || looksLikePlaceholder(serviceRole)) {
    return new Map<string, string>();
  }

  const supabase = createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = new Map<string, string>();

  for (const user of sampleUsers) {
    const existing = await supabase.auth.admin.listUsers();
    const match = existing.data.users.find((candidate) => candidate.email === user.email);

    if (match) {
      results.set(user.email, match.id);
      continue;
    }

    const created = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.fullName,
        role: user.role
      }
    });

    if (created.data.user) {
      results.set(user.email, created.data.user.id);
    }
  }

  return results;
}

async function main() {
  const authUsers = await createSupabaseSeedUsers();

  const categories = [
    { slug: "physics", name: "Physics", accent: "Wave Mechanics", intro: "Reporting and essays across fundamental and applied physics." },
    { slug: "chemistry", name: "Chemistry", accent: "Reaction Pathways", intro: "Scientific reporting rooted in molecular systems and chemical method." },
    { slug: "research-summaries", name: "Research Summaries", accent: "Journal Watch", intro: "Condensed analysis of new scientific papers and review findings." }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const tags = ["quantum-sensing", "instrumentation", "microscopy", "materials", "editorial"];

  for (const slug of tags) {
    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: slug
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      }
    });
  }

  const profiles = new Map<UserRole, string>();

  for (const user of sampleUsers) {
    const authUserId =
      authUsers.get(user.email) ??
      ({
        author: "11111111-1111-1111-1111-111111111111",
        editor: user.email === "azzoucharef3@gmail.com" ? "33333333-3333-3333-3333-333333333333" : "66666666-6666-6666-6666-666666666666"
      }[user.role] as string);

    const profile = await prisma.profile.upsert({
      where: { authUserId },
      update: {
        email: user.email,
        fullName: user.fullName,
        initials: toInitials(user.fullName),
        primaryRole: user.role,
        capabilities: user.role === UserRole.editor ? ["MANAGE_WORKFLOWS", "MANAGE_QUEUE", "MANAGE_EMAILS"] : []
      },
      create: {
        authUserId,
        email: user.email,
        fullName: user.fullName,
        initials: toInitials(user.fullName),
        primaryRole: user.role,
        capabilities: user.role === UserRole.editor ? ["MANAGE_WORKFLOWS", "MANAGE_QUEUE", "MANAGE_EMAILS"] : []
      }
    });

    profiles.set(user.role, profile.id);
  }

  const physicsCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "physics" } });
  const researchCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "research-summaries" } });
  const authorId = profiles.get(UserRole.author)!;
  const editorId = profiles.get(UserRole.editor)!;

  const quantumArticle = await prisma.article.upsert({
    where: { slug: "quantum-sensors-in-noisy-labs" },
    update: {
      title: "Quantum Sensors in Noisy Laboratories",
      status: ArticleStatus.under_review,
      authorId,
      categoryId: physicsCategory.id,
      excerpt: "Why practical laboratory noise has become the real bottleneck in quantum sensing.",
      subtitle: "Operational reliability, not benchmark spectacle, is the harder frontier.",
      coverMotif: "waveform",
      coverTone: "blue"
    },
    create: {
      slug: "quantum-sensors-in-noisy-labs",
      title: "Quantum Sensors in Noisy Laboratories",
      status: ArticleStatus.under_review,
      authorId,
      categoryId: physicsCategory.id,
      excerpt: "Why practical laboratory noise has become the real bottleneck in quantum sensing.",
      subtitle: "Operational reliability, not benchmark spectacle, is the harder frontier.",
      coverMotif: "waveform",
      coverTone: "blue"
    }
  });

  await prisma.articleVersion.upsert({
    where: {
      articleId_versionNumber: {
        articleId: quantumArticle.id,
        versionNumber: 1
      }
    },
    update: {
      isCurrent: true,
      title: quantumArticle.title,
      subtitle: quantumArticle.subtitle,
      excerpt: quantumArticle.excerpt,
      bodyJson: {
        sections: [
          {
            id: "lead",
            title: "From benchmark precision to laboratory reality",
            paragraphs: [
              "Quantum sensors promise extraordinary sensitivity, but operating stability remains the decisive challenge in real laboratories."
            ]
          }
        ]
      },
      referencesJson: ["Hart, E. et al. Laboratory quantum sensing review (2025)."]
    },
    create: {
      articleId: quantumArticle.id,
      versionNumber: 1,
      title: quantumArticle.title,
      subtitle: quantumArticle.subtitle,
      excerpt: quantumArticle.excerpt,
      bodyJson: {
        sections: [
          {
            id: "lead",
            title: "From benchmark precision to laboratory reality",
            paragraphs: [
              "Quantum sensors promise extraordinary sensitivity, but operating stability remains the decisive challenge in real laboratories."
            ]
          }
        ]
      },
      referencesJson: ["Hart, E. et al. Laboratory quantum sensing review (2025)."],
      createdById: authorId,
      isCurrent: true
    }
  });

  await prisma.submission.createMany({
    data: [
      {
        articleId: quantumArticle.id,
        submittedById: authorId,
        submissionType: "initial",
        coverLetter: "Initial feature submission for the March editorial review cycle."
      }
    ],
    skipDuplicates: true
  });

  await prisma.articleStatusHistory.createMany({
    data: [
      { articleId: quantumArticle.id, actorId: authorId, toStatus: ArticleStatus.draft, note: "Draft created." },
      { articleId: quantumArticle.id, actorId: authorId, fromStatus: ArticleStatus.draft, toStatus: ArticleStatus.submitted, note: "Submitted for review." },
      {
        articleId: quantumArticle.id,
        actorId: editorId,
        fromStatus: ArticleStatus.submitted,
        toStatus: ArticleStatus.under_review,
        note: "Lead editor moved the article into the active review lane."
      }
    ],
    skipDuplicates: true
  });

  const assignment = await prisma.reviewerAssignment.upsert({
    where: {
      articleId_reviewerId: {
        articleId: quantumArticle.id,
        reviewerId: editorId
      }
    },
    update: {
      assignedById: editorId
    },
    create: {
      articleId: quantumArticle.id,
      reviewerId: editorId,
      assignedById: editorId,
      dueAt: new Date("2026-03-12T12:00:00Z")
    }
  });

  await prisma.review.upsert({
    where: {
      assignmentId: assignment.id
    },
    update: {
      recommendation: ReviewRecommendation.minor_revision,
      summary: "Strong methods framing with one section that needs narrower claims around operational precision."
    },
    create: {
      assignmentId: assignment.id,
      articleId: quantumArticle.id,
      reviewerId: editorId,
      recommendation: ReviewRecommendation.minor_revision,
      summary: "Strong methods framing with one section that needs narrower claims around operational precision.",
      confidentialNote: "Narrative opening is excellent. One claim needs tempering."
    }
  });

  await prisma.editorialNote.createMany({
    data: [
      {
        articleId: quantumArticle.id,
        authorId: editorId,
        title: "Revision request",
        body: "Tighten the paragraph on environmental noise and add one clarifying line on instrument calibration.",
        isInternal: false
      }
    ],
    skipDuplicates: true
  });

  const researchArticle = await prisma.article.upsert({
    where: { slug: "spectroscopy-after-the-hype" },
    update: {
      title: "Spectroscopy After the Hype",
      status: ArticleStatus.scheduled_for_publication,
      authorId,
      categoryId: researchCategory.id,
      excerpt: "A research summary on what high-quality spectroscopy still reveals after the excitement fades."
    },
    create: {
      slug: "spectroscopy-after-the-hype",
      title: "Spectroscopy After the Hype",
      status: ArticleStatus.scheduled_for_publication,
      authorId,
      categoryId: researchCategory.id,
      excerpt: "A research summary on what high-quality spectroscopy still reveals after the excitement fades."
    }
  });

  const issue = await prisma.issue.upsert({
    where: { slug: "issue-12-boundaries-of-observation" },
    update: {
      issueNumber: "Issue 12",
      title: "Boundaries of Observation",
      description: "Microscopy, instrumentation, and the editorial politics of precision.",
      releasedAt: new Date("2026-03-11T08:00:00Z")
    },
    create: {
      slug: "issue-12-boundaries-of-observation",
      issueNumber: "Issue 12",
      title: "Boundaries of Observation",
      description: "Microscopy, instrumentation, and the editorial politics of precision.",
      releasedAt: new Date("2026-03-11T08:00:00Z")
    }
  });

  await prisma.issueArticle.upsert({
    where: {
      issueId_articleId: {
        issueId: issue.id,
        articleId: researchArticle.id
      }
    },
    update: {
      sortOrder: 1,
      highlight: true
    },
    create: {
      issueId: issue.id,
      articleId: researchArticle.id,
      sortOrder: 1,
      highlight: true
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        recipientId: authorId,
        type: NotificationType.workflow,
        title: "Revision guidance posted",
        body: "The editorial desk has requested one methods clarification before final approval."
      },
      {
        recipientId: editorId,
        type: NotificationType.editorial,
        title: "Editorial hold",
        body: "Quantum Sensors in Noisy Laboratories is on hold pending one final revision."
      }
    ],
    skipDuplicates: true
  });

  const launchTemplate = await prisma.emailTemplate.upsert({
    where: { slug: "issue-launch" },
    update: {},
    create: {
      slug: "issue-launch",
      name: "Issue Launch",
      subjectTemplate: "Issue {{issueNumber}} is live: {{issueTitle}}",
      preheaderTemplate: "New reporting, issue highlights, and the editor’s note.",
      bodyHtml: "<p>Issue launch email preview.</p>",
      bodyText: "Issue launch email preview."
    }
  });

  await prisma.emailLog.createMany({
    data: [
      {
        templateId: launchTemplate.id,
        recipientId: authorId,
        recipientEmail: "author@microscope-magazine.com",
        subject: "Issue 12 is live: Boundaries of Observation",
        preheader: "New reporting, issue highlights, and the editor’s note.",
        status: "queued"
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
