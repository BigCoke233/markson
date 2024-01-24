# Markson

JavaScript library that reads Markdown files and generates JSON-based blog posts, supporting Yaml Front Matter and GitHub Flavored Markdown.

## Installation

```
npm i marksonjs
```

## Usage

```javascript
import Markson from 'markson';

//...

const markson = new Markson();

let posts = markson.fetch('./posts');       // fetch markdown files in dir
let post = markson.read('./posts/post.md'); // read single markdown file
```