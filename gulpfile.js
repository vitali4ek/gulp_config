const { src, dest, lastRun, series, parallel, watch, task } = require("gulp");
const BrowserSync = require("browser-sync").create();
const FileInclude = require("gulp-file-include");
const Del = require("del");
const Sass = require("gulp-sass");
const Autoprefixer = require("gulp-autoprefixer");
const GroupCssMediaQueries = require("gulp-group-css-media-queries");
const CleanCss = require("gulp-clean-css");
const Rename = require("gulp-rename");
const UglifyEs = require('gulp-uglify-es').default;
const Babel = require("gulp-babel");
const ImageMin = require("gulp-imagemin");
const Webp = require("gulp-webp");
const WebpHtml = require("gulp-webp-html");
// const WebpCss = require("gulp-webp-css");
const Ttf2Woff = require("gulp-ttf2woff");
const Ttf2Woff2 = require("gulp-ttf2woff2");
const Fonter = require("gulp-fonter");

const fs = require('fs');

const PATHS = require("./paths");



task("otf2ttf", function() {
	return src([`${PATHS.src._}/fonts/*.otf`])
		.pipe(Fonter({
			formats: ["ttf"]
		}))
		.pipe(dest(`${PATHS.src._}/fonts/`));
})

task("updateFotnList", function (cb) {
	fs.readdir(PATHS.build.fonts, (err, items) => {
		if (items) {
			let prevFontName = "";
			fs.appendFile(`${PATHS.src._}/style/fonts.scss`, `\r\n\n/*-------need to correct font-weight and font-style-------*/\r\n`, cb);
			items.forEach((item) => {
				const fontName = item.split(".")[0];
				const fontFamilyName = fontName.split("-")[0] || fontName;
				const fontWeight = /heavy|(?<!semi)bold/i.test(fontName) ? "700 900" : "400";
				const fontStyle = /italic/i.test(fontName) ? "italic" : "normal";
				if (prevFontName !== fontName) {
					fs.appendFile(`${PATHS.src._}/style/fonts.scss`, 
						`@include font("${fontFamilyName}", "${fontName}", "${fontWeight}", "${fontStyle}");\r\n`,
						cb);
				}
				prevFontName = fontName;
			}) 
		}
	})
	cb();
})

function html() {
	return src(PATHS.src.html)
		.pipe(FileInclude())
		.pipe(WebpHtml())
		.pipe(dest(PATHS.build.html))
		.pipe(BrowserSync.stream())
}

function css() {
	return src(PATHS.src.css, { sourcemaps: true })
		.pipe(Sass({
			outputStyle: 'expanded'
		}))
		.pipe(GroupCssMediaQueries())
		.pipe(Autoprefixer({
			cascade: true
		}))
		// .pipe(WebpCss())
		.pipe(dest(PATHS.build.css))
		.pipe(CleanCss())
		.pipe(Rename({
			extname: ".min.css"
		}))
		.pipe(dest(PATHS.build.css, { sourcemaps: '../maps' }))
		.pipe(BrowserSync.stream())
}

function js() {
	return src(PATHS.src.js, { sourcemaps: true })
		.pipe(FileInclude())
		.pipe(dest(PATHS.build.js))
		.pipe(Babel({
			presets: ['@babel/env']
		}))
		.pipe(UglifyEs())
		.pipe(Rename({
			extname: ".min.js"
		}))
		.pipe(dest(PATHS.build.js, { sourcemaps: '../maps' }))
		.pipe(BrowserSync.stream())
}

function img() {
	src(PATHS.src.img, { since: lastRun(img) })
		.pipe(Webp({
			quality: 70
		}))
		.pipe(dest(PATHS.build.img))
	return src(PATHS.src.img, { since: lastRun(img) })
		.pipe(ImageMin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			interlaced: true,
			optimizationLevel: 3 // 0..7
		}))
		.pipe(dest(PATHS.build.img))
		.pipe(BrowserSync.stream())
}

function fonts() {
	src([`${PATHS.src._}/fonts/*.{woff,woff2}`])
		.pipe(dest(PATHS.build.fonts));
	src(PATHS.src.fonts)
		.pipe(Ttf2Woff())
		.pipe(dest(PATHS.build.fonts));
	return src(PATHS.src.fonts)
		.pipe(Ttf2Woff2())
		.pipe(dest(PATHS.build.fonts));
}

function clean() {
	return Del(PATHS.clean);
}

function watchFiles() {
	watch([PATHS.watch.html], html);
	watch([PATHS.watch.css], css);
	watch([PATHS.watch.js], js);
	watch([PATHS.watch.img], img);
}

function browserSync(params) {
	BrowserSync.init({
		server: {
			baseDir: `./${PATHS.build._}/`
		},
		port: 3000,
		notify: false
	})
}


const build = series(clean, parallel(html, css, js, img, fonts));
const start = parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.start = start;
exports.default = start;