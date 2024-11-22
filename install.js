var fs = require("fs");
var path = require("path");
var binstall = require(path.join(__dirname, "binstall"));

module.exports = function install(config, unpackedBinPath, os, arch) {
  if (!fs.existsSync("bin")) {
    fs.mkdirSync("bin");
  }

  var binExt = "";
  if (os == "win32") {
    binExt = ".exe";
  }

  var buildId = os + "-" + arch;
  var url = config.urls[buildId];
  if (!url) {
    throw new Error("No binaries are available for your platform: " + buildId);
  }
  return binstall(url, unpackedBinPath).then(function() {
    var sub = fs.readdirSync(unpackedBinPath);
    var moveFrom;
    if (sub.length === 1) {
      var inner = path.join(unpackedBinPath, sub[0])
      var stats = fs.statSync(inner);
      if (stats.isDirectory()) {
        moveFrom = inner;
      }
    }
    config.binaries.forEach(function(bin) {
      if (moveFrom)
        fs.renameSync(path.join(moveFrom, bin + binExt), 
                      path.join(unpackedBinPath, bin + binExt));
      fs.chmodSync(path.join(unpackedBinPath, bin + binExt), "755");
    });
  });
};
