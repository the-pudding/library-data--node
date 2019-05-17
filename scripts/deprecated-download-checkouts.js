const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('request');
const CONFIG = require('./config.js');

const DIR_OUT = './output';
const FILE_OUT = `${DIR_OUT}/checkouts--books.csv`;
const CODE_DATA = d3.csvParse(fs.readFileSync(`${DIR_OUT}/dict--books.csv`, 'utf8'));
const CODES = CODE_DATA.map(d => `'${d.Code}'`).join(', ');
const COLUMNS = ['bibnumber','collection','itemtype','checkoutdatetime'];
const BASE = 'https://data.seattle.gov/resource/5src-czff.json';
const LIMIT = 100000;
const SELECT = COLUMNS.join(',');
const WHERE = `collection in (${CODES})`;
const ORDER = 'checkoutdatetime ASC';


// uncomment for fresh start
// rimraf.sync(FILE_OUT);
// mkdirp(DIR_OUT);
// fs.appendFileSync(FILE_OUT, `${SELECT}\n`);

let i = 0;

const tokens = ['X2tWGbhEHP9PTdTuqtvGDjGVt', '6Tp5lWrD2q5FRrOubQbDw2hku']
function page(offset) {
	const t = i % 2 === 0 ? tokens[0] : tokens[1];
	const url = `${BASE}?$$app_token=${t}&$limit=${LIMIT}&$select=${SELECT}&$where=${WHERE}&$order=${ORDER}&$offset=${offset}`;
	request(url, (err, resp, body) => {
		
		if (!err && resp.statusCode === 200) {
			const data = JSON.parse(body);			
			console.log(data[0].checkoutdatetime, offset);
			const rows = d3.csvFormatBody(data);
			fs.appendFileSync(FILE_OUT, `${rows}\n`);
			if (data.length === LIMIT) page(offset + LIMIT);
			else process.exit();
		} else {
			console.log(err, resp.statusCode);
			setTimeout(() => {
				page(offset);
			}, 30000);
		}
	});
}

// console.log('fill this out');
// page(34500000);

