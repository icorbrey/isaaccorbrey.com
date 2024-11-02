import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function postReadingTime() {
    return function (tree, { data }) {
        const textOnPage = toString(tree);
        const readingTime = getReadingTime(textOnPage);
        data.astro.frontmatter.readingTime = readingTime.text;
    };
}