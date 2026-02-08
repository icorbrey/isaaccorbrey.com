<script lang="ts">
  import { onMount } from "svelte";
  import { bluesky, type BlueskyThread } from "utils/bluesky";
  import CommentSection from "./CommentSection.svelte";

  export let uri: string;

  let threadData: BlueskyThread | null = null;
  let error: unknown = null;
  let newCount = 0;

  const storageKey = (value: string) => `comments:last-seen:${value}`;

  const getLastSeenCount = (key: string) => {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const setLastSeenCount = (key: string, count: number) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, String(count));
  };

  const computeNewCount = (thread: BlueskyThread) => {
    const key = storageKey(uri);
    const lastSeen = getLastSeenCount(key);
    const delta = lastSeen === null ? 0 : Math.max(0, thread.totalReplyCount - lastSeen);
    setLastSeenCount(key, thread.totalReplyCount);
    return delta;
  };

  onMount(async () => {
    try {
      const thread = await bluesky.fetchThread(uri);
      threadData = thread;
      newCount = computeNewCount(thread);
    } catch (err) {
      error = err;
    }
  });
</script>

{#if threadData}
  <CommentSection thread={threadData} {newCount} />
{:else if error}
  {error}
{/if}
