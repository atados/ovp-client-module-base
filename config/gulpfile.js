const path = require('path')
const { src, dest, series, watch } = require('gulp')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes')
const postcssFilters = require('postcss-filters')
const postcssSelectorNot = require('postcss-selector-not')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano')

const css = () =>
  src(path.resolve('..', '..', 'base', 'styles', 'global', 'index.styl'))
    .pipe(sourcemaps.init())
    .pipe(
      stylus({
        compress: true,
      }),
    )
    .pipe(
      postcss([
        postcssFilters(),
        postcssSelectorNot(),
        postcssFlexbugsFixes(),
        cssnano(),
        autoprefixer({ browsers: ['last 5 versions'] }),
      ]),
    )
    .pipe(sourcemaps.write('./'))
    .pipe(dest(path.resolve('..', '..', 'channel', 'generated', 'styles')))

const watchCSS = () =>
  watch(path.resolve('..', '..', 'base', 'styles', '**', '*.styl'), css)

exports.watch = series(css, watchCSS)
exports.css = css
exports.default = series(css)
