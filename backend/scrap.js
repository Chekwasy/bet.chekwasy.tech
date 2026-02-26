import dbClient from "./utils/db.js";
import axios from "axios";
import ld from "lodash";

const scrap = async () => {
  const db = await dbClient.db();

  let today = new Date();

  // Save games for next 7 days
  for (let i = 0; i < 8; i++) {
    const nex = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dateLst = nex.toLocaleDateString("en-GB").split("/");
    const date_ = dateLst[2] + dateLst[1] + dateLst[0];

    const getDate = await db.collection("dates").findOne({ date: date_ });

    if (!getDate) {
      const response = await axios.get(
        `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`
      );

      const gamesJson = response.data;

      await db.collection("dates").insertOne({
        date: date_,
        games: gamesJson,
      });

      // 🔹 Default odds
      let eventDit = {};

      for (const stage of gamesJson.Stages || []) {
        for (const evt of stage.Events || []) {
          eventDit[evt.Eid] = [
            {
              hometeam: evt.T1[0].Nm,
              awayteam: evt.T2[0].Nm,
              homeodd: 1.5,
              awayodd: 1.5,
              drawodd: 3.0,
            },
          ];
        }
      }

      await db.collection("odds").insertOne({
        date: date_,
        odds: [eventDit],
      });
    }
  }

  // Today update
  const dateLst = today.toLocaleDateString("en-GB").split("/");
  const dateStr = dateLst[2] + dateLst[1] + dateLst[0];

  const response = await axios.get(
    `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/1?countryCode=NG&locale=en&MD=1`
  );

  let games = response.data;
  let do_update = false;
  let eventDit = {};

  for (const stage of games.Stages || []) {
    stage.Events = (stage.Events || []).filter((evt) => {
      if (!evt.Esd) return true;

      const tm = evt.Esd.toString();
      const tmhr = parseInt(tm.slice(-6, -4));
      const tmmin = parseInt(tm.slice(-4, -2));

      const curhr = today.getHours();
      const curmin = today.getMinutes();

      const expired =
        curhr > tmhr || (curhr === tmhr && curmin >= tmmin);

      if (!expired) {
        eventDit[evt.Eid] = [
          {
            hometeam: evt.T1[0].Nm,
            awayteam: evt.T2[0].Nm,
            homeodd: 1.7,
            awayodd: 1.8,
            drawodd: 3.1,
          },
        ];
      } else {
        do_update = true;
      }

      return !expired;
    });
  }

  games.Stages = games.Stages.filter(
    (stage) => stage.Events && stage.Events.length > 0
  );

  if (do_update) {
    await db.collection("dates").updateOne(
      { date: dateStr },
      { $set: { games } }
    );

    const dateodds = await db.collection("odds").findOne({
      date: dateStr,
    });

    const oddsave = ld.merge({}, [eventDit], dateodds?.odds || []);

    await db.collection("odds").updateOne(
      { date: dateStr },
      { $set: { odds: oddsave } }
    );
  }
};

export default scrap;