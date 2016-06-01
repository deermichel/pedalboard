"use strict";

(function() {

$.get("pedals/pitchshifter.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var pitchshift = new Tone.PitchShift(12);
  pitchshift.wet.value = 0.5;
  var bypassed = false;

  $(ui).find(".pitchshifterpitch").knob({
    "release": function(v) {
      pitchshift.pitch = v;
    }
  });

  $(ui).find(".pitchshiftermix").knob({
    "release": function(v) {
      if (!bypassed) pitchshift.wet.value = v/100;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      pitchshift.wet.value = 0;
    } else {
      pitchshift.wet.value = $(ui).find(".pitchshiftermix").val()/100;
    }
  });

  var getValues = function() {
    return "pitchshifter," +
      $(ui).find(".pitchshifterpitch").val() + "," +
      $(ui).find(".pitchshiftermix").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".pitchshifterpitch").val(val[1]).trigger("change");
    $(ui).find(".pitchshiftermix").val(val[2]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[3]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [pitchshift],
    type: "pitchshifter",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();
