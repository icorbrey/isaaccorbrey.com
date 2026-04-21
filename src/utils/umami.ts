const WEBSITE_ID = "a3bbe030-d50e-4eb9-8a98-25056eeed5d2";
const BASE_URL = "https://api.umami.is/v1";
const CACHE_TTL_MS = 5 * 60 * 1000;
const START_AT = new Date("2024-01-01").getTime();

type CacheEntry = {
  views: number;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export const getPageViews = async (path: string): Promise<number | undefined> => {
  const apiKey = import.meta.env.UMAMI_API_KEY;
  if (!apiKey) return undefined;

  const now = Date.now();
  const cached = cache.get(path);
  if (cached && now < cached.expiresAt) {
    console.log(`[umami] cache hit: ${path}`);
    return cached.views;
  }
  console.log(`[umami] cache miss: ${path}`);

  const url = new URL(`${BASE_URL}/websites/${WEBSITE_ID}/metrics`);
  url.searchParams.set("startAt", String(START_AT));
  url.searchParams.set("endAt", String(now));
  url.searchParams.set("type", "url");
  url.searchParams.set("limit", "1");
  url.searchParams.set("search", path);

  try {
    const res = await fetch(url, {
      headers: {
        "x-umami-api-key": apiKey,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`[umami] ${res.status}`, await res.text());
      return undefined;
    }

    const data = (await res.json()) as { x: string; y: number }[];
    const views = data[0]?.y ?? 0;

    cache.set(path, { views, expiresAt: now + CACHE_TTL_MS });
    console.log(`[umami] ${path}: ${views} views`);
    return views;
  } catch (e) {
    console.error("[umami] fetch threw:", e);
    return undefined;
  }
};
