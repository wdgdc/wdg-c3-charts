# WDG Charts

A plugin for WordPress that auto generates chart blocks using [c3.js](https://c3js.org) from CSV data.

## Dependencies

* c3.js
* d3.js

## Types of Charts

* Area
* Area Spline
* Bar (Stacked)
* Donut
* Line
* Pie
* Spline

[C3 Examples](https://c3js.org/examples.html)

## Filters

### wdg/c3/chart-colors

Apply a custom color scheme to a chart by providing an array of hex colors

### wdg/c3/chart-colors/$block

Apply a custom color scheme to a specific block name

### wdg/c3/script_defer

Whether to defer the plugin script

### wdg/c3/chart-config

Modify the arguments of any chart before it is rendered.

## Development

[Rollup](https://rollupjs.org/) is used to compile and bundle the javascript. After installing dependencies using `npm install`, Use `npm run build` to compile and `npm start` to build and watch for changes.
