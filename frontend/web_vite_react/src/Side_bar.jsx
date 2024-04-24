import { useState } from 'react';

function Side_bar() {

  return (
    <div className='side_bar'>
      <form>
        <div className='sb_head'>
          <div><p>Selected games</p></div>
          <div></div>
          <div><p>Remove all</p></div>
        </div>
        <div className='sb_choice'>
          <ul>
            <li>
              <div className='sb_list_item'>
                <div className='sb_li_choice'>
                  <div className='sb_li_select'>Home</div>
                  <div className='sb_li_game'>Sassuolo vs Lecce</div>
                  <div className='sb_li_type'>1x2</div>
                </div>
                <div className='sb_li_odd'>
                  2.33
                </div>
              </div>
            </li>
            <li>
              <div className='sb_list_item'>
                <div className='sb_li_choice'>
                  <div className='sb_li_select'>Away</div>
                  <div className='sb_li_game'>Arsnal vs Watford</div>
                  <div className='sb_li_type'>1x2</div>
                </div>
                <div className='sb_li_odd'>
                  2.11
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className='sb_stake'>
          <div className='sb_stake_sub'>
            <div>Stake</div>
            <div>Potential Winning</div>
          </div>
          <div className='sb_stake_ent'>
            <div className='sb_stake_input'><div>NGN</div><input className='input_bet_amt' style={{width: '4vw', height: '3vh'}} type="number" /></div>
            <div className='sb_stake_odd'>2.33 * 100</div>
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