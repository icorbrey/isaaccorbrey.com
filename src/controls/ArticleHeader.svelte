<script lang="ts">
	import TagPill from "../features/tags/TagPill.svelte";
	import { getPublishedOnText } from "../utils/dates";
	import type { Tag } from "../features/tags/store";

	export let publishedOn: Date | undefined;
	export let tagDescriptions: Tag[];
	export let readingTime: string;
	export let tags: string[] = [];
	export let title: string;
</script>

<header>
	<h1>{title}</h1>
	<ul class="tags">
		{#each tags as tag}
			<li>
				<TagPill
					description={tagDescriptions.find((t) => t.id === tag)?.data
						?.description}
					href={`/tags/${tag}`}
				>
					{tag}
				</TagPill>
			</li>
		{/each}
	</ul>
	<p aria-hidden="true">
		{getPublishedOnText(publishedOn)}
		&CenterDot;
		{readingTime}
	</p>
</header>

<style>
	header {
		padding: 4rem 0rem;
	}

	h1 {
		line-height: 3rem;
	}

	p {
		font-size: 1.2rem;
		margin-top: 1rem;
	}

	.tags {
		flex-flow: row wrap;
		display: flex;

		padding: 0;
		margin: 0;
	}

	li {
		list-style: none;
	}

	li:not(:first-child) {
		margin-left: 0.25rem;
	}
</style>
