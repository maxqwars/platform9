import gulp from "gulp";
import imagemin from "gulp-imagemin";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import newer from "gulp-newer";
import paths from "../paths.mjs";
import bs from "browser-sync";
import webp from "gulp-webp";

export default () => {
  return gulp
    .src(paths.src.images)
    .pipe(notify('Starting raster images processing...'))
    .pipe(
      plumber(
        notify.onError({
          title: "Raster image workflow",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(newer(paths.dest.images))
    .pipe(webp())
    .pipe(gulp.dest(paths.dest.images))
    .pipe(gulp.src(paths.src.images))
    .pipe(newer(paths.dest.images))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dest.images))
    .pipe(bs.stream());
};
