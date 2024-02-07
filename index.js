/**
 * Markson.js
 *
 * This library fetches a directory containing .md
 * files or reads one single .md file, and generates
 * an easy-to-use JSON API.
 */

import Markson from './src/markson.js'

const markson = new Markson({
  gfm: true,              // enable github-flavored-markdown
  cleanText: false,       // if enabled, exports clean text without html tags and white spaces
  frontmatter: true,      // if enabled, parse front matters in markdown files
  rawMD: false,           // if enabled, exports raw markdown content
  exportHTML: true,       // if enabled, exports parsed html content
  slug: 'filename',       // specify what to use as slug (pathname), filename or 'slug' front matter
  outputStyle: 'content', // 'content' or 'fs' (file system)
});

export { Markson, markson };
