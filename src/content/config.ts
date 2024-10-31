import { defineCollection, z } from "astro:content";

const posts = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        date: z.date(),
    }),
});

export const collections = {
    posts
};
