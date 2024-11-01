import { getCollection, z } from "astro:content";

export const postSchema = z.object({
	title: z.string(),
	tags: z.array(z.string()).optional(),
	date: z.date(),
})

export const getAllPosts = async () => await getCollection("posts");

export const getMostRecentPosts = async (limit: number) => {
	const posts = await getAllPosts();
	posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
	return posts.slice(0, limit);
}
