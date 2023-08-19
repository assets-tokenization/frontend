export default {
    breakpoints: {
        keys: [
            'xs',
            'sm',
            'md',
            'lg',
            'xl'
        ],
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920
        }
    },
    direction: 'ltr',
    mixins: {
        toolbar: {
            minHeight: 48
        }
    },
    overrides: {
        MuiAlert: {
            standardInfo: {
                backgroundColor: '#c6e0f5'
            },
            standardWarning: {
                backgroundColor: '#fceda1'
            }
        },
        PageSizeSelector: {
            label: {
                paddingRight: 8,
                fontSize: '16px'
            }
        },
        Pagination: {
            pagination: {
                alignItems: 'center',
                display: 'flex'
            },
            rowsLabel: {
                fontSize: '16px'
            }
        },
        MuiToolbar: {
            gutters: {
                paddingLeft: 24,
                paddingRight: 24
            }
        },
        MuiFormLabel: {
            root: {
                opacity: 0.5
            }
        },
        MuiInputLabel: {
            root: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '100%'
            },
            shrink: {
                opacity: 1
            }
        },
        MuiDrawer: {
            paper: {
                backgroundColor: '#232f3d'
            }
        },
        MuiSvgIcon: {
            colorPrimary: {
                color: '#1aaa55'
            },
            colorSecondary: {
                color: '#fc9403'
            }
        },
        MuiTabs: {
            root: {
                marginLeft: 8
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: '#fff'
            }
        },
        MuiTab: {
            root: {
                textTransform: 'initial',
                margin: '0 16px',
                minWidth: 0,
                '@media (min-width:960px)': {
                    minWidth: 0
                }
            },
            labelContainer: {
                padding: 0,
                '@media (min-width:960px)': {
                    padding: 0
                }
            }
        },
        MuiIconButton: {
            root: {
                padding: 8
            }
        },
        MuiButton: {
            root: {
                minWidth: 32
            },
            containedPrimary: {
                marginRight: 4,
                color: '#232f3d',
                backgroundColor: '#aeea00',
                border: 'none',
                '&:hover': {
                    backgroundColor: '#d1ff4d'
                },
                '&:disabled': {
                    backgroundColor: '#fafafa',
                    border: 'none',
                    color: '#232f3d'
                }
            },
            textSecondary: {
                color: 'rgb(220, 0, 78)'
            }
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 4
            }
        },
        MuiDivider: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.12)'
            }
        },
        MuiListItemText: {
            primary: {
                fontWeight: 500
            }
        },
        MuiListItemIcon: {
            root: {
                color: 'inherit',
                marginRight: 0,
                minWidth: 40,
                '& svg': {
                    fontSize: 20
                }
            }
        },
        MuiTableCell: {
            root: {
                padding: 12
            },
            paddingCheckbox: {
                width: ''
            }
        },
        MuiAvatar: {
            root: {
                width: 32,
                height: 32
            }
        },
        MUIDataTable: {
            responsiveScroll: {
                maxHeight: 'none'
            }
        },
        MUIDataTableToolbar: {
            root: {
                height: 64,
                boxShadow: 'none',
                backgroundColor: '#fff',
                borderBottom: '1px solid rgba(224, 224, 224, 1)'
            }
        },
        MUIDataTableToolbarSelect: {
            root: {
                height: 64,
                boxShadow: 'none',
                backgroundColor: '#fff',
                borderBottom: '1px solid rgba(224, 224, 224, 1)'
            },
            iconButton: {
                height: 40
            }
        },
        MuiInput: {
            disabled: {
                color: '#000'
            }
        },
        MuiTablePagination: {
            selectRoot: {
                marginLeft: 8,
                marginRight: 8
            },
            select: {
                fontSize: 12
            },
            actions: {
                marginLeft: 0
            }
        },
        MuiPaper: {
            root: {
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }
        },
        MuiFormControl: {
            root: {
                display: 'flex',
                zIndex: 'unset'
            }
        },
        MuiInputBase: {
            input: {
                height: 'auto',
                color: '#000'
            }
        }
    },
    palette: {
        common: {
            black: '#000',
            white: '#fff'
        },
        type: 'light',
        primary: {
            light: '#63ccff',
            main: '#009be5',
            dark: '#006db3',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff4081',
            main: '#000000',
            dark: '#c51162',
            contrastText: '#fff'
        },
        error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
        grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
            A100: '#d5d5d5',
            A200: '#aaaaaa',
            A400: '#303030',
            A700: '#616161'
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)'
        },
        divider: 'rgba(0, 0, 0, 0.12)',
        background: {
            paper: '#fff',
            default: '#fafafa'
        },
        action: {
            active: 'rgba(0, 0, 0, 0.54)',
            hover: 'rgba(0, 0, 0, 0.1)',
            hoverOpacity: 0.08,
            selected: 'rgba(0, 0, 0, 0.14)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)'
        }
    },
    props: {
        MuiTab: {
            disableRipple: true
        }
    },
    shadows: [
        'none',
        '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
        '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)',
        '0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)',
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
        '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
        '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
        '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
        '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
        '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
        '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
        '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
        '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
        '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
        '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
        '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
        '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
        '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
        '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
        '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
        '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
        '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
    ],
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        display4: {
            fontSize: '7rem',
            fontWeight: 300,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: '-.04em',
            lineHeight: '1.14286em',
            marginLeft: '-.04em',
            color: 'rgba(0, 0, 0, 0.54)'
        },
        display3: {
            fontSize: '3.5rem',
            fontWeight: 400,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: '-.02em',
            lineHeight: '1.30357em',
            marginLeft: '-.02em',
            color: 'rgba(0, 0, 0, 0.54)'
        },
        display2: {
            fontSize: '2.8125rem',
            fontWeight: 400,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.13333em',
            marginLeft: '-.02em',
            color: 'rgba(0, 0, 0, 0.54)'
        },
        display1: {
            fontSize: '2.125rem',
            fontWeight: 400,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.20588em',
            color: 'rgba(0, 0, 0, 0.54)'
        },
        headline: {
            fontSize: '1.5rem',
            fontWeight: 400,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.35417em',
            color: 'rgba(0, 0, 0, 0.87)'
        },
        title: {
            fontSize: '1.3125rem',
            fontWeight: 500,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.16667em',
            color: 'rgba(0, 0, 0, 0.87)'
        },
        subheading: {
            fontSize: '1rem',
            fontWeight: 400,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.5em',
            color: 'rgba(0, 0, 0, 0.87)'
        },
        body2: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            letterSpacing: '0.01071em'
        },
        body1: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em'
        },
        caption: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.66,
            letterSpacing: '0.03333em'
        },
        button: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.75,
            letterSpacing: '0.02857em',
            textTransform: 'uppercase'
        },
        h1: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: '6rem',
            lineHeight: 1,
            letterSpacing: '-0.01562em'
        },
        h2: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: '3.75rem',
            lineHeight: 1,
            letterSpacing: '-0.00833em'
        },
        h3: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '3rem',
            lineHeight: 1.04,
            letterSpacing: '0em'
        },
        h4: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '2.125rem',
            lineHeight: 1.17,
            letterSpacing: '0.00735em'
        },
        h5: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1.33,
            letterSpacing: 0.5
        },
        h6: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.6,
            letterSpacing: '0.0075em'
        },
        subtitle1: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.75,
            letterSpacing: '0.00938em'
        },
        subtitle2: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.57,
            letterSpacing: '0.00714em'
        },
        body1Next: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em'
        },
        body2Next: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            letterSpacing: '0.01071em'
        },
        buttonNext: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.75,
            letterSpacing: '0.02857em',
            textTransform: 'uppercase'
        },
        captionNext: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.66,
            letterSpacing: '0.03333em'
        },
        overline: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 2.66,
            letterSpacing: '0.08333em',
            textTransform: 'uppercase'
        },
        useNextVariants: true
    },
    shape: {
        borderRadius: 4
    },
    spacing: 8,
    transitions: {
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
        },
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195
        }
    },
    zIndex: {
        mobileStepper: 1000,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500
    },
    leftSidebarBg: '#232f3d',
    buttonBg: '#aeea00',
    buttonHoverBg: '#d1ff4d',
    textColorDark: '#232f3d',
    headerBg: '#eeeeee',
    checkboxBg: '#000000',
    borderColor: '#e0e0e0',
    dataTableHoverColor: '#A30101',
    dataTableHoverBg: '#feffda',
    navLinkActive: 'rgba(255, 255, 255, .1)',
    categoryWrapperActive: 'rgba(255, 255, 255, .1)',
    logo: {
        width: '100%',
        minHeight: 78,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }
};
