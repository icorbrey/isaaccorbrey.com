<script lang="ts">
    type Project = {
        title: string;
        href: string;
        date: string;
        post: string;
        demo: string;
    };

    export let projects: Project[] = [];
</script>

{#if 0 < projects.length}{:else}
    <p>Move along, nothing to see here.</p>
{/if}
