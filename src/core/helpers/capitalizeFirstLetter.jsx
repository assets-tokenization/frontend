export default function capitalizeFirstLetter(string, onlyFirst = false) {
    const value = string || '';
    if (onlyFirst){
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
