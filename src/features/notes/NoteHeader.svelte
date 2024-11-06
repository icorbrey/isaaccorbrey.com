<script lang="ts">
    import Tag from "../tags/Tag.svelte";

    export let publishedOn: Date | undefined;
    export let readingTime: string;
    export let tags: string[] = [];
    export let title: string;

    const dateText = !!publishedOn
        ? `Published on ${new Date(publishedOn).toLocaleDateString("en-US", {
              timeZone: "UTC",
              year: "numeric",
              day: "numeric",
              month: "long",
          })}`
        : "Draft";
</script>

<header>
    <h1>{title}</h1>
    <ul class="tags">
        {#each tags as tag}
            <li><Tag href={`/tags/${tag}`}>{tag}</Tag></li>
        {/each}
    </ul>
    <p>{dateText} &CenterDot; {readingTime}</p>
</header>

<style>
    header {
        padding: 4rem 0rem;
    }

    h1 {
        line-height: 3rem;
    }

    p {
        font-size: 1.2rem;
        margin-top: 1rem;
    }

    .tags {
        flex-flow: row wrap;
        display: flex;

        padding: 0;
        margin: 0;
    }

    li {
        list-style: none;
    }

    li:not(:first-child) {
        margin-left: 0.25rem;
    }
</style>
