


// --------------------

function rotateImage(imageBase64, rotation, cb) {
    var img = new Image();
     img.src = imageBase64;
     img.onload = () => {
       var canvas = document.createElement("canvas");
       const maxDim = Math.max(img.height, img.width);
       if ([90, 270].indexOf(rotation) > -1) {
         canvas.width = img.height;
         canvas.height = img.width;
       } else {
         canvas.width = img.width;
         canvas.height = img.height;
       }
       var ctx = canvas.getContext("2d");
       ctx.setTransform(1, 0, 0, 1, maxDim / 2, maxDim / 2);
       ctx.rotate(90 * (Math.PI / 180));
       ctx.drawImage(img, -maxDim / 2, -maxDim / 2);
       cb(canvas.toDataURL("image/jpeg"))
     };
}

