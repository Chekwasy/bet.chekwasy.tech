import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { mainbarUpdate } from './State/mainbarState';
import { useSelector } from 'react-redux';

const local = '167.99.194.130';


//setting date items
let today = new Date();
const displayDate = [];
const curhrs = today.getHours();
const curmins = today.getMinutes;
const curday = today.getDay;
const curmonth = today.getMonth + 1;
const curyear = today.getFullYear;
for (let i = 0; i < 7; i++) {
  const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
  let options = {'timeZone': 'CET'};
  let dateitem = nex.toLocaleDateString(options);
  let dateLst = dateitem.split('/');
  if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
  if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
  let date_ = dateLst[1] + '/' + dateLst[0] + '/' + dateLst[2];
  displayDate.push(date_);
}

const curDay = displayDate[0];
const cookie_id = uuidv4(); //generating uid for saving games selected id
let fd = ''; //date to use
let selectDate = curDay[2] + curDay[1] + curDay[0]; //current date
const urlNS = 'http://'; //for making change to https easy
//let country_lea = ''; //help to align all games with respected countries
//let gameodds = ''; //all games odds obejects
let gcookieid = Cookie.get('savedgamesid'); //cookie id for getting saved games from backend
if (!gcookieid) {
  Cookie.set('savedgamesid', cookie_id, { expires: 1, path: '', sameSite: 'strict' });
  gcookieid = cookie_id;
}
  //let savedgamesapi = {}; //saved games from backend which was saved
//let gamesSelected = {}; //all selected games
const url = urlNS + `${local}/api/v1/games/`; //url for getting games
const url2 = urlNS + `${local}/api/v1/odds/`; //url for getting odds

