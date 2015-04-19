<p align="center">
  <img src="logo.png">
</p>

<p align="center">
  <a href="https://travis-ci.org/meriadec/PixelartJS"><img src="https://travis-ci.org/meriadec/PixelartJS.svg?branch=master" /></a>
  <a href="https://codeclimate.com/github/meriadec/PixelartJS"><img src="https://codeclimate.com/github/meriadec/PixelartJS/badges/gpa.svg" /></a>
  <a href='https://coveralls.io/r/meriadec/PixelartJS?branch=master'><img src='https://coveralls.io/repos/meriadec/PixelartJS/badge.svg?branch=master' alt='Coverage Status' /></a>
  <a href="http://js.org"><img src="https://img.shields.io/badge/js.org-pixelart-ffb400.svg?style=flat" alt="JS.ORG"></a>
</p>

<p align="center">
  <img src="demo/invader.png">
</p>

## WTF is that?

PixelartJS is a small tool which allows you to generate canvas images from characters.
It's purpose is to be customizable as well, for the moment you change parameters like color, set a color map (by character), and specify the size of the pixels in the generated image.

I'm open to any suggestions, feel free to ask / pull request !

[**DEMO**](http://pixelart.js.org/)

## Install

```
bower install pixelart --save
```

Add dependency:

```html
<script src="bower_components/pixelart/dist/pixelart.min.js"></script>
```

## Usage

**Basic**

```html
<div id="myImage"></div>
```

```javascript
var target = document.getElementById('myImage');
var ascii  = [
  'oooo o  o',
  'o  o o o',
  'o  o o o',
  'oooo o  o'
];

new Pixelart(target, ascii, {
  // options here (optional)
});
```
**Pass an array of ascii for cool animated sprites :)**

```js
// ultra basic pixelart loader
new Pixelart(
  target,
  [
    ['o'],
    [' o'],
    ['  o']
  ],
  { speed: 200, loop: true }
);
```

## Options

### pixelSize

Type: `Number`

*Size in pixels of each square.*

```js
new Pixelart(target, ascii, { pixelSize: 2 });
```

### color

Type: `String (hex color)`

*Default color for all non-blank characters.*

```js
new Pixelart(target, ascii, { color: '#FF0000' });
```

### colorMap

Type: `Object`

*Specify color for specific characters.*

```js
new Pixelart(
  target,
  ascii,
  {
    colorMap: {
      a: '#FF0000',
      b: '#00FF00',
      c: '#0000FF'
    }
  }
});
```

### stagger

Type: `Number (of milliseconds)`

*"Animate" drawing by putting delay between each block draw.*

```js
new Pixelart(
  target,
  ascii,
  {
    stagger: 50
  }
});
```

### speed

Type: `Number (of milliseconds)`

*Delay between each frame, when passing an array of sprites. (default 1000ms)*

```js
new Pixelart(
  target,
  [
    [
      'o',
      ' o',
      'o',
    ],
    [
      '  o',
      '   o',
      '  o',
    ],
  ],
  {
    speed: 50
  }
});
```

## License

BSD
