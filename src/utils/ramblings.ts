import sanitizeHtml from "sanitize-html";
import { readFile } from "node:fs/promises";
import readingTime from "reading-time";

const DID_PATH = "public/.well-known/atproto-did";
const PLC_DIRECTORY_BASE = "https://plc.directory";
const PUBLICATION_URI =
  "at://did:plc:zviscnpwyvj6y32agi5davn5/site.standard.publication/3me7e3v47hr2l";
const CACHE_TTL_MS = 12 * 60 * 1000;

type PdsRecord = {
  cid: string;
  uri: string;
  value: Record<string, any>;
};

type RamblingSummary = {
  cid: string;
  path: string;
  title: string;
  description?: string;
  publishedAt?: string;
  tags: string[];
};

type RamblingsCache = {
  expiresAt: number;
  did: string;
  pdsUrl: string;
  records: PdsRecord[];
  pathMap: Map<string, PdsRecord>;
  cidMap: Map<string, string>;
  rkeyMap: Map<string, string>;
};

type RenderedRambling = {
  html: string;
  title: string;
  description?: string;
  publishedAt?: string;
  path: string;
  tags: string[];
  readingTime?: string;
  blueskyPostUri?: string;
  documentUri: string;
};

type RamblingsPublication = {
  title: string;
  description?: string;
};

let cache: RamblingsCache | null = null;
let didCache: string | null = null;

const normalizePath = (path: string) => path.replace(/^\/+/, "");

const getDidFromPublication = () => {
  const match = PUBLICATION_URI.match(/^at:\/\/([^/]+)\//);
  return match?.[1] ?? null;
};

const normalizeSlug = (slug: string | string[]) =>
  normalizePath(
    Array.isArray(slug) ? slug.map(decodeURIComponent).join("/") : slug,
  );

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getDid = async () => {
  if (didCache) return didCache;

  try {
    const did = (await readFile(DID_PATH, "utf-8")).trim();
    if (did) {
      didCache = did;
      return did;
    }
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.info("[ramblings] DID file unavailable, using publication DID.");
    }
  }

  const fallbackDid = getDidFromPublication();
  if (!fallbackDid) {
    throw new Error("Missing ATProto DID.");
  }

  didCache = fallbackDid;
  return fallbackDid;
};

const resolvePdsUrl = async (did: string) => {
  const res = await fetch(`${PLC_DIRECTORY_BASE}/${did}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to resolve DID document for ${did}.`);
  }

  const doc = (await res.json()) as {
    service?: { id?: string; type?: string; serviceEndpoint?: string }[];
  };

  const service = doc.service?.find(
    (entry) =>
      entry.id?.endsWith("#atproto_pds") ||
      entry.type === "AtprotoPersonalDataServer",
  );

  if (!service?.serviceEndpoint) {
    throw new Error("No atproto PDS endpoint found in DID document.");
  }

  return service.serviceEndpoint.replace(/\/$/, "");
};

