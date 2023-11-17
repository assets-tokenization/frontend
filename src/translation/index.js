import qs from 'qs';
import enGB from './en';
// import ukUA from './ua';

const DEFAULT_TRANSLATION = 'uk-UA';

export const getQueryLangParam = () => {
  const searchString = window.location.search;

  if (!searchString) return null;

  const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  const langExists = (Object.keys(params || {}) || []).includes('lang');

  if (!langExists) return null;

  if (langExists) {
    return params.lang;
  }

  return null;
};

const translations = {
    'uk-UA': enGB,
    'eng': enGB
};

const { language } = navigator;

const chosenLanguage = getQueryLangParam() || language;

const chosenTranslation = translations[chosenLanguage] || translations[DEFAULT_TRANSLATION];

export default chosenTranslation;
