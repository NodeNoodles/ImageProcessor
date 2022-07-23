const fs = require('fs');
const path = require('path');
const { pipeline, Transform } = require('node:stream');

// const fileStream= fs.createReadStream("./file.txt");
// const transformedData= fs.createWriteStream("./transformedData.txt");

// const uppercase = new Transform({
//   transform(chunk, encoding, callback) {
//     callback(null, chunk.toString().toUpperCase());
//   },
// });

// fileStream.pipe(uppercase).pipe(transformedData);

function hexToRgb(hex) {
  const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToNegative(rgb) {
  if (!rgb) return null;
  return {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b,
  };
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(rgb) {
  if (!rgb) return;
  return componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

function hexToNegHex(hex) {
  const rgb = hexToRgb(hex);
  const negRgb = rgbToNegative(rgb);
  const negHex = rgbToHex(negRgb);
  // console.log(typeof negHex);
  return negHex;
}

// function onEnd(filePath) {
//   const imageStream = fs.createReadStream(filePath, {
//     encoding: 'hex',
//     highWaterMark: 3,
//   });

//   // imageStream.setEncoding('hex');

//   imageStream.on('data', (chunk) => {
//     // console.log(chunk);
//     // const rgb = hexToRgb(chunk);
//     // const negative = rgbToNegative(rgb);
//     // const updatedHex = rgbToHex(negative);
//     // const bufferHex = Buffer.from(updatedHex, 'hex');
//     // console.log(bufferHex);
//     writableImage.write(chunk);
//   });

//   imageStream.on('end', () => {
//     console.log('done receiving chunks');
//   });

//   const writableImage = fs.createWriteStream(
//     path.join(path.dirname(filePath), 'testNegative.jpeg')
//   );
// }

function onEnd(filePath) {
  const imageStream = fs.createReadStream(filePath, {
    encoding: 'hex',
    highWaterMark: 3,
  });

  const writableImage = fs.createWriteStream(
    path.join(path.dirname(filePath), 'testNegative.jpeg')
  );

  const transformImage = new Transform({
    transform: (chunk, encoding, callback) => {
      callback(chunk);
    },
  });

  transformImage.on('data', (chunk) => hexToNegHex(chunk));

  imageStream.pipe(transformImage).pipe(writableImage);

  // pipeline(imageStream, transformImage, writableImage, (err) => {
  //   if (err) {
  //     console.log('pipeline failed', err);
  //   } else {
  //     console.log('pipeline succeeded');
  //   }
  // });
}

onEnd(path.resolve(__dirname, '../downloads/anotherTest.jpeg'));
// const rgb = hexToRgb('5cb938');
// const neg = rgbToNegative(rgb);
// console.log(rgbToHex(neg));

// const { Transform } = require('node:stream');

// // All Transform streams are also Duplex Streams.
// const myTransform = new Transform({
//   writableObjectMode: true,

//   transform(chunk, encoding, callback) {
//     // Coerce the chunk to a number if necessary.
//     chunk |= 0;

//     // Transform the chunk into something else.
//     const data = chunk.toString(16);

//     // Push the data onto the readable queue.
//     callback(null, '0'.repeat(data.length % 2) + data);
//   },
// });

// myTransform.setEncoding('ascii');
// myTransform.on('data', (chunk) => console.log(chunk));

// myTransform.write(1);
// // Prints: 01
// myTransform.write(10);
// // Prints: 0a
// myTransform.write(100);
// // Prints: 64
