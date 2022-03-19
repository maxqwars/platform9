import { resolve, join } from "path";

const SRC_DIR = join(resolve(), "/src");
const BUILD_DIR = join(resolve(), "/build");

export default {
  srcDir: SRC_DIR,
  buildDir: BUILD_DIR,
  src: {
    pages: `${join(SRC_DIR, "/pages")}/*.pug`,
    scss: `${join(SRC_DIR, "/scss")}/**/*.+(scss|sass)`,
    js: `${join(SRC_DIR, "/js")}/main.js`,
  },
  build: {
    pages: BUILD_DIR,
    css: join(BUILD_DIR, "/css"),
    js: join(BUILD_DIR, "/js"),
  },
  observer: {
    pages: `${join(SRC_DIR, "/pages")}/*.pug`,
    scss: `${join(SRC_DIR, "/scss")}/**/*.+(scss|sass)`,
    js: `${join(SRC_DIR, "/js")}/main.js`,
  },
};
