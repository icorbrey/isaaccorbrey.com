import { z, type CollectionEntry } from "astro:content";

export const experienceSchema = z.object({
    endDate: z.string().date().optional(),
    startDate: z.string().date(),
    organization: z.string(),
    title: z.string(),
    tech: z.array(
        z.union([
            z.object({
                highlight: z.boolean().default(false),
                name: z.string(),
            }),
            z.string().transform(name => ({
                highlight: false,
                name
            }))
        ])
    ).default([]),
});

export type Experience = CollectionEntry<'experience'>;

export const experience = z.custom<Experience>(_ => true);
