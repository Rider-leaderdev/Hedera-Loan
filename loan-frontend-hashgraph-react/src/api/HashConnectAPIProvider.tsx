import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import React, { useEffect, useState } from "react";
import {
  AccountId,
  TokenId,
  NftId,
  AccountAllowanceApproveTransaction,
  TransferTransaction,
} from "@hashgraph/sdk";

const NETWORK_TYPE = "mainnet";

//Type declarations
interface SaveData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: HashConnectTypes.WalletMetadata | null;
  pairedAccounts: string[];
  netWork?: string;
  id?: string;
  accountIds?: string[];
}

type Networks = "testnet" | "mainnet" | "previewnet";

interface PropsType {
  children: React.ReactNode;
  hashConnect: HashConnect;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

export interface HashConnectProviderAPI {
  connect: () => void;
  disconnect: () => void;
  tokenTransfer: () => void;
  walletData: SaveData;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  installedExtensions: HashConnectTypes.WalletMetadata | null;
}

const INITIAL_SAVE_DATA: SaveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedAccounts: [],
  pairedWalletData: null,
};

let APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "hbarcrash.in",
  description: "hbarcrash.in",
  icon: "https://hbarcrash.in/logo192.png",
};

const loadLocalData = (): null | SaveData => {
  let foundData = localStorage.getItem("hashConnectData");
  if (foundData) {
    const saveData: SaveData = JSON.parse(foundData);
    // setSaveData(saveData);
    return saveData;
  } else return null;
};

export const HashConnectAPIContext =
  React.createContext<HashConnectProviderAPI>({
    connect: () => null,
    disconnect: () => null,
    tokenTransfer: () => null,
    walletData: INITIAL_SAVE_DATA,
    netWork: NETWORK_TYPE,
    installedExtensions: null,
  });

