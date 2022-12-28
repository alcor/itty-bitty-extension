#! node
const { execSync } = require("child_process");
const fs = require('fs');

//process.chdir("docs");

execSync('terser chrome/open_in_bitty.js > bookmarklet/open_in_bitty.min.js')

let data = fs.readFileSync('bookmarklet/open_in_bitty.min.js', 'utf8');
let url = `https://itty.bitty.app/itty.bitty-recipes/d/Send-recipes-to-itty.bitty-to-clean-them-up-and-make-them-available-offline/f/%F0%9F%8D%B3/#Make_itty.bitty/javascript:` + encodeURIComponent(data);
let shortcut = `[InternetShortcut]
URL=` + url

fs.writeFileSync("bookmarklet/open_in_bitty.url",shortcut)
fs.writeFileSync("docs/bookmarklet.html", `<meta http-equiv="Refresh" content="0; url='${url}'" />`

)


execSync('zip -r chrome.zip chrome')



