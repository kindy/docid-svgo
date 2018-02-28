// lots of code from https://github.com/jakearchibald/svgomg

import svg2js from 'svgo/lib/svgo/svg2js';
import js2svg from 'svgo/lib/svgo/js2svg';
import JSAPI from 'svgo/lib/svgo/jsAPI';
import CSSClassList from 'svgo/lib/svgo/css-class-list';
import CSSStyleDeclaration from 'svgo/lib/svgo/css-style-declaration';
import runPlugins from 'svgo/lib/svgo/plugins';

// this list is auto update by `npm run gen`
// svg-plugins {{{

import removeDoctype from 'svgo/plugins/removeDoctype';
import removeXMLProcInst from 'svgo/plugins/removeXMLProcInst';
import removeComments from 'svgo/plugins/removeComments';
import removeMetadata from 'svgo/plugins/removeMetadata';
import removeXMLNS from 'svgo/plugins/removeXMLNS';
import removeEditorsNSData from 'svgo/plugins/removeEditorsNSData';
import cleanupAttrs from 'svgo/plugins/cleanupAttrs';
import inlineStyles from 'svgo/plugins/inlineStyles';
import minifyStyles from 'svgo/plugins/minifyStyles';
import convertStyleToAttrs from 'svgo/plugins/convertStyleToAttrs';
import cleanupIDs from 'svgo/plugins/cleanupIDs';
import prefixIds from 'svgo/plugins/prefixIds';
import removeRasterImages from 'svgo/plugins/removeRasterImages';
import removeUselessDefs from 'svgo/plugins/removeUselessDefs';
import cleanupNumericValues from 'svgo/plugins/cleanupNumericValues';
import cleanupListOfValues from 'svgo/plugins/cleanupListOfValues';
import convertColors from 'svgo/plugins/convertColors';
import removeUnknownsAndDefaults from 'svgo/plugins/removeUnknownsAndDefaults';
import removeNonInheritableGroupAttrs from 'svgo/plugins/removeNonInheritableGroupAttrs';
import removeUselessStrokeAndFill from 'svgo/plugins/removeUselessStrokeAndFill';
import removeViewBox from 'svgo/plugins/removeViewBox';
import cleanupEnableBackground from 'svgo/plugins/cleanupEnableBackground';
import removeHiddenElems from 'svgo/plugins/removeHiddenElems';
import removeEmptyText from 'svgo/plugins/removeEmptyText';
import convertShapeToPath from 'svgo/plugins/convertShapeToPath';
import moveElemsAttrsToGroup from 'svgo/plugins/moveElemsAttrsToGroup';
import moveGroupAttrsToElems from 'svgo/plugins/moveGroupAttrsToElems';
import collapseGroups from 'svgo/plugins/collapseGroups';
import convertPathData from 'svgo/plugins/convertPathData';
import convertTransform from 'svgo/plugins/convertTransform';
import removeEmptyAttrs from 'svgo/plugins/removeEmptyAttrs';
import removeEmptyContainers from 'svgo/plugins/removeEmptyContainers';
import mergePaths from 'svgo/plugins/mergePaths';
import removeUnusedNS from 'svgo/plugins/removeUnusedNS';
import sortAttrs from 'svgo/plugins/sortAttrs';
import removeTitle from 'svgo/plugins/removeTitle';
import removeDesc from 'svgo/plugins/removeDesc';
import removeDimensions from 'svgo/plugins/removeDimensions';
import removeAttrs from 'svgo/plugins/removeAttrs';
import removeElementsByAttr from 'svgo/plugins/removeElementsByAttr';
import addClassesToSVGElement from 'svgo/plugins/addClassesToSVGElement';
import removeStyleElement from 'svgo/plugins/removeStyleElement';
import removeScriptElement from 'svgo/plugins/removeScriptElement';
import addAttributesToSVGElement from 'svgo/plugins/addAttributesToSVGElement';


const plugins = [
  ['removeDoctype', removeDoctype],
  ['removeXMLProcInst', removeXMLProcInst],
  ['removeComments', removeComments],
  ['removeMetadata', removeMetadata],
  ['removeXMLNS', removeXMLNS],
  ['removeEditorsNSData', removeEditorsNSData],
  ['cleanupAttrs', cleanupAttrs],
  ['inlineStyles', inlineStyles],
  ['minifyStyles', minifyStyles],
  ['convertStyleToAttrs', convertStyleToAttrs],
  ['cleanupIDs', cleanupIDs],
  ['prefixIds', prefixIds],
  ['removeRasterImages', removeRasterImages],
  ['removeUselessDefs', removeUselessDefs],
  ['cleanupNumericValues', cleanupNumericValues],
  ['cleanupListOfValues', cleanupListOfValues],
  ['convertColors', convertColors],
  ['removeUnknownsAndDefaults', removeUnknownsAndDefaults],
  ['removeNonInheritableGroupAttrs', removeNonInheritableGroupAttrs],
  ['removeUselessStrokeAndFill', removeUselessStrokeAndFill],
  ['removeViewBox', removeViewBox],
  ['cleanupEnableBackground', cleanupEnableBackground],
  ['removeHiddenElems', removeHiddenElems],
  ['removeEmptyText', removeEmptyText],
  ['convertShapeToPath', convertShapeToPath],
  ['moveElemsAttrsToGroup', moveElemsAttrsToGroup],
  ['moveGroupAttrsToElems', moveGroupAttrsToElems],
  ['collapseGroups', collapseGroups],
  ['convertPathData', convertPathData],
  ['convertTransform', convertTransform],
  ['removeEmptyAttrs', removeEmptyAttrs],
  ['removeEmptyContainers', removeEmptyContainers],
  ['mergePaths', mergePaths],
  ['removeUnusedNS', removeUnusedNS],
  ['sortAttrs', sortAttrs],
  ['removeTitle', removeTitle],
  ['removeDesc', removeDesc],
  ['removeDimensions', removeDimensions],
  ['removeAttrs', removeAttrs],
  ['removeElementsByAttr', removeElementsByAttr],
  ['addClassesToSVGElement', addClassesToSVGElement],
  ['removeStyleElement', removeStyleElement],
  ['removeScriptElement', removeScriptElement],
  ['addAttributesToSVGElement', addAttributesToSVGElement],

];
// svg-plugins }}}

