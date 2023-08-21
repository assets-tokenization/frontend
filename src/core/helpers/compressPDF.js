/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import base64ToBlob from 'helpers/base64ToBlob';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  '//unpkg.com/pdfjs-dist@2.9.359/legacy/build/pdf.worker.min.js';

async function compressPDF({ attach, outputQuality }) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    const resultDocs = [];

    fileReader.onload = function () {
      const loadingTask = pdfjsLib.getDocument(fileReader.result);

      loadingTask.promise.then((pdf) => {
        const numPages = pdf.numPages;

        let i = 0;

        while (i <= numPages) {
          pdf
            .getPage(i)
            .then((page) => {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');

              canvas.width = page.view[2];
              canvas.height = page.view[3];

              context.scale(1, -1);
              context.translate(0, -canvas.height);

              const renderContext = {
                canvasContext: context,
                viewport: page.view
              };

              const isLandScape = canvas.width > canvas.height;

              page
                .render(renderContext)
                .promise.then(() => {
                  const dataUrl = canvas.toDataURL('image/jpeg', outputQuality);

                  resultDocs.push(dataUrl);

                  if (resultDocs.length === numPages) {
                    // eslint-disable-next-line new-cap
                    const mergedDoc = new jsPDF({
                      orientation: isLandScape ? 'landscape' : 'portrait'
                    });

                    for (let j = 0; j < resultDocs.length; j++) {
                      let imgWidth = 210;

                      if (isLandScape) {
                        imgWidth = 300;
                      }

                      const imgHeight = (canvas.height * imgWidth) / canvas.width;
                      mergedDoc.addImage(resultDocs[j], 'JPEG', 0, 0, imgWidth, imgHeight);

                      if (j !== resultDocs.length - 1) {
                        mergedDoc.addPage();
                      }
                    }

                    const blob = base64ToBlob(mergedDoc.output('datauristring'));

                    blob.labels = attach?.labels;
                    blob.path = attach?.path;
                    blob.lastModified = attach?.lastModified;
                    blob.lastModifiedDate = attach?.lastModifiedDate;
                    blob.name = attach?.name;
                    blob.origin_type = attach?.type;
                    blob.webkitRelativePath = attach?.webkitRelativePath;

                    resolve(blob);
                  }

                  canvas.remove();
                })
                .catch((error) => {
                  console.error('Merging pdf get error:', error);
                });
            })
            .catch((error) => {
              console.error(`Page ${i + 1} get error:`, error);
            });

          i++;
        }
      });
    };

    fileReader.readAsArrayBuffer(attach);
  });
}

export default compressPDF;
