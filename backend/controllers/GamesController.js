import redisClient from '../utils/redis';
import { v4 } from 'uuid';


import dbClient from '../utils/db';
/**
 * Contains auth miscellanous handlers for games collection
 */
class GamesController {
    static async getGames(req, res) {
        //get games of a particular date as parameter
        const date = req.params.date;
        if (!date) {res.status(400).json({}); return;}
        if (date.length !== 8) {res.status(400).json({}); return;}
        //check if date supplied is in range
        let today = new Date();
		for (let i = 0; i < 8; i++) {
			const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
			let dateLst = nex.toLocaleDateString().split('/');
			let date_ = dateLst[2] + dateLst[1] + dateLst[0];
            if (date === date_) {
                let getDate = await (await dbClient.client.db().collection('dates'))
                .findOne({ "date": date_ });
                if (getDate) {
                    res.status(200).json({"games": getDate.games});            
                }
            }
		}
	    res.status(400).json({"error": "Date not in range"});
    }


    static async postBet(req, res) {
        //post a new bet that is played
        const x_tok = req.headers['x-token'];
        if (!x_tok) { res.json(); return;}
        const usr_id = await redisClient.get(`auth_${x_tok}`);
        if (!usr_id) {
            res.status(401).json({"error": "Unauthorized"});
            return;
        }
        const user = await (await dbClient.client.db().collection('users'))
        .findOne({ "_id": ObjectID(usr_id) });
        if (!user) { res.json(); return;}

        const stakeAmt = req.body.stakeAmt;
        const betTime = req.body.betTime;
        const gameStatus = 'open';
        const outcome = req.body.outcome;
        const totalOdd = req.body.totalOdd;
        const expReturns = req.body.expReturns;
        const games = req.body.games;
        if (!stakeAmt || !betTime || !gameStatus || !outcome
        || !totalOdd || !expReturns || !games) {res.status(400).json({}); return;}
        const result = await (await dbClient.client.db().collection('games'))
	    .insertOne({"userId": user._id, "stakeAmt": stakeAmt,
	    "betTime": betTime, "gameStatus": gameStatus, "outcome": outcome,
        "totalOdd": totalOdd, "expReturns": expReturns,
        "games": games
        });
	    const gameId = result.insertedId.toString();
        res.status(200).json({"gameId": gameId, "userId": user._id});
    }
    

    static async getOpenbet(req, res) {
        //get open bets for a user with pagination
        const x_tok = req.headers['x-token'];
        if (!x_tok) { res.json(); return;}
        const usr_id = await redisClient.get(`auth_${x_tok}`);
        if (!usr_id) {
            res.status(401).json({"error": "Unauthorized"});
            return;
        }
        const user = await (await dbClient.client.db().collection('users'))
        .findOne({ "_id": ObjectID(usr_id) });
        if (!user) { res.json(); return;}

        const page = parseInt(req.params.pg);
        if (isNaN(page)) {res.status(400).json({"error": "wrong page value"})}
        if (!page) {res.status(400).json({}); return;}
        let count = 0;
        if (page === 1) {
            const count = await (await dbClient.client.db().collection('games'))
            .countDocuments({"userId": usr_id, "gameStatus": 'open'});
        }

        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const opengames = await (await dbClient.client.db().collection('games'))
        .find({"userId": usr_id, "gameStatus": 'open'}).skip(skip).limit(pageSize).toArray();

        res.status(200).json({"count": count, "opengames": opengames});
    }

    static async getClosebet(req, res) {
        //get closed bets for a user with pagination
        const x_tok = req.headers['x-token'];
        if (!x_tok) { res.json(); return;}
        const usr_id = await redisClient.get(`auth_${x_tok}`);
        if (!usr_id) {
            res.status(401).json({"error": "Unauthorized"});
            return;
        }
        const user = await (await dbClient.client.db().collection('users'))
        .findOne({ "_id": ObjectID(usr_id) });
        if (!user) { res.json(); return;}

        const page = parseInt(req.params.pg);
        if (isNaN(page)) {res.status(400).json({"error": "wrong page value"})}
        if (!page) {res.status(400).json({}); return;}
        let count = 0;
        if (page === 1) {
            count = await (await dbClient.client.db().collection('games'))
            .countDocuments({"userId": usr_id, "gameStatus": 'close'});
        }

        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const closegames = await (await dbClient.client.db().collection('games'))
        .find({"userId": usr_id, "gameStatus": 'close'}).skip(skip).limit(pageSize).toArray();

        res.status(200).json({"count": count, "closegames": closegames});
    }


    static async getOdds(req, res) {
        //get game odds of a particular date as parameter
        const date = req.params.date;
        if (!date) {res.status(400).json({}); return;}
        if (date.length !== 8) {res.status(400).json({}); return;}
        //check if date supplied is in range
        let today = new Date();
		for (let i = 0; i < 8; i++) {
			const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
			let dateLst = nex.toLocaleDateString().split('/');
			let date_ = dateLst[2] + dateLst[1] + dateLst[0];
            if (date === date_) {
                let getOdds = await (await dbClient.client.db().collection('odds'))
                .findOne({ "date": date_ });
                if (getOdds) {
                    res.status(200).json({"odds": getOdds.odds});
                    return;           
                }
            }
		}
	    res.status(400).json({"error": "Date not in range"});
    }


    static async postOdds(req, res) {
        //post odds. for admin only
        const x_tok = req.headers['x-token'];
        if (!x_tok) { res.json(); return;}
        const usr_id = await redisClient.get(`auth_${x_tok}`);
        if (!usr_id) {
            res.status(401).json({"error": "Unauthorized"});
            return;
        }
        const user = await (await dbClient.client.db().collection('users'))
        .findOne({ "_id": ObjectID(usr_id) });
        if (!user) { res.json(); return;}
        if (user.email !== 'richardchekwas@gmail.com') {
            res.status(403).json({'error': 'Access completely denied'});
            return;
        }
        const date = req.params.date;
        const odds = req.body.odds;
        if (!date || !odds) {res.status(400).json({}); return;}
        //sample of odds [{Eid, homeodd, awayodd, drawodd} ...]
        for (let i = 0; i < 8; i++) {
			const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
			let dateLst = nex.toLocaleDateString().split('/');
			let date_ = dateLst[2] + dateLst[1] + dateLst[0];
            if (date === date_) {
                let getOdds = await (await dbClient.client.db().collection('odds'))
                .findOne({ "date": date });
                const oddsLen = odds.length;
                for (let i = 0; i < oddsLen; i++) {
                    let Eid = odds[i].Eid;
                    getOdds.odds[0].Eid[0].homeodd = odds[i].homeodd;
                    getOdds.odds[0].Eid[0].awayodd = odds[i].awayodd;
                    getOdds.odds[0].Eid[0].drawodd = odds[i].drawodd;
                }
                await (await dbClient.client.db().collection('odds'))
                .replaceOne({ "date": date }, getOdds);
                res.status(200).json({"status": "ok"});
                return;            
            }
		}
        res.json({}); return;
    }
}


export default GamesController;
module.exports = GamesController;