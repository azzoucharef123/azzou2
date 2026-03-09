import "server-only";
import { Prisma, PrismaClient, ArticleStatus, ReviewerAssignmentStatus } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function listArticles(
  filters: {
    status?: ArticleStatus;
    categorySlug?: string;
    query?: string;
  } = {},
  db: DbClient = getPrisma()
) {
  return db.article.findMany({
    where: {
      status: filters.status,
      category: filters.categorySlug
        ? {
            slug: filters.categorySlug
          }
        : undefined,
      OR: filters.query
        ? [
            { title: { contains: filters.query, mode: "insensitive" } },
            { excerpt: { contains: filters.query, mode: "insensitive" } }
          ]
        : undefined
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true
        }
      },
      reviewerAssignments: {
        include: {
          reviewer: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function listDashboardArticles(db: DbClient = getPrisma()) {
  return db.article.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          fullName: true
        }
      },
      category: {
        select: {
          name: true
        }
      },
      reviewerAssignments: {
        select: {
          reviewer: {
            select: {
              fullName: true
            }
          }
        }
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function getArticleById(articleId: string, db: DbClient = getPrisma()) {
  return db.article.findUnique({
    where: {
      id: articleId
    },
    include: {
      author: true,
      category: true,
      versions: {
        orderBy: {
          versionNumber: "desc"
        }
      },
      statusHistory: {
        orderBy: {
          createdAt: "asc"
        },
        include: {
          actor: true
        }
      },
      reviewerAssignments: {
        include: {
          reviewer: true,
          review: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      },
      chiefEditorDecisions: {
        orderBy: {
          decidedAt: "desc"
        },
        include: {
          decidedBy: true
        }
      }
    }
  });
}

export async function getArticleBySlug(slug: string, db: DbClient = getPrisma()) {
  return db.article.findUnique({
    where: {
      slug
    },
    include: {
      author: true,
      category: true,
      versions: {
        orderBy: {
          versionNumber: "desc"
        }
      },
      statusHistory: {
        orderBy: {
          createdAt: "asc"
        },
        include: {
          actor: true
        }
      },
      reviewerAssignments: {
        include: {
          reviewer: true,
          review: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}

export async function findCategoryBySlug(slug: string, db: DbClient = getPrisma()) {
  return db.category.findUnique({
    where: {
      slug
    }
  });
}

export async function ensureTags(tagSlugs: string[], db: DbClient = getPrisma()) {
  if (!tagSlugs.length) {
    return [];
  }

  await Promise.all(
    tagSlugs.map((slug) =>
      db.tag.upsert({
        where: {
          slug
        },
        create: {
          slug,
          name: slug
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        },
        update: {}
      })
    )
  );

  return db.tag.findMany({
    where: {
      slug: {
        in: tagSlugs
      }
    }
  });
}

export async function createArticleRecord(
  input: {
    authorId: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    excerpt?: string | null;
    featuredImagePath?: string | null;
    coverTone?: string | null;
    coverMotif?: string | null;
    categoryId?: string;
    bodyJson: Prisma.InputJsonValue;
    referencesJson: Prisma.InputJsonValue;
    tagSlugs: string[];
  },
  db: DbClient = getPrisma()
) {
  const tags = await ensureTags(input.tagSlugs, db);

  return db.article.create({
    data: {
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle,
      excerpt: input.excerpt,
      featuredImagePath: input.featuredImagePath,
      coverTone: input.coverTone,
      coverMotif: input.coverMotif,
      authorId: input.authorId,
      categoryId: input.categoryId,
      versions: {
        create: {
          versionNumber: 1,
          title: input.title,
          subtitle: input.subtitle,
          excerpt: input.excerpt,
          bodyJson: input.bodyJson,
          referencesJson: input.referencesJson,
          featuredImagePath: input.featuredImagePath,
          createdById: input.authorId,
          isCurrent: true
        }
      },
      tags: {
        create: tags.map((tag) => ({
          tagId: tag.id
        }))
      },
      statusHistory: {
        create: {
          toStatus: "draft",
          actorId: input.authorId,
          note: "Article draft created."
        }
      }
    },
    include: {
      author: true,
      category: true,
      versions: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}

export async function createArticleVersion(
  input: {
    articleId: string;
    createdById: string;
    title: string;
    subtitle?: string | null;
    excerpt?: string | null;
    bodyJson: Prisma.InputJsonValue;
    referencesJson?: Prisma.InputJsonValue;
    featuredImagePath?: string | null;
    changeSummary?: string;
  },
  db: DbClient = getPrisma()
) {
  const article = await db.article.findUniqueOrThrow({
    where: {
      id: input.articleId
    }
  });

  await db.articleVersion.updateMany({
    where: {
      articleId: input.articleId,
      isCurrent: true
    },
    data: {
      isCurrent: false
    }
  });

  const versionNumber = article.currentVersionNumber + 1;

  const version = await db.articleVersion.create({
    data: {
      articleId: input.articleId,
      createdById: input.createdById,
      versionNumber,
      title: input.title,
      subtitle: input.subtitle,
      excerpt: input.excerpt,
      bodyJson: input.bodyJson,
      referencesJson: input.referencesJson,
      featuredImagePath: input.featuredImagePath,
      changeSummary: input.changeSummary,
      isCurrent: true
    }
  });

  await db.article.update({
    where: {
      id: input.articleId
    },
    data: {
      title: input.title,
      subtitle: input.subtitle,
      excerpt: input.excerpt,
      featuredImagePath: input.featuredImagePath,
      currentVersionNumber: versionNumber
    }
  });

  return version;
}

export async function addSubmission(
  input: {
    articleId: string;
    submittedById: string;
    submissionType: "initial" | "revision" | "commissioned";
    coverLetter?: string;
  },
  db: DbClient = getPrisma()
) {
  return db.submission.create({
    data: input
  });
}

export async function addStatusHistory(
  input: {
    articleId: string;
    actorId?: string;
    fromStatus?: ArticleStatus;
    toStatus: ArticleStatus;
    note?: string;
  },
  db: DbClient = getPrisma()
) {
  return db.articleStatusHistory.create({
    data: input
  });
}

export async function updateArticleStatus(
  articleId: string,
  status: ArticleStatus,
  db: DbClient = getPrisma(),
  scheduledForPublicationAt?: Date | null
) {
  return db.article.update({
    where: {
      id: articleId
    },
    data: {
      status,
      scheduledForPublicationAt
    }
  });
}

export async function assignReviewer(
  input: {
    articleId: string;
    reviewerId: string;
    assignedById: string;
    dueAt?: Date;
  },
  db: DbClient = getPrisma()
) {
  return db.reviewerAssignment.create({
    data: {
      articleId: input.articleId,
      reviewerId: input.reviewerId,
      assignedById: input.assignedById,
      dueAt: input.dueAt
    },
    include: {
      reviewer: true
    }
  });
}

export async function submitReview(
  input: {
    assignmentId: string;
    articleId: string;
    reviewerId: string;
    recommendation: Prisma.ReviewCreateInput["recommendation"];
    summary: string;
    confidentialNote?: string;
  },
  db: DbClient = getPrisma()
) {
  const review = await db.review.create({
    data: input
  });

  await db.reviewerAssignment.update({
    where: {
      id: input.assignmentId
    },
    data: {
      status: ReviewerAssignmentStatus.submitted
    }
  });

  return review;
}

export async function createEditorialNote(
  input: {
    articleId: string;
    authorId: string;
    title?: string;
    body: string;
    isInternal?: boolean;
  },
  db: DbClient = getPrisma()
) {
  return db.editorialNote.create({
    data: input
  });
}

export async function createChiefEditorDecision(
  input: {
    articleId: string;
    decidedById: string;
    decision: Prisma.ChiefEditorDecisionCreateInput["decision"];
    rationale?: string;
  },
  db: DbClient = getPrisma()
) {
  return db.chiefEditorDecision.create({
    data: input
  });
}
