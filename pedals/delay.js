"use strict";

(function() {

var delay = new Tone.FeedbackDelay(0.2, 0.5);
var wet = 0.5;
delay.wet.value = wet;
var bypassed = false;

$(".delaytime").knob({
  "release": function(v) {
    delay.delayTime.value = v/1000;
  }
});

$(".delayfeedback").knob({
  "release": function(v) {
    delay.feedback.value = v/100;
  }
});

$(".delaymix").knob({
  "release": function(v) {
    wet = v/100;
    if (!bypassed) delay.wet.value = wet;
  }
});

$(pedalUIs[pedalUIs.length - 1]).find(".bypass").click(function() {
  $(this).toggleClass("on");
  bypassed = !$(this).hasClass("on");
  if (bypassed) {
    delay.wet.value = 0;
  } else {
    delay.wet.value = wet;
  }
});

pedalFXs.push(delay);

})();
