// Web (v1) implements this via a Blob + <a download> link, which the
// browser's own download manager handles. That trick does not work inside
// the Capacitor Android WebView (no download manager integration), so the
// native implementation writes the file via @capacitor/filesystem and hands
// it off to the OS share sheet via @capacitor/share instead.
export interface FileExportService {
  exportFile(filename: string, content: string, mimeType: string): Promise<void>;
}
