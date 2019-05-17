const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const papa = require('papaparse');
const dateFns = require('date-fns');

const DIR_IN = './output';
const DIR_OUT = './output';
const END_DATE = new Date('2019/05/14');
const COLUMNS = ['BibNum', 'days'];

function getYear(str) {
	if (str.includes('-')) {
		const match = str.match(/-\d{4}/);
		return match ? match[0].replace('-', '') : null;
	}
	const match = str.match(/\d{4}/);
	return match ? match[0] : null;
}

function estimate(str) {
	const year = getYear(str);
	if (year) {
		const start = new Date(`${year}/01/01`);
		const days = dateFns.differenceInDays(END_DATE, start);
		return days;
	}
	return null;
}

function init() {
	const output = [];
	let index = 0;

	const daysData = d3.csvParse(fs.readFileSync(`${DIR_IN}/checkout-days.csv`, 'utf8'));
	const daysDict = {};

	// make faster to lookup
	daysData.forEach(d => daysDict[d.BibNumber] = d.days);

	const fileIn = `${DIR_IN}/inventory--books.csv`;
	const fileOut = `${DIR_OUT}/inventory-days.csv`;
	const reader = fs.createReadStream(fileIn);
	rimraf.sync(fileOut);
	mkdirp(DIR_OUT);

	fs.appendFileSync(fileOut, `${d3.csvFormatBody([COLUMNS])}\n`);
	 
	papa.parse(reader, {
		header: true,
		chunk: ({ data }, parser) => {
			parser.pause();
			const output = [];
			console.log(index);
			for (let i = 0; i < data.length; i++) {
				const { BibNum, PublicationYear } = data[i];
				const days = daysDict[BibNum] || estimate(PublicationYear);
				const row = {
					BibNum,
					days,
				};
				output.push(row);
			}

			fs.appendFileSync(fileOut, `${d3.csvFormatBody(output)}\n`);
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
