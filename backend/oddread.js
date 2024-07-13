const filechk = require('fs');

async function readFile(dfile) {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
}

const odd = async () => {
	let today = new Date();
	for (let i = 0; i < 8; i++) {
		const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
		let options = {'timeZone': 'WAT'};
		let dateLst = nex.toLocaleDateString(options).split('/');
		if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
		if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
		let date_ = dateLst[2] + dateLst[0] + dateLst[1] + "_";
		const res = readFile(date_);
		const  reslst = res.split('\n');
