const AdSpaceToken = artifacts.require('AdSpaceToken');

module.exports = async function(callback) {
  try {
    const adSpaceToken = await AdSpaceToken.deployed();
    const account = (await web3.eth.getAccounts())[0];
    const uri = 'dailymotion.png';
    const price = web3.utils.toWei('0.1', 'ether');
    
    await adSpaceToken.createAdSpace(uri, price, { from: account });
    
    console.log('Ad space created successfully!');
  } catch (error) {
    console.error(error);
  }
  
  callback();
};
