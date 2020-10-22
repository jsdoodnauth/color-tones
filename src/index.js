import _ from 'lodash';
import './style.css';
import ColorThief from 'colorthief';
import Vibrant from 'node-vibrant/dist/vibrant';
import image from './4.jpg';
import iro from '@jaames/iro';

var pickerCT = initColorWheel('#pickerCT');
var pickerVibrant = initColorWheel('#pickerVibrant');

function init() {
  const sourceImgCT = document.getElementById('sourceImgCT');
  const sourceImgVibrant = document.getElementById('sourceImgVibrant');
  sourceImgCT.src = image;
  sourceImgVibrant.src = image;
  processImageWithColorThief(sourceImgCT);
  processImageWithVibrant(sourceImgVibrant);
}

function initColorWheel(picker) {
  var colorPicker = new iro.ColorPicker(picker, {
    width: 320,
    layout: [
      { 
        component: iro.ui.Wheel,
        options: {
          borderColor: '#FFFFFF'
        }
      },
      { 
        component: iro.ui.Slider,
        options: {
          sliderType: 'hue'
        }
      },
      { 
        component: iro.ui.Slider,
        options: {
          sliderType: 'saturation'
        }
      },
      { 
        component: iro.ui.Slider,
        options: {
          sliderType: 'value'
        }
      },
      { 
        component: iro.ui.Slider,
        options: {
          sliderType: 'kelvin'
        }
      }
    ]
  });
  return colorPicker;
}

function updateColorWheel(picker, colorArray) {
  picker.setColors(colorArray);
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
      updateColorWheel(pickerCT, colorPaletteStr);
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
      updateColorWheel(pickerVibrant, colorPaletteStr);
    });
  });
}

/****************************************************************************************/
const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
};

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');
  streamStarted = true;
};

cameraOptions.onchange = () => {
  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value
    }
  };
  startStream(updatedConstraints);
};

const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

/***************************************************************************************************************/

var videoWidth = 320;
var videoHeight = 0;

var defaultScan = 0;

var streaming = false;

var videoObj = null;
var canvasObj = null;
var photo = null;
const videoConstraints = {
  facingMode: 'environment',  
};


function videoInit() {
  videoObj = document.getElementById('video');
  canvasObj = document.getElementById('canvas');
  photo = document.getElementById('photo');

  navigator.permissions.query({name: 'camera'})
  .then((permissionObj) => {
   console.log(permissionObj.state);
  })
  .catch((error) => {
   console.log('Got error :', error);
  })
  
  navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then((stream) => {
    videoObj.srcObject = stream;
    videoObj.play();
  }).catch((err) => {
    console.log("An error occurred: " + err);
  });

  videoObj.addEventListener('canplay', (evt) => {
    if (!streaming) {
      videoHeight = videoObj.videoHeight / (videoObj.videoWidth/videoWidth);

      videoObj.setAttribute('width', videoWidth);
      videoObj.setAttribute('height', videoHeight);
      canvasObj.setAttribute('width', videoWidth);
      canvasObj.setAttribute('height', videoHeight);
      streaming = true;
    }
  }, false);

  setInterval(() => {
    takePicture();
  }, 50);

  clearPhoto();
}

function clearPhoto() {
  var context = canvasObj.getContext('2d');
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvasObj.width, canvasObj.height);

  var data = canvasObj.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takePicture() {
  var context = canvasObj.getContext('2d');
  if (videoWidth && videoHeight) {
    canvasObj.width = videoWidth;
    canvasObj.height = videoHeight;
    context.drawImage(videoObj, 0, 0, videoWidth, videoHeight);

    var data = canvasObj.toDataURL('image/png');
    photo.setAttribute('src', data);
    if (defaultScan == 0) {
      processImageWithVibrant(photo);
    } else if (defaultScan == 1) {
      processImageWithColorThief(photo);
    }
  } else {
    clearPhoto();
  }
}


const doScreenshotObj = () => {
  canvasObj.width = videoObj.videoWidth;
  canvasObj.height = videoObj.videoHeight;
  canvasObj.getContext('2d').drawImage(videoObj, 0, 0);
  screenshotImage.src = canvasObj.toDataURL('image/png');
  screenshotImage.classList.remove('d-none');
};

screenshot.onclick = doScreenshotObj;


const scanTypeRadio1 = document.querySelector('#scanType1');
const scanTypeRadio2 = document.querySelector('#scanType2');
scanTypeRadio1.addEventListener("change", updateScanType);
scanTypeRadio2.addEventListener("change", updateScanType);


hide(document.querySelectorAll('.ct-output'));
show(document.querySelectorAll('.vibrant-output'));
function updateScanType() {
  console.log(this.value);
  defaultScan = this.value;
  
  if (defaultScan == 0) {
    processImageWithVibrant(photo);
    show(document.querySelectorAll('.vibrant-output'));
    hide(document.querySelectorAll('.ct-output'));
  } else if (defaultScan == 1) {
    processImageWithColorThief(photo);
    hide(document.querySelectorAll('.vibrant-output'));
    show(document.querySelectorAll('.ct-output'));
  }
  
}

function hide(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].style.display = 'none';    
  }
}


function show(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].style.display = 'inline-block';    
  }
}

// document.body.addEventListener('load', init());
document.body.addEventListener('load', videoInit());
// document.body.addEventListener('load', getCameraSelection());
