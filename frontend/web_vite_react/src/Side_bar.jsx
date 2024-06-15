import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import $ from 'jquery';
import { mainbarUpdate } from './State/mainbarState';
import { useSelector } from 'react-redux';
import Cookie from 'js-cookie';
import { navbarUpdate } from './State/navbarState';

let cookietoken = Cookie.get('x-token') || '';
let gcookieid = Cookie.get('savedgamesid');
const urlNS = 'http://'; //for making change to https easy

function Side_bar() {
  const dispatch = useDispatch();
  const mainbar = useSelector(state => state.mainbarState);
  const navbar = useSelector(state => state.navbarState);
  const [stakeamt, setStakeamt] = useState(1);
  const [toWinamt, setToWinamt] = useState(1);
  const [totalodd, setTotalodd] = useState(1);
  const [placebet, setPlacebet] = useState('Book bet');
  const [displayamtentry, setDisplayamtentry] = useState(false);
  const [removeallwarning, setRemoveallwarning] = useState(false);
  const [removeallbtn, setRemoveallbtn] = useState(false);
  const [betplaced, setBetplaced] = useState(false);
  const [betnotplaced, setBetnotplaced] = useState(false);
  const [balancesmall, setBalancesmall] = useState(false);


  const handleInputChange = (evt1) => {
    setStakeamt(evt1.target.value);
  };
  const handleLoadchange = () => {
    let tot_odd = 1;
    if (mainbar.gamesSelected) {
      Object.keys(mainbar.gamesSelected).map((evt_id) => {
        tot_odd = tot_odd * mainbar.gamesSelected[evt_id].stakeodd;
      });
      setTotalodd(tot_odd);
    } else {
      setTotalodd(1);
    }
    if (stakeamt === '') {
      setStakeamt(1);
    }
    if (stakeamt !== 0) {
      setToWinamt(stakeamt * tot_odd);
    }
  };
  useEffect(() => {
    handleLoadchange();
    if (Object.keys(mainbar.gamesSelected).length === 0) {
      setDisplayamtentry(false);
      setPlacebet('Book bet');
    }
    if (Object.keys(mainbar.gamesSelected).length > 1) {
      setRemoveallbtn(true);
    }
    if (Object.keys(mainbar.gamesSelected).length < 2) {
      setRemoveallbtn(false);
    }
  }, [mainbar, stakeamt]);
  const removegame = (evt) => {
    const evt_id = evt.target.closest('li').dataset.key;
    let newdt = {...(mainbar.gamesSelected)};
    const chsel = document.querySelector(`[data-key="${evt_id + ":" + newdt[evt_id].staketype}"]`);
    if (chsel) {chsel.classList.remove('oddSelected');}
    delete newdt[evt_id];
    dispatch(mainbarUpdate({'gamesSelected': newdt, setalloddsFunction: false}));
    const to_save = {'id_': gcookieid, 'savedgames': newdt};
    $.ajax({
      type: 'POST',
      url: urlNS + 'localhost:5000/api/v1/savedgames',
      data: JSON.stringify(to_save),
      contentType: 'application/json',
      success: function(res) {
        console.log('okay');
      },
      error: function(err) {
        console.log('error');
      }
    });
  };

  //to bring popup via a click on remove all (games)
  const removeAllclicked = () => {
    if (Object.keys(mainbar.gamesSelected).length > 1) {
      setRemoveallwarning(true);
    }
  };
  const notoremoveAllclicked = () => {
    setRemoveallwarning(false);
  };
  const balancesmallfunc = async () => {
    setBalancesmall(true);
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    setBalancesmall(false);
  };
  const yestoremoveAllclicked = () => {
    const newdt = {};
    for (const key in mainbar.gamesSelected) {
      const chsel = document.querySelector(`[data-key="${key + ":" + mainbar.gamesSelected[key].staketype}"]`);
      if (chsel) {chsel.classList.remove('oddSelected');}
    }
    dispatch(mainbarUpdate({'gamesSelected': newdt, setalloddsFunction: false}));
    const to_save = {'id_': gcookieid, 'savedgames': newdt};
    $.ajax({
      type: 'POST',
      url: urlNS + 'localhost:5000/api/v1/savedgames',
      data: JSON.stringify(to_save),
      contentType: 'application/json',
      success: function(res) {
        console.log('okay');
      },
      error: function(err) {
        console.log('error');
      }
    });
    setRemoveallwarning(false);
  };

  const betplacedfunc = async () => {
    setBetplaced(true);
    await new Promise(resolve => setTimeout(resolve, 10 * 1000));
    setBetplaced(false);
  };

  const betnotplacedfunc = async () => {
    setBetnotplaced(true);
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    setBetnotplaced(false);
  };

  const placebetfunc = async () => {
    if ((placebet === 'Book bet') && (!displayamtentry) && (Object.keys(mainbar.gamesSelected).length > 0)) {
      setDisplayamtentry(true);
      setPlacebet('Place bet');
    }
    if ((placebet === 'Place bet') && (displayamtentry) && (Object.keys(mainbar.gamesSelected).length > 0)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const curdt = new Date();
      const hr = curdt.getHours().toString().padStart(2, '0');
      const mt = curdt.getMinutes().toString().padStart(2, '0');
      const dy = curdt.getDate().toString().padStart(2, '0');
      const month = (curdt.getMonth() + 1).toString().padStart(2, '0');
      const year = curdt.getFullYear().toString();
      const usrbal = navbar.usr.account_balance;

      const tobet = {
        stakeAmt: stakeamt,
        betTime: hr + ':' + mt + '_' + dy + '/' + month + '/' + year,
        gameStatus: 'open',
        outcome: 'na',
        totalOdd: totalodd,
        expReturns: toWinamt,
        games: mainbar.gamesSelected
      }

      if (stakeamt <= usrbal) {
        $.ajax({
          type: 'POST',
          url: urlNS + 'localhost:5000/api/v1/bet',
          contentType: 'application/json',
          data: JSON.stringify(tobet),
          headers: {
            'x-token': cookietoken,
          },
          success: function(res) {
            for (const stkey in mainbar.gamesSelected) {
              const stvalue = mainbar.gamesSelected[stkey];
              const chsel = document.querySelector(`[data-key="${stkey + ":" + stvalue.staketype}"]`);
              if (chsel) {chsel.classList.remove('oddSelected');}
            }
            dispatch(mainbarUpdate({'gamesSelected': {}, setalloddsFunction: false}));
            const newbal = parseFloat(navbar.usr.account_balance) - parseFloat(stakeamt);
            $.ajax({
              type: 'PUT',
              url: urlNS + 'localhost:5000/api/v1/bal_res',
              contentType: 'application/json',
              data: JSON.stringify({newbal: newbal}),
              headers: {
                'x-token': cookietoken,
              },
              success: function(res) {
                dispatch(navbarUpdate({'usr': {...(navbar.usr), ['account_balance']: newbal}}));
              }
            });
            const to_save = {'id_': gcookieid, 'savedgames': {}};
            $.ajax({
              type: 'POST',
              url: urlNS + 'localhost:5000/api/v1/savedgames',
              data: JSON.stringify(to_save),
              contentType: 'application/json',
              success: function(res) {
                console.log('okay');
              },
              error: function(err) {
                console.log('error');
              }
            });
            betplacedfunc();
          },
          error: function(res, status, err) {
            betnotplaced();
          }
        });
      }
      if (stakeamt > usrbal) {
        balancesmallfunc();
      }
      
      // setDisplayamtentry(true);
      // setPlacebet('Place bet');
    }
  };

  return (
    <div className='side_bar'>
      <form>
        <div className='sb_head'>
          <div><p>Selected games</p></div>
          <div></div>
          <div>{ removeallbtn && (<div className='sb_removeallbutton' onClick={removeAllclicked}>Remove all</div>)}</div>
        </div>
          {removeallwarning && (
            <div className='sb_removeallwanringparent'>
              <div className='sb_removeallwarning'>
                <div>Are you sure you want to continue</div>
                <div className='sb_removechoice'>
                  <button className='sb_choiceclick' onClick={yestoremoveAllclicked}>Yes</button>
                  <button className='sb_choiceclick' onClick={notoremoveAllclicked}>No</button>
                </div>
              </div>
            </div>
          )}
        <div className='sb_choice'>
          <ul className='sidebarLst'>{Object.keys(mainbar.gamesSelected).map((evt_id) => (
            <li data-key={evt_id} key={evt_id}>
              <div className='sb_list_item'>
                <div className='sb_li_choice'>
                  <div className='sb_li_select'>{mainbar.gamesSelected[evt_id].staketype}</div>
                  <div className='sb_li_game'>{`${mainbar.gamesSelected[evt_id].hometeam} vs ${mainbar.gamesSelected[evt_id].hometeam}`}</div>
                  <div className='sb_li_type'>{mainbar.gamesSelected[evt_id].markettype}</div>
                </div>
                <div className='sb_li_odd'>
                  {mainbar.gamesSelected[evt_id].stakeodd}
                </div>
                <div className='sidebar_remove' onClick={removegame}>X</div>
              </div>
            </li>
          ))}
          </ul>
          <div className='betplaced1'>{betplaced && (
            <div className='betplaced'>Selected games has been placed successfully</div>
          )}</div>
          <div className='betnotplaced1'>{betnotplaced && (
            <div className='betnotplaced'>Selected games not placed. <br />
                Login or create an account to place bet
            </div>
          )}</div>
          <div className='betnotplaced1'>{balancesmall && (
            <div className='betnotplaced'>Balance not sufficient.
            </div>
          )}</div>
        </div>
        <div className='sb_stake'>
          <div className='sb_stake_sub'>
            <div>Stake</div>
            <div>Total odd</div>
            <div>Potential Winning</div>
          </div>
          <div className='sb_stake_ent'>{ displayamtentry && (<div className='sb_stake_ent'>
            <div className='sb_stake_input'><div>NGN</div><input className='input_bet_amt' style={{width: '4vw', height: '3vh'}} type="number" value={stakeamt} onChange={handleInputChange}/></div>
            <div className='sb_stake_odd'>{totalodd}</div>
            <div className='sb_stake_odd'>{toWinamt}</div>
          </div>)}</div>
        </div>
        <div className='sb_submit'>
          <div className='sb_bet_button' onClick={placebetfunc}>{placebet}</div>
        </div>
      </form>
    </div>
  )
}

export default Side_bar;