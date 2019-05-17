# Library Data

All data from Seattle's [Integrated Libray System](https://data.seattle.gov/Community/Integrated-Library-System-ILS-Data-Dictionary/pbt3-ytbc)

## Setup
Clone repo and run `npm i`

## Reproduction
* **Download dictionary**: In the project root, run `curl -o input/dict.csv "https://data.seattle.gov/api/views/pbt3-ytbc/rows.csv?accessType=DOWNLOAD"`
* **Download inventory (~8gb)**: In the project root, run `curl -o input/inventory.csv "https://data.seattle.gov/api/views/6vkj-f5xf/rows.csv?accessType=DOWNLOAD"`
* **Download checkouts (~23gb)**: In the project root, run `curl -o input/checkouts.csv "https://data.seattle.gov/api/views/5src-czff/rows.csv?accessType=DOWNLOAD&bom=true&query=select+*"`
* **Book codes**: Convert the dictionary of item collection codes to just physical books. Run `npm run filter-book-codes`
