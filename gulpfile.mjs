/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import autoprefixer from 'gulp-autoprefixer'
import bs from 'browser-sync'
import cleanCSS from 'gulp-clean-css'
import dartSass from 'sass'
import del from 'del'
import esbuild from 'gulp-esbuild'
import groupCSSMediaQueries from 'gulp-group-css-media-queries'
import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import rename from 'gulp-rename'
import sourcemaps from 'gulp-sourcemaps'
import versionNumber from 'gulp-version-number'

/* -------------------------------------------------------------------------- */
/*                                  Configure                                 */
/* -------------------------------------------------------------------------- */

// ? Configure gulp-sass
const sass = gulpSass(dartSass)

// ? Get functions from gulp
const { src, dest, parallel, series, watch } = gulp

/* -------------------------------------------------------------------------- */
/*                              Global variables                              */
/* -------------------------------------------------------------------------- */

const mode    = 'development'  // Platform9 work mode
const distDir = './build'      // Build dir
const srcDir  = './src'        // Source dir

const paths = {
    distDir,
    srcDir,
    src: {
        includes: `${srcDir}/includes/**/*.pug`,
        pages   : `${srcDir}/pages/**/*.pug`,
        images  : `${srcDir}/images/**/*.pug`,
        scripts : `${srcDir}/scripts/**/*.{js,ts}`,
        svg     : `${srcDir}/images/**/*.svg`,
        styles  : `${srcDir}/styles/**/*.{sass,scss,css}`
    },
    dist: {
        pages  : distDir,
        images : `${distDir}/img/`,
        svg    : `${distDir}/img/`,
        scripts: `${distDir}/js/`,
        styles : `${distDir}/css/`
    },
    watch: {
        markup : [`${srcDir}/includes/**/*.pug`, `${srcDir}/pages/**/*.pug`],
        images : [`${srcDir}/images/**/*.pug`, `${srcDir}/images/**/*.svg`],
        scripts: `${srcDir}/scripts/**/*.{js,ts}`,
        styles : `${srcDir}/styles/**/*.{sass,scss,css}`
    },
    clean: distDir
}

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
            baseDir: paths.distDir
        }
    })
    done()
}

/* -------------------------------------------------------------------------- */
/*                              Markup processing                             */
/* -------------------------------------------------------------------------- */
export const compilePug = () => {
    return src(paths.src.pages)
        .pipe(plumber(
            notify.onError({
                title: 'Error in compilePug task',
                message: "<%= error.message %>",
            })
        ))
        .pipe(pug({
            pretty: true,
            verbose: true
        }))
        .pipe(versionNumber({
            value: "%DT%",
            append: {
                key: "_v",
                cover: 0,
                to: ["css", "js"],
            },
        }))
        .pipe(plumber.stop())
        .pipe(dest(paths.dist.pages))
        .pipe(bs.stream())
}

/* -------------------------------------------------------------------------- */
/*                              Styles processing                             */
/* -------------------------------------------------------------------------- */
export const compileStyles = () => {
    // TODO: Add sourcemaps support
    return src(paths.src.styles)
        .pipe(plumber(
            notify.onError({
                title: "Error in compileStyles task",
                message: "<%= error.message %>",
            })
        ))
        .pipe(sass())
        .pipe(groupCSSMediaQueries())
        .pipe(rename(path => {
            path.extname = '.css'
        }))
        .pipe(dest(paths.dist.styles))
        .pipe(autoprefixer({
            cascade: true,
            overrideBrowserslist: ['last 3 versions']
        }))
        .pipe(cleanCSS())
        .pipe(rename(path => {
            path.extname = '.min.css'
        }))
        .pipe(plumber.stop())
        .pipe(dest(paths.dist.styles))
        .pipe(bs.stream())
}

/* -------------------------------------------------------------------------- */
/*                             Scripts processing                             */
/* -------------------------------------------------------------------------- */
export const compileScripts = () => {
    return src(paths.src.scripts)
        .pipe(plumber(
            notify.onError({
                title: "Error in compileScripts task",
                message: "<%= error.message %>",
            })
        ))
        .pipe(esbuild({
            minify: mode !== 'development'
            // TODO: Add sourcemaps support 
        }))
        .pipe(rename(path => {
            path.extname = '.min.js'
        }))
        .pipe(plumber.stop())
        .pipe(dest(paths.dist.scripts))
        .pipe(bs.stream())
}

/* -------------------------------------------------------------------------- */
/*                                Service tasks                               */
/* -------------------------------------------------------------------------- */

// ? Remove `build` folder
export const clear = () => {
    return del(paths.distDir);
}

// ? Configure watcher
export const watcher = () => {
    watch(paths.watch.markup, compilePug)
    watch(paths.watch.styles, compileStyles)
    watch(paths.watch.scripts, compileScripts)
}

/* -------------------------------------------------------------------------- */
/*                                 Collections                                */
/* -------------------------------------------------------------------------- */

// ? Run before start development workflow
const beforeStart = series(clear, startBrowserSync)

// ? Run after start development workflow
const afterStart = series(compilePug, compileStyles, compileScripts, watcher)

/* -------------------------------------------------------------------------- */
/*                                Default task                                */
/* -------------------------------------------------------------------------- */
export default series(
    beforeStart,
    afterStart
)

export const debug = (done) => {
    console.log(paths)
    done()
}