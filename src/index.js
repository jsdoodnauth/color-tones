import _ from 'lodash';
import './style.css';
import ColorThief from 'colorthief';
import Vibrant from 'node-vibrant/dist/vibrant';
import image from './4.jpg';
import iro from '@jaames/iro';

function init() {
  const sourceImgCT = document.getElementById('sourceImgCT');
  const sourceImgVibrant = document.getElementById('sourceImgVibrant');
  sourceImgCT.src = image;
  sourceImgVibrant.src = image;
  processImageWithColorThief(sourceImgCT);
  processImageWithVibrant(sourceImgVibrant);
}

function configureColorWheel(picker, colorArray) {
  var colorPicker = new iro.ColorPicker(picker, {
    width: 320,
    layout: [
      { 
        component: iro.ui.Wheel,
        options: {
          borderColor: '#FFFFFF'
        }
      }
    ]
  });

  colorArray.forEach(color => {
    colorPicker.addColor(color);    
  });

  colorPicker.removeColor(0);
}

function processImageWithColorThief(sourceImg) {
  var colorThief = new ColorThief();

  if (sourceImg.complete) {
    colorThief.getColor(sourceImg);
  } else {
    sourceImg.addEventListener('load', function() {
      var hexColor = colorThief.getColor(sourceImg);
      var colorCount = 6
      document.getElementById('domanantCT').style.backgroundColor = 'rgb(' + hexColor[0] + ',' + hexColor[1] + ',' + hexColor[2] + ')';
      var hexColorPaletteArray = colorThief.getPalette(sourceImg, colorCount);
      var colorPaletteStr = [];

      for (let i = 0; i < colorCount; i++) {
        var hexColorPalette = hexColorPaletteArray[i];
        document.getElementById('CT' + (i + 1)).style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
        colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');          
      }
      configureColorWheel('#pickerCT', colorPaletteStr);
    });
  }
}

function processImageWithVibrant(sourceImg) {
  sourceImg.addEventListener('load', function() {
    var sourceImgSrc = sourceImg.src;
    var paletteNames = ['DarkVibrant', 'Vibrant', 'LightVibrant', 'DarkMuted', 'Muted', 'LightMuted' ]
    
    var v = Vibrant.from(sourceImg.src);
    v.getPalette((err, palette) => {
      var colorPaletteStr = [];

      paletteNames.forEach(item => {
        var colorPalette = palette[item];
        if (colorPalette) {
          document.getElementById(item + 'Item').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
          colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
        }
      });
      configureColorWheel('#pickerVibrant', colorPaletteStr);
    });
  });
}

document.body.addEventListener('load', init());