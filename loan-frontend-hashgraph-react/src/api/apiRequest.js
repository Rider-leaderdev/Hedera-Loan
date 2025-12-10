import axios from "axios";
import { SERVER_URL } from "../config";

export const requestLoan = async (accountId, nftInfo) => {
  try {
    const requestInfo = await axios.post(`${SERVER_URL}/api/loan`, {
      data: btoa(
        JSON.stringify({
          accountId: accountId,
          nftInfo: nftInfo,
        })
      ),
    });

    return requestInfo.data;
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

export const getLoanedInfo = async (accountId) => {
  try {
    const requestInfo = await axios.get(
      `${SERVER_URL}/api/get_loan?data=${btoa(
        JSON.stringify({
          accountId: accountId,
        })
      )}`
    );

    return requestInfo.data;
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};

export const requestGetBackNfts = async (accountId, nftInfo) => {
  try {
    const requestInfo = await axios.post(`${SERVER_URL}/api/get_back`, {
      data: btoa(
        JSON.stringify({
          accountId: accountId,
          nftInfo: nftInfo,
        })
      ),
    });

    return requestInfo.data;
  } catch (error) {
    return {
      result: false,
      error: error.message,
    };
  }
};
