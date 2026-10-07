// App flow: scan -> lookup -> AR view (or "not found" message and rescan).
import './style.css';
import { startScanner, stopScanner } from './scanner.js';
import { findBook } from './books.js';
import { startAR, stopAR } from './ar.js';

const $ = (id) => document.getElementById(id);
const scannerScreen = $('scanner-screen');
const arScreen = $('ar-screen');
const status = $('scanner-status');

const PROMPT = 'Point the camera at a book barcode';
let busy = false;

function setStatus(text, isError = false) {
  status.textContent = text;
  status.classList.toggle('error', isError);
}

async function handleCode(code) {
  if (busy) return;
  busy = true;
  try {
    const book = await findBook(code);
    if (!book) {
      setStatus(`No book found for ${code}. Try another barcode.`, true);
      setTimeout(() => { setStatus(PROMPT); busy = false; }, 2500);
      return;
    }
    stopScanner();
    scannerScreen.classList.add('hidden');
    arScreen.classList.remove('hidden');
    $('ar-title').textContent = book.title;
    await startAR(book, $('ar-video'), $('ar-overlay'));
    busy = false;
  } catch (err) {
    setStatus(`Error: ${err.message}`, true);
    busy = false;
  }
}

async function showScanner() {
  stopAR($('ar-video'));
  arScreen.classList.add('hidden');
  scannerScreen.classList.remove('hidden');
  setStatus(PROMPT);
  try {
    await startScanner($('scanner-video'), handleCode);
  } catch (err) {
    setStatus('Camera unavailable. Allow access (HTTPS required) or type the ISBN below.', true);
  }
}

$('manual-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('manual-isbn').value.trim();
  if (v) handleCode(v);
});
$('back-button').addEventListener('click', showScanner);

showScanner();
