import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import $ from 'jquery';
import { mainbarUpdate } from './State/mainbarState';
import { useSelector } from 'react-redux';
import Cookie from 'js-cookie';

let gcookieid = Cookie.get('savedgamesid');
const urlNS = 'http://'; //for making change to https easy

function Side_bar() {
  const dispatch = useDispatch();
  const mainbar = useSelector(state => state.mainbarState);
  const [stakeamt, setStakeamt] = useState(1);
  const [toWinamt, setToWinamt] = useState(1);
  const [totalodd, setTotalodd] = useState(1);

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
  }

  return (
    <div className='side_bar'>
      <form>
        <div className='sb_head'>
          <div><p>Selected games</p></div>
          <div></div>
          <div><p>Remove all</p></div>
        </div>
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
        </div>
        <div className='sb_stake'>
          <div className='sb_stake_sub'>
            <div>Stake</div>
            <div>Total odd</div>
            <div>Potential Winning</div>
          </div>
          <div className='sb_stake_ent'>
            <div className='sb_stake_input'><div>NGN</div><input className='input_bet_amt' style={{width: '4vw', height: '3vh'}} type="number" value={stakeamt} onChange={handleInputChange}/></div>
            <div className='sb_stake_odd'>{totalodd}</div>
            <div className='sb_stake_odd'>{toWinamt}</div>
          </div>
        </div>
        <div className='sb_submit'>
          <button className='sb_bet_button' type='submit'>Place bet</button>
        </div>
      </form>
    </div>
  )
}

export default Side_bar;