'use strict';

var Pixelart = (function () { // jshint ignore:line

  /**
   * Creates a new Pixelart
   *
   * @param target
   * @param ascii
   * @param options
   * @returns {Pixelart}
   * @constructor
   */
  function Pixelart (target, ascii, options) {

    this._ensureDefined(['target', target], ['ascii', ascii]);

    this.ascii = ascii;
    this.target = target.jquery ? target[0] : target;
    this.options = options;

    this._cleanOptions();
    this.draw();

    return this;

  }

  /**
   * Throw if any of the given parameters is undefined
   *
   * @private
   */
  Pixelart.prototype._ensureDefined = function () {
    Array.prototype.slice.call(arguments).forEach(function (item) {
      if (item[1] === void 0) { throw new Error('required argument ' + item[0]); }
    });
  };

  /**
   * Clean the options object
   *
   * @private
   */
  Pixelart.prototype._cleanOptions = function () {
    if (!this.options) { this.options = {}; }
    this.options = {
      pixelSize: this.options.pixelSize || 10,
      color: this.options.color ? hexToRgb(this.options.color) : { r: 0, g: 0, b: 0 },
      colorMap: this.options.colorMap ? this._buildColorMap(this.options.colorMap) : null,
      stagger: this.options.stagger || 0
    };
  };

  /**
   * Generate the real color map with the option color map
   * (the colors will be rgb instead of hex)
   *
   * @param input
   * @returns {object}
   * @private
   */
  Pixelart.prototype._buildColorMap = function (input) {
    var colorMap = {};
    Object.keys(input).forEach(function (key) {
      colorMap[key] = hexToRgb(input[key]);
    });
    return colorMap;
  };

  /**
   * Number of cols of the output
   *
   * @returns {number}
   */
  Pixelart.prototype.cols = function () {
    var w = 0;
    this._iterateRows(function (row) {
      if (row.length > w) { w = row.length; }
    });
    return w;
  };

  /**
   * Number of rows of the output
   *
   * @returns {number}
   */
  Pixelart.prototype.rows = function () {
    return this.ascii.length;
  };

  /**
   * Width in pixel of the output
   *
   * @returns {number}
   */
  Pixelart.prototype.width = function () {
    return this.cols() * this.options.pixelSize;
  };

  /**
   * Height in pixel of the output
   *
   * @returns {number}
   */
  Pixelart.prototype.height = function () {
    return this.rows() * this.options.pixelSize;
  };

  /**
   * Create the canvas element
   *
   * @returns {Element}
   * @private
   */
  Pixelart.prototype._createCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width();
    canvas.height = this.height();
    return canvas;
  };

  /**
   * Iterate through rows
   *
   * @param {function} cb
   * @private
   */
  Pixelart.prototype._iterateRows = function (cb) {
    var self = this;
    this.ascii.forEach(function (row, y) {
      cb.apply(self, [row, y]);
    });
  };

  /**
   * Iterate through each block
   *
   * @param {function} cb
   * @private
   */
  Pixelart.prototype._iterate = function (cb) {
    var self = this;
    this._iterateRows(function (row, y) {
      this.ascii[y].split('').forEach(function (char, x) {
        cb.apply(self, [char, x, y]);
      });
    });
  };

  /**
   * Return the default color
   *
   * @returns {object}
   */
  Pixelart.prototype.color = function () {
    return this.options.color;
  };

  /**
   * Draw the output
   *
   * @returns {Pixelart}
   */
  Pixelart.prototype.draw = function () {

    // clean element
    while (this.target.firstChild) { this.target.removeChild(this.target.firstChild); }

    var canvas = this._createCanvas();
    var ctx = canvas.getContext('2d');
    var i = 0;
    var fillStyle;

    this._iterate(function (char, x, y) {
      if (char === ' ') { return; }
      if (this.options.colorMap && char in this.options.colorMap) {
        fillStyle = canvasColor(this.options.colorMap[char]);
      } else {
        fillStyle = canvasColor(this.options.color);
      }
      if (this.options.stagger && i !== 0) {
        setTimeout(
          drawRect(
            ctx,
            fillStyle,
            x * this.options.pixelSize,
            y * this.options.pixelSize,
            this.options.pixelSize
          ),
          this.options.stagger * i
        );
      } else {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(
          x * this.options.pixelSize,
          y * this.options.pixelSize,
          this.options.pixelSize,
          this.options.pixelSize
        );
      }
      ++i;
    });

    this.target.appendChild(canvas);

    return this;

  };

  /**
   * Delete the canvas
   */
  Pixelart.prototype.destroy = function () {
    this.target.removeChild(this.target.firstElementChild);
  };

  // utils

  function drawRect (ctx, fillStyle, x, y, size) {
    return function () {
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x, y, size, size);
    };
  }

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
