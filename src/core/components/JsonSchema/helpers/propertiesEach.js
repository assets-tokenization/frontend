const propertiesEach = (
  schema,
  data,
  callback,
  path = '',
  parentSchema = {},
  parentData = {},
  key = ''
) => {
  callback(schema, data, path, parentSchema, parentData, key);

  if (schema.properties) {
    return Object.keys(schema.properties).forEach((propertyName) => {
      propertiesEach(
        schema.properties[propertyName],
        (data || {})[propertyName],
        callback,
        path + '.' + propertyName,
        schema,
        data,
        propertyName
      );
    });
  }

  if (schema.type === 'array') {
    return (data ? Object.values(data) : []).forEach((arrayElement, index) => {
      propertiesEach(
        schema.items || {},
        arrayElement,
        callback,
        `${path}[${index}]`,
        schema,
        data,
        index
      );
    });
  }
};

export default propertiesEach;
