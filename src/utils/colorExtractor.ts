// Extract dominant colors from an image and convert to HSL for theming
export interface ExtractedColors {
  primary: string; // HSL values like "220 90% 56%"
  secondary: string;
  accent: string;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslString(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}

export function extractColorsFromImage(imageUrl: string): Promise<ExtractedColors> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 50;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      const colorMap: Record<string, { r: number; g: number; b: number; count: number }> = {};

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 128) continue; // skip transparent
        // Skip near-white and near-black
        if (r > 230 && g > 230 && b > 230) continue;
        if (r < 25 && g < 25 && b < 25) continue;

        // Quantize to reduce color space
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;

        if (!colorMap[key]) colorMap[key] = { r: qr, g: qg, b: qb, count: 0 };
        colorMap[key].count++;
      }

      const sorted = Object.values(colorMap).sort((a, b) => b.count - a.count);

      if (sorted.length === 0) {
        resolve({
          primary: "220 90% 56%",
          secondary: "220 14% 94%",
          accent: "340 82% 52%",
        });
        return;
      }

      const [h1, s1, l1] = rgbToHsl(sorted[0].r, sorted[0].g, sorted[0].b);
      const primary = hslString(h1, Math.max(s1, 60), Math.min(Math.max(l1, 35), 60));

      const second = sorted[1] || sorted[0];
      const [h2, s2, l2] = rgbToHsl(second.r, second.g, second.b);
      const secondary = hslString(h2, Math.max(s2, 10), Math.min(Math.max(l2, 85), 95));

      const third = sorted[2] || sorted[1] || sorted[0];
      const [h3, s3, l3] = rgbToHsl(third.r, third.g, third.b);
      const accent = hslString(h3, Math.max(s3, 50), Math.min(Math.max(l3, 40), 55));

      resolve({ primary, secondary, accent });
    };
    img.onerror = () => {
      resolve({
        primary: "220 90% 56%",
        secondary: "220 14% 94%",
        accent: "340 82% 52%",
      });
    };
    img.src = imageUrl;
  });
}

export function applyThemeColors(colors: ExtractedColors) {
  const root = document.documentElement;
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--ring", colors.primary);
  root.style.setProperty("--sidebar-primary", colors.primary);
  root.style.setProperty("--sidebar-ring", colors.primary);
  root.style.setProperty("--badge-info", colors.primary);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--muted", colors.secondary);
  root.style.setProperty("--accent", colors.accent);

  // Update gradient
  const [h] = colors.primary.split(" ");
  const accentH = colors.accent.split(" ")[0];
  root.style.setProperty(
    "--hero-gradient",
    `linear-gradient(135deg, hsl(${colors.primary}), hsl(${accentH} 80% 60%))`
  );
}
