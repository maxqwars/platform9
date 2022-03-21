import gulp from "gulp";
import bs from "browser-sync";
import sassCompiler from "sass";
import gulpSass from "gulp-sass";
import changed from "gulp-changed";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import cleanCSS from "gulp-clean-css";
import groupCSSMediaQueries from "gulp-group-css-media-queries";
import autoPrefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import paths from "../paths.mjs";

const scss = gulpSass(sassCompiler);

export default () => {
  return gulp
    .src(paths.src.scss)
    .pipe(notify('Starting styles processing...'))
    .pipe(
      plumber(
        notify.onError({
          title: "SCSS Workflow",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(scss())
    .pipe(groupCSSMediaQueries())
    .pipe(
      autoPrefixer({
        cascade: true,
      })
    )
    .pipe(cleanCSS())
    .pipe(
      rename((path) => {
        path.extname = ".min.css";
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dest.css))
    .pipe(bs.stream());
};
