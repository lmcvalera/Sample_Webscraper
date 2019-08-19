const Nightmare = require('nightmare');
const nightmare = Nightmare();

const GOOGLE_LINK = 'https://google.com';

nightmare
  .goto(GOOGLE_LINK)
  .wait('input[aria-label="Search"]')
  .evaluate(() => {
    const searchBar = document.querySelector('input[aria-label="Search"]');
    return { title: searchBar.title };
  })
  .end()
  .then((result) => {
    console.log(`the google search bar has the titile of ${result.title}`);
  });