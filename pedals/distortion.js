"use strict";

(function() {

var distortion = Tone.context.createWaveShaper();
distortion.curve = makeDistortionCurve(0.5);
distortion.oversample = "none";

$(".distortiondrive").knob({
  "release": function(v) {
    distortion.curve = makeDistortionCurve(v/100);
  }
});

pedalFXs.push(distortion);

})();

function makeDistortionCurve(amount) {

  var sampleRate = Tone.context.sampleRate;
  var k = amount * 100;
  var deg = Math.PI / 180;
  var curve = new Float32Array(sampleRate);

  for (var i = 0; i < sampleRate; i++) {
    var x = i * 2 / sampleRate - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }

  return curve;
}
