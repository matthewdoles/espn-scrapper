const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const { nhlRosters } = require('../consts/nhl-rosters');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  nhlRosters.forEach(async (roster) => {
    const page = await browser.newPage();
    await page.goto(roster.link);

    // Scrpae player names
    const playerNameScrape = await page.$$eval(
      '.Table__TBODY .Table__TR .Table__TD div a',
      (els) => els.map((el) => el.textContent),
    );
    const palyerNames = playerNameScrape.filter((name) => name.length > 0);

    // Scrpae player images
    const playerImages = await page.$$eval(
      '.TableHeadshot figure .Image__Wrapper img',
      (imgs) => imgs.map((img) => img.getAttribute('src')),
    );

    // Compile player image info (filename and uri)
    const playerImageInfo = [];
    playerImages.forEach((link, index) => {
      playerImageInfo.push({
        fileName: palyerNames[index].split(' ').join('-'),
        uri: link
          .replace('&h=80&w=110&scale=crop', '&w=350&h=254')
          .replace('&w=110&h=80&scale=crop', '&w=350&h=254'),
      });
    });

    // Download player images
    playerImageInfo.forEach((player) => {
      request(player.uri).pipe(
        fs.createWriteStream(
          `../images/NHL/${roster.team.split(' ').join('-')}/${
            player.fileName
          }.png`,
        ),
      );
    });
  });
})();
