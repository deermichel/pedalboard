"use strict";

(function() {

var tremolo = new Tone.Tremolo(2, 0.5).start();
var wet = 0.5;
tremolo.wet.value = wet;
tremolo.spread = 0;
var bypassed = false;

$(".tremolorate").knob({
  "release": function(v) {
    tremolo.frequency.value = v;
  }
});

$(".tremolodepth").knob({
  "release": function(v) {
    tremolo.depth.value = v/100;
  }
});

$(".tremolostereo").knob({
  "release": function(v) {
    tremolo.spread = (v/100) * 180;
  }
});

$(".tremololevel").knob({
  "release": function(v) {
    wet = v/100;
    if (!bypassed) tremolo.wet.value = wet;
  }
});

$(pedalUIs[pedalUIs.length - 1]).find(".bypass").click(function() {
  $(this).toggleClass("on");
  bypassed = !$(this).hasClass("on");
  if (bypassed) {
    tremolo.wet.value = 0;
  } else {
    tremolo.wet.value = wet;
  }
});

pedalFXs.push(tremolo);

})();
