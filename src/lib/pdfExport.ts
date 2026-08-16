import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { InvitationCardData } from '../types';

export type PdfPaperSize = 'a4' | 'a3' | 'a5';

export interface PdfExportOptions {
  filename?: string;
  quality?: number;
  orientation?: 'landscape' | 'portrait';
  paperSize?: PdfPaperSize;
  invitationData?: InvitationCardData;
  scale?: number;
}

/**
 * Generates an ultra high-definition PDF document from an HTML element
 */
export async function generatePdfBlob(
  elementId: string,
  options: PdfExportOptions = {}
): Promise<{ pdf: jsPDF; blob: Blob; dataUrl: string } | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF generation`);
    return null;
  }

  const {
    orientation = 'landscape',
    paperSize = 'a4',
    quality = 1.0,
    invitationData,
  } = options;

  try {
    // Ultra high resolution rendering (pixel ratio 3.5 for super-crisp text and arabesque vectors)
    const imgData = await toPng(element, {
      quality,
      pixelRatio: 3.5,
      cacheBust: true,
      skipFonts: true,
    });

    // Create jsPDF instance with chosen paper size
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: paperSize,
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Document Metadata
    const docTitle = invitationData?.recipientName 
      ? `Affiche & Invitation • ${invitationData.recipientName}`
      : 'Affiche Officielle • Semaine Culturelle Hassi El Bekay 2026';

    pdf.setProperties({
      title: docTitle,
      subject: 'Semaine Culturelle et Sportive de Hassi El Bekay - 3e Édition 2026',
      author: 'Coordination Générale pour le Développement de Hassi El Bekay',
      creator: 'Plateforme Officielle du Festival 2026',
      keywords: 'Affiche, Invitation, Hassi El Bekay, Kiffa, Assaba, Mauritanie, 2026, Pass Entrée',
    });

    // Subtle luxury background
    pdf.setFillColor(252, 250, 244);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Margins (6mm for grand format poster to maximize visual impact)
    const margin = paperSize === 'a3' ? 10 : 6;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const elementWidth = element.offsetWidth || 920;
    const elementHeight = element.offsetHeight || 600;
    const elementAspect = elementWidth / elementHeight;
    const availableAspect = availableWidth / availableHeight;

    let finalWidth = availableWidth;
    let finalHeight = availableHeight;

    if (elementAspect > availableAspect) {
      finalWidth = availableWidth;
      finalHeight = availableWidth / elementAspect;
    } else {
      finalHeight = availableHeight;
      finalWidth = availableHeight * elementAspect;
    }

    const posX = margin + (availableWidth - finalWidth) / 2;
    const posY = margin + (availableHeight - finalHeight) / 2;

    // Draw the crisp rasterized image
    pdf.addImage(imgData, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');

    const blob = pdf.output('blob');
    const dataUrl = pdf.output('datauristring');

    return { pdf, blob, dataUrl };
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    return null;
  }
}

/**
 * Exports an HTML element as a high-definition PDF document and downloads it
 */
export async function exportElementToPdf(
  elementId: string,
  options: PdfExportOptions = {}
): Promise<boolean> {
  const {
    filename = 'Affiche_Grand_Format_Hassi_Bekay_2026.pdf',
  } = options;

  const result = await generatePdfBlob(elementId, options);
  if (!result) return false;

  try {
    result.pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Error saving PDF:', err);
    return false;
  }
}
