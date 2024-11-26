import { noteSchema } from '../data/notes';
import { tagSchema } from '../data/tags';
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
