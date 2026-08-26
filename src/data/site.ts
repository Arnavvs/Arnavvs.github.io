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
  tagline:
    'I take problems end to end — raw data, the pipeline, the model, and the app someone actually uses. Most recently: 2M+ records nobody could report on, brought into production analytics.',
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

  /** Rendered as the About section. Each string is a paragraph. */
  about: [
    'I work on the part of machine learning that happens after the demo — the part where a pipeline has to run every month, on real data, without someone babysitting it. At NXP I ran two workstreams end to end, from scoping the problem to the dashboard management actually opened.',
    'Most of what I build is applied: LLM reasoning wired into data cleaning, agents that plan and execute SQL, retrieval pipelines, and the unglamorous ETL underneath all of it. I tend to profile the data by hand before writing any rules, because the interesting failures are usually in how humans entered things, not in the model.',
    'The through-line in my open-source work is reproducibility. If a number appears in one of my READMEs, there is a script in the repo that produces it, with the seed fixed. When an approach fails I write up why, because that is usually the more useful half of the result.',
  ],

  /**
   * Work history. `confidential: true` renders a lock badge — use it for roles
   * where you are withholding specifics.
   */
  experience: [
    {
      company: 'NXP Semiconductors',
      role: 'AI/ML Intern',
      period: 'Jan 2026 — Jul 2026',
      confidential: false,
      summary:
        'Two workstreams, both self-driven end to end — problem scoping, data collection, pipeline design, build and deployment.',
      /** Grouped so each project reads as its own piece of work. */
      projects: [
        {
          name: 'P-Card Data Normalization — LLM-powered data pipeline',
          points: [
            'Built an LLM-driven cleaning and vendor-normalization pipeline that onboarded 2M+ historical Purchase-Card transactions into enterprise reporting — data previously excluded from analytics because raw bank feeds carried ambiguous, duplicated vendor records.',
            'Profiled in Excel how vendor names were actually entered across offices before designing any resolution logic, so the rules were grounded in observed patterns rather than model judgement alone.',
            'Resolved noisy vendor strings via LLM reasoning plus a web-search API querying each vendor, then fuzzy-matched against the SAP vendor master — ~95% automated resolution, with a Streamlit human-in-the-loop app for the remaining ambiguous cases.',
            'Engineered a historical-resolution cache reusing confirmed mappings to cut LLM token cost ~60%; deployed on Databricks sourcing from SharePoint, with automated monthly refresh.',
            'Used the same enrichment to cluster transactions by commodity and service type, producing the first commodity-level view of P-Card spend and a full-year analysis delivered to management.',
          ],
        },
        {
          name: 'Lead-Time Intelligence Engine — automation & supplier risk',
          points: [
            'Architected a centralized lead-time engine in Databricks consolidating 60+ disparate vendor Excel files across 8 global commodities; the ETL layer standardized 15+ format variants, scoped with commodity and procurement teams across multiple sites.',
            'Automated the full monthly cycle — 6 Power Automate flows for dispatch and collection, a SharePoint list for run-state, SharePoint-hosted Excel as system of record — saving 50+ hours a month team-wide and cutting manual reporting effort ~90%.',
            'Co-built a Power BI executive dashboard over the consolidated workbooks, plus a Databricks-backed view for in-depth lead-time analysis.',
            'Integrated a paid news and sentiment API to generate 4 proprietary risk signals — geopolitical disruption, financial health, OTIF volatility and month-on-month inflation — giving managers 6–8 weeks of warning on supply shocks.',
            'Automated crisis response using Databricks Genie to correlate historical PO data against live external signals, generating risk-mitigation emails and what-if vendor-switch recommendations; surfaced 12 high-risk supplier trends previously invisible to management.',
          ],
        },
      ],
      tech: [
        'Python',
        'Databricks',
        'PySpark',
        'LLM pipelines',
        'Power Automate',
        'Power BI',
        'SharePoint',
        'Streamlit',
        'SAP',
      ],
    },
    {
      company: 'Sapphire Infosystems',
      role: 'AI & SAP Intern',
      period: 'May 2025 — Aug 2025',
      confidential: false,
      summary:
        'SAP vendor and Procure-to-Pay data models, and a natural-language reporting layer over them.',
      projects: [
        {
          name: '',
          points: [
            'Customized the SAP FBL1N vendor line-item report over BSIK/BSAK/LFA1 tables with selection-driven views — hands-on command of relational data models and the end-to-end Procure-to-Pay cycle.',
            'Co-built an AI dashboard turning raw SAP data into a natural-language query layer with auto-generated visualizations — vendor-delay heatmaps, payment-trend dashboards — for non-technical business users.',
          ],
        },
      ],
      tech: ['SAP ABAP', 'FBL1N', 'Procure-to-Pay', 'NL query layer'],
    },
  ],

  /**
   * Grouped skills. Rendered as a full-width grid, so groups can be generous —
   * but keep each one scannable.
   */
  skills: [
    {
      group: 'Languages & Core',
      items: [
        'Python',
        'SQL',
        'JavaScript',
        'TypeScript',
        'Java',
        'SAP ABAP',
        'PySpark',
        'REST APIs',
        'Postman',
        'Git',
        'Linux',
        'DSA',
      ],
    },
    {
      group: 'ML & Deep Learning',
      items: [
        'PyTorch',
        'Hugging Face Transformers',
        'LLM fine-tuning',
        'LoRA / QLoRA',
        'Distillation',
        'scikit-learn',
        'XGBoost',
        'LightGBM',
        'NLP',
        'UMAP + HDBSCAN',
        'Model evaluation',
      ],
    },
    {
      group: 'Agentic & LLM Systems',
      items: [
        'LangChain',
        'LangGraph',
        'CrewAI',
        'Google Gemini',
        'Multi-agent orchestration',
        'Tool use / function calling',
        'Text-to-SQL agents',
        'RAG pipelines',
        'Prompt engineering',
        'Pydantic structured output',
        'Vector databases',
        'Human-in-the-loop',
      ],
    },
    {
      group: 'Data & Analytics',
      items: [
        'pandas / NumPy / SciPy',
        'Databricks',
        'ETL / ELT',
        'Star-schema modeling',
        'Data warehousing',
        'SQLite / MySQL',
        'Power BI',
        'Plotly',
        'Advanced Excel',
        'Statistical analysis',
        'Fuzzy matching',
      ],
    },
    {
      group: 'Automation & Enterprise',
      items: [
        'Power Automate',
        'Power Apps',
        'Power BI',
        'Copilot Studio',
        'Databricks Genie',
        'SharePoint',
        'Azure',
        'SAP (FBL1N, BSIK/BSAK, LFA1, OData)',
        'Procure-to-Pay',
        'Workflow automation',
      ],
    },
    {
      group: 'Building & Shipping',
      items: ['Streamlit', 'FastAPI / Flask', 'Astro', 'Docker', 'CI / GitHub Actions', 'Wix'],
    },
  ],
} as const;

export type Site = typeof site;
