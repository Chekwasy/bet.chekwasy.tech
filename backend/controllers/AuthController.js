import redisClient from '../utils/redis';
import { v4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
/**
 * Contains auth miscellanous handlers
 */
class AuthController {
	static async getConnect(req, res) {
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
		redisClient.set(`auth_${auth_token}`, user._id.toString(), 24 * 60 * 60);
		res.status(200).json({ "token": auth_token });
	}

	static async getDisconnect(req, res) {
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

}


export default AuthController;
module.exports = AuthController;