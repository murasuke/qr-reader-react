import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import jsqr, { QRCode } from 'jsqr';
export type { QRCode } from 'jsqr';

export type QRReaderProps = {
  width?: number,
  height?: number,
  pause?: boolean,
  showQRFrame?: boolean,
  onRecognizeCode?: (e: QRCode) => boolean,
}

type Point = {
  x: number;
  y: number;
}

type OverlayPosition = {
  top: number,
  left: number,
  width: number,
  height: number,
}

const RelativeWrapperDiv = styled.div<QRReaderProps>`
  position:relative;
  width:${(props) => props.width}px;
  height:${(props) => props.height}px;
`;

const VideoArea = styled.video`
  position: absolute; z-index: -100;
`;

const OverlayDiv = styled.div<OverlayPosition>`
  position: absolute; border: 1px solid #F00;
  top :${(props) => props.top }px;
  left :${(props) => props.left }px;
  width:${(props) => props.width}px;
  height:${(props) => props.height}px;
`;


const QRReader: React.FC<QRReaderProps> = (props) => {
  // const { overlayPosition, setOverlayPosition } = useState<OverlayPosition>({ top:0, left: 0, width: 0, height: 0 });
  const [ overlay, setOverlay ] = useState({ top:0, left: 0, width: 0, height: 0 });
  
  const video = useRef(null as HTMLVideoElement);
  let timerId = useRef(null);
  // let context = useRef(null);// OffscreenCanvasRenderingContext2D;
  useEffect( () => {
    (async() => {
      if (props.pause) {
        video.current.pause();
        clearInterval(timerId.current);
        timerId.current = null;
        return;
      }

      const { width, height } = props;

      const constraints = { 
        audio: false, 
        video: {
          facingMode: 'environment', 
          width, 
          height, 
      }};
    
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.current.srcObject = stream;
      video.current.play();
  
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext('2d');

      if (!timerId.current) {
        timerId.current = setInterval(() => {
          context.drawImage(video.current, 0, 0, width, height);
          const imageData = context.getImageData(0, 0, width, height);
          const code = jsqr(imageData.data, imageData.width, imageData.height);
          if (code) {
            console.log(code.data);
            if (props.showQRFrame) {
              drawRect(code.location.topLeftCorner, code.location.bottomRightCorner);
            }
            if (props.onRecognizeCode) props.onRecognizeCode(code);               
          }
        }, 300);
      }
      return () => clearInterval(timerId.current);
    })();
  },[props]);

  const drawRect = (topLeft: Point, bottomRight: Point) => {
    const { x: x1, y: y1 } = topLeft;
    const { x: x2, y: y2 }= bottomRight;

    setOverlay({
      top: y1,
      left: x1,
      width: x2 - x1,
      height: y2 - y1,
    });
  };
  return (    
    <RelativeWrapperDiv {...props}>
      <VideoArea ref={video}></VideoArea>
      <OverlayDiv {...overlay}></OverlayDiv>
    </RelativeWrapperDiv>    
  );
}

// propsのデフォルト値を設定
QRReader.defaultProps = {
  width: 500,
  height: 500,
  pause: false,
  showQRFrame: true,
};

export default QRReader;