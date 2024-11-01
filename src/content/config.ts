import { postSchema } from '../features/posts/collection';
import { defineCollection } from "astro:content";

export const collections = {
	posts: defineCollection({
		schema: postSchema,
		type: 'content',
	})
};
