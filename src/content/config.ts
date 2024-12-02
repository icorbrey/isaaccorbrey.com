import { defineCollection } from "astro:content";
import { noteSchema } from "stores/notes";
import { tagSchema } from "stores/tags";

export const collections = {
	notes: defineCollection({
		schema: noteSchema,
		type: 'content',
	}),
	tags: defineCollection({
		schema: tagSchema,
		type: 'data',
	})
};
