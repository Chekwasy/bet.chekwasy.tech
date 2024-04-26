const axios = require('axios');
const cheerio = require('cheerio');

const scrap = async () => {
	const response = await axios.get('https://prod-public-api.livescore.com/v1/api/app/date/soccer/20240422/1?countryCode=NG&locale=en&MD=1');
	const html = response.data;
	console.log(html);
	// const $ = cheerio.load(html);
	// console.log($('generic').text());
};

scrap();