/**
 * Markson/parse.js
 * 
 * How Markson parse markdown files
 */

import yaml from 'js-yaml'

import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export default class MarksonParser {
    constructor () {

        /**
         * Parse Markdown String to HTML
         * @param {string} string raw markdown
         * @param {object, string} options Markson options or put 'gfm' to enable gfm only
         * @returns 
         */

        this.md = (string, options) => {
            const micromarkOptions = (options.gfm || options == 'gfm') ? {
                extensions: [gfm()],
                htmlExtensions: [gfmHtml()]
            } : null;
            return micromark(string, micromarkOptions);
        }

        /**
         * Load Front Matter
         * @param {string} string markdown string with front matter
         * @returns {object} { frontMatterObject, contentWithoutFrontMatter }
         */

        this.fm = string => {
            const frontmatterRegex = /^---\r?\n(.*?)---\r?\n/s;

            // find and load yaml frontmatter
            const match = string.match(frontmatterRegex);
            const matterString = match
                ? match[1].replace(/^\r?\n/g, '').replace(/\r?\n$/g, '')
                : null;
            const matter = yaml.load(matterString);

            // strip string, take off front matter
            const contentWithNoFM = string.replace(frontmatterRegex, '');

            return {
                matter: matter,
                content: contentWithNoFM
            }
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