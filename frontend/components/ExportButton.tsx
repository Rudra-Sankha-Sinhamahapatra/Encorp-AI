'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PDFDownloadButton } from '@/components/pdf/PDFDownload';
import { PPTXDownloadButton } from '@/components/ppt/PPTXDownloadButton';
import { PresentationProps } from '@/types/types';

export function ExportButton({ presentation }: { presentation: PresentationProps }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setShowOptions(!showOptions)}>
        <Download className="h-4 w-4 mr-2" /> Export
      </Button>
      
      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
          <PDFDownloadButton presentation={presentation} />
          <PPTXDownloadButton presentation={presentation} />
        </div>
      )}
    </div>
  );
}
