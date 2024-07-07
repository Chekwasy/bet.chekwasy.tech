import dbClient from '../utils/db';
import Queue from 'bull/lib/queue';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
const { ObjectID } = require('mongodb')

/**
 * Contains user miscellanous handlers for users i.e signup
 */
class UsersController {
  static async postNew(req, res) {
	//add new user
	const usr_det = req.body.emailpwd;
	if (!usr_det) {res.status(400).json({}); return;}
	const encoded_usr_str = (usr_det.split(" "))[1];
	const decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
	const usr_details = decoded_usr_str.split(':');
	const password = usr_details[1];
	const email = usr_details[0];
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
		res.status(401).json({'error': 'Already exist'});
		return;
	}
	const result = await (await dbClient.client.db().collection('users'))
	.insertOne({"email": email, "password": sha1(password),
	"account_balance": '100000', "first_name": '', "last_name": '', "phone": '', });
	const usrId = result.insertedId.toString();


	res.status(201).json({ "email": email });
  }

  static async getMe(req, res) {
	//check if user is logged in
  	const x_tok = req.headers['x-token'];
	if (!x_tok) { res.status(400).json({}); return;}
	const usr_id = await redisClient.get(`auth_${x_tok}`);
	if (!usr_id) {
		res.status(401).json({});
		return;
	}
	const user = await (await dbClient.client.db().collection('users'))
	.findOne({ "_id": ObjectID(usr_id) });
	if (!user) { res.status(401).json({}); return;}
	res.json({'email': user.email, 'account_balance': user.account_balance,
		'first_name': user.first_name, 'last_name': user.last_name,
		'phone': user.phone
	});
  }

  static async putBalance(req, res) {
	//reset balance to the default balance
	const x_tok = req.headers['x-token'];
	if (!x_tok) { res.status(400).json(); return;}
	const usr_id = await redisClient.get(`auth_${x_tok}`);
	if (!usr_id) {
		res.status(401).json({"error": "Unauthorized"});
		return;
	}
	const user = await (await dbClient.client.db().collection('users'))
	.findOne({ "_id": ObjectID(usr_id) });
	if (!user) { res.status(400).json(); return;}
	const nwbal = req.body.newbal;
	if (!nwbal) { res.status(400).json(); return;}
	if (parseFloat(user.account_balance) <= 100000) {
		await (await dbClient.client.db().collection('users'))
		.updateOne({ "_id": ObjectID(usr_id) },
		{ $set: { "account_balance": nwbal.toString() } });
	}
	res.json({'id': usr_id, 'email': user.email, 'status': 'done'});
  }


  static async putUpdate(req, res) {
	//to update user information (first and last name and phone)
	const x_tok = req.headers['x-token'];
	if (!x_tok) { res.status(400).json(); return;}
	const usr_id = await redisClient.get(`auth_${x_tok}`);
	if (!usr_id) {
		res.status(401).json({"error": "Unauthorized"});
		return;
	}
	const user = await (await dbClient.client.db().collection('users'))
	.findOne({ "_id": ObjectID(usr_id) });
	if (!user) { res.status(400).json(); return;}
	const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	const phone = req.body.phone;
	if (!first_name || !last_name || !phone) { res.status(400).json({"error": "missing data"}); return;}
	await (await dbClient.client.db().collection('users'))
		.updateOne({ "_id": ObjectID(usr_id) },
		{ $set: { "first_name": first_name, "last_name": last_name, "phone": phone} });
	res.status(200).json({"status": "ok"});
  }
}

export default UsersController;
module.exports = UsersController;
