import React from 'react';
import { PropTypes } from 'prop-types';

const RenderFields = ({ t, classes, userInfo, value, fields }) => {
  const renderFieldsSeparateByComma = (fields) => {
    return fields.map((field, index) => {
      if (!field) {
        return null;
      }

      if (index === fields.length - 1) {
        return field;
      }
      return `${field}, `;
    });
  };

  return (
    <>
      <div className={classes.contentWrapper}>
        <div className={classes.content}>
          <div className={classes.contentHeadline}>{userInfo?.info?.name}</div>

          <div className={classes.contentText}>{t('ipn')}</div>
          <div className={classes.contentTextValue}>{userInfo?.info?.ipn}</div>

          {fields?.includes('unzr') && (
            <>
              <div className={classes.contentText}>{t('unzr')}</div>
              <div className={classes.contentTextValue}>{value?.unzr?.value}</div>
            </>
          )}

          <div className={classes.flexWrapper}>
            <div>
              {fields?.includes('birthday') && (
                <>
                  <div className={classes.contentText}>{t('birthday')}</div>
                  <div className={classes.contentTextValue}>
                    {value?.birthday?.date}
                    {t('byYear')}
                  </div>
                </>
              )}
            </div>
            <div>
              {fields?.includes('gender') && (
                <>
                  <div className={classes.contentText}>{t('gender')}</div>
                  <div className={classes.contentTextValue}>{t(value?.gender?.value)}</div>
                </>
              )}
            </div>
          </div>

          {fields?.includes('passport') && (
            <>
              <div className={classes.contentText}>{t('passportInfo')}</div>
              <div className={classes.contentTextValue}>
                {value?.passport?.series}
                {value?.passport?.number}
              </div>

              <div className={classes.contentText}>{t('issuedBy')}</div>
              <div className={classes.contentTextValue}>
                {value?.passport?.issuedBy}
                {t('byYear')}
              </div>

              <div className={classes.flexWrapper}>
                <div>
                  <div className={classes.contentText}>{t('issuedAt')}</div>
                  <div className={classes.contentTextValue}>
                    {value?.passport?.issuedAt}
                    {t('byYear')}
                  </div>
                </div>
                <div>
                  <div className={classes.contentText}>{t('expireDate')}</div>
                  <div className={classes.contentTextValue}>
                    {value?.passport?.expireDate}
                    {t('byYear')}
                  </div>
                </div>
              </div>
            </>
          )}

          {fields?.includes('address') && (
            <>
              <div className={classes.contentText}>{t('address')}</div>
              <div className={classes.contentTextValue}>
                {renderFieldsSeparateByComma([
                  value?.address?.index?.value,
                  value?.address?.region?.stringified,
                  value?.address?.district?.stringified,
                  value?.address?.city?.stringified,
                  value?.address?.street?.stringified,
                  value?.address?.building?.value,
                  value?.address?.apartment?.value
                    ? t('apartment', {
                        apartment: value?.address?.apartment?.value
                      })
                    : null
                ])}
              </div>
            </>
          )}

          {fields?.includes('phone') && (
            <>
              <div className={classes.contentText}>{t('phone')}</div>
              <div className={classes.contentTextValue}>{value?.phone?.value}</div>
            </>
          )}

          {fields?.includes('email') && (
            <>
              <div className={classes.contentText}>{t('email')}</div>
              <div className={classes.contentTextValue}>{value?.email?.value}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

RenderFields.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired
};

export default RenderFields;
