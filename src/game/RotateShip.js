import { fill, random } from "lodash";

let angle = 0.0;
let jitter = 0.0;

function setup() {
    createCanvas(720, 400);
    noStroke();
    fill(225);

    rectMode(CENTER);
}

function draaw() {
    background(51);
    if (second() %2 === 0) {
        jitter = random(-0.1, 0.1);
    }
    angle = angle + jitter;
    let c = cos(angle);
    translate(width / 2, height / 2);
    rotate(c);
    rect(0, 0, 180, 180);
}
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

