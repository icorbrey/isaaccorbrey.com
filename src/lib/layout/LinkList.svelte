<script lang="ts">
    import Heading from '$lib/components/text/Heading.svelte';
    import Link from '$lib/components/text/Link.svelte';

    export let title: string;
    export let links: { to: string; label: string }[];
</script>

<div class="list">
    <Heading level={3}>{title}</Heading>
    <ul>
        {#each links as { to, label }}
            <li><Link {to}>{label}</Link></li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .list {
        ul {
            flex-flow: column nowrap;
            align-items: baseline;
            display: flex;
            padding-left: 21px;

            li {
                list-style: circle;
                flex: 0 0 auto;
            }
        }
    }
</style>
