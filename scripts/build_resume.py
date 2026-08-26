"""
Builds public/resume.pdf — a one-page, phone-free CV.

    python scripts/build_resume.py

Why this exists rather than a hand-made PDF: the résumé is published on a public
site, so it deliberately carries NO phone number and no postal address. Keeping
it generated means that property can't quietly regress the next time it's edited.

Edit the content below and re-run. The script asserts the output is a single
page, so it fails loudly rather than silently spilling onto a second one.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.colors import HexColor
import fitz

OUT = "public/resume.pdf"

INK = HexColor("#111111")
MUTED = HexColor("#444444")
RULE = HexColor("#999999")

BODY = 7.9
LEAD = 9.5

styles = {
    "name": ParagraphStyle(
        "name", fontName="Helvetica-Bold", fontSize=17, leading=19,
        textColor=INK, spaceAfter=2,
    ),
    "title": ParagraphStyle(
        "title", fontName="Helvetica", fontSize=8.6, leading=10.5,
        textColor=MUTED, spaceAfter=2,
    ),
    "contact": ParagraphStyle(
        "contact", fontName="Helvetica", fontSize=8.3, leading=10,
        textColor=INK, spaceAfter=6,
    ),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=8.8, leading=10.5,
        textColor=INK, spaceBefore=4, spaceAfter=1.2,
    ),
    "role": ParagraphStyle(
        "role", fontName="Helvetica-Bold", fontSize=8.7, leading=10.4,
        textColor=INK, spaceBefore=2.5, spaceAfter=0.5,
    ),
    "meta": ParagraphStyle(
        "meta", fontName="Helvetica-Oblique", fontSize=7.9, leading=9.5,
        textColor=MUTED, spaceAfter=1.5,
    ),
    "sub": ParagraphStyle(
        "sub", fontName="Helvetica-Bold", fontSize=8.2, leading=10,
        textColor=INK, spaceBefore=2, spaceAfter=1,
    ),
    "body": ParagraphStyle(
        "body", fontName="Helvetica", fontSize=BODY, leading=LEAD,
        textColor=INK, alignment=TA_JUSTIFY, spaceAfter=1,
    ),
    "bullet": ParagraphStyle(
        "bullet", fontName="Helvetica", fontSize=BODY, leading=LEAD,
        textColor=INK, leftIndent=8, bulletIndent=1, spaceAfter=1.0,
        alignment=TA_JUSTIFY,
    ),
}

NAME = "ARNAV VASHISHTHA"
TITLE = (
    "Agentic AI Engineer &nbsp;·&nbsp; Full-Stack Engineer, AI/ML &nbsp;·&nbsp; "
    "Data &amp; ML Engineering"
)
# Deliberately no phone number and no street address — this file is published.
CONTACT = (
    "arnavvashishtha007@gmail.com &nbsp;|&nbsp; Delhi NCR, India &nbsp;|&nbsp; "
    "github.com/Arnavvs &nbsp;|&nbsp; linkedin.com/in/arnavvashishtha"
)

SUMMARY = (
    "Software engineer and data scientist who owns problems end to end — raw data collection, "
    "pipeline engineering, model development, and deployed user-facing applications. At NXP "
    "Semiconductors, shipped an LLM-powered normalization pipeline onboarding 2M+ previously "
    "unreportable records at ~95% automated resolution with ~60% lower LLM token cost, and "
    "architected a lead-time intelligence engine consolidating 60+ vendor files across 8 global "
    "commodities into automated Power BI reporting with predictive supplier-risk signals. Deep "
    "agentic experience — multi-agent orchestration, text-to-SQL agents, tool calling, RAG, "
    "human-in-the-loop applications."
)

SKILLS = [
    ("Languages &amp; Core",
     "Python, SQL, JavaScript/TypeScript, Java, SAP ABAP, PySpark, REST APIs, Postman, Git, Linux, DSA"),
    ("ML &amp; Deep Learning",
     "PyTorch, Hugging Face Transformers, LLM fine-tuning (LoRA/QLoRA), distillation, scikit-learn, "
     "XGBoost, LightGBM, NLP, UMAP, HDBSCAN, model evaluation"),
    ("Agentic &amp; LLM Systems",
     "LangChain, LangGraph, CrewAI, Google Gemini, multi-agent orchestration, tool use / function "
     "calling, text-to-SQL agents, RAG pipelines, prompt engineering, Pydantic structured output, "
     "vector databases, human-in-the-loop"),
    ("Data &amp; Analytics",
     "pandas, NumPy, SciPy, Databricks, ETL/ELT, star-schema modelling, data warehousing, "
     "SQLite/MySQL, Power BI, Plotly, Advanced Excel, statistical analysis, fuzzy matching"),
    ("Automation &amp; Enterprise",
     "Power Automate, Power Apps, Copilot Studio, Databricks Genie, SharePoint, Azure, "
     "SAP (FBL1N, BSIK/BSAK, LFA1, OData), Procure-to-Pay, workflow automation"),
    ("Building &amp; Shipping",
     "Streamlit, FastAPI/Flask, Docker, CI / GitHub Actions"),
]

EXPERIENCE = [
    {
        "role": "AI/ML Intern — NXP Semiconductors",
        "meta": "Jan 2026 – Jul 2026 &nbsp;·&nbsp; Both workstreams scoped, built and deployed independently, end to end",
        "groups": [
            ("P-Card Data Normalization — LLM-Powered Data Pipeline", [
                "Built an LLM-driven cleaning and vendor-normalization pipeline that onboarded <b>2M+</b> "
                "historical Purchase-Card transactions into enterprise reporting — data previously excluded "
                "from analytics due to ambiguous, duplicated vendor records in raw bank feeds.",
                "Profiled in Excel how vendor names were entered across offices before designing resolution "
                "logic; resolved noisy strings via LLM reasoning with an integrated web-search API, then "
                "fuzzy-matched against the SAP vendor master — <b>~95%</b> automated resolution, with a "
                "Streamlit human-in-the-loop review app for the remaining ambiguous cases.",
                "Engineered a historical-resolution cache reusing confirmed mappings to cut LLM token cost "
                "<b>~60%</b>; deployed on Databricks (sourcing from SharePoint) with automated monthly refresh. "
                "Clustered transactions by commodity and service type for the first commodity-level view of "
                "P-Card spend.",
            ]),
            ("Lead-Time Intelligence Engine — Automation &amp; Supplier Risk Analytics", [
                "Architected a centralized lead-time engine in Databricks consolidating <b>60+</b> disparate "
                "vendor Excel files across <b>8</b> global commodities; the ETL layer standardized 15+ format "
                "variants, scoped with commodity and procurement teams across multiple sites.",
                "Automated the full monthly cycle — 6 Power Automate flows, SharePoint run-state, "
                "SharePoint-hosted Excel as system of record — saving <b>50+ hours/month</b> team-wide and "
                "cutting manual reporting effort <b>~90%</b>; co-built a Power BI executive dashboard.",
                "Generated 4 proprietary supplier-risk signals from a paid news and sentiment API "
                "(geopolitical disruption, financial health, OTIF volatility, MoM inflation), giving managers "
                "<b>6–8 weeks</b> of warning on supply shocks; automated crisis response with Databricks Genie, "
                "surfacing <b>12</b> high-risk supplier trends previously invisible to management.",
            ]),
        ],
    },
    {
        "role": "AI &amp; SAP Intern — Sapphire Infosystems",
        "meta": "May 2025 – Aug 2025",
        "groups": [
            ("", [
                "Customized the SAP FBL1N vendor line-item report over BSIK/BSAK/LFA1 tables with "
                "selection-driven views — hands-on command of relational data models and the end-to-end "
                "Procure-to-Pay cycle.",
                "Co-built an AI dashboard turning raw SAP data into a natural-language query layer with "
                "auto-generated visualizations (vendor-delay heatmaps, payment-trend dashboards) for "
                "non-technical business users.",
            ]),
        ],
    },
]

PROJECTS = [
    {
        "name": "Wordle Distillation — Compressing a Symbolic Solver into a 0.5B LLM",
        "stack": "PyTorch · TRL · Qwen2.5-0.5B · SFT · Constrained decoding",
        "points": [
            "Eleven controlled experiments distilling a classical Wordle solver (3.4431 avg guesses) into "
            "Qwen2.5-0.5B, which could not play the game at all untrained (91–97% failure). Reached "
            "<b>3.7642 guesses, 242/246 solved, 1.6% failure</b> on a held-out set under a "
            "feedback-consistency decoding constraint — beating both classical baselines.",
            "Fully reproducible: every reported number is produced by a script in the repo with seeds fixed; "
            "the two headline training runs were re-executed on different machines and produced "
            "byte-identical weights.",
        ],
    },
    {
        "name": "Noise-Aware Opinion Clustering — Dual-Agent Social Analytics Platform",
        "stack": "MiniLM · UMAP · HDBSCAN · LangChain · Gemini · Plotly · SQLite",
        "points": [
            "Faculty-reviewed major project: 3-stage Streamlit platform clustering noisy tweets with MiniLM "
            "embeddings, UMAP reduction and HDBSCAN to <b>87%</b> cluster strength; raised average cohesion "
            "to <b>~94%</b> via per-post LLM synthetic data generation and re-embedding.",
            "Gemini taxonomy agent with Pydantic-constrained output builds a 3-level opinion taxonomy and "
            "scores 10 metrics per tweet, persisted to a deduplicating star-schema store; a tool-calling "
            "text-to-SQL agent answers questions and emits JSON chart specs rendered as Plotly.",
        ],
    },
    {
        "name": "Project Samarth — Natural-Language Analytics Agent over National Open Data",
        "stack": "Python · pandas · LangChain · LangGraph · Gemini · SQLite · Streamlit",
        "points": [
            "End-to-end Q&amp;A over India's agricultural-economy and climate data: scripted fetchers pull "
            "data.gov.in CSVs into a normalized SQLite warehouse with query logging so every answer is "
            "auditable; a LangGraph SQL agent plans, generates and executes SQL, then synthesizes an answer.",
        ],
    },
]

EDUCATION = (
    "<b>B.Tech, Electrical &amp; Computer Engineering</b> — Shiv Nadar University, Greater Noida "
    "&nbsp;|&nbsp; 2022 – 2026 &nbsp;·&nbsp; IBM RAG &amp; Agentic AI (Certified) &nbsp;·&nbsp; "
    "Coursework: AI/ML, Deep Learning, NLP, LLMs, DSA"
)


def section(text):
    return [
        Paragraph(text.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=0, spaceAfter=3),
    ]


def bullet(text):
    return Paragraph(text, styles["bullet"], bulletText="•")


def build():
    doc = SimpleDocTemplate(
        OUT,
        pagesize=A4,
        leftMargin=13 * mm,
        rightMargin=13 * mm,
        topMargin=9 * mm,
        bottomMargin=8 * mm,
        title="Arnav Vashishtha — Résumé",
        author="Arnav Vashishtha",
    )

    story = [
        Paragraph(NAME, styles["name"]),
        Paragraph(TITLE, styles["title"]),
        Paragraph(CONTACT, styles["contact"]),
    ]

    story += section("Summary")
    story.append(Paragraph(SUMMARY, styles["body"]))

    story += section("Technical Skills")
    for label, items in SKILLS:
        story.append(Paragraph(f"<b>{label}:</b> {items}", styles["body"]))

    story += section("Professional Experience")
    for job in EXPERIENCE:
        block = [Paragraph(job["role"], styles["role"]), Paragraph(job["meta"], styles["meta"])]
        for sub, points in job["groups"]:
            if sub:
                block.append(Paragraph(sub, styles["sub"]))
            block += [bullet(p) for p in points]
        # Keep a role's heading with at least its first bullet.
        story.append(KeepTogether(block[:3]))
        story += block[3:]

    story += section("Projects")
    for proj in PROJECTS:
        story.append(Paragraph(proj["name"], styles["sub"]))
        story.append(Paragraph(proj["stack"], styles["meta"]))
        story += [bullet(p) for p in proj["points"]]

    story += section("Education & Certifications")
    story.append(Paragraph(EDUCATION, styles["body"]))
    story.append(Spacer(1, 1))

    doc.build(story)


if __name__ == "__main__":
    build()

    pdf = fitz.open(OUT)
    text = "".join(p.get_text() for p in pdf)

    assert pdf.page_count == 1, (
        f"resume spilled onto {pdf.page_count} pages — trim content or reduce BODY/LEAD"
    )
    for banned in ("8700295609", "+91"):
        assert banned not in text.replace(" ", ""), f"phone number leaked into {OUT}"

    print(f"{OUT}: {pdf.page_count} page, {len(text)} chars, no phone number")
