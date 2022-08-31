const { deflate, unzip } = require('zlib');
const { promisify } = require('util');

const input = 'spam spam spam spam spam spam spam spam';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log("Compression succeeded:\n" + "input: " + input + "\n" +
    "length of output (bytes): " + buffer.length + "\n" +
    "output in base64: " + buffer.toString('base64'));
});

const compressed = 'eJwrLkjMVSgmSAAAINoOaQ==';
const buffer = Buffer.from(compressed, 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log("Decompression succeeded:\n" + "compressed: " + compressed +
  "\n" +
    "decompressed: " + buffer.toString());
});


// Promisified version
const zip = promisify(deflate);

zip(input)
  .then((buf) => console.log("Promisified zipping (base64): " +
   buf.toString('base64')))
  .catch((err) => {
    console.error('Promisified: An error occurred:', err);
    process.exitCode = 1;
  });
