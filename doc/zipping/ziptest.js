const { deflate, unzip } = require('zlib');


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
