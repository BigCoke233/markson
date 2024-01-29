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

let posts = markson.scan('./posts');        // scan markdown files in dir, returns an array
let post = markson.read('./posts/post.md'); // read single markdown file, returns an object
```

## Options

The default options are as follows. Configure Markson as initialization if needed.

```javascript
const markson = new Markson({
        gfm: true,          // enable github-flavored-markdown
        cleanText: false,   // if enabled, exports clean text without html tags and white spaces
        frontmatter: true,  // if enabled, parse front matters in markdown files
        rawMD: false,       // if enabled, exports raw markdown content
        exportHTML: true,
        slug: 'filename',   // specify what to use as slug, filename or 'slug' attribute in front matter
});
```

## Methods

### `Markson.read()`

**Parameter:** 

* *filename* - path to the source markdown file

**Returns:** Object formed like this

```JavaScript
{
    type: 'file',
    filename: '.../markdown-file.md',
    data: {
        slug: '...',
        title: '...',
        date: 'Date String',
        attributes: {
            // front matter here
        }
        html: '...',
    }
}
```

### `Markson.scan()`

**Parameter:**

* *dir* - path to the source directory

**Returns:** Array formed like this

```javascript
[
    {
        type: 'directory',
        filename: '.../sub-directory/',
        data: [
            {
                type: 'file',
                // ...
            },
            {
                type: 'directory',
                // ...
            }
        ],
    },
    {
        type: 'file',
        filename: '.../file.md',
        data: {
            slug: '...',
            title: '...',
            date: 'Date String',
            attributes: {
                // front matter here
            }
            html: '...',
        }
    }
]
```

### `Markson.write()`

**Parameters:**

* *source* - similar to `filename`/`dir` in `read()`/`scan()` method
* *destination* - where to write output, default `./output.json`
* *type* - `dir` or `file`, decides to use `scan()` or `read()`, default `dir`

**Returns:** Boolean that indicates if file is written