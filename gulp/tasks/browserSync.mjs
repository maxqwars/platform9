import browserSync from "browser-sync";
import paths from "../paths.mjs";

export const startBrowserSync = (cb) => {
  browserSync.init({
    server: {
      baseDir: paths.buildDir,
    },
    open: false, //? Do not open browser window when bs launched
    notify: false, //? Disable `browser sync connected` notification
  });

  cb();
};

export function reloadBrowser(done) {
  browserSync.reload();
  done();
}

export function streamStyles(done) {
  browserSync.stream();
  done();
}
