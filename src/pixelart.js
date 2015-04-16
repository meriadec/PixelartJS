'use strict';

var Pixelart = (function () { // jshint ignore:line

  function Pixelart (target, ascii, options) {

    this._ensureDefined(['target', target], ['ascii', ascii]);

    this.ascii = ascii;
    this.target = target.jquery ? target[0] : target;
    this.options = options;

    this._cleanOptions();

    return this;

  }

  Pixelart.prototype._ensureDefined = function () {
    Array.prototype.slice.call(arguments).forEach(function (item) {
      if (item[1] === void 0) { throw new Error('required argument ' + item[0]); }
    });
  };

  Pixelart.prototype._cleanOptions = function () {
    if (!this.options) { this.options = {}; }
    this.options = {
      pixelSize: this.options.pixelSize || 10,
      color: this.options.color ? hexToRgb(this.options.color) : { r: 0, g: 0, b: 0 },
      colorMap: this.options.colorMap ? this._buildColorMap(this.options.colorMap) : null
    };
  };

  Pixelart.prototype._buildColorMap = function (input) {
    var colorMap = {};
    Object.keys(input).forEach(function (key) {
      colorMap[key] = hexToRgb(input[key]);
    });
    return colorMap;
  };

  Pixelart.prototype.cols = function () {
    var w = 0;
    this._iterateRows(function (row) {
      if (row.length > w) { w = row.length; }
    });
    return w;
  };

  Pixelart.prototype.rows = function () {
    return this.ascii.length;
  };

  Pixelart.prototype.width = function () {
    return this.cols() * this.options.pixelSize;
  };

  Pixelart.prototype.height = function () {
    return this.rows() * this.options.pixelSize;
  };

  Pixelart.prototype._createCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width();
    canvas.height = this.height();
    return canvas;
  };

  Pixelart.prototype._iterateRows = function (cb) {
    var self = this;
    this.ascii.forEach(function (row, y) {
      cb.apply(self, [row, y]);
    });
  };

  Pixelart.prototype._iterate = function (cb) {
    var self = this;
    this._iterateRows(function (row, y) {
      this.ascii[y].split('').forEach(function (char, x) {
        cb.apply(self, [char, x, y]);
      });
    });
  };

  Pixelart.prototype.color = function () {
    return this.options.color;
  };

  Pixelart.prototype.draw = function () {

    var canvas = this._createCanvas();
    var ctx = canvas.getContext('2d');

    this._iterate(function (char, x, y) {
      if (char === ' ') { return; }
      if (this.options.colorMap && char in this.options.colorMap) {
        ctx.fillStyle = canvasColor(this.options.colorMap[char]);
      } else {
        ctx.fillStyle = canvasColor(this.options.color);
      }
      ctx.fillRect(x * this.options.pixelSize, y * this.options.pixelSize, this.options.pixelSize, this.options.pixelSize);
    });

    this.target.appendChild(canvas);

    return this;

  };

  // utils

  function hexToRgb (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var color = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
    if (!color) { throw new Error('Invalid color: ' + hex); }
    return color;
  }

  function canvasColor (color) {
    return 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
  }

  return Pixelart;

})();
