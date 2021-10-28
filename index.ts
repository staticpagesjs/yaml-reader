import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import { IncrementalHelper } from '@static-pages/incremental';

export interface Options {
  cwd?: string;
  pattern?: string;
  incremental?: boolean;
  fstat?: boolean;
  attrKey?: string;
}

export type Data<AttrKey extends string = 'attr'> = {
  header: {
    cwd: string;
    path: string;
    dirname: string;
    basename: string;
    extname: string;
  } & Partial<fs.Stats>;
} & (AttrKey extends '' ? {
  [attr in AttrKey]: Record<string, unknown>;
} : Record<string, unknown>);

export default ({ cwd, pattern = '**/*.yaml', incremental, fstat, attrKey = 'attr' }: Options = {}) => ({
  [Symbol.iterator]() {
    const absCwd = path.resolve(process.cwd(), cwd);
    const files = glob.sync(pattern, { cwd: absCwd, absolute: true });

    const incrementalHelper = incremental ? new IncrementalHelper(
      path.join(cwd, pattern).replace(/\\/g, '/'),
      typeof incremental === 'string' ? incremental : '.incremental'
    ) : null;

    return {
      next() {
        let file: string;
        do {
          file = files.pop();
        } while (file && !(incrementalHelper?.isNew(file) ?? true));

        if (!file) { // no more input
          incrementalHelper?.finalize();
          return { done: true };
        }

        const relativePath = path.relative(absCwd, file);
        const extName = path.extname(file);

        const yamlData = yaml.load(fs.readFileSync(file, 'utf-8')) as Record<string, unknown>;
        const data = {
          header: {
            cwd: absCwd,
            path: relativePath,
            dirname: path.dirname(relativePath),
            basename: path.basename(relativePath, extName),
            extname: extName,
            ...(fstat && (incrementalHelper?.fstat || fs.fstatSync(fs.openSync(file, 'r'))))
          },
          ...(attrKey ? { [attrKey]: yamlData } : yamlData),
        };

        return { value: data };
      }
    };
  }
});
