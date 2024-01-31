/**
 * Markson/parse.js
 * 
 * How Markson parse markdown files
 */

import yaml from 'js-yaml'

import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

class MarksonParser {
    constructor () {

        const frontmatterRegex = /^---\r?\n(.*?)---\r?\n/s;

        /**
         * Parse Markdown String to HTML
         * @param {string} string raw markdown
         * @param {object, string} options Markson options
         * @returns {string} HTML string
         */

        this.md = (string, options) => {
            // configure micromark
            const micromarkOptions = options.gfm ? {
                extensions: [gfm()],
                htmlExtensions: [gfmHtml()]
            } : null;

            // strip frontmatter if enabled
            if (options.frontmatter) string = string.replace(frontmatterRegex, '');

            return micromark(string, micromarkOptions);
        }

        /**
         * Load Front Matter
         * @param {string} string markdown string with front matter
         * @returns {object} { frontMatterObject, contentWithoutFrontMatter }
         */

        this.fm = string => {
            // find and load yaml frontmatter
            const match = string.match(frontmatterRegex);
            const matterString = match
                ? match[1].replace(/^\r?\n/g, '').replace(/\r?\n$/g, '')
                : null;
            const matter = yaml.load(matterString);

            return matter
        }

        /**
         * Strip HTML tags and remove spaces, tabs, line breaks.
         * @param {string} html Parsed HTML string
         * @returns {object} { cleanText, cleanLine }
         */

        this.clean = html => {
            const cleanText = html.replace(/<[^>]*>/g, '');
            const cleanLine = cleanText.replace(/\r?\n/g, '');
            
            return {
                cleanText: cleanText,
                cleanLine: cleanLine
            }
        }
    }
}
const parser = new MarksonParser();

export default parser;