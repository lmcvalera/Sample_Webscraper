const Nightmare = require('nightmare');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const GOOGLE_LINK = 'https://google.com';
const SEARCH_INPUT = 'datatables';
const RESULTS_LIST_ID = '#rso';
const DATATABLES_LINK = 'https://datatables.net/';

const nightmare = Nightmare();

nightmare
  .goto(GOOGLE_LINK)
  // type datatables in search bar
  .type('input[title="Search"]', SEARCH_INPUT)
  .click('input[type="submit"]')
  // wait for results list to show up
  .wait(RESULTS_LIST_ID)
  // find tag that has a link to datatables.net and then click it
  .click(`a[href='${DATATABLES_LINK}']`)
  .evaluate(() => {
    const numberOfPages = document.querySelectorAll('div#example_paginate > span > a').length;
    const data = [];
    const tableHeaderRows = document.querySelector('table#example > thead > tr')
    // click on table headers here if sorting is needed i.e tableHeaderRows[0].querySelectorAll('th'))[indexOfHeader].click()
    const tableHeaders = Array.from(tableHeaderRows.querySelectorAll('th')).map((element) => ({ id: element.innerHTML, title: element.innerHTML }));

    // iterate over every page to get every entry in the table
    for (let i = 0; i < numberOfPages; i++) {
      const tableBodyRows = Array.from(document.querySelectorAll('table#example > tbody > tr'));
      tableBodyRows.forEach((row) => {
        const entry = {};
        const rowData = Array.from(row.querySelectorAll('td')).map(e => e.innerHTML);

        if (rowData.length > 0) {
          rowData.forEach((data, index) => {
            entry[tableHeaders[index].id] = data;
          });

          data.push(entry);
        }
      });
      document.querySelector('div#example_paginate > a.next').click();
    }
    return {tableHeaders, data};
  })
  .end()
  .then((result) => {
    console.log(`writing ${result.data.length} entries to csv`);
    const csvWriter = createCsvWriter({
      path: 'out.csv',
      header: result.tableHeaders
    });
    csvWriter
      .writeRecords(result.data)
      .then(() => console.log('The CSV file was written successfully'))
      .catch((error) => console.error("an error while writing to csv occurred :(", error));
  })
  .catch((error) => console.error('an error occurred :(', error));