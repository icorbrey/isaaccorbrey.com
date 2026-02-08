<script lang="ts">
  import DotSeparated from "components/controls/DotSeparated.svelte";
  import CommentShowAllButton from "./CommentShowAllButton.svelte";
  import CommentText from "./CommentText.svelte";
  import { DateTime } from "luxon";
  import { renderRichText, type BlueskyThread } from "utils/bluesky";

  export let comment: BlueskyThread;
  export let level: number = 0;

  let showAll = false;
  let bodyContent = "";
  let quoteContent = "";
  let createdAtLabel = "";

  const normalizeLineBreaks = (html: string) =>
    html.replace(/\n+/g, "\n").replace(/\n/g, "<br />");

  const renderParagraphs = (html: string) => {
    const normalized = html.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const parts = normalized.split(/\n{2,}/).filter((part) => part.trim().length);
    return parts
      .map((part) => `<p>${part.replace(/\n/g, "<br />")}</p>`)
      .join("");
  };

  const borderColor =
    level % 8 == 0 ? "border-red-400"
    : level % 8 == 1 ? "border-orange-400"
    : level % 8 == 2 ? "border-yellow-400"
    : level % 8 == 3 ? "border-green-400"
    : level % 8 == 4 ? "border-cyan-400"
    : level % 8 == 5 ? "border-blue-400"
    : level % 8 == 6 ? "border-purple-400"
    : "border-pink-400";

  $: bodyContent = normalizeLineBreaks(renderRichText(comment.body, comment.facets));
  $: quoteContent = comment.quote
    ? renderParagraphs(renderRichText(comment.quote.body, comment.quote.facets))
    : "";
  let createdAtTime = "";
  let createdAtDate = "";
  $: createdAtTime = comment.createdAt
    ? DateTime.fromISO(comment.createdAt, { zone: "utc" }).toLocal().toFormat("h:mm a")
    : "";
  $: createdAtDate = comment.createdAt
    ? DateTime.fromISO(comment.createdAt, { zone: "utc" }).toLocal().toFormat("LLL d, yyyy")
    : "";
  $: createdAtLabel = comment.createdAt ? `${createdAtTime} ${createdAtDate}` : "";
</script>

<article class="flex flex-col items-start w-full min-w-0">
  <div class={`pt-2 pb-2 flex flex-col items-start border-l-4 pr-3 pl-3 w-full min-w-0 ${borderColor}`}>
    <header class="pt-1 min-w-0">
      <a
        class="group no-underline hover:underline flex flex-row items-center gap-1.5 min-w-0"
        href={comment.author.href}
      >
        <img
          class="w-8 sm:w-9 rounded-full"
          src={comment.author.avatarSrc}
          alt={comment.author.handle}
        />
        <div class="flex flex-col leading-none min-w-0">
          {#if !!comment.author.displayName}
            <span class="text-fg-2 group-hover:text-fg-1">
              {comment.author.displayName}
            </span>
            <span class="text-fg-3 group-hover:text-fg-2">
              @{comment.author.handle}
            </span>
          {:else}
            <span class="text-fg-2 group-hover:text-fg-1">
              @{comment.author.handle}
            </span>
          {/if}
        </div>
      </a>
    </header>
    <main class="mt-3 mb-1 w-full min-w-0">
      <CommentText>
        {@html bodyContent}
      </CommentText>
    </main>
    {#if comment.embedExternal}
      <a
        class="mt-2 mb-2 w-full flex flex-col gap-0.5 rounded-lg border border-fg-4/40 bg-bg-2/60 px-3 py-2 text-[0.95rem] leading-tight text-fg-2 no-underline hover:text-fg-1 hover:border-fg-3"
        href={comment.embedExternal.uri}
        target="_blank"
        rel="noreferrer"
      >
        <span class="font-medium">
          {comment.embedExternal.title}
        </span>
        {#if comment.embedExternal.host}
          <span class="text-xs text-fg-3">
            {comment.embedExternal.host}
          </span>
        {/if}
      </a>
    {/if}
    {#if comment.quote}
      <aside class="mt-3 mb-2 w-full min-w-0 rounded-lg border border-fg-4/40 bg-bg-2/60 px-3 py-2">
        <div class="flex items-center justify-between gap-3 min-w-0 pb-2">
          <a
            class="flex items-center gap-2 no-underline hover:underline min-w-0"
            href={comment.quote.author.href}
          >
            <img
              class="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
              src={comment.quote.author.avatarSrc}
              alt={comment.quote.author.handle}
            />
            <div class="flex flex-col leading-none min-w-0">
              {#if !!comment.quote.author.displayName}
                <span class="text-fg-2">
                  {comment.quote.author.displayName}
                </span>
                <span class="text-fg-3">
                  @{comment.quote.author.handle}
                </span>
              {:else}
                <span class="text-fg-2">
                  @{comment.quote.author.handle}
                </span>
              {/if}
            </div>
          </a>
          <a
            class="text-fg-3 hover:text-fg-2 no-underline hover:underline whitespace-nowrap"
            href={comment.quote.permalink}
            aria-label="View quoted thread on Bluesky"
          >
            <span
              class="inline-block w-6 h-6"
              style="mask: url('/icons/quote.svg') no-repeat center / contain; -webkit-mask: url('/icons/quote.svg') no-repeat center / contain; background-color: currentColor;"
              aria-hidden="true"
            />
          </a>
        </div>
        <div class="mt-1 pb-1 text-base text-fg-3 leading-tight [&_p]:m-0 [&_p]:mb-2 last:[&_p]:mb-0 [&_a]:text-blue-300 [&_a]:no-underline hover:[&_a]:text-blue-400 hover:[&_a]:underline">
          {@html quoteContent}
        </div>
      </aside>
    {/if}
    {#if createdAtLabel}
      <div class="pt-2 text-sm text-fg-3 tracking-wide flex items-center leading-tight">
        <DotSeparated>
          <span>{createdAtTime}</span>
        </DotSeparated>
        <DotSeparated>
          <span>{createdAtDate}</span>
        </DotSeparated>
        <DotSeparated>
          <a
            href={comment.permalink}
            class="no-underline hover:underline hover:text-fg-2"
          >
            permalink
          </a>
        </DotSeparated>
      </div>
    {/if}
  </div>
  <section class="w-full min-w-0 pl-1">
    <ul class="">
      {#if comment.replies.length < 6 || showAll}
        {#each comment.replies as reply}
          <li class="mt-1 first:mt-0">
            <svelte:self comment={reply} level={level + 1} />
          </li>
        {/each}
      {:else}
        {#each comment.replies.slice(0, 4) as reply}
          <li class="mt-1 first:mt-0">
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
