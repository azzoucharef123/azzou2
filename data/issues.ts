import { Issue } from "@/types/content";

export const issues: Issue[] = [
  {
    slug: "issue-12-boundaries-of-observation",
    issueNumber: "Issue 12",
    title: "Boundaries of Observation",
    releasedAt: "2026-02-18",
    description:
      "A print-inspired issue on next-generation imaging, catalytic interfaces, and the ethics of interpreting fragile data.",
    editorNote:
      "This issue asks a deceptively simple question: when an instrument grows more sensitive, what exactly have we learned? The answer is never only technical. It is also editorial, philosophical, and human.",
    highlights: [
      "A cover feature on cryogenic microscopy and the politics of resolution",
      "A chemistry dossier on catalysts engineered for uncertain industrial conditions",
      "An education essay on teaching uncertainty rather than hiding it"
    ],
    articleSlugs: [
      "quantum-sensors-in-noisy-labs",
      "molecular-design-beyond-the-bench",
      "how-to-teach-the-periodic-table-as-a-living-map"
    ],
    coverTone: "blue",
    coverMotif: "microscope"
  },
  {
    slug: "issue-11-the-elegance-of-measurement",
    issueNumber: "Issue 11",
    title: "The Elegance of Measurement",
    releasedAt: "2025-11-06",
    description:
      "Precision instruments, spectroscopy, and the editorial challenge of explaining data quality to broad audiences.",
    editorNote:
      "Measurement is often described as a neutral act. In practice, every instrument encodes judgments about what counts as signal, acceptable noise, and useful evidence.",
    highlights: [
      "Feature reporting on spectroscopy workflows",
      "Interview with a detector engineer",
      "Field notes from a teaching laboratory redesign"
    ],
    articleSlugs: [
      "spectroscopy-after-the-hype",
      "inside-a-modern-teaching-laboratory",
      "interview-designing-instruments-for-fragile-signals"
    ],
    coverTone: "silver",
    coverMotif: "spectrum"
  },
  {
    slug: "issue-10-materials-that-remember",
    issueNumber: "Issue 10",
    title: "Materials That Remember",
    releasedAt: "2025-08-21",
    description:
      "Smart materials, metastability, and the chemistry-physics collaborations redefining functional matter.",
    editorNote:
      "Materials science has become one of the most productive meeting points between physical explanation and chemical design.",
    highlights: [
      "Shape-memory materials and metastable phases",
      "Lab notebook essay on reproducibility in functional materials",
      "Research briefing on self-healing polymers"
    ],
    articleSlugs: [
      "metastable-materials-and-the-art-of-timing",
      "self-healing-polymers-where-hype-meets-evidence",
      "lab-notebook-on-reproducibility"
    ],
    coverTone: "violet",
    coverMotif: "crystal"
  },
  {
    slug: "issue-09-energy-after-scale",
    issueNumber: "Issue 09",
    title: "Energy After Scale",
    releasedAt: "2025-05-14",
    description:
      "An issue dedicated to battery chemistry, thermal physics, and the uneasy transition from laboratory promise to industrial delivery.",
    editorNote:
      "Scale changes the scientific question. What works in an elegant paper may fail under the heat, contamination, and timing constraints of real manufacturing.",
    highlights: [
      "Long-form feature on battery interfaces",
      "A physics explainer on thermal runaway",
      "An industry interview on pilot-scale chemistry"
    ],
    articleSlugs: [
      "battery-interfaces-under-stress",
      "thermal-runaway-explained-for-curious-readers",
      "interview-from-paper-to-pilot-plant"
    ],
    coverTone: "amber",
    coverMotif: "lattice"
  }
];
