import * as yaml from 'js-yaml';
import reader, { Options as ReaderOptions, Data as ReaderData } from '@static-pages/file-reader';

export interface Options {
	cwd?: ReaderOptions['cwd'];
	pattern?: ReaderOptions['pattern'];
	incremental?: ReaderOptions['incremental'];
	attrKey?: string;
}

export type Data<AttrKey extends string = 'attr'> = Pick<ReaderData, 'header'> & (
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