//main bar component
function Main_bar() {
  const dispatch = useDispatch();
  const mainbar = useSelector(state => state.mainbarState);
  console.log('redux', mainbar.gamesSelected);
  //set use state for date games attribute
  //const [selectDate, setSelectDate] = useState(curDay[2] + curDay[1] + curDay[0]);
  const [country_lea, setCountry_lea]  = useState({});
  const [gameodds, setGameodds] = useState('');
  //const [loaded, setLoaded] = useState(false);
  //let gcookieid = Cookie.get('savedgamesid');
  //let savedgamesapi = {};
  //const [gamesSelected, setGamesSelected] = useState(savedgamesapi);
  //const url = `http://localhost:5000/api/v1/games/`;
  //const url2 = `http://localhost:5000/api/v1/odds/`;

  

  //function to set all odds selected
  const setallodd = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    let newdt = {...(mainbar.gamesSelected)};
    let chk = false;
    for (const stkey in mainbar.gamesSelected) {
      const stvalue = mainbar.gamesSelected[stkey];
      const timee = stvalue.matchtime;
      const timeLst = timee.split(':');
      const hrss = parseInt(timeLst[0]);
      const minss = parseInt(timeLst[1]);
      const yearr = timeLst[2].substring(0, 4);
      const monthh = timeLst[2].substring(4,6);
      const dayy = timeLst[2].substring(6, 8);
      const givendate = dayy + "/" + monthh + "/" + yearr;
      //const gaOdddt = document.querySelector(`[data-key="${stkey + ':0'}"]`);
      if ((displayDate.includes(givendate))) {
        if ((hrss === curhrs) && (minss > curmins)) {
          const chsel = document.querySelector(`[data-key="${stkey + ":" + stvalue.staketype}"]`);
          if (chsel) {chsel.classList.add('oddSelected');}
        }
        if (hrss > curhrs) {
          const chsel = document.querySelector(`[data-key="${stkey + ":" + stvalue.staketype}"]`);
          if (chsel) {chsel.classList.add('oddSelected');}
        }
      } else {
        delete newdt[stkey];
        chk = true;
        const chsel = document.querySelector(`[data-key="${stkey + ":" + stvalue.staketype}"]`);
        if (chsel) {chsel.classList.remove('oddSelected');}
      }
    }
    if (chk) {
      const to_save = {'id_': gcookieid, 'savedgames': newdt};
      dispatch(mainbarUpdate({'gamesSelected': newdt, setalloddsFunction: false}));
      $.ajax({
        type: 'POST',
        url: urlNS + `${local}/api/v1/savedgames`,
        data: JSON.stringify(to_save),
        contentType: 'application/json',
        success: function(res) {
          console.log('okay');
        },
        error: function(err) {
          console.log('error');
        }
      });
    }
  };
  //display fetched data from api
  const displayFetched = async (url, url2) => {
    let response = await axios.get(url);
    let response2 = await axios.get(url2);
    const sgapi = await axios.get(urlNS + `${local}/api/v1/savedgames/${gcookieid}`);
    const savedgamesapi = sgapi.data;
    const gamesselected = (savedgamesapi.savedgames);
    dispatch(mainbarUpdate({'gamesSelected': gamesselected, setalloddsFunction: false}));
  	let gamesJson = response.data;
    let oddsJson = response2.data;
    const gamdd = gamesJson.games;
    const odds = oddsJson.odds;
    const gameslen = gamdd.Stages.length;
    let con_dit = {};
    setGameodds(odds);
    
    for (let i = 0; i < gameslen; i++) {
      let con = gamdd.Stages[i].Cnm;
      if (!con_dit[con]) {
        con_dit[con] = {};
      }
      con_dit[con][gamdd.Stages[i].Snm] = gamdd.Stages[i].Events;
    }
    setCountry_lea(con_dit);
    //await new Promise(resolve => setTimeout(resolve, 1000));
    setallodd();
  };
  //function to handle a date selected
  const handleDate = (e) => {
    selectDate = (e.target.value);
    let dt = selectDate.split('/');
    fd = (dt[2] + dt[1] + dt[0]);
    displayFetched(url + fd, url2 + fd);
  };
  
  //function to take games from cookies and set them
  // const cookieFunction = () => {

  // };
  //function to reload to make games update
  const reload = async () => { 
    while (1) {
      if(fd !== '') {
        displayFetched(url + fd, url2 + fd);
      }
      await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000));
    }
  };

  //takes care of current date display of games when page loads finish
  useEffect(() => {
    if (fd === '') {
    const dt = displayDate[0].split('/');
    fd = (dt[2] + dt[1] + dt[0]);
    }
    reload();
    //setLoaded(true);
  }, []);
  useEffect(() => {
    setallodd();
  }, [mainbar]);
  // useEffect(() => {
  //   setallodd();
  // }, []);
  const gameTime = (tm) => {
    if (tm) {
      return tm.toString().slice(-6,-4) + ':' + tm.toString().slice(-4,-2);
    }
  };

  const addOdd = (evt) => {
    const oddKey = evt.target.dataset.key;
    const oddItem = evt.target;
    const txtCnt = evt.target.textContent;
    const det = oddKey.split(':');
    const game_id = det[0];
    const mkt = det[1];
    const dgame = {};
    const main_ul = evt.target.closest('ul');
    const tm = document.querySelector(`[data-key="${game_id + ':0'}"]`).textContent;
    const game_det = gameodds[0][game_id];
    dgame['hometeam'] = game_det[0]['hometeam'];
    dgame['awayteam'] = game_det[0]['awayteam'];
    dgame['staketype'] = mkt;
    dgame['markettype'] = '1x2';
    dgame['stakeodd'] = parseFloat(txtCnt) || 1;
    dgame['matchstatus'] = 'NS';
    dgame['matchresult'] = 'NR';
    dgame['outcome'] = 'NR';
    dgame['result'] = 'NR';
    dgame['matchtime'] = tm + ':' + fd;
    
    if (!((mainbar.gamesSelected)[game_id])) {
      oddItem.classList.add('oddSelected');
      const gamesselected = {...(mainbar.gamesSelected), [game_id]: dgame};
      dispatch(mainbarUpdate({'gamesSelected': gamesselected, setalloddsFunction: false}));
      const to_save = {'id_': gcookieid, 'savedgames': gamesselected};
      $.ajax({
        type: 'POST',
        url: urlNS + `${local}/api/v1/savedgames`,
        data: JSON.stringify(to_save),
        contentType: 'application/json',
        success: function(res) {
          console.log('okay');
        },
        error: function(err) {
          console.log('error');
        }
      });
    } else {
      if ((mainbar.gamesSelected)[game_id].staketype === mkt) {
        oddItem.classList.remove('oddSelected');
        let gamesselected = {...(mainbar.gamesSelected)};
        delete gamesselected[game_id];
        dispatch(mainbarUpdate({'gamesSelected': gamesselected, setalloddsFunction: false}));
        const to_save = {'id_': gcookieid, 'savedgames': gamesselected};
        $.ajax({
          type: 'POST',
          url: urlNS + `${local}/api/v1/savedgames`,
          data: JSON.stringify(to_save),
          contentType: 'application/json',
          success: function(res) {
            console.log('okay');
          },
          error: function(err) {
            console.log('error');
          }
        });
      }
    }
  };


  return (
    <div className='main_bar'>
      <div className='main_head'>
        <div className='mh_type'>1X2</div>
        <div className='mh_date'>
          <div className='mh_date_day'>
            <select className='mh_select' name="date" value={selectDate} onChange={handleDate} id="date">
              <option value={displayDate[0]}>{displayDate[0]}</option><option value={displayDate[1]}>{displayDate[1]}</option><option value={displayDate[2]}>{displayDate[2]}</option> <option value={displayDate[3]}>{displayDate[3]}</option> <option value={displayDate[4]}>{displayDate[4]}</option> <option value={displayDate[5]}>{displayDate[5]}</option><option value={displayDate[6]}>{displayDate[6]}</option>
            </select>
          </div>
          <div className='mh_date_month'></div>
          <div className='mh_date_year'></div>
        </div>
      </div>
      <div className='mb_body'>
        <ul className='mb_all_country'> {Object.keys(country_lea).map((countryy) => (
            <li key={countryy} className='mb_country'>
              <ul key={countryy} className='mb_all_league'>{countryy}
                {Object.keys(country_lea[countryy]).map((leaguee) => (
                  <li key={leaguee} className='mb_league'>
                    <ul key={leaguee}>{leaguee}
                      {country_lea[countryy][leaguee].map((event) => (
                        <ul key={event.Eid} className='mb_all_country'>
                          <li key={(event.Eid)} className='mb_event'>
                            <ul className='mb_event_head' key={'match_event'}><li>{event.T1[0].Nm} vs {event.T2[0].Nm}</li></ul>
                            <ul className='mb_all_country'>
                              <li>
                                <ul className='mb_event_odds'>
                                  <li ><div data-key={event.Eid + ':0'}>{event.Esd ? gameTime(event.Esd) : ''}</div></li>
                                  <li ><button data-key={event.Eid + ':home'} onClick={addOdd}>{gameodds[0][(event.Eid)] ? gameodds[0][(event.Eid)][0]['homeodd'] : '' }</button></li>
                                  <li ><button data-key={event.Eid + ':draw'} onClick={addOdd}>{gameodds[0][(event.Eid)] ? gameodds[0][(event.Eid)][0]['drawodd'] : '' }</button></li>
                                  <li ><button data-key={event.Eid + ':away'} onClick={addOdd}>{gameodds[0][(event.Eid)] ? gameodds[0][(event.Eid)][0]['awayodd'] : '' }</button></li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>   
      </div>
    </div>
  )
}

export default Main_bar;