#!/usr/bin/env node

const fs = require("fs"),
    argv = require("yargs").argv;
const crypto = require("crypto"),
    resizedIV = Buffer.allocUnsafe(16),
    iv = crypto
    .createHash("sha256")
    .update("myHashedIV")
    .digest();

iv.copy(resizedIV);

if (argv.e && argv.key && argv.file) {
    const key = crypto.createHash("sha256").update(argv.key).digest(),
        cipher = crypto.createCipheriv("aes256", key, resizedIV);

    let input = fs.createReadStream(argv.file, "utf-8");
    let output = fs.createWriteStream(`${argv.file}.enc`, "utf-8");
    input.on("data", chunk => {
        let str = ''
        str += chunk;
        let encrypt = cipher.update(str, "binary", "hex");
        output.write(encrypt);
    });
}

if (argv.d && argv.key && argv.file) {
    const key = crypto
        .createHash("sha256")
        .update(argv.key)
        .digest(),
        decipher = crypto.createDecipheriv("aes256", key, resizedIV);

    let input = fs.createReadStream(argv.file, "utf-8");
    let output = fs.createWriteStream(`${argv.file}.dec`, "utf-8");

    input.on("data", chunk => {
        output.write(decipher.update(chunk, "hex", "binary"));
    });
}