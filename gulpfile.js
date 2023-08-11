const { src, dest, watch, lastRun, series, parallel } = require("gulp");
const notify = require("gulp-notify");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const concat = require("gulp-concat")

function HTML() {
    return src("src/**/*.html", { since: lastRun(HTML) })
        .pipe(dest("build/"))
        .pipe(browserSync.stream())
}
exports.HTML = HTML;

function SASS() {
    return src("src/sass/**/*.sass")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "nested"
        }).on("error", sass.logError, notify.onError()))
        .pipe(sourcemaps.write("."))
        .pipe(dest("src/css/"))
        .pipe(dest("build/css/"))
        .pipe(browserSync.stream())
}
exports.SASS = SASS;

function scripts() {
    return src([
        "src/js/script_1.js",
        "src/js/script_2.js",
        "src/js/main.js"
    ], { since: lastRun(HTML) })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write("."))
        .pipe(dest("src/js/"))
        .pipe(dest("build/js/"))
        .pipe(browserSync.stream())
}
exports.scripts = scripts;

function myServer() {
    browserSync.init({
        server: {
            baseDir: "src"
        },
        notify: false
    });

    watch("src/**/*.html", { usePolling: true }, HTML);
    watch("src/sass/**/*.sass", { usePolling: true }, SASS)
    watch("src/js/**/*.js", { usePolling: true }, scripts)
}

exports.default = series(HTML, SASS, scripts, myServer);

exports.build = series(HTML, SASS, scripts);
