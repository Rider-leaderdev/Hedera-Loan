require("dotenv").config("../env");
const {
  TREASURY_THRESHOLD,
  NFT_INFO,
  DB_REFRESH_INTERVAL,
  CYCLE_WALLET_ID,
  REV_WALLET_ID,
} = require("../config");
const { LoanInfo } = require("../db");
const {
  getAccountHbarBalance,
  receiveAllowancedNfts,
  sendHbar,
  dayToMilliSec,
  sendNfts,
  getNftInfo,
} = require("./web3Api");

const treasuryId = process.env.TREASURY_ID;

let AccountWhileSwap_Global = [];

const getGlobalAccountWhileSwap = () => {
  return AccountWhileSwap_Global;
};

const setGlobalAccountWhileSwap = (newInfo) => {
  AccountWhileSwap_Global = newInfo;
};

const checkGlobalAccountWhileSwap = (accountId) => {
  let accountWhileSwap = getGlobalAccountWhileSwap();
  let isExist = accountWhileSwap.find((item) => item === accountId);
  if (!isExist) {
    return false;
  }
  return true;
};

const addGlobalAccountWhileSwap = (accountId) => {
  AccountWhileSwap_Global.push(accountId);
};

const removeGlobalAccountWhileSwap = (accountId) => {
  let accountWhileSwap = getGlobalAccountWhileSwap();
  let removeOne = accountWhileSwap.filter((item) => item !== accountId);
  setGlobalAccountWhileSwap(removeOne);
};

exports.getLoanInfoByAccount = async (req, res) => {
  console.log("getLoanInfoByAccount log - 1 : ", req.query);
  try {
    const data = JSON.parse(atob(req.query.data));
    const accountId = data.accountId;

    const loanedNftInfo = await LoanInfo.find({ accountId: accountId });

    let calcedNftInfo = [];
    for (let i = 0; i < loanedNftInfo.length; i++) {
      const remainTime =
        loanedNftInfo[i].createdAt.getTime() +
        dayToMilliSec(loanedNftInfo[i].duration) -
        Date.now();

      calcedNftInfo.push({
        name: loanedNftInfo[i].name,
        tokenId: loanedNftInfo[i].tokenId,
        serialNum: loanedNftInfo[i].serialNum,
        imageUrl: loanedNftInfo[i].imageUrl,
        duration: loanedNftInfo[i].duration,
        billPrice: loanedNftInfo[i].billPrice,
        fee: loanedNftInfo[i].fee,
        remainTime: remainTime,
      });
    }

    return res.send({
      result: true,
      data: btoa(JSON.stringify(calcedNftInfo)),
    });
  } catch (error) {
    console.log("getLoanInfoByAccount error : ", error);
    return res.send({
      result: false,
      error: "Error-C1 detected in server progress!",
    });
  }
};

exports.loanNfts = async (req, res) => {
  console.log("loanNfts log - 1 : ", req.body);
  try {
    const data = JSON.parse(atob(req.body.data));
    const accountId = data.accountId;
    const nftInfo = data.nftInfo;

    console.log("loanNfts log - 2 : ", accountId, nftInfo);

    const isWhileSwap = checkGlobalAccountWhileSwap(accountId);
    if (isWhileSwap) {
      return res.send({
        result: false,
        error: "Server is in progress. Please try again later.",
      });
    }
    addGlobalAccountWhileSwap(accountId);

    // check input data is valid
    for (let i = 0; i < nftInfo.length; i++) {
      const registeredNftInfo = NFT_INFO.find(
        (item) => item.tokenId === nftInfo[i].tokenId
      );
      if (!registeredNftInfo) {
        removeGlobalAccountWhileSwap(accountId);
        return res.send({
          result: false,
          error: "Unregistered NFTs have been sent.",
        });
      }
      if (
        nftInfo[i].duration > registeredNftInfo.maxDuration ||
        nftInfo[i].billPrice > registeredNftInfo.maxBillPrice ||
        nftInfo[i].fee != registeredNftInfo.fee
      ) {
        removeGlobalAccountWhileSwap(accountId);
        return res.send({
          result: false,
          error: "An invalid request has been sent.",
        });
      }
    }

    // check server has enough balance
    let totalBillPrice = nftInfo.reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.billPrice),
      0
    );

    totalBillPrice = parseFloat(totalBillPrice).toFixed(2);

    const treasuryBalanceInfo = await getAccountHbarBalance(treasuryId);
    if (!treasuryBalanceInfo.result) {
      removeGlobalAccountWhileSwap(accountId);
      return res.send(treasuryBalanceInfo);
    }

    if (totalBillPrice > treasuryBalanceInfo.data - TREASURY_THRESHOLD) {
      removeGlobalAccountWhileSwap(accountId);
      return res.send({
        result: false,
        error: "Treasury doesn't have enough HBAR.",
      });
    }

    // receive allowanced NFTs
    const receiveNftInfo = await receiveAllowancedNfts(accountId, nftInfo, 0);
    if (!receiveNftInfo.result) {
      removeGlobalAccountWhileSwap(accountId);
      return res.send(receiveNftInfo);
    }

    // save info to Database
    for (let i = 0; i < nftInfo.length; i++) {
      await LoanInfo.deleteMany({
        tokenId: nftInfo[i].tokenId,
        serialNum: nftInfo[i].serialNum,
      });

      const newLoanInfo = new LoanInfo({
        accountId: accountId,
        name: nftInfo[i].name,
        tokenId: nftInfo[i].tokenId,
        serialNum: nftInfo[i].serialNum,
        imageUrl: nftInfo[i].imageUrl,
        duration: nftInfo[i].duration,
        billPrice: nftInfo[i].billPrice,
        fee: nftInfo[i].fee,
      });
      await newLoanInfo.save();
    }

    // send bill price
    const sendInfo = await sendHbar(accountId, totalBillPrice);
    if (!sendInfo.result) {
      removeGlobalAccountWhileSwap(accountId);
      return res.send(sendInfo);
    }

    removeGlobalAccountWhileSwap(accountId);
    return res.send({
      result: true,
    });
  } catch (error) {
    console.log("loanNfts error : ", error);
    removeGlobalAccountWhileSwap(accountId);
    return res.send({
      result: false,
      error: "Error-C2 detected in server progress!",
    });
  }
};

