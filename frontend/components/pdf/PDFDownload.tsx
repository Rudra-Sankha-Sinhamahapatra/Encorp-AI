'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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

            // Bullet Points
            if (slide.bullets) {
                doc.setFontSize(12); 
                let yOffset = 60;
                const maxWidth = doc.internal.pageSize.width - 40; 

                slide.bullets.forEach((bullet) => {
                    const wrappedText = doc.splitTextToSize(`• ${bullet}`, maxWidth);
                    doc.text(wrappedText, 20, yOffset); 
                    yOffset += wrappedText.length * 7; 
                });
            }
        });

        doc.save(`${presentation.title.replace(/[^\w\s]/gi, '') || 'presentation'}.pdf`);
    }, [presentation]);

    return (
        <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Export to PDF
        </Button>
    );
}
