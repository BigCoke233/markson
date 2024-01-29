/**
 * Markson.js
 *
 * This library fetches a directory containing .md
 * files or reads one single .md file, and generates
 * an easy-to-use JSON API.
 */

import fs from 'fs'
import path from 'path'

import MarksonParser from './parse.js';
const parser = new MarksonParser();

export default class Markson {
    constructor(options = {
        gfm: true,          // enable github-flavored-markdown
        cleanText: false,   // if enabled, exports clean text without html tags and white spaces
        frontmatter: true,  // if enabled, parse front matters in markdown files
        rawMD: false,       // if enabled, exports raw markdown content
        exportHTML: true,
        slug: 'filename',   // specify what to use as slug (pathname), filename or 'slug' front matter
    }) {

        /**
         * Read a markdown file and generate object
         * @param {string} filename 
         * @returns 
         */

        this.read = (filename) => {
            // read file content and create an object
            const content = fs.readFileSync(filename, { encoding: 'utf-8'});
            let item = { 
                type: 'file',
                filename: filename
            }

            let data = {};

            // initialize slug, being filename without suffix
            data.slug = filename.match(/[^\\\\]+$/g)[0]?.replace('.md','');

            // Option, exports raw markdown content
            if (options.rawMD) data.markdown = content
 
            // Option, load yaml front matter
            if (options.frontmatter) {
                const matter = parser.fm(content);

                // Option, replace slug with slug in fm if exists
                if (options.slug == 'frontmatter' && matter?.slug)
                    data.slug = matter.slug;

                // deal with specific front matter
                // title, date...
                if (matter?.title) data.title = matter.title;
                if (matter?.date) {
                    let date = new Date(matter.date).toString();
                    data.date = date;
                }
            }

            // parse markdown to html string
            const html = parser.md(content, options);
            if(options.exportHTML) data.html = html;

            // Option, cleans text
            if (options.cleanText) {
                const cleaned = parser.clean(html);
                data.cleanText = cleaned.cleanText; // clean text with no html tags
                data.cleanLine = cleaned.cleanLine; // clean text with no white spaces
            } 

            item.data = data;

            return item;
        }

        /**
         * Scan a dir containing markdown files
         * and generate an array containing each object
         * 
         * @param {string} dir 
         * @returns {array}
         */

        this.scan = (dir) => {
            const filenames = fs.readdirSync(dir);
            let array = [];

            filenames.forEach((filename) => {
                // if the file is hidden (whose name starts with '.')
                // then stop reading
                if (filename.charAt(0) == '.') return false;

                let item, pathname = path.join(dir, filename);
                // for sub-directory
                if (fs.lstatSync(pathname).isDirectory()) {
                    item = {
                        type: 'directory',
                        filename: filename,
                        data: this.scan(pathname),
                    }
                }
                // for markdown files
                else if (filename.match(/.md$/)) {
                    item = this.read(pathname);
                }

                if (item) array.push(item);
            })

            return array;
        }
    }
}
