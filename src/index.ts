import * as yaml from 'js-yaml';
import reader, { FileReaderOptions, FileReaderData } from '@static-pages/file-reader';

export interface Options {
	cwd?: FileReaderOptions['cwd'];
	pattern?: FileReaderOptions['pattern'];
	incremental?: FileReaderOptions['incremental'];
	attrKey?: string;
}

export type Data<AttrKey extends string = 'attr'> = Pick<FileReaderData, 'header'> & (
	AttrKey extends ''
	? Record<string, unknown>
	: { [attr in AttrKey]: Record<string, unknown>; }
);

export default ({ cwd = 'pages', pattern = '**/*.yaml', incremental = false, attrKey = '' }: Options = {}) => ({
	*[Symbol.iterator]() {
		for (const raw of reader({ cwd, pattern, incremental })) {
			const yamlData = yaml.load(raw.body) as Record<string, unknown>;
			yield {
				header: raw.header,
				...(attrKey ? { [attrKey]: yamlData } : yamlData)
			};
		}
	}
});
