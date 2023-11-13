import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { isDesktop } from 'react-device-detect';
import * as api from 'services/api';
import store from 'store';
import platformAbi from 'variables/platformAbi';
import { defaultPlatform, ganacheApiUrl as API_URL } from 'config';

const web3 = createAlchemyWeb3(API_URL);
const gas = 1000000;

export const getPlatforms = () => (dispatch) =>
  api.get('p2p_platforms', 'contract/GET_PLATFORMS', dispatch);

export const getObjectInfoByContract = (contract) => (dispatch) =>
  api.get(`object_tokenized?contract=${contract}`, 'contract/GET_OBJECT_BY_CONTRACT', dispatch);
  
export const deployContract = (body) => (dispatch) =>
  api.post('deploycontract', body, 'contract/DEPLOY_CONTRACT', dispatch);

export const getAbi = () => (dispatch) => api.get('abi', 'contract/GET_ABI', dispatch);

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

const getContract = async (contractAddress, abi, method) => {
  const address = store.getState().profile.userInfo.wallet;

  if (!web3.utils.isAddress(address)) {
    throw new Error('The provided wallet address is invalid');
  }

  const contract = new web3.eth.Contract(abi, contractAddress);

  if (!contract.methods[method]) {
    throw new Error('Method does not exist in contract ABI');
  }

  return {
    contract,
    address
  };
};

export const allowP2PPlatform = async ({ contract: contractAddress, abi, platform }) => {
  if (!contractAddress || !abi || !platform) {
    throw new Error('Invalid input parameters');
  }

  const { contract, address } = await getContract(contractAddress, abi, 'AllowP2Pplatform');

  const result = await contract.methods.AllowP2Pplatform(platform).send({
    from: address,
    gas
  });

  return result;
};

export const denyP2PPlatform = async ({ contract: contractAddress, abi }) => {
  if (!contractAddress || !abi) {
    throw new Error('Invalid input parameters');
  }

  const { contract, address } = await getContract(contractAddress, abi, 'DenyP2Pplatform');

  const result = await contract.methods.DenyP2Pplatform().send({
    from: address,
    gas
  });

  return result;
};

window.web3 = web3;

export const createOffer = async ({
  price,
  contract: contractAddress,
  walletToSell
}) => {
  if (!price || !contractAddress || !walletToSell) {
    throw new Error('Invalid input parameters');
  }

  const priceToWei = web3.utils.toWei(price, 'ether');

  const { contract, address } = await getContract(defaultPlatform, platformAbi, 'setDeal');

  const result = await contract.methods.setDeal(priceToWei, contractAddress, walletToSell).send({
    from: address,
    gas
  });

  return result;
};

export const getOffers = async () => {
  const { contract, address } = await getContract(defaultPlatform, platformAbi, 'myDeals');

  const result = await contract.methods.myDeals().call({
    from: address
  });

  return result;
};

export const getDeal = async (dealAddress) => {
  if (!dealAddress) {
    throw new Error('Invalid input parameters');
  }

  const { contract, address } = await getContract(defaultPlatform, platformAbi, 'getDeal');

  const result = await contract.methods.getDeal(dealAddress).call({
    from: address
  });

  return result;
}

export const acceptDeal = async (dealAddress, price) => {
  if (!dealAddress) {
    throw new Error('Invalid input parameters');
  }

  const { contract, address } = await getContract(defaultPlatform, platformAbi, 'acceptDeal');

  const result = await contract.methods.acceptDeal(dealAddress).send({
    from: address,
    value: Number(price),
    gas
  });

  return result;
};
