import { Button } from '@material-ui/core';
import React from 'react';
import PenHelper from '../utils/PenHelper';

const ConnectButton = () => {
  const scanPen = () => {
    PenHelper.scanPen();
  };

  return (
    <Button onClick={scanPen} variant="contained" color="primary">
      pen connect button
    </Button>
  );
};

export default ConnectButton;
