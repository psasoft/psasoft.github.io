// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
var track = null;
var inputCtx

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
            cameraSensor.width = cameraView.videoWidth;
            cameraSensor.height = cameraView.videoHeight;
            inputCtx = cameraSensor.getContext("2d")
            drawToCanvas()
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

function drawToCanvas() {
    // draw the current frame of localVideo onto the canvas,
    // starting at 0, 0 (top-left corner) and covering its full
    // width and heigth
    //inputCtx.drawImage(cameraView, 0, 0);

    // get pixel data from input canvas
    var pixelData = cameraView.getImageData( 0, 0, cameraSensor.width, cameraSensor.height );

    var avg, i;

    // simple greyscale transformation
    for( i = 0; i < pixelData.data.length; i += 4 ) {
        avg = ( pixelData.data[ i ] + pixelData.data[ i + 1 ] + pixelData.data[ i + 2 ] ) / 3;
        pixelData.data[ i ] = avg;
        pixelData.data[ i + 1 ] = avg;
        pixelData.data[ i + 2 ] = avg;
    }

    inputCtx.putImageData( pixelData, 0, 0 );

    //repeat this every time a new frame becomes available using
    //the browser's build-in requestAnimationFrame method
    requestAnimationFrame(drawToCanvas)
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    // track.stop();
};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