export default function HashConnectProvider({
  children,
  hashConnect,
  metaData,
  netWork,
  debug,
}: PropsType) {
  //Saving Wallet Details in Ustate
  const [saveData, SetSaveData] = useState<SaveData>(INITIAL_SAVE_DATA);
  const [installedExtensions, setInstalledExtensions] =
    useState<HashConnectTypes.WalletMetadata | null>(null);

  const [installedIFrame, setInstalledIFrame] =
    useState<HashConnectTypes.WalletMetadata | null>(null);

  //? Initialize the package in mount
  const initializeHashConnect = async () => {
    const saveData = INITIAL_SAVE_DATA;
    const localData = loadLocalData();

    try {
      //hashConnect.clearConnectionsAndData();

      let initData = await hashConnect.init(APP_CONFIG, NETWORK_TYPE);
      saveData.privateKey = initData.encryptionKey;
      saveData.topic = initData.topic;
      saveData.pairingString = initData.pairingString;
      console.debug("====initializeHashConnect====", initData);
      //hashConnect.connectToIframeParent();
      hashConnect.foundIframeEvent.once(
        async (data: HashConnectTypes.WalletMetadata) => {
          console.debug("====foundIframeEvent====", data);
          setInstalledIFrame(data);
          await hashConnect.connect(
            saveData.topic,
            saveData.pairedWalletData!,
            saveData.privateKey
          );
          //  hashConnect.connectToIframeParent();
        }
      );
    } catch (error) {
    } finally {
      if (localData) {
        SetSaveData((prevData) => ({ ...prevData, ...localData }));
      } else {
        console.log("************************ saveData 1 : ", saveData);
        SetSaveData((prevData) => ({ ...prevData, ...saveData }));
      }
      if (debug) console.log("====Wallet details updated to state====");
    }
  };

  const saveDataInLocalStorage = async (data: MessageTypes.ApprovePairing) => {
    if (debug)
      console.info("===============Saving to localstorage::=============");
    console.log("************************ saveData 3 : ", saveData);
    console.log("************************ data : ", data);
    const { metadata, ...restData } = data;
    SetSaveData((prevSaveData) => {
      prevSaveData.pairedWalletData = metadata;
      return { ...prevSaveData, ...restData };
    });
    data["privateKey"] = saveData.privateKey;
    data["pairingString"] = saveData.pairingString;
    data["pairedWalletData"] = metadata;
    console.log("************************ hashConnectData : ", data);
    let dataToSave = JSON.stringify(data);
    localStorage.setItem("hashConnectData", dataToSave);
  };

  const foundExtensionEventHandler = async (
    data: HashConnectTypes.WalletMetadata
  ) => {
    if (debug) console.debug("====foundExtensionEvent====", data);
    // Do a thing
    const localData = loadLocalData();
    if (!localData) {
      const state = await hashConnect.connect();
      saveData.topic = state.topic;

      //generate a pairing string, which you can display and generate a QR code from
      saveData.pairingString = hashConnect.generatePairingString(
        state,
        netWork,
        false
      );

      hashConnect.findLocalWallets();
    } else
      await hashConnect.connect(
        localData.topic,
        localData.pairedWalletData!,
        localData.privateKey
      );

    setInstalledExtensions(data);
  };

  const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
    if (debug) console.log("====pairingEvent:::Wallet connected=====", data);
    console.log("************************ saveData 2 : ", saveData);
    // Save Data to localStorage
    saveDataInLocalStorage(data);
  };

  useEffect(() => {
    initializeAll();
  }, []);

  const initializeAll = () => {
    //Intialize the setup
    initializeHashConnect();
    hashConnect.foundExtensionEvent.once(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);

    return () => {
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
    };
  };

  const connect = () => {
    if (installedIFrame) {
      hashConnect.connectToIframeParent();
    } else if (installedExtensions) {
      hashConnect.connectToLocalWallet();
    } else {
      return "wallet not installed";
    }
  };

  const disconnect = async () => {
    // console.log('Glinton log >>>>> disconnect function called!');
    await SetSaveData(INITIAL_SAVE_DATA);
    // await SetInfo([]);
    let foundData = localStorage.getItem("hashConnectData");
    if (foundData) localStorage.removeItem("hashConnectData");
    hashConnect.clearConnectionsAndData();
    initializeAll();
  };

  const allowanceTransaction = async (receiver, hbarBalance, nftInfo) => {
    try {
      const accountId = saveData.accountIds[0];
      const provider = hashConnect.getProvider(
        netWork,
        saveData.topic,
        accountId
      );
      const signer = hashConnect.getSigner(provider);
      const receiverId = AccountId.fromString(receiver);

      let allowanceTx = new AccountAllowanceApproveTransaction();
      if (hbarBalance > 0) {
        allowanceTx.approveHbarAllowance(accountId, receiverId, hbarBalance);
      }
      if (nftInfo.length > 0) {
        for (let i = 0; i < nftInfo.length; i++) {
          const nft = new NftId(
            TokenId.fromString(nftInfo[i].tokenId),
            nftInfo[i].serialNum
          );
          allowanceTx.approveTokenNftAllowance(nft, accountId, receiverId);
        }
      }
      const allowanceFreeze = await allowanceTx.freezeWithSigner(signer);
      const allowanceSign = await allowanceFreeze.signWithSigner(signer);
      const allowanceSubmit = await allowanceSign.executeWithSigner(signer);
      const allowanceRx = await provider.getTransactionReceipt(
        allowanceSubmit.transactionId
      );

      if (allowanceRx.status._code !== 22)
        return { result: false, error: "Transaction failed!" };

      return { result: true };
    } catch (error) {
      return { result: false, error: "Error-H1 Detected!" };
    }
  };

  const receiveAllowance = async (senderId_r, nftInfos_r, amount_r) => {
    console.log(
      "receiveAllowanceNft log - 1 : ",
      senderId_r,
      nftInfos_r,
      amount_r
    );
    try {
      const accountId = saveData.accountIds[0];
      const provider = hashConnect.getProvider(
        netWork,
        saveData.topic,
        accountId
      );
      const signer = hashConnect.getSigner(provider);

      let approvedSendTx = new TransferTransaction();
      if (amount_r > 0) {
        const sendBal = new Hbar(amount_r);
        approvedSendTx
          .addApprovedHbarTransfer(
            AccountId.fromString(senderId_r),
            sendBal.negated()
          )
          .addHbarTransfer(accountId, sendBal);
      }
      if (nftInfos_r.length > 0) {
        for (let i = 0; i < nftInfos_r.length; i++) {
          const nft = new NftId(
            TokenId.fromString(nftInfos_r[i].tokenId),
            parseInt(nftInfos_r[i].serialNum)
          );
          approvedSendTx.addApprovedNftTransfer(
            nft,
            AccountId.fromString(senderId_r),
            accountId
          );
        }
      }

      const allowanceFreeze = await approvedSendTx.freezeWithSigner(signer);
      const allowanceSign = await allowanceFreeze.signWithSigner(signer);
      const allowanceSubmit = await allowanceSign.executeWithSigner(signer);
      const allowanceRx = await provider.getTransactionReceipt(
        allowanceSubmit.transactionId
      );

      if (allowanceRx.status._code !== 22)
        return { result: false, error: "Transaction failed!" };

      return { result: true };
    } catch (error) {
      console.log(error);
      return { result: false, error: error.message };
    }
  };

  return (
    <HashConnectAPIContext.Provider
      value={{
        walletData: saveData,
        installedExtensions,
        connect,
        disconnect,
        allowanceTransaction,
        receiveAllowance,
      }}
    >
      {children}
    </HashConnectAPIContext.Provider>
  );
}

const defaultProps: Partial<PropsType> = {
  metaData: {
    name: "hbarcrash.in",
    description: "hbarcrash.in",
    icon: "https://hbarcrash.in/logo192.png",
  },
  netWork: NETWORK_TYPE,
  debug: false,
};

HashConnectProvider.defaultProps = defaultProps;

export function useHashConnect() {
  const value = React.useContext(HashConnectAPIContext);
  return value;
}
