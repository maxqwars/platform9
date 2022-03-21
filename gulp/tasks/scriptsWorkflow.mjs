import bs from "browser-sync";
import esbuild from "gulp-esbuild";
import sourcemaps from "gulp-sourcemaps";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import rename from "gulp-rename";
import gulp from "gulp";
import paths from "../paths.mjs";

export default () => {
  return gulp.src(paths.src.js)
    .pipe(notify('Starting scripts processing...'))
    .pipe(
      plumber(
        notify.onError({
          title: "JS Workflow",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(
      esbuild({
        outfile: "main.js",
        bundle: true,
        minify: true,
      })
    )
    .pipe(
      rename((path) => {
        path.extname = ".min.js";
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dest.js))
    .pipe(bs.stream());
};
