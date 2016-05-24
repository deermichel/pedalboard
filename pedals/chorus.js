"use strict";

(function() {

$.get("pedals/chorus.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var chorus = new Tone.Chorus(2, 3.5, 0.5);
  var wet = 0.5;
  chorus.wet.value = wet;
  chorus.spread = 0;
  var bypassed = false;

  $(ui).find(".chorusspeed").knob({
    "release": function(v) {
      chorus.frequency.value = v;
    }
  });

  $(ui).find(".chorusdepth").knob({
    "release": function(v) {
      chorus.depth = v/100;
    }
  });

  $(ui).find(".chorusstereo").knob({
    "release": function(v) {
      chorus.spread = (v/100) * 180;
    }
  });

  $(ui).find(".choruslevel").knob({
    "release": function(v) {
      wet = v/100;
      if (!bypassed) chorus.wet.value = wet;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      chorus.wet.value = 0;
    } else {
      chorus.wet.value = wet;
    }
  });

  var getValues = function() {
    return "chorus," +
      $(ui).find(".chorusspeed").val() + "," +
      $(ui).find(".chorusdepth").val() + "," +
      $(ui).find(".chorusstereo").val() + "," +
      $(ui).find(".choruslevel").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".chorusspeed").val(val[1]).trigger("change");
    $(ui).find(".chorusdepth").val(val[2]).trigger("change");
    $(ui).find(".chorusstereo").val(val[3]).trigger("change");
    $(ui).find(".choruslevel").val(val[4]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[5]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [chorus],
    type: "chorus",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();
