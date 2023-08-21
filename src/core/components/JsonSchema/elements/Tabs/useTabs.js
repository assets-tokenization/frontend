/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect, useMemo } from 'react';

import evaluate from 'helpers/evaluate';

export const useTabs = ({
  path,
  value,
  errors,
  onChange,
  properties,
  emptyHidden,
  rootDocument,
  hidden
}) => {
  const tabs = useMemo(
    () =>
      Object.keys(properties).filter((tabName) => {
        const { hidden } = properties[tabName];

        if (!hidden) {
          return true;
        }

        if (typeof hidden === 'string') {
          const result = evaluate(hidden, rootDocument.data, (value || {})[tabName], value || {});

          if (result instanceof Error) {
            result.commit({ type: 'schema form isHidden', rootDocument });
            return false;
          }

          return result !== true;
        }

        return !hidden;
      }),
    [properties, rootDocument, value]
  );

  const errored = useMemo(() => {
    const output = tabs.map((tabName, index) => {
      const tabPath = path.concat(tabName).join('.');
      return errors.some((error) => error.path.indexOf(tabPath) === 0) ? index : false;
    });

    if (output.includes(0)) {
      return output;
    }

    return output.filter(Boolean);
  }, [errors, path, tabs]);

  const activeTab = useMemo(() => tabs.indexOf((value && value.active) || tabs[0]), [tabs, value]);

  const handleChange = useCallback(
    (event, activeTab) =>
      onChange &&
      onChange({
        ...(emptyHidden ? {} : value || {}),
        active: tabs[activeTab]
      }),
    [emptyHidden, onChange, tabs, value]
  );

  useEffect(() => {
    if (!emptyHidden) {
      return;
    }

    const hiddenValues = tabs
      .filter((tabName, index) => (index === activeTab ? false : !!value?.[tabName]))
      .filter(Boolean);

    if (hiddenValues.length) {
      onChange &&
        onChange({
          [tabs[activeTab]]: value[tabs[activeTab]],
          active: tabs[activeTab]
        });
    }
  }, [activeTab, emptyHidden, onChange, tabs, value]);

  useEffect(() => {
    if (properties && (!value || !value.active) && !hidden) {
      onChange.bind(null, 'active')(tabs[0]);
    }
  }, [properties, value, hidden, onChange, tabs]);

  const activeSchema = properties[value?.active] || Object.values(properties)[activeTab] || {};

  return {
    tabs,
    errored,
    activeTab,
    handleChange,
    activeSchema,
    tabKey: tabs[activeTab]
  };
};
