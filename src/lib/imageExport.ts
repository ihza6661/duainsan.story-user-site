import html2canvas from "html2canvas";

export type ImageFormat = "png" | "jpeg";

export interface ImageExportOptions {
  format?: ImageFormat;
  quality?: number; // 0-1 for JPEG
  scale?: number; // Resolution multiplier (default 2 for high quality)
  backgroundColor?: string;
  width?: number;
  height?: number;
}

/**
 * Export a DOM element to an image file
 */
export async function exportElementToImage(
  element: HTMLElement,
  filename: string,
  options: ImageExportOptions = {}
): Promise<void> {
  const {
    format = "png",
    quality = 0.95,
    scale = 2,
    backgroundColor = "#ffffff",
    width,
    height,
  } = options;

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      useCORS: true, // Allow cross-origin images
      allowTaint: false,
      logging: false,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      if (format === "jpeg") {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      } else {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      }
    });

    if (!blob) {
      throw new Error("Failed to generate image blob");
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Image export error:", error);
    throw new Error("Failed to export image: " + (error as Error).message);
  }
}

/**
 * Export invitation preview to image
 * Finds the invitation container and exports it
 */
export async function exportInvitationToImage(
  invitationId: number,
  format: ImageFormat = "png",
  options: Partial<ImageExportOptions> = {}
): Promise<void> {
  // Find the invitation preview container
  const container = document.getElementById("invitation-preview");
  
  if (!container) {
    throw new Error("Invitation preview container not found");
  }

  const filename = `invitation-${invitationId}`;
  
  await exportElementToImage(container, filename, {
    format,
    scale: 3, // High resolution for invitations
    quality: 0.95,
    ...options,
  });
}

/**
 * Get optimal dimensions for invitation image export
 * Based on common social media sizes
 */
export function getInvitationImageDimensions(preset: "social" | "print" | "hd" = "social") {
  const presets = {
    social: { width: 1080, height: 1920 }, // Instagram Story size
    print: { width: 2480, height: 3508 }, // A4 at 300 DPI
    hd: { width: 1920, height: 1080 }, // HD landscape
  };

  return presets[preset];
}

/**
 * Prepare element for image capture
 * Ensures all images are loaded and styles are applied
 */
export async function prepareElementForCapture(element: HTMLElement): Promise<void> {
  // Wait for all images to load
  const images = element.querySelectorAll("img");
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000);
    });
  });

  await Promise.all(imagePromises);

  // Wait for fonts to load
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Small delay to ensure styles are fully applied
  await new Promise((resolve) => setTimeout(resolve, 100));
}
