export default (option = {}) => {
    const { id: value, data: { name: label } = {} } = option;
    return { ...option, label, value };
};
