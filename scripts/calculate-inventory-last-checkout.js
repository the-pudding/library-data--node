const csv = require('csv-parser');
const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const papa = require('papaparse');

const DIR_IN = './output';
const DIR_OUT = './output';
const COLUMNS = ['BibNumber', 'CheckoutDateTime'];

function init() {
	const output = {};
	let index = 0;
	// rimraf.sync(DIR_OUT);
	mkdirp(DIR_OUT);
	
	const file = fs.createReadStream(`${DIR_IN}/checkouts--books-small.csv`);
	papa.parse(file, {
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
			fs.writeFileSync(`${DIR_OUT}/last-checkout.csv`, d3.csvFormat(arr));
			console.timeEnd('complete');
		}
	});
}

console.log('uncomment to run');
// init();
