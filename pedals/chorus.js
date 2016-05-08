"use strict";

(function() {

var chorus = new Tone.Chorus(2, 3.5, 0.5);
var wet = 0.5;
chorus.wet.value = wet;
chorus.spread = 0;
var bypassed = false;

$(".chorusspeed").knob({
  "release": function(v) {
    chorus.frequency.value = v;
  }
});

$(".chorusdepth").knob({
  "release": function(v) {
    chorus.depth = v/100;
  }
});

$(".chorusstereo").knob({
  "release": function(v) {
    chorus.spread = (v/100) * 180;
  }
});

$(".choruslevel").knob({
  "release": function(v) {
    wet = v/100;
    if (!bypassed) chorus.wet.value = wet;
  }
});

$(pedalUIs[pedalUIs.length - 1]).find(".bypass").click(function() {
  $(this).toggleClass("on");
  bypassed = !$(this).hasClass("on");
  if (bypassed) {
    chorus.wet.value = 0;
  } else {
    chorus.wet.value = wet;
  }
});

pedalFXs.push(chorus);

})();
