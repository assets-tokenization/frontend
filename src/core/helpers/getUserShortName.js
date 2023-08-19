import capitalizeFirstLetter from 'helpers/capitalizeFirstLetter';

const getUserShortName = ({ first_name: firstName, last_name: lastName, middle_name: middleName }) => {
    let shortName = '';
    if (lastName) {
        shortName += capitalizeFirstLetter(lastName);
    }

    if (firstName || middleName) {
        shortName += ' ';
    }

    if (firstName) {
        shortName += firstName.charAt(0) + '.';
    }

    if (middleName) {
        shortName += middleName.charAt(0) + '.';
    }

    return shortName;
};

export const getShortNameFromString = (userName = '') => {
    const arr = userName && userName.split(' ');
    if (arr && arr.length === 3) {
        return getUserShortName({ last_name: arr[0], first_name: arr[1], middle_name: arr[2] });
    }
    return userName;
};

export default getUserShortName;
