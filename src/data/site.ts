/**
 * Everything about you that GitHub can't tell us.
 * This is the file to edit first — nothing here is fetched from anywhere.
 */

export const site = {
  name: 'Arnav Vashishtha',
  /**
   * Primary title. Used for the page <title>, OG tags and structured data —
   * the places that need one stable answer.
   */
  role: 'Agentic AI Engineer',
  /**
   * Cycled through in the hero, typewriter-style. `role` leads, so the first
   * thing a visitor reads matches the page title. Keep each one short — they
   * share a line with a blinking caret.
   */
  roles: [
    'Agentic AI Engineer',
    'Full-Stack Engineer, AI/ML',
    'Data & ML Engineer',
    'LLM Systems Engineer',
  ],
  /** One line, hero-sized. This is the sentence people remember. */
  tagline: 'I build ML systems end to end — the data, the pipeline, the model, and the app someone actually uses.',

  /** Sits above the name, the first thing anyone reads. */
  quote: {
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
  },
  location: 'Delhi NCR, India',
  /** Flip to false when you are not looking. Drives the green dot in the hero. */
  availableForWork: true,
  availabilityNote: 'Open to AI / ML engineering roles',

  email: 'arnavvashishtha007@gmail.com',

  links: {
    github: 'https://github.com/Arnavvs',
    linkedin: 'https://linkedin.com/in/arnavvashishtha',
    resume: '/resume.pdf',
    // Optional — set to '' to hide.
    twitter: '',
  },

  education: {
    degree: 'B.Tech, Electrical & Computer Engineering',
    school: 'Shiv Nadar University, Greater Noida',
    period: '2022 — 2026',
    extras: ['IBM RAG & Agentic AI (Certified)', 'Coursework: AI/ML, Deep Learning, NLP, LLMs, DSA'],
  },

  /** Rendered as the About section. Keep it to one short paragraph. */
  about: [
    'I work on the part of ML that happens after the demo — where a pipeline has to run every month, on real data, without someone babysitting it. I tend to profile the data by hand before writing any rules, because the interesting failures are usually in how people entered things, not in the model.',
  ],

  /**
   * Work history. Metrics lead — they are what a reader actually scans for —
   * and the bullets stay to two per workstream so nothing reads as a wall.
   */
  experience: [
    {
      company: 'NXP Semiconductors',
      role: 'AI/ML Intern',
      period: 'Jan 2026 — Jul 2026',
      confidential: false,
      summary: 'Two workstreams, both scoped, built and deployed end to end on my own.',
      metrics: [
        { value: '2M+', label: 'records unlocked' },
        { value: '~95%', label: 'auto-resolved' },
        { value: '~60%', label: 'lower LLM cost' },
        { value: '50+ hrs', label: 'saved / month' },
      ],
      projects: [
        {
          name: 'P-Card Data Normalization',
          points: [
            'An LLM pipeline that resolved messy vendor names against the SAP master, bringing 2M+ transactions into reporting that analytics had always excluded.',
            'A mapping cache cut token cost ~60%; a Streamlit review app keeps a human on the ambiguous cases. Runs monthly on Databricks.',
          ],
        },
        {
          name: 'Lead-Time Intelligence Engine',
          points: [
            'Consolidated 60+ vendor files across 8 commodities into one Databricks engine, and automated the whole monthly cycle with Power Automate — ~90% less manual reporting.',
            'Four supplier-risk signals from a news/sentiment API gave managers 6–8 weeks of warning on supply shocks, surfacing 12 risky suppliers nobody had seen.',
          ],
        },
      ],
      tech: ['Python', 'Databricks', 'PySpark', 'Power Automate', 'Power BI', 'Streamlit', 'SAP'],
    },
    {
      company: 'Sapphire Infosystems',
      role: 'AI & SAP Intern',
      period: 'May 2025 — Aug 2025',
      confidential: false,
      summary: 'SAP vendor and Procure-to-Pay data models, plus a plain-English layer over them.',
      metrics: [],
      projects: [
        {
          name: '',
          points: [
            'Customized the SAP FBL1N vendor line-item report over BSIK/BSAK/LFA1 with selection-driven views.',
            'Co-built a dashboard turning raw SAP data into natural-language queries with auto-generated charts for non-technical users.',
          ],
        },
      ],
      tech: ['SAP ABAP', 'FBL1N', 'Procure-to-Pay'],
    },
  ],

  /**
   * Grouped skills. Deliberately NOT exhaustive — a list of 60 tools reads as
   * noise. These are the ones worth claiming; the resume carries the long tail.
   */
  skills: [
    {
      group: 'Languages',
      items: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'Java', 'SAP ABAP'],
    },
    {
      group: 'ML & LLMs',
      items: [
        'PyTorch',
        'Hugging Face',
        'Fine-tuning (LoRA)',
        'Distillation',
        'UMAP + HDBSCAN',
        'Eval design',
      ],
    },
    {
      group: 'Agentic',
      items: ['LangChain', 'LangGraph', 'CrewAI', 'Gemini', 'RAG', 'Text-to-SQL', 'Human-in-the-loop'],
    },
    {
      group: 'Data',
      items: ['Databricks', 'PySpark', 'pandas', 'ETL / ELT', 'Power BI', 'SQLite / MySQL'],
    },
    {
      group: 'Automation',
      items: ['Power Automate', 'Power Apps', 'Copilot Studio', 'SharePoint', 'Azure', 'SAP'],
    },
    {
      group: 'Shipping',
      items: ['Streamlit', 'FastAPI', 'Docker', 'Git / CI', 'Postman', 'Astro'],
    },
  ],
} as const;

export type Site = typeof site;
