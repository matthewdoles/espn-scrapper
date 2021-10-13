const puppeteer = require('puppeteer');
const { checkDirectory, download } = require('../util');

const league = 'NHL';
const teamsURL = 'https://www.espn.com/nhl/teams';

// league : teamsURL
// MLB : https://www.espn.com/mlb/teams
// NHL : https://www.espn.com/nhl/teams
// NBA : https://www.espn.com/nba/teams
// NFL : https://www.espn.com/nfl/teams

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.goto(teamsURL);

  // Scrape logo links
  const logoLinks = await page.$$eval(
    'div .TeamLinks .AnchorLink img',
    (imgs) => imgs.map((img) => img.getAttribute('src')),
  );

  // Scrape team names
  const teamNames = await page.$$eval(
    'div .TeamLinks .AnchorLink img',
    (imgs) => imgs.map((img) => img.getAttribute('alt')),
  );

  // Compile team logo info (filename and uri)
  const logoImageInfo = [];
  logoLinks.forEach((link, index) => {
    logoImageInfo.push({
      fileName: `${teamNames[index].split(' ').join('-')}-Logo`,
      uri: link.replace(
        '&h=80&w=80&scale=crop&cquality=40&location=origin',
        '',
      ),
    });
  });

  for (const logo of logoImageInfo) {
    // eslint-disable-next-line no-console
    console.log(`Generarting: ${logo.fileName.replace('-', ' ')}`);

    // Create folder if missing
    checkDirectory(`../images/${league}/${logo.fileName.replace('-Logo', '')}`);

    await download(
      logo.uri,
      `../images/${league}/${logo.fileName.replace('-Logo', '')}/${
        logo.fileName
      }.png`,
    );
  }
  process.exit(0);
})();
