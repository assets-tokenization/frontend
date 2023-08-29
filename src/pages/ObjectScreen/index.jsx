import React from 'react';
import { useTranslate } from 'react-translate';
import classNames from 'classnames';
import Slider from 'react-slick';
import { useDispatch } from 'react-redux';
import { useFilePicker } from 'use-file-picker';
import MobileDetect from 'mobile-detect';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { makeStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  Typography,
  TextField,
  Slide,
  IconButton,
  useMediaQuery
} from '@mui/material';
import Header from 'components/Header';
import Card from 'components/Card';
import PageTitle from 'components/PageTitle';
import StatusLabel from 'components/StatusLabel';
import Preloader from 'components/Preloader';
import EmptyState from 'components/EmptyState';
import { getDetails, saveDetails } from 'actions';
import SliderArrow from 'assets/images/sliderArrow.svg';
import FullscreenIcon from 'assets/images/fullscreen_icon.svg';
import CloseIcon from 'assets/images/closeIcon.svg';
import arrowRight from 'assets/images/arrowRight.svg';
import arrowLeft from 'assets/images/arrowLeft.svg';
import LockIcon from 'assets/images/lock_icon.svg';
import deleteIcon from 'assets/images/deleteIcon.svg';
import LocationOnIcon from 'assets/images/pin.svg';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-fullscreen/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const markerIcon = new L.Icon({
  iconUrl: LocationOnIcon,
  iconRetinaUrl: LocationOnIcon,
  popupAnchor: [-0, -0],
  iconSize: [32, 45]
});

const md = new MobileDetect(window.navigator.userAgent);

