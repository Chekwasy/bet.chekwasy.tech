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
			let options = {'timeZone': 'WAT'};
			let dateLst = nex.toLocaleDateString(options).split('/');
			if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
			if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
			let date_ = dateLst[2] + dateLst[0] + dateLst[1];
			console.log(date_);
			let getDate = await (await dbClient.client.db().collection('dates'))
        	.findOne({ "date": date_ });
			if (!getDate) {
				console.log(date_);
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
								EidLstDit['drawodd'] = 3.0;
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
		if (exp_dateLst[0].length === 1) {exp_dateLst[0] = '0' + exp_dateLst[0];}
		if (exp_dateLst[1].length === 1) {exp_dateLst[1] = '0' + exp_dateLst[1];}
		let dateStr = exp_dateLst[2] + exp_dateLst[0] + exp_dateLst[1];

		//get games object to work on
		let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/1?countryCode=NG&locale=en&MD=1`);
		let games = response.data;
		let gamesLen = games.Stages.length;
		let oddLst = [];
		let eventDit = {};
		for (let i = 0; i < gamesLen; i++) {
			let eventLen = games.Stages[i].Events.length;
			if (eventLen > 0) {
				for (let j = 0; j < eventLen; j++) {
					if (games.Stages[i].Events[j]) {
						let EidLstDit = {};
						eventDit[games.Stages[i].Events[j].Eid] = [];
						EidLstDit['hometeam'] = games.Stages[i].Events[j].T1[0].Nm;
						EidLstDit['awayteam'] = games.Stages[i].Events[j].T2[0].Nm;
						EidLstDit['homeodd'] = 1.7;
						EidLstDit['awayodd'] = 1.8;
						EidLstDit['drawodd'] = 3.1;
						eventDit[games.Stages[i].Events[j].Eid].push(EidLstDit);
						// if (games.Stages[i].Events[j].Eps !== "NS") {
						// 	games.Stages[i].Events.splice(j, 1);
						// 	j--;
						// 	eventLen --;

						// 	do_update = true;
						// }
						if (games.Stages[i].Events[j].Esd) {
							const tm = games.Stages[i].Events[j].Esd;
							const tmhr = parseInt(tm.toString().slice(-6,-4) || 0) || 0;
							const tmmin = parseInt(tm.toString().slice(-4, -2) || 0) || 0;
							const curhr = today.getHours();
							const curmin = today.getMinutes();
							//console.log(tmhr, tmmin, curhr, curmin);
							if ((curhr > tmhr) || (curhr === tmhr && curmin >= tmmin)) {
								games.Stages[i].Events.splice(j, 1);
								j--;
								eventLen --;

								do_update = true;
							}
						}
					}
				}
			}
		}
		oddLst.push(eventDit);

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
		console.log(today.getHours(), today.getMinutes());
		console.log(gamesLen);
		if (do_update === true) {
			//update the current games available to bet
			await (await dbClient.client.db().collection('dates'))
			.updateOne({ "date": dateStr },
			{ $set: { "games":  games} });
			let dateodds = await (await dbClient.client.db().collection('odds'))
        	.findOne({ "date": dateStr });
			if (1) {//nahere
				await (await dbClient.client.db().collection('odds'))
				.updateOne({ "date": dateStr },
				{ $set: { "odds":  oddLst} });
			}
			do_update = false;
		}

	await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));		
	}
};

scrap();

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import Cookie from 'js-cookie';
// import { v4 as uuidv4 } from 'uuid';
// import $ from 'jquery';


// //setting date items
// let today = new Date();
// const displayDate = [];
// for (let i = 0; i < 7; i++) {
//   const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
//   let options = {'timeZone': 'CET'};
//   let dateitem = nex.toLocaleDateString(options);
//   displayDate.push(dateitem);
// }
// const curDay = displayDate[0];
// const cookie_id = uuidv4();
// let fd = ''; //date to use
// let

// function Main_bar() {
//   //set use state for date games attribute
//   const urlNS = 'http://';
//   const [selectDate, setSelectDate] = useState(curDay[2] + curDay[1] + curDay[0]);
//   const [country_lea, setCountry_lea]  = useState({});
//   const [gameodds, setGameodds] = useState('');
//   let gcookieid = Cookie.get('savedgamesid');
//   let savedgamesapi = {};
//   const [gamesSelected, setGamesSelected] = useState(savedgamesapi);
//   const url = `http://localhost:5000/api/v1/games/`;
//   const url2 = `http://localhost:5000/api/v1/odds/`;
  

//   //function to set all odds selected
//   const setallodd = (sapi) => {
//     for (const stkey in sapi) {
//       const stvalue = sapi[stkey];
//       const gaOdddt = document.querySelector(`[data-key="${stkey + ':0'}"]`);
//       // if (!gaOdddt) {
//       //   const newdt = {...sapi};
//       //   delete newdt[stkey];
//       //   setGamesSelected(newdt);
//       //   let savedgamesid = Cookie.get('savedgamesid'); 
//       //   if (!savedgamesid) {
//       //     savedgamesid = cookie_id;
//       //     Cookie.set('savedgamesid', savedgamesid, { expires: 1, path: '', sameSite: 'strict' });
//       //   }
//       //   const to_save = {'id_': savedgamesid, 'savedgames': {...sapi, [stkey]: [stvalue,]}};
//       //   $.ajax({
//       //     type: 'POST',
//       //     url: urlNS + 'localhost:5000/api/v1/savedgames',
//       //     data: JSON.stringify(to_save),
//       //     contentType: 'application/json',
//       //     success: function(res) {
//       //       console.log('okay');
//       //     },
//       //     error: function(err) {
//       //       console.log('error');
//       //     }
//       //   });
//       // }
//       if (gaOdddt) {
//       const chsel = document.querySelector(`[data-key="${stkey + ":" + stvalue[0].staketype}"]`);
//       if (chsel) {chsel.classList.add('oddSelected');}
//       }
      
//     }
//   };
//   //display fetched data from api
//   const displayFetched = async (url, url2) => {
//     let response = await axios.get(url);
//     let response2 = await axios.get(url2);
//     if (gcookieid) {
//       const sgapi = await axios.get(urlNS + `localhost:5000/api/v1/savedgames/${gcookieid}`);
//       savedgamesapi = sgapi.data;
//       setGamesSelected(savedgamesapi.savedgames);
//     }
// 	  let gamesJson = response.data;
//     let oddsJson = response2.data;
//     const gamdd = gamesJson.games;
//     const odds = oddsJson.odds;
//     const gameslen = gamdd.Stages.length;
//     let con_dit = {};
//     setGameodds(odds);
    
//     for (let i = 0; i < gameslen; i++) {
//       let con = gamdd.Stages[i].Cnm;
//       if (!con_dit[con]) {
//         con_dit[con] = {};
//       }
//       con_dit[con][gamdd.Stages[i].Snm] = gamdd.Stages[i].Events;
//     }
//     setCountry_lea(con_dit);
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setallodd(savedgamesapi.savedgames);
//   };

//   //function to handle a date selected
//   const handleDate = (e) => {
//     setSelectDate(e.target.value);
//     let dt = e.target.value.split('/');
//     fd = (dt[2] + dt[1] + dt[0]);
//     displayFetched(url + fd, url2 + fd);
//   };
  
//   //function to take games from cookies and set them
//   // const cookieFunction = () => {

//   // };
//   //function to reload to make games update
//   const reload = async () => { 
//     while (1) {
//       console.log('reloa',fd);
//       if(fd !== '') {
//         displayFetched(url + fd, url2 + fd);
//       }
//       await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000));
//     }
//   };

//   //takes care of current date display of games when page loads finish
//   useEffect(() => {
//     if (fd === '') {
//       console.log('ue work');
//       const dt = displayDate[0].split('/');
//       //displayFetched(url + fd, url2 + fd);
//       fd = (dt[2] + dt[1] + dt[0]);
//     }
//     reload();
//   }, []);
//   const gameTime = (tm) => {
//     if (tm) {
//       return tm.toString().slice(-6,-4) + ':' + tm.toString().slice(-4,-2);
//     }
//   };

//   const addOdd = (evt) => {
//     const oddKey = evt.target.dataset.key;
//     const oddItem = evt.target;
//     const txtCnt = evt.target.textContent;
//     const det = oddKey.split(':');
//     const game_id = det[0];
//     const mkt = det[1];
//     const dgame = {};
//     const main_ul = evt.target.closest('ul');
//     const tm = document.querySelector(`[data-key="${game_id + ':0'}"]`).textContent;
//     const game_det = gameodds[0][game_id];
//     dgame['hometeam'] = game_det[0]['hometeam'];
//     dgame['awayteam'] = game_det[0]['awayteam'];
//     dgame['staketype'] = mkt;
//     dgame['markettype'] = '1x2';
//     dgame['stakeodd'] = parseFloat(txtCnt) || 1;
//     dgame['matchstatus'] = 'NS';
//     dgame['matchresult'] = 'NR';
//     dgame['outcome'] = 'NR';
//     dgame['result'] = 'NR';
//     dgame['matchtime'] = tm + ':' + fd;
    
//     if (!(gamesSelected[game_id])) {
//       setGamesSelected({...gamesSelected, [game_id]: [dgame,]});
//       let savedgamesid = Cookie.get('savedgamesid'); 
//       if (!savedgamesid) {
//         savedgamesid = cookie_id;
//         Cookie.set('savedgamesid', savedgamesid, { expires: 1, path: '', sameSite: 'strict' });
//       }
//       const to_save = {'id_': savedgamesid, 'savedgames': {...gamesSelected, [game_id]: [dgame,]}};
//       $.ajax({
//         type: 'POST',
//         url: urlNS + 'localhost:5000/api/v1/savedgames',
//         data: JSON.stringify(to_save),
//         contentType: 'application/json',
//         success: function(res) {
//           console.log('okay');
//         },
//         error: function(err) {
//           console.log('error');
//         }
//       });
//       oddItem.classList.add('oddSelected');
//     } else {
//       const newdit = {...gamesSelected};
//       if (newdit[game_id][0].staketype === mkt) {
//         delete newdit[game_id];
//         setGamesSelected(newdit);
//         let savedgamesid = Cookie.get('savedgamesid'); 
//         if (!savedgamesid) {
//           savedgamesid = cookie_id;
//           Cookie.set('savedgamesid', savedgamesid, { expires: 1, path: '', sameSite: 'strict' });
//         }
//         const to_save = {'id_': savedgamesid, 'savedgames': {...gamesSelected, [game_id]: [dgame,]}};
//         $.ajax({
//           type: 'POST',
//           url: urlNS + 'localhost:5000/api/v1/savedgames',
//           data: JSON.stringify(to_save),
//           contentType: 'application/json',
//           success: function(res) {
//             console.log('okay');
//           },
//           error: function(err) {
//             console.log('error');
//           }
//         });
//         oddItem.classList.remove('oddSelected');
//       }
//     }
//   };

  

//   return (
//     <div className='main_bar'>
//       <div className='main_head'>
//         <div className='mh_type'>1X2</div>
//         <div className='mh_date'>
//           <div className='mh_date_day'>
//             <select className='mh_select' name="date" value={selectDate} onChange={handleDate} id="date">
//               <option value={displayDate[0]}>{displayDate[0]}</option><option value={displayDate[1]}>{displayDate[1]}</option><option value={displayDate[2]}>{displayDate[2]}</option> <option value={displayDate[3]}>{displayDate[3]}</option> <option value={displayDate[4]}>{displayDate[4]}</option> <option value={displayDate[5]}>{displayDate[5]}</option><option value={displayDate[6]}>{displayDate[6]}</option>
//             </select>
//           </div>
//           <div className='mh_date_month'></div>
//           <div className='mh_date_year'></div>
//         </div>
//       </div>
//       <div className='mb_body'>
//         <ul className='mb_all_country'> {Object.keys(country_lea).map((countryy) => (
//             <li key={countryy} className='mb_country'>
//               <ul key={countryy} className='mb_all_league'>{countryy}
//                 {Object.keys(country_lea[countryy]).map((leaguee) => (
//                   <li key={leaguee} className='mb_league'>
//                     <ul key={leaguee}>{leaguee}
//                       {country_lea[countryy][leaguee].map((event) => (
//                         <ul key={event.Eid} className='mb_all_country'>
//                           <li key={(event.Eid)} className='mb_event'>
//                             <ul className='mb_event_head' key={'match_event'}><li>{event.T1[0].Nm} vs {event.T2[0].Nm}</li></ul>
//                             <ul className='mb_all_country'>
//                               <li>
//                                 <ul className='mb_event_odds'>
//                                   <li ><div data-key={event.Eid + ':0'}>{event.Esd ? gameTime(event.Esd) : ''}</div></li>
//                                   <li ><button data-key={event.Eid + ':home'} onClick={addOdd}>{gameodds[0][(event.Eid)] ? gameodds[0][(event.Eid)][0]['homeodd'] : '' }</button></li>
//                                   <li ><button data-key={event.Eid + ':draw'} onClick={addOdd}>{gameodds[0][(event.Eid)] ? gameodds[0][(event.Eid)][0]['drawodd'] : '' }</button></li>
//                                   <li ><button data-key={event.Eid + ':away'} onClick={addOdd}>{gameodds[0][(event.Eid)] ? gameodds[0][(event.Eid)][0]['awayodd'] : '' }</button></li>
//                                 </ul>
//                               </li>
//                             </ul>
//                           </li>
//                         </ul>
//                       ))}
//                     </ul>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>   
//       </div>
//     </div>
//   )
// }

// export default Main_bar;
