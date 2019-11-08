(() => {
  "use strict";

  const // development or production
    devBuild =
      (process.env.NODE_ENV || "development").trim().toLowerCase() ===
      "development",
    // directory locations
    dir = {
      src: "src/",
      build: "dist/"
    },
    // modules
    gulp = require("gulp"),
    del = require("del"),
    noop = require("gulp-noop"),
    newer = require("gulp-newer"),
    size = require("gulp-size"),
    imagemin = require("gulp-imagemin"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    cssnano = require("gulp-cssnano"),
    rename = require("gulp-rename"),
    browsersync = require("browser-sync").create();

  // Clean Task
  function clean() {
    return del([dir.build]);
  }

  exports.clean = clean;
  exports.wipe = clean;

  // image task
  const imgConfig = {
    src: dir.src + "images/**/*",
    build: dir.build + "images/",

    minOpts: {
      optimizationLevel: 5
    }
  };

  function images() {
    return gulp
      .src(imgConfig.src)
      .pipe(newer(imgConfig.build))
      .pipe(imagemin(imgConfig.minOpts))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest(imgConfig.build));
  }
  exports.images = images;

  // CSS Task
  const cssConfig = {
    src: dir.src + "scss/*.scss",
    watch: dir.src + "scss/**/*",
    build: dir.build + "styles/",
    sassOpts: {
      outputStyle: "nested",
      imagePath: "/images/",
      precision: 3,
      errLogToConsole: true
    },

    postCSS: [
      require("postcss-assets")({
        loadPaths: ["images/"],
        basePath: dir.build
      }),
      require("autoprefixer")
    ]
  };

  function css() {
    return gulp
      .src(cssConfig.src)
      .pipe(sass(cssConfig.sassOpts).on("error", sass.logError))
      .pipe(postcss(cssConfig.postCSS))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest(cssConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop())
      .pipe(cssnano())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(cssConfig.build));
  }
  exports.css = gulp.series(images, css);

  // JS Task
  const jsConfig = {
    src: dir.src + "scripts/**/*.js",
    build: dir.build + "scripts",
    watch: dir.src + "scripts/**/*.js"
  };

  function scripts() {
    return gulp
      .src(jsConfig.src)
      .pipe(gulp.dest(jsConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());
  }

  exports.scripts = scripts;

  // HTML Task
  const htmlConfig = {
    src: dir.src + "*.html",
    build: dir.build,
    watch: dir.src + "**/*.html"
  };

  function html() {
    return gulp
      .src(htmlConfig.src)
      .pipe(gulp.dest(htmlConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());
  }

  exports.html = html;

  // Scripts Task

  // server task (now private
  const syncConfig = {
    server: {
      baseDir: "dist",
      index: "index.html"
    },
    port: 8000,
    open: true
  };

  function server(done) {
    if (browsersync) browsersync.init(syncConfig);
    done();
  }

  // Watch Task
  function watch(done) {
    // image changes
    gulp.watch(imgConfig.src, images);

    // CSS changes
    gulp.watch(cssConfig.watch, gulp.series("css"));

    // HTML changes
    gulp.watch(htmlConfig.watch, gulp.series("html"));

    // JS Changes
    gulp.watch(jsConfig.watch, gulp.series("scripts"));

    done();
  }

  // Default Task
  exports.default = gulp.series(
    exports.css,
    exports.html,
    exports.scripts,
    watch,
    server
  );
})();
