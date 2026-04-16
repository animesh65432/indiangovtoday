export function getBriefingPrompt(
    announcements: any[],
    states: string[],
    language: string = "en"
): { system: string; user: string } {

    const stripped = announcements.map(a => ({
        title: a.title,
        category: a.category,
        state: a.state,
        date: new Date(a.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        }),
        summary: a.summary || a.body || a.description || ""
    }));

    const grouped = stripped.reduce((acc, a) => {
        const key = a.category || "General";
        if (!acc[key]) acc[key] = [];
        acc[key].push(a);
        return acc;
    }, {} as Record<string, typeof stripped>);

    const formattedInput = Object.entries(grouped)
        .map(([cat, items]) =>
            `### ${cat} (${items.length})\n` +
            items
                .map(i => `- [${i.date}] [${i.state}] ${i.title}${i.summary ? `: ${i.summary.slice(0, 120)}` : ""}`)
                .join("\n")
        )
        .join("\n\n");

    const locationContext = states.length
        ? `States covered: ${states.join(", ")}`
        : "All states across India";

    const system = `You are a civic news editor for IndianGovToday — a platform helping Indian citizens track government activity across all ministries and states.

Your task is to write a concise daily briefing from raw government announcements.

WRITING RULES:
- Tone: neutral, factual, newspaper editorial style
- Each "brief" field: 2-3 sentences only
- Mention specific dates, places, or figures if present in the data
- Vary sentence starters — do not repeat "The government announced" every time
- No opinions, no speculation, no filler phrases like "It is worth noting"
- If only 1 announcement exists in a category, still write a clean summary
- "highlight" should be the single most newsworthy item title from that category, verbatim

OUTPUT RULES:
- Return ONLY a raw JSON array
- No markdown, no backticks, no explanation before or after
- Language of all "brief" and "highlight" values: ${language}

JSON format:
[
  {
    "category": "string",
    "brief": "string",
    "_id":"string"(just return the original announcement _id for reference),
  }
]`;

    const user = `Write a briefing for the following Indian government announcements.
${locationContext}
Period: Last 24 hours

${formattedInput}

Return the JSON array now.`;

    return { system, user };
}