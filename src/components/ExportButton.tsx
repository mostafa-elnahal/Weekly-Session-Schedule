import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';


interface ExportButtonProps {
    onBeforeExport: () => void;
    weekStartDate: string;
    targetId?: string;
}

export const ExportButton = ({
    onBeforeExport,
    weekStartDate,
    targetId = 'export-container',
}: ExportButtonProps) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            onBeforeExport();
            // Small delay to ensure state updates are rendered
            await new Promise((resolve) => setTimeout(resolve, 100));

            const exportContainer = document.getElementById(targetId);
            if (!exportContainer) {
                throw new Error('Export container not found');
            }

            // Dynamically import html-to-image
            const { toJpeg } = await import('html-to-image');

            const dataUrl = await toJpeg(exportContainer, {
                quality: 0.95,
                backgroundColor: '#ffffff',
                pixelRatio: 2,
                cacheBust: true,
                fontEmbedCSS: '',
            });

            const link = document.createElement('a');
            link.download = `schedule-${weekStartDate}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export schedule. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Exporting...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    Download JPG
                </>
            )}
        </button>
    );
};
