<script lang="ts">
    import Article from "../../controls/Article.svelte";
    import type { ProjectFrontmatter } from "./store";
    import type { Tag } from "../tags/store";
    import ProjectLinks from "./ProjectLinks.svelte";

    export let frontmatter: ProjectFrontmatter;
    export let tagDescriptions: Tag[];
</script>

<Article
    publishedOn={frontmatter.publishedOn}
    readingTime={frontmatter.readingTime}
    title={frontmatter.title}
    tags={frontmatter.tags}
    {tagDescriptions}
>
    <slot />
    <ProjectLinks links={frontmatter.links} />
</Article>
