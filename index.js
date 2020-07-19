#!/usr/bin/env node

const puppeteer = require('puppeteer');

if(process.argv.length < 4) {
    console.log('Please provide username and password as arguments.');
    process.exit(0);
}

const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const navigationPromise = page.waitForNavigation();

	await page.goto('https://fahrkarten.bahn.de/privatkunde/start/start.post?lang=de&country=DEU&scope=bahnbrs&dbkanal_007=L01_S01_D001_KIN0001_top-navi-flyout_meinebahn-uebersicht_LZ01');
	
	await page.setViewport({ width: 1272, height: 1018 });

	await page.type('#login-input-loginname', process.argv[2]);
	await page.type('#password', process.argv[3]);
	await page.click('.button-abschnitt button');
	await page.waitForNavigation();

	const cookies = await page.cookies();

	await page.click('#content > div.maincontentwhitebgbborder > div.brsoverview > table > tbody > tr:nth-child(1) > td:nth-child(6) > a');
	await page.waitForNavigation();
	
	await page.click('.button-abschnitt button');
	await page.waitForNavigation();

	await page.waitFor('#button\.blaettern\.next');

	await navigationPromise;

	await browser.close();

	process.exit(0);
})();