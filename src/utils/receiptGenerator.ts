/**
 * HTML5 Canvas Thermal Diner Receipt Generator
 * Renders high-resolution retro diner receipts with jagged cut edges, lipstick kiss stamps, and barcodes.
 */

export interface ReceiptItem {
  name: string;
  price: string;
  mods?: string[];
}

export interface ReceiptData {
  orderNumber: string;
  customerName: string;
  table: string;
  serverName: string;
  dateStr: string;
  items: ReceiptItem[];
  subtotal: string;
  tax: string;
  total: string;
  baristaNote: string;
  vibeScore: string;
  pairedTrack: string;
}

export function drawReceiptToCanvas(canvas: HTMLCanvasElement, data: ReceiptData): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const scale = 2; // Hi-DPI crisp rendering
  const width = 420 * scale;
  const baseHeight = (580 + (data.items.length * 45) + (data.items.reduce((acc, item) => acc + (item.mods?.length || 0), 0) * 18)) * scale;
  const height = baseHeight;

  canvas.width = width;
  canvas.height = height;
  ctx.scale(scale, scale);

  const w = 420;
  const h = height / scale;

  // Background Paper (Warm thermal paper)
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, w, h);

  // Subtle thermal paper grain texture
  ctx.fillStyle = 'rgba(235, 220, 205, 0.25)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }

  // Draw Jagged / Zig-Zag Top & Bottom Receipt Edges
  ctx.fillStyle = '#170c07'; // Match background
  const toothWidth = 14;
  const toothHeight = 8;
  
  // Top teeth cutouts
  ctx.beginPath();
  for (let x = 0; x < w; x += toothWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + toothWidth / 2, toothHeight);
    ctx.lineTo(x + toothWidth, 0);
  }
  ctx.fill();

  // Bottom teeth cutouts
  ctx.beginPath();
  for (let x = 0; x < w; x += toothWidth) {
    ctx.moveTo(x, h);
    ctx.lineTo(x + toothWidth / 2, h - toothHeight);
    ctx.lineTo(x + toothWidth, h);
  }
  ctx.fill();

  let curY = 32;

  // Header
  ctx.fillStyle = '#2b1a13';
  ctx.font = '900 20px "Courier Prime", monospace';
  ctx.textAlign = 'center';
  ctx.fillText("☕ SABRINA'S ESPRESSO DINER ☕", w / 2, curY);

  curY += 20;
  ctx.font = '600 12px "Courier Prime", monospace';
  ctx.fillStyle = '#6f4c3d';
  ctx.fillText("EST. 2024 • SHORT N' SWEET BLVD", w / 2, curY);
  
  curY += 16;
  ctx.font = '11px "Courier Prime", monospace';
  ctx.fillText("TEL: 1-800-ESPRESSO • NYC / LA", w / 2, curY);

  // Dashed Separator
  curY += 16;
  drawDashedLine(ctx, 20, curY, w - 20, curY);

  // Order Meta Info
  curY += 18;
  ctx.font = 'bold 12px "Courier Prime", monospace';
  ctx.fillStyle = '#2b1a13';
  ctx.textAlign = 'left';
  ctx.fillText(`ORDER #${data.orderNumber}`, 24, curY);
  ctx.textAlign = 'right';
  ctx.fillText(`TABLE: ${data.table}`, w - 24, curY);

  curY += 16;
  ctx.font = '11px "Courier Prime", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`DATE: ${data.dateStr}`, 24, curY);
  ctx.textAlign = 'right';
  ctx.fillText(`SERVER: ${data.serverName}`, w - 24, curY);

  curY += 16;
  ctx.fillText(`GUEST: ${data.customerName.toUpperCase()}`, 24, curY);
  ctx.textAlign = 'right';
  ctx.fillText(`MOOD: ${data.vibeScore}`, w - 24, curY);

  curY += 14;
  drawDashedLine(ctx, 20, curY, w - 20, curY);

  // Column Headers
  curY += 18;
  ctx.font = 'bold 11px "Courier Prime", monospace';
  ctx.textAlign = 'left';
  ctx.fillText("QTY  ITEM DESCRIPTION", 24, curY);
  ctx.textAlign = 'right';
  ctx.fillText("AMOUNT", w - 24, curY);

  curY += 10;
  drawDashedLine(ctx, 20, curY, w - 20, curY);

  // Items List
  curY += 18;
  data.items.forEach((item) => {
    ctx.font = 'bold 12px "Courier Prime", monospace';
    ctx.fillStyle = '#2b1a13';
    ctx.textAlign = 'left';
    ctx.fillText(` 1x  ${item.name}`, 24, curY);
    ctx.textAlign = 'right';
    ctx.fillText(item.price, w - 24, curY);

    if (item.mods && item.mods.length > 0) {
      item.mods.forEach((mod) => {
        curY += 15;
        ctx.font = 'italic 10px "Courier Prime", monospace';
        ctx.fillStyle = '#8b614d';
        ctx.textAlign = 'left';
        ctx.fillText(`     + ${mod}`, 24, curY);
      });
    }
    curY += 22;
  });

  drawDashedLine(ctx, 20, curY, w - 20, curY);

  // Subtotals
  curY += 18;
  ctx.font = '11px "Courier Prime", monospace';
  ctx.fillStyle = '#462e24';
  ctx.textAlign = 'left';
  ctx.fillText("SUBTOTAL:", 180, curY);
  ctx.textAlign = 'right';
  ctx.fillText(data.subtotal, w - 24, curY);

  curY += 16;
  ctx.textAlign = 'left';
  ctx.fillText("TAX (SWEETNESS):", 180, curY);
  ctx.textAlign = 'right';
  ctx.fillText(data.tax, w - 24, curY);

  curY += 18;
  ctx.font = 'bold 15px "Courier Prime", monospace';
  ctx.fillStyle = '#2b1a13';
  ctx.textAlign = 'left';
  ctx.fillText("TOTAL DUE:", 180, curY);
  ctx.textAlign = 'right';
  ctx.fillText(data.total, w - 24, curY);

  curY += 16;
  drawDashedLine(ctx, 20, curY, w - 20, curY);

  // Paired Soundtrack
  curY += 18;
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px "Courier Prime", monospace';
  ctx.fillStyle = '#e11d48';
  ctx.fillText(`🎶 SOUNDTRACK PAIRING: "${data.pairedTrack}"`, w / 2, curY);

  // Barista Hand-written note
  curY += 24;
  ctx.font = 'bold 13px "Caveat", cursive';
  ctx.fillStyle = '#9f1239';
  ctx.fillText(`"${data.baristaNote}"`, w / 2, curY);
  curY += 16;
  ctx.fillText("- xoxo Sabrina 💋", w / 2, curY);

  // Barcode
  curY += 24;
  drawBarcode(ctx, w / 2 - 110, curY, 220, 36);

  curY += 46;
  ctx.font = '9px "Courier Prime", monospace';
  ctx.fillStyle = '#8b614d';
  ctx.fillText("THANK YOU FOR KEEPING ME UP TIL MORNING ☕", w / 2, curY);

  // Draw Lipstick Kiss Stamp in the bottom right corner
  drawLipstickKiss(ctx, w - 75, h - 85);

  return canvas.toDataURL('image/png');
}

function drawDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.save();
  ctx.strokeStyle = '#c5a894';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = '#2b1a13';
  let curX = x;
  const pattern = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 2, 1, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3];
  
  for (let i = 0; curX < x + width; i++) {
    const barWidth = (pattern[i % pattern.length] || 2) * 1.5;
    const isGap = i % 2 === 1;
    if (!isGap && curX + barWidth <= x + width) {
      ctx.fillRect(curX, y, barWidth, height);
    }
    curX += barWidth + (isGap ? 1.5 : 1);
  }
}

function drawLipstickKiss(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.2);

  // Kiss Mark Outer Glow / Stamp effect
  ctx.fillStyle = 'rgba(225, 29, 72, 0.75)';
  
  // Upper Lip Left
  ctx.beginPath();
  ctx.ellipse(-14, -6, 14, 7, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Upper Lip Right
  ctx.beginPath();
  ctx.ellipse(14, -6, 14, 7, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Lower Lip
  ctx.beginPath();
  ctx.ellipse(0, 8, 24, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lip cleft indentation
  ctx.fillStyle = '#fdfbf7';
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
