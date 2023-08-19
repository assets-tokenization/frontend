const styles = theme => ({
    root: {
        marginTop: 10,
        marginBottom: 10,
        display: 'block'
    },
    errored: {
        boxShadow: '0px 1px 3px 0px rgba(255,0,0,0.2), 0px 1px 1px 0px rgba(255,0,0,0.14), 0px 2px 1px -1px rgba(255,0,0,0.12)'
    },
    dropZone: {
        outline: 'none',
        padding: 0,
        textAlign: 'center',
        border: '#aaa 2px dashed',
        borderRadius: 3,
        '@media screen and (max-width: 425px)': {
            padding: 15
        }
    },
    dropZoneActive: {
        background: '#cdd7e3'
    },
    uploadButton: {
        marginLeft: 16
    },
    uploadButtonContainer: {
        fontSize: 18,
        paddingTop: 20,
        paddingBottom: 20,
        '@media screen and (max-width: 425px)': {
            padding: 0,
            paddingBottom: 15
        }
    },
    raw: {
        padding: 20,
        fontSize: 18,
        textAlign: 'left',
        '& ul, ol, p, a': {
            margin: 0,
            marginBottom: 15
        },
        '& ul, ol': {
            paddingLeft: 15,
            '& li': {
                marginBottom: 10
            }
        },
        '& a': {
            color: '#009be5'
        }
    },
    fontReg: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightRegular,
        lineHeight: '20px'
    },
    link: {
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    label: {
        marginTop: 20
    },
    mb20: {
        marginBottom: 20
    },
    limits: {
        paddingLeft: 5,
        paddingRight: 5
    }
});

export default styles;
