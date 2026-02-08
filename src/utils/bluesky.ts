import { isThreadViewPost, type PostView, type ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import type { AppBskyFeedGetPostThread } from "@atproto/api";

const BASE_URI = "https://public.api.bsky.app";
const GET_POST_THREAD = "xrpc/app.bsky.feed.getPostThread";

const MATCH_POST_URI = /(?<author>did:plc:[a-z0-9]+)\/.*?\/(?<post>[a-z0-9]+)/i

const decomposePostUri = (uri: string): { authorDid: string, postId: string } =>{
  const groups = uri.match(MATCH_POST_URI)?.groups!;
  return ({
    authorDid: groups.author,
    postId: groups.post,
  });
}

const THREAD_DEPTH = 1000;

const fetchThread = async (uri: string): Promise<BlueskyThread> => {
  const params = new URLSearchParams({ uri, depth: String(THREAD_DEPTH) });
  const url = `${BASE_URI}/${GET_POST_THREAD}?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Accept": "application/json"
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw "Failed to fetch comment section.";
  }

  const data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!isThreadViewPost(data.thread)) {
    throw "Comment section does not exist.";
  }

  return toThread(data.thread);
}

const sortByLikes = (posts: ThreadViewPost[]): ThreadViewPost[] => {
  return posts.sort((a, b) => (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0))
}

export const bluesky = {
  fetchThread,
  sortByLikes,
};

export type BlueskyUser = {
  handle: string;
  displayName?: string;
  href: string;
  avatarSrc: string;
};

const toAuthor = (author: PostView['author']): BlueskyUser => ({
  handle: author.handle,
  displayName: author.displayName,
  href: `https://bsky.app/profile/${author.did}`,
  avatarSrc: author.avatar ?? '/fallback.svg',
})

const toEmbedAuthor = (author: {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string | null;
}): BlueskyUser => ({
  handle: author.handle,
  displayName: author.displayName,
  href: `https://bsky.app/profile/${author.did}`,
  avatarSrc: author.avatar ?? '/fallback.svg',
})

export type BlueskyThread = {
  author: BlueskyUser;
  likeCount: number;
  repostCount: number;
  quoteCount: number;
  totalReplyCount: number,
  replies: BlueskyThread[];
  permalink: string;
  body: string;
  facets: { index?: { byteStart?: number; byteEnd?: number }; features?: any[] }[];
  createdAt?: string;
  embedExternal?: {
    uri: string;
    title: string;
    host: string;
  } | null;
  quote?: {
    author: BlueskyUser;
    permalink: string;
    body: string;
    facets: { index?: { byteStart?: number; byteEnd?: number }; features?: any[] }[];
  } | null;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

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
      case "app.bsky.richtext.facet#link": {
        const href = feature.uri;
        if (href) {
          rendered = `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${rendered}</a>`;
        }
        break;
      }
      case "app.bsky.richtext.facet#mention": {
        const did = feature.did;
        if (did) {
          rendered = `<a href="https://bsky.app/profile/${escapeHtml(did)}" target="_blank" rel="noreferrer">${rendered}</a>`;
        }
        break;
      }
      case "app.bsky.richtext.facet#tag": {
        const tag = feature.tag;
        if (tag) {
          rendered = `<a href="https://bsky.app/hashtag/${escapeHtml(tag)}" target="_blank" rel="noreferrer">${rendered}</a>`;
        }
        break;
      }
      default:
        break;
    }
  }

  return rendered;
};

const applyInlineMarkdown = (html: string) => {
  const applyToText = (text: string) => {
    let rendered = text;
    rendered = rendered.replace(/`([^`]+)`/g, "<code>$1</code>");
    rendered = rendered.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    rendered = rendered.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");
    rendered = rendered.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    rendered = rendered.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    rendered = rendered.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    rendered = rendered.replace(/_([^_]+)_/g, "<em>$1</em>");
    rendered = rendered.replace(/~~([^~]+)~~/g, "<s>$1</s>");
    return rendered;
  };

  const parts = html.split(/(<[^>]+>)/g);
  return parts
    .map((part) => (part.startsWith("<") ? part : applyToText(part)))
    .join("");
};

export const renderRichText = (
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

  return applyInlineMarkdown(html);
};

const extractQuotedPost = (embed: any): BlueskyThread['quote'] => {
  if (!embed || embed.$type !== "app.bsky.embed.record#view") return null;
  const record = embed.record;
  if (!record || record.$type !== "app.bsky.embed.record#viewRecord") return null;

  const { authorDid, postId } = decomposePostUri(record.uri ?? "");
  const value = record.value ?? {};

  return {
    author: toEmbedAuthor(record.author),
    permalink: `https://bsky.app/profile/${authorDid}/post/${postId}`,
    body: value.text ?? "",
    facets: value.facets ?? [],
  };
};

const extractExternalEmbed = (embed: any): BlueskyThread['embedExternal'] => {
  if (!embed || embed.$type !== "app.bsky.embed.external#view") return null;
  const external = embed.external;
  if (!external?.uri || !external?.title) return null;
  let host = "";
  try {
    host = new URL(external.uri).host.replace(/^www\./, "");
  } catch {
    host = "";
  }
  return {
    uri: external.uri,
    title: external.title,
    host,
  };
};

const toThread = (thread: ThreadViewPost): BlueskyThread => {
  const replies = thread.replies?.filter(isThreadViewPost)?.map(toThread) ?? [];
  replies.sort((a, b) => scoreThread(b) - scoreThread(a))

  const { authorDid, postId } = decomposePostUri(thread.post.uri);
  const record = thread.post.record as any;
  const quote = extractQuotedPost(thread.post.embed);
  const embedExternal = extractExternalEmbed(thread.post.embed);

  return ({
    totalReplyCount: replies.length + replies.reduce((acc, thread) => acc + thread.totalReplyCount, 0),
    permalink: `https://bsky.app/profile/${authorDid}/post/${postId}`,
    body: record?.text ?? '',
    facets: record?.facets ?? [],
    createdAt: record?.createdAt,
    embedExternal,
    quote,
    repostCount: thread.post.repostCount ?? 0,
    quoteCount: thread.post.quoteCount ?? 0,
    likeCount: thread.post.likeCount ?? 0,
    author: toAuthor(thread.post.author),
    replies,
  })
}

const scoreThread = (thread: BlueskyThread) => {
  const score =
    (thread.likeCount ?? 0) * 2 +
    (thread.repostCount ?? 0) * 1.5 +
    (thread.quoteCount ?? 0) * 1 +
    (thread.totalReplyCount ?? 0) * 0.5;
  const createdAt = thread.createdAt ? Date.parse(thread.createdAt) : 0;
  return score + createdAt / 1e15;
};
