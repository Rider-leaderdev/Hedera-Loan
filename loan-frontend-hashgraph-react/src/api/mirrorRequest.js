import axios from "axios";

const MIRRORNET_URL = "https://mainnet-public.mirrornode.hedera.com";

const base64ToUtf8 = (base64Str) => {
  // create a buffer
  const buff = Buffer.from(base64Str, "base64");

  // decode buffer as UTF-8
  const utf8Str = buff.toString("utf-8");

  return utf8Str;
};

const convertToIpfsUrl = (ipfsUrl) => {
  return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
};

export const getNftInfo = async (tokenId, serialNumber) => {
  try {
    const nftInfo = await axios.get(
      `${MIRRORNET_URL}/api/v1/tokens/${tokenId}/nfts/${serialNumber}`
    );

    const metadataStr = base64ToUtf8(nftInfo.data.metadata);
    const metadataUrl = convertToIpfsUrl(metadataStr);
    const metadataInfo = await axios.get(metadataUrl);

    return {
      result: true,
      data: {
        accountId: nftInfo.data.account_id,
        name: metadataInfo.data.name,
        description: metadataInfo.data.description,
        imageUrl: convertToIpfsUrl(metadataInfo.data.image),
        attributes: metadataInfo.data.attributes, // {trait_type: info, value: info}
      },
    };
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

export const getOwnedNftsById = async (accountId, tokenId) => {
  try {
    let ownedInfo = [];
    while (1) {
      const nftInfo = await axios.get(
        `${MIRRORNET_URL}/api/v1/accounts/${accountId}/nfts?token.id=${tokenId}`
      );

      let nfts = nftInfo.data.nfts;
      for (let i = 0; i < nfts.length; i++) {
        const metadataStr = base64ToUtf8(nfts[i].metadata);
        const metadataUrl = convertToIpfsUrl(metadataStr);
        const metadataInfo = await axios.get(metadataUrl);

        ownedInfo.push({
          accountId: accountId,
          tokenId: tokenId,
          serialNum: nfts[i].serial_number,
          name: metadataInfo.data.name,
          imageUrl: convertToIpfsUrl(metadataInfo.data.image),
        });
      }

      if (nftInfo.data.links.next === null) break;
    }
    return {
      result: true,
      data: ownedInfo,
    };
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};
