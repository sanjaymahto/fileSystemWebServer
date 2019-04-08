const fs = require("fs");
var path = require('path');

function fileFormatter(dirPath, files) {
    let fileArray = [];
    files.forEach((file) =>{
        fileArray.push({
            file: file,
            type: path.extname(`${dirPath}/${file}`),
            size: fs.statSync(`${dirPath}/${file}`).size,
            date: (fs.statSync(`${dirPath}/${file}`).birthtime).toLocaleDateString()
        })
    })
    return {
        status: 200,
        files: fileArray
    }
}

module.exports = fileFormatter;