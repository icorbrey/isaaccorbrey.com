<script lang="ts">
    import ArticleComments from "./ArticleComments.svelte";
    import ArticleHeader from "./ArticleHeader.svelte";
    import type { Tag } from "../features/tags/store";

    export let publishedOn: Date | undefined;
    export let tagDescriptions: Tag[];
    export let readingTime: string;
    export let tags: string[] = [];
    export let title: string;
</script>

<article>
    <ArticleHeader
        {tagDescriptions}
        {publishedOn}
        {readingTime}
        {title}
        {tags}
    />
    <slot />
    <ArticleComments />
</article>

<style>
    article {
        width: 100%;
    }
</style>
