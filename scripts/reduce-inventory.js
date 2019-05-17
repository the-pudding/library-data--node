const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const papa = require('papaparse');

const DIR_IN = './input';
const DIR_OUT = './output';
const FILE_OUT = `${DIR_OUT}/inventory--books.csv`;
const COLUMNS = ['BibNum', 'Title', 'Author', 'ISBN', 'PublicationYear', 'ItemType', 'ItemCollection','ReportDate'];

function init() {
	console.time('duration');
	let index = 0;
	const codeData = d3.csvParse(fs.readFileSync(`${DIR_OUT}/dict--books.csv`, 'utf8'));
	const codeDict = {};

	// make codes faster to lookup
	codeData.forEach(d => codeDict[d.Code] = true);

	rimraf.sync(FILE_OUT);
	mkdirp(DIR_OUT);

	const reader = fs.createReadStream(`${DIR_IN}/inventory.csv`);
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
					COLUMNS.forEach(c => row[c] = data[i][c]);
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
	});
}

console.log('uncomment to run');
// init();

