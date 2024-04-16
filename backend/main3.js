import dbClient from './utils/db';

(async () => {
    console.log(dbClient.isAlive());
    await dbClient.connect();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
})();