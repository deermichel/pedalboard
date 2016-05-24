"use strict";

(function() {

// load html and add it (configure pedal)
$.get("pedals/reverb.html", function(data) {

  // store UI
  var ui = $(data).appendTo($("#pedalboard"));

  // setup effect
  var reverb = new Tone.Freeverb(0.5, 8000);
  var wet = 0.5;
  reverb.wet.value = wet;
  var bypassed = false;

  // setup knobs
  $(ui).find(".reverbroom").knob({
    "release": function(v) {
      reverb.roomSize.value = v/100;
    }
  });

  $(ui).find(".reverbtone").knob({
    "release": function(v) {
      reverb.dampening.value = v;
    }
  });

  $(ui).find(".reverbmix").knob({
    "release": function(v) {
      wet = v/100;
      if (!bypassed) reverb.wet.value = wet;
    }
  });

  // setup buttons
  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      reverb.wet.value = 0;
    } else {
      reverb.wet.value = wet;
    }
  });

  // get important values (for sharing)
  var getValues = function() {
    return "reverb," +
      $(ui).find(".reverbroom").val() + "," +
      $(ui).find(".reverbtone").val() + "," +
      $(ui).find(".reverbmix").val() + "," +
      (+bypassed);
  };

  // set values
  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".reverbroom").val(val[1]).trigger("change");
    $(ui).find(".reverbtone").val(val[2]).trigger("change");
    $(ui).find(".reverbmix").val(val[3]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[4]) {
      $(ui).find(".bypass").click();
    }
  }

  // add to global array
  pedals.push({
    nodes: [reverb],
    type: "reverb",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  // rewire audio nodes
  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());   // important for preloading
});

})();
