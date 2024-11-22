import React from "react";

function VanillaMonitor() {
  const data = [
    { x: 1, y: 90 },
    { x: 2, y: 12 },
    { x: 3, y: 34 },
    { x: 4, y: 53 },
    { x: 5, y: 98 },
  ];
  var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50,
  };
  var xIndex = 0;
  var width = 600 - margin.left - margin.right;
  var height = 270 - margin.top - margin.bottom;
  return <div>VanillaMonitor</div>;
}

export default VanillaMonitor;
