import { ObjectId } from "mongodb";
import { connectDB } from "./db";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SKIP = 690;
const LIMIT = 790;
const SLEEP_MS = 1500;
const MIN_SCORE = 1;    // reject if no keyword matched at all

// ─── DOMAIN LISTS ─────────────────────────────────────────────────────────────
// These domains host article feature banners / SEO thumbnails — not real photos
const BLOCKED_DOMAINS = [
    "careers360", "shiksha.com", "collegedunia", "getmyuni",
    "jagranjosh", "jagran.com", "bhaskar.com", "patrika.com",
    "zeenews", "abplive", "newsbytesapp", "entrancezone",
    "successcds", "thenewsminute", "indiatvnews", "amarujala",
    "livehindustan", "navbharattimes", "firstpost.com",
    "theprint.in", "thequint.com", "cache.careers360",
];

// These domains tend to host actual press / event photographs
const PREFERRED_DOMAINS = [
    "pib.gov.in", "pib.nic.in",
    "india.gov.in",
    ".nic.in", ".gov.in",
    "thehindu.com",
    "businessstandard.com",
    "economictimes.indiatimes.com",
    "timesofindia.indiatimes.com",
    "aninews.in", "ani.in",
    "ptinews.com", "pti.in",
    "narendramodi.in", "pmindia.gov.in",
    "vikaspedia.in",
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface DDGResult {
    image: string;
    title?: string;
    url?: string;
    width?: number;
    height?: number;
}

interface ScoredResult extends DDGResult {
    _score: number;
}

interface Announcement {
    _id: ObjectId;
    title: string;
    category?: string;
    state?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildQuery(ann: Announcement): string {
    const state = ann.state === "IndianGovt" ? "India" : ann.state;
    return [ann.title, state, ann.category, "official ceremony photo"]
        .filter(Boolean)
        .join(" ");
}

function extractKeywords(query: string): string[] {
    const STOP_WORDS = new Set([
        "the", "and", "for", "with", "from", "that", "this",
        "are", "was", "has", "have", "will", "its", "into",
        "official", "ceremony", "photo", "government", "scheme",
    ]);
    return query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function domainOf(url: string): string {
    try { return new URL(url).hostname.toLowerCase(); }
    catch { return ""; }
}

function isBlocked(url: string): boolean {
    const host = domainOf(url);
    return BLOCKED_DOMAINS.some((b) => host.includes(b));
}

function domainBonus(url: string): number {
    const host = domainOf(url);
    return PREFERRED_DOMAINS.some((p) => host.includes(p)) ? 3 : 0;
}

function scoreResult(result: DDGResult, keywords: string[]): number {
    // Hard reject blocked domains
    if (isBlocked(result.image) || isBlocked(result.url ?? "")) return -999;

    const haystack = [result.title ?? "", result.url ?? "", result.image ?? ""]
        .join(" ")
        .toLowerCase();

    const keywordScore = keywords.reduce(
        (acc, kw) => (haystack.includes(kw) ? acc + 1 : acc),
        0
    );

    // Bonus: preferred official/wire domains
    const bonus = domainBonus(result.image) + domainBonus(result.url ?? "");

    // Bonus: larger images are more likely real press photos
    const sizeBonus = (result.width ?? 0) >= 800 ? 1 : 0;

    return keywordScore + bonus + sizeBonus;
}

// ─── DDG IMAGE FETCH ──────────────────────────────────────────────────────────
async function fetchBestImage(query: string): Promise<string | null> {
    // Step 1 — obtain vqd token
    const tokenRes = await fetch(
        `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
        {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
        }
    );

    const html = await tokenRes.text();
    const token = html.match(/vqd=([\d-]+)/)?.[1];
    if (!token) throw new Error("Could not extract DDG vqd token");

    // Step 2 — fetch image results
    const imgRes = await fetch(
        `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${token}&f=,,,,,&p=1&s=0`,
        {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://duckduckgo.com/",
                "Accept": "application/json",
            },
        }
    );

    if (!imgRes.ok) throw new Error(`DDG responded with HTTP ${imgRes.status}`);

    const data = await imgRes.json();
    const results: DDGResult[] = (data.results ?? []).filter((r: DDGResult) => r.image);
    if (results.length === 0) return null;

    // Step 3 — score and rank
    const keywords = extractKeywords(query);

    const scored: ScoredResult[] = results
        .map((r) => ({ ...r, _score: scoreResult(r, keywords) }))
        .sort((a, b) => b._score - a._score);

    const best = scored[0];

    console.log(
        `   🏆 Best [score ${best._score}] ${domainOf(best.image)} — "${best.title ?? "untitled"}"`
    );
    // Show top 3 candidates so you can audit
    scored.slice(0, 3).forEach((r, i) => {
        console.log(`      ${i + 1}. [${r._score}] ${domainOf(r.image)} — "${r.title ?? ""}"`);
    });

    if (best._score < MIN_SCORE) {
        console.log("   ⚠️  Score too low — no relevant image found.");
        return null;
    }

    return best.image;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function migrate() {
    const db = (await connectDB()).collection("Translated_Announcements");

    const announcements = (await db
        .find({ language: "en", image: { $exists: false } })
        .toArray()) as Announcement[];

    console.log(`Found ${announcements.length} announcement(s) without an image.`);

    if (announcements.length === 0) {
        console.log("✅ All done — nothing left to process.");
        return;
    }

    const results = { success: 0, failed: 0, skipped: 0 };

    for (const ann of announcements) {
        const query = buildQuery(ann);

        console.log(`\n📰 "${ann.title}"`);
        console.log(`   Query: "${query}"`);

        try {
            const image = await fetchBestImage(query);

            if (!image) {
                results.skipped++;
                continue;
            }

            console.log(`   🖼️  ${image}`);

            await db.updateOne(
                { _id: ann._id },
                { $set: { image, image_fetched_at: new Date() } }
            );

            console.log("   ✅ Saved.");
            results.success++;
        } catch (err) {
            console.error(`   ❌ Error: ${(err as Error).message}`);
            results.failed++;
        }

        await sleep(SLEEP_MS);
    }

    console.log("\n─────────────────────────────────────────────────");
    console.log(
        `✅ ${results.success} saved   ⚠️  ${results.skipped} skipped   ❌ ${results.failed} failed`
    );
}

migrate().catch(console.error);