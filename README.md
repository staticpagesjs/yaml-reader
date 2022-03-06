# Static Pages / YAML reader
YAML (and JSON) reader. Reads every file matching a given pattern. Produces an iterable.

JSON files are also supported by this package, since JSON is a subset of the YAML spec.

## Usage
```js
import reader from '@static-pages/yaml-reader';

const iterable = reader({
  cwd: 'pages',
  pattern: '**/*.yaml',
  attrKey: 'attr',
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
- `options.cwd` (default: `pages`) sets the current working directory.
- `options.pattern` (default: `**/*.yaml`) a glob pattern that marks the files to read.
- `options.attrKey` (default: (empty)) file contents will be put under this key in the returned data object to prevent polluting the root (eg. prevent the overwrite of the header field). When left empty the contents are spread into the root object.
- `options.incremental` (default: `false`) enables the incremental build. See more at [@static-pages/file-reader docs page](https://www.npmjs.com/package/@static-pages/file-reader#Incremental-builds).

#### `Data`
- `data.header` contains metadata about the file.
  - `header.cwd` is the base directory wich contains the file.
  - `header.path` is the file path relative to the `header.cwd`.
  - `header.dirname` is equivalent to `path.dirname(header.path)`.
  - `header.basename` is equivalent to `path.basename(header.path, header.extname)`.
  - `header.extname` is equivalent to `path.extname(header.path)`.
  - `header` is extended with fstat data if `options.fstat` is `true`.

Depending on the `attrKey` option:
- `data[attrKey]` contains the data read from the source YAML file when `attrKey` is **not** empty.
- `data` contains the data read from the source YAML file when `attrKey` is empty.


## Where to use this?
This module can be used to generate static HTML pages from *.yaml sources. Read more at the [Static Pages JS project page](https://staticpagesjs.github.io/).
