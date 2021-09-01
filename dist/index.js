!function(e,t,n,l,a,r,i){"use strict";function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var s=o(r),c=o(i),p={apiVersion:2,name:"c3/area",title:"Area Chart",description:"An area chart from c3.js",keywords:["area","chart","line"],icon:"chart-area",category:"charts",example:{},attributes:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}},u={file:{type:"integer"},width:{type:"integer"},height:{type:"integer"},padding:{type:"object",items:{top:{type:"integer"},right:{type:"integer"},bottom:{type:"integer"},left:{type:"integer"}}},color:{type:"array",items:{type:"string"}},interaction:{type:"object",items:{enabled:{type:"boolean"}},default:{enabled:!0}},transition:{type:"object",items:{duration:{type:"integer"}}},point:{type:"object",items:{show:{type:"boolean"}},default:{show:!0}},data:{type:"object",items:{url:{type:"string"},json:{type:"object"},rows:{type:"array",items:{type:"string"}},columns:{type:"array",items:{type:"string"}},mimeType:{type:"string"},keys:{type:"array",items:{type:"string"}},x:{type:"string"},xFormat:{type:"string"},names:{type:"object"},classes:{type:"object"},labels:{type:"boolean"},groups:{type:"array",items:{type:"array",items:{type:"string"}}},axes:{type:"object"},type:{type:"string",enum:["line","spline","step","area","area-spline","area-step","bar","scatter","stanford","pie","donut","gauge"]},types:{type:"object"},order:{enum:["desc","asc",""]},selection:{type:"object",items:{enabled:{type:"boolean"},grouped:{type:"boolean"},multiple:{type:"boolean"},draggable:{type:"boolean"}}}},default:{groups:[],labels:!1,type:"line",order:"desc",selection:{enabled:!1,grouped:!1,multiple:!0,draggable:!0}}},legend:{type:"object",items:{show:{type:"boolean"},position:{enum:["bottom","right"]}},default:{show:!0,position:"bottom"}},tooltip:{type:"object",items:{show:{type:"boolean"},grouped:{type:"boolean"}},default:{show:!0,grouped:!1}},axis:{type:"object",items:{rotated:{type:"boolean"},x:{show:{type:"boolean"},type:{enum:["indexed","timeseries","category"]},localtime:{type:"boolean"},categories:{type:"array",items:{type:"string"}},tick:{type:"object",items:{centered:{type:"boolean"},format:{type:"string"},culling:{type:"string"},count:{type:"integer"},fit:{type:"boolean"},values:{type:"array",items:{type:"string"}},rotate:{type:"integer"},outer:{type:"boolean"},multiline:{type:"boolean"},multilineMax:{type:"integer"}}},max:{type:"integer"},min:{type:"integer"},padding:{type:"object",items:{top:{type:"integer"},right:{type:"integer"},bottom:{type:"integer"},left:{type:"integer"}}},height:{type:"integer"},extent:{type:"array",items:{type:"integer"}},label:{type:"object",items:{text:{type:"string"},position:{type:"string"}}}},y:{show:{type:"boolean"},inner:{type:"boolean"},type:{enum:["linear","timeseries","time"]},max:{type:"integer"},min:{type:"integer"},inverted:{type:"boolean"},center:{type:"integer"},label:{type:"object",items:{text:{type:"string"},position:{type:"string"}}},tick:{type:"object",items:{format:{type:"string"},outer:{type:"boolean"},values:{type:"array",items:{type:"integer"}},count:{type:"integer"},padding:{type:"integer"},default:{type:"array",items:{type:"integer"}}}},padding:{type:"object",items:{top:{type:"integer"},right:{type:"integer"},bottom:{type:"integer"},left:{type:"integer"}}},default:{type:"array",items:{type:"integer"}},primary:{type:"string"},secondary:{type:"string"}},y2:{type:"object",items:{show:{type:"boolean"},inner:{type:"boolean"},type:{enum:["linear","timeseries","time"]},max:{type:"integer"},min:{type:"integer"},inverted:{type:"boolean"},center:{type:"integer"},label:{type:"string"},tick:{type:"object",items:{format:{type:"string"},outer:{type:"boolean"},values:{type:"array",items:{type:"integer"}},count:{type:"integer"}}},padding:{type:"object",items:{top:{type:"integer"},right:{type:"integer"},bottom:{type:"integer"},left:{type:"integer"}}},default:{type:"array",items:{type:"integer"}}}}},default:{rotated:!1,x:{show:!0,type:"indexed",localtime:!0,tick:{centered:!1,culling:!1,fit:!0,outer:!0,multiline:!0,multilineMax:0}},y:{show:!0,inner:!1,type:"linear",inverted:!1,tick:{centered:!1,culling:!1},primary:"",secondary:""},y2:{show:!1,inner:!1,type:"linear",inverted:!1}}},grid:{type:"object",items:{x:{type:"object",items:{show:{type:"boolean"},lines:{type:"array",items:{type:"object",items:{value:{type:"number"},text:{type:"string"},position:{enum:["","middle","start"]}}}}}},y:{type:"object",items:{show:{type:"boolean"},lines:{type:"array",items:{type:"object",items:{value:{type:"number"},text:{type:"string"},position:{enum:["","middle","start"]}}}}}}},default:{x:{show:!1,lines:[],type:"indexed"},y:{show:!1,lines:[],type:"linear"}}},regions:{type:"array",items:{type:"object",items:{axis:{enum:["x","y","y2"]},start:{type:"number"},end:{type:"number"},class:{type:"string"}}},default:[]},zoom:{type:"boolean",default:!1},subchart:{type:"boolean",default:!1}};function m(e){var a=e.accept,r=void 0===a?"text/csv":a,i=e.addToGallery,o=void 0!==i&&i,s=e.allowedTypes,c=void 0===s?["text/csv"]:s,p=e.help,u=e.label,m=e.labels,d=void 0===m?{title:"Select CSV File",instructions:""}:m,y=e.onSelect;e.removeMediaLabel;var g=e.value,b=e.multiple,f=void 0!==b&&b,h=l.useSelect((function(e){return e("core").getMedia(g)}),[g]);return wp.element.createElement(n.BaseControl,{label:u,help:p},wp.element.createElement("div",{className:"wikit-charts-csv-control"},g?wp.element.createElement(t.MediaUploadCheck,null,wp.element.createElement(t.MediaUpload,{allowedTypes:c,value:g,onSelect:function(e){return y(e)},render:function(e){var t=e.open;return wp.element.createElement(wp.element.Fragment,null,wp.element.createElement(n.Button,{onClick:t,icon:"media-spreadsheet",isSecondary:!0,isBusy:g&&!h,style:{width:"100%",justifyContent:"center"}},h?h.source_url.split("/").pop():wp.element.createElement(n.Spinner,null)))}})):wp.element.createElement(t.MediaUploadCheck,{fallback:"You do not have the upload media capability."},wp.element.createElement(t.MediaPlaceholder,{accept:r,addToGallery:o,allowedTypes:c,labels:d,onSelect:function(e){return y(e)},multiple:f}))))}function d(){return(d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(e[l]=n[l])}return e}).apply(this,arguments)}function y(e,t){if(null==e)return{};var n,l,a=function(e,t){if(null==e)return{};var n,l,a={},r=Object.keys(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function g(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null==n)return;var l,a,r=[],i=!0,o=!1;try{for(n=n.call(e);!(i=(l=n.next()).done)&&(r.push(l.value),!t||r.length!==t);i=!0);}catch(e){o=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(o)throw a}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return b(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,l=new Array(t);n<t;n++)l[n]=e[n];return l}var f=window.wdg.charts.config||{};var h=["file","type","attributes","setAttributes"];function w(e){var t=e.file,r=void 0===t?0:t,i=e.type,o=e.attributes;e.setAttributes;var c=y(e,h),p=l.useSelect((function(e){return e("core").getMedia(r)}),[r]),u=a.useRef(),m=g(a.useState(null),2),b=m[0],w=m[1];return a.useEffect((function(){if(p&&p.source_url){var e=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=Object.assign(f,e,t);return n.data.axes=n.data.axes||{},n.axis&&n.axis.y&&(n.axis.y.primary&&(n.data.axes[n.axis.y.primary]="y"),n.axis.y.secondary?(n.data.axes[n.axis.y.secondary]="y2",n.axis.y2={show:!0}):n.axis.y2={show:!1}),n}(o,{bindto:u.current,data:Object.assign(o.data,{type:i,url:p.source_url})});console.log(e),w(s.default.generate(e))}return function(){b&&u.current&&(b.destroy(),w(null))}}),[p,u,r,o]),r?p?wp.element.createElement("div",d({ref:u},c)):wp.element.createElement(n.Spinner,null):null}var v=["text/csv","application/vnd.ms-excel"];function x(e){var a=e.type,r=e.attributes,i=e.setAttributes,o=e.children,s=l.useSelect((function(e){return e("core").getMedia(r.file)}),[r.file]),p=function(e){var t=c.default.cloneDeep(r);t.file=e.id,t.data=c.default.merge(t.data||{},{source_url:e.source_url}),i(t)};return wp.element.createElement(wp.element.Fragment,null,wp.element.createElement(t.InspectorControls,null,wp.element.createElement(n.Panel,null,wp.element.createElement(n.PanelBody,{title:"Data",initialOpen:!0},wp.element.createElement(m,{value:r.file,onSelect:p}),wp.element.createElement(n.PanelRow,null,wp.element.createElement(n.ToggleControl,{label:"Labels",checked:r.data.labels,onChange:function(e){var t=c.default.cloneDeep(r);t.data.labels=e,i(t)}}))),["line"].includes(a)&&wp.element.createElement(n.PanelBody,{title:"Line Chart",initialOpen:!0},wp.element.createElement(n.ToggleControl,{label:"Show Points",checked:r.point.show,onChange:function(e){var t=c.default.cloneDeep(r);t.point.show=e,i(t)}})),wp.element.createElement(n.PanelBody,{title:"Legend",initialOpen:!1},wp.element.createElement(n.ToggleControl,{label:"Legend",checked:r.legend.show,onChange:function(e){var t=c.default.cloneDeep(r);t.legend.show=e,i(t)}}),wp.element.createElement(n.SelectControl,{label:"Legend Position",value:r.legend.position,options:[{label:"Bottom",value:"bottom"},{label:"Right",value:"right"}],onChange:function(e){var t=c.default.cloneDeep(r);t.legend.position=e,i(t)},disabled:!r.legend.show})),wp.element.createElement(n.PanelBody,{title:"Tooltip",initialOpen:!1},wp.element.createElement(n.ToggleControl,{label:"Tooltip",checked:r.tooltip.show,onChange:function(e){var t=c.default.cloneDeep(r);t.tooltip.show=e,i(t)}}),wp.element.createElement(n.ToggleControl,{label:"Group Tooltip",checked:r.tooltip.grouped,onChange:function(e){var t=c.default.cloneDeep(r);t.tooltip.grouped=e,i(t)},disabled:!r.tooltip.show})),["line","bar","spline","area","area-spline"].includes(a)&&wp.element.createElement(n.PanelBody,{title:"Axis",initialOpen:!1},wp.element.createElement(n.ToggleControl,{label:"X Axis",checked:r.axis.x.show,onChange:function(e){var t=c.default.cloneDeep(r);t.axis.x.show=e,i(t)}}),wp.element.createElement(n.SelectControl,{label:"X Axis Type",value:r.axis.x.type,options:[{value:"indexed",label:"Default"},{value:"timeseries",label:"Timeseries"}],onChange:function(e){var t=c.default.cloneDeep(r);t.axis.x.type=e,"timeseries"===e?t.axis.tick.format="%Y-%m-%d":delete t.axis.tick.format,i(t)},disabled:!r.axis.x.show}),wp.element.createElement(n.ToggleControl,{label:"Y Axis",checked:r.axis.y.show,onChange:function(e){var t=c.default.cloneDeep(r);t.axis.y.show=e,i(t)}}),s&&s.c3ChartData&&s.c3ChartData.headers&&wp.element.createElement(wp.element.Fragment,null,wp.element.createElement(n.SelectControl,{label:"Primary Y Axis",value:r.axis.y.primary,options:[{value:"",label:"Default"}].concat(s.c3ChartData.headers.map((function(e){return{value:e,label:e}}))),onChange:function(e){var t=c.default.cloneDeep(r);t.axis.y.primary=e,i(t)},disabled:!r.axis.y.show}),wp.element.createElement(n.SelectControl,{label:"Secondary Y Axis",value:r.axis.y.secondary,options:[{value:"",label:"None"}].concat(s.c3ChartData.headers.map((function(e){return{value:e,label:e}}))),onChange:function(e){var t=c.default.cloneDeep(r);t.axis.y.secondary=e,i(t)},disabled:!r.axis.y.show}))),["line","bar","area","area-spline","spline"].includes(a)&&wp.element.createElement(n.PanelBody,{title:"Grid",initialOpen:!1},wp.element.createElement(n.PanelRow,null,wp.element.createElement(n.ToggleControl,{label:"Show X Axis Grid",checked:r.grid.x.show,onChange:function(e){var t=c.default.cloneDeep(r);t.grid.x.show=e,i(t)}})),r.grid.x&&r.grid.x.lines&&r.grid.x.lines.length?r.grid.x.lines.map((function(e,t){return wp.element.createElement("div",{key:t},wp.element.createElement(n.TextControl,{label:"Line Value",value:e.value,onChange:function(e){var n=c.default.cloneDeep(r);n.grid.x.lines[t].value=e,i(n)}}),wp.element.createElement(n.TextControl,{label:"Line Label",value:e.text,onChange:function(e){var n=c.default.cloneDeep(r);n.grid.x.lines[t].text=e,i(n)}}),wp.element.createElement(n.SelectControl,{label:"Label Position",value:e.position,onChange:function(e){var n=c.default.cloneDeep(r);n.grid.x.lines[t].position=e,i(n)},options:[{value:"",label:"End"},{value:"middle",label:"Middle"},{value:"start",label:"Start"}]}),wp.element.createElement(n.Button,{isLink:!0,isDestructive:!0,onClick:function(){var e=c.default.cloneDeep(r);e.grid.x.lines=e.grid.x.lines.filter((function(e,n){return n!==t})),i(e)}},"Remove Grid Line"),wp.element.createElement("hr",null))})):null,wp.element.createElement(n.PanelRow,null,wp.element.createElement(n.Button,{isLink:!0,onClick:function(){var e=c.default.cloneDeep(r);e.grid.x.lines.push({value:0,text:"Grid Line",position:""}),i(e)}},"Add X Grid Line")),wp.element.createElement(n.PanelRow,null,wp.element.createElement(n.ToggleControl,{label:"Show Gridline Y Axis",checked:r.grid.y.show,onChange:function(e){var t=c.default.cloneDeep(r);t.grid.y.show=e,i(t)}})),r.grid.y&&r.grid.y.lines&&r.grid.y.lines.length?r.grid.y.lines.map((function(e,t){return wp.element.createElement("div",{key:t},wp.element.createElement(n.TextControl,{label:"Line Value",value:e.value,onChange:function(e){var n=c.default.cloneDeep(r);n.grid.y.lines[t].value=e,i(n)}}),wp.element.createElement(n.TextControl,{label:"Line Label",value:e.text,onChange:function(e){var n=c.default.cloneDeep(r);n.grid.y.lines[t].text=e,i(n)}}),wp.element.createElement(n.SelectControl,{label:"Label Position",value:e.position,onChange:function(e){var n=c.default.cloneDeep(r);n.grid.y.lines[t].position=e,i(n)},options:[{value:"",label:"End"},{value:"middle",label:"Middle"},{value:"start",label:"Start"}]}),wp.element.createElement(n.Button,{isLink:!0,isDestructive:!0,onClick:function(){var e=c.default.cloneDeep(r);e.grid.y.lines=e.grid.y.lines.filter((function(e,n){return n!==t})),i(e)}},"Remove Grid Line"),wp.element.createElement("hr",null))})):null,wp.element.createElement(n.PanelRow,null,wp.element.createElement(n.Button,{isLink:!0,onClick:function(){var e=c.default.cloneDeep(r);e.grid.y.lines.push({value:0,text:"Grid Line",position:""}),i(e)}},"Add Y Grid Line"))),["line","bar","area","area-spline","spline"].includes(a)&&wp.element.createElement(n.PanelBody,{title:"Regions",initialOpen:!1},r.regions&&r.regions.map((function(e,t){return wp.element.createElement("div",{key:t},wp.element.createElement(n.SelectControl,{label:"Axis",value:e.axis,onChange:function(e){var n=c.default.cloneDeep(r);n.regions[t].axis=e,i(n)},options:[{value:"x",label:"X Axis"},{value:"y",label:"Y Axis"},{value:"y2",label:"Secondary Y Axis",disabled:!r.axis.y.secondary}]}),wp.element.createElement(n.TextControl,{label:"Start",value:e.start,onChange:function(e){var n=c.default.cloneDeep(r);n.regions[t].start=e,i(n)}}),wp.element.createElement(n.TextControl,{label:"End",value:e.end,onChange:function(e){var n=c.default.cloneDeep(r);n.regions[t].end=e,i(n)}}),wp.element.createElement(n.Button,{isLink:!0,isDestructive:!0,onClick:function(){var e=c.default.cloneDeep(r);e.regions=e.regions.filter((function(e,n){return n!==t})),i(e)}},"Remove Region"),wp.element.createElement("hr",null))})),wp.element.createElement(n.PanelRow,null,wp.element.createElement(n.Button,{isLink:!0,onClick:function(){var e=c.default.cloneDeep(r);e.regions.push({axis:"x",start:0,end:10,class:""}),i(e)}},"Add Region"))),wp.element.createElement(n.PanelBody,{title:"Experimental",initialOpen:!1},wp.element.createElement(n.ToggleControl,{label:"Zoom Enabled",checked:r.zoom,onChange:function(e){return i({zoom:e})}}),wp.element.createElement(n.ToggleControl,{label:"Sub Chart",checked:r.subchart,onChange:function(e){return i({subchart:e})}})))),wp.element.createElement(t.BlockControls,null,wp.element.createElement(n.Toolbar,null,wp.element.createElement(t.MediaReplaceFlow,{media:s&&s.source_url?s.source_url:"",mediaId:r.file,allowedTypes:v,accept:v.join(","),onSelect:p,name:r.file?"Replace CSV Data File":"Select CSV Data File"}))),r.file?o||wp.element.createElement(w,{type:a,file:r.file,attributes:r,setAttributes:i}):wp.element.createElement(m,{value:r.file,onSelect:p}))}p.attributes=c.default.merge(c.default.cloneDeep(u),p.attributes||{}),p.edit=function(e){var n=e.attributes,l=e.setAttributes;return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--area"}),wp.element.createElement(x,{type:"area",attributes:n,setAttributes:l}))},p.save=function(){return null},e.registerBlockType(p.name,p);var E={apiVersion:2,name:"c3/area-spline",title:"Area Spline Chart",description:"An area spline chart from c3.js",keywords:["area","chart","line"],icon:"chart-area",category:"charts",example:{},attributes:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}};E.attributes=c.default.merge(c.default.cloneDeep(u),E.attributes||{}),E.edit=function(e){var n=e.attributes,l=e.setAttributes;return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--area-spline"}),wp.element.createElement(x,{type:"area-spline",attributes:n,setAttributes:l}))},E.save=function(){return null},e.registerBlockType(E.name,E);var C={apiVersion:2,name:"c3/bar",title:"Bar Chart",description:"A bar chart from c3.js",keywords:["bar","chart"],icon:"chart-bar",category:"charts",example:{},attributes:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}};C.attributes=c.default.merge(c.default.cloneDeep(u),C.attributes||{}),C.edit=function(e){var a=e.attributes,r=e.setAttributes,i=l.useSelect((function(e){return e("core").getMedia(a.file)}),[a.file]);return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--bar"}),wp.element.createElement(x,{type:"bar",attributes:a,setAttributes:r,controls:function(){return wp.element.createElement(n.PanelBody,{title:"Bar Chart",initialOpen:!0,icon:C.icon},i?wp.element.createElement(n.ToggleControl,{label:"Stacked Bar Chart",checked:a.data&&a.data.groups&&a.data.groups.length>0,onChange:function(e){var t=cloneDeep(a);t.data=t.data||{},console.log({attr:t}),t.data.groups=e?[i.c3ChartData.headers]:[],r(t)}}):wp.element.createElement(n.Spinner,null))}}))},C.save=function(){return null},e.registerBlockType(C.name,C);var k={apiVersion:2,name:"c3/donut",title:"Donut Chart",description:"A donut chart from c3.js",keywords:["donut","chart"],icon:"chart-line",category:"charts",example:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}};k.attributes=c.default.merge(c.default.cloneDeep(u),k.attributes||{}),k.edit=function(e){var n=e.attributes,l=e.setAttributes;return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--donut"}),wp.element.createElement(x,{type:"donut",attributes:n,setAttributes:l}))},k.save=function(){return null},e.registerBlockType(k.name,k);var j={apiVersion:2,name:"c3/line",title:"Line Chart",description:"A line chart from c3.js",keywords:["line","chart"],icon:"chart-line",category:"charts",example:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}};j.attributes=c.default.merge(c.default.cloneDeep(u),j.attributes||{}),j.edit=function(e){var n=e.attributes,l=e.setAttributes;return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--line"}),wp.element.createElement(x,{type:"line",attributes:n,setAttributes:l}))},j.save=function(){return null},e.registerBlockType(j.name,j);var D={apiVersion:2,name:"c3/pie",title:"Pie Chart",description:"A pie chart from c3.js",keywords:["pie","chart"],icon:"chart-pie",category:"charts",example:{},attributes:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}};D.attributes=c.default.merge(c.default.cloneDeep(u),D.attributes||{}),D.edit=function(e){var n=e.attributes,l=e.setAttributes;return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--pie"}),wp.element.createElement(x,{type:"pie",attributes:n,setAttributes:l}))},D.save=function(){return null},e.registerBlockType(D.name,D);var A={apiVersion:2,name:"c3/spline",title:"Spline Chart",description:"A spline chart from c3.js",keywords:["area","chart","spline","line"],icon:"chart-line",category:"charts",example:{},attributes:{},supports:{className:!1,align:["wide","left","right"],color:{background:!0,gradients:!1,text:!1}}};A.attributes=c.default.merge(c.default.cloneDeep(u),A.attributes||{}),A.edit=function(e){var n=e.attributes,l=e.setAttributes;return wp.element.createElement("figure",t.useBlockProps({className:"c3-chart c3-chart--spline"}),wp.element.createElement(x,{type:"spline",attributes:n,setAttributes:l}))},A.save=function(){return null},e.registerBlockType(A.name,A)}(wp.blocks,wp.blockEditor,wp.components,wp.data,wp.element,c3,lodash);
//# sourceMappingURL=index.js.map