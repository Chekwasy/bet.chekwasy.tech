const { ObjectID } = require('mongodb');
import dbClient from './utils/db';
const fs = require('fs').promises;

async function writeFile(dfile, content) {
    try {
        await fs.writeFile(dfile, content);
        console.log('File written successfully!');
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

const odd = async () => {
    let today = new Date();
    for (let i = 0; i < 8; i++) {
        const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
        let options = {'timeZone': 'WAT'};
        let dateLst = nex.toLocaleDateString(options).split('/');
        if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
        if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
        let date_ = dateLst[2] + dateLst[0] + dateLst[1];
        let dateodds = await (await dbClient.client.db().collection('odds'))
        	.findOne({ "date": date_ });
        //console.log(dateodds);
	let tosave = '';
	Object.keys(dateodds.odds[0]).map(async (ech) => {
		tosave = tosave + `${ech}_${dateodds.odds[0][ech][0].hometeam}_${dateodds.odds[0][ech][0].awayteam}_${dateodds.odds[0][ech][0].homeodd}_${dateodds.odds[0][ech][0].drawodd}_${dateodds.odds[0][ech][0].awayodd}\n`;
	});
	console.log(tosave);
	writeFile(date_, tosave);
    }
};

odd();
