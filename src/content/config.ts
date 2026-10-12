import { defineCollection, z } from 'astro:content';

// ─── Helpers ─────────────────────────────────────────────────
const ctaSchema = z.object({
  label: z.string(),
  href: z.string()
});

const imgSchema = z.string().describe("URL d'image (Cloudinary ou /uploads/...)");

// ─── 1. Settings (config globale) ────────────────────────────
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    domain: z.string(),
    phone: z.string(),
    phoneIntl: z.string(),
    email: z.string(),
    location: z.string(),
    year: z.string(),
    facebook: z.string().optional(),
    instagram: z.string().optional()
  })
});

// ─── 2. Songs (bibliothèque, réutilisable sur 3 pages) ───────
const songs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['hommage', 'transition', 'celebration']).optional()
      .describe('Univers affiché sur la page Écouter'),
    context: z.string().describe('Court explicatif affiché avant le lecteur'),
    keywords: z.array(z.string()).optional(),
    src: z.string().describe('URL MP3 (Cloudinary)'),
    order: z.number().optional()
  })
});

// ─── 3. Page Accueil ─────────────────────────────────────────
const homeSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string()
  }),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    tagline: z.string(),
    sub: z.string(),
    image: imgSchema,
    ctaPrimary: ctaSchema,
    ctaGhost: ctaSchema
  }),
  concept: z.object({
    lead: z.string(),
    body: z.string(),
    image: imgSchema,
    imageAlt: z.string()
  }),
  origine: z.object({
    eyebrow: z.string(),
    title: z.string(),
    quote: z.string(),
    image: imgSchema,
    imageAlt: z.string(),
    paragraphs: z.array(z.string()),
    pullQuote: z.string(),
    outro: z.string(),
    thanks: z.string().optional()
  }),
  piliers: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.object({
      num: z.string(),
      image: imgSchema,
      imageAlt: z.string(),
      title: z.string(),
      sub: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      cta: ctaSchema.optional(),
      songs: z.array(z.string()).optional().describe('slugs vers /src/content/songs/')
    }))
  }),
  ecouter: z.object({
    eyebrow: z.string(),
    lead: z.string(),
    title: z.string(),
    subtitle: z.string(),
    note: z.string().optional(),
    decorImage: imgSchema.optional(),
    songs: z.array(z.string()).optional().describe('slugs vers /src/content/songs/')
  }),
  processus: z.object({
    eyebrow: z.string(),
    title: z.string(),
    decorImage: imgSchema.optional(),
    steps: z.array(z.object({
      num: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  carole: z.object({
    eyebrow: z.string(),
    title: z.string(),
    photo: imgSchema.nullable().optional(),
    photoCaption: z.string(),
    paragraphs: z.array(z.string()),
    signature: z.string()
  }),
  presse: z.object({
    eyebrow: z.string(),
    title: z.string(),
    source: z.string(),
    date: z.string(),
    headline: z.string(),
    text: z.string(),
    image: imgSchema,
    imageAlt: z.string(),
    link: z.string().optional()
  }).optional(),
  tarifs: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    intro: z.string(),
    foot: z.string(),
    formules: z.array(z.object({
      name: z.string(),
      context: z.string(),
      price: z.string(),
      priceUnit: z.string().nullable().optional(),
      featured: z.boolean().default(false),
      tag: z.string().nullable().optional(),
      includes: z.array(z.string()),
      cta: ctaSchema
    }))
  }),
  prosGateway: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    cards: z.array(z.object({
      href: z.string(),
      image: imgSchema,
      imageAlt: z.string(),
      tag: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  faq: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.object({
      question: z.string(),
      answerHtml: z.string()
    }))
  }),
  temoignage: z.object({
    quote: z.string(),
    attribution: z.string()
  }),
  contact: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    submitLabel: z.string(),
    successMessage: z.string(),
    privacy: z.string()
  })
});

