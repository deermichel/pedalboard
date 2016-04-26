"use strict";

(function() {

var convolver = new Tone.Convolver();
var duration = 1;
var decay = 10;
var reverse = false;
convolver.buffer = createImpulseResponse(duration, decay, reverse);
var wet = 0.5;
convolver.wet.value = wet;
var bypassed = false;

$(".superverblength").knob({
  "release": function(v) {
    duration = v/1000;
    convolver.buffer = createImpulseResponse(duration, decay, reverse);
  }
});

$(".superverbdecay").knob({
  "release": function(v) {
    decay = duration * (v/10);
    convolver.buffer = createImpulseResponse(duration, decay, reverse);
  }
});

$(pedalUIs[pedalUIs.length - 1]).find(".superverbreverse").click(function() {
  $(this).parent().toggleClass("on");
  reverse = $(this).parent().hasClass("on");
  convolver.buffer = createImpulseResponse(duration, decay, reverse);
});

$(".superverbmix").knob({
  "release": function(v) {
    wet = v/100;
    if (!bypassed) convolver.wet.value = wet;
  }
});

$(pedalUIs[pedalUIs.length - 1]).find(".bypass").click(function() {
  $(this).toggleClass("on");
  bypassed = !$(this).hasClass("on");
  if (bypassed) {
    convolver.wet.value = 0;
  } else {
    convolver.wet.value = wet;
  }
});

pedalFXs.push(convolver);

})();

function createImpulseResponse(duration, decay, reverse) {

  var sampleRate = Tone.context.sampleRate;
  var length = sampleRate * duration;
  var impulse = Tone.context.createBuffer(2, length, sampleRate);
  var impulseL = impulse.getChannelData(0);
  var impulseR = impulse.getChannelData(1);

  for (var i = 0; i < length; i++) {
    var n = reverse ? length - i : i;
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }

  return impulse;
}
