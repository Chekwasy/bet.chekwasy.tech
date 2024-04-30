import dbClient from './utils/db';
const axios = require('axios');
const cheerio = require('cheerio');


const scrap = async () => {
 
	// let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/20240430/1?countryCode=NG&locale=en&MD=1`);
	// let gamesJson = response.data;
	// // save default odds for all events
	// let gjLen = gamesJson.Stages.length;
	// let oddLst = [];
	// let eventDit = {};
	// for (let i = 0; i < gjLen; i++) {
	// 	let evtLen = gamesJson.Stages[i].Events.length;
	// 	if (evtLen > 0) {
	// 		for (let j = 0; j < evtLen; j++) {
	// 			if (gamesJson.Stages[i].Events[j]) {
	// 				let EidLstDit = {};
	// 				eventDit[gamesJson.Stages[i].Events[j].Eid] = [];
	// 				EidLstDit['hometeam'] = gamesJson.Stages[i].Events[j].T1[0].Nm;
	// 				EidLstDit['awayteam'] = gamesJson.Stages[i].Events[j].T2[0].Nm;
	// 				EidLstDit['homeodd'] = 1.5;
	// 				EidLstDit['awayodd'] = 1.5;
	// 				EidLstDit['drawodd'] = 3;
	// 				eventDit[gamesJson.Stages[i].Events[j].Eid].push(EidLstDit);
	// 			}
	// 		}
	// 	}
	// }
	// oddLst.push(eventDit);
	// console.log(oddLst);
	while (1) {
		//handle saving games for 7 days from today. 
		let today = new Date();
		for (let i = 0; i < 8; i++) {
			const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
			let dateLst = nex.toLocaleDateString().split('/');
			let date_ = dateLst[2] + dateLst[1] + dateLst[0];
			console.log(date_);
			let getDate = await (await dbClient.client.db().collection('dates'))
        	.findOne({ "date": date_ });
			if (!getDate) {
				let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`);
				let gamesJson = response.data;
				let insertDate = await (await dbClient.client.db().collection('dates'))
				.insertOne({"date": date_, "games": gamesJson
				});
				let gamesId = insertDate.insertedId.toString();
				console.log(gamesId);
				// save default odds for all events
				let gjLen = gamesJson.Stages.length;
				let oddLst = [];
				let eventDit = {};
				for (let i = 0; i < gjLen; i++) {
					let evtLen = gamesJson.Stages[i].Events.length;
					if (evtLen > 0) {
						for (let j = 0; j < evtLen; j++) {
							if (gamesJson.Stages[i].Events[j]) {
								let EidLstDit = {};
								eventDit[gamesJson.Stages[i].Events[j].Eid] = [];
								EidLstDit['hometeam'] = gamesJson.Stages[i].Events[j].T1[0].Nm;
								EidLstDit['awayteam'] = gamesJson.Stages[i].Events[j].T2[0].Nm;
								EidLstDit['homeodd'] = 1.5;
								EidLstDit['awayodd'] = 1.5;
								EidLstDit['drawodd'] = 3;
								eventDit[gamesJson.Stages[i].Events[j].Eid].push(EidLstDit);
							}
						}
					}
				}
				oddLst.push(eventDit);
				let insertOdd = await (await dbClient.client.db().collection('odds'))
				.insertOne({"date": date_, "odds": oddLst
				});
			}
		}
		let do_update = false;

		//form date string
		let exp_today = new Date(today.getTime());
		let exp_dateLst = exp_today.toLocaleDateString().split('/');
		let dateStr = exp_dateLst[2] + exp_dateLst[1] + exp_dateLst[0];

		//get games object to work on
		let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/1?countryCode=NG&locale=en&MD=1`);
		let games = response.data;
		let gamesLen = games.Stages.length;
		for (let i = 0; i < gamesLen; i++) {
			let eventLen = games.Stages[i].Events.length;
			if (eventLen > 0) {
				for (let j = 0; j < eventLen; j++) {
					if (games.Stages[i].Events[j]) {
						if (games.Stages[i].Events[j].Eps !== "NS") {
							games.Stages[i].Events.splice(j, 1);
							j--;
							eventLen --;
							do_update = true;
						}
					}
				}
			}
		}

		for (let i = 0; i < gamesLen; i++) {
			let eventLen = games.Stages[i].Events.length;
			if (eventLen === 0) {
				if (games.Stages[i]) {
					games.Stages.splice(i, 1);
					i--;
					gamesLen--;
					do_update = true;
				}
			}
		}
		console.log(gamesLen);
		if (do_update === true) {
			//update the current games available to bet
			await (await dbClient.client.db().collection('dates'))
			.updateOne({ "date": dateStr },
			{ $set: { "games":  games} });
			do_update = false;
		}

	await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));		
	}
};

scrap();