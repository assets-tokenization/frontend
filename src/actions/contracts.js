import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import * as api from 'services/api';
import { ganacheApiUrl as API_URL } from 'config';
import store from 'store';
import { isDesktop } from 'react-device-detect';

export const getPlatforms = () => (dispatch) =>
  api.get('p2p_platforms', 'contract/GET_PLATFORMS', dispatch);

export const deployContract = (body) => (dispatch) =>
  api.post('deploycontract', body, 'contract/DEPLOY_CONTRACT', dispatch);

export const getAbi = () => (dispatch) =>
  api.get('abi', 'contract/GET_ABI', dispatch);

export const saveP2PSelectedState = (id) => (dispatch) =>
  api.post(`p2p_selected/${id}`, {}, 'contract/SAVE_P2P_STATE', dispatch);

export const saveContractData = (data) => (dispatch) =>
  dispatch({
    type: 'contract/SAVE_CONTRACT_DATA',
    payload: data
  });

export const checkMetaMaskState = async () => {
  if (typeof window.ethereum === 'undefined') {
    if (isDesktop) {
      window.open('https://metamask.io/download.html', '_blank');
    }
    return 'noMetaMask';
  }

  const isAuthorized = (await window.ethereum.request({ method: 'eth_accounts' })).length > 0;

  if (!isAuthorized) {
    const accountInfo = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (accountInfo.length > 0) {
      return 'connected';
    }

    return 'noAccount';
  }

  return 'connected';
};

const web3 = createAlchemyWeb3(API_URL);

export const tokenizeAction = async ({
  contract: contractAddress,
  abi,
  platform
}) => {
  if (!contractAddress || !abi || !platform) {
    throw new Error('Invalid input parameters');
  }

  const address = store.getState().profile.userInfo.wallet;

  if (!web3.utils.isAddress(address)) {
    throw new Error('The provided wallet address is invalid');
  }

  const contract = new web3.eth.Contract(abi, contractAddress);

  if (!contract.methods.AllowP2Pplatform) {
    throw new Error('Method does not exist in contract ABI');
  }
  
  const result = await contract.methods.AllowP2Pplatform(platform).send({
    from: address
  });

  return result;
};

export const denyP2Platform = async ({
  contract: contractAddress,
  abi
}) => {
  if (!contractAddress || !abi) {
    throw new Error('Invalid input parameters');
  }

  const address = store.getState().profile.userInfo.wallet;

  if (!web3.utils.isAddress(address)) {
    throw new Error('The provided wallet address is invalid');
  }

  const contract = new web3.eth.Contract(abi, contractAddress);

  if (!contract.methods.DenyP2Pplatform) {
    throw new Error('Method does not exist in contract ABI');
  }
  
  const result = await contract.methods.DenyP2Pplatform().send({
    from: address
  });

  return result;
};
