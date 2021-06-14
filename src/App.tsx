import React, { useState } from 'react';
import QRReader, { QRCode } from './QRReader';

function App() {
  const [stopOnRecognize, setStopOnRecognize] = React.useState(true);
  const [param, setParam] = useState({
    width: 500,
    height: 500,
    pause: true,
  });

  const [code, setCode] = useState('');

  const onRecognizeCode: (e: QRCode) => boolean = (e) => {
    setCode(e.data);
    if (stopOnRecognize) {
      setParam( e => { return {...e, pause: true}; });
    }
    return true;
  }

  const toggleVideoStream = () => {
    setParam( e => { return {...e, pause: !e.pause}; });
  }

  return (
    <div className="App">
      <QRReader {...param} onRecognizeCode={onRecognizeCode} />
      <div>
        <label>
          <input type="radio" name="rdo" value="0" onChange={(e) => setStopOnRecognize(e.target.value === "0")} checked={stopOnRecognize} />認識時に自動停止
        </label>
        <label>
          <input type="radio" name="rdo" value="1" onChange={(e) => setStopOnRecognize(e.target.value === "0")} checked={!stopOnRecognize} />認識時も処理継続
        </label>
        
        <button onClick={toggleVideoStream}>{(param.pause? '再開': '停止')}</button>
        <p>QRコード：{code}</p>
      </div>

    </div>
  );
}

export default App;
