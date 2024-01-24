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
         * Read a dir containing markdown files
         * and generate JSON
         * 
         * @param {string} dir 
         * @returns {array}
         */

        this.fetch = (dir) => {
            const filenames = fs.readdirSync(dir);
            
            let array = [];
            filenames.forEach((filename) => {
                // Basic, fetch content and parse it
                const content = fs.readFileSync(path.join(dir, filename), { encoding: 'utf-8'});
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

                    const cleanLine = cleanText.replace(/\s/g, '');
                    item.cleanLine = cleanLine;
                } 

                array.push(item)
            })

            return array
        }
    }
}
