/**
 * Created by sli on 10/18/13.
 */
// create the audio context (chrome only for now)
var context = new webkitAudioContext();
var audioBuffer;
var sourceNode;

// load the sound
setupAudioNodes();
loadSound("doom.ogg");

function setupAudioNodes() {
    // create a buffer source node
    sourceNode = context.createBufferSource();
    // and connect to destination
    sourceNode.connect(context.destination);
}

// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);
    }
    request.send();
}


function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.noteOn(0);
}

// log if an error occurs
function onError(e) {
    console.log(e);
}

// setup a javascript node
javascriptNode = context.createJavaScriptNode(2048, 1, 1);