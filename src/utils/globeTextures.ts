/**
 * High-definition procedural canvas textures for the 3D Holographic Globe
 * Generates Earth day texture, specular water mask, and cloud layers
 * completely offline with zero external network dependencies.
 */

export function createProceduralEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Deep oceanic gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#040d21');
  oceanGrad.addColorStop(0.5, '#020b18');
  oceanGrad.addColorStop(1, '#051126');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Oceanic bathymetry contour lines for cyber-futuristic telemetry feel
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat < canvas.height; lat += 32) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(canvas.width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon < canvas.width; lon += 32) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, canvas.height);
    ctx.stroke();
  }

  // Draw simplified world continent landmasses (Mercator/Equirectangular)
  ctx.fillStyle = '#1e3a34'; // Lush dark bio-green
  ctx.strokeStyle = '#34d399'; // Emerald glowing coastlines
  ctx.lineWidth = 1.5;

  function drawLandPoly(points: [number, number][], fill = '#103028', stroke = '#059669') {
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    points.forEach(([xPct, yPct], i) => {
      const x = (xPct / 100) * canvas.width;
      const y = (yPct / 100) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // North America
  drawLandPoly([
    [10, 15], [18, 12], [28, 14], [32, 24], [25, 34], [24, 42], [18, 48],
    [15, 38], [11, 30], [8, 22]
  ]);
  // South America
  drawLandPoly([
    [26, 48], [33, 49], [38, 56], [35, 68], [30, 80], [27, 85], [26, 72], [23, 56]
  ]);
  // Europe
  drawLandPoly([
    [45, 18], [55, 16], [58, 28], [52, 34], [47, 36], [44, 28]
  ]);
  // Africa
  drawLandPoly([
    [44, 38], [56, 36], [60, 48], [58, 65], [52, 75], [47, 72], [42, 54], [40, 44]
  ]);
  // Eurasia / Asia
  drawLandPoly([
    [56, 16], [82, 14], [88, 22], [85, 36], [78, 46], [72, 48], [68, 40], [60, 34]
  ]);
  // Indian subcontinent
  drawLandPoly([
    [66, 40], [72, 42], [70, 56], [67, 56], [65, 48]
  ]);
  // Southeast Asia & Archipelagos
  drawLandPoly([
    [76, 48], [82, 50], [84, 60], [78, 62], [75, 54]
  ]);
  // Australia
  drawLandPoly([
    [80, 68], [88, 66], [90, 76], [86, 82], [79, 80], [78, 72]
  ]);

  // City night light points (golden/cyan sparks)
  const cityDots: [number, number][] = [
    [18, 30], [22, 32], [25, 34], [28, 52], [32, 65], [47, 24], [52, 26],
    [48, 44], [58, 42], [68, 45], [70, 48], [78, 32], [82, 36], [82, 72]
  ];

  cityDots.forEach(([xPct, yPct]) => {
    const x = (xPct / 100) * canvas.width;
    const y = (yPct / 100) * canvas.height;
    const grad = ctx.createRadialGradient(x, y, 1, x, y, 8);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, 'rgba(52, 211, 153, 0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas;
}

/**
 * Creates procedural wispy atmospheric cloud texture
 */
export function createProceduralCloudsTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    const radiusX = 30 + Math.random() * 80;
    const radiusY = 10 + Math.random() * 25;

    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}
