'use strict';

var ascii_1 = [
  'ooooooooooooooooooooooooooooooooooooooo',
  'o o',
  'o  o oooo o  o oooo o  o o    oooo oooo',
  'o o     o oo o o    o  o o       o o',
  '   o oo o o oo o oo o  o o    oo o o o',
  'o o  oooo o  o oooo oooo oooo oooo o  o'
];

describe('PixelartJS', function () {

  var elem;

  beforeEach(function () {
    elem = document.createElement('div');
    document.body.appendChild(elem);
  });

  afterEach(function () {
    document.body.removeChild(elem);
    elem = undefined;
  });

  it('should create the Pixelart global', function () {
    expect(Pixelart).toBeDefined();
  });

  it('should throw if required parameters not given', function () {
    expect(function () { new Pixelart(); }).toThrow(new Error('required argument target'));
    expect(function () { new Pixelart(elem); }).toThrow(new Error('required argument ascii'));
  });

  it('should calculate the right dimensions', function () {
    var p = new Pixelart(elem, ascii_1, { pixelSize: 4 });
    expect(p.cols()).toBe(39);
    expect(p.rows()).toBe(6);
    expect(p.width()).toBe(156);
    expect(p.height()).toBe(24);
  });

  it('should create a canvas, with right dimensions', function () {

    var p = new Pixelart(elem, ascii_1);

    expect(elem.firstElementChild).not.toBeNull();
    expect(elem.firstElementChild.nodeName).toBe('CANVAS');

    expect(elem.firstElementChild.offsetWidth).toBe(p.width());
    expect(elem.firstElementChild.offsetHeight).toBe(p.height());
  });

  it('should clear target before draw', function () {
    expect(elem.childNodes.length).toBe(0);
    new Pixelart(elem, ascii_1);
    expect(elem.childNodes.length).toBe(1);
    new Pixelart(elem, ascii_1);
    expect(elem.childNodes.length).toBe(1);
  });

  it('should set custom color', function () {
    var p = new Pixelart(elem, ascii_1, { color: '#FF0000' });
    expect(p.color()).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should throw on invalid color', function () {
    expect(function () {
      new Pixelart(elem, ascii_1, { color: 'z' });
    }).toThrow(new Error('Invalid color: z'));
  });

  it('should work with a jquery selector', function () {
    var el = document.createElement('div');
    el.id = 'yolo';
    document.body.appendChild(el);
    new Pixelart($('#yolo'), ascii_1);
    expect(el.firstElementChild).not.toBeNull();
    expect(el.firstElementChild.nodeName).toBe('CANVAS');
  });

  it('should allow to pass a color map', function () {

    new Pixelart(elem, ['abc'], {
      colorMap: {
        a: '#FF0000',
        b: '#00FF00',
        c: '#0000FF'
      },
      pixelSize: 1
    });

    var canvas = elem.firstElementChild;
    var ctx = canvas.getContext('2d');

    expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 255, g:   0, b:   0, a: 255 });
    expect(getPixelColor(ctx, 1, 0)).toEqual({ r:   0, g: 255, b:   0, a: 255 });
    expect(getPixelColor(ctx, 2, 0)).toEqual({ r:   0, g:   0, b: 255, a: 255 });
  });

  it('should draw with a stagger', function (done) {

    new Pixelart(elem, [
        'oo',
        'oo'
      ], {
      stagger: 50,
      pixelSize: 1
    });

    var canvas = elem.firstElementChild;
    var ctx = canvas.getContext('2d');

    expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });

    setTimeout(function () {
      expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
      expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    }, 75);

    setTimeout(function () {
      expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    }, 125);

    setTimeout(function () {
      expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    }, 175);

    setTimeout(done, 200);

  });

  it('should stagger without breaking color map', function (done) {

    new Pixelart(elem, [
        'oa',
        'bc'
      ], {
      colorMap: {
        a: '#FF0000',
        b: '#00FF00',
        c: '#0000FF'
      },
      stagger: 50,
      pixelSize: 1
    });

    var canvas = elem.firstElementChild;
    var ctx = canvas.getContext('2d');

    expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });

    setTimeout(function () {
      expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
      expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    }, 75);

    setTimeout(function () {
      expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 255, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    }, 125);

    setTimeout(function () {
      expect(getPixelColor(ctx, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 });
      expect(getPixelColor(ctx, 0, 1)).toEqual({ r: 0, g: 255, b: 0, a: 255 });
      expect(getPixelColor(ctx, 1, 1)).toEqual({ r: 0, g: 0, b: 255, a: 255 });
    }, 175);

    setTimeout(done, 200);

  });

  it('should delete canvas on calling destroy', function () {

    expect(elem.firstElementChild).toBeNull();
    var p = new Pixelart(elem, ascii_1);
    expect(elem.firstElementChild).not.toBeNull();
    p.destroy();
    expect(elem.firstElementChild).toBeNull();

  });

});

// utils

function getPixelColor (ctx, x, y) {
  var data = ctx.getImageData(x, y, 1, 1).data;
  return {
    r: data[0],
    g: data[1],
    b: data[2],
    a: data[3]
  };
}
