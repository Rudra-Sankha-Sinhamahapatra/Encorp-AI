'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import pptxgen from 'pptxgenjs';
import { useCallback } from 'react';

type Slide = {
  type: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  imageURL?: string;
};

type PresentationProps = {
  title: string;
  slides: Slide[];
};

export function PPTXDownloadButton({ presentation }: { presentation: PresentationProps }) {
  const handleDownload = useCallback(() => {
    const pptx = new pptxgen();
    

    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Encorp AI';
    pptx.title = presentation.title;

    const TITLE_COLOR = '0085FF';
    const TEXT_COLOR = '333333';
    const ACCENT_COLOR = '5D5FEF';
    
    presentation.slides.forEach((slide) => {
      if (slide.type === 'title') {
        const titleSlide = pptx.addSlide();
        
        titleSlide.background = { color: '000C24' };
        
        titleSlide.addText(slide.title, {
          x: '5%',
          y: '40%',
          w: '90%',
          fontSize: 44,
          color: 'FFFFFF',
          bold: true,
          align: 'center',
          fontFace: 'Arial',
        });
        
        if (slide.subtitle) {
          titleSlide.addText(slide.subtitle, {
            x: '10%',
            y: '55%',
            w: '80%',
            fontSize: 20,
            color: 'AAAAAA',
            align: 'center',
            fontFace: 'Arial',
          });
        }
        
        titleSlide.addShape(pptx.ShapeType.rect, {
          x: '0%',
          y: '90%',
          w: '100%',
          h: '10%',
          fill: {
            type: 'solid',
            color: ACCENT_COLOR,
          },
        });
      } else {
        const contentSlide = pptx.addSlide();
        
        contentSlide.background = { color: 'FFFFFF' };
        
        contentSlide.addText(slide.title, {
          x: '5%',
          y: '5%',
          w: '90%',
          h: '10%',
          fontSize: 24,
          color: TITLE_COLOR,
          bold: true,
          fontFace: 'Arial',
        });
        
        contentSlide.addShape(pptx.ShapeType.line, {
          x: '5%',
          y: '15%',
          w: '90%',
          h: 0,
          line: { color: ACCENT_COLOR, width: 1 },
        });
        
        if (slide.imageURL) {
          if (slide.bullets && slide.bullets.length > 0) {
            contentSlide.addText(
              slide.bullets.join('\n• '),
              {
                x: '5%',
                y: '20%',
                w: '45%',
                fontSize: 16,
                color: TEXT_COLOR,
                bullet: false,
                lineSpacing: 30,
                fontFace: 'Arial',
              }
            );
          }
          
          try {
            contentSlide.addImage({
              path: slide.imageURL,
              x: '55%',
              y: '20%',
              w: '40%',
              h: '60%',
            });
          } catch (e) {
            // If image loading fails (e.g., CORS issues), add a placeholder rectangle
            contentSlide.addShape(pptx.ShapeType.rect, {
              x: '55%',
              y: '20%',
              w: '40%',
              h: '60%',
              fill: { color: 'F1F1F1' },
              line: { color: 'CCCCCC', width: 1 },
            });
            
            contentSlide.addText('Image Placeholder', {
              x: '55%',
              y: '45%',
              w: '40%',
              align: 'center',
              fontSize: 12,
              color: 'AAAAAA',
            });
          }
        } else {
          if (slide.bullets && slide.bullets.length > 0) {
            contentSlide.addText(
              slide.bullets.join('\n• '),
              {
                x: '5%',
                y: '20%',
                w: '90%',
                fontSize: 18,
                color: TEXT_COLOR,
                bullet: false,
                lineSpacing: 30,
                fontFace: 'Arial',
              }
            );
          }
        }
      }
    });
    
    pptx.writeFile({ fileName: `${presentation.title.replace(/[^\w\s]/gi, '')}.pptx` });
  }, [presentation]);
  
  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" /> Export to PowerPoint
    </Button>
  );
}