import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * Contains the miscellanous handlers
 */
class AppController {
  static async getStatus(req, res) {
  	let val1 = false;
  	let val2 = false;
  	val1 = redisClient.isAlive();
   	val2 = await dbClient.isAlive();
   	if (val1 && val2) {
    	res.status(200).json({ "redis": true, "db": true });
    }
  }

  static getStats(req, res) {
  	if (dbClient.isAlive()) {
  		let val1 = 0;
  		let val2 = 0;
	  	(async () => {
	  		val1 = await dbClient.nbUsers();
	   		val2 = await dbClient.nbFiles();
	   	})();
    	res.status(200).json({ "users": val1, "files": val2 });
	}
  }
}

export default AppController;
module.exports = AppController;