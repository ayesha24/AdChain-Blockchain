const AdSpaceToken = artifacts.require("AdSpaceToken");
const ERC20Mock = artifacts.require("ERC20Mock");

module.exports = async function (deployer, network, accounts) {
  // Deploy the ERC20Mock contract
  await deployer.deploy(
    ERC20Mock,
    "Mock Token",
    "MKT",
    accounts[0], // Initial account with tokens
    web3.utils.toWei("1000000") // Initial token balance for the account
  );
  const erc20Mock = await ERC20Mock.deployed();

  // Deploy the AdSpaceToken contract
  await deployer.deploy(AdSpaceToken, erc20Mock.address);
};