exports.getBackNfts = async (req, res) => {
  console.log("getBackNfts log - 1 : ", req.body);
  try {
    const data = JSON.parse(atob(req.body.data));
    const accountId = data.accountId;
    const nftInfo = data.nftInfo;

    const isWhileSwap = checkGlobalAccountWhileSwap(accountId);
    if (isWhileSwap) {
      return res.send({
        result: false,
        error: "Server is in progress. Please try again later.",
      });
    }
    addGlobalAccountWhileSwap(accountId);

    // seperate nfts to send
    let nftsToSend = [];
    for (let i = 0; i < nftInfo.length; i++) {
      const nftDbInfo = await LoanInfo.findOne({
        accountId: accountId,
        tokenId: nftInfo[i].tokenId,
        serialNum: nftInfo[i].serialNum,
      });
      console.log("getBackNfts log - 2 : ", nftDbInfo);
      if (!nftDbInfo) {
        removeGlobalAccountWhileSwap(accountId);
        return res.send({
          result: false,
          error: "An invalid request has been sent.",
        });
      }

      const remainTime =
        nftDbInfo.createdAt.getTime() +
        dayToMilliSec(nftDbInfo.duration) -
        Date.now();

      if (remainTime < 0) {
        removeGlobalAccountWhileSwap(accountId);
        return res.send({
          result: false,
          error: "An invalid request has been sent.",
        });
      }

      nftsToSend.push({
        tokenId: nftDbInfo.tokenId,
        serialNum: nftDbInfo.serialNum,
        price: parseFloat(
          parseFloat(nftDbInfo.billPrice) +
            parseFloat((nftDbInfo.billPrice * nftDbInfo.fee) / 100)
        ).toFixed(2),
        rev: parseFloat((nftDbInfo.billPrice * nftDbInfo.fee) / 100).toFixed(2),
      });
    }

    // calc receive price
    let totalPrice = nftsToSend.reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.price),
      0
    );

    totalPrice = parseFloat(totalPrice).toFixed(2);

    console.log("getBackNfts log - 3 : ", totalPrice);
    // receive hbar
    const receiveInfo = await receiveAllowancedNfts(accountId, [], totalPrice);
    if (!receiveInfo.result) {
      removeGlobalAccountWhileSwap(accountId);
      return receiveInfo;
    }

    // calc rev price
    let totalRev = nftsToSend.reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.rev),
      0
    );
    totalRev = parseFloat(totalRev).toFixed(2);
    // send rev
    sendHbar(REV_WALLET_ID, totalRev);

    // send NFTs
    let remainNftsInfo = [];
    while (1) {
      for (let i = 0; i < nftsToSend.length; i++) {
        const singleNftInfo = await getNftInfo(
          nftsToSend[i].tokenId,
          nftsToSend[i].serialNum
        );

        console.log("getBackNfts log - 4 : ", singleNftInfo);

        if (singleNftInfo.data.account_id === treasuryId) {
          remainNftsInfo.push(nftsToSend[i]);
        }
      }
      const sendInfo = await sendNfts(accountId, remainNftsInfo);
      if (sendInfo.result) {
        break;
      }
    }

    // update db
    for (let i = 0; i < nftsToSend.length; i++) {
      await LoanInfo.deleteMany({
        tokenId: nftsToSend[i].tokenId,
        serialNum: nftsToSend[i].serialNum,
      });
    }

    removeGlobalAccountWhileSwap(accountId);
    return res.send({
      result: true,
    });
  } catch (error) {
    console.log("getBackNfts error : ", error);
    removeGlobalAccountWhileSwap(accountId);
    return res.send({
      result: false,
      error: "Error-C3 detected in server progress!",
    });
  }
};

const updateDb = async () => {
  const currentLoanInfo = await LoanInfo.find({});
  console.log("updateDb log - 1 : ", currentLoanInfo);
  for (let i = 0; i < currentLoanInfo.length; i++) {
    const remainTime =
      currentLoanInfo[i].createdAt.getTime() +
      dayToMilliSec(currentLoanInfo[i].duration) -
      Date.now();

    if (remainTime < 0) {
      await sendNfts(CYCLE_WALLET_ID, [
        {
          tokenId: currentLoanInfo[i].tokenId,
          serialNum: currentLoanInfo[i].serialNum,
        },
      ]);
      await LoanInfo.deleteMany({
        tokenId: currentLoanInfo[i].tokenId,
        serialNum: currentLoanInfo[i].serialNum,
      });
    }
  }
  setTimeout(updateDb, DB_REFRESH_INTERVAL);
};

const init = async () => {
  console.log("init log - 1");
  updateDb();
};

init();
