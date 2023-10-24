import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import * as api from 'services/api';
import {
  ganacheApiUrl as API_URL,
  ganacheApiKey as PRIVATE_KEY,
  platformToken as PLATFORM_TOKEN,
} from 'config';
import store from 'store';

const redirectUserToMetaMask = () => {
  window.open(`dapp://${window.location.host}/?&lang=en&openWallet=true`);
};

export const deployContract = (body) => (dispatch) =>
  api.post('deploycontract', body, 'contract/DEPLOY_CONTRACT', dispatch);

export const getAbi = () => (dispatch) =>
  api.get('abi', 'contract/GET_ABI', dispatch);

export const addToP2PPlatformAction = async ({
  CONTRACT_ADDRESS,
  ABI
}) => {
  const web3 = createAlchemyWeb3(API_URL);

  const address = store.getState().profile.userInfo.wallet;

  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  const result = await contract.methods.AddP2pPplatform(PLATFORM_TOKEN).send({
    from: address,
    gas: 0
  });

  if (!window.ethereum) {
    redirectUserToMetaMask();
  }

  return result;
};
