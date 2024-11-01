<script lang="ts">
    export let href: string;
    export let text: string;
    export let src: string;
</script>

<a {href}>
    <img {src} alt={`${text} logo`} />
    <span>{text}</span>
</a>

<style>
    a {
        flex-flow: row nowrap;
        align-items: center;
        display: flex;
        gap: 0.45rem;

        border: solid 1px var(--foreground-3);
        border-radius: 0.5rem;
        padding: 0.2rem 0.5rem;

        color: var(--foreground-2);
    }

    a:hover {
        color: var(--foreground-1);
    }

    img {
        height: 1rem;
    }

    span {
        text-transform: uppercase;
        letter-spacing: 0.0625rem;
        font-size: 0.875rem;
        font-weight: 500;
    }
</style>
