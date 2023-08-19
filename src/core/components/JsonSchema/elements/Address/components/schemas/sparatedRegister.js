const calcTriggers = ({
    stepName
}) => ([
    {
        'source': `${stepName}.ATU`,
        'target': `${stepName}.street`,
        'calculate': '() => undefined'
    },
    {
        'source': `${stepName}.region`,
        'target': `${stepName}.district`,
        'calculate': '() => undefined'
    },
    {
        'source': `${stepName}.region`,
        'target': `${stepName}.city`,
        'calculate': '() => undefined'
    },
    {
        'source': `${stepName}.region`,
        'target': `${stepName}.street`,
        'calculate': '() => undefined'
    },
    {
        'source': `${stepName}.district`,
        'target': `${stepName}.city`,
        'calculate': '() => undefined'
    },
    {
        'source': `${stepName}.district`,
        'target': `${stepName}.city`,
        'calculate': '() => undefined'
    },
    {
        'source': `${stepName}.building.index`,
        'target': `${stepName}.apt.index`,
        'calculate': '(val) => val'
    },
    {
        'source': `${stepName}.apt.index`,
        'target': `${stepName}.building.index`,
        'calculate': '(val) => val'
    }
]);

const defaultSchema = ({
    stepName,
    withNamedObjects,
    recordsTree
}) => {
    let atu = {};
    let streetControl = {};

    switch (recordsTree) {
        case false: {
            atu = {
                'region': {
                    'type': 'object',
                    'control': 'register',
                    'keyId': 408,
                    'description': 'Область або м. Київ',
                    'checkRequired': '() => true',
                    'filtersFromSchema': true,
                    'indexedSort': {
                        'sort[data.name]': 'asc'
                    }
                },
                'district': {
                    'type': 'object',
                    'control': 'register',
                    'keyId': 410,
                    'description': 'Населений пункт або район',
                    'checkRequired': '() => true',
                    'filtersFromSchema': true,
                    'hidden': `(document) => { const region = document.${stepName}.region; return !(region && region.atuId) }`,
                    'listenedValuesForRequest': [
                        `${stepName}.region`
                    ],
                    'indexedSort': {
                        'sort[data.name]': 'asc'
                    },
                    'search': `(data) => { return data.${stepName}.region.atuId  || 'unknown'; }`
                },
                'city': {
                    'control': 'register',
                    'keyId': 411,
                    'description': 'Село, селище, район міста',
                    'checkRequired': '() => true',
                    'markWhenEmpty': true,
                    'filtersFromSchema': true,
                    'hidden': `(step, value) => value === false || (!step?.${stepName}?.region && !step?.${stepName}?.district)`,
                    'listenedValuesForRequest': [
                        `${stepName}.region`,
                        `${stepName}.district`
                    ],
                    'indexedSort': {
                        'sort[data.type]': 'asc'
                    },
                    'search': `(data) => { return data.${stepName} && ((data.${stepName}.district && data.${stepName}.district.atuId) || (data.${stepName}.region && data.${stepName}.region.atuId)) || 'unknown'; }`
                },
            };
            break;
        }
        case true: {
            atu = {
                'ATU': {
                    'type': 'object',
                    'control': 'register',
                    'cleanWhenHidden': true,
                    'allVisibleRequired': true,
                    'properties': {
                        'region': {
                            'keyId': 408,
                            'description': 'Область або м. Київ'
                        },
                        'district': {
                            'keyId': 410,
                            'description': 'Місто або район'
                        },
                        'city': {
                            'keyId': 411,
                            'description': 'Село, селище'
                        }
                    },
                    'required': []
                }
            };
            break;
        }
        default: {
            break;
        }
    }

    const recordsTreeStreetSearch = `(data) => {
        const regionId = data?.${stepName}?.ATU?.region?.atuId;
        const districtId = data?.${stepName}?.ATU?.district?.atuId;
        const cityId = data?.${stepName}?.ATU?.city?.atuId;
        return [regionId, districtId, cityId].filter(Boolean)  || 'unknown';
    }`;

    const streetSearch = `(data) => {
        const regionId = data?.${stepName}?.region?.atuId;
        const districtId = data?.${stepName}?.district?.atuId;
        const cityId = data?.${stepName}?.city?.atuId;
        return [regionId, districtId, cityId].filter(Boolean)  || 'unknown';
    }`;

    const recordsTreeListened = [
        `${stepName}.ATU.region`,
        `${stepName}.ATU.district`,
        `${stepName}.ATU.city`
    ];

    const listenedValuesForRequest = [
        `${stepName}.region`,
        `${stepName}.district`,
        `${stepName}.city`
    ];

    switch (withNamedObjects) {
        case null: {
            streetControl = {
                'control': 'form.group',
                'blockDisplay': false,
                'outlined': false,
                'properties': {
                    'streetType': {
                        'type': 'string',
                        'width': '60%',
                        'description': 'Тип вулиці',
                        'options': [
                            {
                                'id': 'вулиця',
                                'name': 'вулиця'
                            },
                            {
                                'id': 'провулок',
                                'name': 'провулок'
                            },
                            {
                                'id': 'площа',
                                'name': 'площа'
                            },
                            {
                                'id': 'проспект',
                                'name': 'проспект'
                            },
                            {
                                'id': 'бульвар',
                                'name': 'бульвар'
                            },
                            {
                                'id': 'тупік',
                                'name': 'тупік'
                            },
                            {
                                'id': 'узвіз',
                                'name': 'узвіз'
                            },
                            {
                                'id': 'набережна',
                                'name': 'набережна'
                            },
                            {
                                'id': 'шосе',
                                'name': 'шосе'
                            },
                            {
                                'id': 'мікрорайон',
                                'name': 'мікрорайон'
                            },
                            {
                                'id': 'житловий комплекс',
                                'name': 'житловий комплекс'
                            },
                            {
                                'id': 'жилий масив',
                                'name': 'жилий масив'
                            },
                            {
                                'id': 'проїзд',
                                'name': 'проїзд'
                            },
                            {
                                'id': 'майдан',
                                'name': 'майдан'
                            },
                            {
                                'id': 'квартал',
                                'name': 'квартал'
                            },
                            {
                                'id': "в'їзд",
                                'name': "в'їзд"
                            },
                            {
                                'id': 'інше',
                                'name': 'інше'
                            }
                        ]
                    },
                    'streetName': {
                        'type': 'string',
                        'description': 'Назва вулиці',
                        'checkValid': [
                            {
                                'isValid': "(propertyValue, stepValue, documentValue) => /^[-'‘’\" /А-ЩЬЮЯҐЄІЇа-щьюяґєії0-9]+$/.test(propertyValue)",
                                'errorText': 'Може містити тільки українські літери, цифри, дефіс, пробіл та лапки'
                            },
                            {
                                'isValid': "(propertyValue, stepValue, documentValue) => propertyValue && propertyValue !== '-' && propertyValue !== '–' && propertyValue !== '—' && propertyValue !== '\\'' &&  propertyValue !== ' '",
                                'errorText': 'Має містити букви'
                            },
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && !/[-]{2,}/.test(propertyValue) && !/[ ]{2,}/.test(propertyValue) ',
                                'errorText': 'Не може містити більше одного дефісу чи пробілу підряд'
                            }
                        ],
                        'checkRequired': '() => true'
                    }
                },
                'required': [
                    'streetType',
                    'streetName'
                ]
            };
            break;
        }
        case true: {
            streetControl = {
                'type': 'object',
                'control': 'register',
                'keyId': 450,
                'description': 'Назва вулиці',
                'filtersType': 'or',
                'autocomplete': true,
                'autocompleteField': 'name',
                'cleanWhenHidden': true,
                'markWhenEmpty': true,
                'filtersFromSchema': true,
                'checkRequired': '() => true',
                'listenedValuesForRequest': recordsTree ? recordsTreeListened : listenedValuesForRequest,
                'indexedSort': {
                    'sort[data.name]': 'asc'
                },
                'search': recordsTree ? recordsTreeStreetSearch : streetSearch
            };
            break;
        }
        case false: {
            streetControl = {
                'type': 'object',
                'control': 'register',
                'keyId': 412,
                'description': 'Назва вулиці',
                'filtersType': 'or',
                'autocomplete': true,
                'autocompleteField': 'name',
                'cleanWhenHidden': true,
                'markWhenEmpty': true,
                'filtersFromSchema': true,
                'hidden': '() => false',
                'checkRequired': '() => true',
                'listenedValuesForRequest': recordsTree ? recordsTreeListened : listenedValuesForRequest,
                'indexedSort': {
                    'sort[data.name]': 'asc'
                },
                'search': recordsTree ? recordsTreeStreetSearch : streetSearch
            };
            break;
        }
        default: {
            break;
        }
    }

    return {
        'type': 'object',
        'properties': {
            ...atu,
            'street': streetControl,
            'building': {
                'control': 'form.group',
                'blockDisplay': false,
                'outlined': false,
                'properties': {
                    'building': {
                        'type': 'string',
                        'checkRequired': '() => true',
                        'description': 'Будинок',
                        'width': '50%',
                        'checkValid': [
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && propertyValue.length <= 10',
                                'errorText': 'Може містити не більше, ніж 10 символів'
                            },
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && !/[-]{2,}/.test(propertyValue) && !/[ ]{2,}/.test(propertyValue) ',
                                'errorText': 'Не може містити більше одного дефісу чи пробілу підряд'
                            }
                        ]
                    },
                    'korpus': {
                        'type': 'string',
                        'description': 'Корпус',
                        'width': '50%',
                        'cleanWhenHidden': true,
                        'checkValid': [
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && propertyValue.length <= 10',
                                'errorText': 'Може містити не більше, ніж 10 символів'
                            },
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && !/[-]{2,}/.test(propertyValue) && !/[ ]{2,}/.test(propertyValue) ',
                                'errorText': 'Не може містити більше одного дефісу чи пробілу підряд'
                            }
                        ],
                        'checkHidden': "(propertyData, pageObject, allStepsData) => (pageObject && pageObject.isPrivateHouse && pageObject.isPrivateHouse[0] === 'приватний будинок')"
                    },
                    'index': {
                        'type': 'string',
                        'description': 'Індекс',
                        'checkRequired': "(propertyData, pageObject, allStepsData) => (pageObject && pageObject.isPrivateHouse && pageObject.isPrivateHouse[0] === 'приватний будинок')",
                        'sample': "<div style='display: inline-flex; background: #FFF4D7; padding: 10px 15px 10px 15px'>Дізнатися свій індекс можна&nbsp;<a href='https://ukrposhta.ua/dovidka/indeksi/' target='_blank' style='color:#000000;'>тут</a></div></div>",
                        'width': '50%',
                        'checkValid': [
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && propertyValue.length === 5',
                                'errorText': 'Має містити 5 цифр'
                            }
                        ],
                        'mask': '99999',
                        'checkHidden': "(propertyData, pageObject, allStepsData) => !(pageObject && pageObject.isPrivateHouse && pageObject.isPrivateHouse[0] === 'приватний будинок')"
                    }
                },
                'required': []
            },
            'isPrivateHouse': {
                'type': 'array',
                'control': 'checkbox.group',
                'width': '50%',
                'secondary': true,
                'withIndex': false,
                'items': [
                    {
                        'id': 'приватний будинок',
                        'title': 'приватний будинок'
                    }
                ],
                'rowDirection': true
            },
            'apt': {
                'control': 'form.group',
                'blockDisplay': false,
                'outlined': false,
                'properties': {
                    'apt': {
                        'type': 'string',
                        'description': 'Номер квартири',
                        'cleanWhenHidden': true,
                        'checkValid': [
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && propertyValue.length <= 10',
                                'errorText': 'Може містити не більше, ніж 10 символів'
                            },
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && !/[-]{2,}/.test(propertyValue) && !/[ ]{2,}/.test(propertyValue) ',
                                'errorText': 'Не може містити більше одного дефісу чи пробілу підряд'
                            }
                        ],
                        'checkHidden': "(propertyData, pageObject, allStepsData) => (pageObject && pageObject.isPrivateHouse && pageObject.isPrivateHouse[0] === 'приватний будинок')",
                        'checkRequired': "(propertyData, pageObject, allStepsData) => !(pageObject && pageObject.isPrivateHouse && pageObject.isPrivateHouse[0] === 'приватний будинок')"
                    },
                    'index': {
                        'type': 'string',
                        'description': 'Індекс',
                        'checkRequired': "(value, pageObject) => !pageObject?.isPrivateHouse || pageObject?.isPrivateHouse[0] !== 'приватний будинок'",
                        'sample': "<div style='display: inline-flex; background: #FFF4D7; padding: 10px 15px 10px 15px'>Дізнатися свій індекс можна&nbsp;<a href='https://ukrposhta.ua/dovidka/indeksi/' target='_blank' style='color:#000000;'>тут</a></div></div>",
                        'checkValid': [
                            {
                                'isValid': '(propertyValue, stepValue, documentValue) => propertyValue && propertyValue.length === 5',
                                'errorText': 'Має містити 5 цифр'
                            }
                        ],
                        'mask': '99999',
                        'checkHidden': "(propertyData, pageObject, allStepsData) => (pageObject && pageObject.isPrivateHouse && pageObject.isPrivateHouse[0] === 'приватний будинок')"
                    }
                },
                'required': []
            }
        }
    }
};

export { calcTriggers, defaultSchema };
