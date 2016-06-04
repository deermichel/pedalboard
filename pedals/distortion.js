"use strict";

(function() {

$.get("pedals/distortion.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var waveshaper = Tone.context.createWaveShaper();
  var gain = new Tone.Volume(-10);
  var boost = new Tone.Filter(1400, "peaking");
  waveshaper.oversample = "none";
  waveshaper.curve = makeDistortionCurve(0.2);
  boost.gain.value = 6;
  var bypassed = false;

  $(ui).find(".distortiontone").knob({
    "release": function(v) {
      boost.frequency.value = v;
    }
  });

  $(ui).find(".distortiondrive").knob({
    "release": function(v) {
      if (!bypassed) waveshaper.curve = makeDistortionCurve(v/100);
    }
  });

  $(ui).find(".distortionlevel").knob({
    "release": function(v) {
      if (!bypassed) gain.volume.value = v;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      waveshaper.curve = undefined;
      gain.volume.value = 0;
      boost.gain.value = 0;
    } else {
      waveshaper.curve = makeDistortionCurve($(ui).find(".distortiondrive").val()/100);
      gain.volume.value = $(ui).find(".distortionlevel").val();
      boost.gain.value = 6;
    }
  });

  var getValues = function() {
    return "distortion," +
      $(ui).find(".distortiontone").val() + "," +
      $(ui).find(".distortiondrive").val() + "," +
      $(ui).find(".distortionlevel").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".distortiontone").val(val[1]).trigger("change");
    $(ui).find(".distortiondrive").val(val[2]).trigger("change");
    $(ui).find(".distortionlevel").val(val[3]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[4]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [boost, waveshaper, gain],
    type: "distortion",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();

function makeDistortionCurve(amount) {

  var sampleRate = Tone.context.sampleRate;
  var curve = new Float32Array(sampleRate);

  // algos borrowed from https://github.com/Theodeus/tuna/blob/master/tuna.js#L1224

  // var k = 2 * amount / (1 - amount);
  // for (var i = 0; i < sampleRate; i++) {
  //   var x = i * 2 / sampleRate - 1;
  //   curve[i] = (1 + k) * x / (1 + k * Math.abs(x));
  // }

  var a = 1 - amount;
  for (var i = 0; i < sampleRate; i++) {
    var x = i * 2 / sampleRate - 1;
    var y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a);
    curve[i] = Math.tanh(y * 2);
  }

  return curve;
}
