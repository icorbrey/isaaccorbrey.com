<script lang="ts">
  import DotSeparated from "components/controls/DotSeparated.svelte";
  import CommentShowAllButton from "./CommentShowAllButton.svelte";
  import CommentText from "./CommentText.svelte";
  import { bluesky, type BlueskyThread } from "utils/bluesky";
  import { marked } from "marked";
  import { isThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

  export let comment: BlueskyThread;
  export let level: number = 0;

  let showAll = false;

  const borderColor =
    level % 8 == 0 ? "border-red-400"
    : level % 8 == 1 ? "border-orange-400"
    : level % 8 == 2 ? "border-yellow-400"
    : level % 8 == 3 ? "border-green-400"
    : level % 8 == 4 ? "border-cyan-400"
    : level % 8 == 5 ? "border-blue-400"
    : level % 8 == 6 ? "border-purple-400"
    : "border-pink-400";

  const bodyContent = marked.parse(comment.body);
</script>

<article class="flex flex-col items-start">
  <div class={`pt-1 flex flex-col items-start border-l-4 pr-3 ${borderColor}`}>
    <header class="ml-2 pt-1">
      <a
        class="group no-underline hover:underline flex flex-row items-center gap-1.5"
        href={comment.author.href}
      >
        <img
          class="w-8 sm:w-5 rounded-full"
          src={comment.author.avatarSrc}
          alt={comment.author.handle}
        />
        <div class="flex flex-col sm:flex-row sm:gap-2 leading-none">
          {#if !!comment.author.displayName}
            <span class="text-fg-2 group-hover:text-fg-1">
              {comment.author.displayName}
            </span>
            <span class="text-fg-3 group-hover:text-fg-2">
              {comment.author.handle}
            </span>
          {:else}
            <span class="text-fg-2 group-hover:text-fg-1">
              {comment.author.handle}
            </span>
          {/if}
        </div>
      </a>
    </header>
    <main class="ml-2 mt-2">
      <CommentText>
        {@html bodyContent}
      </CommentText>
    </main>
    <section class="ml-2 text-sm text-fg-3 flex tracking-wide">
      <DotSeparated>
        <span>
          {comment.likeCount}
          like{comment.likeCount !== 1 ? "s" : ""}
        </span>
      </DotSeparated>
      <DotSeparated>
        <span>
          {comment.repostCount}
          repost{comment.repostCount !== 1 ? "s" : ""}
        </span>
      </DotSeparated>
      <DotSeparated>
        <span>
          {comment.quoteCount}
          quote{comment.quoteCount !== 1 ? "s" : ""}
        </span>
      </DotSeparated>
      <DotSeparated>
        <a
          href={comment.permalink}
          class="no-underline hover:underline hover:text-fg-2"
        >
          permalink
        </a>
      </DotSeparated>
    </section>
  </div>
  <section class="w-full ml-1">
    <ul class="">
      {#if comment.replies.length < 6 || showAll}
        {#each comment.replies as reply}
          <li class="mt-0.5 first:mt-0">
            <svelte:self comment={reply} level={level + 1} />
          </li>
        {/each}
      {:else}
        {#each comment.replies.slice(0, 4) as reply}
          <li class="mt-0.5 first:mt-0">
            <svelte:self comment={reply} level={level + 1} />
          </li>
        {/each}
        <CommentShowAllButton
          count={comment.totalReplyCount - 5}
          on:click={() => (showAll = true)}
          level={level + 1}
        />
      {/if}
    </ul>
  </section>
</article>
