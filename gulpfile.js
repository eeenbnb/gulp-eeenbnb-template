const { parallel, src, watch, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const connect = require("gulp-connect");
const argv = require("minimist")(process.argv.slice(2));
console.log(argv);

const SRC_PATH = "src/";
const OUTPUT_PATH = "docs/";
const PATH = {
  SCSS_PATH: SRC_PATH + "assets/css/common.scss",
  SCSS_OUTPUT_PATH: OUTPUT_PATH + "assets/css",
  JS_PATH: SRC_PATH + "assets/js/index.js",
  JS_OUTPUT_PATH: OUTPUT_PATH + "assets/js",
  IMG_PATH: SRC_PATH + "assets/img/*",
  IMG_OUTPUT_PATH: OUTPUT_PATH + "assets/img/*",
  HTML_PATH: SRC_PATH + "*.html",
  HTML_OUTPUT_PATH: OUTPUT_PATH,
};

const isLiveLoad = () => String(argv.liveload).toLowerCase() === "true";
console.log(String(argv.liveload).toLowerCase());
const buildJs = () => {
  const task = src(PATH.JS_PATH)
    .pipe(babel())
    .pipe(dest(PATH.JS_OUTPUT_PATH))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(PATH.JS_OUTPUT_PATH));
  return isLiveLoad() ? task.pipe(connect.reload()) : task;
};
const watchJsFiles = () => watch(PATH.JS_PATH, buildJs);

const buildSass = () => {
  const task = src(PATH.SCSS_PATH)
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(dest(PATH.SCSS_OUTPUT_PATH));
  return isLiveLoad() ? task.pipe(connect.reload()) : task;
};
const watchSassFiles = () => watch(PATH.SCSS_PATH, buildSass);

const moveIndexHTML = () => {
  const task = src(PATH.HTML_PATH).pipe(dest(PATH.HTML_OUTPUT_PATH));
  return isLiveLoad() ? task.pipe(connect.reload()) : task;
};
const watchIndexHTML = () => watch(PATH.HTML_PATH, moveIndexHTML);

const moveImg = () => {
  const task = src(PATH.IMG_PATH).pipe(dest(PATH.IMG_OUTPUT_PATH));
  return isLiveLoad() ? task.pipe(connect.reload()) : task;
};
const watchImg = () => watch(PATH.IMG_PATH, moveImg);

const webserverRun = () => {
  return connect.server({
    root: OUTPUT_PATH,
    livereload: true,
  });
};

exports.default = parallel(
  watchJsFiles,
  watchSassFiles,
  watchIndexHTML,
  watchImg,
  webserverRun
);
exports.build = parallel(buildJs, buildSass, moveIndexHTML, moveImg);
