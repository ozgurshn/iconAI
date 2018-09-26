// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const SIZE = 256;
let inputImg, inputCanvas, outputContainer, statusMsg, transferBtn, clearBtn, appIcon;

function imageClick(el){
  //alert(el.src);
    inputImg = loadImage(el.src, drawImage);
  }
function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box').parent('canvasContainer');

  // Display initial input image
  inputImg = loadImage('images/input.png', drawImage);

  // Selcect output div container
  outputContainer = select('#output');

  appIcon = select('#icon');
  statusMsg = select('#status');
  
  // Select 'transfer' button html element
  transferBtn = select('#transferBtn');

  // Select 'clear' button html element
  clearBtn = select('#clearBtn');
  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function() {
    clearCanvas();
  });

  // Set stroke to black
  stroke(0);
  pixelDensity(1);
}

// Draw on the canvas when mouse is pressed
function draw() {
  if (mouseIsPressed) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

// Draw the input image to the canvas
function drawImage() {
  image(inputImg, 0, 0);

  // After input image is loaded, initialize a pix2pix method with a pre-trained model
  ml5.pix2pix('models/checked4.bin')
    .then(model => {
      // Show 'Model Loaded!' message
      statusMsg.html('Model Loaded!');

      // Call transfer function after the model is loaded
      transfer(model);

      // Attach a mousePressed event to the button
      transferBtn.mousePressed(function() {
        transfer(model);
      });
    })
}

// Clear the canvas
function clearCanvas() {
  background(255);
}

function transfer(pix2pix) {
  // Update status message
  statusMsg.html('Applying Style Transfer...!');

  // Select canvas DOM element
  const canvasElement = select('canvas').elt;

  // Apply pix2pix transformation
  pix2pix.transfer(canvasElement)
    .then(result => {
      // Clear output container
      outputContainer.html('');
      appIcon.html('');
      // Create an image based result
      createImg(result.src).class('border-box').parent('output');

      createImg(result.src).class('sample').parent('icon');
      
      // Show 'Done!' message
      statusMsg.html('Done!');
    });
}
