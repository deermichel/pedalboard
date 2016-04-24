"use strict";

(function() {

var reverb = new Tone.Freeverb(0.5, 8000);
var wet = 0.5;
reverb.wet.value = wet;
var bypassed = false;

$(".reverbroom").knob({
  "release": function(v) {
    reverb.roomSize.value = v/100;
  }
});

$(".reverbtone").knob({
  "release": function(v) {
    reverb.dampening.value = v;
  }
});

$(".reverbmix").knob({
  "release": function(v) {
    wet = v/100;
    if (!bypassed) reverb.wet.value = wet;
  }
});

$(pedalUIs[pedalUIs.length - 1]).find(".bypass").click(function() {
  $(this).toggleClass("on");
  bypassed = !$(this).hasClass("on");
  if (bypassed) {
    reverb.wet.value = 0;
  } else {
    reverb.wet.value = wet;
  }
});

pedalFXs.push(reverb);

})();
