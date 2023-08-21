export default (file) => {
  const fileName = file && (file.path || file.name);
  const withOutP7sExtension = fileName && fileName.replace(/\.p7s/gi, '');

  const fileNameParts = withOutP7sExtension.split('.');
  // eslint-disable-next-line no-useless-escape
  const extension = fileNameParts
    .pop()
    .replace(/ \(\d+\)/gm, '')
    .replace(/\(\d+\)/gm, '');

  return fileNameParts.concat(extension).join('.');
};
