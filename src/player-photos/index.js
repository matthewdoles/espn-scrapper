const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    'https://www.espn.com/nhl/team/roster/_/name/chi/chicago-blackhawks'
  );
  const playerNames = await page.$$eval(
    '.Table__TBODY .Table__TR .Table__TD div a',
    (els) => els.map((el) => el.textContent)
  );

  const result = playerNames.filter((name) => name.length > 0);

  const playerImages = await page.$$eval(
    '.TableHeadshot figure .Image__Wrapper img',
    (imgs) => imgs.map((img) => img.getAttribute('src'))
  );

  const playerImageInfo = [];
  playerImages.forEach((link, index) =>
    playerImageInfo.push({
      fileName: result[index].replace(' ', '-'),
      uri: link
        .replace('&h=80&w=110&scale=crop', '&w=350&h=254')
        .replace('&w=110&h=80&scale=crop', '&w=350&h=254'),
    })
  );

  console.log(playerImageInfo);

  playerImageInfo.map(async (player) => {
    await download(
      player.uri,
      `./images/chicago-blackhawks/${player.fileName}.png`
    );
  });

  function download(uri, filename) {
    return new Promise((resolve, reject) => {
      request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
      });
    });
  }
})();
