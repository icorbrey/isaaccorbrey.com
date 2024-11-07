import type { BaseSchema, z } from "astro:content";

export const buildQuery = <S extends BaseSchema, T>(schema: S, fn: (query: z.infer<S>) => Promise<T>) => {
	return (query: z.input<S>) => fn(schema.parse(query))
}
