import { getCollection, z, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export const postSchema = z.object({
	tags: z.array(z.string()).default([]),
	publishedOn: z.date().optional(),
	title: z.string(),
})

type PostsQuery = {
	includeDrafts?: boolean;
	limit?: number;
}

export const getPosts = async (query?: PostsQuery): Promise<Post[]> => {
	let posts = await getCollection("posts");

	posts.sort((a, b) =>
		!a.data.publishedOn && !b.data.publishedOn
			// Drafts should be sorted by title
			? a.data.title.localeCompare(b.data.title)
			: !!a.data.publishedOn && !!b.data.publishedOn
				// Published posts should be sorted by publication date
				? b.data.publishedOn?.getTime() - a.data.publishedOn?.getTime()
				// Drafts should always come before published posts
				: !a.data.publishedOn && !!b.data.publishedOn
					? -1
					: 1);

	if (!query?.includeDrafts) {
		console.log(posts)
		posts = posts.filter(p => !!p.data.publishedOn);
	}

	return !!query?.limit
		? posts.slice(0, query?.limit)
		: posts;
}
