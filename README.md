<p align="center">
  <img src="logo.png">
</p>

<p align="center">
  <a href="https://travis-ci.org/meriadec/PixelartJS"><img src="https://travis-ci.org/meriadec/PixelartJS.svg?branch=master" /></a>
  <a href="https://codeclimate.com/github/meriadec/PixelartJS"><img src="https://codeclimate.com/github/meriadec/PixelartJS/badges/gpa.svg" /></a>
  <a href='https://coveralls.io/r/meriadec/PixelartJS?branch=master'><img src='https://coveralls.io/repos/meriadec/PixelartJS/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

## WTF is that?

PixelartJS is a small tool which allows you to generate canvas images from characters.
It's purpose is to be customizable as well, for the moment you change parameters like color, set a color map (by character), and specify the size of the pixels in the generated image.

I'm open to any suggestions, feel free to ask / pull request !

## Install

bower registration coming soon !

## Usage

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

new Pixelart(target, ascii).draw();
```

## License

BSD
