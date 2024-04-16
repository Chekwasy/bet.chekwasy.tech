import dbClient from '../utils/db';
import Queue from 'bull/lib/queue';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
const { ObjectID } = require('mongodb')

/**
 * Contains user miscellanous handlers
 */
class UsersController {
  static async postNew(req, res) {
		const email = req.body.email || null;
		const password = req.body.password || null;
		if (!email) {
			res.status(400).json({"error": "Missing email"});
			return;
		}
		if (!password) {
			res.status(400).json({'error': 'Missing password'});
			return;
		}
		const user = await (await dbClient.client.db().collection('users'))
		.findOne({ "email": email });
		if (user) {
			res.status(400).json({'error': 'Already exist'});
			return;
		}
		const result = await (await dbClient.client.db().collection('users'))
		.insertOne({"email": email, "password": sha1(password)});
		const usrId = result.insertedId.toString();

		//creating a queue and job to handle sending email to a user
		const userQueue = new Queue('Sending Email');
		const userJob = await userQueue.add({"userId": usrId, "name": usrId});
		res.status(201).json({ "id": usrId, "email": email });
  }

  static async getMe(req, res) {
  	const x_tok = req.headers['x-token'];
		if (!x_tok) { res.json(); return;}
		const usr_id = await redisClient.get(`auth_${x_tok}`);
		if (!usr_id) {
			res.status(401).json({"error": "Unauthorized"});
			return;
		}
		const user = await (await dbClient.client.db().collection('users'))
		.findOne({ "_id": ObjectID(usr_id) });
		if (!user) { res.json(); return;}
		res.json({'id': usr_id, 'email': user.email});
  }
}

export default UsersController;
module.exports = UsersController;