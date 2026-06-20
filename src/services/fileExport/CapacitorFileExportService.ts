import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { FileExportService } from './FileExportService';

// There is no general "save to Downloads" API on Android without Storage
// Access Framework ceremony, so the practical, well-supported pattern is:
// write the file to the app's cache directory, then hand it to the OS share
// sheet so the user can save it to Files/Drive, send it by email, etc.
export class CapacitorFileExportService implements FileExportService {
  async exportFile(filename: string, content: string, _mimeType: string): Promise<void> {
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });

    await Share.share({
      title: filename,
      files: [uri],
    });
  }
}