const fetchAllRecords = async (did: string, pdsUrl: string) => {
  const records: PdsRecord[] = [];
  let cursor: string | undefined = undefined;

  do {
    const url = new URL(`${pdsUrl}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set("repo", did);
    url.searchParams.set("collection", "site.standard.document");
    url.searchParams.set("limit", "100");
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error("Failed to list rambling records.");
    }

    const data = (await res.json()) as {
      cursor?: string;
      records?: PdsRecord[];
    };

    if (data.records?.length) {
      records.push(...data.records);
    }

    cursor = data.cursor;
  } while (cursor);

  return records;
};

const buildCache = async (): Promise<RamblingsCache> => {
  const did = await getDid();
  const pdsUrl = await resolvePdsUrl(did);
  const allRecords = await fetchAllRecords(did, pdsUrl);

  const filtered = allRecords.filter((record) => {
    const value = record.value ?? {};
    return value.site === PUBLICATION_URI && typeof value.path === "string";
  });

  const pathMap = new Map<string, PdsRecord>();
  const cidMap = new Map<string, string>();
  const rkeyMap = new Map<string, string>();

  filtered.forEach((record) => {
    const path = normalizePath(record.value.path);
    pathMap.set(path, record);
    cidMap.set(record.cid, path);
    const parsed = parseAtUri(record.uri);
    if (parsed?.rkey) {
      rkeyMap.set(parsed.rkey, path);
    }
  });

  return {
    expiresAt: Date.now() + CACHE_TTL_MS,
    did,
    pdsUrl,
    records: filtered,
    pathMap,
    cidMap,
    rkeyMap,
  };
};

const getCache = async () => {
  if (cache && Date.now() < cache.expiresAt) {
    if (import.meta.env?.DEV) {
      console.info("[ramblings] cache hit");
    }
    return cache;
  }

  if (import.meta.env?.DEV) {
    console.info("[ramblings] cache miss");
  }
  cache = await buildCache();
  return cache;
};

const refreshCache = async () => {
  if (import.meta.env?.DEV) {
    console.info("[ramblings] cache refresh");
  }
  cache = await buildCache();
  return cache;
};

const parseAtUri = (uri: string) => {
  const match = uri.match(/^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  const [, repo, collection, rkey] = match;
  return { repo, collection, rkey };
};

const extractTitle = (value: Record<string, any>) =>
  value.title ||
  value.name ||
  value.content?.title ||
  normalizePath(value.path || "Untitled");

const extractDescription = (value: Record<string, any>) =>
  value.description ||
  value.summary ||
  value.content?.description ||
  value.textContent?.split("\n").find(Boolean);

const extractPublishedAt = (value: Record<string, any>) =>
  value.publishedAt ||
  value.createdAt ||
  value.indexedAt ||
  value.updatedAt ||
  value.content?.publishedAt;

const byteSlice = (text: string, byteStart: number, byteEnd: number) => {
  const encoder = new TextEncoder();
  const totalBytes = encoder.encode(text).length;
  let currentByte = 0;
  let startIndex = 0;
  let endIndex = text.length;
  let endFound = false;

  let index = 0;
  for (const char of text) {
    const charBytes = encoder.encode(char).length;
    const nextByte = currentByte + charBytes;

    if (currentByte <= byteStart && byteStart < nextByte) {
      startIndex = index;
    }
    if (currentByte < byteEnd && byteEnd <= nextByte) {
      endIndex = index + char.length;
      endFound = true;
      break;
    }

    currentByte = nextByte;
    index += char.length;
  }

  if (byteStart <= 0) {
    startIndex = 0;
  }

  if (!endFound && byteEnd >= totalBytes) {
    endIndex = text.length;
  }

  return text.slice(startIndex, endIndex);
};

const renderFacetText = (text: string, features: Record<string, any>[]) => {
  let rendered = escapeHtml(text);

  for (const feature of features ?? []) {
    switch (feature.$type) {
      case "blog.pckt.richtext.facet#link": {
        const href = feature.uri || feature.url;
        if (href) {
          rendered = `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${rendered}</a>`;
        }
        break;
      }
      case "blog.pckt.richtext.facet#bold":
        rendered = `<strong>${rendered}</strong>`;
        break;
      case "blog.pckt.richtext.facet#italic":
        rendered = `<em>${rendered}</em>`;
        break;
      case "blog.pckt.richtext.facet#underline":
        rendered = `<u>${rendered}</u>`;
        break;
      case "blog.pckt.richtext.facet#strikethrough":
        rendered = `<s>${rendered}</s>`;
        break;
      case "blog.pckt.richtext.facet#code":
        rendered = `<code>${rendered}</code>`;
        break;
      case "blog.pckt.richtext.facet#highlight":
        rendered = `<mark>${rendered}</mark>`;
        break;
      case "blog.pckt.richtext.facet#id":
        if (feature.id) {
          rendered = `<span id="${escapeHtml(feature.id)}">${rendered}</span>`;
        }
        break;
      case "blog.pckt.richtext.facet#didMention": {
        const did = feature.did;
        if (did) {
          rendered = `<a href="https://bsky.app/profile/${escapeHtml(did)}" target="_blank" rel="noreferrer">${rendered}</a>`;
        }
        break;
      }
      case "blog.pckt.richtext.facet#atMention": {
        const handle = feature.handle;
        if (handle) {
          rendered = `<a href="https://bsky.app/profile/${escapeHtml(handle)}" target="_blank" rel="noreferrer">${rendered}</a>`;
        }
        break;
      }
      default:
        break;
    }
  }

  return rendered;
};

const renderRichText = (
  text: string,
  facets: { index?: { byteStart?: number; byteEnd?: number }; features?: any[] }[],
) => {
  if (!facets?.length) {
    return escapeHtml(text);
  }

  const totalBytes = new TextEncoder().encode(text).length;
  const sorted = [...facets].sort(
    (a, b) =>
      (a.index?.byteStart ?? 0) - (b.index?.byteStart ?? 0),
  );

  let cursor = 0;
  let html = "";

  for (const facet of sorted) {
    const start = facet.index?.byteStart ?? 0;
    const end = facet.index?.byteEnd ?? start;

    if (cursor < start) {
      html += escapeHtml(byteSlice(text, cursor, start));
    }

    html += renderFacetText(byteSlice(text, start, end), facet.features ?? []);
    cursor = end;
  }

  if (cursor < totalBytes) {
    html += escapeHtml(byteSlice(text, cursor, totalBytes));
  }

  return html;
};

const blobToUrl = (did: string, pdsUrl: string, blob: any) => {
  const cid = blob?.ref?.$link || blob?.cid || blob?.ref;
  if (!cid) return null;
  const url = new URL(`${pdsUrl}/xrpc/com.atproto.sync.getBlob`);
  url.searchParams.set("did", did);
  url.searchParams.set("cid", cid);
  return url.toString();
};

const getContentItems = async (
  content: Record<string, any>,
  did: string,
  pdsUrl: string,
) => {
  if (Array.isArray(content?.items)) {
    return content.items;
  }

  const blobUrl = blobToUrl(did, pdsUrl, content?.blob);
  if (!blobUrl) return null;

  const res = await fetch(blobUrl, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;

  const blobData = (await res.json()) as Record<string, any>;
  return blobData.items ?? blobData.content?.items ?? null;
};

const getTextValue = (block: Record<string, any>) =>
  block.text ?? block.plaintext ?? block.attrs?.text ?? "";

const getChildren = (block: Record<string, any>) =>
  block.items ?? block.content ?? block.children ?? [];

const renderBlocks = async (
  blocks: Record<string, any>[],
  did: string,
  pdsUrl: string,
): Promise<string> => {
  const rendered = await Promise.all(
    (blocks ?? []).map((block) => renderBlock(block, did, pdsUrl)),
  );
  return rendered.filter(Boolean).join("");
};

const renderBlock = async (
  block: Record<string, any>,
  did: string,
  pdsUrl: string,
): Promise<string> => {
  switch (block.$type) {
    case "blog.pckt.block.heading": {
      const level = Math.min(Math.max(block.level ?? 1, 1), 6);
      const text = getTextValue(block);
      const facets = block.facets ?? block.attrs?.facets ?? [];
      return `<h${level}>${renderRichText(text, facets)}</h${level}>`;
    }
    case "blog.pckt.block.text": {
      const text = getTextValue(block);
      const facets = block.facets ?? block.attrs?.facets ?? [];
      return `<p>${renderRichText(text, facets)}</p>`;
    }
    case "blog.pckt.block.blockquote": {
      const children = getChildren(block);
      const inner = children.length
        ? await renderBlocks(children, did, pdsUrl)
        : renderRichText(getTextValue(block), block.facets ?? []);
      return `<blockquote>${inner}</blockquote>`;
    }
    case "blog.pckt.block.bulletList": {
      const items = getChildren(block);
      return `<ul>${await renderBlocks(items, did, pdsUrl)}</ul>`;
    }
    case "blog.pckt.block.orderedList": {
      const items = getChildren(block);
      const start = block.start ?? block.attrs?.start;
      const startAttr = start ? ` start="${start}"` : "";
      return `<ol${startAttr}>${await renderBlocks(items, did, pdsUrl)}</ol>`;
    }
    case "blog.pckt.block.listItem": {
      const children = getChildren(block);
      if (children.length === 1 && children[0]?.$type === "blog.pckt.block.text") {
        const child = children[0];
        const text = getTextValue(child);
        const facets = child.facets ?? child.attrs?.facets ?? [];
        return `<li>${renderRichText(text, facets)}</li>`;
      }

      const inner = children.length
        ? await renderBlocks(children, did, pdsUrl)
        : renderRichText(getTextValue(block), block.facets ?? []);
      return `<li>${inner}</li>`;
    }
    case "blog.pckt.block.codeBlock": {
      const code = block.code ?? block.attrs?.code ?? "";
      const language = block.language ?? block.attrs?.language;
      const className = language ? ` class="language-${escapeHtml(language)}"` : "";
      return `<pre><code${className}>${escapeHtml(code)}</code></pre>`;
    }
    case "blog.pckt.block.horizontalRule":
      return "<hr />";
    case "blog.pckt.block.hardBreak":
      return "<br />";
    case "blog.pckt.block.image": {
      const attrs = block.attrs ?? {};
      const src = attrs.src ?? blobToUrl(did, pdsUrl, attrs.blob);
      if (!src) return "";
      const alt = attrs.alt ? ` alt="${escapeHtml(attrs.alt)}"` : "";
      const title = attrs.title ? ` title="${escapeHtml(attrs.title)}"` : "";
      const width = attrs.width ? ` width="${attrs.width}"` : "";
      const height = attrs.height ? ` height="${attrs.height}"` : "";
      return `<img src="${escapeHtml(src)}"${alt}${title}${width}${height} loading="lazy" />`;
    }
    case "blog.pckt.block.website": {
      const attrs = block.attrs ?? {};
      const href = attrs.url ?? attrs.href ?? attrs.src;
      const title = attrs.title ?? attrs.name ?? href;
      const description = attrs.description ?? attrs.summary ?? "";
      if (!href) return "";
      const titleHtml = title ? `<strong>${escapeHtml(title)}</strong>` : "";
      const descriptionHtml = description ? `<br /><span>${escapeHtml(description)}</span>` : "";
      return `<div class="pckt-website"><a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${titleHtml}${descriptionHtml}</a></div>`;
    }
    case "blog.pckt.block.iframe": {
      const attrs = block.attrs ?? {};
      const src = attrs.src ?? attrs.url;
      if (!src) return "";
      const title = attrs.title ? ` title="${escapeHtml(attrs.title)}"` : "";
      const height = attrs.height ? ` height="${attrs.height}"` : "";
      const width = attrs.width ? ` width="${attrs.width}"` : "";
      const allow = attrs.allow ? ` allow="${escapeHtml(attrs.allow)}"` : "";
      return `<iframe src="${escapeHtml(src)}"${title}${height}${width}${allow} loading="lazy"></iframe>`;
    }
    case "blog.pckt.block.blueskyEmbed": {
      const uri = block.uri ?? block.attrs?.uri ?? block.attrs?.url;
      if (!uri) return "";
      return `<p><a href="${escapeHtml(uri)}" target="_blank" rel="noreferrer">View on Bluesky</a></p>`;
    }
    case "blog.pckt.block.gallery": {
      const attrs = block.attrs ?? {};
      const items = attrs.items ?? attrs.images;
      if (!Array.isArray(items)) {
        return `<div class="pckt-gallery">Gallery unavailable.</div>`;
      }
      const images = items
        .map((item: any) => blobToUrl(did, pdsUrl, item?.blob))
        .filter((src): src is string => Boolean(src))
        .map((src) => `<img src="${escapeHtml(src)}" loading="lazy" />`)
        .join("");
      return images
        ? `<div class="pckt-gallery">${images}</div>`
        : `<div class="pckt-gallery">Gallery unavailable.</div>`;
    }
    case "blog.pckt.block.taskList": {
      const items = getChildren(block);
      return `<ul class="task-list">${await renderBlocks(items, did, pdsUrl)}</ul>`;
    }
    case "blog.pckt.block.taskItem": {
      const checked = block.checked ?? block.attrs?.checked;
      const prefix = checked ? "[x] " : "[ ] ";
      const text = renderRichText(getTextValue(block), block.facets ?? []);
      return `<li><span class="task-status">${prefix}</span>${text}</li>`;
    }
    case "blog.pckt.block.table": {
      const rows = getChildren(block);
      const body = await renderBlocks(rows, did, pdsUrl);
      return `<table>${body}</table>`;
    }
    case "blog.pckt.block.tableRow": {
      const cells = getChildren(block);
      return `<tr>${await renderBlocks(cells, did, pdsUrl)}</tr>`;
    }
    case "blog.pckt.block.tableCell": {
      const children = getChildren(block);
      const inner = children.length
        ? await renderBlocks(children, did, pdsUrl)
        : renderRichText(getTextValue(block), block.facets ?? []);
      return `<td>${inner}</td>`;
    }
    case "blog.pckt.block.tableHeader": {
      const children = getChildren(block);
      const inner = children.length
        ? await renderBlocks(children, did, pdsUrl)
        : renderRichText(getTextValue(block), block.facets ?? []);
      return `<th>${inner}</th>`;
    }
    case "blog.pckt.block.mention": {
      const didValue = block.did ?? block.attrs?.did;
      const handle = block.handle ?? block.attrs?.handle;
      const label = handle || didValue || getTextValue(block);
      if (!label) return "";
      const href = didValue
        ? `https://bsky.app/profile/${escapeHtml(didValue)}`
        : handle
          ? `https://bsky.app/profile/${escapeHtml(handle)}`
          : "#";
      return `<a href="${href}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
    }
    default:
      return "";
  }
};

const sanitizeContent = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "pre",
      "code",
      "blockquote",
      "hr",
      "br",
      "img",
      "a",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "iframe",
      "div",
      "span",
      "strong",
      "em",
      "u",
      "s",
      "mark",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "title", "height", "width", "allow", "loading"],
      "*": ["class", "style", "colspan", "rowspan", "id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

const renderFallback = (textContent: string) => {
  const paragraphs = textContent
    .split(/\n{2,}/g)
    .map((part) => part.trim())
    .filter(Boolean);
  return paragraphs.map((part) => `<p>${escapeHtml(part)}</p>`).join("");
};

export const getRamblingsIndex = async (): Promise<RamblingSummary[]> => {
  const { records } = await getCache();
  const summaries = records.map((record) => {
    const value = record.value ?? {};
    return {
      cid: record.cid,
      path: normalizePath(value.path),
      title: extractTitle(value),
      description: extractDescription(value),
      publishedAt: extractPublishedAt(value),
      tags: Array.isArray(value.tags) ? value.tags : [],
    };
  });

  summaries.sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  return summaries;
};

export const getRamblingBySlug = async (slug: string | string[]) => {
  const { pathMap, cidMap, rkeyMap } = await getCache();
  const normalized = normalizeSlug(slug);

  if (pathMap.has(normalized)) {
    return { record: pathMap.get(normalized)!, redirectPath: null };
  }

  const redirectPath = cidMap.get(normalized) ?? rkeyMap.get(normalized) ?? null;
  if (redirectPath) {
    return { record: null, redirectPath };
  }

  const refreshed = await refreshCache();
  const refreshedPath = normalizeSlug(slug);
  if (refreshed.pathMap.has(refreshedPath)) {
    return { record: refreshed.pathMap.get(refreshedPath)!, redirectPath: null };
  }

  return {
    record: null,
    redirectPath:
      refreshed.cidMap.get(refreshedPath) ??
      refreshed.rkeyMap.get(refreshedPath) ??
      null,
  };
};

export const getRamblingsPublication = async (): Promise<RamblingsPublication> => {
  const { did, pdsUrl } = await getCache();
  const parsed = parseAtUri(PUBLICATION_URI);
  if (!parsed) {
    throw new Error("Invalid ramblings publication URI.");
  }

  const url = new URL(`${pdsUrl}/xrpc/com.atproto.repo.getRecord`);
  url.searchParams.set("repo", parsed.repo || did);
  url.searchParams.set("collection", parsed.collection);
  url.searchParams.set("rkey", parsed.rkey);

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error("Failed to load ramblings publication.");
  }

  const data = (await res.json()) as { value?: Record<string, any> };
  const value = data.value ?? {};
  return {
    title: value.title || "Ramblings",
    description:
      value.description || value.summary || value.content?.description,
  };
};

export const renderRambling = async (
  record: PdsRecord,
): Promise<RenderedRambling> => {
  const { did, pdsUrl } = await getCache();
  const value = record.value ?? {};
  const content = value.content ?? {};

  let html = "";

  if (content.$type === "blog.pckt.content") {
    let items = await getContentItems(content, did, pdsUrl);
    if (items?.length) {
      if (
        items[0]?.$type === "blog.pckt.block.heading" &&
        Number(items[0]?.level ?? 1) === 1
      ) {
        items = items.slice(1);
      }
      html = await renderBlocks(items, did, pdsUrl);
    }
  }

  if (!html && value.textContent) {
    html = renderFallback(value.textContent);
  }

  html = sanitizeContent(html);

  return {
    html,
    title: extractTitle(value),
    description: extractDescription(value),
    publishedAt: extractPublishedAt(value),
    path: normalizePath(value.path),
    tags: Array.isArray(value.tags) ? value.tags : [],
    readingTime: value.textContent
      ? readingTime(value.textContent).text
      : undefined,
    blueskyPostUri: value.bskyPostRef?.uri,
    documentUri: record.uri,
  };
};

export type { RamblingSummary };
