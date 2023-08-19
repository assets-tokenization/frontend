import React from 'react';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getMocksKeysByUser } from 'actions/debugTools';
import storage from 'helpers/storage';
import StringElement from 'components/JsonSchema/elements/StringElement';

const styles = {
  root: {
    padding: 20
  }
};

const ExternalReaderMocks = ({ t, classes, actions }) => {
  const [readers, setReaders] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [error, setError] = React.useState(null);
  const [selectedReaders, setSelectedReaders] = React.useState(() => {
    const enabledMocks = storage.getItem('enabled_mocks');
    return enabledMocks ? enabledMocks.split(',') : [];
  });

  React.useEffect(() => {
    const getReaders = async () => {
      const response = await actions.getMocksKeysByUser();

      if (response instanceof Error) {
        setError(true);
        return;
      }

      setReaders(response);
    };

    getReaders();
  }, [actions]);

  React.useEffect(() => {
    storage.setItem('enabled_mocks', selectedReaders);
  }, [selectedReaders]);

  const onChange = (event, reader) => {
    let newSelectedReaders = [...selectedReaders];

    const existingItem = newSelectedReaders.find((item) => {
      const provider = [item.split('.')[0], item.split('.')[1]].join('.');
      return reader.includes(provider);
    });

    if (event.target.checked) {
      newSelectedReaders = [...selectedReaders, reader];
    } else {
      newSelectedReaders = selectedReaders.filter((item) => item !== reader)
    }

    if (existingItem) {
      newSelectedReaders = newSelectedReaders.filter((item) => item !== existingItem);
    }

    setSelectedReaders(newSelectedReaders);
  };

  const filteredReaders = readers
    .filter((reader) => reader.includes(search));

  return (
    <div className={classes.root}>
      {
        error ? (
          <Typography>{t('MockInitError')}</Typography>
        ) : (
          <>
            <StringElement
              value={search}
              fullWidth={true}
              required={true}
              onChange={setSearch}
              placeholder={t('SearchMock')}
            />
      
            <FormGroup>
              {filteredReaders.map((reader) => (
                <FormControlLabel
                  key={reader}
                  control={<Checkbox />}
                  label={reader}
                  checked={selectedReaders.includes(reader)}
                  onChange={(event) => onChange(event, reader)}
                />
              ))}
            </FormGroup>
          </>
        )
      }
    </div>
  );
};

const mapStateToProps = ({
  debugTools: { checkHiddenFuncs, customInterface },
}) => ({
  checkHiddenFuncs,
  customInterface,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    getMocksKeysByUser: bindActionCreators(getMocksKeysByUser, dispatch),
  },
});

const styled = withStyles(styles)(ExternalReaderMocks);
const translated = translate('DebugTools')(styled);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
