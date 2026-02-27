import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { mainbarUpdate } from './State/mainbarState';

const local = '';

let today = new Date();
const displayDate = [];

const curhrs = today.getHours();
const curmins = today.getMinutes();

for (let i = 0; i < 7; i++) {
  const nex = new Date(today.getTime() + (i * 86400000));
  const currday = nex.getDate().toString().padStart(2,'0');
  const currmonth = (nex.getMonth() + 1).toString().padStart(2,'0');
  const curryear = nex.getFullYear().toString();
  displayDate.push(`${currday}/${currmonth}/${curryear}`);
}

const curDay = displayDate[0];

const cookie_id = uuidv4();
let fd = '';

let gcookieid = Cookie.get('savedgamesid');
if (!gcookieid) {
  Cookie.set('savedgamesid', cookie_id, { expires: 1, sameSite: 'strict' });
  gcookieid = cookie_id;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const url = `${BASE_URL}/games/`;
const url2 = `${BASE_URL}/odds/`;

function Main_bar() {

  const dispatch = useDispatch();
  const mainbar = useSelector(state => state.mainbarState);

  const [country_lea, setCountry_lea] = useState({});
  const [gameodds, setGameodds] = useState([]);
  const [selectDate, setSelectDate] = useState(curDay);

  const setallodd = () => {

    if (!mainbar?.gamesSelected) return;

    let newdt = { ...mainbar.gamesSelected };
    let chk = false;

    for (const stkey in mainbar.gamesSelected) {

      const stvalue = mainbar.gamesSelected[stkey];
      if (!stvalue?.matchtime) continue;

      const timeLst = stvalue.matchtime.split(':');
      if (timeLst.length < 3) continue;

      const hrss = parseInt(timeLst[0]);
      const minss = parseInt(timeLst[1]);

      const yearr = timeLst[2].substring(0, 4);
      const monthh = timeLst[2].substring(4, 6);
      const dayy = timeLst[2].substring(6, 8);

      const givendate = `${dayy}/${monthh}/${yearr}`;

      if (displayDate.includes(givendate)) {
        if ((hrss === curhrs && minss > curmins) || hrss > curhrs) {
          const chsel = document.querySelector(
            `[data-key="${stkey + ":" + stvalue.staketype}"]`
          );
          if (chsel) chsel.classList.add("oddSelected");
        }
      } else {
        delete newdt[stkey];
        chk = true;

        const chsel = document.querySelector(
          `[data-key="${stkey + ":" + stvalue.staketype}"]`
        );
        if (chsel) chsel.classList.remove("oddSelected");
      }
    }

    if (chk) {
      dispatch(mainbarUpdate({
        gamesSelected: newdt,
        setalloddsFunction: false
      }));

      $.ajax({
        type: "POST",
        url: `${BASE_URL}/savedgames`,
        data: JSON.stringify({ id_: gcookieid, savedgames: newdt }),
        contentType: "application/json",
      });
    }
  };

  const displayFetched = async (urll, urll2) => {
    try {

      const [response, response2, sgapi] = await Promise.all([
        axios.get(urll),
        axios.get(urll2),
        axios.get(`${BASE_URL}/savedgames/${gcookieid}`)
      ]);

      const gamesselected = sgapi?.data?.savedgames || {};

      dispatch(mainbarUpdate({
        gamesSelected: gamesselected,
        setalloddsFunction: false
      }));

      const gamdd = response?.data?.games;
      const odds = response2?.data?.odds;

      if (!gamdd?.Stages) return;

      setGameodds(odds || []);

      let con_dit = {};

      gamdd.Stages.forEach(stage => {
        if (!con_dit[stage.Cnm]) {
          con_dit[stage.Cnm] = {};
        }
        con_dit[stage.Cnm][stage.Snm] = stage.Events;
      });

      setCountry_lea(con_dit);

      setallodd();

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDate = (e) => {
    const newDate = e.target.value;
    setSelectDate(newDate);

    let dt = newDate.split('/');
    fd = dt[2] + dt[1] + dt[0];

    displayFetched(url + fd, url2 + fd);
  };

  useEffect(() => {

    if (!fd) {
      let dt = displayDate[0].split('/');
      fd = dt[2] + dt[1] + dt[0];
    }

    displayFetched(url + fd, url2 + fd);

    const interval = setInterval(() => {
      if (fd) {
        displayFetched(url + fd, url2 + fd);
      }
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    setallodd();
  }, [mainbar]);

  const gameTime = (tm) => {
    if (!tm) return '';
    return tm.toString().slice(-6,-4) + ':' + tm.toString().slice(-4,-2);
  };

  const addOdd = (evt) => {

    const oddKey = evt.target.dataset.key;
    if (!oddKey) return;

    const det = oddKey.split(':');
    const game_id = det[0];
    const mkt = det[1];

    if (!gameodds?.[0]?.[game_id]) return;

    const game_det = gameodds[0][game_id];

    const tmEl = document.querySelector(`[data-key="${game_id}:0"]`);
    if (!tmEl) return;

    const dgame = {
      hometeam: game_det[0].hometeam,
      awayteam: game_det[0].awayteam,
      staketype: mkt,
      markettype: '1x2',
      stakeodd: parseFloat(evt.target.textContent) || 1,
      matchstatus: 'NS',
      matchresult: 'NR',
      outcome: 'NR',
      result: 'NR',
      matchtime: tmEl.textContent + ':' + fd
    };

    let gamesselected = { ...mainbar.gamesSelected };

    if (!gamesselected[game_id]) {
      evt.target.classList.add('oddSelected');
      gamesselected[game_id] = dgame;
    } else if (gamesselected[game_id].staketype === mkt) {
      evt.target.classList.remove('oddSelected');
      delete gamesselected[game_id];
    }

    dispatch(mainbarUpdate({
      gamesSelected: gamesselected,
      setalloddsFunction: false
    }));

    $.ajax({
      type: 'POST',
      url: `${BASE_URL}/savedgames`,
      data: JSON.stringify({ id_: gcookieid, savedgames: gamesselected }),
      contentType: 'application/json'
    });
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
