import type { BaseSchema, z } from "astro:content";

export const buildQuery = <S extends BaseSchema, T>(schema: S, fn: (query: z.infer<S>) => Promise<T>) => {
    return (query: Partial<z.infer<S>>) => fn(schema.parse(query))
}
