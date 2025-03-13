'use client';

import jsPDF from 'jspdf';
import { useCallback } from 'react';
import { PresentationProps } from '@/types/types';

export function PDFDownloadButton({ presentation }: { presentation: PresentationProps }) {
    const handleDownload = useCallback(() => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

        presentation.slides.forEach((slide, index) => {
            if (index > 0) doc.addPage();

            // Title (Bold)
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            const titleX = (doc.internal.pageSize.width / 2) - (doc.getTextWidth(slide.title) / 2);
            doc.text(slide.title, titleX, 30);

            // Subtitle (Normal)
            if (slide.subtitle) {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'normal'); 
                const subtitleX = (doc.internal.pageSize.width / 2) - (doc.getTextWidth(slide.subtitle) / 2);
                doc.text(slide.subtitle, subtitleX, 45);
            }

            let yOffset = 60;
            const maxWidth = doc.internal.pageSize.width - 40;

            // Bullet Points
            if (slide.bullets) {
                doc.setFontSize(12); 
                doc.setFont('helvetica', 'normal');

                slide.bullets.forEach((bullet) => {
                    const wrappedText = doc.splitTextToSize(`• ${bullet}`, maxWidth);
                    doc.text(wrappedText, 20, yOffset); 
                    yOffset += wrappedText.length * 7; 
                });

                //space between title and description
                yOffset += 5
            }

            if(slide.description) {
                doc.setFontSize(11)
                doc.setFont('helvetica','italic')

                if(slide.bullets && slide.bullets.length > 0) {
                    doc.setDrawColor(200,200,200)
                    doc.line(20,yOffset -2 ,doc.internal.pageSize.width - 20,yOffset -2);
                }

                const wrappedDescription = doc.splitTextToSize(slide.description, maxWidth);
                doc.text(wrappedDescription, 20, yOffset);
            }
        });

        doc.save(`${presentation.title.replace(/[^\w\s]/gi, '') || 'presentation'}.pdf`);
    }, [presentation]);

    return (
        <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleDownload}
        >
            Export as PDF
        </button>
    );
}
