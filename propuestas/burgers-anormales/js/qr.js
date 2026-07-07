/* qr.js — lector de QR con la cámara (BarcodeDetector nativo).
   Cada burger lleva un QR impreso con la URL .../#/sello/<id>.
   TODO PRODUCCIÓN: añadir fallback jsQR (lib ligera) para navegadores sin
   BarcodeDetector (iOS < 17, Firefox). En la demo hay "simular sellado". */

export function qrSoportado() {
  return 'BarcodeDetector' in window && navigator.mediaDevices?.getUserMedia;
}

export async function iniciarScanner(video, onCode) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false,
  });
  video.srcObject = stream;
  await video.play();

  const detector = new BarcodeDetector({ formats: ['qr_code'] });
  let activo = true;

  async function tick() {
    if (!activo) return;
    try {
      const codes = await detector.detect(video);
      if (codes.length && activo) {
        onCode(codes[0].rawValue);
        return; // el llamador decide si parar
      }
    } catch (e) { /* frame no listo aún */ }
    setTimeout(tick, 180);
  }
  tick();

  return {
    parar() {
      activo = false;
      stream.getTracks().forEach((t) => t.stop());
    },
    get activo() { return activo; },
  };
}

/* Extrae el id de burger de lo que venga en el QR:
   admite ".../#/sello/raro", "#/sello/raro" o simplemente "raro". */
export function parseCodigoSello(raw, idsValidos) {
  const m = String(raw).match(/#\/sello\/([a-z0-9_-]+)/i);
  const id = m ? m[1].toLowerCase() : String(raw).trim().toLowerCase();
  return idsValidos.includes(id) ? id : null;
}
