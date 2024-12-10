import { isThreadViewPost, type ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import type { AppBskyFeedGetPostThread } from "@atproto/api";

const BASE_URI = "https://public.api.bsky.app";

const GET_POST_THREAD = "xrpc/app.bsky.feed.getPostThread";

const fetchThread = async (uri: string): Promise<ThreadViewPost> => {
  const params = new URLSearchParams({ uri });
  const url = `${BASE_URI}/${GET_POST_THREAD}/${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Accept": "application/json"
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw "Failed to fetch thread.";
  }

  const data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!isThreadViewPost(data.thread)) {
    throw "Thread does not exist.";
  }

  return data.thread;
}

const sortByLikes = (a: unknown, b: unknown): number => {
  if (!isThreadViewPost(a) || !isThreadViewPost(b)) {
    return 0;
  }

  return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
}

export const bluesky = {
  fetchThread,
  sortByLikes,
};
