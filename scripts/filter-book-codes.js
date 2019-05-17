const fs = require('fs');
const d3 = require('d3');
const mkdirp = require('mkdirp');

const DIR_IN = './input';
const DIR_OUT = './output';
mkdirp(DIR_OUT);

const data = d3.csvParse(fs.readFileSync(`${DIR_IN}/dict.csv`, 'utf8'));

const filtered = data.filter(d => 
	d['Code Type'] === 'ItemCollection'
	&& d['Format Subgroup'] === 'Book'
	&& ['Nonfiction', 'Fiction'].includes(d['Category Group'])
)

const clean = filtered.map(d => ({
	Code: d.Code,
	Description: d.Description,
	'Category Group': d['Category Group'],
}))

fs.writeFileSync(`${DIR_OUT}/dict--books.csv`, d3.csvFormat(clean));
