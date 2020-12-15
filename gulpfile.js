const gulp = require("gulp");

// CSS
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const postcss = require("gulp-postcss");
const flexBugsFixes = require("postcss-flexbugs-fixes");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const cssDeclarationSorter = require("css-declaration-sorter");
const combineMediaQuery = require("postcss-combine-media-query");

// Utility
const browserSync = require("browser-sync").create();
// const connectSSI = require("connect-ssi");
const gulpif = require("gulp-if");
// const changed = require("gulp-changed");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
// const del = require("del");

/**
 * 環境変数
 */
const environment = process.env.NODE_ENV || "development";
const isDevelopment = environment === "development";
const isProduction = environment === "production";

/**
 * 開発用ディレクトリ
 */
const src = {
  root: "src/",
  // pug: "src/**/*.pug",
  // data: "src/_data/",
  css: "src/assets/_scss/**/*.scss",
  // ts: "src/assets/ts/**/*.ts",
  // img: "src/assets/img/**/*.{png,jpg,gif,svg}",
  // svgSprite: "src/assets/svg/**/*.svg"
};

/**
 * 公開用ディレクトリ
 */
const dist = {
  root: "dist/",
  // html: "dist/**/*.html",
  css: "dist/assets/css",
  // js: "dist/assets/js",
  // img: "dist/assets/img",
  // svgSprite: "dist/assets/svg"
};

/**
 * Scssファイルのトランスパイル
 */
// postCssOption
const postCssOption = [
  // flexBugsFixes(),
  autoprefixer({ grid: "autoplace" }),
  cssDeclarationSorter({
    order: "alphabetical"
  }),
  combineMediaQuery()
];
gulp.task("sass", done => {
  return gulp
    .src(src.css)
    .pipe(sassGlob())
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(postcss(postCssOption))
    .pipe(gulpif(isProduction, cleanCSS()))
    .pipe(
      gulpif(
        isDevelopment,
        cleanCSS({
          format: "beautify"
        })
      )
    )
    .pipe(gulpif(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dist.css));
  done();
});

/**
 * 開発ローカルサーバー立ち上げ
 */
const browserSyncOption = {
  server: dist.root,
  // startPath: "./LIST.html", server立ち上げ時にページリストを開く
  open: "external",
  // middleware: [
  //   connectSSI({
  //     baseDir: __dirname + "/dist",
  //     ext: ".html"
  //   })
  // ]
};
gulp.task("serve", done => {
  browserSync.init(browserSyncOption);
  done();
});

/**
 * ファイルの監視
 */
gulp.task("browserReload", done => {
  browserSync.reload();
  done();
});
gulp.task("watch", done => {
  // gulp.watch(src.pug, gulp.series("pug", "browserReload"));
  gulp.watch(src.css, gulp.series("sass", "browserReload"));
  // gulp.watch(src.ts, gulp.series("webpack", "browserReload"));
  // gulp.watch(src.img, gulp.series("image", "browserReload"));
  // gulp.watch(src.img, gulp.series("webp", "browserReload"));
  // gulp.watch(src.svgSprite, gulp.series("svgSprite", "browserReload"));
  done();
});

gulp.task("default", gulp.series("serve", "watch"));