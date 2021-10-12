const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
// const { nhlRosters } = require('../consts/nhl-rosters');
// const { nflRosters } = require('../consts/nfl-rosters');
// const { nbaRosters } = require('../consts/nba-rosters');
const { mlbRosters } = require('../consts/mlb-rosters');

const league = 'MLB'; // 'MLB', 'NHL', 'NFL', 'NBA'

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  for (const roster of mlbRosters) {
    // eslint-disable-next-line no-console
    console.log(`Generarting: ${roster.team}`);
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(50 * 1000);
    await page.goto(roster.link);

    // Scrpae player names
    const playerNameScrape = await page.$$eval(
      '.Table__TBODY .Table__TR .Table__TD div a',
      (els) => els.map((el) => el.textContent),
    );
    const playerNames = playerNameScrape.filter((name) => name.length > 0);

    // Scrpae player images
    const playerImages = await page.$$eval(
      '.TableHeadshot figure .Image__Wrapper img',
      (imgs) => imgs.map((img) => img.getAttribute('src')),
    );

    // Compile player image info (filename and uri)
    const playerImageInfo = [];
    playerImages.forEach((link, index) => {
      playerImageInfo.push({
        fileName: playerNames[index].split(' ').join('-'),
        uri: link
          .replace('&h=80&w=110&scale=crop', '&w=350&h=254')
          .replace('&w=110&h=80&scale=crop', '&w=350&h=254'),
      });
    });

    // Create folder if missing
    const dir = `../images/${league}/${roster.team.split(' ').join('-')}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Download player images
    playerImageInfo.forEach((player) => {
      request(player.uri).pipe(
        fs.createWriteStream(
          `../images/${league}/${roster.team.split(' ').join('-')}/${
            player.fileName
          }.png`,
        ),
      );
    });
  }
  process.exit(0);
})();
