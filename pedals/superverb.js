"use strict";

(function() {

$.get("pedals/superverb.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var convolver = new Tone.Convolver();
  var duration = 1;
  var decay = 10;
  var reverse = false;
  convolver.buffer = createImpulseResponse(duration, decay, reverse);
  var wet = 0.5;
  convolver.wet.value = wet;
  var bypassed = false;

  $(ui).find(".superverblength").knob({
    "release": function(v) {
      duration = v/1000;
      convolver.buffer = createImpulseResponse(duration, decay, reverse);
    }
  });

  $(ui).find(".superverbdecay").knob({
    "release": function(v) {
      decay = duration * (v/10);
      convolver.buffer = createImpulseResponse(duration, decay, reverse);
    }
  });

  $(ui).find(".superverbreverse").click(function() {
    $(this).parent().toggleClass("on");
    reverse = $(this).parent().hasClass("on");
    convolver.buffer = createImpulseResponse(duration, decay, reverse);
  });

  $(ui).find(".superverbmix").knob({
    "release": function(v) {
      wet = v/100;
      if (!bypassed) convolver.wet.value = wet;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      convolver.wet.value = 0;
    } else {
      convolver.wet.value = wet;
    }
  });

  var getValues = function() {
    return "superverb," +
      $(ui).find(".superverblength").val() + "," +
      $(ui).find(".superverbdecay").val() + "," +
      (+reverse) + "," +
      $(ui).find(".superverbmix").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".superverblength").val(val[1]).trigger("change");
    $(ui).find(".superverbdecay").val(val[2]).trigger("change");
    if ($(ui).find(".superverbreverse").parent().hasClass("on") != val[3]) {
      $(ui).find(".superverbreverse").click();
    }
    $(ui).find(".superverbmix").val(val[4]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[5]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [convolver],
    type: "superverb",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

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
