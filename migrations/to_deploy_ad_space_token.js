const AdSpaceToken = artifacts.require('AdSpaceToken');

module.exports = function (deployer) {
  deployer.deploy(AdSpaceToken);
};
