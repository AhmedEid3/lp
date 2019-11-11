// define gulp and the plugins
const gulp         = require("gulp"),
      connect      = require("gulp-connect"),
      notify       = require("gulp-notify"),
      concat       = require("gulp-concat"),
      autoprefixer = require("gulp-autoprefixer"),
      sourcemaps   = require("gulp-sourcemaps"),
      sass         = require("gulp-sass"),
      uglify       = require("gulp-uglify"),
      imagemin     = require("gulp-imagemin");

// define paths
const paths = {
    dist: {
        html: "dist/",
        css: "dist/css",
        js: "dist/js",
        imgs: "dist/images"
    },
    src: {
        html: "src/template/*.html",
        scss: "src/scss/**/*.scss",
        js: "src/js/**/*.js",
        imgs: ["src/images/**/*.*"]
    },
    watch: {
        html: "src/template/**/*.html",
        scss: "src/scss/**/*.scss",
        js: "src/js/**/*.js",
        imgs: "src/images/**/*.*"
    }
};

// HTML task
function html() {
    return gulp
        .src(paths.src.html)
        .pipe(gulp.dest(paths.dist.html))
        .pipe(connect.reload())
        .pipe(notify("HTML Task Finished"));
}

// CSS Task
function css() {
    return gulp
        .src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: "expanded"}))
        .pipe(autoprefixer("last 2 version"))
        .pipe(concat("main-style.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(connect.reload())
        .pipe(notify("CSS Task Finished"));
}

// Css Min Task
function cssMin() {
    return gulp
        .src(paths.src.scss)
        .pipe(sass({outputStyle: "compressed"}))
        .pipe(autoprefixer("last 2 version"))
        .pipe(concat("main-style.min.css"))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(connect.reload())
        .pipe(notify("CSS Min Task Finished"));
}

// Js Task
function js() {
    return gulp
        .src(paths.src.js)
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js))
        .pipe(connect.reload())
        .pipe(notify("JS Task Finished"));
}

// Images Task
function images() {
    return gulp
        .src(paths.src.imgs)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(paths.dist.imgs))
        .pipe(connect.reload())
        .pipe(notify("Images Task Finished"));
}

// Create simple server and activate reload pages plugin
function connects() {
    connect.server({
        root: paths.dist.html,
        port: 8888,
        livereload: true
    });
}

// Watching Changes of files and apply Tasks
function watch() {
    gulp.watch(paths.watch.html, html);
    gulp.watch(paths.watch.scss, gulp.parallel(css, cssMin));
    gulp.watch(paths.watch.js, js);
    gulp.watch(paths.src.imgs, images);
}

// Exports Tasks to can access it from other files or enviroment
exports.connects = connects;
exports.watch = watch;
exports.html = html;
exports.css = css;
exports.cssMin = cssMin;
exports.js = js;
exports.images = images;

// Default Task
exports.default = gulp.parallel(connects, watch, html, css, cssMin, js, images);
