
import fs from 'fs'
import path from 'path'

import parser from './parse.js';

export default class Markson {
    constructor(options) {

        /**
         * Read a markdown file and generate object
         * @param {string} filename 
         * @returns {object}
         */

        this.read = (filename) => {
            try {
                const content = fs.readFileSync(filename, { encoding: 'utf-8'});

                // initialize an object
                let item, data = {};
                if (options.outputStyle == 'fs') {
                  item = { 
                    type: 'file',
                    filename: filename,
                    data: null,
                  }
                }

                // initialize slug, being filename without suffix
                data.slug = path.basename(filename, '.md');

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

                    data.attributes = matter;
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

                if (options.outputStyle == 'fs') item.data = data;
                else item = data;

                return item;
            } catch(err) {
                throw err;
            }
        }

        /**
         * Scan a dir containing markdown files
         * and generate an array containing each object
         * 
         * @param {string} dir 
         * @returns {array}
         */

        this.scan = (dir) => {
            try {
                const filenames = fs.readdirSync(dir);
                let array = [];

                filenames.forEach((filename) => {
                    // if the file is hidden (whose name starts with '.')
                    // then stop reading
                    if (filename.charAt(0) == '.') return false;

                    let item, pathname = path.join(dir, filename);
                    // for sub-directory
                    if (fs.lstatSync(pathname).isDirectory()) {
                        const data = this.scan(pathname);
                        if(options.outputStyle == 'fs') {
                          item = {
                              type: 'directory',
                              filename: filename,
                              data: data,
                          }
                        } else {
                          item = data;
                        }
                    }
                    // for markdown files
                    else if (path.extname(filename) == '.md') {
                        item = this.read(pathname);
                    }

                    if (item) array.push(item);
                })

                return array;
            } catch(err) {
                throw err;
            }
        }

        /**
         * Get Data and Write into a File
         * @param {string} source source path name
         * @param {string} destination destination file name (usually json file)
         * @param {string} type 'dir' or 'file'
         * @returns {boolean} if got any data
         */

        this.write = (source, destination = './output.json', type = 'dir') => {
            // scan or read to get data
            let output;
            if (type == 'dir') output = this.scan(source);
            else if (type == 'file') output = this.read(source);
            output = JSON.stringify(output);

            // if got nothing, exit
            if (!output) return false;

            // write data into given file
            const directory = path.dirname(destination);
            if (!fs.existsSync(directory))  // make sure dir exists, if not then create
                fs.mkdirSync(directory, { recursive: true });
            fs.writeFileSync(destination, output);

            return true;
        }
    }
}
