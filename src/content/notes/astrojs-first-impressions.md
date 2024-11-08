---
title: "Astro: First impressions"
description: |
    My first impressions of Astro, a web framework for content-driven websites.
tags: [astro, zod]
publishedOn: 2024-11-07
---

Hey all! This is the first post I've written in a while, and the first that'll
be published on my personal site instead of a site like Medium. I have found
that I barely get anything from posting on Medium, and it's too gamified to
really enjoy posting there anyway. Hopefully having something low-stress like
this site will help me post more.

When I was first trying to get my personal site up and running, I was looking
at frameworks like Gatsby or [Jekyll][jekyll]. However,
[Gatsby looks like it's about dead][gatsby-dead] and I wasn't really looking to
use GitHub pages for Jekyll, as I don't know Ruby and don't really want to
learn. I came across a relatively new framework called [Astro][astro] in my
search and after getting things how I like them, I'm enjoying using it quite a
lot.

## The Astro component format is interesting

As someone who is more used to client-side components libraries,
[Astro's components][astro-components] are a novelty to me. Essentially, all of
the JavaScript functionality in Astro components is gated to the server side;
you cannot have client-side interactivity in Astro components as by default
Astro doesn't ship _any_ JavaScript. This isn't great for building UIs, but it
does have the benefit that it's harder to leak server-side secrets to your
frontend.

Thankfully, Astro makes it really easy to use third-party component libraries
like [React][react] or [Svelte][svelte] to provide client-side interactivity.
Think of Astro components as strictly server side logic and HTML templating and
you should have a good time.

Here's an example from this site:

```astro
---
import { noteStore, type NoteFrontmatter } from "../../features/notes/store";
import NotePage from "../../features/notes/NotePage.svelte";
import Root from "../../layouts/Root.astro";

const slug = Astro.params.slug!;
const note = await noteStore.getSingle({
    includeDrafts: import.meta.env.DEV,
    slug,
});

if (!note) {
    return Astro.rewrite("/404");
}

const { Content, remarkPluginFrontmatter } = await note.render();

const frontmatter: NoteFrontmatter = {
    readingTime: remarkPluginFrontmatter.readingTime,
    ...note?.data,
};
---

<Root
    description={frontmatter.description}
    image={frontmatter.imageUrl}
    title={frontmatter.title}
    path={`/notes/${slug}`}
    type="article"
    properties={{
        "article:published_time": frontmatter.publishedOn,
        "article:tag": frontmatter.tags,
        "article:section": "Notes",
    }}
>
    <NotePage {frontmatter}>
        <Content />
    </NotePage>
</Root>
```

As you can see, all our real logic happens in the fenced code section - and
that's literally fenced, as you can see with the `---` on either side. Outside
of that, we only get logic-less JSX (excluding what you import as client-side
components, like `NotePage.svelte`).

## Content collections are really cool

I really love Astro's content collections. Rather than have pages fully defined
and routed like you normally might in a bespoke static site like this, you can
place your content in a designated folder at `/src/content`. You keep different
types of data in different folders, kinda like tables in a relational database,
and this data can be markdown files or just plain data in YAML or JSON.

If you're familiar with Obsidian's [Dataview][dataview] plugin, content
collections allow you to interact with your content in a very similar manner.
Astro bundles in a nice schema generation system called [Zod][zod] that lets
you define the schema for your content's frontmatter (or data if it's not a
markdown file). For example, here's the schema definition for this very note:

```ts
import { defineCollection, z } from "astro:content";

export const collections = {
    notes: defineCollection({
        type: 'content',
        schema: z.object({
            tags: z.array(z.string()).default([]),
            publishedOn: z.date().optional(),
            title: z.string(),
        }),
    }),
};
```

I've done a decent amount of wrapping around collections to get them feeling
just right for me. You'll see a bit of what I've done here in this next
section.

## Zod is a lot handier than I expected

I'm writing everything in this project in TypeScript, so having static types
for everything is nice. Normally, I would find myself just writing types for
everything, like for example a query to get notes:

```ts
type GetRecentNotesQuery = {
    includeDrafts?: boolean;
    limit?: number;
}
```

I'd then use this as the type of the query parameter in my function, inserting
any defaults as needed:

```ts
export const getRecentNotes = async (query?: GetRecentNotesQuery) => {
    const includeDrafts = query?.includeDrafts ?? false;
    const limit = query?.limit ?? 10;

    // ...
}
```

However, this can get kind of tedious, as you could potentially forget to set
default values for certain properties. Instead, I've been using Zod for
declaring this, as I can do something really special:

```ts
const recentNotesQuery = z.object({
    includeDrafts: z.boolean().default(false),
    limit: z.number().default(),
});

export const getRecentNotes = async (_query?: z.input<typeof recentNotesQuery>) => {
    const query = recentNotesQuery.parse(_query);

    // ...
}
```

That's right. I can define my static type, runtime validation, and default
values in one statement. Isn't that neat?! I ended up writing a wrapping
function that makes it easier to write this stuff over and over again:

```ts
export const buildQuery = <S extends BaseSchema, T>(
    schema: S,
    fn: (query: z.infer<S>) => Promise<T>
) => {
    return (query: z.input<S>) => fn(schema.parse(query))
}
```

This just takes in the schema I built earlier and a function that expects a
validated query as input. With this, `getRecentNotes` becomes something simple:

```ts
export const getRecentNotes = buildQuery(recentNotesQuery, async (query) => {
    // ...
})
```

I get to use this pattern everywhere, don't have to think about validation, and
I am in love. I will probably be using Zod in other projects from now on.

## Conclusion

Astro is really cool so far! I'm still figuring out some of the quirks of the
framework, but all in all I'm quite impressed. It's been a lot easier to do
what I want than I was anticipating, and I'll definitely be sticking with it
for the foreseeable future.

[astro]: https://astro.build
[astro-components]: https://docs.astro.build/en/basics/astro-components/
[dataview]: https://blacksmithgu.github.io/obsidian-dataview
[gatsby-dead]: https://github.com/gatsbyjs/gatsby/issues/38696
[jekyll]: https://jekyllrb.com
[react]: https://react.dev
[svelte]: https://svelte.dev
[zod]: https://zod.dev
