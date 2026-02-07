<script lang="ts">
  import CommentShowAllButton from "./CommentShowAllButton.svelte";
  import { type BlueskyThread } from "utils/bluesky";
  import Comment from "./Comment.svelte";

  export let thread: BlueskyThread;

  let showAll = false;
</script>

<section class="mt-12">
  {#if 0 < thread.totalReplyCount}
    <h1 class="text-4xl font-bold text-fg-1 px-3">
      {thread.totalReplyCount} Comment{thread.totalReplyCount !== 1 ? "s" : ""}
    </h1>
    <p class="mt-2 text-xl px-3">
      Join the conversation
      <a
        href={thread.permalink}
        class="text-blue-300 hover:text-blue-400 no-underline hover:underline"
      >
        over on BlueSky!
      </a>
    </p>
  {:else}
    <h1 class="text-4xl font-bold text-fg-1 px-3">No comments yet</h1>
    <p class="mt-2 text-xl px-3">
      Start the conversation
      <a
        href={thread.permalink}
        class="text-blue-300 hover:text-blue-400 no-underline hover:underline"
      >
        over on BlueSky!
      </a>
    </p>
  {/if}
  <ul class="mt-8">
    {#if thread.replies.length < 6 || showAll}
      {#each thread.replies as reply}
        <li class="mt-0.5 first:mt-0">
          <Comment comment={reply} />
        </li>
      {/each}
    {:else}
      {#each thread.replies.slice(0, 4) as reply}
        <li class="mt-0.5 first:mt-0">
          <Comment comment={reply} />
        </li>
      {/each}
      <CommentShowAllButton
        count={thread.totalReplyCount - 5}
        on:click={() => (showAll = true)}
      />
    {/if}
  </ul>
</section>
