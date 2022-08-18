import {Protocol} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {logError} from '../log';

puppeteer.use(StealthPlugin());

const getBrowser = async (cookies: Protocol.Network.CookieParam[] = []) => {
	const browser = await puppeteer.launch({
		headless: false,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-gpu',
			'--hide-scrollbars',
			'--disable-web-security',
		],
	});

	const page = await browser.newPage();

	await page.setDefaultNavigationTimeout(0);

	await Promise.all(
		cookies.map(async (cookie) => {
			try {
				await page.setCookie(cookie);
			} catch (e) {
				console.log(`Failed to set cookie: ${cookie.name}`);
			}
		})
	);

	await page.setCookie();

	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	return {
		browser,
		page,
	};
};

export const uploadTitok = async (videoData: ESportsVideoData) => {
	const cookies = require('./cookies.json');

	const {browser, page} = await getBrowser(cookies);

	try {
		await page.goto(`https://www.tiktok.com/upload?lang=en`, {
			waitUntil: 'networkidle2',
		});

		//Select upload iframe
		const iframe = page
			.frames()
			.find((frame) =>
				frame.url().toLowerCase().includes('tiktok.com/creator')
			);

		if (!iframe) {
			throw new Error('Could not find upload iframe');
		}

		//Get title Input, upload button
		const [captionInput, selectFileButton] = await Promise.all([
			iframe.waitForXPath(`//*[contains(@class, 'editorContainer')]/div`),
			iframe.waitForXPath(
				`//*[contains(@class, 'file-select-button')]/button`
			),
		]);

		if (!captionInput) throw new Error('Could not find tiktok title input');

		if (!selectFileButton)
			throw new Error('Could not find tiktok select file button');

		await captionInput?.type(videoData.title);

		//Upload Video
		const [fileChooser] = await Promise.all([
			page.waitForFileChooser(),
			selectFileButton.click(),
		]);

		await fileChooser.accept([videoData.path]);

		const postButton = await iframe.waitForXPath(
			`//button[not(@disabled)]/div/div[text()='Post']`,
			{
				timeout: 60000,
			}
		);

		if (!postButton) throw new Error('Could not find tiktok post button');

		await postButton.click();

		await page.waitForNavigation({
			waitUntil: 'networkidle2',
		});
	} catch (e) {
		logError('Could not upload video to TikTok');
		console.error(e);
		browser.close();
	} finally {
		browser.close();
	}
};
