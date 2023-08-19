import Compressor from 'compressorjs';

async function compressImage({
  attach,
  outputQuality
}) {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-new
    new Compressor(attach, {
      quality: outputQuality,
      success: (result) => {
        return resolve(result);
      },
      error: (err) => {
        console.error(err.message);
      },
    });
  });
}

export default compressImage;
