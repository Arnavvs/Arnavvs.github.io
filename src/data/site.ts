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

  /**
   * The About section. This is the one place on the page where prose earns its
   * space, so it runs longer than everything else by design.
   *
   * Note the framing: it names ONE centre of gravity (ML, and language/vision
   * models specifically) and presents the breadth as a consequence of shipping
   * those systems end to end. Listing four job titles flat would read as
   * jack-of-all-trades; deriving them from the work does not.
   */
  about: [
    'I am an early-career software engineer aiming squarely at machine learning — language models, vision-language models, and the systems built around them. That is the work I actually chase. I distilled a symbolic Wordle solver into a 0.5B model to find where the ceiling really sits, built content-layer defences for agents that can be talked into things they should not do, and wired retrieval, tool-calling and multi-agent orchestration into pipelines that have to survive real inputs rather than a curated demo set.',

    'The range on my CV is not a list of things I have sampled — it is what shipping one of those systems takes. The model is the smallest part of the problem. At NXP the difficult work sat upstream and downstream of it: profiling how people had actually typed vendor names for a decade before writing a single rule, building the ETL that turned 2M+ excluded records into something reportable, then the review app a human would actually open and the dashboard management would actually read. The data engineering and the front-end were not side quests. They were the difference between a notebook and something that runs every month without me.',

    'So I am equally at home in an AI/ML engineering seat, a data engineering seat, or a generalist software role — not because I am spread thin across four job titles, but because on the problems I care about they are the same job approached from different ends. Depth in the modelling is what makes the pipeline work; owning the pipeline is what makes the modelling matter.',

    'What stays constant is how I work: profile the data by hand before trusting a rule, fix the seed, and publish the runs that failed next to the ones that worked — the failures are usually the more useful result. Right now I am most interested in small-model capability transfer: how much of a large system’s skill compresses into something that runs on modest hardware, and what the real ceiling turns out to be.',
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
