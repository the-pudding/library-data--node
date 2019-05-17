const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const papa = require('papaparse');

const DIR_IN = './output';
const DIR_OUT = './output';
const FILE_OUT = `${DIR_OUT}/checkouts--books-small.csv`;
const COLUMNS = ['BibNumber', 'CheckoutDateTime'];

function init() {
	let index = 0;
	rimraf.sync(FILE_OUT);
	mkdirp(DIR_OUT);

	const reader = fs.createReadStream(`${DIR_IN}/checkouts--books.csv`);
	fs.appendFileSync(FILE_OUT, `${d3.csvFormatBody([COLUMNS])}\n`);

	papa.parse(reader, {
		header: true,
		chunk: ({ data }, parser) => {
			parser.pause();
			console.log(index);
			const output = [];
			for (let i = 0; i < data.length; i++) {
				const d = data[i];
				if (codeDict[d.ItemCollection]) {
					const row = {};
					COLUMNS.forEach(c => row[c] = data[i][c].split(' ')[0]);
					output.push(row);
				}
			}
			fs.appendFileSync(FILE_OUT, `${d3.csvFormatBody(output)}\n`);

			parser.resume();
			index += data.length;
		},
		complete: () => {
			console.timeEnd('duration');
			process.exit();
		}
	})
}

console.log('uncomment to run');
// init();
