const chai = require("chai");
const { expect } = chai;
const BigNumber = require("bn.js");
chai.use(require("chai-bn")(BigNumber));

const { ethers } = require("hardhat");
const { utils } = ethers;

describe("AdSpaceToken", function () {
  let AdSpaceToken, adSpaceToken, IERC20Metadata, paymentToken, owner, addr1, addr2;

  beforeEach(async () => {
    AdSpaceToken = await ethers.getContractFactory("AdSpaceToken");
    IERC20Metadata = await ethers.getContractFactory("IERC20Metadata");

    [owner, addr1, addr2] = await ethers.getSigners();

    paymentToken = await IERC20Metadata.deploy("PaymentToken", "PT", 18, utils.parseEther("1000000"));
    await paymentToken.deployed();

    adSpaceToken = await AdSpaceToken.deploy(paymentToken.address);
    await adSpaceToken.deployed();

    await paymentToken.transfer(addr1.address, utils.parseEther("1000"));
    await paymentToken.transfer(addr2.address, utils.parseEther("1000"));

    await adSpaceToken.transferOwnership(owner.address);
  });

  describe("createAdSpace", function () {
    it("should create an ad space", async function () {
      await adSpaceToken.createAdSpace("https://example.com", utils.parseEther("1"), "https://example.com/image.png", { from: addr1.address });

      const adSpace = await adSpaceToken.adSpaces(0);
      expect(adSpace.uri).to.equal("https://example.com");
      expect(adSpace.price).to.be.bignumber.equal(utils.parseEther("1"));
      expect(adSpace.imageUrl).to.equal("https://example.com/image.png");

      const totalAdSpaces = await adSpaceToken.totalAdSpaces();
      expect(totalAdSpaces).to.be.bignumber.equal(utils.parseEther("1"));
    });
  });

  describe("buyAdSpace", function () {
    beforeEach(async () => {
      await adSpaceToken.createAdSpace("https://example.com", utils.parseEther("1"), "https://example.com/image.png", { from: addr1.address });
    });

    it("should buy an ad space", async function () {
      await paymentToken.connect(addr2).approve(adSpaceToken.address, utils.parseEther("1"));
      await adSpaceToken.connect(addr2).buyAdSpace(0);

      const newOwner = await adSpaceToken.ownerOf(0);
      expect(newOwner).to.equal(addr2.address);
    });

    it("should revert when trying to buy an invalid ad space", async function () {
      await paymentToken.connect(addr2).approve(adSpaceToken.address, utils.parseEther("1"));
      try {
        await adSpaceToken.connect(addr2).buyAdSpace(1);
      } catch (error) {
        expect(error.message).to.contain("AdSpaceToken: Ad space does not exist");
      }
    });
  });

  describe("updateAdSpace", function () {
    beforeEach(async () => {
      await adSpaceToken.createAdSpace("https://example.com", web3.utils.toWei("1", "ether"), "https://example.com/image.png", { from: addr1 });
    });

    it("should update an ad space", async function () {
      await adSpaceToken.updateAdSpace(0, "https://newexample.com", web3.utils.toWei("2", "ether"), "https://newexample.com/newimage.png", { from: addr1 });

      const adSpace = await adSpaceToken.adSpaces(0);
      expect(adSpace.uri).to.equal("https://newexample.com");
      expect(adSpace.price).to.be.bignumber.equal(web3.utils.toBN(web3.utils.toWei("2", "ether")));
      expect(adSpace.imageUrl).to.equal("https://newexample.com/newimage.png");
      });
      });
      
      describe("deleteAdSpace", function () {
        beforeEach(async () => {
          await adSpaceToken.createAdSpace("https://example.com", web3.utils.toWei("1", "ether"), "https://example.com/image.png", { from: addr1 });
        });
        it("should delete an ad space", async () => {
          const tokenId = 0;
      
          const totalAdSpacesBefore = await adSpaceToken.totalAdSpaces();
          console.log("Total ad spaces before deletion:", totalAdSpacesBefore.toString());
      
          await adSpaceToken.deleteAdSpace(tokenId, { from: addr1 });
      
          const ownerBalance = await adSpaceToken.balanceOf(addr1);
          expect(ownerBalance.toString()).to.equal("0");
      
          const adSpacesCreatedByUserBefore = await adSpaceToken.getAdSpacesCreatedByUser(addr1);
          console.log("Ad spaces created by user before deletion:", adSpacesCreatedByUserBefore.toString());
      
          const totalAdSpaces = await adSpaceToken.totalAdSpaces();
          console.log("Total ad spaces after deletion:", totalAdSpaces.toString());
          expect(totalAdSpaces.toString()).to.equal("0");
      
          const adSpacesOfOwner = await adSpaceToken.adSpacesOf(addr1);
          expect(adSpacesOfOwner.length).to.equal(0);
      
          const adSpacesCreatedByUser = await adSpaceToken.getAdSpacesCreatedByUser(addr1);
          console.log("Ad spaces created by user after deletion:", adSpacesCreatedByUser.toString());
          expect(adSpacesCreatedByUser.toString()).to.equal("0");
        });
      });
      

    describe("adSpacesOf", function () {
    beforeEach(async () => {
    await adSpaceToken.createAdSpace("https://example.com", web3.utils.toWei("1", "ether"), "https://example.com/image.png", { from: addr1 });
    await adSpaceToken.createAdSpace("https://example2.com", web3.utils.toWei("2", "ether"), "https://example.com/image2.png", { from: addr1 });
    });
    it("should return ad spaces of an address", async function () {
      const adSpaces = await adSpaceToken.adSpacesOf(addr1);
    
      expect(adSpaces.length).to.equal(2);
      expect(adSpaces[0].toNumber()).to.equal(0);
      expect(adSpaces[1].toNumber()).to.equal(1);
    });
  });

  describe("getAdSpacesCreatedByUser", function () {
  beforeEach(async () => {
  await adSpaceToken.createAdSpace("https://example.com", web3.utils.toWei("1", "ether"), "https://example.com/image.png", { from: addr1 });
  await adSpaceToken.createAdSpace("https://example2.com", web3.utils.toWei("2", "ether"), "https://example.com/image2.png", { from: addr1 });
  });
  it("should return the count of ad spaces created by a user", async function () {
    const adSpacesCount = await adSpaceToken.getAdSpacesCreatedByUser(addr1);
    expect(adSpacesCount).to.be.bignumber.equal(web3.utils.toBN(2));
  });
});
});            
