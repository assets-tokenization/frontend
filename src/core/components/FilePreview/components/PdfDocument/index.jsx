import config from 'config';

import OnePagePdfPreview from 'components/FilePreview/components/PdfDocument/OnePagePdfPreview';
import DefaultPdfPreview from 'components/FilePreview/components/PdfDocument/DefaultPdfPreview';

export default config?.variables?.onePagePdfPreview ? OnePagePdfPreview : DefaultPdfPreview;
