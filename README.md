# Static Pages / YAML reader
YAML (and JSON) reader. Reads every file matching a given pattern. Produces an iterable.

JSON files are also supported by this package, since JSON is a subset of the YAML spec.

## Usage
```js
import reader from '@static-pages/yaml-reader';

const iterable = reader({
  attrKey: 'attr',
  cwd: 'pages',
  pattern: '**/*.yaml',
  ignore: 'files-to-ignore*',
  incremental: false,
});

// one item in the iterable:
// {
//   header: {
//     cwd: '/path/to/pages',
//     path: 'folder/file.yaml',
//     dirname: 'folder',
//     basename: 'file',
//     extname: '.yaml'
//   },
//   attr: {
//     yamlAttribute1: '...',
//     yamlAttribute2: '...',
//     ...
//   }
// }
```

## Docs

### __`reader(options: Options): Iterable<Data>`__

#### `Options`
- `options.attrKey` (default: empty) file contents will be put under this key in the returned data object to prevent polluting the root (eg. prevent the overwrite of the header field). When left empty the contents are spread into the root object.
- `options.cwd` (default: `.`) sets the current working directory.
- `options.pattern` (default: `**/*.md`) glob pattern(s) that selects the files to read. Can be a `string` or a `string` array.
- `options.ignore` (default: `undefined`) glob pattern(s) that selects the files to ignore. Can be a `string` or a `string` array.
- `options.encoding` (default: `utf-8`) defines the returned file encoding. Possible values are the same as the `encoding` argument of `fs.readFile`.
- `options.incremental` (default: `false`) enables the incremental reads. See more at [@static-pages/file-reader docs page](https://www.npmjs.com/package/@static-pages/file-reader#Incremental-reads).

#### `Data`
- `data.header` contains metadata about the file.
  - `header.cwd` is the absolute path of the `cwd` set in the options.
  - `header.path` is the file path relative to the `header.cwd`.
  - `header.dirname` is equivalent to `path.dirname(header.path)`.
  - `header.basename` is equivalent to `path.basename(header.path, header.extname)`.
  - `header.extname` is equivalent to `path.extname(header.path)`.
- `data.attr` contains attributes defined in the frontmatter style markdown. Property name customizable with `options.attrKey`.

## Where to use this?
This module can be used to generate static HTML pages from *.yaml sources. Read more at the [Static Pages JS project page](https://staticpagesjs.github.io/).
