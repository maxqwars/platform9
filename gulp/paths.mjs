import { join, resolve } from "path";

const SRC_ROOT  = join(resolve(), "/src");
const DEST_ROOT = join(resolve(), "/build");

export default {
  clean   : DEST_ROOT,
  srcRoot : SRC_ROOT,
  destRoot: DEST_ROOT,
  src     : {
    pages: `${join(SRC_ROOT, "/pages")}/*.pug`,
    scss : `${join(SRC_ROOT, "/scss")}/**/*.+(scss|sass)`,
    js   : `${join(SRC_ROOT, "/js")}/main.+(js|ts)`,
  },
  dest: {
    pages: DEST_ROOT,
    css  : join(DEST_ROOT, "css"),
    js   : join(DEST_ROOT, "js"),
  },
  watch: {
    pages: [
      `${join(SRC_ROOT, "/pages")}/*.pug`,
      `${join(SRC_ROOT, "/includes")}/*.pug`,
    ],
    scss: `${join(SRC_ROOT, "/scss")}/**/*.+(scss|sass)`,
    js  : `${join(SRC_ROOT, "/js")}/**/*.+(js|ts)`,
  },
};
