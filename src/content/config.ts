import { noteSchema } from '../features/notes/store';
import { tagSchema } from '../features/tags/store';
import { defineCollection } from "astro:content";

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
