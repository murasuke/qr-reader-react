/* ./worker/worker.ts */
import jsqr, { QRCode } from 'jsqr';

export function processData(data: ImageData): QRCode {
  // Process the data without stalling the UI
  const qr = jsqr(data.data, data.width, data.height);
  if (qr) {
    console.log(qr.data);
    return qr;
  }
  return null;
}
