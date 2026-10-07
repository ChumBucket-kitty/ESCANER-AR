// AR / demo view. Currently a placeholder overlay on top of the camera feed.
// TODO: replace with real image tracking (e.g. MindAR) using book.target
//       (a compiled .mind file in public/targets/) and anchor book.animation to it.
let stream = null;

export async function startAR(book, videoEl, overlayEl) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
    });
    videoEl.srcObject = stream;
    await videoEl.play();
  } catch (err) {
    console.warn('Camera unavailable in AR view', err);
  }

  overlayEl.replaceChildren();
  const el = book.animation ? createMedia(book.animation) : null;
  overlayEl.appendChild(el || placeholder());
}

function createMedia(path) {
  if (/\.(mp4|webm)$/i.test(path)) {
    const v = document.createElement('video');
    Object.assign(v, { src: path, loop: true, muted: true, autoplay: true, playsInline: true });
    v.className = 'ar-media';
    // Fall back to the placeholder if the asset is missing.
    v.addEventListener('error', () => v.replaceWith(placeholder()));
    v.play().catch(() => {});
    return v;
  }
  if (/\.(gif|png|svg|webp)$/i.test(path)) {
    const img = document.createElement('img');
    img.src = path;
    img.className = 'ar-media';
    img.addEventListener('error', () => img.replaceWith(placeholder()));
    return img;
  }
  return null; // e.g. .glb needs a 3D renderer (TODO)
}

function placeholder() {
  const d = document.createElement('div');
  d.className = 'ar-placeholder';
  return d;
}

export function stopAR(videoEl) {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  videoEl.srcObject = null;
}
