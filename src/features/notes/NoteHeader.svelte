<script lang="ts">
    export let publishedOn: Date | undefined;
    export let tags: string[] = [];
    export let title: string;

    const dateText = !!publishedOn
        ? `Published on ${publishedOn.toLocaleDateString("en-US", {
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
            <li><a href={`/tags/${tag}`}>#{tag}</a></li>
        {/each}
    </ul>
    <p>{dateText}</p>
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

    .tags li a {
        text-transform: uppercase;
        letter-spacing: 0.0625rem;
        font-size: 0.875rem;
        font-weight: 500;

        border: solid 0.1rem var(--foreground-4);
        color: var(--foreground-3);

        padding: 0.125rem 0.5rem;
        border-radius: 1rem;
    }
</style>
