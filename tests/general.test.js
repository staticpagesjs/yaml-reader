import reader from '../esm/index.js';

test('it can use @static-pages/file-reader', async () => {
	const expected = ['file1', 'file2', 'file3'];

	const output = [...reader({
		cwd: 'tests/input',
		pattern: '**/file*.yaml',
	})].map(x => x.a);

	output.sort((a, b) => a.localeCompare(b));
	expect(output).toStrictEqual(expected);
});

test('attrKey can be customized', async () => {
	const expected = ['file1', 'file2', 'file3'];

	const output = [...reader({
		cwd: 'tests/input',
		pattern: '**/file*.yaml',
		attrKey: 'attr',
	})].map(x => x.attr.a);

	output.sort((a, b) => a.localeCompare(b));
	expect(output).toStrictEqual(expected);
});
