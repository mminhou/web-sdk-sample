import { makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PenHelper from '../utils/PenHelper2';
import { fabric } from 'fabric';
import api from '../server/NoteServer';
import { Dot, PageInfo, ScreenDot } from '../utils/type';
import { PlateNcode_3 } from '../utils/constants';

const useStyle = makeStyles(() => ({
  mainBackground: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hoverCanvasContainer: {
    position: 'absolute',
  },
  mainCanvas: {
    position: 'absolute',
  },
  hoverCanvas: {
    position: 'absolute',
  },
  inputContainer: {
    position: 'absolute',
  },
  inputStyle: {
    display: 'inline-block', 
    margin: 20,
  },
}));

const PenBasedRenderer = () => {
  const classes = useStyle();

  const [canvasFb, setCanvasFb] = useState<any>();
  const [hoverCanvasFb, setHoverCanvasFb] = useState<any>();
  const [ctx, setCtx] = useState<any>();

  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [noteImage, setNoteImage] = useState<string>();

  const [noteWidth, setNoteWidth] = useState<number>(0);
  const [noteHeight, setNoteHeight] = useState<number>(0);

  const [hoverPoint, setHoverPoint] = useState<any>();

  const [angle, setAngle] = useState<number>(0);
  
  // canvas size
  useEffect(() => {
    const { canvas, hoverCanvas } = initCanvas();
    setCanvasFb(canvas);
    setHoverCanvasFb(hoverCanvas);
  }, []);

  useEffect(() => {
    if (pageInfo) {
      // Note Info
      const imageSrc = api.getNoteImage(pageInfo);
      api.getNoteSize(pageInfo, function(result) {
        setNoteWidth(result.width);
        setNoteHeight(result.height);
        setNoteImage(imageSrc);
      });
    }
  }, [pageInfo]);

  useEffect(() => {
    if (hoverCanvasFb) {
      createHoverPoint();
    }
  }, [hoverCanvasFb]);

  useEffect(() => {
    if (noteImage) {
      /**
       * Canvas width 를 note image 비율에 맞춰 재설정 하는 로직
       * 추가, Canvas height 는 기본적으로 'window.innerHeight - 81(Header의 높이)'로 되어있음.
       * 
       * noteWidth: note의 가로길이
       * noteHeight: note의 세로길이
       * 
       * CanvasFb.height : CanvasFb.width = noteHeight : noteWidth;
       * CanvasFb.width(=refactorCanvasWidth) = (CanvasFb.height * noteWidth) / noteHeight;
       * 
       */
      const refactorCanvasWidth = canvasFb.height * noteWidth / noteHeight;
      canvasFb.setWidth(refactorCanvasWidth);
      hoverCanvasFb.setWidth(refactorCanvasWidth);

      // NoteImage를 canvas 크기에 맞춰 보여지게 하기위한 scaling 작업
      canvasFb.setBackgroundImage(noteImage, canvasFb.renderAll.bind(canvasFb), {
        scaleX: canvasFb.width / noteWidth,
        scaleY: canvasFb.height / noteHeight,
      });
    }
  }, [canvasFb, noteImage, angle]);
 
  useEffect(() => {
    PenHelper.dotCallback = async (mac, dot) => {
      strokeProcess(dot);
    }
  });

  // Initialize Canvas
  const initCanvas = () => { 
    const canvas = new fabric.Canvas('mainCanvas');
    const hoverCanvas = new fabric.Canvas('hoverCanvas');

    setCtx(canvas.getContext());

    return { canvas, hoverCanvas }
  }

  const strokeProcess = (dot: Dot) => {
    if (!pageInfo) {
      setPageInfo(dot.pageInfo);
    }

    // 먼저, ncode_dot을 view(Canvas) size 에 맞춰 좌표값을 변환시켜준다.
    const view = { width: canvasFb.width, height: canvasFb.height };
    let screenDot: ScreenDot;
    if (PenHelper.isSamePage(dot.pageInfo, PlateNcode_3)) {
      screenDot = PenHelper.ncodeToScreen_smartPlate(dot, view, angle);
    } else {
      screenDot = PenHelper.ncodeToScreen(dot, view);
    }

    try {
      if (dot.dotType === 0) { // Pen Down
        ctx.beginPath();
        // PenDown 일때는 hoverPoint가 보일 필요가 없으므로 opacity 0으로 설정
        hoverPoint.set({ opacity: 0 });
        hoverCanvasFb.requestRenderAll();
      } else if (dot.dotType === 1) { // Pen Move
        // dot 좌표가 너무 큰 값이 들어와버리면 이상 dot으로 취급하여 처리하지 않음.
        if (dot.x > 1000 || dot.y > 1000) { 
          return
        }
        ctx.lineWidth = 2;
        ctx.lineTo(screenDot.x, screenDot.y);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(screenDot.x, screenDot.y);
      } else if (dot.dotType === 2) { // Pen Up
        ctx.closePath();
      } else if (dot.dotType === 3) { // Hover 
        hoverProcess(screenDot);
      }
    } catch {
      console.log('ctx : ' + ctx);
    }
  }

  const setCanvasAngle = (rotate: number) => {
    if (![0, 90, 180, 270].includes(rotate)) return
    if (!pageInfo || !PenHelper.isSamePage(pageInfo, PlateNcode_3)) return

    if (Math.abs(angle-rotate)/90 === 1 || Math.abs(angle-rotate)/90 === 3) {
      const tmp = noteWidth;
      setNoteWidth(noteHeight);
      setNoteHeight(tmp); 
    }
    setAngle(rotate);
  }

  // hoverPoint를 이동시키기 위한 로직
  const hoverProcess = (screenDot: ScreenDot) => {
    hoverPoint.set({ left: screenDot.x, top: screenDot.y, opacity: 0.5 });
    hoverCanvasFb.requestRenderAll();
  }

  const createHoverPoint = () => {
    const hoverPoint = new fabric.Circle({ 
      radius: 10,
      fill: '#ff2222',
      stroke: '#ff2222',
      opacity: 0,
      top: 0, 
      left: 0,
    });
    
    setHoverPoint(hoverPoint);
    hoverCanvasFb.add(hoverPoint);
  }

  return (
    <div className={classes.mainBackground}>
      <canvas id="mainCanvas" className={classes.mainCanvas} width={window.innerWidth} height={window.innerHeight-81}></canvas>
      <div className={classes.hoverCanvasContainer}>
        <canvas id="hoverCanvas" className={classes.hoverCanvas} width={window.innerWidth} height={window.innerHeight-81}></canvas>
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.inputStyle}>
          <TextField id="angle" label="Angle" variant="outlined" type="number" size="small"
              onChange={(e) => setCanvasAngle(parseInt(e.target.value))} />
        </div>
      </div>
    </div>
  );
};

export default PenBasedRenderer;