require("dotenv").config("../env");
const {
  AccountId,
  Client,
  Hbar,
  NftId,
  PrivateKey,
  TransferTransaction,
  TokenId,
  TransactionId,
} = require("@hashgraph/sdk");
const axios = require("axios");

const operatorId = AccountId.fromString(process.env.TREASURY_ID);
const operatorKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);

const getAccountHbarBalance = async (accountId) => {
  try {
    const balanceInfo = await axios.get(
      `https://mainnet-public.mirrornode.hedera.com/api/v1/balances?account.id=${accountId}`
    );
    return {
      result: true,
      data: changeToRealHbarBalance(balanceInfo.data.balances[0].balance),
    };
  } catch (error) {
    console.log("getAccountHbarBalance error : ", error);
    return { result: false, error: "Error-W1 detected in server progress!" };
  }
};

const receiveAllowancedNfts = async (senderId, nftInfo, hbarBalance) => {
  try {
    const client = Client.forMainnet()
      .setOperator(operatorId, operatorKey)
      .setDefaultMaxTransactionFee(new Hbar(50));

    let approvedSendTx = new TransferTransaction();
    if (hbarBalance > 0) {
      const sendBal = new Hbar(hbarBalance);
      approvedSendTx
        .addApprovedHbarTransfer(
          AccountId.fromString(senderId),
          sendBal.negated()
        )
        .addHbarTransfer(operatorId, sendBal);
    }
    if (nftInfo.length > 0) {
      for (let i = 0; i < nftInfo.length; i++) {
        const nft = new NftId(
          TokenId.fromString(nftInfo[i].tokenId),
          nftInfo[i].serialNum
        );
        approvedSendTx.addApprovedNftTransfer(
          nft,
          AccountId.fromString(senderId),
          operatorId
        );
      }
    }
    approvedSendTx
      .setTransactionId(TransactionId.generate(operatorId))
      .freezeWith(client);
    const approvedSendSign = await approvedSendTx.sign(operatorKey);
    const approvedSendSubmit = await approvedSendSign.execute(client);
    const approvedSendRx = await approvedSendSubmit.getReceipt(client);

    if (approvedSendRx.status._code != 22)
      return {
        result: false,
        error: "Error-W2.1 detected in server progress!",
      };

    return { result: true };
  } catch (error) {
    console.log("receiveAllowancedNfts error : ", error);
    return { result: false, error: "Error-W2 detected in server progress!" };
  }
};

const sendHbar = async (receiverId, hbarBalance) => {
  console.log("sendHbar log - 1 : ", receiverId, hbarBalance);
  try {
    const client = Client.forMainnet()
      .setOperator(operatorId, operatorKey)
      .setDefaultMaxTransactionFee(new Hbar(50));

    const transferTx = await new TransferTransaction()
      .addHbarTransfer(operatorId, new Hbar(-hbarBalance))
      .addHbarTransfer(AccountId.fromString(receiverId), new Hbar(hbarBalance))
      .freezeWith(client)
      .sign(operatorKey);
    const transferSubmit = await transferTx.execute(client);
    const transferRx = await transferSubmit.getReceipt(client);

    if (transferRx.status._code !== 22)
      return {
        result: false,
        error: "Error-W3.1 detected in server progress!",
      };

    return { result: true };
  } catch (error) {
    console.log("sendHbar error : ", error);
    return {
      result: false,
      error: "Error-W3 detected in server progress!",
    };
  }
};

const sendNfts = async (receiverId, nftInfo) => {
  try {
    const client = Client.forMainnet()
      .setOperator(operatorId, operatorKey)
      .setDefaultMaxTransactionFee(new Hbar(50));

    const transferTx = new TransferTransaction();
    for (let i = 0; i < nftInfo.length; i++) {
      const nft = new NftId(
        TokenId.fromString(nftInfo[i].tokenId),
        nftInfo[i].serialNum
      );
      transferTx.addNftTransfer(
        nft,
        operatorId,
        AccountId.fromString(receiverId)
      );
    }
    transferTx.freezeWith(client);
    const transferSign = await transferTx.sign(operatorKey);
    const transferSubmit = await transferSign.execute(client);
    const transferRx = await transferSubmit.getReceipt(client);

    if (transferRx.status._code !== 22)
      return {
        result: false,
        error: "Error-W4.1 detected in server progress!",
      };

    return { result: true };
  } catch (error) {
    console.log("sendNfts error : ", error);
    return {
      result: false,
      error: "Error-W4 detected in server progress!",
    };
  }
};

const getNftInfo = async (tokenId, serialNumber) => {
  try {
    const response = await axios.get(
      `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts/${serialNumber}`
    );
    return {
      result: true,
      data: response.data,
    };
  } catch (error) {
    console.log("getNftInfo error : ", error);
    return {
      result: false,
      error: "Error-W5 detected in server progress!",
    };
  }
};

const dayToMilliSec = (day) => {
  return day * 3600 * 24 * 1000;
};

const changeToRealHbarBalance = (balance) => {
  return parseFloat(balance) / 100000000;
};

module.exports = {
  getAccountHbarBalance,
  receiveAllowancedNfts,
  sendHbar,
  sendNfts,
  dayToMilliSec,
  getNftInfo,
};
