const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var newPath = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(newPath, text, (err) => {
      if (err) throw err;
      callback(null, { id, text });
    });
  });
  //items[id] = text;
  //callback(null, { id, text });
};

exports.readAll = (callback) => {
  var results = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) throw err; 
    files.forEach( (file) => {
      let fileText = file.slice(0,5);
      results.push({id: fileText, text: fileText});
    });
    callback(null, results); 
  })
};

exports.readOne = (id, callback) => {
  var newPath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(newPath, (err, files) => {
    if (err) {
      callback(err); 
      } else {
        callback(null, { id: id, text: String(files) });
      }
  })
};

exports.update = (id, text, callback) => {
  var newPath = path.join(exports.dataDir, id + '.txt');
  fs.access(newPath, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(newPath, text, (err) => {
        if (err) {
          callback(err); 
        } else {
          callback(null, { id: id, text: text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  var newPath = path.join(exports.dataDir, id + '.txt');
  fs.access(newPath, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(newPath, (err) => {
        if (err) {
          callback(err); 
        } else {
          callback();
        }
      })
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
