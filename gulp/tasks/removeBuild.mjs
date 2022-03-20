import del from "del";
import paths from "../paths.mjs";

export default () => {
  return del(paths.destRoot);
};
