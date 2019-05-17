const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const dateFns = require('date-fns');

const DIR_IN = './output';
const DIR_OUT = './output';

function init() {
	const data = d3.csvParse(fs.readFileSync(`${DIR_IN}/last-checkout.csv`, 'utf8'));
	
	const file = `${DIR_OUT}/checkout-days.csv`;
	rimraf.sync(file);
	mkdirp(DIR_OUT);

	const endDate = new Date('2019/05/14');
	const withDays = data.map(d => ({
		...d,
		days: dateFns.differenceInDays(endDate, new Date(d.CheckoutDateTime))
	}));
	
	const nested = d3.nest()
		.key(d => d.days)
		.rollup(values => ({
			days: values[0].days,
			count: values.length
		}))
		.entries(withDays)
		.map(d => d.value);
	
	nested.sort((a,b) => d3.ascending(a.days, b.days));


	fs.writeFileSync(file, d3.csvFormat(nested));
}

// console.log('uncomment to run');
init();
