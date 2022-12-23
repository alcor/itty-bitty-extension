
(async () => {
  console.log("Location", document.location.href);

  let ib = 'https://itty.bitty.app'
  ib = "http://localhost:8888"

  if (location.origin == ib) {
    return location.reload();
  }
  let redirectToBlob = (blobParts, type, newTab = 0) => {
    f = new FileReader();
    f.onload = function(e) {
      let url = ib + '/#/' + e.target.result;
      console.log("Forwarding to", url, url.length);
      newTab ? window.open(url) : top.location.href = url;
    };
    
    let blob = new Blob(blobParts, {type:type + ";compress=true"});
    if (typeof CompressionStream !== 'undefined') {
      const compressedStream = blob.stream().pipeThrough(new CompressionStream("deflate"));    
      new Response(compressedStream).blob().then(b => 
        f.readAsDataURL(new Blob([b], {type: type + ";format=gz"}))
      )
    } else {
      f.readAsDataURL(blob);
    }
  }
  

  // HTML Selection
  let selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let content = document.getSelection().getRangeAt(0).cloneContents()
    const tpl = document.createElement('div');
    tpl.appendChild(content);
    return redirectToBlob([tpl.innerHTML], 'text/html;charset=utf-8')
  }
  
  let findRecipe = (document) => {
    let lds = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(e => e.innerText)
      .sort((a,b) => a.length - b.length)

    let r;
    for (const ld of lds) {
      r = JSON.parse(ld);
      console.log("TR", r)
      if (r["@type"] != "Recipe") {
        r = Array.isArray(r) ? r : r["@graph"]
        r = r?.find((item)=>item["@type"]=="Recipe")
      }
      if (!r) continue;
      console.log("Found Recipe:", r)

      delete r.review;
      delete r.video;
      if (!r.url) r.url = location.href;
      return r
    }
  }
  
  let r = findRecipe(document);
  if (r) {
    let type = "application/ld+json;charset=utf-8";
    return redirectToBlob([JSON.stringify(r)], type)
  } else {
    // if (!r) return alert("𝗦𝗲𝗻𝗱 𝘁𝗼 𝗶𝘁𝘁𝘆.𝗯𝗶𝘁𝘁𝘆\nWe could not find any standard markup on this page for recipes or other known data types. Try another page or highlight part of this one to send a text clipping.",);
    // Pass HTML for parsing
    return redirectToBlob([document.documentElement.outerHTML.substring(0,750000)], "text/raw+html;render=parse;encode=none;charset=utf-8")
  }

})();
