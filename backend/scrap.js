const axios = require('axios');
const cheerio = require('cheerio');

const scrap = async () => {
	const response = await axios.get('https://www.oddsportal.com/football/england/premier-league/');
	const html = response.data;
//	console.log(html);
	const $ = cheerio.load(html);
	console.log($('generic').text());
};

scrap();