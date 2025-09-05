import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import stripAnsi from "strip-ansi";
import rss from "@astrojs/rss";

const parser = new MarkdownIt();

export async function GET(context) {
  const notes = await getCollection('notes');

  notes.sort((x, y) => x.data.title - y.data.title);
  notes.sort((x, y) => y.data.publishedOn - x.data.publishedOn);

  const renderContent = pipe(
    (v) => parser.render(v),
    (v) => sanitizeHtml(v, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    }),
    stripAnsi,
  );
  
  return rss({
    title: "Isaac Corbrey",
    description: "I work on open source projects and occasionally write "
      + "articles and videos on technical topics.",
    customData: `<language>en-us</language>`,
    site: context.site,
    items: notes.map((post) => ({
      description: post.data.description,
      content: renderContent(post.body),
      pubDate: post.data.publishedOn,
      link: `/notes/${post.slug}`,
      title: post.data.title,
      trailingSlash: false,
    })),
  });
}

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