// Clone is currently broken. Hack it:
function cloneParsedSvg(svg) {
  const clones = new Map();

  function cloneKeys(target, obj) {
    for (const key of Object.keys(obj)) {
      target[key] = clone(obj[key]);
    }
    return target;
  }

  function clone(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (clones.has(obj)) {
      return clones.get(obj);
    }

    let objClone;

    if (obj.constructor === JSAPI) {
      objClone = new JSAPI({}, obj.parentNode);
      clones.set(obj, objClone);

      if (obj.parentNode) {
        objClone.parentNode = clone(obj.parentNode);
      }
      cloneKeys(objClone, obj);
    }
    else if (
      obj.constructor === CSSClassList ||
      obj.constructor === CSSStyleDeclaration ||
      obj.constructor === Object ||
      obj.constructor === Array
    ) {
      objClone = new obj.constructor();
      clones.set(obj, objClone);
      cloneKeys(objClone, obj);
    }
    else if (obj.constructor === Map) {
      objClone = new Map();
      clones.set(obj, objClone);

      for (const [key, val] of obj) {
        objClone.set(clone(key), clone(val));
      }
    }
    else if (obj.constructor === Set) {
      objClone = new Set();
      clones.set(obj, objClone);

      for (const val of obj) {
        objClone.add(clone(val));
      }
    }
    else {
      throw Error('unexpected type');
    }

    return objClone;
  }

  return clone(svg);
}

// Arrange plugins by type - this is what plugins() expects
function optimizePluginsArray(plugins) {
  return plugins.map(item => [item]).reduce((arr, item) => {
    const last = arr[arr.length - 1];

    if (last && item[0].type === last[0].type) {
      last.push(item[0]);
    }
    else {
      arr.push(item);
    }
    return arr;
  }, []);
}

function getDimensions(parsedSvg) {
  const svgEl = parsedSvg.content.filter(el => el.isElem('svg'))[0];

  if (!svgEl) {
    return {};
  }

  if (svgEl.hasAttr('width') && svgEl.hasAttr('height')) {
    return {
      width: parseFloat(svgEl.attr('width').value),
      height: parseFloat(svgEl.attr('height').value)
    };
  }

  if (svgEl.hasAttr('viewBox')) {
    const viewBox = svgEl.attr('viewBox').value.split(/(?:,\s*|\s+)/);

    return {
      width: parseFloat(viewBox[2]),
      height: parseFloat(viewBox[3])
    };
  }

  return {};
}

export class Svgo {
  constructor() {
    this.parsedSvg;
    this.multipassInstance;
  }

  load({ data }) {
    svg2js(data, p => (this.parsedSvg = p));

    if (this.parsedSvg.error) throw Error(this.parsedSvg.error);

    return getDimensions(this.parsedSvg);
  }

  process({ settings }) {
    this.multipassInstance = multipassCompress(this.parsedSvg, settings);
    return this.multipassInstance.next().value;
  }

  nextPass() {
    return this.multipassInstance.next().value;
  }

  optimize(svg, settings) {
    return new Promise((resolve, reject) => {
      this.load({data: svg});
      resolve(this.process({settings}));
    })
  }
}

function* multipassCompress(parsedSvg, settings) {
  // TODO: `settings.plugins` support {}, {fn}, currently only boolean
  // enable all plugins if no pass in settings
  let x = ' addClassesToSVGElement addAttributesToSVGElement prefixIds removeAttrs removeElementsByAttr ';
  const isActive = settings.plugins ? name => Boolean(settings.plugins[name]) : name => x.indexOf(` ${name} `) === -1;

  const pluginsData = plugins.reduce((memo, [name, pl]) => {
    memo.push(Object.assign(
      {}, pl,
      {
        name,
        active: isActive(name),
      }
    ));

    return memo;
  }, []);

  const optimisedPluginsData = optimizePluginsArray(pluginsData);

  // Set floatPrecision across all the plugins
  const floatPrecision = Number(settings.floatPrecision);

  for (const plugin of Object.values(pluginsData)) {
    if (plugin.params && 'floatPrecision' in plugin.params) {
      plugin.params.floatPrecision = floatPrecision;
    }
  }

  const svg = cloneParsedSvg(parsedSvg);
  let svgData;
  let previousDataLength;

  while (svgData === undefined || svgData.length != previousDataLength) {
    previousDataLength = svgData && svgData.length;
    runPlugins(svg, {input: 'string'}, optimisedPluginsData);
    svgData = js2svg(svg, {
      indent: '  ',
      pretty: settings.pretty
    }).data;

    yield {
      data: svgData,
      dimensions: getDimensions(svg)
    };
  }
}

export const svgo = new Svgo();

export {runPlugins, plugins, optimizePluginsArray, multipassCompress};
