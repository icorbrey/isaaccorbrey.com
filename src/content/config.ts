import { projectSchema } from '../features/projects/store';
import { noteSchema } from '../features/notes/store';
import { tagSchema } from '../features/tags/store';
import { defineCollection } from "astro:content";

export const collections = {
	projects: defineCollection({
		schema: projectSchema,
		type: 'content',
	}),
	notes: defineCollection({
		schema: noteSchema,
		type: 'content',
	}),
	tags: defineCollection({
		schema: tagSchema,
		type: 'data',
	})
};
