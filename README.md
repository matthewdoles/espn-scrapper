# espn-scrapper

Scripts to scrape images from ESPN using Puppeteer. You should always respect the trademarks and fair use of ESPN or any sports league should you consider to use any of the scrapped assets. The use of any assets, as in my projects, should be for personal non-monetary use.

### Design

#### Player Photos

To run: `node src/player-photos/ `

To choose the league you wish to scrape player images from you must manually change the imported file containing all the league's team names and respective link on ESPN (available options commented out). Make sure to update any references to the imported file in the script. Additionally, change the league const to the appropriate abbreviation for the league you wish to scrape.

After opening a headless browser, Puppeteer begins by navigating to each team's URL. The script will then first scrape all the player names using a unique query selector that identifies each player. Then, compile the image info by using a unique query selector that selects each player's image, captures the image url, and sets the filename as the appropriate player name. With that data captured, said data is then looped through, downloaded, and saved to the appropriate subfolder under [images](/src/images/).

#### Team Logos

To run: `node src/team-logos/ `

To choose the league you wish to scrape logos from you must manually change the leagueURL and league consts to the appropriate values (available options commented out).

Puppeteer will start by opening a headless browser, and navigating to the leagueURL which lists all the teams on one page. The script then uses unique selectors to capture both the logo urls and the name of each team. It will then loop through that data to compile the image info which sets the finename as the team name, and updates the uri to capture a larger version of the logo. After that, the images are downloaded and saved to the appropriate subfolder under [images](/src/images/).
