/**
 * NFT Composite Image Generator
 * Creates a branded certificate-style image with user's item photo, item name, and owner name
 */

interface NFTImageData {
  itemImage: string; // base64 data URL
  itemName: string;
  ownerName: string;
}

export class NFTImageGenerator {
  private static readonly CANVAS_WIDTH = 800;
  private static readonly CANVAS_HEIGHT = 1000;
  private static readonly IMAGE_HEIGHT = 600;
  private static readonly PADDING = 40;
  private static readonly BORDER_RADIUS = 20;

  static async generateNFTImage(data: NFTImageData): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = this.CANVAS_WIDTH;
      canvas.height = this.CANVAS_HEIGHT;

      // Create image element from base64
      const img = new Image();
      img.onload = () => {
        try {
          this.drawCompositeImage(ctx, img, data);
          const compositeImageDataURL = canvas.toDataURL('image/png', 1.0);
          resolve(compositeImageDataURL);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load item image'));
      img.src = data.itemImage;
    });
  }

  private static drawCompositeImage(
    ctx: CanvasRenderingContext2D, 
    itemImg: HTMLImageElement, 
    data: NFTImageData
  ) {
    // Clear canvas with project background color
    ctx.fillStyle = '#0F0F10'; // --bg-main
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    // Draw main container with glass effect
    this.drawGlassContainer(ctx);
    
    // Draw item image with rounded corners
    this.drawItemImage(ctx, itemImg);
    
    // Draw text sections
    this.drawItemName(ctx, data.itemName);
    this.drawOwnerName(ctx, data.ownerName);
    
    // Draw Auctor branding
    this.drawBranding(ctx);
  }

  private static drawGlassContainer(ctx: CanvasRenderingContext2D) {
    const x = this.PADDING;
    const y = this.PADDING;
    const width = this.CANVAS_WIDTH - (this.PADDING * 2);
    const height = this.CANVAS_HEIGHT - (this.PADDING * 2);

    // Create rounded rectangle path
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, this.BORDER_RADIUS);
    
    // Glass effect background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.CANVAS_HEIGHT);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.03)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private static drawItemImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    const imgX = this.PADDING * 2;
    const imgY = this.PADDING * 2;
    const imgWidth = this.CANVAS_WIDTH - (this.PADDING * 4);
    const imgHeight = this.IMAGE_HEIGHT;

    // Create clipping path for rounded image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgWidth, imgHeight, this.BORDER_RADIUS);
    ctx.clip();

    // Calculate aspect ratio and draw image
    const aspectRatio = img.width / img.height;
    const containerAspectRatio = imgWidth / imgHeight;

    let drawWidth = imgWidth;
    let drawHeight = imgHeight;
    let drawX = imgX;
    let drawY = imgY;

    if (aspectRatio > containerAspectRatio) {
      // Image is wider than container
      drawHeight = imgHeight;
      drawWidth = drawHeight * aspectRatio;
      drawX = imgX - (drawWidth - imgWidth) / 2;
    } else {
      // Image is taller than container
      drawWidth = imgWidth;
      drawHeight = drawWidth / aspectRatio;
      drawY = imgY - (drawHeight - imgHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Add subtle border around image
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgWidth, imgHeight, this.BORDER_RADIUS);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private static drawItemName(ctx: CanvasRenderingContext2D, itemName: string) {
    const y = this.PADDING * 2 + this.IMAGE_HEIGHT + 60;
    
    ctx.fillStyle = '#FFFFFF'; // --text-main
    ctx.font = 'bold 36px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    
    const maxWidth = this.CANVAS_WIDTH - (this.PADDING * 4);
    this.wrapText(ctx, itemName.toUpperCase(), this.CANVAS_WIDTH / 2, y, maxWidth, 45);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  private static drawOwnerName(ctx: CanvasRenderingContext2D, ownerName: string) {
    const y = this.PADDING * 2 + this.IMAGE_HEIGHT + 140;
    
    // Owner label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // --text-muted
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OWNED BY', this.CANVAS_WIDTH / 2, y);
    
    // Owner name
    ctx.fillStyle = '#6BEFA5'; // --accent-green
    ctx.font = 'bold 28px Inter, system-ui, sans-serif';
    ctx.fillText(ownerName.toUpperCase(), this.CANVAS_WIDTH / 2, y + 40);
  }

  private static drawBranding(ctx: CanvasRenderingContext2D) {
    const y = this.CANVAS_HEIGHT - this.PADDING * 2;
    
    // Left side - Auctor
    ctx.fillStyle = '#FFD66B'; // --accent-gold
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('AUCTOR', this.PADDING * 2, y - 30);
    
    // Right side - Digital Performance Network
    ctx.fillStyle = '#FFD66B'; // --accent-gold
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Digital Performance Network', this.CANVAS_WIDTH - this.PADDING * 2, y - 30);
    
    // Center bottom subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
   }

  private static wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  static saveToLocalStorage(imageDataURL: string, key: string = 'nft_composite_image') {
    try {
      localStorage.setItem(key, imageDataURL);
    } catch (error) {
      console.warn('Failed to save composite image to localStorage:', error);
    }
  }

  static getFromLocalStorage(key: string = 'nft_composite_image'): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to retrieve composite image from localStorage:', error);
      return null;
    }
  }

  static clearFromLocalStorage(key: string = 'nft_composite_image') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear composite image from localStorage:', error);
    }
  }

  static downloadImage(imageDataURL: string, filename: string = 'auctor-nft-certificate.png') {
    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = imageDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }

  static getFinalNFTImageForMinting(): string | null {
    try {
      return localStorage.getItem('final_nft_image_for_minting');
    } catch (error) {
      console.warn('Failed to retrieve final NFT image for minting:', error);
      return null;
    }
  }

  static clearFinalNFTImageForMinting() {
    try {
      localStorage.removeItem('final_nft_image_for_minting');
    } catch (error) {
      console.warn('Failed to clear final NFT image for minting:', error);
    }
  }

  static convertDataURLToBlob(dataURL: string): Blob | null {
    try {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error('Failed to convert data URL to blob:', error);
      return null;
    }
  }
}
