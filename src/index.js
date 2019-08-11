#!/usr/bin/env node

const fs = require("fs"),
    argv = require("yargs").argv;
const crypto = require("crypto");

const iv = Buffer.alloc(16, 0);
const algorithm = 'aes-192-cbc';
const password = argv.key;
const key = crypto.scryptSync(password, 'salt', 24);

if (argv.e && argv.key && argv.file) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const input = fs.createReadStream(argv.file);
    const output = fs.createWriteStream(`${argv.file}.enc`);

    input.pipe(cipher).pipe(output);
}

if (argv.d && argv.key && argv.file) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const input = fs.createReadStream(argv.file);
    const output = fs.createWriteStream(`${argv.file}.dec`);

    input.pipe(decipher).pipe(output);
}