// ─── 4. Page Mariage ─────────────────────────────────────────
const mariageSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    ogImage: imgSchema
  }),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    tagline: z.string(),
    image: imgSchema,
    ctaPrimary: ctaSchema,
    ctaGhost: ctaSchema
  }),
  manifesto: z.string(),
  pourquoi: z.object({
    eyebrow: z.string(),
    title: z.string(),
    image: imgSchema,
    imageAlt: z.string(),
    paragraphs: z.array(z.string()),
    pullQuote: z.string()
  }),
  apports: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.object({
      icon: z.string().default('✦'),
      title: z.string(),
      description: z.string(),
      fullWidth: z.boolean().default(false)
    }))
  }),
  idees: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.object({
      num: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  ecouter: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    songs: z.array(z.string()),
    note: z.string().optional(),
    decorImage: imgSchema.optional()
  }),
  processus: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    steps: z.array(z.object({
      num: z.string(),
      icon: z.string().default('✦'),
      title: z.string(),
      description: z.string()
    }))
  }),
  tarifsRedirect: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    cta: ctaSchema
  }),
  collab: z.object({
    eyebrow: z.string(),
    title: z.string(),
    image: imgSchema,
    imageAlt: z.string(),
    intro: z.string(),
    list: z.array(z.string())
  }),
  carole: z.object({
    eyebrow: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()),
    quoteFinal: z.string().optional()
  }),
  contact: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    submitLabel: z.string(),
    mailtoSubject: z.string()
  })
});

// ─── 5. Page Pompes funèbres ─────────────────────────────────
const pompesSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    ogImage: imgSchema
  }),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    tagline: z.string(),
    image: imgSchema,
    ctaPrimary: ctaSchema,
    ctaGhost: ctaSchema
  }),
  manifesto: z.string(),
  pourquoi: z.object({
    eyebrow: z.string(),
    title: z.string(),
    image: imgSchema,
    imageAlt: z.string(),
    paragraphs: z.array(z.string()),
    pullQuote: z.string()
  }),
  apports: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.object({
      icon: z.string().default('✦'),
      title: z.string(),
      description: z.string(),
      fullWidth: z.boolean().default(false)
    }))
  }),
  ecouter: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    songs: z.array(z.string()),
    decorImage: imgSchema.optional()
  }),
  processus: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    urgenceNote: z.string().optional(),
    steps: z.array(z.object({
      num: z.string(),
      icon: z.string().default('✦'),
      title: z.string(),
      description: z.string()
    }))
  }),
  tarifsRedirect: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    cta: ctaSchema
  }),
  collab: z.object({
    eyebrow: z.string(),
    title: z.string(),
    image: imgSchema,
    imageAlt: z.string(),
    intro: z.string(),
    list: z.array(z.string())
  }),
  carole: z.object({
    eyebrow: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string())
  }),
  contact: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    submitLabel: z.string(),
    mailtoSubject: z.string()
  })
});

// ─── 6. Page Écouter ─────────────────────────────────────────
const ecouterSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    ogImage: imgSchema
  }),
  header: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    image: imgSchema,
    imageAlt: z.string()
  }),
  univers: z.array(z.object({
    id: z.enum(['hommages', 'transitions', 'celebrations']),
    category: z.enum(['hommage', 'transition', 'celebration']),
    num: z.string(),
    title: z.string(),
    sub: z.string(),
    description: z.string(),
    shareTitle: z.string()
  })),
  note: z.string().optional(),
  cta: z.object({
    title: z.string(),
    text: z.string(),
    button: ctaSchema
  })
});

const pages = defineCollection({
  type: 'data',
  schema: ({ image }) => z.union([homeSchema, mariageSchema, pompesSchema, ecouterSchema])
});

// ─── 7. Blog (articles « Ressources ») ───────────────────────
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(170).describe('Meta description, 140 à 155 caractères'),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    audience: z.enum(['familles', 'pompes-funebres', 'wedding-planners', 'prescripteurs']),
    univers: z.enum(['hommage', 'transition', 'celebration']).optional(),
    cover: imgSchema,
    coverAlt: z.string(),
    relatedSongs: z.array(z.string()).optional().describe('slugs vers /src/content/songs/'),
    cta: ctaSchema.optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  settings,
  songs,
  pages,
  blog
};
