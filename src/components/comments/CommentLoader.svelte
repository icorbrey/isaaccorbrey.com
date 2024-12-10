<script lang="ts">
  import { bluesky } from "utils/bluesky";
  import CommentSection from "./CommentSection.svelte";

  export let uri: string;
</script>

{#await bluesky.fetchThread(uri) then thread}
  <CommentSection {thread} />
{:catch error}
  {error}
{/await}
