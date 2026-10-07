// Browser barcode scanning using ZXing.
import { BrowserMultiFormatReader } from '@zxing/browser';

let controls = null;

// Starts scanning on a <video> element; calls onResult(text) for each hit.
export async function startScanner(videoEl, onResult) {
  const reader = new BrowserMultiFormatReader();
  controls = await reader.decodeFromConstraints(
    { video: { facingMode: { ideal: 'environment' } } },
    videoEl,
    (result) => {
      if (result) onResult(result.getText());
    }
  );
}

export function stopScanner() {
  if (controls) {
    controls.stop();
    controls = null;
  }
}