const styles = (theme) => ({
  wrapper: {
    maxWidth: 845,
    paddingLeft: 60,
    paddingRight: 60,
    marginBottom: 60,
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px',
      marginBottom: 60
    }
  },
  backButton: {
    marginTop: 32,
    paddingLeft: 0,
    position: 'relative',
    left: -8,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    }
  },
  statusWrapper: {
    marginBottom: 48,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24
    }
  },
  addFileButton: {
    height: 400,
    background: '#fff',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.16)',
    marginBottom: 64,
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '30px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 14,
      height: 180,
      marginBottom: 40,
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  addFileButtonIcon: {
    marginBottom: 10
  },
  blockTitle: {
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '32px',
    marginBottom: 32,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 16
    }
  },
  detailsBlock: {
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.16)',
    background: '#FFFFFF',
    display: 'flex',
    padding: '48px 40px 56px 40px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: 64,
    [theme.breakpoints.down('sm')]: {
      padding: '24px 16px 32px 16px',
      gap: '16px',
      marginBottom: 40
    }
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    gap: '24px',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    color: '#595959',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  detailsDescription: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  addDescriptionText: {
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
    maxWidth: 180,
    marginBottom: 64,
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px',
      maxWidth: 'unset',
      marginBottom: 40
    }
  },
  addDescriptionButton: {
    marginBottom: 8,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  addDescriptionButtonIcon: {
    marginRight: 8
  },
  mapContainer: {
    height: 400,
    [theme.breakpoints.down('sm')]: {
      height: 180
    }
  },
  descriptionInput: {
    width: '100%',
    background: '#FFFFFF',
    marginBottom: 24,
    color: '#000',
    '& textarea': {
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '24px'
    }
  },
  textFieldLabel: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    marginBottom: 5,
    color: '#1A1A1A'
  },
  disabledDescriptionInput: {
    background: 'transparent'
  },
  textFieldActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 64,
    '& > button': {
      marginLeft: 16,
      [theme.breakpoints.down('sm')]: {
        flex: 1,
        marginLeft: 0,
        '&:last-child': {
          marginLeft: 16
        }
      }
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 40
    }
  },
  textFieldEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 64,
    '& > button': {
      marginLeft: 0,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        '&:last-child': {
          marginLeft: 0
        }
      }
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 40
    }
  },
  addYetPhotoButton: {
    marginTop: 24,
    marginBottom: 64,
    position: 'relative',
    left: -18,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 40
    }
  },
  disabledDescriptionWrapper: {
    position: 'relative'
  },
  lockIcon: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    right: -22,
    width: 16,
    height: 16,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  readOnlyDescription: {
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '24px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  carouselArrow: {
    width: 40,
    height: 40,
    cursor: 'pointer',
    zIndex: 1,
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    left: 'unset',
    right: 'unset',
    transform: 'none',
    '&:hover': {
      opacity: 0.5
    },
    '&:before': {
      display: 'none'
    },
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 21,
      top: 244,
      marginTop: 0
    }
  },
  carouselArrowNext: {
    right: 16
  },
  carouselArrowPrev: {
    left: 16,
    transform: 'rotate(180deg)'
  },
  emptyFiles: {
    marginBottom: 48,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24
    }
  },
  fullscreenIconWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 1,
    width: 42,
    height: 42,
    [theme.breakpoints.down('sm')]: {
      bottom: 12,
      right: 8,
      padding: 0,
      width: 32,
      height: 32
    }
  },
  deleteIcon: {
    position: 'absolute',
    top: '45%',
    right: '45%',
    width: 32,
    height: 32,
    zIndex: 1,
    cursor: 'pointer'
  },
  fullscreenIcon: {
    width: 40,
    height: 40,
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 32
    }
  },
  dialogTitle: {
    justifyContent: 'end',
    display: 'flex'
  },
  closeIcon: {
    width: 40,
    height: 40,
    cursor: 'pointer',
    top: 100,
    right: 90,
    position: 'absolute',
    zIndex: 1,
    '&:hover': {
      opacity: 0.5
    },
    [theme.breakpoints.down('sm')]: {
      width: 24,
      height: 24,
      top: 35,
      right: 10
    }
  },
  noRotate: {
    transform: 'none',
    [theme.breakpoints.down('sm')]: {
      right: 80,
      left: 'unset'
    }
  },
  sliderDialogWrapper: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 93
    }
  },
  sliderDialogPaper: {
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  sliderImage: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: 400,
    borderRadius: 4,
    [theme.breakpoints.down('sm')]: {
      height: 180
    }
  },
  imageOverlay: {
    content: "",
    position: "absolute",
    height: 400,
    borderRadius: 4,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    display: 'none',
    zIndex: 1
  },
  dialogSliderImage: {
    height: '100vh',
    maxWidth: 1080,
    margin: '0 auto',
    backgroundSize: 'contain',
    [theme.breakpoints.down('sm')]: {
      height: 220
    }
  },
  sliderImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginTop: 5,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      width: 56,
      height: 56,
      marginTop: 0
    }
  },
  hidden: {
    display: 'none'
  },
  carouselDialogArrowNext: {
    right: 135,
    [theme.breakpoints.down('sm')]: {
      right: 16
    }
  },
  carouselDialogArrowPrev: {
    left: 135,
    [theme.breakpoints.down('sm')]: {
      left: 'unset'
    }
  },
  smDescriptionWrapper: {
    maxHeight: 200,
    overflow: 'hidden'
  },
  smDescriptionWrapperOpen: {
    maxHeight: 'unset'
  },
  showMoreButton: {
    width: '100%',
    marginTop: 16,
    marginBottom: 20
  },
  currentPageStatus: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
    display: 'flex',
    padding: '2px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    background: '#FFF'
  },
  deleteDialog: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'center',
    zIndex: 1,
    paddingBottom: '100px'
  },
  deletePhotoButton: { 
    color: 'red', 
    background: 'white', 
    marginBottom: '10px', 
    width: '304px' 
  },
  cancelPhotoButton: { 
    color: 'rgba(34, 89, 228, 1)', 
    background: 'white', 
    width: '304px' 
  }
});

const useStyles = makeStyles(styles);

