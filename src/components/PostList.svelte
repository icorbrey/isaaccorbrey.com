<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import { DateTime } from "luxon";

    export let posts: CollectionEntry<"posts">[] = [];

    const recencyThreshold = DateTime.now().minus({ days: 40 });
    const isNew = (post: CollectionEntry<"posts">) =>
        recencyThreshold < post.data.date;
</script>

{#if 0 < posts.length}
    <ul>
        {#each posts as post}
            <li>
                <a href={`/posts/${post.slug}`}>
                    <span class="title">{post.data.title}</span>
                    <span class="date" class:new={isNew(post)}>
                        {post.data.date.toLocaleDateString("en-US", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "long",
                        })}
                    </span>
                </a>
            </li>
        {/each}
    </ul>
{:else}
    <p>Move along, nothing to see here.</p>
{/if}

<style>
    ul {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-auto-rows: auto;
        column-gap: 1rem;

        width: 100%;
        padding: 0;
    }

    li {
        display: contents;
        list-style: none;
    }

    a {
        display: contents;

        font-size: 1.5rem;
    }

    .title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    a:hover .title {
        text-decoration: underline;
    }

    .date {
        justify-content: flex-end;
        flex-flow: row nowrap;
        align-items: center;
        text-wrap: nowrap;
        display: flex;

        color: var(--foreground-2);
        font-size: 1.2rem;
    }

    .new {
        color: var(--orange-400);
        font-weight: 500;
    }

    .new::after {
        text-transform: uppercase;
        font-size: 0.75rem;
        content: "New!";

        background-color: var(--orange-400);
        color: var(--background-1);

        padding: 0.1rem 0.3rem;
        border-radius: 0.3rem;
        margin-left: 0.5rem;
    }
</style>
