<script lang="ts">
    export let href: string;
</script>

<a {href}>
    <slot />
</a>

<style>
    a {
        font-size: 1.2rem;
        font-weight: 400;

        border: solid 0.1rem var(--foreground-4);
        color: var(--foreground-3);

        padding: 0.25rem 1.5rem;
        border-radius: 0.5rem;
    }

    a:hover {
        text-decoration: none;

        border-color: var(--foreground-3);
        color: var(--foreground-2);
    }
</style>
