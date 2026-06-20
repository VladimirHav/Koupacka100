import type { FileExportService } from './FileExportService';

export class WebFileExportService implements FileExportService {
  async exportFile(filename: string, content: string, mimeType: string): Promise<void> {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
