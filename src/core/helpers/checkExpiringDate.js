import config from 'config';
import moment from 'moment';

const certificateExpWarning = config.certificateExpWarning;

const checkExpiringDate = (certificate) => {
    if (!certificateExpWarning || !certificate) return false;

    try {
        const { certBeginTime } = certificate;

        const expiringDates = localStorage.getItem('checkExpiringDate') || [];

        if (expiringDates.includes(new Date(certBeginTime).getTime())) return false;
    
        const {
            privKeyEndTime: privKeyEndTimeOrigin,
            certEndTime: certEndTimeOrigin,
        } = certificate;
    
        const currentTime = moment();
        const privKeyEndTime = moment(privKeyEndTimeOrigin);
        const certEndTime = moment(certEndTimeOrigin);
    
        const diffkey = privKeyEndTime.diff(currentTime, 'days');
        const diffCert = certEndTime.diff(currentTime, 'days');
        
        if (certificateExpWarning >= diffkey) return diffkey + '';
        if (certificateExpWarning >= diffCert) return diffCert + '';

        return false;
    } catch {
        return false;
    }
};

export default checkExpiringDate;