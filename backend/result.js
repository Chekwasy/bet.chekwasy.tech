import dbClient from "./utils/db.ts";
import axios from "axios";
import { ObjectId } from "mongodb";

const res = async () => {
  const db = await dbClient.db();

  const opengames = await db
    .collection("games")
    .find({ gameStatus: "open" })
    .toArray();

  console.log("working as expected");

  for (const ech of opengames) {
    for (const itm of Object.keys(ech.games)) {
      const response = await axios.get(
        `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${ech.games[itm].matchtime.split(":")[2]}/1?countryCode=NG&locale=en&MD=1`
      );

      const games = response.data;

      for (const gam of games.Stages || []) {
        for (const idd of gam.Events || []) {
          if (itm === idd.Eid) {
            // FULL TIME
            if (idd.Eps === "FT" && idd.Tr1 && idd.Tr2) {
              const score = `${idd.Tr1} : ${idd.Tr2}`;

              let oc =
                parseInt(idd.Tr1) > parseInt(idd.Tr2)
                  ? "home"
                  : parseInt(idd.Tr1) < parseInt(idd.Tr2)
                  ? "away"
                  : "draw";

              const winres =
                ech.games[itm].staketype === oc ? "won" : "lost";

              await db.collection("games").updateOne(
                { _id: ech._id },
                {
                  $set: {
                    [`games.${itm}.matchresult`]: score,
                    [`games.${itm}.matchstatus`]: "FT",
                    [`games.${itm}.outcome`]: oc,
                    [`games.${itm}.result`]: winres,
                  },
                }
              );
            }

            // LIVE SCORE UPDATE
            if (idd.Eps?.includes("'") && idd.Tr1 && idd.Tr2) {
              const score = `${idd.Tr1} : ${idd.Tr2}`;

              await db.collection("games").updateOne(
                { _id: ech._id },
                {
                  $set: {
                    [`games.${itm}.matchresult`]: score,
                    [`games.${itm}.matchstatus`]: idd.Eps,
                  },
                }
              );
            }

            // CANCELLED / POSTPONED
            if (
              ["Canc.", "Postp."].includes(idd.Eps) &&
              !["Canc.", "Postp."].includes(
                ech.games[itm].matchstatus
              )
            ) {
              await db.collection("games").updateOne(
                { _id: ech._id },
                {
                  $set: {
                    [`games.${itm}.matchresult`]: idd.Eps,
                    [`games.${itm}.matchstatus`]: idd.Eps,
                    [`games.${itm}.outcome`]: "Void",
                    [`games.${itm}.result`]: "Void",
                  },
                }
              );
            }
          }
        }
      }
    }
  }

  // Close games and credit users
  for (const each of opengames) {
    let stakeamt = parseFloat(each.stakeAmt);
    let totodd = parseFloat(each.totalOdd);
    let chkns = true;
    let chkoutcome = "won";

    for (const item of Object.keys(each.games)) {
      if (each.games[item].outcome === "Void") {
        totodd /= parseFloat(each.games[item].stakeodd);
      }
      if (each.games[item].result === "NR") {
        chkns = false;
      }
      if (each.games[item].result === "lost") {
        chkoutcome = "lost";
      }
    }

    if (chkns) {
      await db.collection("games").updateOne(
        { _id: each._id },
        {
          $set: {
            totalOdd: totodd.toFixed(2),
            expReturns: (stakeamt * totodd).toFixed(2),
            gameStatus: "close",
            outcome: chkoutcome,
          },
        }
      );

      if (chkoutcome === "won") {
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(each.userId) });

        await db.collection("users").updateOne(
          { _id: new ObjectId(each.userId) },
          {
            $set: {
              account_balance: (
                parseFloat(user.account_balance) +
                stakeamt * totodd
              ).toFixed(2),
            },
          }
        );
      }
    }
  }
};

export default res;