<script lang="ts">
	import type { Post } from "./collection";
	import { DateTime } from "luxon";

	export let highlightNew: boolean = false;
	export let posts: Post[] = [];

	const isNewPost = (post: Post) =>
		DateTime.now().minus({ days: 40 }) <
		DateTime.fromJSDate(post.data.publishedOn);

	const isDraft = (post: Post) => !post.data.publishedOn;

	const getPublishedDate = (post: Post) =>
		post.data.publishedOn?.toLocaleDateString("en-US", {
			timeZone: "UTC",
			year: "numeric",
			month: "long",
		}) ?? "";
</script>

{#if 0 < posts.length}
	<ul>
		{#each posts as post}
			<li>
				<a href={`/posts/${post.slug}`}>
					<span class="title">{post.data.title}</span>
					<span
						class:new={highlightNew && isNewPost(post)}
						class:draft={isDraft(post)}
						class="date"
					>
						{getPublishedDate(post)}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p>Move along, nothing to see here.</p>
{/if}

<style>
	ul {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-auto-rows: auto;
		column-gap: 1rem;

		width: 100%;
		padding: 0;
	}

	li {
		display: contents;
		list-style: none;
	}

	a {
		display: contents;

		font-size: 1.5rem;
	}

	.title {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	a:hover .title {
		text-decoration: underline;
	}

	.date {
		justify-content: flex-end;
		flex-flow: row nowrap;
		align-items: center;
		text-wrap: nowrap;
		display: flex;

		color: var(--foreground-2);
		font-size: 1.2rem;
	}

	.date::after {
		text-transform: uppercase;
		letter-spacing: 0.05rem;
		font-size: 0.75rem;
		font-weight: 500;

		color: var(--background-1);

		padding: 0.1rem 0.3rem;
		border-radius: 0.3rem;
		margin-left: 0.5rem;
	}

	.draft::after {
		background-color: var(--foreground-2);
		content: "Draft";
	}
	.new {
		color: var(--orange-400);
		font-weight: 500;
	}

	.new::after {
		background-color: var(--orange-400);
		content: "New!";
	}
</style>
