import React from 'react';
import { useTranslate } from 'react-translate';
import { createContextMenuComponent } from 'react-datasheet-grid';

const ContextMenu = createContextMenuComponent((item) => {
  const t = useTranslate('Elements');

  if (item.type === 'INSERT_ROW_BELLOW') {
    return <>{t('INSERT_ROW_BELLOW')}</>;
  }

  if (item.type === 'DUPLICATE_ROW') {
    return <>{t('DUPLICATE_ROW')}</>;
  }

  if (item.type === 'DELETE_ROW') {
    return <>{t('DELETE_ROW')}</>;
  }
})

export default ContextMenu