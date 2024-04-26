import redisClient from '../utils/redis';
import { v4 } from 'uuid';
const axios = require('axios');
const cheerio = require('cheerio');
import dbClient from '../utils/db';
/**
 * Contains auth miscellanous handlers for games collection
 */
class GamesController {
    static async getGames(req, res) {
        //get games of a particular date as parameter
        const date = req.params.date;
        if (date.length !== 8) {
            res.status(400).json({}); return;        }
        const response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date}/1?countryCode=NG&locale=en&MD=1`);
	    const data = response.data;
	    res.status(200).json(data);
    } 
    static async postBet(req, res) {
        //post a new bet that is played
    }
}


export default GamesController;
module.exports = GamesController;