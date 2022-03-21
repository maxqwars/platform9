import paths from "../paths.mjs";
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import changed from "gulp-changed";
import bs from "browser-sync";
import gulp from "gulp";
import versionNumber from "gulp-version-number";

export default () => {
  return gulp
    .src(paths.src.pages)
    .pipe(notify('Starting markup processing...'))
    .pipe(
      plumber(
        notify.onError({
          title: "HTML Workflow",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(
      pug({
        pretty: true,
        verbose: true,
      })
    )
    .pipe(
      versionNumber({
        value: "%DT%",
        append: {
          key: "_v",
          cover: 0,
          to: ["css", "js"],
        },
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dest.pages))
    .pipe(bs.stream());
};
