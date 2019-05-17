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
	const fileOut = `${DIR_OUT}/last-checkout.csv`;
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
				const { BibNumber, CheckoutDateTime } = data[i];
				const item = output[BibNumber];
				if (item) {
					const [m, d, y] = CheckoutDateTime.split('/');
					const n = `${y}/${m}/${d}`;
					if (n > item) output[BibNumber] = n;
				} else {
					const [m, d, y] = CheckoutDateTime.split('/');
					output[BibNumber] = `${y}/${m}/${d}`;
				}
			}
			
			parser.resume();
			index += data.length;
		},
		complete: () => {
			console.time('complete');
			const arr = Object.keys(output).map(k => ({BibNumber: k, CheckoutDateTime: output[k]}));
			fs.writeFileSync(fileOut, d3.csvFormat(arr));
			console.timeEnd('complete');
		}
	});
}

console.log('uncomment to run');
// init();
