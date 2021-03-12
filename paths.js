const sources = "src";
const dist = "build";

const PATHS = {
	build: {
		_: dist,
		html: `${dist}/`,
		css: `${dist}/css/`,
		js: `${dist}/js/`,
		img: `${dist}/img/`,
		fonts: `${dist}/fonts/`,
	},
	src: {
		_: sources,
		html: `${sources}/*.html`,
		css: `${sources}/style/index.scss`,
		js: `${sources}/js/index.js`,
		img: `${sources}/img/**/*.{png,jpg,gif,svg,ico,webp}`,
		fonts: `${sources}/fonts/*.ttf`,
	},
	watch: {
		html: `${sources}/**/*.html`,
		css: `${sources}/style/**/*.scss`,
		js: `${sources}/js/**/*.js`,
		img: `${sources}/img/**/*.{png,jpg,gif,svg,ico,webp}`,
	},
	clean: `./${dist}/`,
};


module.exports = PATHS;