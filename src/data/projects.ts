/**
 * The curation layer over live GitHub data.
 *
 * GitHub gives us names, languages, stars and timestamps for free. What it
 * cannot give us is a good sentence about *why a project matters*. That lives
 * here, keyed by repo name, and gets merged onto the live data at render time.
 *
 * Adding a new repo on GitHub? It appears on the site automatically with its
 * GitHub description. Add an entry here only when you want to say more.
 */

export interface ProjectOverride {
  /** Human title. Falls back to a prettified repo name. */
  title?: string;
  /** Replaces the GitHub description. Two sentences max reads best. */
  blurb?: string;
  /** The one number worth putting in big type. */
  metric?: { value: string; label: string };
  /** Shown as chips. Falls back to the repo's primary language. */
  stack?: string[];
  /** Live demo / writeup, if there is one beyond the repo. */
  demo?: { href: string; label: string };
  /** Sort weight for the featured grid. Lower = earlier. */
  order?: number;
}

/** The four repo-backed projects that lead the page, in order. */
export const FEATURED = [
  'Qwen_wordle_sft',
  'agentwall',
  'Opinion-Clustring',
  'precAI',
] as const;

/**
 * Work that has no public repo — client sites, closed-source builds, anything
 * where the deliverable is the live thing rather than the code. These render
 * alongside the featured repos and are ordered into the same grid.
 */
export interface ExternalProject {
  title: string;
  blurb: string;
  href: string;
  /** Text for the outbound link, e.g. "rmallp.com". */
  linkLabel: string;
  metric?: { value: string; label: string };
  stack?: string[];
  order?: number;
}

export const EXTERNAL_PROJECTS: ExternalProject[] = [
  {
    title: 'RMA & Associates LLP',
    blurb:
      'Built and shipped the public website for a chartered accountancy firm practising since 1966 — structuring six decades of services, team credentials and regulatory certifications into something a prospective client can actually navigate, with enquiries routed straight to the partners.',
    href: 'https://www.rmallp.com/',
    linkLabel: 'rmallp.com',
    metric: { value: 'Live', label: 'production client site' },
    stack: ['Wix', 'Information architecture', 'Copy', 'SEO'],
    order: 5,
  },
];

