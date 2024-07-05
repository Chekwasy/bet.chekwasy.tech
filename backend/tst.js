const axios = require('axios');
const aa = async () => {
    let today = new Date();
    const nex = new Date(today.getTime() + (0 * 24 * 60 * 60 * 1000));
    let options = {'timeZone': 'CET'};
    let dateLst = nex.toLocaleDateString(options).split('/');
    let date_ = dateLst[2] + dateLst[0].padStart(2, '0') + dateLst[1].padStart(2, '0');
    console.log(date_);
	const date = new Date();
	const gmt1 = new Date(date.toLocaleString('en-GB', { timeZone: 'GMT+1' }));
	console.log(gmt1);
//    let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/20240523/1?countryCode=NG&locale=en&MD=1`);
  //  let games = response.data;
    //console.log(games);
};

aa();
