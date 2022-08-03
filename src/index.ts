import * as yaml from 'js-yaml';
import { fileReader, FileReaderOptions, FileReaderData } from '@static-pages/file-reader';

export type YamlReaderOptions = {
	attrKey?: string;
} & FileReaderOptions;

export type YamlReaderData<AttrKey extends string = ''> = Pick<FileReaderData, 'header'> & (
	AttrKey extends ''
	? Record<string, unknown>
	: { [attr in AttrKey]: Record<string, unknown>; }
);

export const yamlReader = ({ attrKey = '', cwd = 'pages', pattern = '**/*.yaml', ...rest }: YamlReaderOptions = {}) => ({
	*[Symbol.iterator]() {
		for (const raw of fileReader({ cwd, pattern, ...rest })) {
			const yamlData = yaml.load(raw.body) as Record<string, unknown>;
			yield {
				header: raw.header,
				...(attrKey ? { [attrKey]: yamlData } : yamlData)
			};
		}
	}
});

export default yamlReader;
