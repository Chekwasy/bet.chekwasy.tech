import redisClient from '../utils/redis';
import { v4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import Queue from 'bull/lib/queue';
/**
 * Contains auth miscellanous handlers for user authentication
 */
class AuthController {
	static async getConnect(req, res) {
		// check user input and create session. save to redis for a day session
		const auth_header = req.headers.authorization;
		if (!auth_header) { res.json(); return;}
		const encoded_usr_str = (auth_header.split(" "))[1];
		const decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
		const usr_details = decoded_usr_str.split(':');
		const pwd = sha1(usr_details[1]);
		const email = usr_details[0];
		const user = await (await dbClient.client.db().collection('users'))
		.findOne({ "email": email, "password": pwd});
		if (!user) {
			res.status(401).json({'error': 'Unauthorized'});
			return;
		}
		const auth_token = v4();
		redisClient.set(`auth_${auth_token}`, user._id.toString(), 7 * 24 * 60 * 60);
		res.status(200).json({ "token": auth_token });
	}

	static async getDisconnect(req, res) {
		//log the user our on a possible click to logout
		const x_tok = req.headers['x-token'];
		if (!x_tok) { res.json(); return;}
		const usr_id = await redisClient.get(`auth_${x_tok}`);
		if (!usr_id) {
			res.status(401).json({"error": "Unauthorized"});
			return;
		}
		await redisClient.del(`auth_${x_tok}`);
		res.status(204).json();
	}

	static async postSend_tok(req, res) {
		//send token to user and save the token on redis
		const email = req.query.email;
		if (!email) {
			res.json({}); return;
		}
		const user = await (await dbClient.client.db().collection('users'))
		.findOne({ "email": email});
		if (!user) {
			res.status(401).json({'error': 'No user found'});
			return;
		}
		const min = 123456;
		const max = 987654;
		const token = Math.floor(Math.random() * (max - min + 1)) + min;
		redisClient.set(email, token.toString(), 10 * 60);

		//create worker to send email token
		const tokenQueue = new Queue('Sending Token');
		const tokenJob = await tokenQueue.add({"email": email, "token": token.toString()});

		//send response
		res.json({"status": "ok"});
	}

	static async postChecktoken(req, res) {
		//check token for user
		const email = req.body.email;
		const token = req.body.token;
		if (!email || !token) {
			res.status(404).json({'error': "email or token missing"}); return;
		}
		const tok = await redisClient.get('email');
		if (!tok) {
			res.status(400).json({'error': 'token not found'}); return;
		}
		if (tok !== token.toString()) {
			res.status(403).json({'error': 'wrong token'}); return;
		}
		const user = await (await dbClient.client.db().collection('users'))
		.findOne({ "email": email});
		if (!user) {
			res.status(401).json({'error': 'No user found'});
			return;
		}
		res.status(200).json({'status': 'ok'});
	}

	static async postPwdreset(req, res) {
		//reset password for user
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
		.findOne({ "email": email});
		if (!user) {
			res.status(401).json({'error': 'No user found'});
			return;
		}
		await (await dbClient.client.db().collection('users'))
		.updateOne({ "_id": ObjectID(user._id) },
		{ $set: { "password": sha1(password) } });
		res.status(200).json({"status": "ok"})
	}
}


export default AuthController;
module.exports = AuthController;