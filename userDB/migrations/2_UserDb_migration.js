const UserDb = artifacts.require("UserDb");

module.exports = function (deployer) {
  deployer.deploy(UserDb);
};
