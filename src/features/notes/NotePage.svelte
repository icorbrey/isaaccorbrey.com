<script lang="ts">
	import Comments from '../../controls/Comments.svelte';
	import type { NoteFrontmatter } from './store';
	import NoteHeader from './NoteHeader.svelte';

	export let frontmatter: NoteFrontmatter;
</script>

<article>
	<NoteHeader
		publishedOn={frontmatter.publishedOn}
		readingTime={frontmatter.readingTime}
		title={frontmatter.title}
		tags={frontmatter.tags}
	/>
	<slot />
	<Comments />
</article>

<style>
	article {
		width: 100%;
	}
</style>
