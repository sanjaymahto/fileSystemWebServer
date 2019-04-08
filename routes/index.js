var express = require('express');
var fs = require('fs')
var rimraf = require("rimraf");
var fileFormatter = require('../utils/response');
var error = require('../utils/errorMessage');
var router = express.Router();

async function makeDir (dirpath) {
  try {
    await fs.mkdir(dirpath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

router.get('/', function(req, res, next) {
  res.send({
    status: 200,
    message: 'Welcome!'
  })
})

/* Router to get files from the directory */
router.post('/files', function(req, res, next) {
    let {path} = req.body;
    let dirPath = `${process.cwd()}/${path}`
    fs.readdir(dirPath, function(err, items) {
      if(err) {
        res.send(error(err));
      } else {
        res.send(fileFormatter(dirPath,items))
      }
  });
});

/* Router to create a file */
router.post('/createFile', function(req, res, next) {
  let {path, fileName} = req.body;
  let dirPath = `${process.cwd()}/${path}`
  fs.writeFile(`${dirPath}/${fileName}`, '', function (err) {
    if (err){ 
      res.send(error(err));
    } else {
      res.send({
        status: 200,
        message: 'File SuccessFully created!'
      })
    }
  });
});

/* Router to create a folder */
router.post('/createFolder', async function(req, res, next) {
  let {path, folderName} = req.body;
  let dirPath = `${process.cwd()}/${path}/${folderName}`
    try {
      await makeDir(`${dirPath}`)
      res.send({
        status: 200,
        message: 'folder successfully created'
      })
    } catch (err) {
      res.send(error(err));
    }
});


/* Router to delete a file */
router.post('/deleteFile', async function(req, res, next) {
  let {path, fileName} = req.body;
  let dirPath = `${process.cwd()}/${path}/${fileName}`
  fs.unlink(dirPath, function (err) {
    if (err) {
      res.send(error(err));
    }
    res.send({
      status: 200,
      message: 'file deleted Successfully!!'
    })
  });
});


/* Router to delete a folder */
router.post('/deleteFolder', async function(req, res, next) {
  let {path, folderName} = req.body;
  let dirPath = `${process.cwd()}/${path}/${folderName}`
  rimraf(dirPath, function (err) {
    if(err) {
      res.send(error(err));
    } else {
      res.send({
        status: 200,
        message: 'folder successfully deleted!'
      })
    }
  });
});

module.exports = router;
