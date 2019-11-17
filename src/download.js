import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default async function (options) {
  let {urls, name} = options;
  if((!typeof urls instanceof Array)){
    throw 'invalid param urls'
  }
  if(!urls.length){
    throw 'invalid param urls'
  }

  name = name || 'images';

  let zip = new JSZip();
  let img = zip.folder(name);//生成一个目录

  let imgBase64List = [];
  let promiseArr = urls.map((src)=>{
    return getBase64FromUrl(src);
  });

  try {
    let resList = await Promise.all(promiseArr);
    resList.forEach((res)=>{
      if(res.code === 0 && res.dataURL){
        imgBase64List.push({
          dataURL: res.dataURL.substring(22),
          ext: res.ext,
          name: res.name
        });
      }
    });

    imgBase64List.forEach((item, index)=>{
      let { dataURL, ext, name } = item;
      name = name || index;
      img.file( `${name}.${ext}` , dataURL, {base64: true});
    })

    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, `${name}.zip`);
    });

  } catch (error) {
    console.log(error);
  }
}

function getBase64UrlFromImage(img,width,height) {
  var canvas = document.createElement("canvas");
  canvas.width = width ? width : img.width;
  canvas.height = height ? height : img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  var dataURL = canvas.toDataURL();
  return dataURL;
}

function getBase64FromUrl(url){
  return Promise.race([
    new Promise((resolve, reject)=>{
      var image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = url;
      if(url){
        image.onload =function (){
          let dataURL = getBase64UrlFromImage(image)
          resolve({
            code: 0,
            dataURL,
            ext: url.substring(url.lastIndexOf(".")+1),
            name: ''
          });
        }
      }
    }),
    new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve({
          code: -1,
          message: `load image for ${url} timeout`
        })
      }, 1000 * 5)
    })
  ])
}
