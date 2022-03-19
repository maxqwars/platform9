import paths from "../paths.mjs";
import gulp from "gulp";
const { src, dest } = gulp;
import dartSass from "sass";
import gulpSass from "gulp-sass";

const scss = gulpSass(dartSass);

export function compileSCSS() {
  return src(paths.src.scss).pipe(scss()).pipe(dest(paths.build.css));
}
