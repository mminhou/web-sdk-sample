import { AppBar,makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import ConnectButton from '../buttons/ConnectButton';
import PenBasedRenderer from '../renderer/PenBasedRenderer';

const useStyle = makeStyles((theme) => ({
  mainBackground: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  title: {
    margin: '15px',
  }
}));

const Main = () => {
  const classes = useStyle();
  
  return (
    <div className={classes.mainBackground}>
      <AppBar position='relative' color='transparent' elevation={0}>
        <Typography variant="h5" className={classes.title}>
          WEB SDK SAMPLE
        </Typography>
      </AppBar>
      <ConnectButton />
      <PenBasedRenderer />
    </div>
  );
};

export default Main;
