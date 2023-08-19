import { useTranslate } from 'react-translate';
import renderHTML from 'helpers/renderHTML';

const FieldLabel = ({
    description,
    notRequiredLabel,
    required
}) => {
    const t = useTranslate('Elements');

    const combineDescription = () => {
        let text = ' (' + t('NotRequired') + ')';

        if (notRequiredLabel) text = ' (' + notRequiredLabel + ')';
    
        if (typeof notRequiredLabel === 'string' && !notRequiredLabel.length) text = '';
    
        return renderHTML(description + (required ? '' : text));
    };

    const templated = combineDescription();

    return templated;
};

export default FieldLabel;
