import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import * as cheerio from "cheerio";
import type { Brand } from "./types";

const MAX_BYTES = 2_000_000;
const MAX_REDIRECTS = 3;

export class ScrapeError extends Error {}

export interface ScrapedPage {
  url: string;
  title: string;
  description: string;
  ogImage: string | null;
  brand: Brand;
}

function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return isPrivateAddress(v.slice(7));
    return (
      v === "::" ||
      v === "::1" ||
      v.startsWith("fc") ||
      v.startsWith("fd") ||
      v.startsWith("fe80")
    );
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

/** Rejects non-http(s) URLs and hosts that resolve to private/internal networks (SSRF). */
async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ScrapeError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ScrapeError("Only http and https URLs are supported.");
  }
  if (url.username || url.password) {
    throw new ScrapeError("URLs with credentials are not allowed.");
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host)
    ? [host]
    : (await lookup(host, { all: true }).catch(() => [])).map((r) => r.address);
  if (addresses.length === 0) throw new ScrapeError("Could not resolve that domain.");
  if (addresses.some(isPrivateAddress)) throw new ScrapeError("That address is not reachable.");
  return url;
}

async function fetchHtml(raw: string): Promise<{ url: URL; html: string }> {
  let url = await assertPublicUrl(raw);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CoolVideoBot/1.0; +https://coolvideo.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    }).catch(() => {
      throw new ScrapeError("We couldn't reach that website.");
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) break;
      url = await assertPublicUrl(new URL(location, url).toString());
      continue;
    }
    if (!res.ok) throw new ScrapeError(`The website answered with HTTP ${res.status}.`);

    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html")) throw new ScrapeError("That URL is not an HTML page.");

    return { url, html: await readLimited(res) };
  }
  throw new ScrapeError("Too many redirects.");
}

async function readLimited(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.byteLength;
  }
  await reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks));
}

const clean = (s: string | undefined | null) => (s ?? "").replace(/\s+/g, " ").trim();

export async function scrapePage(raw: string): Promise<ScrapedPage> {
  const { url, html } = await fetchHtml(raw);
  const $ = cheerio.load(html);
  const meta = (key: string) =>
    clean($(`meta[property="${key}"]`).attr("content") ?? $(`meta[name="${key}"]`).attr("content"));
  const absolute = (href: string | undefined) => {
    if (!href) return null;
    try {
      return new URL(href, url).toString();
    } catch {
      return null;
    }
  };

  const siteName = meta("og:site_name");
  const title = meta("og:title") || clean($("title").first().text()) || url.hostname;
  const description = meta("og:description") || meta("description");

  const headlines = Array.from(
    new Set(
      $("h1, h2")
        .map((_, el) => clean($(el).text()))
        .get()
        .filter((t) => t.length > 3 && t.length < 120),
    ),
  ).slice(0, 6);

  const paragraphs = $("main p, article p, p")
    .map((_, el) => clean($(el).text()))
    .get()
    .filter((t) => t.length > 40)
    .slice(0, 4)
    .join(" ");

  const name = siteName || title.split(/[|\-–—:]/)[0].trim() || url.hostname;

  return {
    url: url.toString(),
    title,
    description,
    ogImage: absolute(meta("og:image") || meta("twitter:image")),
    brand: {
      name,
      description: description || paragraphs.slice(0, 280),
      headlines,
      summary: [description, headlines.slice(0, 3).join(". "), paragraphs]
        .filter(Boolean)
        .join(" ")
        .slice(0, 700),
      themeColor: meta("theme-color") || null,
      favicon:
        absolute($('link[rel="icon"]').attr("href") ?? $('link[rel="shortcut icon"]').attr("href")) ??
        absolute("/favicon.ico"),
    },
  };
}
