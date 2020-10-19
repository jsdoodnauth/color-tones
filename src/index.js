import _ from 'lodash';
import './style.css';
import ColorThief from 'colorthief';
import Vibrant from 'node-vibrant/dist/vibrant';
import image from './3.jpg';
import iro from '@jaames/iro';

function init() {
  const element = document.createElement('div');
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // element.classList.add('hello');
  const sourceImg = document.getElementById('sourceImg');
  sourceImg.src = image;
  processImageWithColorThief();
  processImageWithVibrant();

  return element;
}

function configureColorWheel(picker, colorArray) {
  console.log(colorArray.toString());
  var colorPicker = new iro.ColorPicker(picker, {
    width: 320,
    layout: [
      { 
        component: iro.ui.Wheel,
        options: {
          borderColor: '#000000'
        }
      }
    ]
  });
  // colorPicker.removeColor(0);
  colorArray.forEach(color => {
    console.log(color);
    colorPicker.addColor(color);    
  });

  colorPicker.removeColor(0);
  colorPicker.colors.forEach(function (color) {
    console.log(color.hexString);
  });
}

function processImageWithColorThief() {
  const sourceImg = document.getElementById('sourceImg');
  var colorThief = new ColorThief();

  if (sourceImg.complete) {
    colorThief.getColor(sourceImg);
  } else {
    sourceImg.addEventListener('load', function() {
      var hexColor = colorThief.getColor(sourceImg);
      document.getElementById('domanantCT').style.backgroundColor = 'rgb(' + hexColor[0] + ',' + hexColor[1] + ',' + hexColor[2] + ')';

      var hexColorPaletteArray = colorThief.getPalette(sourceImg, 6);      
      var hexColorPalette = hexColorPaletteArray[0];
      var colorPaletteStr = [];
      document.getElementById('CT1').style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
      colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');
      
      var hexColorPalette = hexColorPaletteArray[1];
      document.getElementById('CT2').style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
      colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');
      
      var hexColorPalette = hexColorPaletteArray[2];
      document.getElementById('CT3').style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
      colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');
      
      var hexColorPalette = hexColorPaletteArray[3];
      document.getElementById('CT4').style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
      colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');
      
      var hexColorPalette = hexColorPaletteArray[4];
      document.getElementById('CT5').style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
      colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');
      
      var hexColorPalette = hexColorPaletteArray[5];
      document.getElementById('CT6').style.backgroundColor = 'rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')';
      colorPaletteStr.push('rgb(' + hexColorPalette[0] + ',' + hexColorPalette[1] + ',' + hexColorPalette[2] + ')');
      configureColorWheel('#pickerCT', colorPaletteStr);
    });
  }
}

function processImageWithVibrant() {
  
  const sourceImg = document.getElementById('sourceImg');

  sourceImg.addEventListener('load', function() {
    var sourceImgSrc = document.getElementById('sourceImg').src;
    
    var v = Vibrant.from(sourceImg.src);
    v.getPalette((err, palette) => {
      var colorPalette = palette['DarkVibrant'];
      var colorPaletteStr = [];
      if (colorPalette) {
        document.getElementById('dVibrant').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
        colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
      }

      colorPalette = palette['Vibrant'];
      if (colorPalette) {
        document.getElementById('vibrant').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
        colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
      }

      colorPalette = palette['LightVibrant'];
      if (colorPalette) {
        document.getElementById('lVibrant').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
        colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
      }

      colorPalette = palette['DarkMuted'];
      if (colorPalette) {
        document.getElementById('dMuted').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
        colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
      }

      colorPalette = palette['Muted'];
      if (colorPalette) {
        document.getElementById('muted').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
        colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
      }

      colorPalette = palette['LightMuted'];
      if (colorPalette) {
        document.getElementById('lMuted').style.backgroundColor = 'rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')';
        colorPaletteStr.push('rgb(' + colorPalette._rgb[0] + ',' + colorPalette._rgb[1] + ',' + colorPalette._rgb[2] + ')');
      }
      configureColorWheel('#pickerVibrant', colorPaletteStr);
    });
  });
}


document.body.appendChild(init());