import { GuidancePayload } from '../../types/guidance';

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    const width = ctx.measureText(test).width;
    if (width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const toBlob = (canvas: HTMLCanvasElement) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to create image'));
    }, 'image/png', 0.92);
  });
};

export const createGuidanceShareImage = async (payload: GuidancePayload) => {
  const w = 1080;
  const h = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0B0F1A');
  bg.addColorStop(0.4, '#0D0F2A');
  bg.addColorStop(1, '#100B1A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const glow1 = ctx.createRadialGradient(w * 0.2, h * 0.15, 0, w * 0.2, h * 0.15, w * 0.55);
  glow1.addColorStop(0, 'rgba(109,93,246,0.25)');
  glow1.addColorStop(1, 'rgba(109,93,246,0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);

  const glow2 = ctx.createRadialGradient(w * 0.85, h * 0.2, 0, w * 0.85, h * 0.2, w * 0.55);
  glow2.addColorStop(0, 'rgba(245,166,35,0.22)');
  glow2.addColorStop(1, 'rgba(245,166,35,0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 2.2 + 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const pad = 80;
  const cardX = pad;
  const cardY = 140;
  const cardW = w - pad * 2;
  const cardH = h - 240;

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(245,166,35,0.9)';
  ctx.font = '900 26px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText('TODAY’S GUIDANCE', cardX + 52, cardY + 78);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '700 24px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText(`${payload.header.weekdayLabel} • ${payload.header.dateLabel}`, cardX + 52, cardY + 118);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '700 20px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText(payload.header.vedicLine, cardX + 52, cardY + 152);

  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '900 54px system-ui, -apple-system, Segoe UI, sans-serif';
  const headlineLines = wrapText(ctx, payload.hero.themeHeadline, cardW - 104);
  let y = cardY + 240;
  for (const line of headlineLines.slice(0, 3)) {
    ctx.fillText(line, cardX + 52, y);
    y += 64;
  }

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '600 30px system-ui, -apple-system, Segoe UI, sans-serif';
  const para = payload.hero.paragraphs.join(' ');
  const paraLines = wrapText(ctx, para, cardW - 104);
  y += 10;
  for (const line of paraLines.slice(0, 8)) {
    ctx.fillText(line, cardX + 52, y);
    y += 44;
  }

  y += 20;
  const boxH = 92;
  const boxGap = 18;
  const boxW = (cardW - 104 - boxGap) / 2;

  drawSmallBox(ctx, cardX + 52, y, boxW, boxH, 'FOCUS', payload.hero.primaryFocus);
  drawSmallBox(ctx, cardX + 52 + boxW + boxGap, y, boxW, boxH, 'AVOID', payload.hero.avoidLine);
  y += boxH + 20;

  if (payload.hero.bestWindow) {
    drawSmallBox(ctx, cardX + 52, y, cardW - 104, boxH, 'BEST TIME', `${payload.hero.bestWindow.startTime}${payload.hero.bestWindow.endTime ? ` – ${payload.hero.bestWindow.endTime}` : ''}`);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '700 18px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText('Bhava360', cardX + 52, cardY + cardH - 52);

  return { blob: await toBlob(canvas), fileName: `todays-guidance-${payload.dateKey}.png` };
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const drawSmallBox = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string, value: string) => {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRect(ctx, x, y, w, h, 26);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '900 18px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText(label, x + 24, y + 30);

  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.font = '800 24px system-ui, -apple-system, Segoe UI, sans-serif';
  const maxWidth = w - 48;
  const lines = wrapText(ctx, value, maxWidth);
  ctx.fillText(lines[0] || value, x + 24, y + 64);
};

