import {
  reloadBrowser,
  startBrowserSync,
  streamStyles,
} from "./gulp/tasks/browserSync.mjs";
import { compilePug } from "./gulp/tasks/compilePug.mjs";
import gulp from "gulp";
import paths from "./gulp/paths.mjs";
import reset from "./gulp/tasks/reset.mjs";
import { compileSCSS } from "./gulp/tasks/compileSCSS.mjs";
import { compileJS } from "./gulp/tasks/compileJS.mjs";

const { watch, series } = gulp;

// Configure observer
const observer = async () => {
  watch(
    [`${paths.buildDir}/*.html`, `${paths.buildDir}/js/*.js`],
    reloadBrowser
  );
  watch(paths.observer.pages, compilePug);
  watch(paths.observer.scss, series(compileSCSS, streamStyles));
  watch(paths.observer.js, series(compileJS, reloadBrowser));
};

// Define default task
export default series(
  reset,
  compilePug,
  compileSCSS,
  compileJS,
  startBrowserSync,
  observer
);
