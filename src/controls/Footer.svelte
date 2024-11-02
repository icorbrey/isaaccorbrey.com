<script>
    import FooterIcon from "./FooterIcon.svelte";
</script>

<footer>
    <div class="text-links">
        <a href="https://ko-fi.com">Buy me a coffee</a>
        &CenterDot;
        <a href="https://github.com/sponsors/icorbrey">Sponsor me</a>
    </div>
    <div class="icon-links">
        <FooterIcon
            href="https://github.com/icorbrey"
            src="/logos/github.svg"
            text="GitHub"
        />
        <FooterIcon
            href="https://printables.com/@icorbrey"
            src="/logos/printables.svg"
            text="Printables"
        />
        <FooterIcon
            href="https://youtube.com/@icorbrey"
            src="/logos/youtube.svg"
            text="YouTube"
        />
        <FooterIcon
            href="https://bsky.app/@icorbrey"
            src="/logos/bluesky.svg"
            text="BlueSky"
        />
    </div>
</footer>

<style>
    footer {
        flex-flow: column nowrap;
        align-items: center;
        display: flex;
        gap: 0.5rem;

        padding-bottom: 1.5rem;
        padding-top: 4rem;
        margin-top: auto;
        width: 100%;

        font-size: 1.25rem;
    }

    .text-links {
        flex-flow: row nowrap;
        display: flex;
        gap: 0.5rem;

        color: var(--foreground-2);
    }

    .text-links a {
        color: var(--foreground-2);
    }

    .text-links a:hover {
        color: var(--foreground-1);
    }

    .icon-links {
        justify-content: center;
        flex-flow: row wrap;
        display: flex;
        gap: 0.45rem;
    }
</style>
