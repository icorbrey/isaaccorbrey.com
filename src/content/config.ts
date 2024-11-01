import { noteSchema } from '../features/notes/collection';
import { defineCollection } from "astro:content";

export const collections = {
	notes: defineCollection({
		schema: noteSchema,
		type: 'content',
	}),
};
