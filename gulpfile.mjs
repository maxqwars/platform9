import gulp from "gulp";
import startBrowserSync from "./gulp/tasks/startBrowserSync.mjs";
import HTMLWorkflow from "./gulp/tasks/HTMLWorkflow.mjs";
import stylesWorkflow from "./gulp/tasks/stylesWorkflow.mjs";
import removeBuild from "./gulp/tasks/removeBuild.mjs";
import scriptsWorkflow from "./gulp/tasks/scriptsWorkflow.mjs";
import imagesWorkflow from "./gulp/tasks/imagesWorkflow.mjs";
import paths from "./gulp/paths.mjs";

const watcher = () => {
  gulp.watch(paths.watch.pages, HTMLWorkflow);
  gulp.watch(paths.watch.scss, stylesWorkflow);
  gulp.watch(paths.watch.js, scriptsWorkflow);
  gulp.watch(paths.watch.images, imagesWorkflow);
};

const workflows = gulp.parallel(
  HTMLWorkflow,
  stylesWorkflow,
  scriptsWorkflow,
  imagesWorkflow
);

export default gulp.series(removeBuild, workflows, startBrowserSync, watcher);
