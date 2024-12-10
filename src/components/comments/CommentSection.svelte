<script lang="ts">
  import type { ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
  import { bluesky } from "utils/bluesky";

  export let postUri: string;

  const threadPromise = bluesky.fetchThread(postUri);
</script>

{#await threadPromise}
  <p>
    Loading comments...
  </p>
{:then thread}
  <p>Loaded!</p>
{:catch error}
  <p>{error}</p>
{/await}
