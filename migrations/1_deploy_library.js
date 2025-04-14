const LibraryManagement = artifacts.require("LibraryManagement");

module.exports = function(deployer) {
  deployer.deploy(LibraryManagement);
}; 