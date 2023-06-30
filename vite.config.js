import { defineConfig } from 'vite';

import {globSync} from 'glob';//ワイルドカードを使って各ファイルの名前を取得し一括で登録するため
import path from 'node:path';//上記の実行次にnpmのpathを利用
import { fileURLToPath } from 'node:url';//上記の実行時にURLをpathに変更させるため
import liveReload from 'vite-plugin-live-reload';//Dev時のファイルリロード監視に任意のファイルを追加できるようにするため
import { ViteEjsPlugin } from "vite-plugin-ejs";//EJS用プラグイン


//** ↓JS、SCSSなどの各ファイルの名称、path情報を配列に格納する設定 */
const inputJsArray = globSync('src/**/*.js', { ignore:

['node_modules/**','**/modules/**','**/html/**'] }).map(file => {
  return [
    path.relative(
      'src/js',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ]
});


const inputHtmlArray = globSync(['src/**/*.html'], { ignore: ['node_modules/**']

}).map(file => {
  return [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ]
});


const inputScssArray = globSync('src/scss/**/*.scss', { ignore: ['src/scss/**/_*.scss'] }).map(file => {

  return [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ]
});

/**
*　各ファイル情報の配列をまとめて、Objectにする設定
*/
const inputObj = Object.fromEntries(inputJsArray.concat(inputHtmlArray, inputScssArray));
console.log(inputObj);

/**
* Viteの設定
*/
export default defineConfig({
  root: './src', //開発ディレクトリ設定
  base: './',//各ファイルのPathを絶対パスから相対パスにするようにするため
  build: {
    outDir: '../html', //出力場所の指定
    emptyOutDir: true,//build時に出力先ディレクトリを空にする
    rollupOptions: {//rollupOptionsにて出力ファイル名を元ファイルを元にする設定をする
      input: inputObj,
      output: {
        entryFileNames: `assets/js/entry-[name].js`,//JSファイルの出力設定
        chunkFileNames: `assets/js/modules/[name].js`,//chunkファイルをmoduleディレクトリに入れる
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return 'assets/images/[name].[ext]';//画像アセットの出力設定
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      }
    }
  },
  plugins: [
    liveReload(['components/**/*.ejs']),//開発サーバーのライブリロードに任意のファイルを追加する設定
    ViteEjsPlugin(),//ViteのEJSプラグインの設定
  ]
});
