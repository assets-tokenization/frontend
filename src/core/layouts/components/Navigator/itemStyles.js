export default theme => ({
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        '&.active > div': {
            backgroundColor: theme.navLinkActive,
            color: '#fff'
        }
    },
    item: {
        paddingLeft: 0,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 0,
        color: '#ffffff'
    },
    itemActionable: {
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, .1)'
        },
        '& svg': {
            fill: '#eee',
            backgroundColor: 'rgba(255, 255, 255, .1)'
        }
    },
    subNavLink: {
        padding: '4px 0',
        paddingLeft: '55px!important'
    },
    noPadding: {
        paddingLeft: '4px !important',
        paddingRight: 4
    },
    itemPrimary: {
        color: 'inherit',
        fontSize: theme.typography.fontSize,
        '&$textDense': {
            fontSize: theme.typography.fontSize
        }
    },
    badge: {
        left: -4,
        height: 16,
        backgroundColor: '#a40000',
        padding: 4,
        minWidth: '25px'
    }
});
