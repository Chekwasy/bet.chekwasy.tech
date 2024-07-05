import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import $, { event } from 'jquery';
import { useSelector } from 'react-redux';

let cookietoken = Cookie.get('x-token') || '';
const urlNS = ''; //for making change to https easy
const local = '';


function Ocgames() {
  const [opentrue, setOpentrue] = useState(true);
  const [closetrue, setClosetrue] = useState(false);
  const [opengames, setOpengames] = useState([]);
  const [closegames, setClosegames] = useState([]);
  const [openinput, setOpeninput] = useState(1);
  const [closeinput, setCloseinput] = useState(1);

  const ocselected = () => {
    if (opentrue) {
      const elem1 = document.querySelector('.ocopen');
      const elem2 = document.querySelector('.occlose');
      elem1.classList.add('ocgreen');
      elem2.classList.remove('ocgreen');
    }
    if (closetrue) {
      const elem1 = document.querySelector('.ocopen');
      const elem2 = document.querySelector('.occlose');
      elem1.classList.remove('ocgreen');
      elem2.classList.add('ocgreen');
    }
    makeopenlst();
  };
  useEffect(() => {
    ocselected();
  }, [opentrue, closetrue]);

  const handleopen = () => {
    setOpentrue(true);
    setClosetrue(false);
  };

  const handleclose = () => {
    setOpentrue(false);
    setClosetrue(true);
  };
  const handlecloseinput = (evt) => {
    const nwval = evt.target.value;
    setCloseinput(nwval);
  };
  const handleopeninput = (evt) => {
    const nwval = evt.target.value;
    setOpeninput(nwval);
  };

  const makeopenlst = async () => {
    if (opentrue) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const opinp = openinput.toString().trimEnd();
      if (opinp !== '') {
        $.ajax({
          type: 'GET',
          url: urlNS + `${local}/api/v1/openbet/${opinp.toString()}`,
          contentType: 'application/json',
          headers: {
            'x-token': cookietoken,
          },
          success: function(res) {
            setOpengames(res.opengames);
            console.log(res);
          },
          error: function(err) {
            console.log('openlsterr');
          }
        });
      }
    }
    if (closetrue) {
      const opinp = closeinput.toString().trimEnd();
      if (opinp !== '') {
        $.ajax({
          type: 'GET',
          url: urlNS + `${local}/api/v1/closebet/${opinp.toString()}`,
          contentType: 'application/json',
          headers: {
            'x-token': cookietoken,
          },
          success: function(res) {
            setClosegames(res.closegames);
            console.log(res);
          },
          error: function(err) {
            console.log('closelsterr');
          }
        });
      }
    }
  };

  const loadpg = () => {
    makeopenlst();
  };

  document.addEventListener('keypress', (evt) => {
    if (evt.key === 'Enter') {
    }
  });

  return (
    <div className='ocgames_comp'>
      <div className='ocgames_head'>
        <div className='ocopen' onClick={handleopen}>Open games</div>
        <div className='occlose' onClick={handleclose}>Closed games</div>
      </div>
      <div className='ocgames_body'>
        {opentrue && (<div className='ocgames_body'>{opengames.map((ech) => (
          <div key={ech._id} className='opengamesper'>
            <div className='ogperhead'>
              <div>
                <div className='ogpertitle'>Staked time <div className='ogperitem'>{ech.betTime.split('_')[0] + ' ' + ech.betTime.split('_')[1]}</div></div>
                <div className='ogpertitle'>Staked amount <div className='ogperitem'>{ech.stakeAmt}</div></div>
                <div className='ogpertitle'>Game status <div className='ogperitem'>{ech.gameStatus}</div></div>
              </div>
              <div>
                <div className='ogpertitle'>Game outcome <div className='ogperitem'>{ech.outcome}</div></div>
                <div className='ogpertitle'>Staked odd <div className='ogperitem'>{ech.totalOdd}</div></div>
                <div className='ogpertitle'>Expected returns <div className='ogperitem'>{Intl.NumberFormat('en-US').format(ech.expReturns)}</div></div>
              </div>
            </div>
            <div className='ogperbody'>
              {Object.keys(ech.games).map((ev_id) => (
                <div key={ev_id} className='ogperbodycon'>
                  <div className='ogperbodyteam'>
                    <div className='ogpertitle'>{ech.games[ev_id].hometeam}</div>
                    <div>{' vs '}</div>
                    <div className='ogpertitle'>{ech.games[ev_id].awayteam}</div>
                    <div className='ogpertitle'>Staked type <div className='ogperitem'>{ech.games[ev_id].staketype}</div></div>
                    <div className='ogpertitle'>Market type <div className='ogperitem'>{ech.games[ev_id].markettype}</div></div>
                    <div className='ogpertitle'>Match status <div className='ogperitem'>{ech.games[ev_id].matchstatus}</div></div>
                  </div>
                  <div className='ogperbodyteam'>
                    <div className='ogpertitle'>Match result <div className='ogperitem'>{ech.games[ev_id].matchresult}</div></div>
                    <div className='ogpertitle'>Outcome <div className='ogperitem'>{ech.games[ev_id].outcome}</div></div>
                    <div className='ogpertitle'>Result <div className='ogperitem'>{ech.games[ev_id].result}</div></div>
                    <div className='ogpertitle'>Match time <div className='ogperitem'>{ech.games[ev_id].matchtime.split(':')[0] + ':' + ech.games[ev_id].matchtime.split(':')[1] + ' ' + ech.games[ev_id].matchtime.split(':')[2].substr(6, 8) + '/' + ech.games[ev_id].matchtime.split(':')[2].substr(4,2) + '/' + ech.games[ev_id].matchtime.split(':')[2].substr(0, 4)} </div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}</div>)}
        {closetrue && (<div className='ocgames_body'>{closegames.map((echh) => (
          <div key={echh._id} className='opengamesper'>
            <div className='ogperhead'>
              <div>
                <div className='ogpertitle'>Staked time <div className='ogperitem'>{echh.betTime.split('_')[0] + ' ' + echh.betTime.split('_')[1]}</div></div>
                <div className='ogpertitle'>Staked amount <div className='ogperitem'>{echh.stakeAmt}</div></div>
                <div className='ogpertitle'>Game status <div className='ogperitem'>{echh.gameStatus}</div></div>
              </div>
              <div>
                <div className='ogpertitle'>Game outcome <div className='ogperitem'>{echh.outcome}</div></div>
                <div className='ogpertitle'>Staked odd <div className='ogperitem'>{echh.totalOdd}</div></div>
                <div className='ogpertitle'>Expected returns <div className='ogperitem'>{Intl.NumberFormat('en-US').format(echh.expReturns)}</div></div>
              </div>
            </div>
            <div className='ogperbody'>
              {Object.keys(echh.games).map((e_id) => (
                <div className='ogperbodycon'  key={e_id}>
                  <div className='ogperbodyteam'>
                    <div className='ogpertitle'>{echh.games[e_id].hometeam}</div>
                    <div>{' vs '}</div>
                    <div className='ogpertitle'>{echh.games[e_id].awayteam}</div>
                    <div className='ogpertitle'>Staked type <div className='ogperitem'>{echh.games[e_id].staketype}</div></div>
                    <div className='ogpertitle'>Market type <div className='ogperitem'>{echh.games[e_id].markettype}</div></div>
                    <div className='ogpertitle'>Match status <div className='ogperitem'>{echh.games[e_id].matchstatus}</div></div>
                  </div>
                  <div className='ogperbodyteam'>
                    <div className='ogpertitle'>Match result <div className='ogperitem'>{echh.games[e_id].matchresult}</div></div>
                    <div className='ogpertitle'>Outcome <div className='ogperitem'>{echh.games[e_id].outcome}</div></div>
                    <div className='ogpertitle'>Result <div className='ogperitem'>{echh.games[e_id].result}</div></div>
                    <div className='ogpertitle'>Match time <div className='ogperitem'>{echh.games[e_id].matchtime.split(':')[0] + ':' + echh.games[e_id].matchtime.split(':')[1] + ' ' + echh.games[e_id].matchtime.split(':')[2].substr(6, 8) + '/' + echh.games[e_id].matchtime.split(':')[2].substr(4,2) + '/' + echh.games[e_id].matchtime.split(':')[2].substr(0, 4)} </div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}</div>)}  
      </div>
      <div className='ocgames_foot'>
        {opentrue && (<div className='ocfootalign'>
          <input className='pginput' type="number" placeholder='pg number' min={1} onChange={handleopeninput}/>
          <div className='loadpg' onClick={loadpg}>Load</div>
        </div>)}
        {closetrue && (<div className='ocfootalign'>
          <input className='pginput' type="number" placeholder='pg number' min={1} onChange={handlecloseinput}/>
          <div className='loadpg' onClick={loadpg}>Load</div>
        </div>)}
      </div>
    </div>
  );
}

export default Ocgames;
