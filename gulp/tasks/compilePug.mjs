import paths from "../paths.mjs";
import gulp from "gulp";
import pug from "gulp-pug";
import { reloadBrowser } from "./browserSync.mjs";
const { src, dest, series } = gulp;

export function compilePug() {
  return src(paths.src.pages)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest(paths.buildDir));
}

export const compileAndReload = series(compilePug, reloadBrowser);
