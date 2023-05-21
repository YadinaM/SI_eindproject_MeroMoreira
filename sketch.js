console.log("sketch");

let video;
let button;

let poseNet;
let pose;
let skeleton;

let applyFilter = 'none';
let filterButtons = [];
let filterImages = {};

let capturedImage = null;
let saveButton;
let cancelButton;

let capturing = true;

function preload() {
  filterImages = {
    stars: loadImage('crown.svg'),
    hat: loadImage('muts.png'),
    mustache: loadImage('snor.png')
  };
}

function setup() {
  let canvas = createCanvas(400, 300);
  background(51);

  createButtons();

  video = createCapture(VIDEO);
  video.size(400, 300);

  button = createButton('snap this!');
  button.mousePressed(takesnap);

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  saveButton = createButton('Save');
  saveButton.mousePressed(saveImage);
  saveButton.hide();

  cancelButton = createButton('Cancel');
  cancelButton.mousePressed(cancelSave);
  cancelButton.hide();

  buttonsContainer = createDiv();
  buttonsContainer.style('display', 'flex');
  buttonsContainer.style('justify-content', 'center');
  buttonsContainer.style('margin-top', '10px');
  buttonsContainer.style('margin-bottom', '10px');

  saveButton.style('margin-right', '10px');
  cancelButton.style('margin-left', '10px');

  buttonsContainer.child(saveButton);
  buttonsContainer.child(cancelButton);
}

function takesnap() {
  capturedImage = get();
  image(capturedImage, 0, 0);
  saveButton.show();
  cancelButton.show();
}

function saveImage() {
  save(capturedImage, 'myCanvas', 'jpg');
  saveButton.hide();
  cancelButton.hide();
  capturing = true;
  capturedImage = null;
}

function cancelSave() {
  saveButton.hide();
  cancelButton.hide();
  capturing = true;
  capturedImage = null;
}

function createButtons() {
    let filters = ['stars','hat', 'mustache', 'none'];
    let colors = ['#653fe1', '#653fe1', '#653fe1', '#653fe1'];
    let buttonNames = ['Linde','Joris', 'Robby', 'No filter'];
  
    let buttonContainer = createDiv();
    buttonContainer.style('display', 'flex');
    buttonContainer.style('justify-content', 'center');
    buttonContainer.style('margin-top', '10px');
    buttonContainer.style('margin-bottom', '10px');
  
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      let button = createButton(buttonNames[i]);
      button.mousePressed(() => applyFilter = filter);
      button.style('background-color', colors[i]);
  
      buttonContainer.child(button);
      filterButtons.push(button);
    }
  }
  

function gotPoses(poses) {
  image(video, 0, 0);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("ready");
}

function draw() {
  if (capturedImage == null) {
    image(video, 0, 0);
    if (pose) {
      textSize(20);
      textAlign(RIGHT, BOTTOM);
      fill(255);
      text("We are XD", width - 10, height - 10);

      let noseX = pose.nose.x;
      let noseY = pose.nose.y;

      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

      let hatWidth = d * 2.5;
      let hatHeight = hatWidth * (filterImages.hat.height / filterImages.hat.width);
      let hatX = noseX - hatWidth / 2;
      let hatY = noseY - hatHeight * 1.5;

      let musWidth = d * 1.5;
      let musHeight = musWidth * (filterImages.mustache.height / filterImages.mustache.width);
      let musX = noseX - musWidth / 2;
      let musY = noseY - musHeight * 0.1;

      let crownWidth = d * 2.5;
      let crownHeight = crownWidth * (filterImages.stars.height / filterImages.stars.width);
      let crownX = noseX - crownWidth / 2;
      let crownY = noseY - crownHeight * 1.8;

      switch (applyFilter) {
        case 'stars':
          image(filterImages.stars, crownX, crownY, crownWidth, crownHeight);
          fill(215, 247, 129);
          noStroke();
          drawStar(eyeL.x, eyeL.y, d / 3);
          drawStar(eyeR.x, eyeR.y, d / 3);
          break;

        case 'hat':
          image(filterImages.hat, hatX, hatY, hatWidth, hatHeight);
          break;

        case 'mustache':
          image(filterImages.mustache, musX, musY, musWidth, musHeight);
          break;

        case 'none':
          image(video, 0, 0);
          textSize(20);
          textAlign(RIGHT, BOTTOM);
          fill(255);
          text("We are XD", width - 10, height - 10);
          break;
      }
    } else {
      image(video, 0, 0);
      textSize(20);
      textAlign(RIGHT, BOTTOM);
      fill(255);
      text("We are XD", width - 10, height - 10);
    }
  } else {
    image(capturedImage, 0, 0);
  }
}

function drawStar(x, y, size) {
  let angle = TWO_PI / 5;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    let sx = x + cos(a) * size;
    let sy = y + sin(a) * size;
    vertex(sx, sy);
    let px = x + cos(a + angle / 2) * (size / 2);
    let py = y + sin(a + angle / 2) * (size / 2);
    vertex(px, py);
  }
  endShape(CLOSE);
}
