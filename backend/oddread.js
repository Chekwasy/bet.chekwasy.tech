const filechk = require('fs');
import dbClient from './utils/db';

let readed = '';
const readFile = (path) => new Promise((resolve, reject) => {
	filechk.readFile(path, 'utf-8', (err, data) => {
	  if (err) {
		reject(new Error('Cannot load the file'));
	  }
	  if (data) {
		readed = data;
		resolve(true);
	  }
	});
  });

const odd = async () => {
	let today = new Date();
	for (let i = 0; i < 8; i++) {
		const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
		let options = {'timeZone': 'WAT'};
		let dateLst = nex.toLocaleDateString(options).split('/');
		if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
		if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
		let date_ = dateLst[2] + dateLst[0] + dateLst[1];
		readFile(date_ + '_')
		.then(async (aaa) => {
			let res = readed;
			const reslst = res.split('\n');
			let dict = {}; 
			reslst.map((itm) => {
				if (itm.length > 5) {
					const perread = itm.split('_');
					let EidLstDit = {};
					let perlst = [];
					EidLstDit['hometeam'] = perread[1];
					EidLstDit['awayteam'] = perread[2];
					EidLstDit['homeodd'] = parseFloat(perread[3]);
					EidLstDit['awayodd'] = parseFloat(perread[5]);
					EidLstDit['drawodd'] = parseFloat(perread[4]);
					perlst.push(EidLstDit);
					dict[perread[0]] = perlst;
				}
			});
			console.log(dict);
			const gg = [].push(dict);
			await (await dbClient.client.db().collection('odds'))
				.updateOne({ "date": date_ },
				{ $set: { "odds":  gg } });
		})
			.catch((error) => {
			console.log(error);
		});
		// const dodds = dateodds.odds['0'];
		// 	console.log(dodds['1295560'][0].hometeam);
	}
};

odd();