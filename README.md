# Library Data

All data from Seattle's [Integrated Libray System](https://data.seattle.gov/Community/Integrated-Library-System-ILS-Data-Dictionary/pbt3-ytbc)

## Setup
Clone repo and run `npm i`

## Reproduction
* **Download inventory**: Navigate to the `input` directory and download the inventory file (~8gb) `curl -o inventory.csv "https://data.seattle.gov/api/views/6vkj-f5xf/rows.csv?accessType=DOWNLOAD"`
* **Download checkouts**: Navigate to the `input` directory and download the inventory file (~23gb) `https://data.seattle.gov/api/views/5src-czff/rows.csv?accessType=DOWNLOAD&bom=true&query=select+*`
* **Book codes**: Convert the dictionary of item collection codes to just physical books. `npm run filter-book-codes`
