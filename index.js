/**
 * Markson.js
 *
 * This library fetches a directory containing .md
 * files or reads one single .md file, and generates
 * an easy-to-use JSON API.
 */

// file system related
import fs from 'fs'
import path from 'path'

// markdown parsing
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

import MarksonParser from './parse.js';
const parser = new MarksonParser();

export default class Markson {
    constructor(options = {
        gfm: true,          // enable github-flavored-markdown
        cleanText: false,   // if enabled, exports clean text without html tags and white spaces
        frontmatter: true,  // if enabled, parse front matters in markdown files
        rawMD: false,       // if enabled, exports raw markdown content
        slug: 'filename',   // specify what to use as slug (pathname), filename or 'slug' front matter
    }) {

        /**
         * Dealing with options
         */

        // micromark options
        // if gfm enabled, configure it
        const micromarkOptions = options.gfm ? {
            extensions: [gfm()],
            htmlExtensions: [gfmHtml()]
        } : null

        /**
         * Read a markdown file and generate object
         * @param {string} filename 
         * @returns 
         */

        this.read = (filename) => {
            // read file content and create an object
            const content = fs.readFileSync(filename, { encoding: 'utf-8'});
            let item = { filename: filename }

            // initialize slug, being filename without suffix
            item.slug = filename.match(/[^\\\\]+$/g)[0]?.replace('.md','');

            // Option, exports raw markdown content
            if (options.rawMD) item.markdown = content
 
            // Option, load yaml front matter
            let contentWithNoFM = content;
            if (options.frontmatter) {
                const parsed = parser.fm(content);

                // Option, replace slug with slug in fm if exists
                if (options.slug == 'frontmatter' && parsed.matter?.slug)
                    item.slug = parsed.matter.slug;

                // deal with specific front matter
                // title, date...
                if (parsed.matter?.title) item.title = parsed.matter.title;
                if (parsed.matter?.date) {
                    let date = new Date(parsed.matter.date).toString();
                    item.date = date;
                }

                // strip front matter
                contentWithNoFM = parsed.content;
            }

            // parse markdown to html string
            const html = micromark(contentWithNoFM, micromarkOptions);
            item.html = html;

            // Option, cleans text
            if (options.cleanText) {
                const cleaned = parser.clean(html);
                item.cleanText = cleaned.cleanText; // clean text with no html tags
                item.cleanLine = cleaned.cleanLine; // clean text with no white spaces
            } 

            return item;
        }

        /**
         * Read a dir containing markdown files
         * and generate an array containing each object
         * 
         * @param {string} dir 
         * @returns {array}
         */

        this.fetch = (dir) => {
            const filenames = fs.readdirSync(dir);
            
            let array = [];
            filenames.forEach((filename) => {
                if (filename.match(/.md$/)) {
                    let item = this.read(path.join(dir, filename));
                    array.push(item);
                }
            })

            return array;
        }
    }
}
