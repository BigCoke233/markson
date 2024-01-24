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
import yaml from 'js-yaml'

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
         * Read a Markdown file
         * and generate an object
         */

        this.read = (filename) => {
            // Basic, fetch content and create an object
            const content = fs.readFileSync(filename, { encoding: 'utf-8'});
            let item = {
                filename: filename
            }

            // Option, raw markdown content
            if (options.rawMD) item.markdown = content
 
            // Option, load yaml front matter
            let matter, contentWithNoFM = content;
            if (options.frontmatter) {
                const frontmatterRegex = /^---(.*?)---/s;
                // find and load yaml frontmatter
                const match = content.match(frontmatterRegex);
                const matterString = match
                    ? match[1].replace(/^\r?\n/g, '').replace(/\r?\n$/g, '')
                    : null;
                matter = yaml.load(matterString);

                item.matter = matter;

                // deal with specific front matter
                // title, date...
                if (matter?.title) item.title = matter.title;
                if (matter?.date) {
                    let date = new Date(matter.date).toString();
                    item.date = date;
                }

                // strip front matter string
                contentWithNoFM = content.replace(frontmatterRegex, '');
            }

            // parse markdown to html string
            const html = micromark(contentWithNoFM, micromarkOptions);
            item.html = html;

            // Option, cleans text
            if (options.cleanText) {
                const cleanText = html.replace(/<[^>]*>/g, '');
                item.cleanText = cleanText;

                const cleanLine = cleanText.replace(/\r?\n/g, '');
                item.cleanLine = cleanLine;
            } 

            // slug
            if (options.slug == 'frontmatter' && options.frontmatter && matter?.slug)
                item.slug = matter.slug;
            else {
                item.slug = filename.match(/[^\\\\]+$/g)[0].replace('.md','');
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
