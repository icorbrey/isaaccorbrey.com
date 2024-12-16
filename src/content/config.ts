import { experienceSchema } from "stores/experience";
import { defineCollection } from "astro:content";
import { noteSchema } from "stores/notes";
import { tagSchema } from "stores/tags";

export const collections = {
	experience: defineCollection({
		schema: experienceSchema,
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
