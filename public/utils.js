// Augmenting the Array prototype with max, min and insert functions
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
  return this;
};