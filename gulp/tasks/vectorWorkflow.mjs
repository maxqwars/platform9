import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import newer from "gulp-newer";
import paths from "../paths.mjs";
import bs from "browser-sync";
import svgmin from "gulp-svgmin";

export default () => {
  return gulp
    .src(paths.src.svg)
    .pipe(notify('Starting svg processing...'))
    .pipe(
      plumber(
        notify.onError({
          title: "Vector image workflow",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(newer(paths.dest.images))
    .pipe(svgmin())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dest.images))
    .pipe(bs.stream());
};
