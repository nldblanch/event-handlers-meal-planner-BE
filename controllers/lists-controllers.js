const { fetchListsByUsername } = require("../models/lists-models");

exports.getListsByUsername = (request, resposne, next) => {
  const { username } = request.params;
  fetchListsByUsername(username).then((lists) => {
    resposne.status(200).send({ lists });
  });
};