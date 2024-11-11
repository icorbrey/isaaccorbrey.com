<script lang="ts">
    export let description: string =
        "This tag does not yet have a description.";
    export let href: string | undefined = undefined;
    export let large: boolean = false;
</script>

{#if !!href}
    <a {href} title={description} class:large>
        #<slot />
    </a>
{:else}
    <span class:large>
        #<slot />
    </span>
{/if}

<style>
    a,
    span {
        padding: 0.125rem 0.5rem;
        border-radius: 1rem;

        text-transform: uppercase;
        letter-spacing: 0.0625rem;
        font-size: 0.875rem;
        font-weight: 500;

        border: solid 0.1rem var(--foreground-4);
        color: var(--foreground-3);
    }

    a:hover {
        color: var(--foreground-2);
    }

    .large {
        font-size: 2.5rem;

        padding: 0.25rem 1.25rem;
        border-radius: 3rem;
    }
</style>
