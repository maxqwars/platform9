import paths from "../paths.mjs";
import esbuild from "gulp-esbuild";
import gulp from "gulp";
const { src, dest } = gulp;

export function compileJS() {
  return src(paths.src.js)
    .pipe(
      esbuild({
        outfile: "bundle.js",
        minify: true,
        bundle: true,
      })
    )
    .pipe(dest(paths.build.js));
}
