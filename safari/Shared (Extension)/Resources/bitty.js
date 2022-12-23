(async () => {
  console.log("Location", document.location.href);
    
  let ib = 'https://itty.bitty.app'

  let selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let content = document.getSelection().getRangeAt(0).cloneContents()
    console.log(content)

    const tpl = document.createElement('div');
    tpl.appendChild(content);
    console.log("Inner", tpl.innerHTML.length, tpl.innerHTML)
    
    if (tpl.innerHTML.length) {
      f = new FileReader();
      f.onload = function(e) {window.open(ib + '/#/' + e.target.result);};
      f.readAsDataURL(new Blob([tpl.innerHTML],{type:'text/html;compress=true;charset=utf-8'}));
      return
    }
  }

  let recipe = 
  ((ib) => {
    ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(e => e.innerText)
      .sort((a,b) => a.length - b.length)
      .pop();
    if (!ld) alert("No selection or recipe metadata found on this page. Sorry!");
    ld = JSON.parse(ld);
    if (ld["@type"] != "Recipe"){ ld=(ld["@graph"]??ld).find((item)=>item["@type"]=="Recipe") }
    delete ld.review;
    delete ld.video;
    if (!ld.url) ld.url = location.href;
    f = new FileReader();
    f.onload = function(e) {location.href = (ib + '/#/' + e.target.result);};
    f.readAsDataURL(new Blob([JSON.stringify(ld)],{type:'application/ld+json;compress=true;charset=utf-8'}));
  })(ib)



})();


// browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
//     console.log("Received response: ", response);
// });
