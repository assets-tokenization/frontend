import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import * as api from 'services/api';
import { ganacheApiUrl as API_URL } from 'config';
import store from 'store';

export const getPlatforms = () => (dispatch) =>
  api.get('p2p_platforms', 'contract/GET_PLATFORMS', dispatch);

export const deployContract = (body) => (dispatch) =>
  api.post('deploycontract', body, 'contract/DEPLOY_CONTRACT', dispatch);

export const getAbi = () => (dispatch) =>
  api.get('abi', 'contract/GET_ABI', dispatch);

export const saveP2PSelectedState = (id) => (dispatch) =>
  api.post(`p2p_selected/${id}`, {}, 'contract/SAVE_P2P_STATE', dispatch);

export const tokenizeAction = async ({
  contract: contractAddress,
  abi,
  platform
}) => {
  const web3 = createAlchemyWeb3(API_URL);

  const address = store.getState().profile.userInfo.wallet;

  const contract = new web3.eth.Contract(abi, contractAddress);

  const result = await contract.methods.AllowP2Pplatform(platform).send({
    from: address
  });

  return result;
};

export const denyP2Platform = async ({
  contract: contractAddress,
  abi
}) => {
  const web3 = createAlchemyWeb3(API_URL);

  const address = store.getState().profile.userInfo.wallet;

  const contract = new web3.eth.Contract(abi, contractAddress);

  const result = await contract.methods.DenyP2Pplatform().send({
    from: address
  });

  return result;
};
