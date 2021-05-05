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
  var sub = fs.readdirSync(unpackedBinPath);
  if (sub.length === 1) {
    var stats = fs.statSync(path.join(unpackedBinPath, sub[0]));
    if (stats.isDirectory()) {
      unpackedBinPath = path.join(unpackedBinPath, sub[0]);
    }
  }
  return binstall(url, unpackedBinPath).then(function() {
    config.binaries.forEach(function(bin) {
      fs.chmodSync(path.join(unpackedBinPath, bin + binExt), "755");
    });
  });
};
