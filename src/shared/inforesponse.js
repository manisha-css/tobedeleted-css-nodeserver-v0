function InfoResponse(message, result) {
  this.message = message || null;
  this.result = result || null;
}

InfoResponse.prototype.getMessage = () => {
  return this.message;
};

InfoResponse.prototype.setMessage = message => {
  this.message = message;
};

InfoResponse.prototype.getResult = () => {
  return this.result;
};

InfoResponse.prototype.setResult = result => {
  this.result = result;
};

module.exports = InfoResponse; // Export the function as it is
