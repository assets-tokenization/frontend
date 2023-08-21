import ukUA from 'translation/uk-UA';
import enGB from 'translation/en-GB';
import plugins from 'plugins';
import { getQueryLangParam } from 'actions/auth';

const DEFAULT_TRANSLATION = 'uk-UA';

const translations = {
  'uk-UA': ukUA,
  eng: enGB
};

const { language } = navigator;

const chosenLanguage = getQueryLangParam() || language;

const chosenTranslation = translations[chosenLanguage] || translations[DEFAULT_TRANSLATION];

export default {
  ...[]
    .concat(plugins)
    .filter(
      (plugin) =>
        plugin.translations &&
        (plugin.translations[language] || plugin.translations[DEFAULT_TRANSLATION])
    )
    .map((plugin) => plugin.translations[language] || plugin.translations[DEFAULT_TRANSLATION])
    .reduce((acc, tr) => ({ ...acc, ...tr }), {}),
  ...chosenTranslation
};
