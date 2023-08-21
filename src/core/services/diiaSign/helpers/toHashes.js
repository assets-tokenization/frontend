import edsService from 'services/eds';

export default async (dataToSign) => {
  if (dataToSign.isHash) {
    return {
      fileHash: dataToSign.data,
      fileName: dataToSign.name
    };
  }

  const signer = edsService.getFileKeySigner();
  const hash = await signer.execute('HashData', dataToSign.data, true);

  return {
    fileHash: hash,
    fileName: dataToSign.name
  };
};
