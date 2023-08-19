import React from 'react';
import { useTranslate } from 'react-translate';
import { SchemaForm } from 'components/JsonSchema';
import cleenDeep from 'clean-deep'

const RenderAddressFormat = ({
  name,
  fields,
  errors,
  value,
  handleUpdateField,
  path,
  actions
}) => {
  const [actualAtu, setActualAtu] = React.useState({});

  const t = useTranslate('VerifiedUserInfo');

  const fullPath = path.concat(name).join('.');

  const handleChangeAtu = async (...args) => {
    const changedValue = args.pop().data;

    const { region, district, city } = changedValue;

    const mappedValue = cleenDeep({
      ...value[name],
      region: region || null,
      district: district || null,
      city: city || null
    });
    
    await handleUpdateField(name, mappedValue);

    setActualAtu(mappedValue);
  };

  const handleChangeAddress = async (...args) => {
    const changedValue = args.pop();
    const valueName = args.pop();

    const path = `${name}.${valueName}`;

    switch (valueName) {
      case 'street':
        handleUpdateField(path, changedValue?.data);
        break;
      case 'isPrivateHouse':
        handleUpdateField(path, !!changedValue?.data?.length);
        break;
      case 'building':
        handleUpdateField(path, { value: changedValue });
        break;
      case 'apartment':
        handleUpdateField(path, { value: changedValue });
        break;
      case 'index':
        handleUpdateField(path, { value: changedValue });
        break;
      case 'korp':
        handleUpdateField(path, { value: changedValue });
        break;
      default:
        break;
    }
  };

  const rootDocument = {
    data: {
      test: {
        dmsUserData: {
          address: { ...actualAtu }
        }
      }
    }
  };

  const originDocument = {
    data: {
      test: {
        dmsUserData: {
          address: value[name]
        }
      }
    }
  };

  const isPrivateHouse = value?.[name]?.isPrivateHouse;

  return (
    <>
      {fields?.includes(name) ? (
        <>
          <SchemaForm
            schema={{
              type: 'object',
              properties: {
                address: {
                  type: 'object',
                  control: 'register',
                  allVisibleRequired: true,
                  properties: {
                    region: {
                      keyId: 408,
                      description: t('RegionRegister')
                    },
                    district: {
                      keyId: 410,
                      description: t('DistrictRegister')
                    },
                    city: {
                      keyId: 411,
                      description: t('CityRegister')
                    }
                  }
                }
              }
            }}
            errors={errors}
            value={{
              address: {
                region: value?.[name]?.region || null,
                district: value?.[name]?.district || null,
                city: value?.[name]?.city || null
              }
            }}
            onChange={handleChangeAtu}
          />
          <SchemaForm
            actions={actions}
            rootDocument={rootDocument}
            originDocument={originDocument}
            schema={{
              type: 'object',
              properties: {
                street: {
                  type: 'object',
                  control: 'register',
                  keyId: 450,
                  description: t('StreetName'),
                  filtersType: 'or',
                  autocomplete: true,
                  autocompleteField: 'name',
                  cleanWhenHidden: true,
                  markWhenEmpty: true,
                  filtersFromSchema: true,
                  notRequiredLabel: '',
                  listenedValuesForRequest: [
                    `${fullPath}.region`,
                    `${fullPath}.district`,
                    `${fullPath}.city`
                  ],
                  indexedSort: {
                    'sort[data.name]': 'asc'
                  },
                  search: `(data) => {
                    const regionId = data?.${fullPath}?.region?.atuId;
                    const districtId = data?.${fullPath}?.district?.atuId;
                    const cityId = data?.${fullPath}?.city?.atuId;
                    return [regionId, districtId, cityId].filter(Boolean)  || 'unknown';
                  }`
                },
                building: {
                  control: 'form.group',
                  blockDisplay: false,
                  outlined: false,
                  properties: {
                    building: {
                      type: 'string',
                      description: t('building'),
                      notRequiredLabel: '',
                      maxLength: 20,
                      maxWidth: '50%'
                    },
                    korp: {
                      type: 'string',
                      description: t('korp'),
                      maxLength: 20,
                      checkHidden: isPrivateHouse
                    }
                  }
                },
                isPrivateHouse: {
                  type: 'array',
                  control: 'checkbox.group',
                  secondary: true,
                  withIndex: false,
                  hiddenParent: true,
                  items: [
                    {
                      id: 'приватний будинок',
                      title: t('isPrivateHouse')
                    }
                  ],
                  rowDirection: true
                },
                apartment: {
                  control: 'form.group',
                  blockDisplay: false,
                  outlined: false,
                  properties: {
                    apartment: {
                      type: 'string',
                      description: t('apt'),
                      maxLength: 10,
                      notRequiredLabel: '',
                      checkHidden: isPrivateHouse
                    },
                    index: {
                      type: 'string',
                      description: t('index'),
                      notRequiredLabel: '',
                      sample: `<div style='display: inline-flex; background: #FFF4D7; padding: 10px 15px 10px 15px'>${t(
                        'indexSample'
                      )}&nbsp;<a href='https://ukrposhta.ua/dovidka/indeksi/' target='_blank' style='color:#000000;'>тут</a></div></div>`,
                      mask: '99999',
                      pattern: '[0-9]{5}',
                      maxWidth: '50%'
                    }
                  }
                }
              }
            }}
            errors={errors}
            value={{
              address: {
                region: value?.[name]?.region || {},
                district: value?.[name]?.district || {},
                city: value?.[name]?.city || {},
              },
              street: value?.[name]?.street || {},
              building: {
                building: value?.[name]?.building?.value || '',
                korp: value?.[name]?.korp?.value || '',
              },
              isPrivateHouse: value?.[name]?.isPrivateHouse ? ['приватний будинок'] : [],
              apartment: {
                apartment: value?.[name]?.apartment?.value || '',
                index: value?.[name]?.index?.value || '',
              }
            }}
            onChange={handleChangeAddress}
          />
        </>
      ) : null}
    </>
  );
};

export default RenderAddressFormat;
