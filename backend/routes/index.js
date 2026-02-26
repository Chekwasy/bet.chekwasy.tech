import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import FilesController from '../controllers/FilesController.js';
import GamesController from '../controllers/GamesController.js';
import cors from "cors";
import bodyParser from "body-parser";


const mapRoute = (app) => {
  app.use(cors({
    origin: '*'
  }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.get('/v1/status', AppController.getStatus);
  app.get('/v1/stats', AppController.getStats);
  app.post('/v1/users', UsersController.postNew);
  app.get('/v1/connect', AuthController.getConnect);
  app.get('/v1/disconnect', AuthController.getDisconnect);
  app.get('/v1/users/me', UsersController.getMe);
  app.post('/v1/files', FilesController.postUpload);
  app.get('/v1/files/:id', FilesController.getShow);
  app.get('/v1/files', FilesController.getIndex);
  app.put('/v1/files/:id/publish', FilesController.putPublish);
  app.put('/v1/files/:id/unpublish', FilesController.putUnpublish);
  app.get('/v1/files/:id/data', FilesController.getFile);
  app.get('/v1/games/:date', GamesController.getGames);
  app.get('/v1/odds/:date', GamesController.getOdds);
  app.put('/v1/bal_res', UsersController.putBalance);
  app.post('/v1/send_tok', AuthController.postSend_tok);
  app.post('/v1/pwdreset', AuthController.postPwdreset);
  app.post('/v1/checktoken', AuthController.postChecktoken);
  app.put('/v1/update', UsersController.putUpdate);
  app.post('/v1/bet', GamesController.postBet);
  app.get('/v1/openbet/:pg', GamesController.getOpenbet);
  app.get('/v1/closebet/:pg', GamesController.getClosebet);
  app.post('/v1/postodds/:date', GamesController.postOdds);
  app.get('/v1/savedgames/:id', GamesController.getSavedgames);
  app.post('/v1/savedgames/', GamesController.postSavedgames);
};

export default mapRoute;
module.exports = mapRoute;
