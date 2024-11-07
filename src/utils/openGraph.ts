import { z } from 'astro:content';

const isoDate = z.date().transform(d => d.toISOString())

export const articleSchema = z.object({
	"article:tag": z.array(z.string()).default([]),
	"article:expiration_time": isoDate.optional(),
	"article:published_time": isoDate.optional(),
	"article:modified_time": isoDate.optional(),
	"article:section": z.string().optional(),
});
