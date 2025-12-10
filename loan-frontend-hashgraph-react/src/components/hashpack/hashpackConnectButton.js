import React, { useState } from "react";
import { Button, Modal } from "@mui/material";
import { toast } from "react-toastify";
import HashPackConnectModal from "./HashPackConnectModal";
import { useHashConnect } from "../../api/HashConnectAPIProvider.tsx";

const HashPackConnectButton = () => {
  const [walletConnectModalViewFlag, setWalletConnectModalViewFlag] =
    useState(false);

  const { walletData, installedExtensions, connect, disconnect } =
    useHashConnect();
  const { accountIds } = walletData;

  const onClickWalletConnectModalClose = () => {
    setWalletConnectModalViewFlag(false);
  };

  const onClickOpenConnectModal = () => {
    if (installedExtensions) {
      setWalletConnectModalViewFlag(true);
      // console.log("onClickOpenConnectModal log - 1 : ", walletData);
    } else {
      toast.warning("Please install HashPack wallet!");
    }
  };

  const onClickDisconnectHashPack = () => {
    if (installedExtensions) {
      disconnect();
      setWalletConnectModalViewFlag(false);
    }
  };

  const onClickCopyPairingStr = () => {
    navigator.clipboard.writeText(walletData.pairingString);
  };

  const onClickConnectHashPack = () => {
    // console.log("onClickConnectHashPack log - 1");
    if (installedExtensions) {
      connect();
      setWalletConnectModalViewFlag(false);
    } else {
      alert(
        "Please install hashconnect wallet extension first. from chrome web store."
      );
    }
  };

  return (
    <>
      <Button onClick={() => onClickOpenConnectModal()}>
        {accountIds?.length > 0 ? accountIds[0] : "Connect Wallet"}
      </Button>
      <Modal
        open={walletConnectModalViewFlag}
        onClose={() => onClickWalletConnectModalClose()}
        centered={true}
      >
        <HashPackConnectModal
          pairingString={walletData.pairingString}
          connectedAccount={accountIds}
          onClickConnectHashPack={onClickConnectHashPack}
          onClickCopyPairingStr={onClickCopyPairingStr}
          onClickDisconnectHashPack={onClickDisconnectHashPack}
        />
      </Modal>
    </>
  );
};

export default HashPackConnectButton;
