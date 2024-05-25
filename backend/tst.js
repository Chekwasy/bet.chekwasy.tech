const axios = require('axios');
const aa = async () => {
    let today = new Date();
    const nex = new Date(today.getTime() + (0 * 24 * 60 * 60 * 1000));
    let options = {'timeZone': 'CET'};
    let dateLst = nex.toLocaleDateString(options).split('/');
    let date_ = dateLst[2] + dateLst[1] + dateLst[0];
    console.log(date_)
    let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/20240523/1?countryCode=NG&locale=en&MD=1`);
    let games = response.data;
    console.log(games);
};

aa();