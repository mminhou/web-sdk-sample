import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import Menu from '@material-ui/icons/Menu';
import ConnectButton from '../buttons/ConnectButton';

const useStyle = makeStyles((theme) => ({
  navStyle: {
    height: '50px',
    backgroundColor: 'rgba(255,255,255,1)',
    display: 'flex',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const NavLayer = () => {
  const classes = useStyle();
  return (
    <div className={classes.navStyle}>
      <div className={classes.sectionDesktop}>
        <ConnectButton />
      </div>
      <div className={classes.sectionMobile}>
        <IconButton>
          <Menu />
        </IconButton>
      </div>
    </div>
  );
};

export default NavLayer;
