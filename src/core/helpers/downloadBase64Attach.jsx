export default function ({ fileName, description, scanDocumentName }, blob) {
  const { document, URL } = window;

  let url = blob;

  if ((typeof url === 'string' && !url.indexOf('data:') === 0) || blob instanceof Blob) {
    url = URL.createObjectURL(blob);
  }

  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fileName || description || scanDocumentName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  //document.body.removeChild(element);
}
