#! node
const { execSync } = require("child_process");
const fs = require('fs');

//process.chdir("docs");

execSync('terser chrome/open_in_bitty.js > bookmarklet/open_in_bitty.js')

let data = fs.readFileSync('bookmarklet/open_in_bitty.js', 'utf8');
let shortcut = `[InternetShortcut]
URL=https://itty.bitty.app/itty.bitty-recipes/d/Send-recipes-to-itty.bitty-to-clean-them-up-and-make-them-available-offline/f/%F0%9F%8D%B3/#Make_itty.bitty/javascript:`
shortcut += encodeURIComponent(data)

fs.writeFileSync("bookmarklet/open_in_bitty.url",shortcut)

execSync('zip -r chrome.zip chrome')