const ObjectScreen = ({ history, hideHeader, handleClickBack, readOnly }) => {
  const [loadingData, setLoading] = React.useState(false);
  const [objectData, setData] = React.useState(null);
  const [openTextEditor, setOpenTextEditor] = React.useState(false);
  const [description, setDescription] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [openSlider, setOpenSLider] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [photoIndexToDelete, setPhotoIndexToDelete] = React.useState(null);
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = React.useState(null);
  const [mainSlider, setMainSlider] = React.useState(null);
  const [secondarySlider, setSecondarySlider] = React.useState(null);
  const [dialogSlider, setDialogSlider] = React.useState(null);
  const dispatch = useDispatch();
  const isMobile = !!md.mobile();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getDetails()(dispatch);

        if (result instanceof Error) {
          setLoading(false);
          setError(result.message);
          return;
        }

        setData(result);

        setDescription(result.description);

        setFiles(result.photos);

        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(e.message);
      }
    };

    fetchData();
  }, [dispatch]);

  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleClickOpenSlider = (index) => {
    setOpenSLider(true);
    setTimeout(() => {
      return dialogSlider?.current?.slickGoTo(index);
    }, 100);
  };

  const handleCloseSlider = () => setOpenSLider(false);

  const [openFileSelector, { loading }] = useFilePicker({
    accept: 'image/*',
    multiple: false,
    readAs: 'DataURL',
    limitFilesConfig: { max: 1 },
    maxFileSize: 50,
    onFilesSuccessfulySelected: ({ filesContent }) => {
      const filesArray = [...files, ...filesContent];
      setFiles(filesArray);
    }
  });
  const classes = useStyles();
  const t = useTranslate('ObjectScreen');

  const toMarket = () => history.push('/market');

  const handleBack = handleClickBack || (() => history.push('/'));

  const handleSaveDescription = () => {
    setOpenTextEditor(false);

    saveDetails({
      data: {
        ...objectData,
        id_user: 1,
        description
      },
    })(dispatch);
  };

  const SampleNextArrow = React.useCallback(
    (props) => {
      const { className, onClick } = props;

      return (
        <div
          className={classNames(className, {
            [classes.carouselArrowNext]: true,
            [classes.carouselArrow]: true,
            [classes.hidden]: isSM
          })}
          onClick={onClick}
        >
          <img src={SliderArrow} alt={'slider prev arrow'} />
        </div>
      );
    },
    [classes, isSM]
  );

  const SamplePrevArrow = React.useCallback(
    (props) => {
      const { className, onClick } = props;

      return (
        <div
          className={classNames(className, {
            [classes.carouselArrowPrev]: true,
            [classes.carouselArrow]: true,
            [classes.hidden]: isSM
          })}
          onClick={onClick}
        >
          <img src={SliderArrow} alt={'slider next arrow'} />
        </div>
      );
    },
    [classes, isSM]
  );

  const SampleDialogNextArrow = React.useCallback(
    (props) => {
      const { className, onClick } = props;

      return (
        <div
          className={classNames(className, {
            [classes.carouselArrowNext]: true,
            [classes.carouselDialogArrowNext]: true,
            [classes.carouselArrow]: true
          })}
          onClick={onClick}
        >
          <img src={arrowRight} alt={'slider next arrow'} />
        </div>
      );
    },
    [classes]
  );

  const SampleDialogPrevArrow = React.useCallback(
    (props) => {
      const { className, onClick } = props;

      return (
        <div
          className={classNames(className, {
            [classes.carouselArrowPrev]: true,
            [classes.carouselDialogArrowPrev]: true,
            [classes.carouselArrow]: true,
            [classes.noRotate]: true
          })}
          onClick={onClick}
        >
          <img src={arrowLeft} alt={'slider next arrow'} />
        </div>
      );
    },
    [classes]
  );

  const handleCloseDeleteDialog = () => {
    setPhotoIndexToDelete(null);
    setDeleteDialog(false);
  };

  const handleOpenDeleteDialog = (index) => {
    setPhotoIndexToDelete(index);
    setDeleteDialog(true);
  };

  const handleDeletePhoto = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    handleCloseDeleteDialog();
  };

  if (loadingData) {
    return <Preloader />;
  }

  return (
    <>
      {hideHeader ? null : <Header navigateClick={toMarket} />}

      <div className={classes.wrapper}>
        {
          error ? (
            <EmptyState error={true}>{error}</EmptyState>
          ) : (
            <>
              <Button onClick={handleBack} className={classes.backButton}>
                <ChevronLeftIcon />
                {t('ToList')}
              </Button>

              <PageTitle>{objectData?.title}</PageTitle>

              {objectData?.tokenized ? (
                <div className={classes.statusWrapper}>
                  <StatusLabel>{t('Tokenized')}</StatusLabel>
                </div>
              ) : null}

              <Slider
                dots={false}
                infinite={false}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                ref={(slider) => setMainSlider(slider)}
                asNavFor={secondarySlider}
                nextArrow={<SampleNextArrow />}
                prevArrow={<SamplePrevArrow />}
              >
                {files.map((file, index) => (
                  <div key={index}>
                    <div
                      className={classes.sliderImage}
                      style={{
                        backgroundImage: `url(${file.content})`
                      }}
                      onMouseEnter={() => setHoveredPhotoIndex(index)}
                      onMouseLeave={() => setHoveredPhotoIndex(null)}
                      onClick={() => isMobile && handleOpenDeleteDialog(index)}
                    />
                    <div
                      className={classes.imageOverlay}
                      onMouseEnter={() => setHoveredPhotoIndex(index)}
                      onMouseLeave={() => setHoveredPhotoIndex(null)}
                      style={{
                        display: !isMobile && hoveredPhotoIndex === index ? 'block' : 'none'
                      }}
                    />
                    <div className={classes.currentPageStatus}>
                      {t('photo', {
                        index: index + 1,
                        total: files.length
                      })}
                    </div>
                    <IconButton
                      onClick={() => {
                        handleClickOpenSlider(index);
                      }}
                      className={classes.fullscreenIconWrapper}
                    >
                      <img
                        src={FullscreenIcon}
                        alt={'fullscreen icon'}
                        className={classes.fullscreenIcon}
                      />
                    </IconButton>
                    {!isMobile && hoveredPhotoIndex === index && (
                      <IconButton
                        className={classes.deleteIcon}
                        onMouseEnter={() => setHoveredPhotoIndex(index)}
                        onClick={() => handleDeletePhoto(index)}
                      >
                        <img
                          src={deleteIcon}
                          alt={'delete icon'}
                        />
                      </IconButton>
                    )}
                  </div>
                ))}
              </Slider>

              {files.length > 1 ? (
                <Slider
                  dots={false}
                  infinite={false}
                  speed={500}
                  slidesToShow={isSM ? 5 : 8}
                  arrows={false}
                  swipeToSlide={true}
                  focusOnSelect={true}
                  ref={(slider) => setSecondarySlider(slider)}
                  asNavFor={mainSlider}
                  className="secondary-slider"
                >
                  {files.map((file, index) => (
                    <div key={index}>
                      <div
                        className={classNames({
                          [classes.sliderImage]: true,
                          [classes.sliderImagePreview]: true
                        })}
                        style={{
                          backgroundImage: `url(${file.content})`
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : null}

              {deleteDialog && (
                <div onClick={handleCloseDeleteDialog} className={classes.deleteDialog}>
                  <Button onClick={() => handleDeletePhoto(photoIndexToDelete)} className={classes.deletePhotoButton}>
                    {t('DeletePhoto')}
                  </Button>
                  <Button onClick={handleCloseDeleteDialog} className={classes.cancelPhotoButton}>
                    {t('Cancel')}
                  </Button>
                </div>
              )}

              <Dialog
                fullScreen
                open={!!openSlider}
                onClose={handleCloseSlider}
                TransitionComponent={Transition}
                classes={{
                  paper: classes.sliderDialogPaper
                }}
              >
                <div className={classes.sliderDialogWrapper}>
                  <img
                    onClick={handleCloseSlider}
                    className={classes.closeIcon}
                    src={CloseIcon}
                    alt={'close icon'}
                  />

                  <Slider
                    dots={false}
                    infinite={false}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    nextArrow={<SampleDialogNextArrow />}
                    prevArrow={<SampleDialogPrevArrow />}
                    ref={slider => setDialogSlider(slider)}
                  >
                    {files.map((file, index) => (
                      <div key={index}>
                        <div
                          className={classNames({
                            [classes.sliderImage]: true,
                            [classes.dialogSliderImage]: true
                          })}
                          style={{
                            backgroundImage: `url(${file.content})`
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </Dialog>

              {!readOnly ? (
                <>
                  {files.length > 0 ? (
                    <Button
                      onClick={() => openFileSelector()}
                      disabled={loading}
                      className={classes.addYetPhotoButton}
                    >
                      <AddCircleOutlineIcon className={classes.addDescriptionButtonIcon} />
                      {t('AddYetPhoto')}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => openFileSelector()}
                      disabled={loading}
                      className={classes.addFileButton}
                    >
                      <AddCircleOutlineIcon className={classes.addFileButtonIcon} />
                      {t('AddPhoto')}
                    </Button>
                  )}
                </>
              ) : null}

              {readOnly ? (
                <>
                  {objectData?.description ? (
                    <>
                      <Typography className={classes.blockTitle}>{t('Description')}</Typography>
                      <Card>
                        {isSM ? (
                          <>
                            <Typography
                              className={classNames({
                                [classes.readOnlyDescription]: true,
                                [classes.smDescriptionWrapper]: true,
                                [classes.smDescriptionWrapperOpen]: showMore
                              })}
                            >
                              {objectData?.description}
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={() => setShowMore(!showMore)}
                              className={classes.showMoreButton}
                            >
                              {showMore ? t('Hide') : t('ShowMore')}
                            </Button>
                          </>
                        ) : (
                          <Typography className={classes.readOnlyDescription}>
                            {objectData?.description}
                          </Typography>
                        )}
                      </Card>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <Typography className={classes.blockTitle}>{t('Description')}</Typography>
                  {openTextEditor || description ? (
                    <Typography className={classes.textFieldLabel}>{t('AdditionDescription')}</Typography>
                  ) : null}

                  {openTextEditor ? (
                    <>
                      <TextField
                        value={description}
                        rows={9}
                        multiline={true}
                        className={classes.descriptionInput}
                        placeholder={t('DescriptionPlaceHolder')}
                        onChange={(e) => setDescription(e.target.value)}
                      />

                      <div className={classes.textFieldActions}>
                        <Button variant="outlined" onClick={() => setOpenTextEditor(false)}>
                          {t('Cancel')}
                        </Button>

                        <Button variant="contained" onClick={() => handleSaveDescription()}>
                          {t('Save')}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {description ? (
                        <>
                          <div className={classes.disabledDescriptionWrapper}>
                            <TextField
                              value={description}
                              rows={9}
                              multiline={true}
                              disabled={true}
                              className={classNames({
                                [classes.descriptionInput]: true,
                                [classes.disabledDescriptionInput]: true
                              })}
                              placeholder={t('DescriptionPlaceHolder')}
                            />
                            <img className={classes.lockIcon} src={LockIcon} alt="arrow lock icon" />
                          </div>

                          <div className={classes.textFieldEditActions}>
                            <Button
                              variant="contained"
                              className={classes.editDescriptionButton}
                              onClick={() => setOpenTextEditor(true)}
                            >
                              <BorderColorOutlinedIcon className={classes.addDescriptionButtonIcon} />
                              {t('Edit')}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            className={classes.addDescriptionButton}
                            onClick={() => setOpenTextEditor(true)}
                          >
                            <AddCircleOutlineIcon className={classes.addDescriptionButtonIcon} />
                            {t('AddDescriptionButton')}
                          </Button>

                          <Typography className={classes.addDescriptionText}>
                            {t('AddDescription')}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              <Typography className={classes.blockTitle}>{t('AdditionInfo')}</Typography>

              <div className={classes.detailsBlock}>
                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('RegNum')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.number}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('Address')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.address}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('ObjectType')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.type}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('OwnLaw')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.lawData}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('GovReg')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.document}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('OwnForm')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.ownForm}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('ObjectState')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.expDate}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('GovRegistrator')}</Typography>
                  <Typography className={classes.detailsDescription}>
                    {objectData?.govRegistrator}
                  </Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('ObjectDescription')}</Typography>
                  <Typography className={classes.detailsDescription}>
                    {objectData?.objectDescription}
                  </Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('TotalArea')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.totalArea}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('LivingArea')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.livingArea}</Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.detailsTitle}>{t('Problems')}</Typography>
                  <Typography className={classes.detailsDescription}>{objectData?.problems}</Typography>
                </div>
              </div>

              <Typography className={classes.blockTitle}>{t('MapPoint')}</Typography>
              <div className={classes.mapContainer}>
                <MapContainer
                  center={objectData?.location}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={objectData?.location} icon={markerIcon} />
                  <FullscreenControl />
                </MapContainer>
              </div>
            </>
          )
        }
      </div>
    </>
  );
};

export default ObjectScreen;
