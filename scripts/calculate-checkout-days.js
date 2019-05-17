const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const papa = require('papaparse');
const dateFns = require('date-fns');

const DIR_IN = './output';
const DIR_OUT = './output';

function init() {
	const output = {};
	let index = 0;

	const fileIn = `${DIR_IN}/checkouts--books-small.csv`;
	const fileOut = `${DIR_OUT}/checkout-days.csv`;
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
			const data = Object.keys(output).map(k => ({BibNumber: k, CheckoutDateTime: output[k]}));
			const withDays = data.map(d => ({
				...d,
				days: dateFns.differenceInDays(END_DATE, new Date(d.CheckoutDateTime))
			}));

			const nested = d3.nest()
				.key(d => d.days)
				.rollup(values => ({
					days: values[0].days,
					count: values.length
				}))
				.entries(withDays)
				.map(d => d.value);

			nested.sort((a, b) => d3.ascending(a.days, b.days));


			fs.writeFileSync(fileOut, d3.csvFormat(nested));
		}
	});
}

init();
