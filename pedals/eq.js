"use strict";

(function() {

$.get("pedals/eq.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var gain = new Tone.Volume(0);
  var eq = new Tone.EQ3(0, 0, 0);
  var bypassed = false;

  $(ui).find(".eqgain").knob({
    "release": function(v) {
      if (!bypassed) gain.volume.value = v;
    }
  });

  $(ui).find(".eqlow").knob({
    "release": function(v) {
      if (!bypassed) eq.low.value = v;
    }
  });

  $(ui).find(".eqmid").knob({
    "release": function(v) {
      if (!bypassed) eq.mid.value = v;
    }
  });

  $(ui).find(".eqhigh").knob({
    "release": function(v) {
      if (!bypassed) eq.high.value = v;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      gain.volume.value = 0;
      eq.low.value = 0;
      eq.mid.value = 0;
      eq.high.value = 0;
    } else {
      gain.volume.value = $(ui).find(".eqgain").val();
      eq.low.value = $(ui).find(".eqlow").val();
      eq.mid.value = $(ui).find(".eqmid").val();
      eq.high.value = $(ui).find(".eqhigh").val();
    }
  });

  var getValues = function() {
    return "eq," +
      $(ui).find(".eqgain").val() + "," +
      $(ui).find(".eqlow").val() + "," +
      $(ui).find(".eqmid").val() + "," +
      $(ui).find(".eqhigh").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".eqgain").val(val[1]).trigger("change");
    $(ui).find(".eqlow").val(val[2]).trigger("change");
    $(ui).find(".eqmid").val(val[3]).trigger("change");
    $(ui).find(".eqhigh").val(val[4]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[5]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [gain, eq],
    type: "eq",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();
