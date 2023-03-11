const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("ETHDaddy", () => {
  let ethDaddy;
  let deployer, owner1;
  const NAME = "ETH Daddy";
  const SYMBOL = "ETHD";

  beforeEach(async () => {
    // Setup Accounts
    [deployer, owner1] = await ethers.getSigners();

    // Deploying Contract
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
    ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL);

    // Lists Domain
    const transaction = await ethDaddy
      .connect(deployer)
      .list("shayan.eth", tokens(0.06));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("has a name", async () => {
      const result = await ethDaddy.name();
      expect(result).to.equal(NAME);
    });

    it("has a symbol", async () => {
      const result = await ethDaddy.symbol();
      expect(result).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      const result = await ethDaddy.getOwner();
      expect(result).to.equal(deployer.address);
    });
    it("Returns the max supply", async () => {
      const result = await ethDaddy.getMaxSupply();
      expect(result).to.equal(1);
    });
    it("Returns the total supply at deploment", async () => {
      const result = await ethDaddy.getTotalSupply();
      expect(result).to.equal(0);
    });
  });
  describe("Domain", () => {
    it("Returns domain attributes", async () => {
      let domain = await ethDaddy.getDomain(1);
      expect(domain.name).to.be.equal("shayan.eth");
      expect(domain.cost).to.be.equal(tokens(0.06));
      expect(domain.isOwned).to.be.equal(false);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const AMOUNT = tokens(10);

    beforeEach(async () => {
      const transaction = await ethDaddy
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });

    it("Updates the owner", async () => {
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address);
    });

    it("Updates the domain status", async () => {
      const domain = await ethDaddy.getDomain(ID);
      expect(domain.isOwned).to.be.equal(true);
    });

    it("Updates the total supply after minting", async () => {
      const result = await ethDaddy.getTotalSupply();
      expect(result).to.be.equal(1);
    });

    it("Updates the contract balance", async () => {
      const result = await ethDaddy.getBalance();
      expect(result).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = tokens(10);
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await ethDaddy
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      transaction = await ethDaddy.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner/deployer balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await ethDaddy.getBalance();
      expect(result).to.be.equal(0);
    });
  });
});
