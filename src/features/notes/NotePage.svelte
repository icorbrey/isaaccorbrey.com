<script lang="ts">
	import Comments from "../../controls/Comments.svelte";
	import type { NoteFrontmatter } from "./store";
	import NoteHeader from "./NoteHeader.svelte";
	import type { Tag } from "../tags/store";

	export let frontmatter: NoteFrontmatter;
	export let tagDescriptions: Tag[];
</script>

<article>
	<NoteHeader
		publishedOn={frontmatter.publishedOn}
		readingTime={frontmatter.readingTime}
		title={frontmatter.title}
		tags={frontmatter.tags}
		{tagDescriptions}
	/>
	<slot />
	<Comments />
</article>

<style>
	article {
		width: 100%;
	}
</style>
