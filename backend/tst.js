let today = new Date();
const nex = new Date(today.getTime() + (0 * 24 * 60 * 60 * 1000));
let options = {'timeZone': 'CET'};
let dateLst = nex.toLocaleDateString(options).split('/');
let date_ = dateLst[2] + dateLst[1] + dateLst[0];
console.log(date_)