const deepObjectFind = (data, findFunc) => {
  if (typeof data !== 'object') {
    return null;
  }

  if (findFunc(data)) {
    return data;
  }

  return Object.values(data)
    .map((prop) => deepObjectFind(prop, findFunc))
    .filter(Boolean)
    .shift();
};

export const deepObjectFindCallback = (data, findFunc, callback) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  if (findFunc(data)) {
    callback(data);
  }

  return Object.values(data).forEach((prop) => deepObjectFindCallback(prop, findFunc, callback));
};

export const deepObjectFindAll = (data, findFunc) => {
  const result = [];
  deepObjectFindCallback(data, findFunc, result.push.bind(result));
  return result;
};

export default deepObjectFind;
