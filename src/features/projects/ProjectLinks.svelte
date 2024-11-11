<script lang="ts">
    import type { ProjectLink } from "./store";

    export let links: ProjectLink[] = [];
</script>

{#if 0 < links.length}
    <ul>
        {#each links as { href, text, description: title }}
            <li><a {href} {title}>{text}</a></li>
        {/each}
    </ul>
{/if}

<style>
    ul {
        flex-flow: column nowrap;
        display: flex;
        gap: 0.25rem;

        padding: 0;
        margin: 0;
    }

    li {
        list-style: none;
    }

    a {
        padding: 0.5rem 1rem;

        border: solid 1px var(--foreground-2);

        color: var(--foreground-2);
    }

    a:hover {
        color: var(--foreground-1);
    }
</style>
