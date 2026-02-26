import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { mainbarUpdate } from "./State/mainbarState";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getNext7Days() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() + i * 86400000);
    return d.toLocaleDateString("en-GB");
  });
}

function formatBackendDate(date) {
  const [day, month, year] = date.split("/");
  return `${year}${month}${day}`;
}

function Main_bar() {
  const dispatch = useDispatch();
  const mainbar = useSelector((state) => state.mainbarState);

  const [dates] = useState(getNext7Days());
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [countryLeagues, setCountryLeagues] = useState({});
  const [gameOdds, setGameOdds] = useState({});
  const [loading, setLoading] = useState(false);

  // Cookie Setup
  const cookieId =
    Cookie.get("savedgamesid") ||
    (() => {
      const id = uuidv4();
      Cookie.set("savedgamesid", id, {
        expires: 1,
        sameSite: "strict",
      });
      return id;
    })();

  // Fetch Games + Odds
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const formattedDate = formatBackendDate(selectedDate);

      const [gamesRes, oddsRes, savedRes] = await Promise.all([
        axios.get(`${BASE_URL}/games/${formattedDate}`),
        axios.get(`${BASE_URL}/odds/${formattedDate}`),
        axios.get(`${BASE_URL}/savedgames/${cookieId}`),
      ]);

      const stages = gamesRes.data?.games?.Stages || [];
      const odds = oddsRes.data?.odds?.[0] || {};
      const savedGames = savedRes.data?.savedgames || {};

      dispatch(
        mainbarUpdate({
          gamesSelected: savedGames,
          setalloddsFunction: false,
        })
      );

      const grouped = {};

      stages.forEach((stage) => {
        if (!grouped[stage.Cnm]) grouped[stage.Cnm] = {};
        grouped[stage.Cnm][stage.Snm] = stage.Events;
      });

      setCountryLeagues(grouped);
      setGameOdds(odds);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh every 1 min (SAFE version)
  useEffect(() => {
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const addOdd = (eventId, market, oddValue, matchTime, home, away) => {
    const current = mainbar.gamesSelected || {};
    const existing = current[eventId];

    if (existing?.staketype === market) {
      const updated = { ...current };
      delete updated[eventId];
      dispatch(mainbarUpdate({ gamesSelected: updated }));
      saveGames(updated);
    } else {
      const newGame = {
        hometeam: home,
        awayteam: away,
        staketype: market,
        stakeodd: parseFloat(oddValue),
        matchtime: matchTime,
      };

      const updated = { ...current, [eventId]: newGame };
      dispatch(mainbarUpdate({ gamesSelected: updated }));
      saveGames(updated);
    }
  };

  const saveGames = async (games) => {
    try {
      await axios.post(`${BASE_URL}/savedgames`, {
        id_: cookieId,
        savedgames: games,
      });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const formatTime = (tm) =>
    tm ? tm.toString().slice(-6, -4) + ":" + tm.toString().slice(-4, -2) : "";

  return (
    <div className="main_bar">
      <div className="main_head">
        <div className="mh_type">1X2</div>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}

      <div className="mb_body">
        {Object.entries(countryLeagues).map(([country, leagues]) => (
          <div key={country}>
            <h3>{country}</h3>

            {Object.entries(leagues).map(([league, events]) => (
              <div key={league}>
                <h4>{league}</h4>

                {events.map((event) => {
                  const odds = gameOdds[event.Eid];
                  const selected =
                    mainbar.gamesSelected?.[event.Eid]?.staketype;

                  return (
                    <div key={event.Eid}>
                      <p>
                        {event.T1[0].Nm} vs {event.T2[0].Nm}
                      </p>

                      <button
                        className={
                          selected === "home" ? "oddSelected" : ""
                        }
                        onClick={() =>
                          addOdd(
                            event.Eid,
                            "home",
                            odds?.[0]?.homeodd,
                            formatTime(event.Esd),
                            event.T1[0].Nm,
                            event.T2[0].Nm
                          )
                        }
                      >
                        {odds?.[0]?.homeodd}
                      </button>

                      <button
                        className={
                          selected === "draw" ? "oddSelected" : ""
                        }
                        onClick={() =>
                          addOdd(
                            event.Eid,
                            "draw",
                            odds?.[0]?.drawodd,
                            formatTime(event.Esd),
                            event.T1[0].Nm,
                            event.T2[0].Nm
                          )
                        }
                      >
                        {odds?.[0]?.drawodd}
                      </button>

                      <button
                        className={
                          selected === "away" ? "oddSelected" : ""
                        }
                        onClick={() =>
                          addOdd(
                            event.Eid,
                            "away",
                            odds?.[0]?.awayodd,
                            formatTime(event.Esd),
                            event.T1[0].Nm,
                            event.T2[0].Nm
                          )
                        }
                      >
                        {odds?.[0]?.awayodd}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main_bar;