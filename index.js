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

export default class Markson {
    constructor(options = {
        gfm: true,          // enable github-flavored-markdown
        cleanText: false,   // if enabled, returns clean text without html tags and white spaces
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
            // Basic, fetch content and parse it
            const content = fs.readFileSync(filename, { encoding: 'utf-8'});
            const html = micromark(content, micromarkOptions);

            let item = {
                filename: filename,
                markdown: content,
                html: html
            }

            // Option, cleans text
            if (options.cleanText) {
                const cleanText = html.replace(/<[^>]*>/g, '');
                item.cleanText = cleanText;

                const cleanLine = cleanText.replace(/\n/g, '').replace(/\r/g, '');
                item.cleanLine = cleanLine;
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
                let item = this.read(path.join(dir, filename));
                array.push(item);
            })

            return array;
        }
    }
}
