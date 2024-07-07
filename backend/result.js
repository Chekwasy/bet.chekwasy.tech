import dbClient from './utils/db';
const axios = require('axios');
const { ObjectID } = require('mongodb');



const res = async () => {
    while (1) {
        const opengames = await (await dbClient.client.db().collection('games')).find({gameStatus: 'open'}).toArray();
        console.log('working as expected');

        opengames.map((ech) => {
            Object.keys(ech.games).map(async (itm) => {
                //console.log(ech.games);
                let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${ech.games[itm].matchtime.split(':')[2]}/1?countryCode=NG&locale=en&MD=1`);
		        let games = response.data;
                // const getDate = await (await dbClient.client.db().collection('dates'))
                // .findOne({ "date": ech.games[itm].matchtime.split(':')[2] });
                games.Stages.map((gam) => {
                    gam.Events.map(async (idd) => {
                        //console.log(idd.Eid);
                        if (itm === idd.Eid) {
                            if (idd.Eps === 'FT' && idd.Tr1 && idd.Tr2) {
                                const res = idd.Tr1 + ' : ' + idd.Tr2;
                                let oc = '';
                                if (parseInt(idd.Tr1) > parseInt(idd.Tr2)) {
                                    oc = 'home';
                                }
                                if (parseInt(idd.Tr1) < parseInt(idd.Tr2)) {
                                    oc = 'away';
                                }
                                if (parseInt(idd.Tr1) === parseInt(idd.Tr2)) {
                                    oc = 'draw';
                                }
                                let winres = '';
                                if (ech.games[itm].staketype === oc) {
                                    winres = 'won';
                                }
                                if (ech.games[itm].staketype !== oc) {
                                    winres = 'lost';
                                }
                                // const matchresultky = `games.${itm}.matchresult`;
                                // const matchstatusky = `games.${itm}.matchstatus`;
                                await (await dbClient.client.db().collection('games'))
			                    .updateOne({ "_id": ech._id },
			                    { $set: { 
                                    [`games.${itm}.matchresult`]: res, 
                                    [`games.${itm}.matchstatus`]: 'FT',
                                    [`games.${itm}.outcome`]: oc,
                                    [`games.${itm}.result`]: winres,
                                } });
                            }
                            if (idd.Eps.includes("'") && idd.Tr1 && idd.Tr2) {
                                const res = idd.Tr1 + ' : ' + idd.Tr2;
                                // const matchresultky = `games.${itm}.matchresult`;
                                // const matchstatusky = `games.${itm}.matchstatus`;
                                await (await dbClient.client.db().collection('games'))
			                    .updateOne({ "_id": ech._id },
			                    { $set: { 
                                    [`games.${itm}.matchresult`]: res, 
                                    [`games.${itm}.matchstatus`]: idd.Eps,
                                } });
                            }
                            if (((idd.Eps === 'Canc.') || (idd.Eps === 'Postp.')) && ((ech.games[itm].matchstatus !== 'Canc.') || (ech.games[itm].matchstatus !== 'Postp.'))) {
                                const res = idd.Eps;
                                // const matchresultky = `games.${itm}.matchresult`;
                                // const matchstatusky = `games.${itm}.matchstatus`;
                                await (await dbClient.client.db().collection('games'))
			                    .updateOne({ "_id": ech._id },
			                    { $set: { 
                                    [`games.${itm}.matchresult`]: res, 
                                    [`games.${itm}.matchstatus`]: res,
                                    [`games.${itm}.outcome`]: 'Void',
                                    [`games.${itm}.result`]: 'Void',
                                } });
                            }
                        }
                    });
                });
               // if (ech.games[itm].matchstatus === 'NS') {
                 //   const matchday = ech.games[itm].matchtime.split(':')[2].substr(6,8);
                   // const mthr = parseInt(ech.games[itm].matchtime.split(':')[0]);
             //       const td = new Date();
               //     const tod = td.getDate().toString();
                 //   if (matchday !== tod && mthr > 1) {
                   //     await (await dbClient.client.db().collection('games'))
                     //   .updateOne({ "_id": ech._id },
                       // { $set: { 
                         //   [`games.${itm}.matchresult`]: 'NR', 
                           // [`games.${itm}.matchstatus`]: 'Void',
                 //           [`games.${itm}.outcome`]: 'Void',
                   //         [`games.${itm}.result`]: 'Void',
                     //   } });
                    //}
                //}
            });
        });

        opengames.map(async (each) => {
            const stakeamt = parseFloat(each.stakeAmt);
            let totodd = parseFloat(each.totalOdd);
            let chkns = true;
            let chkoutcome = 'won';
            Object.keys(each.games).map(async (item) => {
                if (each.games[item].outcome === 'Void') {
                    totodd = totodd / parseFloat(each.games[item].stakeodd);
                }
                if (each.games[item].matchstatus === 'NR') {
                    chkns = false;
                }
                if (each.games[item].result === 'lost') {
                    chkoutcome = 'lost';
                }
            });

            if (chkns) {
                await (await dbClient.client.db().collection('games'))
                .updateOne({ "_id": each._id },
                { $set: { 
                    [`totalOdd`]: totodd.toFixed(2), 
                    [`expReturns`]: (stakeamt * totodd).toFixed(2),
                    [`gameStatus`]: 'close',
                    [`outcome`]: chkoutcome,
                } });
                if (chkoutcome === 'won') {
                    const user = await (await dbClient.client.db().collection('users'))
                    .findOne({ "_id": ObjectID(each.userId) });
                    await (await dbClient.client.db().collection('users'))
                    .updateOne({ "_id": each.userId },
                    { $set: { 
                        [`account_balance`]: (parseFloat(user.account_balance) + (stakeamt * totodd)).toFixed(2),
                    } });
                }
            }


        });

        await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
    }
};

res();
