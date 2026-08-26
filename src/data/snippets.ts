/**
 * Code snippets for the "Guess the language" game.
 *
 * Each one is chosen to be identifiable from syntax alone — no comments naming
 * the language, no imports that give it away for free. `options` are the four
 * buttons shown; `answer` must be one of them. `tell` is revealed afterwards,
 * so a player who guessed wrong learns the actual giveaway.
 */

export interface Snippet {
  code: string;
  answer: string;
  options: [string, string, string, string];
  tell: string;
}

export const SNIPPETS: Snippet[] = [
  {
    code: `def rank(items, key=None):
    return sorted(items, key=key or (lambda x: -x.score))[:10]`,
    answer: 'Python',
    options: ['Python', 'Ruby', 'JavaScript', 'Go'],
    tell: 'Colon-and-indent blocks, `def`, and a default of `None`.',
  },
  {
    code: `const totals = rows.reduce((acc, r) => {
  acc[r.vendor] ??= 0;
  acc[r.vendor] += r.amount;
  return acc;
}, {});`,
    answer: 'JavaScript',
    options: ['JavaScript', 'TypeScript', 'Java', 'C#'],
    tell: '`const` with an arrow function and `??=` — and no type annotations, which is what separates it from TypeScript.',
  },
  {
    code: `interface Repo {
  name: string;
  stars: number;
  language: string | null;
}`,
    answer: 'TypeScript',
    options: ['TypeScript', 'JavaScript', 'Go', 'Swift'],
    tell: '`interface` with a `string | null` union type.',
  },
  {
    code: `SELECT vendor, SUM(amount) AS spend
FROM transactions
WHERE fiscal_year = 2026
GROUP BY vendor
HAVING SUM(amount) > 10000
ORDER BY spend DESC;`,
    answer: 'SQL',
    options: ['SQL', 'Python', 'R', 'Scala'],
    tell: '`GROUP BY` with a `HAVING` clause filtering the aggregate.',
  },
  {
    code: `func Sum(xs []int) int {
    total := 0
    for _, x := range xs {
        total += x
    }
    return total
}`,
    answer: 'Go',
    options: ['Go', 'Rust', 'C', 'Java'],
    tell: '`:=` short declaration and `for _, x := range`.',
  },
  {
    code: `fn largest(list: &[i32]) -> &i32 {
    let mut out = &list[0];
    for item in list {
        if item > out { out = item; }
    }
    out
}`,
    answer: 'Rust',
    options: ['Rust', 'Go', 'C++', 'Swift'],
    tell: 'Borrowed slice `&[i32]`, `let mut`, and a tail expression with no `return`.',
  },
  {
    code: `DATA: lv_total TYPE p DECIMALS 2.
SELECT SUM( wrbtr ) FROM bsik
  INTO lv_total
  WHERE lifnr = p_vendor.`,
    answer: 'SAP ABAP',
    options: ['SAP ABAP', 'SQL', 'COBOL', 'PL/SQL'],
    tell: '`DATA:` declarations and `TYPE p DECIMALS` — plus BSIK, an SAP vendor table.',
  },
  {
    code: `df = (df
      .dropna(subset=["vendor"])
      .assign(vendor=lambda d: d.vendor.str.strip().str.lower())
      .groupby("vendor", as_index=False)
      .agg(spend=("amount", "sum")))`,
    answer: 'pandas',
    options: ['pandas', 'PySpark', 'R (dplyr)', 'Polars'],
    tell: '`.assign()` with a lambda and the `agg(name=(col, fn))` tuple form.',
  },
  {
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("ok");
    }
}`,
    answer: 'Java',
    options: ['Java', 'C#', 'C++', 'Kotlin'],
    tell: '`public static void main(String[] args)` and `System.out.println`.',
  },
  {
    code: `.card:hover {
  border-color: var(--line-2);
  transform: translateY(-3px);
}`,
    answer: 'CSS',
    options: ['CSS', 'SCSS', 'Less', 'Stylus'],
    tell: '`var(--custom-property)` and a plain `:hover` rule with no nesting.',
  },
  {
    code: `spark.read.parquet(path) \\
     .filter(col("year") == 2026) \\
     .groupBy("commodity") \\
     .agg(avg("lead_time").alias("avg_lead"))`,
    answer: 'PySpark',
    options: ['PySpark', 'pandas', 'Scala', 'SQL'],
    tell: '`spark.read`, `col(...)` and `.alias()` — the DataFrame API.',
  },
  {
    code: `---
- name: install packages
  apt:
    name: "{{ item }}"
    state: present
  loop: "{{ packages }}"`,
    answer: 'YAML',
    options: ['YAML', 'TOML', 'JSON', 'INI'],
    tell: 'Leading `---`, dash list items, and `{{ }}` templating.',
  },
];
