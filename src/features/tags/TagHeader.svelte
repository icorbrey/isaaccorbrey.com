<script lang="ts">
    import Tag from "./Tag.svelte";

    export let tag: string;
    export let description: string | undefined;
</script>

<header>
    <h1><Tag large>{tag}</Tag></h1>
    {#if !!description}
        <p>{description}</p>
    {:else}
        <p><i>No description yet.</i></p>
    {/if}
</header>

<style>
    header {
        padding: 4rem 0rem;
    }
</style>
