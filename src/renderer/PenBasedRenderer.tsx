import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PenHelper from '../utils/PenHelper';
import { fabric } from 'fabric';

const useStyle = makeStyles(() => ({
  mainBackground: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

// PenHelper.pageCallback = (dot) => {
//   console.log("pageCallback", dot);
//   PenHelper.dotCallback = (mac, dot) => {
//     console.log(dot);
//   }
// };

const PenBasedRenderer = () => {
  const classes = useStyle();
  const [dotArray, setDotArray] = useState([]);
  const [canvasFb, setCanvasFb] = useState<fabric.Canvas>(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCanvasFb(initCanvas());
  }, []);

  useEffect(() => {
    PenHelper.dotCallback = (mac, dot) => {
      strokeProcess(dot);
    }
  });

  const initCanvas = () => { 
    return new fabric.Canvas('sampleCanvas'); 
  }

  const strokeProcess = (dot) => {
    let ctx = canvasFb.getContext();
    ctx.lineTo(dot.x * 5, dot.y * 5);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(dot.x * 5, dot.y * 5);
    // path.set({ left: 120, top: 120 });

  }

  return (
    <div className={classes.mainBackground}>
      <canvas id="sampleCanvas" width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
  );
};

export default PenBasedRenderer;
