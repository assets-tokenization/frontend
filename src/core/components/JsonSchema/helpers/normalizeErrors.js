function arrayToObjectPath(path) {
    let match;
    while ((match = /\[(.)\]/gi.exec(path))) {
        path = path.replace(match[0], (match.index ? '.' : '') + match[1]);
    }
    return path;
}

export default errors => Object.values(errors || {}).map((error) => {
    let path = '';

    if (error.dataPath) {
        path += arrayToObjectPath(error.dataPath);
    }

    if (error.params && error.params.missingProperty) {
        path += '.' + error.params.missingProperty;
    }

    error.path = path.split('.').filter(Boolean).join('.');

    return error;
});
