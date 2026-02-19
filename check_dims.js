
const fs = require('fs');
const path = require('path');

function getDimensions(buffer) {
    // PNG signature
    if (buffer.toString('hex', 0, 8) === '89504e470d0a1a0a') {
        const width = onReadUInt32BE(buffer, 16);
        const height = onReadUInt32BE(buffer, 20);
        return { width, height, type: 'png' };
    }
    return null;
}

function onReadUInt32BE(buf, offset) {
    return (buf[offset] << 24) | (buf[offset + 1] << 16) | (buf[offset + 2] << 8) | buf[offset + 3];
}

try {
    const buffer = fs.readFileSync('logo.png');
    const dims = getDimensions(buffer);
    if (dims) {
        console.log(`Dimensions: ${dims.width}x${dims.height}`);
    } else {
        console.log('Not a valid PNG or could not read dimensions.');
    }
} catch (e) {
    console.error(e);
}
