import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(34, 89, 228, 1)',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#EE0004',
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          fontSize: 12
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        iconContainer: {
          minWidth: 32
        },
        label: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          minWidth: 680,
          '@media (max-width: 768px)': {
            minWidth: 'unset',
          },
          '@media (max-width: 425px)': {
            margin: 16
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(34, 89, 228, 1)',
          textTransform: 'initial',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '24px',
          padding: '8px 16px',
          '@media (max-width:425px)': {
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            padding: '10px 16px',
          }
        },
        textPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(63, 111, 232, 0.08)',
          }
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(0, 65, 231, 1)',
          }
        },
        outlinedPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(63, 111, 232, 0.08)',
            borderColor: 'rgba(34, 89, 228, 1)'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: 0,
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#3F6FE814',
            fill: '#2259E4'
          }
        }
      }
    }
  }
});

export default theme;