import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./layout/navbar";
import WalletNfts from "./pages/walletNfts";
import { useHashConnect } from "./api/HashConnectAPIProvider.tsx";
import { Container, Dialog, Drawer } from "@mui/material";
import Loading from "./components/loading";
import Home from "./pages/home";
import {
  CART_SIZE_LIMIT,
  FLOAT_CALC_OFFSET,
  LOAN_TYPE,
  NFT_INFO,
  PAGE_INFO,
  TREASURY_ID,
} from "./config";
import QuickLoan from "./components/quickLoan";
import Cart from "./components/cart";
import {
  getLoanedInfo,
  requestGetBackNfts,
  requestLoan,
} from "./api/apiRequest";
import { getOwnedNftsById } from "./api/mirrorRequest";
import LoanedNfts from "./pages/loanedNfts";

function App() {
  const { walletData, allowanceTransaction } = useHashConnect();
  const { accountIds } = walletData;

  const [currentPage, setCurrentPage] = useState(PAGE_INFO.home.id);

  const [loadingView, setLoadingView] = useState(false);
  const [quickLoanView, setQuickLoanView] = useState(false);
  const [quickLoanDlgType, setQuickLoanDlgType] = useState("");

  const [ownedNfts, setOwnedNfts] = useState([]);
  const [loanedNfts, setLoanedNfts] = useState([]);
  const [nftToQuickLoan, setNftToQuickLoan] = useState({});
  const [cartNfts, setCartNfts] = useState([]);

  useEffect(() => {
    setCartNfts([]);
    if (!accountIds && currentPage !== PAGE_INFO.home.id) {
      toast.warning("Please connect wallet.");
      setCurrentPage(PAGE_INFO.home.id);
    }
  }, [currentPage, accountIds]);

  const getOwnedNfts = async () => {
    if (!accountIds) {
      setOwnedNfts([]);
      return;
    }

    setLoadingView(true);

    let walletNfts = [];

    for (let i = 0; i < NFT_INFO.length; i++) {
      let ownedInfo = await getOwnedNftsById(
        accountIds[0],
        NFT_INFO[i].tokenId
      );

      if (ownedInfo.result) {
        let newNftInfo = [];
        for (let j = 0; j < ownedInfo.data.length; j++) {
          newNftInfo[j] = {
            ...ownedInfo.data[j],
            maxDuration: NFT_INFO[i].maxDuration,
            maxBillPrice: NFT_INFO[i].maxBillPrice,
            fee: NFT_INFO[i].fee,
          };
        }
        walletNfts.push(...newNftInfo);
      }
    }

    setOwnedNfts(walletNfts);
    setLoadingView(false);
  };

  const getLoanedNfts = async () => {
    if (!accountIds) {
      setLoanedNfts([]);
      return;
    }

    setLoadingView(true);

    const loanedInfo = await getLoanedInfo(accountIds[0]);
    if (!loanedInfo) {
      toast.error(loanedInfo.error);
      setLoadingView(false);
      return;
    }

    setLoanedNfts(JSON.parse(atob(loanedInfo.data)));
    setLoadingView(false);
  };

  const resetPage = (newPageId) => {
    setCurrentPage(newPageId);
  };

  const setQuickLoan = (nftInfo) => {
    const checkExist = cartNfts.find(
      (item) =>
        item.tokenId === nftInfo.tokenId && item.serialNum === nftInfo.serialNum
    );
    if (checkExist) {
      toast.warning("This NFT has already been added to your cart.");
      return;
    }

    setQuickLoanView(true);
    setNftToQuickLoan(nftInfo);
    setQuickLoanDlgType(LOAN_TYPE.quickLoan);
  };

  const runQuickLoan = async (loanType, nftInfo, duration, billPrice) => {
    // console.log(
    //   "runQuickLoan log - 1 : ",
    //   loanType,
    //   nftInfo,
    //   duration,
    //   billPrice
    // );
    if (loanType === LOAN_TYPE.multiLoan) {
      let currentCartNfts = JSON.parse(JSON.stringify(cartNfts));
      const itemToUpdate = currentCartNfts.find(
        (item) =>
          item.tokenId === nftInfo.tokenId &&
          item.serialNum === nftInfo.serialNum
      );
      if (itemToUpdate) {
        itemToUpdate.duration = duration;
        itemToUpdate.billPrice = billPrice;
      }

      setCartNfts(currentCartNfts);
      setQuickLoanView(false);
    } else {
      setLoadingView(true);

      const allowanceInfo = await allowanceTransaction(TREASURY_ID, 0, [
        nftInfo,
      ]);
      if (!allowanceInfo.result) {
        toast.error(allowanceInfo.error);
        setLoadingView(false);
        return;
      }

      const requestLoanInfo = await requestLoan(accountIds[0], [
        { ...nftInfo, duration: duration, billPrice: billPrice },
      ]);
      if (!requestLoanInfo.result) {
        toast.error(requestLoanInfo.error);
        setLoadingView(false);
        return;
      }

      toast.success("NFT loan was successful.");
      setQuickLoanView(false);
      setLoadingView(false);
      getOwnedNfts();
    }
  };

  const addNftToCart = (nftInfo) => {
    // console.log("addNftToCart log - 1 : ", nftInfo);
    let currentCartNfts = JSON.parse(JSON.stringify(cartNfts));

    if (currentCartNfts.length >= CART_SIZE_LIMIT) {
      toast.warning("Your cart is already full.");
      return;
    }

    const checkExist = currentCartNfts.find(
      (item) =>
        item.tokenId === nftInfo.tokenId && item.serialNum === nftInfo.serialNum
    );
    if (checkExist) {
      toast.warning("This NFT has already been added to your cart.");
      return;
    }

    let newCartNfts = currentCartNfts;
    if (currentPage === PAGE_INFO.myNfts.id) {
      newCartNfts.push({
        ...nftInfo,
        duration: nftInfo.maxDuration,
        billPrice: nftInfo.maxBillPrice,
      });
    } else if (currentPage === PAGE_INFO.loanedNfts.id) {
      newCartNfts.push(nftInfo);
    }

    // console.log("addNftToCart log - 2 : ", newCartNfts);
    setCartNfts(newCartNfts);
  };

  const removeNftFromCart = (nftInfo) => {
    let currentCartNfts = JSON.parse(JSON.stringify(cartNfts));
    let remainCartNfts = currentCartNfts.filter(
      (item) =>
        !(
          item.accountId === nftInfo.accountId &&
          item.serialNum === nftInfo.serialNum
        )
    );

    setCartNfts(remainCartNfts);
  };

  const resetNftLoanInfo = (nftInfo) => {
    setQuickLoanView(true);
    setNftToQuickLoan(nftInfo);
    setQuickLoanDlgType(LOAN_TYPE.multiLoan);
  };

  const loanCartNfts = async () => {
    if (currentPage === PAGE_INFO.myNfts.id) {
      console.log("loanCartNfts log - 1");
      setLoadingView(true);

      const allowanceInfo = await allowanceTransaction(
        TREASURY_ID,
        0,
        cartNfts
      );
      if (!allowanceInfo.result) {
        toast.error(allowanceInfo.error);
        setLoadingView(false);
        return;
      }

      const requestLoanInfo = await requestLoan(accountIds[0], cartNfts);
      if (!requestLoanInfo.result) {
        toast.error(requestLoanInfo.error);
        setLoadingView(false);
        return;
      }

      toast.success("NFT loan was successful.");
      setCartNfts([]);
      setLoadingView(false);
      getOwnedNfts();
    } else if (currentPage === PAGE_INFO.loanedNfts.id) {
      getBackNfts(cartNfts, false);
    }
  };

  const getBackNfts = async (nftInfo, singleFlag) => {
    if (singleFlag) {
      const checkExist = cartNfts.find(
        (item) =>
          item.tokenId === nftInfo[0].tokenId &&
          item.serialNum === nftInfo[0].serialNum
      );
      if (checkExist) {
        toast.warning("This NFT has already been added to your cart.");
        return;
      }
    }
    // calc get back price
    let totalPrice = nftInfo.reduce(
      (sum, item) =>
        parseFloat(sum) +
        parseFloat(
          parseFloat(item.billPrice) +
            parseFloat((item.billPrice * item.fee) / 100)
        ),
      0
    );
    totalPrice = parseFloat(
      parseFloat(totalPrice) + parseFloat(FLOAT_CALC_OFFSET)
    ).toFixed(2);

    setLoadingView(true);

    // allowance hbar
    const allowanceInfo = await allowanceTransaction(
      TREASURY_ID,
      totalPrice,
      []
    );
    if (!allowanceInfo.result) {
      toast.error(allowanceInfo.error);
      setLoadingView(false);
      return;
    }

    const requestInfo = await requestGetBackNfts(accountIds[0], nftInfo);
    if (!requestInfo.result) {
      toast.error(requestInfo.error);
      setLoadingView(false);
      return;
    }

    toast.success("NFTs were successfully returned.");
    setCartNfts([]);
    setLoadingView(false);
    getLoanedNfts();
  };

  return (
    <>
      <Navbar currentPage={currentPage} resetPage={resetPage} />
      <Container
        sx={{
          paddingTop: "72px",
          paddingBottom: cartNfts.length > 0 ? "306px" : "36px",
        }}
      >
        {currentPage === PAGE_INFO.home.id && <Home resetPage={resetPage} />}
        {currentPage === PAGE_INFO.myNfts.id && (
          <WalletNfts
            accountIds={accountIds}
            getOwnedNfts={getOwnedNfts}
            ownedNfts={ownedNfts}
            setQuickLoan={setQuickLoan}
            addNftToCart={addNftToCart}
          />
        )}
        {currentPage === PAGE_INFO.loanedNfts.id && (
          <LoanedNfts
            accountIds={accountIds}
            getLoanedNfts={getLoanedNfts}
            loanedNfts={loanedNfts}
            getBackNfts={getBackNfts}
            addNftToCart={addNftToCart}
          />
        )}
      </Container>
      <Drawer
        open={cartNfts.length > 0}
        anchor="bottom"
        variant="persistent"
        sx={{
          ".MuiPaper-root": {
            background: "transparent",
          },
        }}
      >
        <Cart
          currentPage={currentPage}
          cartNfts={cartNfts}
          loanCartNfts={loanCartNfts}
          resetNftLoanInfo={resetNftLoanInfo}
          removeNftFromCart={removeNftFromCart}
        />
      </Drawer>
      <Dialog
        open={quickLoanView}
        sx={{
          ".MuiPaper-root": {
            borderRadius: "0",
            margin: "0",
          },
        }}
      >
        <QuickLoan
          loanType={quickLoanDlgType}
          nftInfo={nftToQuickLoan}
          onClickOk={runQuickLoan}
          onClickCancel={() => {
            setQuickLoanView(false);
          }}
        />
      </Dialog>
      <Dialog
        open={loadingView}
        sx={{
          ".MuiPaper-root": {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            margin: "0",
            padding: "0",
          },
        }}
      >
        <Loading />
      </Dialog>
      <ToastContainer autoClose={3000} draggableDirection="x" />
    </>
  );
}

export default App;
