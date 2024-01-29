```diff
- NOTE: This library is still under development, so API may change. Please do not use it in production environment.
```

# Markson.js

JavaScript library that reads Markdown files and generates JSON-based blog posts, supporting Yaml Front Matter and GitHub Flavored Markdown.

## Installation

```
npm i marksonjs
```

## Usage

```javascript
import Markson from 'marksonjs';

//...

const markson = new Markson();

let posts = markson.fetch('./posts');       // fetch markdown files in dir
let post = markson.read('./posts/post.md'); // read single markdown file
```

## Options

The default options are as follows.

```javascript
const markson = new Markson({
    gfm: true,          // enable github-flavored-markdown
    cleanText: false,   // if enabled, exports clean text without html tags and white spaces
    frontmatter: true,  // if enabled, parse front matters in markdown files
    rawMD: false,       // if enabled, exports raw markdown content
});
```