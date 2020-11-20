import path from 'path';
import gulp from 'gulp';
import pkg from './package';
import yargs from 'yargs';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import rename from 'gulp-rename';

const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');


const PRODUCTION = yargs.argv.prod;

const paths = {
  css: {
    src: ['assets/scss/frontend.scss'],
    dest: 'assets/css/'
  },
  js: {
    src: ['assets/js/frontend.js'],
    dest: 'assets/js/'
  },
  images: {
    src: 'assets/images/**/*.{jpg,jpeg,png,gif,svg}',
    dest: 'assets/images'
  },
  php: {
    src: [
      '**/*.php',
      '!apigen/**',
      '!includes/libraries/**',
      '!node_modules/**',
      '!tests/**',
      '!vendor/**',
      '!tmp/**'
    ],
    dest: './'
  },
  other: {
    src: ['src/**/*', '!src/{css,js,images}', '!src/{css,js,images}/**/*'],
    dest: 'assets'
  },
  build: {
    src: [
      '**/*',
      '!node_modules/**',
      '!block/node_modules/**',
      '!build/**',
      '!src/**',
      '!**/*.md',
      '!**/*.map',
      '!**/*.sh',
      '!.idea/**',
      '!bin/**',
      '!.git/**',
      '!gulpfile.babel.js',
      '!package.json',
      '!composer.json',
      '!composer.lock',
      '!package-lock.json',
      '!debug.log',
      '!none',
      '!.babelrc',
      '!.gitignore',
      '!.gitmodules',
      '!phpcs.xml.dist',
      '!npm-debug.log',
      '!plugin-deploy.sh',
      '!export.sh',
      '!config.codekit',
      '!nbproject/*',
      '!tests/**',
      '!.csscomb.json',
      '!.editorconfig',
      '!.jshintrc',
      '!.tmp',

      '!.babelrc',
      '!.gitattributes',
      '!.note.md',
      '!assets/scss/**',
      '!assets/js/frontend.js',
      '!assets/js/preload.js',
    ],
    dest: 'build'
  }
};

export const clean = () => del(['build']);

export const css = () => {

  return gulp.src(paths.css.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.css.dest))
};

export const js = () => {
  return gulp.src(paths.js.src)
    .pipe(named())
    .pipe(webpack({
      mode: PRODUCTION ? 'production' : 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            ]
          },
        ]
      },

      plugins: [
        new ReplaceInFileWebpackPlugin([
          {
            files: ['wp-ajax.php'],
            rules: [
              {
                search: /Version:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
                replace: 'Version:$1' + pkg.version,
              },
              {
                search: /define\(\s*'WP_AJAX_VERSION',\s*'(.*)'\s*\);/,
                replace: `define( 'WP_AJAX_VERSION', '${pkg.version}' );`,
              },
            ],
          },
          {
            files: ['readme.txt'],
            rules: [
              {
                search: /^(\*\*|)Stable tag:(\*\*|)(\s*?)[a-zA-Z0-9.-]+(\s*?)$/im,
                replace: '$1Stable tag:$2$3' + pkg.version,
              },
            ],
          },
        ]),
      ],

      externals: {
        "jquery": "jQuery"
      },

      resolve: {
        modules: [
          path.join(__dirname, "js/helpers"),
          "node_modules"
        ]
      },

      devtool: !PRODUCTION ? 'inline-source-map' : false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.js.dest));
};

export const copy = () => {
  return gulp.src(paths.other.src)
    .pipe(gulp.dest(paths.other.dest));
};

export const watch = () => {
  gulp.watch('assets/scss/**/*.scss', css);
  gulp.watch('assets/js/**/*.js', js);
  gulp.watch(paths.other.src, copy);
};

export const compress = () => {
  return gulp.src(paths.build.src)
    //.pipe(replace('__prefix', 'REPLACE_STRING'))
    .pipe(zip(`${pkg.name}.zip`))
    .pipe(gulp.dest(paths.build.dest));
};

export const dev = gulp.series(gulp.parallel(css, js, copy), watch);
export const build = gulp.series(clean, gulp.parallel(css, js, copy), compress);

export default dev;
