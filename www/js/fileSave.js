/* ============================================================
   Save a text file for the person.
   - Website: a normal download.
   - Native app: write to the app's cache with Capacitor's Filesystem
     plugin and open the phone's share sheet with Share, since phone
     app views don't handle browser-style downloads reliably. If those
     plugins aren't installed, it falls back to the download below.
   ============================================================ */

   function downloadInBrowser(filename, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  
  export async function saveFile(filename, text, mime = "text/plain;charset=utf-8") {
    const cap = window.Capacitor;
    const plugins = cap?.Plugins;
  
    if (cap?.isNativePlatform?.() && plugins?.Filesystem && plugins?.Share) {
      try {
        const written = await plugins.Filesystem.writeFile({
          path: filename,
          data: text,
          directory: "CACHE",
          encoding: "utf8"
        });
        await plugins.Share.share({ title: filename, url: written.uri });
        return;
      } catch (err) {
        // Closing the share sheet isn't an error.
        if (/cancel/i.test(String(err?.message || err))) return;
        console.error("Native save failed, trying a normal download:", err);
      }
    }
  
    downloadInBrowser(filename, text, mime);
  }