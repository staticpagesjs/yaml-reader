# Static Pages / YAML reader
YAML (and JSON) reader. Reads every file matching a given pattern. Produces an iterable.

JSON files are also supported by this package, since JSON is a subset of the YAML spec.

## Usage
```js
import reader from '@static-pages/yaml-reader';

const iterable = reader({
  cwd: '.',
  pattern: '**/*.yaml',
  incremental: false,
  fstat: false,
  attrKey: 'attr',
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

`header` is extended with the `fs.fstat()` data if `options.fstat` is `true`.

### When `options.incremental` is `true`
- `fs.fstat()` is called on the files. If you need fstat data, its cheaper to set `options.fstat` to `true` instead of calling fstat again later by yourself.
- When iteration is done on the `iterable` a timestamp is saved to a `.incremental` file in the `process.cwd()`. This can be configured with `options.incremental`, see below.

## Docs

### __`reader(options: Options): Iterable<Data>`__

#### `Options`
- `options.cwd` (default: `process.cwd()`) sets the current working directory.
- `options.pattern` (default: `**/*.yaml`) a glob pattern that marks the files to read.
- `options.attrKey` (default: (empty)) file contents will be put under this key in the returned data object to prevent polluting the root level (eg. prevent the overwrite of the header field). When left empty the contents are put to the root level.
- `options.incremental` (default: `false`) return only those files that are newer than the datetime of the end of the last iteration of the files. Alternatively you can suppile a path describing where to store the incremental info. By default it creates a `.incremental` file in the `process.cwd()`.
- `option.fstat` (default: `false`) merge fstat data into `header`.

#### `Data`
- `data.header` contains metadata about the file.
  - `header.cwd` is the base directory wich contains the file.
  - `header.path` is the file path relative to the `header.cwd`.
  - `header.dirname` is equivalent to `path.dirname(header.path)`.
  - `header.basename` is equivalent to `path.basename(header.path, header.extname)`.
  - `header.extname` is equivalent to `path.extname(header.path)`.
  - `header` is extended with fstat data if `options.fstat` is `true`.
- `data.attr` contains the data read from the source YAML file.


## Where to use this?
This module can be used to generate static HTML pages from *.yaml sources. Read more at the [Static Pages JS project page](https://staticpagesjs.github.io/).
