require("dotenv").config("../.env");
const { MINT_STATUS_PENDING, MINT_STATUS_FREE } = require("../config-global");
const { NftInfo, MinterInfo } = require("../db");
const { getNftInfo } = require("./web3Api");

const treasuryId = process.env.TREASURY_ID;

const getAccountMintedCount = async (accountId) => {
  try {
    const accountMintInfo = await MinterInfo.findOne(
      { accountId: accountId },
      { mintedCount: 1 }
    );
    console.log("getAccountMintedCount log - 1 : ", accountMintInfo);
    if (accountMintInfo === null) {
      const newMinterInfo = new MinterInfo({
        accountId: accountId,
        mintedCount: 0,
      });
      await newMinterInfo.save();

      return {
        result: true,
        mintedCount: 0,
      };
    }

    return {
      result: true,
      mintedCount: accountMintInfo.mintedCount,
    };
  } catch (error) {
    return {
      result: false,
      error: error,
    };
  }
};

const resetAccountMintedCount = async (accountId, mintedCount) => {
  try {
    await MinterInfo.updateOne(
      { accountId: accountId },
      { $inc: { mintedCount: +mintedCount } }
    );
    return {
      result: true,
    };
  } catch (error) {
    return {
      result: false,
      error: error,
    };
  }
};

const changeStatusToPending = async (accountId, serialNumber) => {
  try {
    await NftInfo.updateOne(
      { serialNumber: serialNumber },
      { accountId: accountId, status: MINT_STATUS_PENDING }
    );
    return { result: true };
  } catch (error) {
    return {
      result: false,
      error: error,
    };
  }
};

const changeStatusToComplete = async (serialNumber) => {
  console.log("changeStatusToComplete log - 1 : ", serialNumber);
  try {
    await NftInfo.updateOne(
      { serialNumber: serialNumber },
      { status: MINT_STATUS_FREE }
    );
    return { result: true };
  } catch (error) {
    return {
      result: false,
      error: error,
    };
  }
};

module.exports = {
  getAccountMintedCount,
  resetAccountMintedCount,
  changeStatusToPending,
  changeStatusToComplete,
};
