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
        gfm: true
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
         */

        this.fetch = (dir) => {
            const filenames = fs.readdirSync(dir);
            
            let array = [];
            filenames.forEach((filename) => {
                const content = fs.readFileSync(path.join(dir, filename), { encoding: 'utf-8'});
                const html = micromark(content, micromarkOptions)

                array.push({
                    filename: filename,
                    markdown: content,
                    html: html
                })
            })

            return array
        }
    }
}
