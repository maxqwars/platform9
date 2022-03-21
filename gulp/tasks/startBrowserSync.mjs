import browserSync from "browser-sync";
import paths from "../paths.mjs";

export default (done) => {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: paths.destRoot,
    },
  });
  done();
};