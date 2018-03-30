import Game from '../models/game';
// import cuid from 'cuid';
// import slug from 'limax';

export function getGames(req, res) {
  Game.find().sort('-dateAdded').exec((err, games) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ games });
  });
}

export function addGame(req, res) {
  if (!req.body.game.game || !req.body.game.cuid) {
    res.status(403).end();
  }

  const newGame = new Game(req.body.game);

  newGame.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ game: saved });
  });
}

export function getGame(req, res) {
  Game.findOne({ cuid: req.params.cuid }).exec((err, game) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ game });
  });
}
