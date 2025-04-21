/**
 * Converts a number to a subcurrency representation.
 * @param {number} amount - The amount to convert.
 * @param {number} factor - The conversion factor (default is 100).
 * @returns {number} - The converted subcurrency representation.
 */
export function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

/**
 * Converts currency using the ExchangeRate-API.
 * @param {number} amount - The amount to convert.
 * @param {string} from - The source currency code (e.g., "USD").
 * @param {string} to - The target currency code (e.g., "TND").
 * @returns {Promise<number>} - The converted amount.
 */
export const convertCurrency = async (
  amount: number,
  from: string,
  to: string
): Promise<number> => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
    if (!API_KEY) {
      throw new Error(
        "EXCHANGE_API_KEY manquants dans les variables d’environnement."
      );
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
    );

    if (!response.ok) {
      throw new Error(
        `La demande d’API a échoué avec l’état : ${response.status}`
      );
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error(`Erreur API: ${data["error-type"] || "Erreur inconnue"}`);
    }

    const rate = data.conversion_rates?.[to];
    if (typeof rate !== "number") {
      throw new Error(`Taux de change introuvable pour ${to}`);
    }

    const convertedAmount = amount * rate;
    return Math.round(convertedAmount * 1000) / 1000;
  } catch (error) {
    console.error("Erreur de conversion de devise:", error);
    return 0;
  }
};

export const computeAverageColor = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context not available");
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => reject("Failed to load image");
  });
};

export const getLuminance = (color: string): number => {
  const rgb = color.match(/\d+/g);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map(Number);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};