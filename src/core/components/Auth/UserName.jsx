import getUserShortName from 'helpers/getUserShortName';

export default ({ isLegal, firstName, lastName, middleName, companyName }) => (
    isLegal
        ? companyName
        : getUserShortName({first_name: firstName, last_name: lastName, middle_name: middleName}));

