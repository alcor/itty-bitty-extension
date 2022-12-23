
(async () => {
  console.log("Location", document.location.href);

  let ib = 'https://itty.bitty.app'
  // ib = "http://localhost:8888"

  if (location.origin == ib) {
    return location.reload();
  }
  let redirectToBlob = async (blobParts, type, newTab = 0) => {
    f = new FileReader();
    f.onload = function(e) {
      let url = ib + '/#/' + e.target.result;
      console.log("Forwarding to", url, url.length);
      newTab ? window.open(url) : top.location.href = url;
    };
    
    let blob = new Blob(blobParts, {type:type + ";compress=true"});
    try  {
      if (typeof CompressionStream !== 'undefined') {
        const compressedStream = blob.stream().pipeThrough(new CompressionStream("deflate"));
        let b = await new Response(compressedStream).blob();
        f.readAsDataURL(new Blob([b], {type: type + ";format=gz"}))
        return
      }
    } catch (e) {
      console.warn("Error:", e, "Falling back to raw data", blobParts);
    }
    
    f.readAsDataURL(blob);
  }

  // HTML Selection
  let selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let content = document.getSelection().getRangeAt(0).cloneContents()
    const tpl = document.createElement('div');
    tpl.appendChild(content);
    return redirectToBlob([tpl.innerHTML], 'text/html;charset=utf-8')
  }
  
  let findRecipeNode = (r) => {
    if (r["@type"]?.includes("Recipe") || r.recipeInstructions) return r;
    r = Array.isArray(r) ? r : r["@graph"]
    r = r?.find((item)=>item["@type"]?.includes("Recipe"))
    return r
  }

  let findLDJsonRecipe = (document) => {
    let lds = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(e => e.innerText)
    .sort((a,b) => a.length - b.length)

    for (const ld of lds) {
      let r = findRecipeNode(JSON.parse(ld));
      if (!r) continue;
      
      delete r.review;
      delete r.video;
      if (!r.mainEntityOfPage) r.mainEntityOfPage = location.href;
      
      return r;
    }
  }
  
  let r = findLDJsonRecipe(document);
  console.log("Found Recipe", r)
  
  if (r) {
    let type = "application/ld+json;charset=utf-8";
    return redirectToBlob([JSON.stringify(r)], type)
  } else {
    // if (!r) return alert("𝗦𝗲𝗻𝗱 𝘁𝗼 𝗶𝘁𝘁𝘆.𝗯𝗶𝘁𝘁𝘆\nWe could not find any standard markup on this page for recipes or other known data types. Try another page or highlight part of this one to send a text clipping.",);
    // Pass HTML for parsing
    return redirectToBlob([document.documentElement.outerHTML.substring(0,750000)], "text/raw+html;render=parse;encode=none;charset=utf-8")
  }

})();
