<script lang="ts">
    export let href: string;
</script>

<a {href}>
    <slot />
</a>

<style>
    a {
        text-decoration: none;
        color: var(--foreground-2);
    }

    a:hover {
        color: var(--foreground-1);
    }
</style>
