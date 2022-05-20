/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import autoprefixer from "gulp-autoprefixer";
import bs from "browser-sync";
import cleanCSS from "gulp-clean-css";
import dartSass from "sass";
import del from "del";
import esbuild from "gulp-esbuild";
import groupCSSMediaQueries from "gulp-group-css-media-queries";
import gulp from "gulp";
import gulpSass from "gulp-sass";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import pug from "gulp-pug";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import svgmin from "gulp-svgmin";
import versionNumber from "gulp-version-number";
import webp from "gulp-webp";

/* -------------------------------------------------------------------------- */
/*                                  Configure                                 */
/* -------------------------------------------------------------------------- */

// ? Configure gulp-sass
const sass = gulpSass(dartSass);

// ? Get functions from gulp
const { src, dest, parallel, series, watch } = gulp;

/* -------------------------------------------------------------------------- */
/*                              Global variables                              */
/* -------------------------------------------------------------------------- */

const mode = process.env.NODE_ENV || "production"; // Platform9 work mode
const distDir = "./build"; // Build dir
const srcDir = "./src"; // Source dir

const paths = {
  distDir,
  srcDir,
  src: {
    includes: `${srcDir}/includes/**/*.pug`,
    pages: `${srcDir}/pages/**/*.pug`,
    images: `${srcDir}/images/**/*.{jpg,jpeg,png,gif,webp}`,
    scripts: `${srcDir}/scripts/**/*.{js,mjs,mts,ts}`,
    svg: `${srcDir}/images/**/*.svg`,
    styles: `${srcDir}/styles/**/*.{sass,scss,css}`,
  },
  dist: {
    pages: distDir,
    images: `${distDir}/img/`,
    svg: `${distDir}/img/`,
    scripts: `${distDir}/js/`,
    styles: `${distDir}/css/`,
  },
  watch: {
    markup: [`${srcDir}/includes/**/*.pug`, `${srcDir}/pages/**/*.pug`],
    images: `${srcDir}/images/**/*.{jpg,jpeg,png,gif,webp}`,
    scripts: `${srcDir}/scripts/**/*.{js,mjs,mts,ts}`,
    styles: `${srcDir}/styles/**/*.{sass,scss,css}`,
    svg: `${srcDir}/images/**/*.svg`,
  },
  clean: distDir,
};

/* -------------------------------------------------------------------------- */
/*                           Plugins configurations                           */
/* -------------------------------------------------------------------------- */

// ? ---

/* -------------------------------------------------------------------------- */
/*                              BrowserSync tasks                             */
/* -------------------------------------------------------------------------- */
export const startBrowserSync = (done) => {
  bs.init({
    notify: false,
    open: false,
    server: {
      baseDir: paths.distDir,
    },
  });
  done();
};

/* -------------------------------------------------------------------------- */
/*                              Markup processing                             */
/* -------------------------------------------------------------------------- */
export const compilePug = () => {
  return src(paths.src.pages)
    .pipe(
      plumber(
        notify.onError({
          title: "Error in compilePug task",
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
    .pipe(dest(paths.dist.pages))
    .pipe(bs.stream());
};

/* -------------------------------------------------------------------------- */
/*                              Styles processing                             */
/* -------------------------------------------------------------------------- */
export const compileStyles = () => {
  // TODO: Add sourcemaps support
  return src(paths.src.styles)
    .pipe(
      plumber(
        notify.onError({
          title: "Error in compileStyles task",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(sass())
    .pipe(groupCSSMediaQueries())
    .pipe(
      rename((path) => {
        path.extname = ".css";
      })
    )
    .pipe(dest(paths.dist.styles))
    .pipe(
      autoprefixer({
        cascade: true,
        overrideBrowserslist: ["last 3 versions"],
      })
    )
    .pipe(cleanCSS())
    .pipe(
      rename((path) => {
        path.extname = ".min.css";
      })
    )
    .pipe(plumber.stop())
    .pipe(dest(paths.dist.styles))
    .pipe(bs.stream());
};

/* -------------------------------------------------------------------------- */
/*                             Scripts processing                             */
/* -------------------------------------------------------------------------- */
export const compileScripts = () => {
  return src(paths.src.scripts)
    .pipe(
      plumber(
        notify.onError({
          title: "Error in compileScripts task",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(
      esbuild({
        minify: mode === "production",
        format: "esm",
        // TODO: Add sourcemaps support
      })
    )
    .pipe(
      rename((path) => {
        path.extname = ".min.js";
      })
    )
    .pipe(plumber.stop())
    .pipe(dest(paths.dist.scripts))
    .pipe(bs.stream());
};

/* -------------------------------------------------------------------------- */
/*                          Raster images processing                          */
/* -------------------------------------------------------------------------- */
export const rasterImagesProcessing = () => {
  return src(paths.src.images)
    .pipe(
      plumber(
        notify.onError({
          title: "Error in rasterImageProcessing task",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(newer(paths.dist.images))
    .pipe(webp())
    .pipe(dest(paths.dist.images))
    .pipe(src(paths.src.images))
    .pipe(newer(paths.dist.images))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(plumber.stop())
    .pipe(dest(paths.dist.images))
    .pipe(bs.stream());
};

/* -------------------------------------------------------------------------- */
/*                          Vector images processing                          */
/* -------------------------------------------------------------------------- */
export const vectorImagesProcessing = () => {
  return src(paths.src.svg)
    .pipe(
      plumber(
        notify.onError({
          title: "vectorImagesProcessing",
          message: "<%= error.message %>",
        })
      )
    )
    .pipe(newer(paths.dist.svg))
    .pipe(svgmin())
    .pipe(plumber.stop())
    .pipe(dest(paths.dist.svg))
    .pipe(bs.stream());
};

/* -------------------------------------------------------------------------- */
/*                                Service tasks                               */
/* -------------------------------------------------------------------------- */

// ? Remove `build` folder
export const clear = () => {
  return del(paths.distDir);
};

// ? Configure watcher
export const watcher = () => {
  watch(paths.watch.markup, compilePug);
  watch(paths.watch.styles, compileStyles);
  watch(paths.watch.scripts, compileScripts);
  watch(paths.watch.images, rasterImagesProcessing);
  watch(paths.watch.svg, vectorImagesProcessing);
};

/* -------------------------------------------------------------------------- */
/*                                 Collections                                */
/* -------------------------------------------------------------------------- */

// ? Run before start development workflow
const beforeStart = series(
  clear,
  startBrowserSync,
  compilePug,
  compileStyles,
  compileScripts
);

// ? Run after start development workflow
const afterStart = series(
  parallel(
    compilePug,
    compileStyles,
    compileScripts,
    rasterImagesProcessing,
    vectorImagesProcessing
  ),
  watcher
);

/* -------------------------------------------------------------------------- */
/*                                Default task                                */
/* -------------------------------------------------------------------------- */
export default series(beforeStart, afterStart);

export const debug = (done) => {
  console.log(process.env.NODE_ENV);
  done();
};
