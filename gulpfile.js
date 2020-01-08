const gulp = require("gulp");
const del = require("del");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const include = require("gulp-include");
const notify = require("gulp-notify");
const stylus = require("gulp-stylus");
const gulpif = require("gulp-if");
const minifyJS = require("gulp-uglify");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const prefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
//const debug = require('gulp-debug');

const TARGET_BROWSERS = [">1%", "ie 11", "not op_mini all"];
const IS_PRODUCTION = process.env.NODE_ENV === "production";

gulp.task("templates:all", function() {
	return (
		gulp
			.src(["src/templates/*.pug"])
			//.pipe(debug())
			.pipe(pug({ pretty: true, basedir: `${__dirname}/src/templates/` }))
			.on("error", function(err) {
				notify({ title: "templates task error!" }).write(err.message);
				this.emit("end");
			})
			.pipe(gulp.dest("build"))
	);
});

gulp.task("templates:single", function() {
	return gulp
		.src(["src/templates/*.pug"], { since: gulp.lastRun("templates:single") })
		.pipe(pug({ pretty: true, basedir: `${__dirname}/src/templates/` }))
		.on("error", function(err) {
			notify({ title: "template task error!" }).write(err.message);
			this.emit("end");
		})
		.pipe(gulp.dest("build"));
});

gulp.task("styles", function() {
	return (
		gulp
			.src("src/styles/*.styl")
			//.pipe(debug())
			.pipe(sourcemaps.init())
			.pipe(
				stylus({
					compress: true,
				})
			)
			.on("error", function(err) {
				notify({ title: "CSS task error!" }).write(err.message);
				this.emit("end");
			})

			.pipe(
				prefixer({
					browsers: TARGET_BROWSERS,
					cascade: false,
					grid: true,
				})
			)

			.pipe(
				gulpif(
					IS_PRODUCTION,
					cssnano({ discardUnused: { fontFace: false }, zindex: false, discardComments: { removeAll: true } })
				)
			)
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("build/css"))
	);
});

gulp.task("scripts:single", function() {
	return gulp
		.src("src/scripts/*.*", { since: gulp.lastRun("scripts:single") })
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(include())
		.on("error", console.error)
		.pipe(
			babel({
				presets: [
					[
						"@babel/env",
						{
							targets: {
								browsers: TARGET_BROWSERS,
							},
						},
					],
				],
			})
		)
		.pipe(gulpif(IS_PRODUCTION, minifyJS()))
		.on("error", function(err) {
			notify({ title: "scripts task error!" }).write(err.message);
			this.emit("end");
		})
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("build/js"));
});

gulp.task("scripts:all", function() {
	return (
		gulp
			.src(["src/scripts/*.*"])
			//.pipe(debug())
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(include())
			.on("error", console.error)
			.pipe(
				babel({
					presets: [
						[
							"@babel/env",
							{
								targets: {
									browsers: TARGET_BROWSERS,
								},
							},
						],
					],
				})
			)
			.pipe(gulpif(IS_PRODUCTION, minifyJS()))
			.on("error", function(err) {
				notify({ title: "scripts task error!" }).write(err.message);
				this.emit("end");
			})
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("build/js"))
	);
});

gulp.task("assets", function() {
	return gulp.src(["src/assets/**/*.*"], { since: gulp.lastRun("assets") }).pipe(gulp.dest("build"));
});

gulp.task("vendors:js", function() {
	return gulp
		.src(["src/vendor/js/*.js"])
		.pipe(sourcemaps.init())
		.pipe(concat("vendor.js"))
		.pipe(
			minifyJS({
				mangle: false,
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("build/js"));
});

gulp.task("vendors:css", function() {
	return gulp
		.src("src/vendor/css/*.css")
		.pipe(sourcemaps.init())
		.pipe(concat("vendor.css"))
		.pipe(
			cssnano({
				discardUnused: { fontFace: false },
				zindex: false,
				autoprefixer: false,
				discardComments: { removeAll: true },
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("build/css"));
});

gulp.task("clean", function() {
	return del("build");
});

gulp.task(
	"build",
	gulp.series("clean", gulp.parallel("templates:all", "styles", "vendors:js", "vendors:css", "assets", "scripts:all"))
);

gulp.task("reload", function(done) {
	browserSync.reload();
	done();
});

gulp.task("watch", function() {
	gulp.watch(
		["src/templates/layouts/*.pug", "src/templates/includes/**/*.*"],
		gulp.series("templates:all", "reload")
	);
	gulp.watch(["src/templates/*.pug"], gulp.series("templates:single", "reload"));
	gulp.watch("src/styles/**/*.*", gulp.series("styles"));
	gulp.watch("src/scripts/*.*", gulp.series("scripts:single", "reload"));
	gulp.watch("src/scripts/includes/**/*.*", gulp.series("scripts:all", "reload"));
	gulp.watch("src/assets/**/*.*", gulp.series("assets", "reload"));
	gulp.watch("src/vendor/css/*.css", gulp.series("vendors:css"));
	gulp.watch("src/vendor/js/*.js", gulp.series("vendors:js", "reload"));
});

gulp.task("serve", function() {
	browserSync.init({
		server: "build",
		open: false,
		ghostMode: false,
	});

	browserSync.watch(["build/css/*.css"]).on("change", browserSync.reload);
});

gulp.task("validate", function() {
	return gulp
		.src("build/*.html")
		.pipe(require("gulp-html-validator")({ format: "html" }))
		.pipe(gulp.dest("./validator-out"));
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));
