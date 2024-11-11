<script lang="ts">
	import Article from "../../controls/Article.svelte";
	import type { NoteFrontmatter } from "./store";
	import type { Tag } from "../tags/store";

	export let frontmatter: NoteFrontmatter;
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
</Article>
