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

const fetchThread = async (uri: string): Promise<BlueskyThread> => {
  const params = new URLSearchParams({ uri });
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

export type BlueskyThread = {
  author: BlueskyUser;
  likeCount: number;
  repostCount: number;
  quoteCount: number;
  totalReplyCount: number,
  replies: BlueskyThread[];
  permalink: string;
  body: string;
}

const toThread = (thread: ThreadViewPost): BlueskyThread => {
  const replies = thread.replies?.filter(isThreadViewPost)?.map(toThread) ?? [];
  replies.sort((a, b) => b.likeCount - a.likeCount)

  const { authorDid, postId } = decomposePostUri(thread.post.uri);

  return ({
    totalReplyCount: replies.length + replies.reduce((acc, thread) => acc + thread.totalReplyCount, 0),
    permalink: `https://bsky.app/profile/${authorDid}/post/${postId}`,
    body: (thread.post.record as any).text ?? '',
    repostCount: thread.post.repostCount ?? 0,
    quoteCount: thread.post.quoteCount ?? 0,
    likeCount: thread.post.likeCount ?? 0,
    author: toAuthor(thread.post.author),
    replies,
  })
}