export const OVERRIDES: Record<string, ProjectOverride> = {
  Qwen_wordle_sft: {
    title: 'Distilling a Solver into a 0.5B Model',
    blurb:
      'Eleven experiments on one question: how much of a classical Wordle solver’s skill fits inside Qwen2.5-0.5B? Distilled and decoded under a feedback-consistency constraint, it reaches 3.76 guesses against the solver’s 3.44 — and the write-up is mostly about why four attempts to close that last 0.32 all failed.',
    metric: { value: '3.76', label: 'avg guesses · 242/246 solved' },
    stack: ['PyTorch', 'TRL', 'Qwen2.5', 'SFT', 'Constrained decoding'],
    order: 1,
  },

  agentwall: {
    title: 'AgentWall',
    blurb:
      'Content-layer security middleware for AI agents, in one line of code. Existing governance tools police which tools an agent may call; AgentWall inspects what the model is being told to do, catching prompt injection hidden in tool descriptions and retrieved text.',
    metric: { value: '1 line', label: 'to instrument an agent' },
    stack: ['Python 3.11', 'Middleware', 'Prompt-injection defence', 'CI'],
    demo: {
      href: 'https://github.com/Arnavvs/agentwall',
      label: 'Microsoft Build AI Hackathon 2026',
    },
    order: 2,
  },

  'Opinion-Clustring': {
    title: 'SAMARTH — Opinion Clustering Engine',
    blurb:
      'A three-stage pipeline that turns a raw dump of tweets into a queryable opinion database: embed, UMAP-reduce and HDBSCAN-cluster the text, have an LLM agent build a three-level taxonomy with ten metrics per tweet, then answer plain-English questions over the resulting star schema.',
    metric: { value: '10', label: 'metrics scored per tweet' },
    stack: ['UMAP', 'HDBSCAN', 'Gemini', 'LangChain', 'SQLite', 'Streamlit'],
    order: 3,
  },

  precAI: {
    title: 'PrecAI — Agentic Procurement',
    blurb:
      'A multi-agent procurement platform with a human always in the loop. Parallel agents negotiate with suppliers on a tiered strategy while an operator dashboard lets you pause, redirect or override any agent mid-negotiation.',
    metric: { value: 'HITL', label: 'pause / redirect / override' },
    stack: ['Multi-agent', 'Python', 'Negotiation', 'Dashboard'],
    order: 4,
  },

  AI_web_scraper: {
    title: 'Agentic Web Scraper',
    blurb:
      'Give it a vague natural-language task and the agent decides what to search, which pages to open, and what to pull out of them.',
    stack: ['TypeScript', 'Gemini', 'Agents'],
  },

  Project_Samarth: {
    title: 'Project Samarth — Agri & Climate Q&A',
    blurb:
      'Natural-language questions over India’s agricultural and climate datasets. Government data is normalised into a local SQL database that a LangChain + Gemini agent queries on demand.',
    stack: ['LangChain', 'Gemini', 'SQL', 'Streamlit'],
  },

  fifaworldcup: {
    title: 'World Cup 2026 Dataset Builder',
    blurb:
      'A modular, resumable scraping pipeline that aggregates free football data — Elo, FIFA rankings, historical tournaments — into an analysis-ready CSV/SQLite dataset, with data-quality reporting at each stage.',
    stack: ['Python', 'Scraping', 'SQLite', 'ETL'],
  },

  Resume_Screener: {
    title: 'Resume Screener',
    blurb:
      'Batch-screens resumes against a job description with adjustable strictness, scoring candidates on skills and experience and flagging gaps and job-hopping.',
    stack: ['Gemini', 'LangChain', 'Python'],
  },

  Resume_filtering: {
    title: 'Resume Filtering',
    blurb: 'Deployed front-end for AI-assisted resume filtering.',
    stack: ['Python', 'Vercel'],
  },

  LLM_Visualizer: {
    title: 'Transformer Visualizer',
    blurb:
      'Type any Hugging Face model name and get an interactive graph of its internal layer structure, with explanations for each layer type.',
    stack: ['Streamlit', 'pyvis', 'Transformers'],
  },

  SAP_AI_ASSISTANT: {
    title: 'SAP Fiori AI Query Assistant',
    blurb:
      'Ask for SAP data in plain English — "top 5 business partners from the US" — and an LLM translates it into OData-style filters behind a Fiori-style front end.',
    stack: ['SAPUI5', 'Flask', 'OpenAI', 'OData'],
  },

  trade_Analysis: {
    title: 'Trade Analysis',
    blurb: 'Exploratory analysis of trading data in notebooks.',
    stack: ['Jupyter', 'pandas'],
  },

  'Data_Normalization-Cleaning': {
    title: 'Data Normalization & Cleaning',
    blurb: 'Reusable cleaning and normalisation routines for messy tabular sources.',
    stack: ['Python', 'pandas'],
  },

  'S2S-transeng2hi': {
    title: 'Seq2Seq EN→HI Translation',
    blurb:
      'An English-to-Hindi sequence-to-sequence translation model, built and trained from scratch.',
    stack: ['Jupyter', 'Seq2Seq', 'NLP'],
  },

  'Maze-Navigator': {
    title: 'Maze Navigator',
    blurb: 'Pathfinding through generated mazes, written in C++.',
    stack: ['C++', 'Algorithms'],
  },

  SAP_ABAP_fb1ln_report: {
    title: 'SAP ABAP FB1LN Report',
    blurb: 'A custom ABAP report built against SAP financial line-item data.',
    stack: ['ABAP', 'SAP'],
  },

  academic_tracker_databse: {
    title: 'Academic Tracker',
    blurb: 'A database-backed tracker for academic records.',
    stack: ['SQL'],
  },

  'upgrad-movie-app': { title: 'Movie App', stack: ['JavaScript'] },
  eshopv: { title: 'E-Shop', stack: ['JavaScript'] },
  Project1: { title: 'Project 1', stack: ['HTML'] },
};

/** `Qwen_wordle_sft` -> `Qwen Wordle Sft`, for repos with no override. */
export function prettifyName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
