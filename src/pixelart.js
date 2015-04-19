(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Pixelart = factory();
  }
})(this, function () {

  'use strict';

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

    ensureDefined(['target', target], ['ascii', ascii]);

    this.target = target.jquery ? target[0] : target;
    this.options = cleanOptions(options);

    if (multipleAscii(ascii)) {
      this.multiple = true;
      this.frames = ascii;
      this.ascii = ascii[0];
    } else {
      this.ascii = ascii;
    }

    this.draw();

    return this;

  }

  /**
   * Number of cols of the output
   *
   * @returns {number}
   */
  Pixelart.prototype.cols = function () {
    var w = 0;
    function onRow (row) {
      if (row.length > w) { w = row.length; }
    }
    if (this.multiple) {
      for (var i = 0; i < this.frames.length; i++) {
        _iterateRows(this.frames[i], onRow);
      }
    } else { _iterateRows(this.ascii, onRow); }
    return w;
  };

  /**
   * Number of rows of the output
   *
   * @returns {number}
   */
  Pixelart.prototype.rows = function () {
    if (this.multiple) {
      var max = 0;
      for (var i = 0; i < this.frames.length; i++) {
        if (this.frames[i].length > max) { max = this.frames[i].length; }
      }
      return max;
    }
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

    var self = this;

    // clean element
    while (this.target.firstChild) { this.target.removeChild(this.target.firstChild); }

    var canvas = this._createCanvas();
    var ctx = canvas.getContext('2d');

    this.target.appendChild(canvas);

    if (this.multiple) {
      var w = this.width();
      var h = this.height();
      for (var i = 0; i < this.frames.length; i++) {
        var delay = (this.options.speed + this.options.stagger) * i;
        setTimeout(makeDrawAscii(self, ctx, self.frames[i], i > 0, w, h), delay);
      }
      if (this.options.loop) {
        setTimeout(function () {
          self.draw.apply(self);
        }, (this.options.speed + this.options.stagger) * (this.frames.length));
      }
    } else {
      this._drawAscii(ctx, this.ascii);
    }

    return this;

  };

  Pixelart.prototype._drawAscii = function (ctx, ascii) {

    var i = 0;
    var fillStyle;

    _iterate(ascii, function (char, x, y) {
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
    }, this);

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

  function cleanOptions (opts) {
    if (!opts) { opts = {}; }
    return {
      pixelSize: opts.pixelSize || 10,
      color: opts.color ? hexToRgb(opts.color) : { r: 0, g: 0, b: 0 },
      colorMap: opts.colorMap ? buildColorMap(opts.colorMap) : null,
      stagger: opts.stagger || 0,
      speed: opts.speed || 1000,
      loop: !!opts.loop
    };
  }

  function multipleAscii (tab) {
    if (Object.prototype.toString.call(tab) !== '[object Array]') {
      throw new Error('ascii arguments needs an Array, instead got a ' + (typeof tab));
    }
    return (tab[0] && typeof tab[0] !== 'string');
  }

  /**
   * Generate the real color map with the option color map
   * (the colors will be rgb instead of hex)
   *
   * @param input
   * @returns {object}
   */
  function buildColorMap (input) {
    var colorMap = {};
    Object.keys(input).forEach(function (key) {
      colorMap[key] = hexToRgb(input[key]);
    });
    return colorMap;
  }

  /**
   * Throw if any of the given parameters is undefined
   */
  function ensureDefined () {
    Array.prototype.slice.call(arguments).forEach(function (item) {
      if (item[1] === void 0) { throw new Error('required argument ' + item[0]); }
    });
  }

  /**
   * Iterate through rows
   *
   * @param {array} ascii
   * @param {function} cb
   * @param {class} instance
   * @private
   */
  function _iterateRows (ascii, cb, instance) {
    ascii.forEach(function (row, y) {
      cb.apply(instance || this, [row, y]);
    });
  }

  /**
   * Iterate through each block
   *
   * @param {array} ascii
   * @param {function} cb
   * @param {class} instance
   * @private
   */
  function _iterate (ascii, cb, instance) {
    _iterateRows(ascii, function (row, y) {
      ascii[y].split('').forEach(function (char, x) {
        cb.apply(instance || this, [char, x, y]);
      });
    });
  }

  function makeDrawAscii (instance, ctx, ascii, clearCanvas, w, h) {
    return function () {
      if (clearCanvas) { ctx.clearRect(0, 0, w, h); }
      instance._drawAscii(ctx, ascii);
    };
  }

  return Pixelart;

});
