const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const papa = require('papaparse');

const DIR_IN = './output';
const DIR_OUT = './output';

function init() {
	const output = {};
	let index = 0;

	const fileIn = `${DIR_IN}/checkouts--books-small.csv`;
	const fileOut = `${DIR_OUT}/count-checkout.csv`;
	const reader = fs.createReadStream(fileIn);
	rimraf.sync(fileOut);
	mkdirp(DIR_OUT);

	papa.parse(reader, {
		header: true,
		fastMode: true,
		chunk: ({ data }, parser) => {
			parser.pause();
			console.log(index);
			for (let i = 0; i < data.length; i++) {
				const { BibNumber } = data[i];
				const item = output[BibNumber];
				if (item) output[BibNumber] += 1;
				else output[BibNumber] = 1;
			}
			parser.resume();
			index += data.length;
		},
		complete: () => {
			console.time('complete');
			const arr = Object.keys(output).map(k => ({ BibNumber: k, count: output[k] }));
			arr.sort((a, b) => d3.descending(a.count, b.count));
			fs.writeFileSync(fileOut, d3.csvFormat(arr));
			console.timeEnd('complete');
		}
	});
}

// console.log('uncomment to run');
init();
