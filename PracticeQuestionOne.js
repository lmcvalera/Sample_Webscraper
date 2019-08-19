const Nightmare = require('nightmare');
const nightmare = Nightmare();

const GOOGLE_LINK = 'https://google.com';

nightmare
  .goto(GOOGLE_LINK)
  .wait('input[title="Search"]')
  .evaluate(() => {
    const searchBar = document.querySelector('input[title="Search"]');
    return { id: searchBar.id, className: searchBar.className };
  })
  .end()
  .then((result) => {
    console.log(`the google search bar has the id of ${result.id} and class(es) ${result.className}`);
  });