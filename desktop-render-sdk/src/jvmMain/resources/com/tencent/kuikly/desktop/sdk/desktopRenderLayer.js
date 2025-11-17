(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["desktop-render-layer"] = factory();
	else
		root["desktop-render-layer"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./kotlin/KuiklyCore-core.js":
/*!***********************************!*\
  !*** ./kotlin/KuiklyCore-core.js ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
  if (true)
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./kotlin-kotlin-stdlib.js */ "./kotlin/kotlin-kotlin-stdlib.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  else {}
}(function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var protoOf = kotlin_kotlin.$_$.o2;
  var initMetadataForObject = kotlin_kotlin.$_$.c2;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.f;
  var Unit_instance = kotlin_kotlin.$_$.u;
  var objectCreate = kotlin_kotlin.$_$.n2;
  var NoSuchElementException_init_$Create$ = kotlin_kotlin.$_$.p;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.n;
  var initMetadataForClass = kotlin_kotlin.$_$.z1;
  var Collection = kotlin_kotlin.$_$.v;
  var KtList = kotlin_kotlin.$_$.x;
  var Iterable = kotlin_kotlin.$_$.w;
  var VOID = kotlin_kotlin.$_$.b;
  var ensureNotNull = kotlin_kotlin.$_$.u3;
  var IllegalStateException_init_$Create$_0 = kotlin_kotlin.$_$.o;
  var isInterface = kotlin_kotlin.$_$.f2;
  var KtSet = kotlin_kotlin.$_$.b1;
  var Entry = kotlin_kotlin.$_$.y;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.d1;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.c;
  var toHashSet = kotlin_kotlin.$_$.o1;
  var asJsReadonlyMapView = kotlin_kotlin.$_$.z;
  var KtMap = kotlin_kotlin.$_$.a1;
  var HashMap_init_$Create$ = kotlin_kotlin.$_$.e;
  var initMetadataForCompanion = kotlin_kotlin.$_$.a2;
  //endregion
  //region block: pre-declaration
  initMetadataForObject(CrossPlatFeature, 'CrossPlatFeature');
  initMetadataForObject(BridgeManager, 'BridgeManager');
  initMetadataForClass(FastArrayList$listIterator$1);
  initMetadataForClass(FastArrayList, 'FastArrayList', FastArrayList_init_$Create$, VOID, [Collection, KtList, Iterable]);
  initMetadataForClass(FastHashSet$iterator$1);
  initMetadataForClass(FastHashSet, 'FastHashSet', FastHashSet_init_$Create$, VOID, [Collection, KtSet, Iterable]);
  initMetadataForClass(FastLinkedHashMap$entries$1, VOID, VOID, VOID, [Entry]);
  initMetadataForClass(FastLinkedHashMap, 'FastLinkedHashMap', FastLinkedHashMap_init_$Create$, VOID, [KtMap]);
  initMetadataForCompanion(Companion);
  initMetadataForClass(NativeBridge, 'NativeBridge', NativeBridge);
  //endregion
  function CrossPlatFeature() {
    this.vc_1 = true;
    this.wc_1 = false;
  }
  var CrossPlatFeature_instance;
  function CrossPlatFeature_getInstance() {
    return CrossPlatFeature_instance;
  }
  function BridgeManager() {
    BridgeManager_instance = this;
    this.xc_1 = 'BridgeManager';
    this.yc_1 = false;
    this.zc_1 = '';
    var tmp = this;
    // Inline function 'com.tencent.kuikly.core.collection.fastMutableMapOf' call
    var tmp_0;
    if (CrossPlatFeature_instance.vc_1) {
      tmp_0 = FastLinkedHashMap_init_$Create$();
    } else {
      // Inline function 'kotlin.collections.mutableMapOf' call
      tmp_0 = LinkedHashMap_init_$Create$();
    }
    tmp.ad_1 = tmp_0;
    var tmp_1 = this;
    // Inline function 'com.tencent.kuikly.core.collection.fastMutableMapOf' call
    var tmp_2;
    if (CrossPlatFeature_instance.vc_1) {
      tmp_2 = FastLinkedHashMap_init_$Create$();
    } else {
      // Inline function 'kotlin.collections.mutableMapOf' call
      tmp_2 = LinkedHashMap_init_$Create$();
    }
    tmp_1.bd_1 = tmp_2;
  }
  protoOf(BridgeManager).cd = function (instanceId, nativeBridge) {
    // Inline function 'kotlin.collections.set' call
    this.ad_1.k2(instanceId, nativeBridge);
  };
  protoOf(BridgeManager).dd = function (instanceId) {
    return this.ad_1.b1(instanceId);
  };
  var BridgeManager_instance;
  function BridgeManager_getInstance() {
    if (BridgeManager_instance == null)
      new BridgeManager();
    return BridgeManager_instance;
  }
  function setIsEnableFastCollection(isEnable) {
    CrossPlatFeature_instance.vc_1 = isEnable;
  }
  function setIsIgnoreRenderViewForFlatLayer(isIgnore) {
    CrossPlatFeature_instance.wc_1 = isIgnore;
  }
  function FastArrayList_init_$Init$($this) {
    FastArrayList.call($this);
    $this.ed_1 = [];
    return $this;
  }
  function FastArrayList_init_$Create$() {
    return FastArrayList_init_$Init$(objectCreate(protoOf(FastArrayList)));
  }
  function FastArrayList$listIterator$1($index, this$0) {
    this.gd_1 = this$0;
    this.fd_1 = $index;
  }
  protoOf(FastArrayList$listIterator$1).g = function () {
    return this.fd_1 < this.gd_1.i();
  };
  protoOf(FastArrayList$listIterator$1).h = function () {
    if (!this.g()) {
      throw NoSuchElementException_init_$Create$();
    }
    var tmp = this.gd_1.ed_1;
    var _unary__edvuaz = this.fd_1;
    this.fd_1 = _unary__edvuaz + 1 | 0;
    // Inline function 'kotlin.js.unsafeCast' call
    return tmp[_unary__edvuaz];
  };
  protoOf(FastArrayList$listIterator$1).o2 = function () {
    if (this.fd_1 === 0) {
      throw IllegalStateException_init_$Create$();
    }
    this.fd_1 = this.fd_1 - 1 | 0;
    this.gd_1.t2(this.fd_1);
  };
  protoOf(FastArrayList).i = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.ed_1.length;
  };
  protoOf(FastArrayList).b3 = function () {
    this.ed_1.length = 0;
  };
  protoOf(FastArrayList).d = function (element) {
    var tmp = this.ed_1;
    // Inline function 'kotlin.js.unsafeCast' call
    tmp[this.ed_1.length] = element;
    return true;
  };
  protoOf(FastArrayList).j = function (index) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.ed_1[index];
  };
  protoOf(FastArrayList).k = function () {
    return this.ed_1.length === 0;
  };
  protoOf(FastArrayList).f = function () {
    return this.hd();
  };
  protoOf(FastArrayList).hd = function () {
    return this.d3(0);
  };
  protoOf(FastArrayList).d3 = function (index) {
    return new FastArrayList$listIterator$1(index, this);
  };
  protoOf(FastArrayList).t2 = function (index) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.ed_1.splice(index, 1)[0];
  };
  protoOf(FastArrayList).x = function (element) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.ed_1.indexOf(element);
  };
  protoOf(FastArrayList).w = function (element) {
    return !(this.x(element) === -1);
  };
  function FastArrayList() {
  }
  function FastHashSet_init_$Init$($this) {
    FastHashSet.call($this);
    $this.id_1 = new Set();
    return $this;
  }
  function FastHashSet_init_$Create$() {
    return FastHashSet_init_$Init$(objectCreate(protoOf(FastHashSet)));
  }
  function FastHashSet$iterator$1(this$0) {
    this.md_1 = this$0;
    this.jd_1 = this$0.id_1.values();
    this.kd_1 = null;
    this.ld_1 = 0;
  }
  protoOf(FastHashSet$iterator$1).g = function () {
    return this.ld_1 < this.md_1.i();
  };
  protoOf(FastHashSet$iterator$1).h = function () {
    this.ld_1 = this.ld_1 + 1 | 0;
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    tmp.kd_1 = this.jd_1.next().value;
    return ensureNotNull(this.kd_1);
  };
  protoOf(FastHashSet$iterator$1).o2 = function () {
    if (this.kd_1 == null) {
      throw IllegalStateException_init_$Create$_0('next() must be called before remove()');
    }
    this.md_1.id_1.delete(this.kd_1);
    this.kd_1 = null;
  };
  protoOf(FastHashSet).i = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.id_1.size;
  };
  protoOf(FastHashSet).k = function () {
    return this.i() === 0;
  };
  protoOf(FastHashSet).w = function (element) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.id_1.has(element);
  };
  protoOf(FastHashSet).y = function (elements) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(elements, Collection)) {
        tmp = elements.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var _iterator__ex2g4s = elements.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (!this.w(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(FastHashSet).f = function () {
    return new FastHashSet$iterator$1(this);
  };
  protoOf(FastHashSet).d = function (element) {
    var oldSize = this.i();
    this.id_1.add(element);
    return !(this.i() === oldSize);
  };
  protoOf(FastHashSet).m2 = function (element) {
    var oldSize = this.i();
    this.id_1.delete(element);
    return !(this.i() === oldSize);
  };
  function FastHashSet() {
  }
  function FastLinkedHashMap_init_$Init$($this) {
    FastLinkedHashMap.call($this);
    $this.nd_1 = new Map();
    return $this;
  }
  function FastLinkedHashMap_init_$Create$() {
    return FastLinkedHashMap_init_$Init$(objectCreate(protoOf(FastLinkedHashMap)));
  }
  function FastLinkedHashMap$entries$1($key, this$0) {
    this.pd_1 = $key;
    this.qd_1 = this$0;
    this.od_1 = $key;
  }
  protoOf(FastLinkedHashMap$entries$1).z = function () {
    return this.od_1;
  };
  protoOf(FastLinkedHashMap$entries$1).a1 = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.qd_1.nd_1.get(this.pd_1);
  };
  function FastLinkedHashMap$containsValue$lambda($value) {
    return function (v) {
      return $value === v;
    };
  }
  protoOf(FastLinkedHashMap).g1 = function () {
    // Inline function 'kotlin.collections.map' call
    var this_0 = this.e1();
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s = this_0.f();
    while (_iterator__ex2g4s.g()) {
      var item = _iterator__ex2g4s.h();
      var tmp$ret$0 = new FastLinkedHashMap$entries$1(item, this);
      destination.d(tmp$ret$0);
    }
    return toHashSet(destination);
  };
  protoOf(FastLinkedHashMap).e1 = function () {
    var keySet = FastHashSet_init_$Create$();
    keySet.id_1 = function () {
      return new Set(this);
    }.call(this.nd_1.keys());
    return keySet;
  };
  protoOf(FastLinkedHashMap).i = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nd_1.size;
  };
  protoOf(FastLinkedHashMap).f1 = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    var mapValues = Array.from(this.nd_1.values());
    var fastList = FastArrayList_init_$Create$();
    fastList.ed_1 = mapValues;
    return fastList;
  };
  protoOf(FastLinkedHashMap).k = function () {
    return this.i() === 0;
  };
  protoOf(FastLinkedHashMap).m3 = function (key) {
    // Inline function 'kotlin.js.unsafeCast' call
    var value = this.nd_1.get(key);
    this.nd_1.delete(key);
    return value;
  };
  protoOf(FastLinkedHashMap).k2 = function (key, value) {
    this.nd_1.set(key, value);
    return value;
  };
  protoOf(FastLinkedHashMap).d1 = function (key) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nd_1.get(key);
  };
  protoOf(FastLinkedHashMap).c1 = function (value) {
    // Inline function 'kotlin.js.unsafeCast' call
    var mapValues = Array.from(this.nd_1.values());
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    return mapValues.some(FastLinkedHashMap$containsValue$lambda(value));
  };
  protoOf(FastLinkedHashMap).b1 = function (key) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nd_1.has(key);
  };
  function FastLinkedHashMap() {
  }
  function registerCallNative(pagerId, callback) {
    Companion_instance.sd(pagerId, callback);
    if (!BridgeManager_getInstance().dd(pagerId)) {
      BridgeManager_getInstance().cd(pagerId, new NativeBridge());
    }
  }
  function Companion() {
    this.rd_1 = null;
  }
  protoOf(Companion).sd = function (pagerId, callback) {
    if (this.rd_1 == null) {
      var tmp = this;
      // Inline function 'kotlin.collections.hashMapOf' call
      tmp.rd_1 = HashMap_init_$Create$();
    }
    var tmp0_safe_receiver = this.rd_1;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.k2(pagerId, callback);
  };
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  function NativeBridge() {
    this.td_1 = '';
    this.ud_1 = null;
  }
  //region block: post-declaration
  protoOf(FastLinkedHashMap).asJsReadonlyMapView = asJsReadonlyMapView;
  //endregion
  //region block: init
  CrossPlatFeature_instance = new CrossPlatFeature();
  Companion_instance = new Companion();
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $com = _.com || (_.com = {});
    var $com$tencent = $com.tencent || ($com.tencent = {});
    var $com$tencent$kuikly = $com$tencent.kuikly || ($com$tencent.kuikly = {});
    var $com$tencent$kuikly$core = $com$tencent$kuikly.core || ($com$tencent$kuikly.core = {});
    $com$tencent$kuikly$core.setIsEnableFastCollection = setIsEnableFastCollection;
    $com$tencent$kuikly$core.setIsIgnoreRenderViewForFlatLayer = setIsIgnoreRenderViewForFlatLayer;
    var $com = _.com || (_.com = {});
    var $com$tencent = $com.tencent || ($com.tencent = {});
    var $com$tencent$kuikly = $com$tencent.kuikly || ($com$tencent.kuikly = {});
    var $com$tencent$kuikly$core = $com$tencent$kuikly.core || ($com$tencent$kuikly.core = {});
    var $com$tencent$kuikly$core$nvi = $com$tencent$kuikly$core.nvi || ($com$tencent$kuikly$core.nvi = {});
    $com$tencent$kuikly$core$nvi.registerCallNative = registerCallNative;
  }
  $jsExportAll$(_);
  _.$jsExportAll$ = $jsExportAll$;
  //endregion
  return _;
}));



/***/ }),

/***/ "./kotlin/KuiklyCore-render-web-base.js":
/*!**********************************************!*\
  !*** ./kotlin/KuiklyCore-render-web-base.js ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
  if (true)
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./kotlin-kotlin-stdlib.js */ "./kotlin/kotlin-kotlin-stdlib.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  else {}
}(function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var protoOf = kotlin_kotlin.$_$.o2;
  var VOID = kotlin_kotlin.$_$.b;
  var Unit_instance = kotlin_kotlin.$_$.u;
  var initMetadataForInterface = kotlin_kotlin.$_$.b2;
  var throwUninitializedPropertyAccessException = kotlin_kotlin.$_$.z3;
  var contains = kotlin_kotlin.$_$.t2;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.f;
  var toString = kotlin_kotlin.$_$.p2;
  var listOf = kotlin_kotlin.$_$.j1;
  var initMetadataForCompanion = kotlin_kotlin.$_$.a2;
  var initMetadataForClass = kotlin_kotlin.$_$.z1;
  var isNumber = kotlin_kotlin.$_$.g2;
  var to = kotlin_kotlin.$_$.b4;
  var mapOf = kotlin_kotlin.$_$.k1;
  var hashCode = kotlin_kotlin.$_$.y1;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.d;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.o;
  var initMetadataForObject = kotlin_kotlin.$_$.c2;
  var NoSuchElementException_init_$Create$ = kotlin_kotlin.$_$.p;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.m;
  var Collection = kotlin_kotlin.$_$.v;
  var KtList = kotlin_kotlin.$_$.x;
  var Iterable = kotlin_kotlin.$_$.w;
  var toString_0 = kotlin_kotlin.$_$.a4;
  var Entry = kotlin_kotlin.$_$.y;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.d1;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.c;
  var toHashSet = kotlin_kotlin.$_$.o1;
  var toHashSet_0 = kotlin_kotlin.$_$.n1;
  var toMutableList = kotlin_kotlin.$_$.p1;
  var contains_0 = kotlin_kotlin.$_$.e1;
  var asJsReadonlyMapView = kotlin_kotlin.$_$.z;
  var KtMap = kotlin_kotlin.$_$.a1;
  var Enum = kotlin_kotlin.$_$.n3;
  var isInterface = kotlin_kotlin.$_$.f2;
  var objectCreate = kotlin_kotlin.$_$.n2;
  var numberToInt = kotlin_kotlin.$_$.l2;
  var equals = kotlin_kotlin.$_$.u1;
  var Pair = kotlin_kotlin.$_$.r3;
  var toDouble = kotlin_kotlin.$_$.c3;
  var Exception = kotlin_kotlin.$_$.o3;
  var charSequenceLength = kotlin_kotlin.$_$.s1;
  var Long = kotlin_kotlin.$_$.p3;
  var split = kotlin_kotlin.$_$.a3;
  var toInt = kotlin_kotlin.$_$.e3;
  var HashMap_init_$Create$ = kotlin_kotlin.$_$.e;
  var ensureNotNull = kotlin_kotlin.$_$.u3;
  var removeSuffix = kotlin_kotlin.$_$.y2;
  var listOf_0 = kotlin_kotlin.$_$.i1;
  var startsWith = kotlin_kotlin.$_$.b3;
  var json = kotlin_kotlin.$_$.i2;
  var mapOf_0 = kotlin_kotlin.$_$.l1;
  var charSequenceGet = kotlin_kotlin.$_$.r1;
  var uppercaseChar = kotlin_kotlin.$_$.m3;
  var toString_1 = kotlin_kotlin.$_$.s;
  var THROW_CCE = kotlin_kotlin.$_$.s3;
  var setOf = kotlin_kotlin.$_$.m1;
  var toIntOrNull = kotlin_kotlin.$_$.d3;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.x3;
  var emptyMap = kotlin_kotlin.$_$.f1;
  var numberToDouble = kotlin_kotlin.$_$.k2;
  var numberToLong = kotlin_kotlin.$_$.m2;
  var lazy = kotlin_kotlin.$_$.w3;
  var KProperty1 = kotlin_kotlin.$_$.s2;
  var getPropertyCallableRef = kotlin_kotlin.$_$.w1;
  var indexOf = kotlin_kotlin.$_$.v2;
  var toLongOrNull = kotlin_kotlin.$_$.g3;
  var replace = kotlin_kotlin.$_$.z2;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.q;
  var padStart = kotlin_kotlin.$_$.x2;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.j;
  var joinToString = kotlin_kotlin.$_$.h1;
  var Error_init_$Create$ = kotlin_kotlin.$_$.k;
  var LinkedHashSet_init_$Create$ = kotlin_kotlin.$_$.h;
  var getStringHashCode = kotlin_kotlin.$_$.x1;
  var LinkedHashMap_init_$Create$_0 = kotlin_kotlin.$_$.g;
  var Regex_init_$Create$ = kotlin_kotlin.$_$.i;
  var endsWith = kotlin_kotlin.$_$.u2;
  var first = kotlin_kotlin.$_$.g1;
  var isArray = kotlin_kotlin.$_$.d2;
  var Default_getInstance = kotlin_kotlin.$_$.t;
  var trimIndent = kotlin_kotlin.$_$.k3;
  var isCharSequence = kotlin_kotlin.$_$.e2;
  var trim = kotlin_kotlin.$_$.l3;
  var NumberFormatException = kotlin_kotlin.$_$.q3;
  var toLong = kotlin_kotlin.$_$.h3;
  var getKClassFromExpression = kotlin_kotlin.$_$.a;
  var Exception_init_$Init$ = kotlin_kotlin.$_$.l;
  var captureStack = kotlin_kotlin.$_$.q1;
  var Char__toInt_impl_vasixd = kotlin_kotlin.$_$.r;
  var toString_2 = kotlin_kotlin.$_$.j3;
  var toInt_0 = kotlin_kotlin.$_$.f3;
  var numberToChar = kotlin_kotlin.$_$.j2;
  var toLong_0 = kotlin_kotlin.$_$.i3;
  var indexOf_0 = kotlin_kotlin.$_$.w2;
  var getBooleanHashCode = kotlin_kotlin.$_$.v1;
  var average = kotlin_kotlin.$_$.c1;
  var compareTo = kotlin_kotlin.$_$.t1;
  //endregion
  //region block: pre-declaration
  function renderViewExport$default(viewName, renderViewExportCreator, shadowExportCreator, $super) {
    shadowExportCreator = shadowExportCreator === VOID ? null : shadowExportCreator;
    var tmp;
    if ($super === VOID) {
      this.wd(viewName, renderViewExportCreator, shadowExportCreator);
      tmp = Unit_instance;
    } else {
      tmp = $super.wd.call(this, viewName, renderViewExportCreator, shadowExportCreator);
    }
    return tmp;
  }
  initMetadataForInterface(IKuiklyRenderExport, 'IKuiklyRenderExport');
  initMetadataForCompanion(Companion);
  initMetadataForClass(KuiklyRenderView$initRenderCore$1);
  initMetadataForClass(KuiklyRenderView, 'KuiklyRenderView', KuiklyRenderView);
  initMetadataForClass(KuiklyRenderViewContext, 'KuiklyRenderViewContext');
  initMetadataForClass(KuiklyRenderExport, 'KuiklyRenderExport', KuiklyRenderExport, VOID, [IKuiklyRenderExport]);
  initMetadataForClass(TextPostProcessorInput, 'TextPostProcessorInput');
  initMetadataForObject(KuiklyRenderAdapterManager, 'KuiklyRenderAdapterManager');
  initMetadataForClass(FastMutableList$listIterator$1);
  initMetadataForClass(FastMutableList, 'FastMutableList', VOID, VOID, [Collection, KtList, Iterable]);
  initMetadataForClass(FastMutableMap$entries$1, VOID, VOID, VOID, [Entry]);
  initMetadataForClass(FastMutableMap, 'FastMutableMap', VOID, VOID, [KtMap]);
  initMetadataForCompanion(Companion_0);
  initMetadataForClass(KuiklyRenderNativeMethod, 'KuiklyRenderNativeMethod', VOID, Enum);
  initMetadataForClass(KuiklyRenderContextMethod, 'KuiklyRenderContextMethod', VOID, Enum);
  initMetadataForClass(KuiklyRenderNativeMethodIndex, 'KuiklyRenderNativeMethodIndex', VOID, Enum);
  initMetadataForClass(KuiklyRenderContextMethodIndex, 'KuiklyRenderContextMethodIndex', VOID, Enum);
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(KuiklyRenderContextHandler, 'KuiklyRenderContextHandler', KuiklyRenderContextHandler);
  initMetadataForClass(KuiklyRenderCoreExecuteMode, 'KuiklyRenderCoreExecuteMode', VOID, Enum);
  initMetadataForCompanion(Companion_2);
  initMetadataForClass(KuiklyRenderCore, 'KuiklyRenderCore', KuiklyRenderCore_init_$Create$);
  initMetadataForCompanion(Companion_3);
  initMetadataForClass(KRCSSAnimation, 'KRCSSAnimation');
  initMetadataForClass(KRCSSAnimationHandler, 'KRCSSAnimationHandler');
  initMetadataForClass(KRCSSPlainAnimationHandler, 'KRCSSPlainAnimationHandler', VOID, KRCSSAnimationHandler);
  function registerExternalRenderView(kuiklyRenderExport) {
  }
  function registerExternalModule(kuiklyRenderExport) {
  }
  function registerViewExternalPropHandler(kuiklyRenderExport) {
  }
  function coreExecuteMode() {
    return KuiklyRenderCoreExecuteMode_JS_getInstance();
  }
  function performanceMonitorTypes() {
    return listOf_0(KRMonitorType_LAUNCH_getInstance());
  }
  function onKuiklyRenderViewCreated() {
  }
  function onKuiklyRenderContentViewCreated() {
  }
  function syncRenderingWhenPageAppear() {
    return true;
  }
  function onGetLaunchData(data) {
  }
  function onGetPerformanceData(data) {
  }
  function onPageLoadComplete(isSucceed, errorReason, executeMode) {
  }
  function onPageLoadComplete$default(isSucceed, errorReason, executeMode, $super) {
    errorReason = errorReason === VOID ? null : errorReason;
    var tmp;
    if ($super === VOID) {
      this.cn(isSucceed, errorReason, executeMode);
      tmp = Unit_instance;
    } else {
      onPageLoadComplete(isSucceed, errorReason, executeMode);
      tmp = Unit_instance;
    }
    return tmp;
  }
  initMetadataForInterface(KuiklyRenderViewDelegatorDelegate, 'KuiklyRenderViewDelegatorDelegate');
  initMetadataForCompanion(Companion_4);
  function call(method, params, callback) {
    var tmp;
    if (params == null) {
      tmp = true;
    } else {
      tmp = !(params == null) ? typeof params === 'string' : false;
    }
    if (tmp) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      return this.yn(method, params, callback);
    }
    return null;
  }
  function call_0(method, params, callback) {
    return null;
  }
  function onDestroy() {
  }
  initMetadataForInterface(IKuiklyRenderModuleExport, 'IKuiklyRenderModuleExport');
  function get_reusable() {
    return false;
  }
  function set_kuiklyRenderContext(_) {
  }
  function setProp(propKey, propValue) {
    var result = setCommonProp(this.mn(), propKey, propValue);
    if (propKey === 'frame') {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      this.on(propValue);
    }
    return result;
  }
  function resetProp(propKey) {
    return true;
  }
  function setShadow(shadow) {
  }
  function resetShadow() {
  }
  function onAddToParent(parent) {
  }
  function onRemoveFromParent(parent) {
  }
  function removeFromParent() {
    var tmp0_elvis_lhs = this.mn().parentElement;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var parent = tmp;
    parent.removeChild(this.mn());
    this.vn(parent);
  }
  function onFrameChange(frame) {
  }
  initMetadataForInterface(IKuiklyRenderViewExport, 'IKuiklyRenderViewExport', VOID, VOID, [IKuiklyRenderModuleExport]);
  initMetadataForClass(KRActivityIndicatorView, 'KRActivityIndicatorView', KRActivityIndicatorView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_5);
  initMetadataForClass(KRBlurView, 'KRBlurView', KRBlurView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_6);
  initMetadataForClass(KRCanvasView, 'KRCanvasView', KRCanvasView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_7);
  initMetadataForClass(KRHoverView, 'KRHoverView', KRHoverView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_8);
  initMetadataForClass(KRImageView, 'KRImageView', VOID, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_9);
  initMetadataForClass(KRMaskView, 'KRMaskView', KRMaskView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_10);
  initMetadataForClass(KRPagView, 'KRPagView', KRPagView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_11);
  initMetadataForClass(KRTextProps, 'KRTextProps', KRTextProps);
  initMetadataForCompanion(Companion_12);
  function call_1(methodName, params) {
    return null;
  }
  initMetadataForInterface(IKuiklyRenderShadowExport, 'IKuiklyRenderShadowExport');
  initMetadataForClass(KRRichTextView, 'KRRichTextView', KRRichTextView, VOID, [IKuiklyRenderViewExport, IKuiklyRenderShadowExport]);
  initMetadataForCompanion(Companion_13);
  initMetadataForClass(KRScrollContentView, 'KRScrollContentView', KRScrollContentView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_14);
  initMetadataForClass(KRTextAreaView, 'KRTextAreaView', KRTextAreaView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_15);
  initMetadataForClass(KRTextFieldView, 'KRTextFieldView', KRTextFieldView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_16);
  initMetadataForClass(KRVideoView, 'KRVideoView', KRVideoView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForClass(KRVideoPlayState, 'KRVideoPlayState', VOID, Enum);
  initMetadataForCompanion(Companion_17);
  initMetadataForClass(KRVideoViewContentMode, 'KRVideoViewContentMode', VOID, Enum);
  initMetadataForCompanion(Companion_18);
  initMetadataForClass(KRVideoViewPlayControl, 'KRVideoViewPlayControl', VOID, Enum);
  initMetadataForCompanion(Companion_19);
  initMetadataForClass(KRView, 'KRView', KRView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForCompanion(Companion_20);
  initMetadataForClass(KRListView, 'KRListView', KRListView, VOID, [IKuiklyRenderViewExport]);
  initMetadataForClass(KRListViewContentInset, 'KRListViewContentInset', KRListViewContentInset);
  initMetadataForCompanion(Companion_21);
  initMetadataForClass(KuiklyRenderBaseModule, 'KuiklyRenderBaseModule', KuiklyRenderBaseModule, VOID, [IKuiklyRenderModuleExport]);
  initMetadataForClass(KRCalendarModule, 'KRCalendarModule', KRCalendarModule, KuiklyRenderBaseModule);
  initMetadataForClass(Operation, 'Operation');
  initMetadataForClass(Set, 'Set', VOID, Operation);
  initMetadataForClass(Add, 'Add', VOID, Operation);
  initMetadataForClass(CalendarData, 'CalendarData', CalendarData);
  initMetadataForClass(Field, 'Field', VOID, Enum);
  initMetadataForObject(Calendar, 'Calendar');
  initMetadataForCompanion(Companion_22);
  initMetadataForClass(KRCodecModule, 'KRCodecModule', KRCodecModule, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_23);
  initMetadataForClass(KRLogModule, 'KRLogModule', KRLogModule, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_24);
  initMetadataForClass(KRMemoryCacheModule, 'KRMemoryCacheModule', KRMemoryCacheModule, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_25);
  initMetadataForClass(KRNetworkModule, 'KRNetworkModule', KRNetworkModule, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_26);
  initMetadataForClass(KRNotifyModule, 'KRNotifyModule', KRNotifyModule, KuiklyRenderBaseModule);
  initMetadataForClass(KRCallbackWrapper, 'KRCallbackWrapper');
  initMetadataForCompanion(Companion_27);
  initMetadataForClass(PageCreateTrace, 'PageCreateTrace');
  initMetadataForCompanion(Companion_28);
  initMetadataForClass(KRPerformanceModule, 'KRPerformanceModule', VOID, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_29);
  initMetadataForClass(KRRouterModule, 'KRRouterModule', KRRouterModule, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_30);
  initMetadataForClass(KRSharedPreferencesModule, 'KRSharedPreferencesModule', KRSharedPreferencesModule, KuiklyRenderBaseModule);
  initMetadataForCompanion(Companion_31);
  initMetadataForClass(KRSnapshotModule, 'KRSnapshotModule', KRSnapshotModule, KuiklyRenderBaseModule);
  initMetadataForObject(KRCssConst, 'KRCssConst');
  initMetadataForClass(KuiklyRenderCallback, 'KuiklyRenderCallback');
  initMetadataForClass(DOMRect, 'DOMRect', DOMRect);
  initMetadataForCompanion(Companion_32);
  initMetadataForClass(KuiklyRenderLayerHandler, 'KuiklyRenderLayerHandler', KuiklyRenderLayerHandler);
  initMetadataForClass(RenderViewHandler, 'RenderViewHandler');
  initMetadataForObject(JSON_0, 'JSON');
  initMetadataForClass(JSONArray, 'JSONArray', JSONArray_init_$Create$);
  initMetadataForObject(JSONEngine, 'JSONEngine');
  initMetadataForClass(JSONException, 'JSONException', VOID, Exception);
  initMetadataForCompanion(Companion_33);
  initMetadataForClass(JSONObject, 'JSONObject', JSONObject_init_$Create$);
  initMetadataForClass(Scope, 'Scope', VOID, Enum);
  initMetadataForClass(JSONStringer, 'JSONStringer', JSONStringer);
  initMetadataForClass(JSONTokener, 'JSONTokener');
  initMetadataForClass(KRMonitor, 'KRMonitor');
  initMetadataForCompanion(Companion_34);
  initMetadataForClass(KRPerformanceData, 'KRPerformanceData');
  initMetadataForCompanion(Companion_35);
  initMetadataForClass(KRPerformanceManager, 'KRPerformanceManager');
  initMetadataForClass(KRMonitorType, 'KRMonitorType', VOID, Enum);
  initMetadataForCompanion(Companion_36);
  initMetadataForClass(KRLaunchData, 'KRLaunchData');
  initMetadataForCompanion(Companion_37);
  initMetadataForClass(KRLaunchMonitor, 'KRLaunchMonitor', KRLaunchMonitor, KRMonitor);
  initMetadataForCompanion(Companion_38);
  initMetadataForClass(KRMemoryData, 'KRMemoryData', KRMemoryData);
  initMetadataForCompanion(Companion_39);
  initMetadataForClass(KRMemoryMonitor, 'KRMemoryMonitor', KRMemoryMonitor, KRMonitor);
  initMetadataForClass(AnimationTimingFunction, 'AnimationTimingFunction', VOID, Enum);
  initMetadataForClass(AnimationOption, 'AnimationOption', AnimationOption);
  initMetadataForObject(KuiklyProcessor, 'KuiklyProcessor');
  initMetadataForObject(FontSizeToLineHeightMap, 'FontSizeToLineHeightMap');
  function scheduleTask$default(delayMs, task, $super) {
    delayMs = delayMs === VOID ? 0 : delayMs;
    var tmp;
    if ($super === VOID) {
      this.mi(delayMs, task);
      tmp = Unit_instance;
    } else {
      tmp = $super.mi.call(this, delayMs, task);
    }
    return tmp;
  }
  initMetadataForInterface(IKuiklyRenderCoreScheduler, 'IKuiklyRenderCoreScheduler');
  initMetadataForObject(KuiklyRenderCoreContextScheduler, 'KuiklyRenderCoreContextScheduler', VOID, VOID, [IKuiklyRenderCoreScheduler]);
  initMetadataForClass(KuiklyRenderCoreUIScheduler, 'KuiklyRenderCoreUIScheduler', KuiklyRenderCoreUIScheduler, VOID, [IKuiklyRenderCoreScheduler]);
  initMetadataForClass(DeviceType, 'DeviceType', VOID, Enum);
  initMetadataForObject(DeviceUtils, 'DeviceUtils');
  initMetadataForObject(Log, 'Log');
  //endregion
  function IKuiklyRenderExport() {
  }
  function _get__container__asmkon($this) {
    var tmp = $this.ee_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('_container');
    }
  }
  function registerFirstFrameLifeCycle($this) {
    if (typeof MutationObserver != 'undefined') {
      var observer = new MutationObserver(KuiklyRenderView$registerFirstFrameLifeCycle$lambda($this));
      var tmp = $this.ke();
      // Inline function 'org.w3c.dom.MutationObserverInit' call
      var attributes = undefined;
      var characterData = undefined;
      var attributeOldValue = undefined;
      var characterDataOldValue = undefined;
      var attributeFilter = undefined;
      var o = {};
      o['childList'] = true;
      o['attributes'] = attributes;
      o['characterData'] = characterData;
      o['subtree'] = false;
      o['attributeOldValue'] = attributeOldValue;
      o['characterDataOldValue'] = characterDataOldValue;
      o['attributeFilter'] = attributeFilter;
      observer.observe(tmp, o);
    }
  }
  function getOSInfo($this, userAgent) {
    var osInfo = 'Unknown OS';
    if (contains(userAgent, 'Win')) {
      osInfo = 'Windows';
      osInfo = osInfo + (contains(userAgent, 'Windows NT 10.0') ? ' 10' : contains(userAgent, 'Windows NT 6.3') ? ' 8.1' : contains(userAgent, 'Windows NT 6.2') ? ' 8' : contains(userAgent, 'Windows NT 6.1') ? ' 7' : contains(userAgent, 'Windows NT 6.0') ? ' Vista' : contains(userAgent, 'Windows NT 5.1') ? ' XP' : '');
    } else if (contains(userAgent, 'Mac')) {
      osInfo = 'MacOS';
      osInfo = osInfo + (contains(userAgent, 'Mac OS X 10_15') ? ' Catalina' : contains(userAgent, 'Mac OS X 10_14') ? ' Mojave' : contains(userAgent, 'Mac OS X 10_13') ? ' High Sierra' : '');
    } else if (contains(userAgent, 'X11'))
      osInfo = 'UNIX';
    else if (contains(userAgent, 'Linux'))
      osInfo = 'Linux';
    return osInfo;
  }
  function generateWithParams($this, params, size) {
    var tmp0_elvis_lhs = params.d1('statusBarHeight');
    var statusBarHeight = tmp0_elvis_lhs == null ? 0 : tmp0_elvis_lhs;
    // Inline function 'kotlin.collections.mutableMapOf' call
    // Inline function 'kotlin.apply' call
    var this_0 = LinkedHashMap_init_$Create$();
    this_0.k2('rootViewWidth', size.x6_1);
    this_0.k2('rootViewHeight', size.y6_1);
    var tmp0_elvis_lhs_0 = params.d1('platform');
    this_0.k2('platform', tmp0_elvis_lhs_0 == null ? 'web' : tmp0_elvis_lhs_0);
    var tmp1_elvis_lhs = params.d1('deviceWidth');
    this_0.k2('deviceWidth', tmp1_elvis_lhs == null ? kuiklyWindow.screen.width : tmp1_elvis_lhs);
    var tmp2_elvis_lhs = params.d1('deviceHeight');
    this_0.k2('deviceHeight', tmp2_elvis_lhs == null ? kuiklyWindow.screen.height : tmp2_elvis_lhs);
    this_0.k2('statusBarHeight', statusBarHeight);
    this_0.k2('osVersion', getOSInfo($this, kuiklyWindow.navigator.userAgent));
    var tmp3_elvis_lhs = params.d1('activityWidth');
    this_0.k2('activityWidth', tmp3_elvis_lhs == null ? 0 : tmp3_elvis_lhs);
    var tmp4_elvis_lhs = params.d1('activityHeight');
    this_0.k2('activityHeight', tmp4_elvis_lhs == null ? 0 : tmp4_elvis_lhs);
    this_0.k2('safeAreaInsets', toString(statusBarHeight) + ' 0 0 0');
    this_0.k2('appVersion', kuiklyWindow.navigator.appVersion);
    var tmp5_elvis_lhs = params.d1('param');
    var tmp;
    if (tmp5_elvis_lhs == null) {
      // Inline function 'kotlin.collections.mutableMapOf' call
      tmp = LinkedHashMap_init_$Create$();
    } else {
      tmp = tmp5_elvis_lhs;
    }
    this_0.k2('param', tmp);
    this_0.k2('density', kuiklyWindow.devicePixelRatio);
    return this_0;
  }
  function initRenderCore($this, pageName, params, size) {
    dispatchLifecycleStateChanged($this, 2);
    var instanceId = (new URLSearchParams(kuiklyWindow.location.search)).get('instanceId');
    var tmp = $this;
    // Inline function 'kotlin.apply' call
    var this_0 = createRenderCore($this, instanceId);
    var tmp_0 = generateWithParams($this, params, size);
    this_0.le($this, pageName, tmp_0, new KuiklyRenderView$initRenderCore$1($this));
    tmp.fe_1 = this_0;
    dispatchLifecycleStateChanged($this, 3);
  }
  function createRenderCore($this, instanceId) {
    return KuiklyRenderCore_init_$Create$(instanceId);
  }
  function initPerformanceManager($this, pageName) {
    $this.ie_1 = new KRPerformanceManager(pageName, KuiklyRenderCoreExecuteMode_JS_getInstance(), listOf([KRMonitorType_LAUNCH_getInstance(), KRMonitorType_MEMORY_getInstance()]));
    return $this.ie_1;
  }
  function dispatchLifecycleStateChanged($this, state) {
    switch (state) {
      case 0:
        var tmp = $this.he_1;
        tmp.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda);
        break;
      case 1:
        var tmp_0 = $this.he_1;
        tmp_0.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_0);
        break;
      case 2:
        var tmp_1 = $this.he_1;
        tmp_1.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_1);
        break;
      case 3:
        var tmp_2 = $this.he_1;
        tmp_2.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_2);
        break;
      case 4:
        var tmp_3 = $this.he_1;
        tmp_3.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_3);
        break;
      case 5:
        var tmp_4 = $this.he_1;
        tmp_4.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_4);
        break;
      case 6:
        var tmp_5 = $this.he_1;
        tmp_5.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_5);
        break;
      case 7:
        var tmp_6 = $this.he_1;
        tmp_6.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_6);
        break;
      case 8:
        var tmp_7 = $this.he_1;
        tmp_7.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_7);
        break;
      case 9:
        var tmp_8 = $this.he_1;
        tmp_8.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_8);
        break;
      case 10:
        var tmp_9 = $this.he_1;
        tmp_9.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_9);
        break;
      case 11:
        var tmp_10 = $this.he_1;
        tmp_10.forEach(KuiklyRenderView$dispatchLifecycleStateChanged$lambda_10);
        break;
    }
  }
  function Companion() {
    this.me_1 = 'rootViewWidth';
    this.ne_1 = 'rootViewHeight';
    this.oe_1 = 'statusBarHeight';
    this.pe_1 = 'deviceWidth';
    this.qe_1 = 'deviceHeight';
    this.re_1 = 'appVersion';
    this.se_1 = 'platform';
    this.te_1 = 'nativeBuild';
    this.ue_1 = 'safeAreaInsets';
    this.ve_1 = 'activityWidth';
    this.we_1 = 'activityHeight';
    this.xe_1 = 'osVersion';
    this.ye_1 = 'androidBottomNavBarHeight';
    this.ze_1 = 'density';
    this.af_1 = 'web';
    this.bf_1 = 'param';
    this.cf_1 = 'viewDidDisappear';
    this.df_1 = '1';
    this.ef_1 = 'viewDidAppear';
    this.ff_1 = '1';
    this.gf_1 = 'pageFirstFramePaint';
    this.hf_1 = 0;
    this.if_1 = 1;
    this.jf_1 = 2;
    this.kf_1 = 3;
    this.lf_1 = 4;
    this.mf_1 = 5;
    this.nf_1 = 6;
    this.of_1 = 7;
    this.pf_1 = 8;
    this.qf_1 = 9;
    this.rf_1 = 10;
    this.sf_1 = 11;
    this.tf_1 = 'kuikly_page_';
  }
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  function KuiklyRenderView$registerFirstFrameLifeCycle$lambda(this$0) {
    return function (mutationRecords, mutationObserver) {
      var tmp;
      // Inline function 'kotlin.collections.isNotEmpty' call
      // Inline function 'kotlin.collections.isEmpty' call
      if (!(mutationRecords.length === 0)) {
        dispatchLifecycleStateChanged(this$0, 8);
        mutationObserver.disconnect();
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KuiklyRenderView$initRenderCore$1(this$0) {
    this.uf_1 = this$0;
  }
  protoOf(KuiklyRenderView$initRenderCore$1).vf = function () {
    dispatchLifecycleStateChanged(this.uf_1, 4);
  };
  protoOf(KuiklyRenderView$initRenderCore$1).wf = function () {
    dispatchLifecycleStateChanged(this.uf_1, 5);
  };
  protoOf(KuiklyRenderView$initRenderCore$1).xf = function () {
    dispatchLifecycleStateChanged(this.uf_1, 6);
  };
  protoOf(KuiklyRenderView$initRenderCore$1).yf = function () {
    dispatchLifecycleStateChanged(this.uf_1, 7);
  };
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda(it) {
    it.zf();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_0(it) {
    it.ag();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_1(it) {
    it.bg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_2(it) {
    it.cg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_3(it) {
    it.dg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_4(it) {
    it.eg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_5(it) {
    it.xf();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_6(it) {
    it.yf();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_7(it) {
    it.fg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_8(it) {
    it.gg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_9(it) {
    it.hg();
    return Unit_instance;
  }
  function KuiklyRenderView$dispatchLifecycleStateChanged$lambda_10(it) {
    it.ig();
    return Unit_instance;
  }
  function KuiklyRenderView(executeMode, delegate) {
    executeMode = executeMode === VOID ? KuiklyRenderCoreExecuteMode_JS_getInstance() : executeMode;
    delegate = delegate === VOID ? null : delegate;
    this.ce_1 = executeMode;
    this.de_1 = delegate;
    this.fe_1 = null;
    this.ge_1 = new KuiklyRenderViewContext(this);
    this.he_1 = new Array();
    this.ie_1 = null;
    this.je_1 = new KuiklyRenderExport();
  }
  protoOf(KuiklyRenderView).ke = function () {
    return _get__container__asmkon(this);
  };
  protoOf(KuiklyRenderView).jg = function () {
    return this.ge_1;
  };
  protoOf(KuiklyRenderView).kg = function () {
    return this.je_1;
  };
  protoOf(KuiklyRenderView).lg = function (rootContainer, pageName, params, size) {
    dispatchLifecycleStateChanged(this, 0);
    initPerformanceManager(this, pageName);
    dispatchLifecycleStateChanged(this, 1);
    var tmp;
    var tmp_0;
    if (typeof rootContainer === 'string') {
      tmp_0 = true;
    } else {
      tmp_0 = isNumber(rootContainer);
    }
    if (tmp_0) {
      tmp = kuiklyDocument.getElementById(toString(rootContainer));
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = rootContainer;
    }
    var container = tmp;
    if (!(container === null)) {
      var tmp_1 = this;
      // Inline function 'kotlin.apply' call
      var this_0 = kuiklyDocument.createElement('div');
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      this_0.style.position = 'relative';
      tmp_1.ee_1 = this_0;
      container.appendChild(_get__container__asmkon(this));
      registerFirstFrameLifeCycle(this);
      initRenderCore(this, pageName, params, size);
    } else {
      Log_instance.mg(['container id: ' + toString(rootContainer) + ' is not found']);
    }
  };
  protoOf(KuiklyRenderView).ng = function () {
  };
  protoOf(KuiklyRenderView).og = function (event, data) {
    var tmp0_safe_receiver = this.fe_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.og(event, data);
    }
  };
  protoOf(KuiklyRenderView).pg = function () {
    this.og('viewDidAppear', mapOf(to('viewDidAppear', '1')));
    dispatchLifecycleStateChanged(this, 9);
  };
  protoOf(KuiklyRenderView).qg = function () {
    this.og('viewDidDisappear', mapOf(to('viewDidDisappear', '1')));
    dispatchLifecycleStateChanged(this, 10);
  };
  protoOf(KuiklyRenderView).rg = function () {
    dispatchLifecycleStateChanged(this, 11);
    var tmp0_safe_receiver = this.fe_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.rg();
    }
  };
  protoOf(KuiklyRenderView).sg = function () {
  };
  protoOf(KuiklyRenderView).tg = function (name) {
    var tmp0_safe_receiver = this.fe_1;
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.ug(name);
  };
  protoOf(KuiklyRenderView).vg = function (callback) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
    var this_0 = this.he_1;
    // Inline function 'kotlin.js.asDynamic' call
    this_0[this_0.length] = callback;
  };
  function KuiklyRenderViewContext(kuiklyRenderView) {
    this.wg_1 = kuiklyRenderView;
    this.xg_1 = new Map();
  }
  protoOf(KuiklyRenderViewContext).yg = function (ele, key) {
    var tmp0_safe_receiver = get(this.xg_1, hashCode(ele));
    var tmp = tmp0_safe_receiver == null ? null : get(tmp0_safe_receiver, key);
    return (tmp == null ? true : !(tmp == null)) ? tmp : null;
  };
  protoOf(KuiklyRenderViewContext).zg = function (ele, key, data) {
    var hashCode_0 = hashCode(ele);
    var tmp0_elvis_lhs = get(this.xg_1, hashCode_0);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.apply' call
      var this_0 = new Map();
      set(this.xg_1, hashCode_0, this_0);
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var map = tmp;
    set(map, key, data);
  };
  protoOf(KuiklyRenderViewContext).ah = function (ele, key) {
    var tmp0_safe_receiver = get(this.xg_1, hashCode(ele));
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.map.remove' call
      var value = get(tmp0_safe_receiver, key);
      tmp0_safe_receiver.delete(key);
      tmp = value;
    }
    var tmp_0 = tmp;
    return (tmp_0 == null ? true : !(tmp_0 == null)) ? tmp_0 : null;
  };
  protoOf(KuiklyRenderViewContext).tg = function (name) {
    return this.wg_1.tg(name);
  };
  function KuiklyRenderExport() {
    this.bh_1 = new Map();
    this.ch_1 = new Map();
    this.dh_1 = new Map();
    var tmp = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp.eh_1 = ArrayList_init_$Create$();
  }
  protoOf(KuiklyRenderExport).vd = function (name, creator) {
    set(this.ch_1, name, creator);
  };
  protoOf(KuiklyRenderExport).wd = function (viewName, renderViewExportCreator, shadowExportCreator) {
    set(this.bh_1, viewName, renderViewExportCreator);
    if (!(shadowExportCreator === null)) {
      set(this.dh_1, viewName, shadowExportCreator);
    }
  };
  protoOf(KuiklyRenderExport).yd = function (name) {
    var tmp0_safe_receiver = get(this.ch_1, name);
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver();
    var tmp;
    if (tmp1_elvis_lhs == null) {
      throw IllegalStateException_init_$Create$('can not find moduleName: ' + name);
    } else {
      tmp = tmp1_elvis_lhs;
    }
    return tmp;
  };
  protoOf(KuiklyRenderExport).zd = function (name) {
    var tmp0_safe_receiver = get(this.bh_1, name);
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver();
    var tmp;
    if (tmp1_elvis_lhs == null) {
      throw IllegalStateException_init_$Create$('can not find viewName: ' + name);
    } else {
      tmp = tmp1_elvis_lhs;
    }
    return tmp;
  };
  protoOf(KuiklyRenderExport).ae = function (name) {
    var tmp0_safe_receiver = get(this.dh_1, name);
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver();
    var tmp;
    if (tmp1_elvis_lhs == null) {
      throw IllegalStateException_init_$Create$('can not find shadowName: ' + name);
    } else {
      tmp = tmp1_elvis_lhs;
    }
    return tmp;
  };
  protoOf(KuiklyRenderExport).be = function (renderViewExport, propKey, propValue) {
    var _iterator__ex2g4s = this.eh_1.f();
    while (_iterator__ex2g4s.g()) {
      var handler = _iterator__ex2g4s.h();
      if (handler.be(renderViewExport, propKey, propValue)) {
        return true;
      }
    }
    return false;
  };
  function TextPostProcessorInput(processor, sourceText, textProps) {
    this.fh_1 = processor;
    this.gh_1 = sourceText;
    this.hh_1 = textProps;
  }
  function KuiklyRenderAdapterManager() {
    this.ih_1 = null;
    this.jh_1 = null;
    this.kh_1 = null;
  }
  var KuiklyRenderAdapterManager_instance;
  function KuiklyRenderAdapterManager_getInstance() {
    return KuiklyRenderAdapterManager_instance;
  }
  function FastMutableList$listIterator$1($index, this$0) {
    this.mh_1 = this$0;
    this.lh_1 = $index;
  }
  protoOf(FastMutableList$listIterator$1).g = function () {
    return this.lh_1 < this.mh_1.i();
  };
  protoOf(FastMutableList$listIterator$1).h = function () {
    if (!this.g()) {
      throw NoSuchElementException_init_$Create$();
    }
    var tmp = this.mh_1.nh_1;
    var _unary__edvuaz = this.lh_1;
    this.lh_1 = _unary__edvuaz + 1 | 0;
    // Inline function 'kotlin.js.unsafeCast' call
    return tmp[_unary__edvuaz];
  };
  protoOf(FastMutableList$listIterator$1).o2 = function () {
    if (this.lh_1 === 0) {
      throw IllegalArgumentException_init_$Create$('delete index 0 is invalid');
    }
    this.lh_1 = this.lh_1 - 1 | 0;
    this.mh_1.t2(this.lh_1);
  };
  function FastMutableList(list) {
    this.nh_1 = list;
  }
  protoOf(FastMutableList).i = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nh_1.length;
  };
  protoOf(FastMutableList).b3 = function () {
    this.nh_1.length = 0;
  };
  protoOf(FastMutableList).d = function (element) {
    this.nh_1[this.nh_1.length] = element;
    return true;
  };
  protoOf(FastMutableList).j = function (index) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nh_1[index];
  };
  protoOf(FastMutableList).k = function () {
    return this.nh_1.length === 0;
  };
  protoOf(FastMutableList).f = function () {
    return this.hd();
  };
  protoOf(FastMutableList).hd = function () {
    return this.d3(0);
  };
  protoOf(FastMutableList).d3 = function (index) {
    return new FastMutableList$listIterator$1(index, this);
  };
  protoOf(FastMutableList).t2 = function (index) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nh_1.splice(index, 1)[0];
  };
  protoOf(FastMutableList).x = function (element) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.nh_1.indexOf(element);
  };
  protoOf(FastMutableList).w = function (element) {
    return !(this.x(element) === -1);
  };
  function FastMutableMap$entries$1($key, this$0) {
    this.ph_1 = $key;
    this.qh_1 = this$0;
    this.oh_1 = $key;
  }
  protoOf(FastMutableMap$entries$1).z = function () {
    return this.oh_1;
  };
  protoOf(FastMutableMap$entries$1).a1 = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.qh_1.rh_1[toString_0(this.ph_1)];
  };
  function FastMutableMap(map) {
    this.rh_1 = map;
  }
  protoOf(FastMutableMap).g1 = function () {
    // Inline function 'kotlin.collections.map' call
    var this_0 = this.e1();
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s = this_0.f();
    while (_iterator__ex2g4s.g()) {
      var item = _iterator__ex2g4s.h();
      var tmp$ret$0 = new FastMutableMap$entries$1(item, this);
      destination.d(tmp$ret$0);
    }
    return toHashSet(destination);
  };
  protoOf(FastMutableMap).e1 = function () {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.getObjectKeys' call
    var v = this.rh_1;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$3 = Object.keys(v);
    return toHashSet_0(tmp$ret$3);
  };
  protoOf(FastMutableMap).i = function () {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.getObjectKeys' call
    var v = this.rh_1;
    // Inline function 'kotlin.js.unsafeCast' call
    return Object.keys(v).length;
  };
  protoOf(FastMutableMap).f1 = function () {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.getObjectValue' call
    var v = this.rh_1;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$3 = Object.values(v);
    return toMutableList(tmp$ret$3);
  };
  protoOf(FastMutableMap).k = function () {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.getObjectKeys' call
    var v = this.rh_1;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.collections.isEmpty' call
    return Object.keys(v).length === 0;
  };
  protoOf(FastMutableMap).m3 = function (key) {
    var value = this.rh_1[key];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.deleteObjectValueWithKey' call
    delete this.rh_1[key];
    // Inline function 'kotlin.js.unsafeCast' call
    return value;
  };
  protoOf(FastMutableMap).n5 = function (from) {
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = from.g1().f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      // Inline function 'kotlin.collections.component1' call
      var key = element.z();
      // Inline function 'kotlin.collections.component2' call
      var value = element.a1();
      this.k2(key, value);
    }
  };
  protoOf(FastMutableMap).k2 = function (key, value) {
    this.rh_1[key] = value;
    return value;
  };
  protoOf(FastMutableMap).d1 = function (key) {
    // Inline function 'kotlin.js.unsafeCast' call
    return this.rh_1[key];
  };
  protoOf(FastMutableMap).c1 = function (value) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.getObjectValue' call
    var v = this.rh_1;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$1 = Object.values(v);
    return contains_0(tmp$ret$1, value);
  };
  protoOf(FastMutableMap).b1 = function (key) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.getObjectKeys' call
    var v = this.rh_1;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$1 = Object.keys(v);
    return contains_0(tmp$ret$1, toString_0(key));
  };
  function fastMutableMapOf() {
    return new FastMutableMap({});
  }
  function get(_this__u8e3s4, key) {
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    return _this__u8e3s4.get(key);
  }
  function set(_this__u8e3s4, key, value) {
    // Inline function 'kotlin.js.asDynamic' call
    return _this__u8e3s4.set(key, value);
  }
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodUnknown_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateRenderView_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveRenderView_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodInsertSubRenderView_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetViewProp_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetRenderViewFrame_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallViewMethod_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_instance;
  var KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_instance;
  function Companion_0() {
  }
  protoOf(Companion_0).sh = function (value) {
    var tmp0 = values();
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var inductionVariable = 0;
      var last = tmp0.length;
      while (inductionVariable < last) {
        var element = tmp0[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (element.i1_1 === value) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp0_elvis_lhs = tmp$ret$1;
    return tmp0_elvis_lhs == null ? KuiklyRenderNativeMethod_KuiklyRenderNativeMethodUnknown_getInstance() : tmp0_elvis_lhs;
  };
  var Companion_instance_0;
  function Companion_getInstance_0() {
    return Companion_instance_0;
  }
  function values() {
    return [KuiklyRenderNativeMethod_KuiklyRenderNativeMethodUnknown_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateRenderView_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveRenderView_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodInsertSubRenderView_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetViewProp_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetRenderViewFrame_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallViewMethod_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_getInstance(), KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_getInstance()];
  }
  var KuiklyRenderNativeMethod_entriesInitialized;
  function KuiklyRenderNativeMethod_initEntries() {
    if (KuiklyRenderNativeMethod_entriesInitialized)
      return Unit_instance;
    KuiklyRenderNativeMethod_entriesInitialized = true;
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodUnknown_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodUnknown', 0, KuiklyRenderNativeMethodIndex_Unknown_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateRenderView_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodCreateRenderView', 1, KuiklyRenderNativeMethodIndex_CreateRenderView_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveRenderView_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodRemoveRenderView', 2, KuiklyRenderNativeMethodIndex_RemoveRenderView_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodInsertSubRenderView_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodInsertSubRenderView', 3, KuiklyRenderNativeMethodIndex_InsertSubRenderView_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetViewProp_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodSetViewProp', 4, KuiklyRenderNativeMethodIndex_SetViewProp_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetRenderViewFrame_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodSetRenderViewFrame', 5, KuiklyRenderNativeMethodIndex_SetRenderViewFrame_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodCalculateRenderViewSize', 6, KuiklyRenderNativeMethodIndex_CalculateRenderViewSize_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallViewMethod_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodCallViewMethod', 7, KuiklyRenderNativeMethodIndex_CallViewMethod_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodCallModuleMethod', 8, KuiklyRenderNativeMethodIndex_CallModuleMethod_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodCreateShadow', 9, KuiklyRenderNativeMethodIndex_CreateShadow_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodRemoveShadow', 10, KuiklyRenderNativeMethodIndex_RemoveShadow_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodSetShadowProp', 11, KuiklyRenderNativeMethodIndex_SetShadowProp_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodSetShadowForView', 12, KuiklyRenderNativeMethodIndex_SetShadowForView_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodSetTimeout', 13, KuiklyRenderNativeMethodIndex_SetTimeout_getInstance().i1_1);
    KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_instance = new KuiklyRenderNativeMethod('KuiklyRenderNativeMethodCallShadowMethod', 14, KuiklyRenderNativeMethodIndex_CallShadowMethod_getInstance().i1_1);
  }
  function KuiklyRenderNativeMethod(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.vh_1 = value;
  }
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodUnknown_instance;
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodCreateInstance_instance;
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodUpdateInstance_instance;
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodDestroyInstance_instance;
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_instance;
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodFireViewEvent_instance;
  var KuiklyRenderContextMethod_KuiklyRenderContextMethodLayoutView_instance;
  var KuiklyRenderContextMethod_entriesInitialized;
  function KuiklyRenderContextMethod_initEntries() {
    if (KuiklyRenderContextMethod_entriesInitialized)
      return Unit_instance;
    KuiklyRenderContextMethod_entriesInitialized = true;
    KuiklyRenderContextMethod_KuiklyRenderContextMethodUnknown_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodUnknown', 0, KuiklyRenderContextMethodIndex_Unknown_getInstance().i1_1);
    KuiklyRenderContextMethod_KuiklyRenderContextMethodCreateInstance_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodCreateInstance', 1, KuiklyRenderContextMethodIndex_CreateInstance_getInstance().i1_1);
    KuiklyRenderContextMethod_KuiklyRenderContextMethodUpdateInstance_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodUpdateInstance', 2, KuiklyRenderContextMethodIndex_UpdateInstance_getInstance().i1_1);
    KuiklyRenderContextMethod_KuiklyRenderContextMethodDestroyInstance_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodDestroyInstance', 3, KuiklyRenderContextMethodIndex_DestroyInstance_getInstance().i1_1);
    KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodFireCallback', 4, KuiklyRenderContextMethodIndex_FireCallback_getInstance().i1_1);
    KuiklyRenderContextMethod_KuiklyRenderContextMethodFireViewEvent_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodFireViewEvent', 5, KuiklyRenderContextMethodIndex_FireViewEvent_getInstance().i1_1);
    KuiklyRenderContextMethod_KuiklyRenderContextMethodLayoutView_instance = new KuiklyRenderContextMethod('KuiklyRenderContextMethodLayoutView', 6, KuiklyRenderContextMethodIndex_LayoutView_getInstance().i1_1);
  }
  function KuiklyRenderContextMethod(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  var KuiklyRenderNativeMethodIndex_Unknown_instance;
  var KuiklyRenderNativeMethodIndex_CreateRenderView_instance;
  var KuiklyRenderNativeMethodIndex_RemoveRenderView_instance;
  var KuiklyRenderNativeMethodIndex_InsertSubRenderView_instance;
  var KuiklyRenderNativeMethodIndex_SetViewProp_instance;
  var KuiklyRenderNativeMethodIndex_SetRenderViewFrame_instance;
  var KuiklyRenderNativeMethodIndex_CalculateRenderViewSize_instance;
  var KuiklyRenderNativeMethodIndex_CallViewMethod_instance;
  var KuiklyRenderNativeMethodIndex_CallModuleMethod_instance;
  var KuiklyRenderNativeMethodIndex_CreateShadow_instance;
  var KuiklyRenderNativeMethodIndex_RemoveShadow_instance;
  var KuiklyRenderNativeMethodIndex_SetShadowProp_instance;
  var KuiklyRenderNativeMethodIndex_SetShadowForView_instance;
  var KuiklyRenderNativeMethodIndex_SetTimeout_instance;
  var KuiklyRenderNativeMethodIndex_CallShadowMethod_instance;
  var KuiklyRenderNativeMethodIndex_entriesInitialized;
  function KuiklyRenderNativeMethodIndex_initEntries() {
    if (KuiklyRenderNativeMethodIndex_entriesInitialized)
      return Unit_instance;
    KuiklyRenderNativeMethodIndex_entriesInitialized = true;
    KuiklyRenderNativeMethodIndex_Unknown_instance = new KuiklyRenderNativeMethodIndex('Unknown', 0);
    KuiklyRenderNativeMethodIndex_CreateRenderView_instance = new KuiklyRenderNativeMethodIndex('CreateRenderView', 1);
    KuiklyRenderNativeMethodIndex_RemoveRenderView_instance = new KuiklyRenderNativeMethodIndex('RemoveRenderView', 2);
    KuiklyRenderNativeMethodIndex_InsertSubRenderView_instance = new KuiklyRenderNativeMethodIndex('InsertSubRenderView', 3);
    KuiklyRenderNativeMethodIndex_SetViewProp_instance = new KuiklyRenderNativeMethodIndex('SetViewProp', 4);
    KuiklyRenderNativeMethodIndex_SetRenderViewFrame_instance = new KuiklyRenderNativeMethodIndex('SetRenderViewFrame', 5);
    KuiklyRenderNativeMethodIndex_CalculateRenderViewSize_instance = new KuiklyRenderNativeMethodIndex('CalculateRenderViewSize', 6);
    KuiklyRenderNativeMethodIndex_CallViewMethod_instance = new KuiklyRenderNativeMethodIndex('CallViewMethod', 7);
    KuiklyRenderNativeMethodIndex_CallModuleMethod_instance = new KuiklyRenderNativeMethodIndex('CallModuleMethod', 8);
    KuiklyRenderNativeMethodIndex_CreateShadow_instance = new KuiklyRenderNativeMethodIndex('CreateShadow', 9);
    KuiklyRenderNativeMethodIndex_RemoveShadow_instance = new KuiklyRenderNativeMethodIndex('RemoveShadow', 10);
    KuiklyRenderNativeMethodIndex_SetShadowProp_instance = new KuiklyRenderNativeMethodIndex('SetShadowProp', 11);
    KuiklyRenderNativeMethodIndex_SetShadowForView_instance = new KuiklyRenderNativeMethodIndex('SetShadowForView', 12);
    KuiklyRenderNativeMethodIndex_SetTimeout_instance = new KuiklyRenderNativeMethodIndex('SetTimeout', 13);
    KuiklyRenderNativeMethodIndex_CallShadowMethod_instance = new KuiklyRenderNativeMethodIndex('CallShadowMethod', 14);
  }
  function KuiklyRenderNativeMethodIndex(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  var KuiklyRenderContextMethodIndex_Unknown_instance;
  var KuiklyRenderContextMethodIndex_CreateInstance_instance;
  var KuiklyRenderContextMethodIndex_UpdateInstance_instance;
  var KuiklyRenderContextMethodIndex_DestroyInstance_instance;
  var KuiklyRenderContextMethodIndex_FireCallback_instance;
  var KuiklyRenderContextMethodIndex_FireViewEvent_instance;
  var KuiklyRenderContextMethodIndex_LayoutView_instance;
  var KuiklyRenderContextMethodIndex_entriesInitialized;
  function KuiklyRenderContextMethodIndex_initEntries() {
    if (KuiklyRenderContextMethodIndex_entriesInitialized)
      return Unit_instance;
    KuiklyRenderContextMethodIndex_entriesInitialized = true;
    KuiklyRenderContextMethodIndex_Unknown_instance = new KuiklyRenderContextMethodIndex('Unknown', 0);
    KuiklyRenderContextMethodIndex_CreateInstance_instance = new KuiklyRenderContextMethodIndex('CreateInstance', 1);
    KuiklyRenderContextMethodIndex_UpdateInstance_instance = new KuiklyRenderContextMethodIndex('UpdateInstance', 2);
    KuiklyRenderContextMethodIndex_DestroyInstance_instance = new KuiklyRenderContextMethodIndex('DestroyInstance', 3);
    KuiklyRenderContextMethodIndex_FireCallback_instance = new KuiklyRenderContextMethodIndex('FireCallback', 4);
    KuiklyRenderContextMethodIndex_FireViewEvent_instance = new KuiklyRenderContextMethodIndex('FireViewEvent', 5);
    KuiklyRenderContextMethodIndex_LayoutView_instance = new KuiklyRenderContextMethodIndex('LayoutView', 6);
  }
  function KuiklyRenderContextMethodIndex(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodUnknown_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodUnknown_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateRenderView_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateRenderView_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveRenderView_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveRenderView_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodInsertSubRenderView_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodInsertSubRenderView_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetViewProp_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetViewProp_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetRenderViewFrame_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetRenderViewFrame_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallViewMethod_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallViewMethod_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_instance;
  }
  function KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_getInstance() {
    KuiklyRenderNativeMethod_initEntries();
    return KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_instance;
  }
  function KuiklyRenderContextMethod_KuiklyRenderContextMethodCreateInstance_getInstance() {
    KuiklyRenderContextMethod_initEntries();
    return KuiklyRenderContextMethod_KuiklyRenderContextMethodCreateInstance_instance;
  }
  function KuiklyRenderContextMethod_KuiklyRenderContextMethodUpdateInstance_getInstance() {
    KuiklyRenderContextMethod_initEntries();
    return KuiklyRenderContextMethod_KuiklyRenderContextMethodUpdateInstance_instance;
  }
  function KuiklyRenderContextMethod_KuiklyRenderContextMethodDestroyInstance_getInstance() {
    KuiklyRenderContextMethod_initEntries();
    return KuiklyRenderContextMethod_KuiklyRenderContextMethodDestroyInstance_instance;
  }
  function KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_getInstance() {
    KuiklyRenderContextMethod_initEntries();
    return KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_instance;
  }
  function KuiklyRenderContextMethod_KuiklyRenderContextMethodFireViewEvent_getInstance() {
    KuiklyRenderContextMethod_initEntries();
    return KuiklyRenderContextMethod_KuiklyRenderContextMethodFireViewEvent_instance;
  }
  function KuiklyRenderContextMethod_KuiklyRenderContextMethodLayoutView_getInstance() {
    KuiklyRenderContextMethod_initEntries();
    return KuiklyRenderContextMethod_KuiklyRenderContextMethodLayoutView_instance;
  }
  function KuiklyRenderNativeMethodIndex_Unknown_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_Unknown_instance;
  }
  function KuiklyRenderNativeMethodIndex_CreateRenderView_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_CreateRenderView_instance;
  }
  function KuiklyRenderNativeMethodIndex_RemoveRenderView_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_RemoveRenderView_instance;
  }
  function KuiklyRenderNativeMethodIndex_InsertSubRenderView_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_InsertSubRenderView_instance;
  }
  function KuiklyRenderNativeMethodIndex_SetViewProp_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_SetViewProp_instance;
  }
  function KuiklyRenderNativeMethodIndex_SetRenderViewFrame_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_SetRenderViewFrame_instance;
  }
  function KuiklyRenderNativeMethodIndex_CalculateRenderViewSize_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_CalculateRenderViewSize_instance;
  }
  function KuiklyRenderNativeMethodIndex_CallViewMethod_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_CallViewMethod_instance;
  }
  function KuiklyRenderNativeMethodIndex_CallModuleMethod_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_CallModuleMethod_instance;
  }
  function KuiklyRenderNativeMethodIndex_CreateShadow_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_CreateShadow_instance;
  }
  function KuiklyRenderNativeMethodIndex_RemoveShadow_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_RemoveShadow_instance;
  }
  function KuiklyRenderNativeMethodIndex_SetShadowProp_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_SetShadowProp_instance;
  }
  function KuiklyRenderNativeMethodIndex_SetShadowForView_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_SetShadowForView_instance;
  }
  function KuiklyRenderNativeMethodIndex_SetTimeout_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_SetTimeout_instance;
  }
  function KuiklyRenderNativeMethodIndex_CallShadowMethod_getInstance() {
    KuiklyRenderNativeMethodIndex_initEntries();
    return KuiklyRenderNativeMethodIndex_CallShadowMethod_instance;
  }
  function KuiklyRenderContextMethodIndex_Unknown_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_Unknown_instance;
  }
  function KuiklyRenderContextMethodIndex_CreateInstance_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_CreateInstance_instance;
  }
  function KuiklyRenderContextMethodIndex_UpdateInstance_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_UpdateInstance_instance;
  }
  function KuiklyRenderContextMethodIndex_DestroyInstance_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_DestroyInstance_instance;
  }
  function KuiklyRenderContextMethodIndex_FireCallback_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_FireCallback_instance;
  }
  function KuiklyRenderContextMethodIndex_FireViewEvent_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_FireViewEvent_instance;
  }
  function KuiklyRenderContextMethodIndex_LayoutView_getInstance() {
    KuiklyRenderContextMethodIndex_initEntries();
    return KuiklyRenderContextMethodIndex_LayoutView_instance;
  }
  function Companion_1() {
    this.wh_1 = 6;
    this.xh_1 = 'callNative';
    this.yh_1 = 'callKotlinMethod';
  }
  var Companion_instance_1;
  function Companion_getInstance_1() {
    return Companion_instance_1;
  }
  function KuiklyRenderContextHandler$callNative$ref($boundThis) {
    var l = function (p0, p1, p2, p3, p4, p5, p6) {
      return $boundThis.callNative(p0, p1, p2, p3, p4, p5, p6);
    };
    l.callableName = 'callNative';
    return l;
  }
  function KuiklyRenderContextHandler$call$lambda($argsList) {
    return function (arg) {
      var tmp;
      if (!(arg == null) ? isInterface(arg, KtMap) : false) {
        var tmp1 = $argsList._v;
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
        var element = toJSONObject(arg).toString();
        // Inline function 'kotlin.js.asDynamic' call
        tmp1[tmp1.length] = element;
        tmp = Unit_instance;
      } else {
        if (!(arg == null) ? isInterface(arg, KtList) : false) {
          var tmp4 = $argsList._v;
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
          var element_0 = toJSONArray(arg).toString();
          // Inline function 'kotlin.js.asDynamic' call
          tmp4[tmp4.length] = element_0;
          tmp = Unit_instance;
        } else {
          if (arg instanceof JSONObject) {
            var tmp6 = $argsList._v;
            // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
            var element_1 = arg.toString();
            // Inline function 'kotlin.js.asDynamic' call
            tmp6[tmp6.length] = element_1;
            tmp = Unit_instance;
          } else {
            if (arg instanceof JSONArray) {
              var tmp8 = $argsList._v;
              // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
              var element_2 = arg.toString();
              // Inline function 'kotlin.js.asDynamic' call
              tmp8[tmp8.length] = element_2;
              tmp = Unit_instance;
            } else {
              // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
              var this_0 = $argsList._v;
              // Inline function 'kotlin.js.asDynamic' call
              this_0[this_0.length] = arg;
              tmp = Unit_instance;
            }
          }
        }
      }
      return Unit_instance;
    };
  }
  function KuiklyRenderContextHandler() {
    this.zh_1 = null;
  }
  protoOf(KuiklyRenderContextHandler).ai = function (url, pageId) {
    try {
      // Inline function 'kotlin.js.asDynamic' call
      kuiklyWindow.com.tencent.kuikly.core.nvi.registerCallNative(pageId, KuiklyRenderContextHandler$callNative$ref(this));
    } catch ($p) {
      var e = $p;
      Log_instance.mg(['registerCallNative error, reason is: ' + e]);
    }
  };
  protoOf(KuiklyRenderContextHandler).rg = function () {
  };
  protoOf(KuiklyRenderContextHandler).bi = function (method, args) {
    var argsList = {_v: new Array()};
    args.forEach(KuiklyRenderContextHandler$call$lambda(argsList));
    var tmp;
    if (argsList._v.length >= 6) {
      tmp = argsList._v.slice(0, 6);
    } else {
      var appendArgCount = 6 - argsList._v.length | 0;
      var inductionVariable = 0;
      if (inductionVariable < appendArgCount)
        do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
          var this_0 = argsList._v;
          // Inline function 'kotlin.js.asDynamic' call
          this_0[this_0.length] = null;
        }
         while (inductionVariable < appendArgCount);
      tmp = argsList._v;
    }
    argsList._v = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$2 = kuiklyWindow;
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.firstArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_0 = argsList._v[0];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_1 = argsList._v[1];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_2 = argsList._v[2];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_3 = argsList._v[3];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fifthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_4 = argsList._v[4];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.sixthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$20 = argsList._v[5];
    tmp$ret$2['callKotlinMethod'](method.i1_1, tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp$ret$20);
  };
  protoOf(KuiklyRenderContextHandler).ci = function (callback) {
    this.zh_1 = callback;
  };
  protoOf(KuiklyRenderContextHandler).callNative = function (methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
    var tmp0_safe_receiver = this.zh_1;
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver(Companion_instance_0.sh(methodId), new (Function.bind.apply(Array, [null, arg0, arg1, arg2, arg3, arg4, arg5]))());
  };
  var KuiklyRenderCoreExecuteMode_JVM_instance;
  var KuiklyRenderCoreExecuteMode_JS_instance;
  var KuiklyRenderCoreExecuteMode_DEX_instance;
  var KuiklyRenderCoreExecuteMode_SO_instance;
  var KuiklyRenderCoreExecuteMode_entriesInitialized;
  function KuiklyRenderCoreExecuteMode_initEntries() {
    if (KuiklyRenderCoreExecuteMode_entriesInitialized)
      return Unit_instance;
    KuiklyRenderCoreExecuteMode_entriesInitialized = true;
    KuiklyRenderCoreExecuteMode_JVM_instance = new KuiklyRenderCoreExecuteMode('JVM', 0, 0);
    KuiklyRenderCoreExecuteMode_JS_instance = new KuiklyRenderCoreExecuteMode('JS', 1, 2);
    KuiklyRenderCoreExecuteMode_DEX_instance = new KuiklyRenderCoreExecuteMode('DEX', 2, 3);
    KuiklyRenderCoreExecuteMode_SO_instance = new KuiklyRenderCoreExecuteMode('SO', 3, 4);
  }
  function KuiklyRenderCoreExecuteMode(name, ordinal, mode) {
    Enum.call(this, name, ordinal);
    this.fi_1 = mode;
  }
  function KuiklyRenderCoreExecuteMode_JS_getInstance() {
    KuiklyRenderCoreExecuteMode_initEntries();
    return KuiklyRenderCoreExecuteMode_JS_instance;
  }
  function KuiklyRenderCore_init_$Init$(customInstanceId, $this) {
    customInstanceId = customInstanceId === VOID ? null : customInstanceId;
    KuiklyRenderCore.call($this);
    var tmp = $this;
    var tmp_0;
    if (customInstanceId == null) {
      var _unary__edvuaz = Companion_getInstance_2().gi_1;
      Companion_getInstance_2().gi_1 = _unary__edvuaz.u1();
      tmp_0 = _unary__edvuaz.toString();
    } else {
      tmp_0 = customInstanceId;
    }
    tmp.hi_1 = tmp_0;
    return $this;
  }
  function KuiklyRenderCore_init_$Create$(customInstanceId) {
    return KuiklyRenderCore_init_$Init$(customInstanceId, objectCreate(protoOf(KuiklyRenderCore)));
  }
  function performOnContextQueue($this, delayMs, task) {
    KuiklyRenderCoreContextScheduler_instance.mi(numberToInt(delayMs), task);
  }
  function performOnContextQueue$default($this, delayMs, task, $super) {
    delayMs = delayMs === VOID ? 0.0 : delayMs;
    return performOnContextQueue($this, delayMs, task);
  }
  function isSyncMethodCall($this, method, args) {
    if (method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_getInstance())) {
      var tmp;
      if (args.length >= 6) {
        // Inline function 'com.tencent.kuikly.core.render.web.collection.array.get' call
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp0_elvis_lhs = args[5];
        tmp = tmp0_elvis_lhs == null ? 0 : tmp0_elvis_lhs;
      } else {
        tmp = 0;
      }
      var fifthArg = tmp;
      return fifthArg === 1;
    }
    return method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_getInstance()) || method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_getInstance()) || method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_getInstance()) || method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_getInstance()) || method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_getInstance()) || method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_getInstance()) || method.equals(KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_getInstance());
  }
  function performNativeMethodWithMethod($this, method, args) {
    if (KuiklyProcessor_instance.ti_1) {
      Log_instance.ni(['callNative: ' + method.toString() + ', ' + JSON.stringify(args)]);
    }
    var cb = get($this.ki_1, method.vh_1);
    if (cb == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      if (isSyncMethodCall($this, method, args)) {
        return cb(method, args);
      } else {
        var tmp0_safe_receiver = $this.ji_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.ui(VOID, KuiklyRenderCore$performNativeMethodWithMethod$lambda(cb, method, args));
        }
      }
    }
    return null;
  }
  function initContextHandler($this, url, params, contextInitCallback) {
    // Inline function 'kotlin.apply' call
    var this_0 = $this.li_1;
    this_0.ci(KuiklyRenderCore$initContextHandler$lambda($this));
    contextInitCallback.vf();
    this_0.ai(url, $this.hi_1);
    contextInitCallback.wf();
    contextInitCallback.xf();
    this_0.bi(KuiklyRenderContextMethod_KuiklyRenderContextMethodCreateInstance_getInstance(), new (Function.bind.apply(Array, [null, $this.hi_1, url, params]))());
    contextInitCallback.yf();
  }
  function createRenderView($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$9 = args[2];
      tmp0_safe_receiver.vi(tmp_0, tmp$ret$9);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function removeRenderView($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$4 = args[1];
      tmp0_safe_receiver.wi(tmp$ret$4);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function insertSubRenderView($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_1 = args[2];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$14 = args[3];
      tmp0_safe_receiver.xi(tmp_0, tmp_1, tmp$ret$14);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function isEvent($this, args) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fifthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$2 = args[4];
    return equals(tmp$ret$2, 1);
  }
  function setViewProp($this, method, args) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var propValue = args[3];
    if (isEvent($this, args)) {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tag = args[1];
      propValue = new KuiklyRenderCallback(KuiklyRenderCore$setViewProp$lambda($this, tag, args));
    }
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$17 = args[2];
      tmp0_safe_receiver.yi(tmp_0, tmp$ret$17, propValue);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function setRenderViewFrame($this, method, args) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = args[2];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_0 = args[3];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fifthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_1 = args[4];
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.sixthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$19 = args[5];
    var frame = new DOMRect(tmp, tmp_0, tmp_1, tmp$ret$19);
    var tmp0_safe_receiver = $this.ii_1;
    var tmp_2;
    if (tmp0_safe_receiver == null) {
      tmp_2 = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$24 = args[1];
      tmp0_safe_receiver.zi(tmp$ret$24, frame);
      tmp_2 = Unit_instance;
    }
    return tmp_2;
  }
  function calculateRenderViewSize($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_1 = args[2];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$14 = args[3];
      tmp = tmp0_safe_receiver.aj(tmp_0, new Pair(tmp_1, tmp$ret$14));
    }
    var size = tmp;
    var tmp_2;
    if (!(size == null)) {
      var tmp_3;
      try {
        // Inline function 'kotlin.text.toFloat' call
        var this_0 = get_width(size).toString();
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'kotlin.let' call
        var it = toDouble(this_0).toString();
        tmp_3 = contains(it, '.') ? it : it + '.00';
      } catch ($p) {
        var tmp_4;
        if ($p instanceof Exception) {
          var e = $p;
          tmp_4 = '0.00';
        } else {
          throw $p;
        }
        tmp_3 = tmp_4;
      }
      tmp_2 = tmp_3;
    } else {
      tmp_2 = '0.00';
    }
    var width = tmp_2;
    var tmp_5;
    if (!(size == null)) {
      var tmp_6;
      try {
        // Inline function 'kotlin.text.toFloat' call
        var this_1 = get_height(size).toString();
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'kotlin.let' call
        var it_0 = toDouble(this_1).toString();
        tmp_6 = contains(it_0, '.') ? it_0 : it_0 + '.00';
      } catch ($p) {
        var tmp_7;
        if ($p instanceof Exception) {
          var e_0 = $p;
          tmp_7 = '0.00';
        } else {
          throw $p;
        }
        tmp_6 = tmp_7;
      }
      tmp_5 = tmp_6;
    } else {
      tmp_5 = '0.00';
    }
    var height = tmp_5;
    return width + '|' + height;
  }
  function callViewMethod($this, method, args) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fifthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var callbackId = args[4];
    var tmp;
    var tmp_0;
    if (callbackId == null) {
      tmp_0 = null;
    } else {
      // Inline function 'kotlin.text.isNotEmpty' call
      tmp_0 = charSequenceLength(callbackId) > 0;
    }
    if (tmp_0 === true) {
      tmp = new KuiklyRenderCallback(KuiklyRenderCore$callViewMethod$lambda($this, callbackId));
    } else {
      tmp = null;
    }
    var callback = tmp;
    var tmp1_safe_receiver = $this.ii_1;
    var tmp_1;
    if (tmp1_safe_receiver == null) {
      tmp_1 = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_2 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_3 = args[2];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$20 = args[3];
      tmp1_safe_receiver.bj(tmp_2, tmp_3, tmp$ret$20, callback);
      tmp_1 = Unit_instance;
    }
    return tmp_1;
  }
  function callShadowMethod($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_1 = args[2];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$14 = args[3];
      tmp = tmp0_safe_receiver.cj(tmp_0, tmp_1, tmp$ret$14);
    }
    return tmp;
  }
  function callModuleMethod($this, method, args) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fifthArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var callbackId = args[4];
    var tmp;
    var tmp_0;
    if (callbackId == null) {
      tmp_0 = null;
    } else {
      // Inline function 'kotlin.text.isNotEmpty' call
      tmp_0 = charSequenceLength(callbackId) > 0;
    }
    if (tmp_0 === true) {
      tmp = new KuiklyRenderCallback(KuiklyRenderCore$callModuleMethod$lambda($this, callbackId));
    } else {
      tmp = null;
    }
    var callback = tmp;
    var tmp1_safe_receiver = $this.ii_1;
    var tmp_1;
    if (tmp1_safe_receiver == null) {
      tmp_1 = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_2 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_3 = args[2];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$18 = args[3];
      tmp_1 = tmp1_safe_receiver.dj(tmp_2, tmp_3, tmp$ret$18, callback);
    }
    return tmp_1;
  }
  function createShadow($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$9 = args[2];
      tmp0_safe_receiver.ej(tmp_0, tmp$ret$9);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function removeShadow($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$4 = args[1];
      tmp0_safe_receiver.fj(tmp$ret$4);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function setShadowProp($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = args[1];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_1 = args[2];
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.fourthArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$14 = args[3];
      tmp0_safe_receiver.gj(tmp_0, tmp_1, tmp$ret$14);
      tmp = Unit_instance;
    }
    return tmp;
  }
  function setShadow_0($this, method, args) {
    var tmp0_safe_receiver = $this.ii_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$4 = args[1];
      tmp = tmp0_safe_receiver.hj(tmp$ret$4);
    }
    var tmp1_elvis_lhs = tmp;
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      return null;
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var shadow = tmp_0;
    var tmp2_safe_receiver = $this.ji_1;
    if (tmp2_safe_receiver == null)
      null;
    else {
      tmp2_safe_receiver.ui(VOID, KuiklyRenderCore$setShadow$lambda($this, args, shadow));
    }
    return null;
  }
  function setTimeout($this, method, args) {
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = args[1];
    performOnContextQueue($this, tmp, KuiklyRenderCore$setTimeout$lambda($this, args));
    return null;
  }
  function initNativeMethodRegisters($this) {
    var tmp = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateRenderView_getInstance().vh_1;
    set($this.ki_1, tmp, KuiklyRenderCore$createRenderView$ref($this));
    var tmp_0 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveRenderView_getInstance().vh_1;
    set($this.ki_1, tmp_0, KuiklyRenderCore$removeRenderView$ref($this));
    var tmp_1 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodInsertSubRenderView_getInstance().vh_1;
    set($this.ki_1, tmp_1, KuiklyRenderCore$insertSubRenderView$ref($this));
    var tmp_2 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetViewProp_getInstance().vh_1;
    set($this.ki_1, tmp_2, KuiklyRenderCore$setViewProp$ref($this));
    var tmp_3 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetRenderViewFrame_getInstance().vh_1;
    set($this.ki_1, tmp_3, KuiklyRenderCore$setRenderViewFrame$ref($this));
    var tmp_4 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCalculateRenderViewSize_getInstance().vh_1;
    set($this.ki_1, tmp_4, KuiklyRenderCore$calculateRenderViewSize$ref($this));
    var tmp_5 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallViewMethod_getInstance().vh_1;
    set($this.ki_1, tmp_5, KuiklyRenderCore$callViewMethod$ref($this));
    var tmp_6 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallModuleMethod_getInstance().vh_1;
    set($this.ki_1, tmp_6, KuiklyRenderCore$callModuleMethod$ref($this));
    var tmp_7 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCreateShadow_getInstance().vh_1;
    set($this.ki_1, tmp_7, KuiklyRenderCore$createShadow$ref($this));
    var tmp_8 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodRemoveShadow_getInstance().vh_1;
    set($this.ki_1, tmp_8, KuiklyRenderCore$removeShadow$ref($this));
    var tmp_9 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowProp_getInstance().vh_1;
    set($this.ki_1, tmp_9, KuiklyRenderCore$setShadowProp$ref($this));
    var tmp_10 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetShadowForView_getInstance().vh_1;
    set($this.ki_1, tmp_10, KuiklyRenderCore$setShadow$ref($this));
    var tmp_11 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodSetTimeout_getInstance().vh_1;
    set($this.ki_1, tmp_11, KuiklyRenderCore$setTimeout$ref($this));
    var tmp_12 = KuiklyRenderNativeMethod_KuiklyRenderNativeMethodCallShadowMethod_getInstance().vh_1;
    set($this.ki_1, tmp_12, KuiklyRenderCore$callShadowMethod$ref($this));
  }
  function Companion_2() {
    Companion_instance_2 = this;
    this.gi_1 = new Long(0, 0);
  }
  var Companion_instance_2;
  function Companion_getInstance_2() {
    if (Companion_instance_2 == null)
      new Companion_2();
    return Companion_instance_2;
  }
  function KuiklyRenderCore$init$lambda(this$0) {
    return function () {
      this$0.li_1.bi(KuiklyRenderContextMethod_KuiklyRenderContextMethodLayoutView_getInstance(), new (Function.bind.apply(Array, [null, this$0.hi_1]))());
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$init$lambda_0(this$0, $url, $params, $contextInitCallback) {
    return function () {
      initContextHandler(this$0, $url, $params, $contextInitCallback);
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$sendEvent$lambda(this$0, $event, $data) {
    return function () {
      this$0.li_1.bi(KuiklyRenderContextMethod_KuiklyRenderContextMethodUpdateInstance_getInstance(), new (Function.bind.apply(Array, [null, this$0.hi_1, $event, $data]))());
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$destroy$lambda(this$0) {
    return function () {
      this$0.li_1.bi(KuiklyRenderContextMethod_KuiklyRenderContextMethodDestroyInstance_getInstance(), new (Function.bind.apply(Array, [null, this$0.hi_1]))());
      this$0.li_1.rg();
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$performNativeMethodWithMethod$lambda($it, $method, $args) {
    return function () {
      $it($method, $args);
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$initContextHandler$lambda(this$0) {
    return function (method, args) {
      return performNativeMethodWithMethod(this$0, method, args);
    };
  }
  function KuiklyRenderCore$setViewProp$lambda$lambda(this$0, $tag, $args, $result) {
    return function () {
      var tmp = KuiklyRenderContextMethod_KuiklyRenderContextMethodFireViewEvent_getInstance();
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$2 = $args[2];
      this$0.li_1.bi(tmp, new (Function.bind.apply(Array, [null, this$0.hi_1, $tag, tmp$ret$2, $result]))());
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$setViewProp$lambda(this$0, $tag, $args) {
    return function (result) {
      performOnContextQueue$default(this$0, VOID, KuiklyRenderCore$setViewProp$lambda$lambda(this$0, $tag, $args, result));
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$callViewMethod$lambda$lambda(this$0, $callbackId, $result) {
    return function () {
      this$0.li_1.bi(KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_getInstance(), new (Function.bind.apply(Array, [null, this$0.hi_1, $callbackId, $result]))());
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$callViewMethod$lambda(this$0, $callbackId) {
    return function (result) {
      performOnContextQueue$default(this$0, VOID, KuiklyRenderCore$callViewMethod$lambda$lambda(this$0, $callbackId, result));
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$callModuleMethod$lambda$lambda(this$0, $callbackId, $result) {
    return function () {
      this$0.li_1.bi(KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_getInstance(), new (Function.bind.apply(Array, [null, this$0.hi_1, $callbackId, $result]))());
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$callModuleMethod$lambda(this$0, $callbackId) {
    return function (result) {
      performOnContextQueue$default(this$0, VOID, KuiklyRenderCore$callModuleMethod$lambda$lambda(this$0, $callbackId, result));
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$setShadow$lambda(this$0, $args, $shadow) {
    return function () {
      var tmp0_safe_receiver = this$0.ii_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        // Inline function 'com.tencent.kuikly.core.render.web.collection.array.secondArg' call
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp$ret$4 = $args[1];
        tmp0_safe_receiver.ij(tmp$ret$4, $shadow);
      }
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$setTimeout$lambda(this$0, $args) {
    return function () {
      var tmp = KuiklyRenderContextMethod_KuiklyRenderContextMethodFireCallback_getInstance();
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.thirdArg' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$2 = $args[2];
      this$0.li_1.bi(tmp, new (Function.bind.apply(Array, [null, this$0.hi_1, tmp$ret$2]))());
      return Unit_instance;
    };
  }
  function KuiklyRenderCore$createRenderView$ref($boundThis) {
    var l = function (p0, p1) {
      return createRenderView($boundThis, p0, p1);
    };
    l.callableName = 'createRenderView';
    return l;
  }
  function KuiklyRenderCore$removeRenderView$ref($boundThis) {
    var l = function (p0, p1) {
      return removeRenderView($boundThis, p0, p1);
    };
    l.callableName = 'removeRenderView';
    return l;
  }
  function KuiklyRenderCore$insertSubRenderView$ref($boundThis) {
    var l = function (p0, p1) {
      return insertSubRenderView($boundThis, p0, p1);
    };
    l.callableName = 'insertSubRenderView';
    return l;
  }
  function KuiklyRenderCore$setViewProp$ref($boundThis) {
    var l = function (p0, p1) {
      return setViewProp($boundThis, p0, p1);
    };
    l.callableName = 'setViewProp';
    return l;
  }
  function KuiklyRenderCore$setRenderViewFrame$ref($boundThis) {
    var l = function (p0, p1) {
      return setRenderViewFrame($boundThis, p0, p1);
    };
    l.callableName = 'setRenderViewFrame';
    return l;
  }
  function KuiklyRenderCore$calculateRenderViewSize$ref($boundThis) {
    var l = function (p0, p1) {
      return calculateRenderViewSize($boundThis, p0, p1);
    };
    l.callableName = 'calculateRenderViewSize';
    return l;
  }
  function KuiklyRenderCore$callViewMethod$ref($boundThis) {
    var l = function (p0, p1) {
      return callViewMethod($boundThis, p0, p1);
    };
    l.callableName = 'callViewMethod';
    return l;
  }
  function KuiklyRenderCore$callModuleMethod$ref($boundThis) {
    var l = function (p0, p1) {
      return callModuleMethod($boundThis, p0, p1);
    };
    l.callableName = 'callModuleMethod';
    return l;
  }
  function KuiklyRenderCore$createShadow$ref($boundThis) {
    var l = function (p0, p1) {
      return createShadow($boundThis, p0, p1);
    };
    l.callableName = 'createShadow';
    return l;
  }
  function KuiklyRenderCore$removeShadow$ref($boundThis) {
    var l = function (p0, p1) {
      return removeShadow($boundThis, p0, p1);
    };
    l.callableName = 'removeShadow';
    return l;
  }
  function KuiklyRenderCore$setShadowProp$ref($boundThis) {
    var l = function (p0, p1) {
      return setShadowProp($boundThis, p0, p1);
    };
    l.callableName = 'setShadowProp';
    return l;
  }
  function KuiklyRenderCore$setShadow$ref($boundThis) {
    var l = function (p0, p1) {
      return setShadow_0($boundThis, p0, p1);
    };
    l.callableName = 'setShadow';
    return l;
  }
  function KuiklyRenderCore$setTimeout$ref($boundThis) {
    var l = function (p0, p1) {
      return setTimeout($boundThis, p0, p1);
    };
    l.callableName = 'setTimeout';
    return l;
  }
  function KuiklyRenderCore$callShadowMethod$ref($boundThis) {
    var l = function (p0, p1) {
      return callShadowMethod($boundThis, p0, p1);
    };
    l.callableName = 'callShadowMethod';
    return l;
  }
  protoOf(KuiklyRenderCore).le = function (renderView, url, params, contextInitCallback) {
    var tmp = this;
    tmp.ji_1 = new KuiklyRenderCoreUIScheduler(KuiklyRenderCore$init$lambda(this));
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new KuiklyRenderLayerHandler();
    this_0.oj(renderView);
    tmp_0.ii_1 = this_0;
    initNativeMethodRegisters(this);
    performOnContextQueue$default(this, VOID, KuiklyRenderCore$init$lambda_0(this, url, params, contextInitCallback));
  };
  protoOf(KuiklyRenderCore).og = function (event, data) {
    performOnContextQueue$default(this, VOID, KuiklyRenderCore$sendEvent$lambda(this, event, data));
  };
  protoOf(KuiklyRenderCore).ug = function (name) {
    var tmp0_safe_receiver = this.ii_1;
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.ug(name);
  };
  protoOf(KuiklyRenderCore).rg = function () {
    var tmp0_safe_receiver = this.ii_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.ig();
    }
    performOnContextQueue$default(this, VOID, KuiklyRenderCore$destroy$lambda(this));
  };
  function KuiklyRenderCore() {
    Companion_getInstance_2();
    this.ii_1 = null;
    this.ji_1 = null;
    this.ki_1 = new Map();
    this.li_1 = new KuiklyRenderContextHandler();
  }
  function parseAnimation($this, animation) {
    var animationSpilt = split(animation, [' ']);
    $this.tj_1 = toInt(animationSpilt.j(0));
    $this.sj_1 = toInt(animationSpilt.j(1));
    var tmp = $this;
    // Inline function 'kotlin.text.toFloat' call
    var this_0 = animationSpilt.j(2);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.rj_1 = toDouble(this_0);
    if ($this.rj_1 <= 0) {
      $this.rj_1 = 0.01;
    }
    var tmp_0 = $this;
    // Inline function 'kotlin.text.toFloat' call
    var this_1 = animationSpilt.j(3);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_0.uj_1 = toDouble(this_1);
    var tmp_1 = $this;
    // Inline function 'kotlin.text.toFloat' call
    var this_2 = animationSpilt.j(4);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_1.vj_1 = toDouble(this_2);
    if (animationSpilt.i() > 5) {
      var tmp_2 = $this;
      // Inline function 'kotlin.text.toFloat' call
      var this_3 = animationSpilt.j(5);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_2.xj_1 = toDouble(this_3);
    }
    if (animationSpilt.i() > 6) {
      $this.yj_1 = toInt(animationSpilt.j(6)) === 1;
    }
    if (animationSpilt.i() > 7) {
      $this.zj_1 = animationSpilt.j(7);
    }
    if ($this.tj_1 === 1) {
      $this.wj_1 = true;
    }
  }
  function createAnimationInstance($this) {
    if (get_kuiklyAnimation($this.pj_1) == null) {
      set_kuiklyAnimation($this.pj_1, KuiklyProcessor_instance.fk().hk(new AnimationOption($this.rj_1, $this.gk(), $this.xj_1, $this.pj_1.style.transformOrigin)));
    }
  }
  function setupAnimationHandler($this) {
    var tmp0 = $this.ak_1;
    // Inline function 'kotlin.collections.set' call
    var value = KRCSSAnimation$setupAnimationHandler$lambda;
    tmp0.k2('opacity', value);
    var tmp3 = $this.ak_1;
    var tmp4 = 'transform';
    // Inline function 'kotlin.collections.set' call
    var value_0 = KRCSSAnimation$setupAnimationHandler$lambda_0;
    tmp3.k2(tmp4, value_0);
    var tmp6 = $this.ak_1;
    var tmp7 = 'backgroundColor';
    // Inline function 'kotlin.collections.set' call
    var value_1 = KRCSSAnimation$setupAnimationHandler$lambda_1;
    tmp6.k2(tmp7, value_1);
    var tmp9 = $this.ak_1;
    // Inline function 'kotlin.collections.set' call
    var value_2 = KRCSSAnimation$setupAnimationHandler$lambda_2;
    tmp9.k2('frame', value_2);
  }
  function Companion_3() {
    this.ik_1 = 0;
    this.jk_1 = 1;
    this.kk_1 = 2;
    this.lk_1 = 3;
    this.mk_1 = 4;
    this.nk_1 = 5;
    this.ok_1 = 6;
    this.pk_1 = 7;
    this.qk_1 = 1;
    this.rk_1 = 1;
    this.sk_1 = 2;
    this.tk_1 = 3;
    this.uk_1 = 0.01;
  }
  var Companion_instance_3;
  function Companion_getInstance_3() {
    return Companion_instance_3;
  }
  function KRCSSAnimation$commitAnimation$lambda(this$0) {
    return function (finished, propKey) {
      var _unary__edvuaz = this$0.ek_1;
      this$0.ek_1 = _unary__edvuaz - 1 | 0;
      var tmp;
      if (this$0.ek_1 === 0) {
        var tmp0_safe_receiver = this$0.qj_1;
        if (tmp0_safe_receiver == null)
          null;
        else
          tmp0_safe_receiver(this$0, finished, propKey, this$0.zj_1);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRCSSAnimation$setupAnimationHandler$lambda() {
    return new KRCSSPlainAnimationHandler('opacity');
  }
  function KRCSSAnimation$setupAnimationHandler$lambda_0() {
    return new KRCSSPlainAnimationHandler('transform');
  }
  function KRCSSAnimation$setupAnimationHandler$lambda_1() {
    return new KRCSSPlainAnimationHandler('backgroundColor');
  }
  function KRCSSAnimation$setupAnimationHandler$lambda_2() {
    return new KRCSSPlainAnimationHandler('frame');
  }
  function KRCSSAnimation(animation, ele) {
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.pj_1 = ele;
    this.qj_1 = null;
    this.rj_1 = 0.0;
    this.sj_1 = 0;
    this.tj_1 = 0;
    this.uj_1 = 0.0;
    this.vj_1 = 0.0;
    this.wj_1 = false;
    this.xj_1 = 0.0;
    this.yj_1 = false;
    this.zj_1 = '';
    this.ak_1 = HashMap_init_$Create$();
    this.bk_1 = LinkedHashMap_init_$Create$();
    this.ck_1 = null;
    this.dk_1 = false;
    this.ek_1 = 0;
    parseAnimation(this, animation);
    createAnimationInstance(this);
    setupAnimationHandler(this);
  }
  protoOf(KRCSSAnimation).vk = function (propKey) {
    return this.ak_1.b1(propKey);
  };
  protoOf(KRCSSAnimation).wk = function (animationType, finalValue) {
    var tmp0_safe_receiver = this.ak_1.d1(animationType);
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver();
    var tmp;
    if (tmp1_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var handler = tmp;
    this.ek_1 = this.ek_1 + 1 | 0;
    handler.yk_1 = finalValue;
    handler.al_1 = animationType;
    this.ck_1 = animationType;
    // Inline function 'kotlin.collections.set' call
    this.bk_1.k2(animationType, handler);
  };
  protoOf(KRCSSAnimation).cl = function (forceCommit) {
    if (this.dk_1 && !forceCommit) {
      return Unit_instance;
    }
    this.dk_1 = true;
    var targetView = this.pj_1;
    var values = this.bk_1.f1();
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!values.k()) {
      var _iterator__ex2g4s = values.f();
      while (_iterator__ex2g4s.g()) {
        var value = _iterator__ex2g4s.h();
        value.dl(targetView, forceCommit, KRCSSAnimation$commitAnimation$lambda(this));
      }
    }
  };
  protoOf(KRCSSAnimation).el = function (forceCommit, $super) {
    forceCommit = forceCommit === VOID ? false : forceCommit;
    var tmp;
    if ($super === VOID) {
      this.cl(forceCommit);
      tmp = Unit_instance;
    } else {
      tmp = $super.cl.call(this, forceCommit);
    }
    return tmp;
  };
  protoOf(KRCSSAnimation).fl = function () {
    // Inline function 'kotlin.collections.map' call
    var this_0 = this.bk_1;
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(this_0.i());
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = this_0.g1().f();
    while (_iterator__ex2g4s.g()) {
      var item = _iterator__ex2g4s.h();
      var tmp$ret$1 = item.a1().al_1;
      destination.d(tmp$ret$1);
    }
    return destination;
  };
  protoOf(KRCSSAnimation).gl = function (cancelAnimationKeys) {
    var values = this.bk_1.f1();
    var _iterator__ex2g4s = values.f();
    while (_iterator__ex2g4s.g()) {
      var value = _iterator__ex2g4s.h();
      if (!(cancelAnimationKeys == null)) {
        if (cancelAnimationKeys.w(value.al_1)) {
          value.bl_1 = true;
          value.il(value.al_1);
        }
      } else {
        value.hl();
      }
    }
  };
  protoOf(KRCSSAnimation).jl = function (cancelAnimationKeys, $super) {
    cancelAnimationKeys = cancelAnimationKeys === VOID ? null : cancelAnimationKeys;
    var tmp;
    if ($super === VOID) {
      this.gl(cancelAnimationKeys);
      tmp = Unit_instance;
    } else {
      tmp = $super.gl.call(this, cancelAnimationKeys);
    }
    return tmp;
  };
  protoOf(KRCSSAnimation).kl = function () {
    var tmp0_elvis_lhs = getViewData(this.pj_1, 'animationQueue');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var animationQueue = tmp;
    animationQueue.m3(hashCode(this));
    if (animationQueue.k()) {
      removeViewData(this.pj_1, 'animationQueue');
    }
  };
  protoOf(KRCSSAnimation).ll = function () {
    // Inline function 'kotlin.collections.isNotEmpty' call
    return !this.bk_1.f1().k();
  };
  protoOf(KRCSSAnimation).ml = function () {
    return this.yj_1;
  };
  protoOf(KRCSSAnimation).nl = function (animationType) {
    var values = this.bk_1.f1();
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!values.k()) {
      // Inline function 'kotlin.collections.forEach' call
      var _iterator__ex2g4s = values.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (animationType == null || contains(animationType, element.al_1)) {
          element.ol();
        }
      }
    }
  };
  protoOf(KRCSSAnimation).pl = function (animationType, $super) {
    animationType = animationType === VOID ? null : animationType;
    var tmp;
    if ($super === VOID) {
      this.nl(animationType);
      tmp = Unit_instance;
    } else {
      tmp = $super.nl.call(this, animationType);
    }
    return tmp;
  };
  protoOf(KRCSSAnimation).ql = function () {
    var values = this.bk_1.f1();
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!values.k()) {
      // Inline function 'kotlin.collections.forEach' call
      var _iterator__ex2g4s = values.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        element.rl(true);
      }
    }
  };
  protoOf(KRCSSAnimation).gk = function () {
    var tmp;
    if (this.wj_1) {
      tmp = AnimationTimingFunction_SIMULATE_SPRING_ANIMATION_getInstance().ul_1;
    } else {
      switch (this.sj_1) {
        case 1:
          tmp = AnimationTimingFunction_EASE_IN_getInstance().ul_1;
          break;
        case 2:
          tmp = AnimationTimingFunction_EASE_OUT_getInstance().ul_1;
          break;
        case 3:
          tmp = AnimationTimingFunction_EASE_IN_OUT_getInstance().ul_1;
          break;
        default:
          tmp = AnimationTimingFunction_LINEAR_getInstance().ul_1;
          break;
      }
    }
    return tmp;
  };
  protoOf(KRCSSAnimation).vl = function () {
    var count = 0;
    var values = this.bk_1.f1();
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!values.k()) {
      // Inline function 'kotlin.collections.forEach' call
      var _iterator__ex2g4s = values.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (element.al_1 === 'frame') {
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          var frameValue = element.yk_1;
          if (!(this.pj_1.style.left === '' + frameValue.wl_1 + 'px')) {
            count = count + 1 | 0;
          }
          if (!(this.pj_1.style.top === '' + frameValue.xl_1 + 'px')) {
            count = count + 1 | 0;
          }
          if (!(this.pj_1.style.width === '' + frameValue.yl_1 + 'px')) {
            count = count + 1 | 0;
          }
          if (!(this.pj_1.style.height === '' + frameValue.zl_1 + 'px')) {
            count = count + 1 | 0;
          }
        }
      }
    }
    return count;
  };
  function KRCSSAnimationHandler() {
    this.xk_1 = null;
    this.yk_1 = null;
    this.zk_1 = 0.0;
    this.al_1 = '';
    this.bl_1 = false;
  }
  protoOf(KRCSSAnimationHandler).hl = function (propKey, $super) {
    propKey = propKey === VOID ? null : propKey;
    var tmp;
    if ($super === VOID) {
      this.il(propKey);
      tmp = Unit_instance;
    } else {
      tmp = $super.il.call(this, propKey);
    }
    return tmp;
  };
  protoOf(KRCSSAnimationHandler).ol = function (cancel, $super) {
    cancel = cancel === VOID ? false : cancel;
    var tmp;
    if ($super === VOID) {
      this.rl(cancel);
      tmp = Unit_instance;
    } else {
      tmp = $super.rl.call(this, cancel);
    }
    return tmp;
  };
  protoOf(KRCSSAnimationHandler).am = function (isCancel) {
    var tmp;
    if (this.bl_1) {
      tmp = true;
    } else {
      tmp = !isCancel;
    }
    return tmp;
  };
  function applyFinalValue($this) {
    var tmp0_safe_receiver = $this.yk_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      switch ($this.gm_1) {
        case 'transform':
          // Inline function 'kotlin.let' call

          var it = getCSSTransform($this, tmp0_safe_receiver);
          var tmp0_safe_receiver_0 = $this.xk_1;
          var tmp1_safe_receiver = tmp0_safe_receiver_0 == null ? null : tmp0_safe_receiver_0.style;
          if (tmp1_safe_receiver == null)
            null;
          else {
            tmp1_safe_receiver.transform = ensureNotNull(get(it, 'transform'));
          }

          break;
        case 'opacity':
          var tmp1_safe_receiver_0 = $this.xk_1;
          var tmp2_safe_receiver = tmp1_safe_receiver_0 == null ? null : tmp1_safe_receiver_0.style;
          if (tmp2_safe_receiver == null)
            null;
          else {
            // Inline function 'kotlin.js.unsafeCast' call
            // Inline function 'kotlin.js.asDynamic' call
            tmp2_safe_receiver.opacity = toString(tmp0_safe_receiver);
          }

          break;
        case 'backgroundColor':
          var tmp3_safe_receiver = $this.xk_1;
          var tmp4_safe_receiver = tmp3_safe_receiver == null ? null : tmp3_safe_receiver.style;
          if (tmp4_safe_receiver == null)
            null;
          else {
            // Inline function 'kotlin.js.unsafeCast' call
            // Inline function 'kotlin.js.asDynamic' call
            tmp4_safe_receiver.backgroundColor = toRgbColor(tmp0_safe_receiver);
          }

          break;
        case 'frame':
          // Inline function 'kotlin.js.unsafeCast' call

          // Inline function 'kotlin.js.asDynamic' call

          var frameValue = tmp0_safe_receiver;
          var tmp5_safe_receiver = $this.xk_1;
          var tmp6_safe_receiver = tmp5_safe_receiver == null ? null : tmp5_safe_receiver.style;
          if (tmp6_safe_receiver == null)
            null;
          else {
            tmp6_safe_receiver.left = '' + frameValue.wl_1 + 'px';
          }

          var tmp7_safe_receiver = $this.xk_1;
          var tmp8_safe_receiver = tmp7_safe_receiver == null ? null : tmp7_safe_receiver.style;
          if (tmp8_safe_receiver == null)
            null;
          else {
            tmp8_safe_receiver.top = '' + frameValue.xl_1 + 'px';
          }

          var tmp9_safe_receiver = $this.xk_1;
          var tmp10_safe_receiver = tmp9_safe_receiver == null ? null : tmp9_safe_receiver.style;
          if (tmp10_safe_receiver == null)
            null;
          else {
            tmp10_safe_receiver.width = '' + frameValue.yl_1 + 'px';
          }

          var tmp11_safe_receiver = $this.xk_1;
          var tmp12_safe_receiver = tmp11_safe_receiver == null ? null : tmp11_safe_receiver.style;
          if (tmp12_safe_receiver == null)
            null;
          else {
            tmp12_safe_receiver.height = '' + frameValue.zl_1 + 'px';
          }

          break;
        default:
          break;
      }
    }
  }
  function getCSSTransform($this, value) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var transformSpilt = split(value, ['|']);
    var tmp0_safe_receiver = $this.xk_1;
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.style;
    var tmp2_safe_receiver = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.width;
    var tmp3_safe_receiver = tmp2_safe_receiver == null ? null : removeSuffix(tmp2_safe_receiver, 'px');
    var tmp4_elvis_lhs = tmp3_safe_receiver == null ? null : toDouble(tmp3_safe_receiver);
    var width = tmp4_elvis_lhs == null ? 0.0 : tmp4_elvis_lhs;
    var tmp5_safe_receiver = $this.xk_1;
    var tmp6_safe_receiver = tmp5_safe_receiver == null ? null : tmp5_safe_receiver.style;
    var tmp7_safe_receiver = tmp6_safe_receiver == null ? null : tmp6_safe_receiver.height;
    var tmp8_safe_receiver = tmp7_safe_receiver == null ? null : removeSuffix(tmp7_safe_receiver, 'px');
    var tmp9_elvis_lhs = tmp8_safe_receiver == null ? null : toDouble(tmp8_safe_receiver);
    var height = tmp9_elvis_lhs == null ? 0.0 : tmp9_elvis_lhs;
    var anchorSpilt = split(transformSpilt.j(3), [' ']);
    var anchorX = toPercentage(anchorSpilt.j(0));
    var anchorY = toPercentage(anchorSpilt.j(1));
    var transformOrigin = anchorX + ' ' + anchorY + ' 0';
    var translateSpilt = split(transformSpilt.j(2), [' ']);
    // Inline function 'kotlin.text.toFloat' call
    var this_0 = translateSpilt.j(0);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var translateX = toDouble(this_0) * width;
    // Inline function 'kotlin.text.toFloat' call
    var this_1 = translateSpilt.j(1);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var translateY = toDouble(this_1) * height;
    var rotate = transformSpilt.j(0);
    var scaleSpilt = split(transformSpilt.j(1), [' ']);
    var scaleX = scaleSpilt.j(0);
    var scaleY = scaleSpilt.j(1);
    var skewSplit = split(transformSpilt.j(4), [' ']);
    var skewX = skewSplit.j(0);
    var skewY = skewSplit.j(1);
    // Inline function 'kotlin.apply' call
    var this_2 = new Map();
    set(this_2, 'transformOrigin', transformOrigin);
    set(this_2, 'translateX', translateX.toString());
    set(this_2, 'translateY', translateY.toString());
    set(this_2, 'rotate', rotate);
    set(this_2, 'scaleX', scaleX);
    set(this_2, 'scaleY', scaleY);
    set(this_2, 'skewX', skewX);
    set(this_2, 'skewY', skewY);
    set(this_2, 'transform', 'translate(' + translateX + 'px, ' + translateY + 'px) rotate(' + rotate + 'deg) scale(' + scaleX + ', ' + scaleY + ') skew(' + skewX + 'deg, ' + skewY + 'deg)');
    return this_2;
  }
  function getAPIAnimationValue($this, animationType, newAnimationValue) {
    // Inline function 'kotlin.collections.mutableMapOf' call
    var operatesMap = LinkedHashMap_init_$Create$();
    switch (animationType) {
      case 'transform':
        var transformValues = getCSSTransform($this, newAnimationValue);
        // Inline function 'kotlin.let' call

        var tmp1 = 'translateX';
        var tmp0_elvis_lhs = get(transformValues, 'translateX');
        // Inline function 'kotlin.collections.set' call

        var value = tmp0_elvis_lhs == null ? '0' : tmp0_elvis_lhs;
        operatesMap.k2(tmp1, value);
        var tmp4 = 'translateY';
        var tmp1_elvis_lhs = get(transformValues, 'translateY');
        // Inline function 'kotlin.collections.set' call

        var value_0 = tmp1_elvis_lhs == null ? '0' : tmp1_elvis_lhs;
        operatesMap.k2(tmp4, value_0);
        var tmp2_elvis_lhs = get(transformValues, 'rotate');
        // Inline function 'kotlin.collections.set' call

        var value_1 = tmp2_elvis_lhs == null ? '0' : tmp2_elvis_lhs;
        operatesMap.k2('rotate', value_1);
        var tmp3_elvis_lhs = get(transformValues, 'scaleX');
        // Inline function 'kotlin.collections.set' call

        var value_2 = tmp3_elvis_lhs == null ? '1.0' : tmp3_elvis_lhs;
        operatesMap.k2('scaleX', value_2);
        var tmp4_elvis_lhs = get(transformValues, 'scaleY');
        // Inline function 'kotlin.collections.set' call

        var value_3 = tmp4_elvis_lhs == null ? '1.0' : tmp4_elvis_lhs;
        operatesMap.k2('scaleY', value_3);
        var tmp16 = 'transformOrigin';
        var tmp5_elvis_lhs = get(transformValues, 'transformOrigin');
        // Inline function 'kotlin.collections.set' call

        var value_4 = tmp5_elvis_lhs == null ? '50% 50% 0' : tmp5_elvis_lhs;
        operatesMap.k2(tmp16, value_4);
        break;
      case 'opacity':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        // Inline function 'kotlin.collections.set' call

        var value_5 = toString(newAnimationValue);
        operatesMap.k2('opacity', value_5);
        break;
      case 'backgroundColor':
        var tmp8 = 'backgroundColor';
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        // Inline function 'kotlin.collections.set' call

        var value_6 = toRgbColor(newAnimationValue);
        operatesMap.k2(tmp8, value_6);
        break;
      case 'frame':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        var frame = newAnimationValue;
        // Inline function 'kotlin.collections.set' call

        var value_7 = frame.wl_1.toString();
        operatesMap.k2('left', value_7);
        // Inline function 'kotlin.collections.set' call

        var value_8 = frame.xl_1.toString();
        operatesMap.k2('top', value_8);
        // Inline function 'kotlin.collections.set' call

        var value_9 = frame.yl_1.toString();
        operatesMap.k2('width', value_9);
        // Inline function 'kotlin.collections.set' call

        var value_10 = frame.zl_1.toString();
        operatesMap.k2('height', value_10);
        break;
    }
    return operatesMap;
  }
  function applyAnimationHandler($this, target, property, operateValueMap) {
    switch (property) {
      case 'transform':
        var tmp1_elvis_lhs = operateValueMap.d1('translateX');
        var translateX = tmp1_elvis_lhs == null ? '0' : tmp1_elvis_lhs;
        var tmp2_elvis_lhs = operateValueMap.d1('translateY');
        var translateY = tmp2_elvis_lhs == null ? '0' : tmp2_elvis_lhs;
        var tmp3_elvis_lhs = operateValueMap.d1('rotate');
        var rotate = tmp3_elvis_lhs == null ? '0' : tmp3_elvis_lhs;
        var tmp4_elvis_lhs = operateValueMap.d1('scaleX');
        var scaleX = tmp4_elvis_lhs == null ? '1.0' : tmp4_elvis_lhs;
        var tmp5_elvis_lhs = operateValueMap.d1('scaleY');
        var scaleY = tmp5_elvis_lhs == null ? '1.0' : tmp5_elvis_lhs;
        var tmp6_elvis_lhs = operateValueMap.d1('skewX');
        var skewX = tmp6_elvis_lhs == null ? '0' : tmp6_elvis_lhs;
        var tmp7_elvis_lhs = operateValueMap.d1('skewY');
        var skewY = tmp7_elvis_lhs == null ? '0' : tmp7_elvis_lhs;
        var tmp8_safe_receiver = get_kuiklyAnimation(target);
        if (tmp8_safe_receiver == null)
          null;
        else
          tmp8_safe_receiver.im(translateX, translateY);
        var tmp9_safe_receiver = get_kuiklyAnimation(target);
        if (tmp9_safe_receiver == null)
          null;
        else
          tmp9_safe_receiver.jm(rotate);
        var tmp10_safe_receiver = get_kuiklyAnimation(target);
        if (tmp10_safe_receiver == null)
          null;
        else
          tmp10_safe_receiver.km(scaleX, scaleY);
        var tmp11_safe_receiver = get_kuiklyAnimation(target);
        if (tmp11_safe_receiver == null)
          null;
        else
          tmp11_safe_receiver.lm(skewX, skewY);
        break;
      case 'opacity':
        var tmp12_safe_receiver = get_kuiklyAnimation(target);
        if (tmp12_safe_receiver == null)
          null;
        else
          tmp12_safe_receiver.mm(ensureNotNull(operateValueMap.d1('opacity')));
        break;
      case 'backgroundColor':
        var tmp13_safe_receiver = get_kuiklyAnimation(target);
        if (tmp13_safe_receiver == null)
          null;
        else
          tmp13_safe_receiver.nm(ensureNotNull(operateValueMap.d1('backgroundColor')));
        break;
      case 'frame':
        var tmp14_safe_receiver = get_kuiklyAnimation(target);
        if (tmp14_safe_receiver == null)
          null;
        else
          tmp14_safe_receiver.om(ensureNotNull(operateValueMap.d1('left')));
        var tmp15_safe_receiver = get_kuiklyAnimation(target);
        if (tmp15_safe_receiver == null)
          null;
        else
          tmp15_safe_receiver.pm(ensureNotNull(operateValueMap.d1('top')));
        var tmp16_safe_receiver = get_kuiklyAnimation(target);
        if (tmp16_safe_receiver == null)
          null;
        else
          tmp16_safe_receiver.qm(ensureNotNull(operateValueMap.d1('width')));
        var tmp17_safe_receiver = get_kuiklyAnimation(target);
        if (tmp17_safe_receiver == null)
          null;
        else
          tmp17_safe_receiver.rm(ensureNotNull(operateValueMap.d1('height')));
        break;
    }
  }
  function KRCSSPlainAnimationHandler(property) {
    KRCSSAnimationHandler.call(this);
    this.gm_1 = property;
    this.hm_1 = null;
  }
  protoOf(KRCSSPlainAnimationHandler).dl = function (target, forceCommit, onAnimationEndBlock) {
    this.xk_1 = target;
    this.hm_1 = onAnimationEndBlock;
    var tmp0_safe_receiver = this.yk_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      var operateValueMap = getAPIAnimationValue(this, this.gm_1, tmp0_safe_receiver);
      applyAnimationHandler(this, target, this.gm_1, operateValueMap);
    }
  };
  protoOf(KRCSSPlainAnimationHandler).il = function (propKey) {
  };
  protoOf(KRCSSPlainAnimationHandler).rl = function (cancel) {
    var tmp0_safe_receiver = this.hm_1;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver(this.am(cancel), this.gm_1);
    applyFinalValue(this);
  };
  function KuiklyRenderViewDelegatorDelegate() {
  }
  function Companion_4() {
    this.en_1 = 'KRActivityIndicatorView';
    this.fn_1 = 'style';
    this.gn_1 = 'gray';
    this.hn_1 = 'white';
    this.in_1 = 'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAS1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmYDp0AAAAGXRSTlMAJk0zQGZzBCITGh8OCggXSTotRDEqXVVqQNv4pgAABP9JREFUeNrs2ctyozAQheHTGKEbEtgk2O//pJOaSSjUQUiAqGHhb+vNX6ZpjIy3t6vTlshqXItT9JdyuBBHkyt1KZooXIammevMl6UZi6ugAK7iP2ZJ83iYI1m+bT1Ku72aL6/b3iyt6IvSKGpovlX7sgx961BQ30zqPVkdTQyKsc2M2p7laMahlKqZEXJzlqIZg1JEM3fbmqVpTqGUJvBy27IkhVDKqwn027I6CqiCsxXqtmR5ChmUQizruSXLUqhFMSPr+szPailkUY5hWUJmZykKOTAlp+uem6WLThbXNkyblyWJkSjqzrKqvCxDIY2ypGBdJifLUUihtE+WNUazzl0O3JN1PWJZ5y4HrmNZL5/KkopCHifoWVedytIU6nAG92JdOpJ18nLgbnxJxF5f08vh7CURf9n3RZeDGUYx9gpLFMvq145GTNbDsDWKlHFIqMU/T5OxJMTaQZLKeBg6yz6NVk0GB3C6Ca0du6WXgzSZd+lDzN0kuCFcXWuHlCq1HHTuDSFHERgVGB8siSdi+GwpCaZV2XdEJ7hKI/TBfqTGtWvfhbfEecSQ+K120akfscpG51129FubyGLGDxle6OkSeqySU5eNDFVmVicWPS1mXPW9tKba1HgZyc7KF3lEjWJZrzHT3obhQyOD1F2ngyhvaJnKWhDc3aMA2VGMxopBxIwPHKYVxRisuouoXuIYQ1EdEuxTxDw9DpCWYpRDkvwYRcRwznelkcXVIqLFbpIiOolcuhKLHthN0yLrsYUaF9cEdutogWqxkbydn6WxgxvOvYhGYh/zPG/krcN+FIxYjQMMG6pD5F1MKlnqz1AtcVTb/1R5HCItG6qDupq9Om7DXwo93t7e3gqQVPfVor4miZK0pQirEdJDtWLQKMYpWqFcUFUl6GJVlDDrkkOVMEiUoShBYUJVEqEITUkaP+oqqUYRlpIsfvRVUo8iKMPVs/60c7Y7DoJAFKVAguInFN7/VTfpbqnedTRt6jA/PE9wVLzKMCD0IQod8kIDQmicSv34SP1UX1xcXHxGm+7zHLys0shg9C/BySkkuawLQUzZrZv1giSjSNlavWb4Ykl3/HxQIU31Ari7zfofsfZygb/rDWLdxZU+6E2amktRY9IEQ8WFu2bWBKbeMud01xS23qJw1iSh3hK60RRzU6/hoNEU0VVsz6AGe+ixIcUPHzazdO83s7TE7HVa/1PYB5mt9afbHlRuZWXsH8kxNEpRWgmuItqCYWora8lBVfB2wcTThIdD/u4V4IJdEDlaFjEg5o2SyM0uCQtfn1PK3n2nwROJumCGre6bNa9rj+ZB7L/TDosk/YvdtE92+271ptATdb/uveZhpDX0pLC1a/LzsqMpRHdCq/U+AbT6p4FZ4MnG9JPoig+8iNksyMxt/CPerHLrk1mQmDc93MDq9VTMCt4tIj1YBUdo8W6oSaDlFaHFuv1oAiujKC3OzVqOCAdCiyskGiJJCS2mkBgtMO5rMYVEJsKB0GLYZEqEA63FtyXXgNakDrRYQqIFq6SOtFhCImI47GqxbY6HzLqpXS22owTo8U5r0SFx0t3q1L4W2zEVGX7g97V4DvXAN7F9X2s4Kbgy5PuuFseBMfhnmtWh1pnH6yA+PMZVp461zj2MCOm9hxglteijmzhBLSnAhEwKMH2VAkz2pQClETGsCkmCKGU3UValSCnoCV5cbPIDQR5TIrqY83gAAAAASUVORK5CYII=';
    this.jn_1 = 'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMATWZZv5mM2UUHIDM+FBo4JgwrEVJ9qDCHbbd0XejRx5D2sZ/haBjGAAAFg0lEQVR42uzZW5eaMBSG4W9TMEfOHaxOFUfz/39ju9oZS5AQDnGVC59Lr94VN1tAvLxsXaGJdIFtSTn9wVNsSEp3W+ridMexGQV1bGe+NHVobAVZsBX/MUvkUaTXZKVS1gjtcDK/nd6XZklOv3GJoBLzqVmWpejTHgE15m63JKuiO4VguOmg+VkZdaQBD6uDidlZnOgZx3UyXe9zsyR1cYTyYWV9ZPOyBNkCnpblNi9rT086rauxqTlZNdlyhPLd2No5WZpsGYI5G9u36VkZ2TTC0cZ2EpOzONnSsGve9jY1qyCbQkjyw1g+5LQsQT0CQb0ZWzMtS5GtQFjiZGx6SlZKNo7Qvhnb2ZPlWA7BtcYW+bMk2TTCU/0lUfqyBCdbjSe4GdvOl1WRbY9nyPpLohjPKqlH4Cneje06/viak03iOQQztnzsYb8OuhzyS3xuE44h1N+pY69G1KTlkOWcuErhsWN/XRUGHHsX49iLJD7hNivV034qf7C7S4YHVW/ox167ka3EA6EmXqU/Wcf5INCX9E/L/ZKSU1eFB8XUC0K0zBITeuqT6ThiRE4dXKAn45OvCMX6mgq2Q+8m1S0bO4taU18Nl+/s0Y/UOfUtRmnnvIs9PZKerJ5zJNBRnu9VKUYJ7fiJlkSzshQbFHN0pI354ybg83koSjiGypLCqWXDbgU65CFJDhITlLKqZGl9ktMwDreIubzVCEBU5CIx4sJc2p9YTXJyURj1xpySEuvk5FTBg8fM5VpjBaHJhWfwEtGZOVywgvKMlVf6gzlkWKwkh73AVFXDBq0Ye0mDdI05KB5cE1isWjZUfeJwfnpWgQWyy3O/RCWwjLoymww38jrFct9a1rHDCnvq4BKrlO//RqwRof4MrQTWkslXVQ0EWfN5iRDULj63N8JC/YfCGi8vLy8BiCg5xoOOSSQQUqHJQRewqSYe0SgEk3IawVOrKvZQwarIo9MlmtijEQiDkwfHXRR7RQiiIK8CX5LYK0EQmrw0vhxjryOCoAm2nvWrXbtZchSEogB85RYUoPEnwVJLF/3+TzlVdoeBO9iMUUoWfttkccqQo8LN9EfMdMlnWhCZ1mmuN59cb9W32+32Gc1GLqYmr62ReuLf+i6fjSRluDVns+1WCe5geWxS6p77Hhls6b4Yp+TlG+Cq4P/Cq48LmpEH4LWHK3rmQfLKo6hu4RseFx7cyS++gV13zDmMfEvfXXYojHzTpC47Qmd8y5e8buBA8i3YXTieIXjYXPujc8b8372ja8uyPTzMonnQOPj1IVao4osJV83B0Z8mvKgUONQsfkyR31VJ/CHVzkGpeCxGapgJa4r0H1rVobEyzamZfrkSjhJ+odHRHhnCo0t+bIDoRuFgsYtlmQMji7QgCgWUEa7enSE1jBn3Ecqgq9w14EktZFERtfCMfz9AtsIa3tD3+mgcltZ83wY/FeGrVTPL5irQIyPDwxHt+lIY/tpT+BC+KWQWKltavsio9QE9ifVeDyVzlO8rgb4CEpEkFbOrmzmM7RL0PSGJbiQL3l565rHfR0JBCih8BfweCwb0NZBATVL1KhZLGfQ94HwTidVALBZopCVxupKkmiEeCyT6NJxMBcohHouWhAErTTksEIkV7tQBTvWi5fCKxNoqiQ7OtAifhHis1TNlSeiNcojHgiJhScwk1gDxWOlLYiCpJojG2i6JGs7CSKx6T6wX+io4C+kshD2xoEnVXaNfDt2+WAp9ia6WhF2xaEkUaVqrh72xoEjTXK1wPPfHqtP8EwHJw9/OWFAmqnmba4FPYkGV6Am16td1VcFnseBp1nJo4Wy6aTTAjljEQ+sHpBOPlYtMY5HX11yQl/1ckK2RbHgbSRmx225ZpbKblBn9grdb0B9tgZ0KTsLMSAAAAABJRU5ErkJggg==';
  }
  var Companion_instance_4;
  function Companion_getInstance_4() {
    return Companion_instance_4;
  }
  function KRActivityIndicatorView() {
    this.kn_1 = kuiklyDocument.createElement('div');
    this.ln_1 = false;
  }
  protoOf(KRActivityIndicatorView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.kn_1;
  };
  protoOf(KRActivityIndicatorView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'style':
        var tmp_0 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.ln_1 = propValue === 'gray';
        tmp = true;
        break;
      case 'frame':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        var frame = propValue;
        setFrame(this.mn(), frame, this.mn().style);
        this.mn().style.backgroundImage = 'url(data:image/png;base64,' + (this.ln_1 ? 'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAS1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmYDp0AAAAGXRSTlMAJk0zQGZzBCITGh8OCggXSTotRDEqXVVqQNv4pgAABP9JREFUeNrs2ctyozAQheHTGKEbEtgk2O//pJOaSSjUQUiAqGHhb+vNX6ZpjIy3t6vTlshqXItT9JdyuBBHkyt1KZooXIammevMl6UZi6ugAK7iP2ZJ83iYI1m+bT1Ku72aL6/b3iyt6IvSKGpovlX7sgx961BQ30zqPVkdTQyKsc2M2p7laMahlKqZEXJzlqIZg1JEM3fbmqVpTqGUJvBy27IkhVDKqwn027I6CqiCsxXqtmR5ChmUQizruSXLUqhFMSPr+szPailkUY5hWUJmZykKOTAlp+uem6WLThbXNkyblyWJkSjqzrKqvCxDIY2ypGBdJifLUUihtE+WNUazzl0O3JN1PWJZ5y4HrmNZL5/KkopCHifoWVedytIU6nAG92JdOpJ18nLgbnxJxF5f08vh7CURf9n3RZeDGUYx9gpLFMvq145GTNbDsDWKlHFIqMU/T5OxJMTaQZLKeBg6yz6NVk0GB3C6Ca0du6WXgzSZd+lDzN0kuCFcXWuHlCq1HHTuDSFHERgVGB8siSdi+GwpCaZV2XdEJ7hKI/TBfqTGtWvfhbfEecSQ+K120akfscpG51129FubyGLGDxle6OkSeqySU5eNDFVmVicWPS1mXPW9tKba1HgZyc7KF3lEjWJZrzHT3obhQyOD1F2ngyhvaJnKWhDc3aMA2VGMxopBxIwPHKYVxRisuouoXuIYQ1EdEuxTxDw9DpCWYpRDkvwYRcRwznelkcXVIqLFbpIiOolcuhKLHthN0yLrsYUaF9cEdutogWqxkbydn6WxgxvOvYhGYh/zPG/krcN+FIxYjQMMG6pD5F1MKlnqz1AtcVTb/1R5HCItG6qDupq9Om7DXwo93t7e3gqQVPfVor4miZK0pQirEdJDtWLQKMYpWqFcUFUl6GJVlDDrkkOVMEiUoShBYUJVEqEITUkaP+oqqUYRlpIsfvRVUo8iKMPVs/60c7Y7DoJAFKVAguInFN7/VTfpbqnedTRt6jA/PE9wVLzKMCD0IQod8kIDQmicSv34SP1UX1xcXHxGm+7zHLys0shg9C/BySkkuawLQUzZrZv1giSjSNlavWb4Ykl3/HxQIU31Ari7zfofsfZygb/rDWLdxZU+6E2amktRY9IEQ8WFu2bWBKbeMud01xS23qJw1iSh3hK60RRzU6/hoNEU0VVsz6AGe+ixIcUPHzazdO83s7TE7HVa/1PYB5mt9afbHlRuZWXsH8kxNEpRWgmuItqCYWora8lBVfB2wcTThIdD/u4V4IJdEDlaFjEg5o2SyM0uCQtfn1PK3n2nwROJumCGre6bNa9rj+ZB7L/TDosk/YvdtE92+271ptATdb/uveZhpDX0pLC1a/LzsqMpRHdCq/U+AbT6p4FZ4MnG9JPoig+8iNksyMxt/CPerHLrk1mQmDc93MDq9VTMCt4tIj1YBUdo8W6oSaDlFaHFuv1oAiujKC3OzVqOCAdCiyskGiJJCS2mkBgtMO5rMYVEJsKB0GLYZEqEA63FtyXXgNakDrRYQqIFq6SOtFhCImI47GqxbY6HzLqpXS22owTo8U5r0SFx0t3q1L4W2zEVGX7g97V4DvXAN7F9X2s4Kbgy5PuuFseBMfhnmtWh1pnH6yA+PMZVp461zj2MCOm9hxglteijmzhBLSnAhEwKMH2VAkz2pQClETGsCkmCKGU3UValSCnoCV5cbPIDQR5TIrqY83gAAAAASUVORK5CYII=' : 'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMATWZZv5mM2UUHIDM+FBo4JgwrEVJ9qDCHbbd0XejRx5D2sZ/haBjGAAAFg0lEQVR42uzZW5eaMBSG4W9TMEfOHaxOFUfz/39ju9oZS5AQDnGVC59Lr94VN1tAvLxsXaGJdIFtSTn9wVNsSEp3W+ridMexGQV1bGe+NHVobAVZsBX/MUvkUaTXZKVS1gjtcDK/nd6XZklOv3GJoBLzqVmWpejTHgE15m63JKuiO4VguOmg+VkZdaQBD6uDidlZnOgZx3UyXe9zsyR1cYTyYWV9ZPOyBNkCnpblNi9rT086rauxqTlZNdlyhPLd2No5WZpsGYI5G9u36VkZ2TTC0cZ2EpOzONnSsGve9jY1qyCbQkjyw1g+5LQsQT0CQb0ZWzMtS5GtQFjiZGx6SlZKNo7Qvhnb2ZPlWA7BtcYW+bMk2TTCU/0lUfqyBCdbjSe4GdvOl1WRbY9nyPpLohjPKqlH4Cneje06/viak03iOQQztnzsYb8OuhzyS3xuE44h1N+pY69G1KTlkOWcuErhsWN/XRUGHHsX49iLJD7hNivV034qf7C7S4YHVW/ox167ka3EA6EmXqU/Wcf5INCX9E/L/ZKSU1eFB8XUC0K0zBITeuqT6ThiRE4dXKAn45OvCMX6mgq2Q+8m1S0bO4taU18Nl+/s0Y/UOfUtRmnnvIs9PZKerJ5zJNBRnu9VKUYJ7fiJlkSzshQbFHN0pI354ybg83koSjiGypLCqWXDbgU65CFJDhITlLKqZGl9ktMwDreIubzVCEBU5CIx4sJc2p9YTXJyURj1xpySEuvk5FTBg8fM5VpjBaHJhWfwEtGZOVywgvKMlVf6gzlkWKwkh73AVFXDBq0Ye0mDdI05KB5cE1isWjZUfeJwfnpWgQWyy3O/RCWwjLoymww38jrFct9a1rHDCnvq4BKrlO//RqwRof4MrQTWkslXVQ0EWfN5iRDULj63N8JC/YfCGi8vLy8BiCg5xoOOSSQQUqHJQRewqSYe0SgEk3IawVOrKvZQwarIo9MlmtijEQiDkwfHXRR7RQiiIK8CX5LYK0EQmrw0vhxjryOCoAm2nvWrXbtZchSEogB85RYUoPEnwVJLF/3+TzlVdoeBO9iMUUoWfttkccqQo8LN9EfMdMlnWhCZ1mmuN59cb9W32+32Gc1GLqYmr62ReuLf+i6fjSRluDVns+1WCe5geWxS6p77Hhls6b4Yp+TlG+Cq4P/Cq48LmpEH4LWHK3rmQfLKo6hu4RseFx7cyS++gV13zDmMfEvfXXYojHzTpC47Qmd8y5e8buBA8i3YXTieIXjYXPujc8b8372ja8uyPTzMonnQOPj1IVao4osJV83B0Z8mvKgUONQsfkyR31VJ/CHVzkGpeCxGapgJa4r0H1rVobEyzamZfrkSjhJ+odHRHhnCo0t+bIDoRuFgsYtlmQMji7QgCgWUEa7enSE1jBn3Ecqgq9w14EktZFERtfCMfz9AtsIa3tD3+mgcltZ83wY/FeGrVTPL5irQIyPDwxHt+lIY/tpT+BC+KWQWKltavsio9QE9ifVeDyVzlO8rgb4CEpEkFbOrmzmM7RL0PSGJbiQL3l565rHfR0JBCih8BfweCwb0NZBATVL1KhZLGfQ94HwTidVALBZopCVxupKkmiEeCyT6NJxMBcohHouWhAErTTksEIkV7tQBTvWi5fCKxNoqiQ7OtAifhHis1TNlSeiNcojHgiJhScwk1gDxWOlLYiCpJojG2i6JGs7CSKx6T6wX+io4C+kshD2xoEnVXaNfDt2+WAp9ia6WhF2xaEkUaVqrh72xoEjTXK1wPPfHqtP8EwHJw9/OWFAmqnmba4FPYkGV6Am16td1VcFnseBp1nJo4Wy6aTTAjljEQ+sHpBOPlYtMY5HX11yQl/1ckK2RbHgbSRmx225ZpbKblBn9grdb0B9tgZ0KTsLMSAAAAABJRU5ErkJggg==') + ')';
        this.mn().style.backgroundSize = 'contain';
        this.mn().style.animation = 'activityIndicatorRotate 840ms linear infinite';
        this.on(frame);
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  function blurRadius($this, propValue) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var radius = propValue;
    var tmp;
    if (radius <= 0) {
      tmp = 1.0;
    } else {
      var tmp_0;
      if (radius > 25.0) {
        tmp_0 = 25.0;
      } else {
        tmp_0 = radius;
      }
      tmp = tmp_0 * 5;
    }
    var blurRadius = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    var style = $this.mn().style;
    style.backdropFilter = 'blur(' + blurRadius + 'px)';
    style.webkitBackdropFilter = 'blur(' + blurRadius + 'px)';
    return true;
  }
  function Companion_5() {
    this.ao_1 = 'KRBlurView';
    this.bo_1 = 'blurRadius';
  }
  var Companion_instance_5;
  function Companion_getInstance_5() {
    return Companion_instance_5;
  }
  function KRBlurView() {
    this.zn_1 = kuiklyDocument.createElement('div');
  }
  protoOf(KRBlurView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.zn_1;
  };
  protoOf(KRBlurView).nn = function (propKey, propValue) {
    return propKey === 'blurRadius' ? blurRadius(this, propValue) : setProp.call(this, propKey, propValue);
  };
  function _get_canvasContext__c6ocxy($this) {
    var tmp;
    if (!($this.do_1 == null)) {
      tmp = $this.do_1;
    } else {
      var tmp_0 = $this;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_0.do_1 = $this.mn().getContext('2d');
      tmp = $this.do_1;
    }
    return tmp;
  }
  function moveTo($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var x = paramsJSON.fo('x');
    var y = paramsJSON.fo('y');
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.moveTo(x, y);
    }
  }
  function lineTo($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var x = paramsJSON.fo('x');
    var y = paramsJSON.fo('y');
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.lineTo(x, y);
    }
  }
  function arc($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var cx = paramsJSON.fo('x');
    var cy = paramsJSON.fo('y');
    var radius = paramsJSON.fo('r');
    var startAngle = paramsJSON.fo('sAngle');
    var endAngle = paramsJSON.fo('eAngle');
    var counterclockwise = paramsJSON.go('counterclockwise') === 1;
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
    }
  }
  function setStrokeStyle($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var style = paramsJSON.ho('style');
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      var tmp1_elvis_lhs = tryParseGradient($this, style);
      tmp0_safe_receiver.strokeStyle = tmp1_elvis_lhs == null ? toRgbColor(style) : tmp1_elvis_lhs;
    }
  }
  function setStrokeText($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.strokeText(paramsJSON.ho('text'), paramsJSON.fo('x'), paramsJSON.fo('y'));
    }
  }
  function setFillStyle($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var style = paramsJSON.ho('style');
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      var tmp1_elvis_lhs = tryParseGradient($this, style);
      tmp0_safe_receiver.fillStyle = tmp1_elvis_lhs == null ? toRgbColor(style) : tmp1_elvis_lhs;
    }
  }
  function setFillText($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.fillText(paramsJSON.ho('text'), paramsJSON.fo('x'), paramsJSON.fo('y'));
    }
  }
  function setLineWidth($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.lineWidth = paramsJSON.fo('width');
    }
  }
  function createLinearGradient($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var leftX = paramsJSON.fo('x0');
    var leftY = paramsJSON.fo('y0');
    var rightX = paramsJSON.fo('x1');
    var rightY = paramsJSON.fo('y1');
    var colorStops = paramsJSON.ho('colorStops');
    var colors = splitCanvasColorDefinitions(colorStops);
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    var gradient = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.createLinearGradient(leftX, leftY, rightX, rightY);
    colors.forEach(KRCanvasView$createLinearGradient$lambda(gradient));
    return gradient;
  }
  function tryParseGradient($this, style) {
    var gradientPrefix = 'linear-gradient';
    var tmp;
    if (startsWith(style, gradientPrefix)) {
      // Inline function 'kotlin.text.substring' call
      var startIndex = gradientPrefix.length;
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$1 = style.substring(startIndex);
      tmp = createLinearGradient($this, tmp$ret$1);
    } else {
      tmp = null;
    }
    return tmp;
  }
  function setLineCap($this, params) {
    var paramsJSON = toJSONObjectSafely(params);
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      var tmp;
      switch (paramsJSON.ho('style')) {
        case 'butt':
          // Inline function 'org.w3c.dom.BUTT' call

          // Inline function 'kotlin.js.asDynamic' call

          // Inline function 'kotlin.js.unsafeCast' call

          tmp = 'butt';
          break;
        case 'round':
          // Inline function 'org.w3c.dom.ROUND' call

          // Inline function 'kotlin.js.asDynamic' call

          // Inline function 'kotlin.js.unsafeCast' call

          tmp = 'round';
          break;
        default:
          // Inline function 'org.w3c.dom.SQUARE' call

          // Inline function 'kotlin.js.asDynamic' call

          // Inline function 'kotlin.js.unsafeCast' call

          tmp = 'square';
          break;
      }
      tmp0_safe_receiver.lineCap = tmp;
    }
  }
  function setLineDash($this, params) {
    var json = toJSONObjectSafely(params);
    var jsonArray = json.io('intervals');
    if (jsonArray == null) {
      var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
      if (tmp0_safe_receiver == null)
        null;
      else {
        // Inline function 'kotlin.arrayOf' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp$ret$2 = [];
        tmp0_safe_receiver.setLineDash(tmp$ret$2);
      }
    } else {
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var intervals = [];
      var inductionVariable = 0;
      var last = jsonArray.ko();
      if (inductionVariable < last)
        do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          intervals[i] = jsonArray.lo(i);
        }
         while (inductionVariable < last);
      var tmp1_safe_receiver = _get_canvasContext__c6ocxy($this);
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.setLineDash(intervals);
      }
    }
  }
  function quadraticCurveTo($this, params) {
    var json = toJSONObjectSafely(params);
    var cpx = json.fo('cpx');
    var cpy = json.fo('cpy');
    var x = json.fo('x');
    var y = json.fo('y');
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.quadraticCurveTo(cpx, cpy, x, y);
    }
  }
  function bezierCurveTo($this, params) {
    var json = toJSONObjectSafely(params);
    var cp1x = json.fo('cp1x');
    var cp1y = json.fo('cp1y');
    var cp2x = json.fo('cp2x');
    var cp2y = json.fo('cp2y');
    var x = json.fo('x');
    var y = json.fo('y');
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }
  }
  function reset($this) {
    var tmp0_safe_receiver = _get_canvasContext__c6ocxy($this);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.clearRect(0.0, 0.0, $this.mn().width, $this.mn().height);
    }
  }
  function Companion_6() {
    this.mo_1 = 'KRCanvasView';
    this.no_1 = 'beginPath';
    this.oo_1 = 'moveTo';
    this.po_1 = 'lineTo';
    this.qo_1 = 'arc';
    this.ro_1 = 'closePath';
    this.so_1 = 'stroke';
    this.to_1 = 'strokeStyle';
    this.uo_1 = 'strokeText';
    this.vo_1 = 'fill';
    this.wo_1 = 'fillStyle';
    this.xo_1 = 'fillText';
    this.yo_1 = 'lineWidth';
    this.zo_1 = 'lineCap';
    this.ap_1 = 'lineDash';
    this.bp_1 = 'clip';
    this.cp_1 = 'createLinearGradient';
    this.dp_1 = 'quadraticCurveTo';
    this.ep_1 = 'bezierCurveTo';
    this.fp_1 = 'reset';
    this.gp_1 = 'style';
    this.hp_1 = 'text';
    this.ip_1 = 'r';
    this.jp_1 = 'sAngle';
    this.kp_1 = 'eAngle';
    this.lp_1 = 'counterclockwise';
    this.mp_1 = 1;
  }
  var Companion_instance_6;
  function Companion_getInstance_6() {
    return Companion_instance_6;
  }
  function KRCanvasView$createLinearGradient$lambda($gradient) {
    return function (item) {
      var colorAndPosition = split(item, [' ']);
      var tmp0_safe_receiver = $gradient;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.addColorStop(toDouble(colorAndPosition.j(1)), toRgbColor(colorAndPosition.j(0)));
      }
      return Unit_instance;
    };
  }
  function KRCanvasView() {
    this.co_1 = kuiklyDocument.createElement('canvas');
    this.do_1 = null;
  }
  protoOf(KRCanvasView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.co_1;
  };
  protoOf(KRCanvasView).nn = function (propKey, propValue) {
    var tmp;
    if (propKey === 'frame') {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var frame = propValue;
      setFrame(this.mn(), frame, this.mn().style);
      this.mn().width = numberToInt(frame.yl_1);
      this.mn().height = numberToInt(frame.zl_1);
      this.on(frame);
      tmp = true;
    } else {
      tmp = setProp.call(this, propKey, propValue);
    }
    return tmp;
  };
  protoOf(KRCanvasView).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'beginPath':
        var tmp1_safe_receiver = _get_canvasContext__c6ocxy(this);
        var tmp_0;
        if (tmp1_safe_receiver == null) {
          tmp_0 = null;
        } else {
          tmp1_safe_receiver.beginPath();
          tmp_0 = Unit_instance;
        }

        tmp = tmp_0;
        break;
      case 'moveTo':
        moveTo(this, params);
        tmp = Unit_instance;
        break;
      case 'lineTo':
        lineTo(this, params);
        tmp = Unit_instance;
        break;
      case 'arc':
        arc(this, params);
        tmp = Unit_instance;
        break;
      case 'closePath':
        var tmp2_safe_receiver = _get_canvasContext__c6ocxy(this);
        var tmp_1;
        if (tmp2_safe_receiver == null) {
          tmp_1 = null;
        } else {
          tmp2_safe_receiver.closePath();
          tmp_1 = Unit_instance;
        }

        tmp = tmp_1;
        break;
      case 'stroke':
        var tmp3_safe_receiver = _get_canvasContext__c6ocxy(this);
        var tmp_2;
        if (tmp3_safe_receiver == null) {
          tmp_2 = null;
        } else {
          tmp3_safe_receiver.stroke();
          tmp_2 = Unit_instance;
        }

        tmp = tmp_2;
        break;
      case 'strokeStyle':
        setStrokeStyle(this, params);
        tmp = Unit_instance;
        break;
      case 'strokeText':
        setStrokeText(this, params);
        tmp = Unit_instance;
        break;
      case 'fill':
        var tmp4_safe_receiver = _get_canvasContext__c6ocxy(this);
        var tmp_3;
        if (tmp4_safe_receiver == null) {
          tmp_3 = null;
        } else {
          tmp4_safe_receiver.fill();
          tmp_3 = Unit_instance;
        }

        tmp = tmp_3;
        break;
      case 'fillText':
        setFillText(this, params);
        tmp = Unit_instance;
        break;
      case 'fillStyle':
        setFillStyle(this, params);
        tmp = Unit_instance;
        break;
      case 'lineWidth':
        setLineWidth(this, params);
        tmp = Unit_instance;
        break;
      case 'lineCap':
        setLineCap(this, params);
        tmp = Unit_instance;
        break;
      case 'lineDash':
        setLineDash(this, params);
        tmp = Unit_instance;
        break;
      case 'createLinearGradient':
        tmp = Unit_instance;
        break;
      case 'quadraticCurveTo':
        quadraticCurveTo(this, params);
        tmp = Unit_instance;
        break;
      case 'bezierCurveTo':
        bezierCurveTo(this, params);
        tmp = Unit_instance;
        break;
      case 'reset':
        reset(this);
        tmp = Unit_instance;
        break;
      case 'clip':
        var tmp5_safe_receiver = _get_canvasContext__c6ocxy(this);
        var tmp_4;
        if (tmp5_safe_receiver == null) {
          tmp_4 = null;
        } else {
          tmp5_safe_receiver.clip();
          tmp_4 = Unit_instance;
        }

        tmp = tmp_4;
        break;
      default:
        tmp = call_0.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function setBringIndex($this, index) {
    var tmp = $this.mn().style;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.zIndex = index.toString();
    return true;
  }
  function getTotalTop($this, element) {
    var totalTop = 0.0;
    if (element == null) {
      return totalTop;
    }
    totalTop = totalTop + pxToFloat(element.style.top);
    var parent = element.parentElement;
    while (!(parent === null)) {
      var tmp = totalTop;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$1 = parent;
      totalTop = tmp + pxToFloat(tmp$ret$1.style.top);
      parent = parent.parentElement;
    }
    return totalTop;
  }
  function setHoverMarginTop($this, propValue) {
    var tmp = $this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.pp_1 = propValue;
    return true;
  }
  function Companion_7() {
    this.qp_1 = 'KRHoverView';
    this.rp_1 = 'bringIndex';
    this.sp_1 = 'hoverMarginTop';
  }
  var Companion_instance_7;
  function Companion_getInstance_7() {
    return Companion_instance_7;
  }
  function KRHoverView$onAddToParent$lambda($grandParent, this$0, $totalTop) {
    return function (it) {
      var contentOffsetTop = $grandParent.scrollTop;
      var tmp;
      if (contentOffsetTop > this$0.op_1 - this$0.pp_1) {
        this$0.mn().style.position = 'fixed';
        this$0.mn().style.top = '' + ($totalTop + this$0.pp_1) + 'px';
        tmp = Unit_instance;
      } else {
        this$0.mn().style.position = 'absolute';
        this$0.mn().style.top = toPxF(this$0.op_1);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRHoverView() {
    this.np_1 = kuiklyDocument.createElement('div');
    this.op_1 = 0.0;
    this.pp_1 = 0.0;
  }
  protoOf(KRHoverView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.np_1;
  };
  protoOf(KRHoverView).un = function (parent) {
    onAddToParent.call(this, parent);
    if (!(parent.parentElement === null)) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var grandParent = parent.parentElement;
      var totalTop = getTotalTop(this, grandParent);
      this.op_1 = pxToFloat(this.mn().style.top);
      if (grandParent == null)
        null;
      else {
        grandParent.addEventListener('scroll', KRHoverView$onAddToParent$lambda(grandParent, this, totalTop), json([to('passive', true)]));
      }
    }
  };
  protoOf(KRHoverView).nn = function (propKey, propValue) {
    switch (propKey) {
      case 'hoverMarginTop':
        return setHoverMarginTop(this, propValue);
      case 'bringIndex':
        return setBringIndex(this, propValue);
      default:
        return setProp.call(this, propKey, propValue);
    }
  };
  function tintColorIfNeed($this) {
    if (!($this.xp_1 === 0.0) && !($this.wp_1 === '')) {
      $this.up_1.style.borderBottom = toPxF($this.xp_1) + ' solid transparent';
      $this.up_1.style.transform = 'translate(0px, ' + toPxF(-$this.xp_1) + ')';
      $this.up_1.style.filter = 'drop-shadow(0px ' + toPxF($this.xp_1) + ' 0px ' + toRgbColor($this.wp_1) + ')';
    }
  }
  function isBase64Src($this, src) {
    return startsWith(src, 'data:image');
  }
  function getBase64Image($this, key) {
    var tmp0_safe_receiver = $this.jg();
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.tg('KRMemoryCacheModule');
    return tmp1_safe_receiver == null ? null : tmp1_safe_receiver.dq(key);
  }
  function setSrc($this, src) {
    if (!(src === '')) {
      if (isAssetsSrc($this, src)) {
        $this.up_1.src = KuiklyProcessor_instance.eq().fq(src);
      } else if (isBase64Src($this, src)) {
        var base64Image = getBase64Image($this, src);
        if (!(base64Image == null)) {
          $this.up_1.src = base64Image;
        }
      } else {
        $this.up_1.src = src;
      }
    }
  }
  function setResize($this, propValue) {
    var tmp = $this.up_1.style;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_0;
    if (propValue === 'stretch') {
      tmp_0 = 'fill';
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_0 = propValue;
    }
    tmp.objectFit = tmp_0;
  }
  function isAssetsSrc($this, src) {
    return startsWith(src, 'assets://') || startsWith(src, 'file://');
  }
  function Companion_8() {
    this.gq_1 = 'KRImageView';
    this.hq_1 = 'KRAPNGView';
    this.iq_1 = 'data:image';
    this.jq_1 = 'src';
    this.kq_1 = 'imageWidth';
    this.lq_1 = 'imageHeight';
    this.mq_1 = 'resize';
    this.nq_1 = 'loadSuccess';
    this.oq_1 = 'loadFailure';
    this.pq_1 = 'errorCode';
    this.qq_1 = -10001;
    this.rq_1 = 'loadResolution';
    this.sq_1 = 'tintColor';
    this.tq_1 = 'dotNineImage';
    this.uq_1 = 'blurRadius';
    this.vq_1 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    this.wq_1 = 'assets://';
    this.xq_1 = 'file://';
  }
  var Companion_instance_8;
  function Companion_getInstance_8() {
    return Companion_instance_8;
  }
  function KRImageView$image$lambda(this$0, $imageElement) {
    return function (it) {
      var tmp0_safe_receiver = this$0.yp_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(mapOf(to('src', $imageElement.src)));
      }
      var tmp1_safe_receiver = this$0.zp_1;
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.zq(mapOf_0([to('imageWidth', $imageElement.naturalWidth), to('imageHeight', $imageElement.naturalHeight)]));
      }
      return Unit_instance;
    };
  }
  function KRImageView$image$lambda_0($imageElement, this$0) {
    return function (it) {
      $imageElement.style.display = 'none';
      var tmp0_safe_receiver = this$0.aq_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(mapOf_0([to('src', $imageElement.src), to('errorCode', -10001)]));
      }
      return Unit_instance;
    };
  }
  function KRImageView(kuiklyRenderContext) {
    this.tp_1 = kuiklyRenderContext;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('img');
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var imageElement = this_0;
    imageElement.style.width = '100%';
    imageElement.style.height = '100%';
    imageElement.style.display = 'block';
    imageElement.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    imageElement.addEventListener('load', KRImageView$image$lambda(this, imageElement));
    imageElement.addEventListener('error', KRImageView$image$lambda_0(imageElement, this));
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.up_1 = this_0;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = kuiklyDocument.createElement('div');
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var divElement = this_1;
    divElement.style.overflowX = 'hidden';
    divElement.style.overflowY = 'hidden';
    this_1.appendChild(this.up_1);
    tmp_0.vp_1 = this_1;
    this.wp_1 = '';
    this.xp_1 = 0.0;
    this.yp_1 = null;
    this.zp_1 = null;
    this.aq_1 = null;
  }
  protoOf(KRImageView).qn = function (_set____db54di) {
    this.tp_1 = _set____db54di;
  };
  protoOf(KRImageView).jg = function () {
    return this.tp_1;
  };
  protoOf(KRImageView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.vp_1;
  };
  protoOf(KRImageView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'src':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setSrc(this, propValue);
        tmp = true;
        break;
      case 'resize':
        setResize(this, propValue);
        tmp = true;
        break;
      case 'loadSuccess':
        var tmp_0 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.yp_1 = propValue;
        tmp = true;
        break;
      case 'loadResolution':
        var tmp_1 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_1.zp_1 = propValue;
        tmp = true;
        break;
      case 'loadFailure':
        var tmp_2 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_2.aq_1 = propValue;
        tmp = true;
        break;
      case 'tintColor':
        var tmp_3 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_3.wp_1 = toRgbColor(propValue);
        tintColorIfNeed(this);
        tmp = true;
        break;
      case 'frame':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        var frame = propValue;
        this.xp_1 = frame.yl_1;
        setFrame(this.mn(), frame, this.mn().style);
        tintColorIfNeed(this);
        tmp = true;
        break;
      case 'dotNineImage':
        tmp = true;
        break;
      case 'blurRadius':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        var value = propValue;
        this.mn().style.filter = 'blur(' + value * 2 + 'px)';
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  function Companion_9() {
    this.ar_1 = 'KRMaskView';
  }
  var Companion_instance_9;
  function Companion_getInstance_9() {
    return Companion_instance_9;
  }
  function KRMaskView() {
    this.br_1 = kuiklyDocument.createElement('div');
  }
  protoOf(KRMaskView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.br_1;
  };
  function getEventName($this, eventName) {
    // Inline function 'kotlin.text.replaceFirstChar' call
    var tmp;
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(eventName) > 0) {
      var it = charSequenceGet(eventName, 0);
      var tmp3 = uppercaseChar(it);
      // Inline function 'kotlin.text.substring' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.text.plus' call
      var other = eventName.substring(1);
      tmp = toString_1(tmp3) + other;
    } else {
      tmp = eventName;
    }
    return 'on' + tmp;
  }
  function addAllEventListener($this) {
    if (!($this.jr_1 === null) && $this.nr_1 === null) {
      var tmp = $this;
      tmp.nr_1 = KRPagView$addAllEventListener$lambda($this);
      var tmp0_safe_receiver = $this.dr_1;
      if (tmp0_safe_receiver == null)
        null;
      else
        tmp0_safe_receiver.addListener(getEventName($this, 'animationStart'), $this.nr_1);
    }
    if (!($this.lr_1 === null) && $this.pr_1 === null) {
      var tmp_0 = $this;
      tmp_0.pr_1 = KRPagView$addAllEventListener$lambda_0($this);
      var tmp1_safe_receiver = $this.dr_1;
      if (tmp1_safe_receiver == null)
        null;
      else
        tmp1_safe_receiver.addListener(getEventName($this, 'animationCancel'), $this.pr_1);
    }
    if (!($this.mr_1 === null) && $this.qr_1 === null) {
      var tmp_1 = $this;
      tmp_1.qr_1 = KRPagView$addAllEventListener$lambda_1($this);
      var tmp2_safe_receiver = $this.dr_1;
      if (tmp2_safe_receiver == null)
        null;
      else
        tmp2_safe_receiver.addListener(getEventName($this, 'animationRepeat'), $this.qr_1);
    }
    if (!($this.kr_1 === null) && $this.or_1 === null) {
      var tmp_2 = $this;
      tmp_2.or_1 = KRPagView$addAllEventListener$lambda_2($this);
      var tmp3_safe_receiver = $this.dr_1;
      if (tmp3_safe_receiver == null)
        null;
      else
        tmp3_safe_receiver.addListener(getEventName($this, 'animationEnd'), $this.or_1);
    }
  }
  function removeAllEventListener($this) {
    if (!($this.nr_1 === null)) {
      var tmp0_safe_receiver = $this.dr_1;
      if (tmp0_safe_receiver == null)
        null;
      else
        tmp0_safe_receiver.removeListener(getEventName($this, 'animationStart'), $this.nr_1);
    }
    if (!($this.pr_1 === null)) {
      var tmp1_safe_receiver = $this.dr_1;
      if (tmp1_safe_receiver == null)
        null;
      else
        tmp1_safe_receiver.removeListener(getEventName($this, 'animationCancel'), $this.pr_1);
    }
    if (!($this.qr_1 === null)) {
      var tmp2_safe_receiver = $this.dr_1;
      if (tmp2_safe_receiver == null)
        null;
      else
        tmp2_safe_receiver.removeListener(getEventName($this, 'animationRepeat'), $this.qr_1);
    }
    if (!($this.or_1 === null)) {
      var tmp3_safe_receiver = $this.dr_1;
      if (tmp3_safe_receiver == null)
        null;
      else
        tmp3_safe_receiver.removeListener(getEventName($this, 'animationEnd'), $this.or_1);
    }
  }
  function stop($this) {
    $this.fr_1 = false;
    if (!$this.gr_1) {
      $this.gr_1 = true;
      var tmp0_safe_receiver = $this.dr_1;
      if (tmp0_safe_receiver == null)
        null;
      else
        tmp0_safe_receiver.stop();
    }
  }
  function play($this) {
    addAllEventListener($this);
    $this.fr_1 = true;
    $this.gr_1 = false;
    var tmp0_safe_receiver = $this.dr_1;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.play();
  }
  function destroy($this) {
    stop($this);
    removeAllEventListener($this);
    var tmp0_safe_receiver = $this.dr_1;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.destroy();
  }
  function tryAutoPlay($this) {
    if ($this.fr_1) {
      var tmp0_safe_receiver = $this.dr_1;
      if (tmp0_safe_receiver == null)
        null;
      else
        tmp0_safe_receiver.play();
    }
  }
  function autoPlay($this, propValue) {
    var tmp = $this;
    tmp.fr_1 = (typeof propValue === 'number' ? propValue : THROW_CCE()) === 1;
    if ($this.fr_1) {
      tryAutoPlay($this);
    }
  }
  function loadPagFile($this, buffer) {
    // Inline function 'kotlin.js.asDynamic' call
    var pagInstance = kuiklyWindow.PAGInstance;
    pagInstance.PAGFile.load(buffer).then(KRPagView$loadPagFile$lambda($this, pagInstance)).catch(KRPagView$loadPagFile$lambda_0($this));
  }
  function initPag($this, src) {
    var tmp = kuiklyWindow.fetch(src);
    var tmp_0 = tmp.then(KRPagView$initPag$lambda($this));
    tmp_0.catch(KRPagView$initPag$lambda_0($this));
  }
  function setSrc_0($this, params) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var newSrc = params;
    if ($this.er_1 === newSrc || !startsWith(newSrc, 'https')) {
      return Unit_instance;
    }
    $this.er_1 = newSrc;
    initPag($this, newSrc);
  }
  function Companion_10() {
    this.rr_1 = 'src';
    this.sr_1 = 'repeatCount';
    this.tr_1 = 'autoPlay';
    this.ur_1 = 'loadFailure';
    this.vr_1 = 'animationStart';
    this.wr_1 = 'animationEnd';
    this.xr_1 = 'animationCancel';
    this.yr_1 = 'animationRepeat';
    this.zr_1 = 'play';
    this.as_1 = 'stop';
    this.bs_1 = 'KRPAGView';
  }
  var Companion_instance_10;
  function Companion_getInstance_10() {
    return Companion_instance_10;
  }
  function KRPagView$addAllEventListener$lambda(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.jr_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(null);
      }
      return Unit_instance;
    };
  }
  function KRPagView$addAllEventListener$lambda_0(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.lr_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(null);
      }
      return Unit_instance;
    };
  }
  function KRPagView$addAllEventListener$lambda_1(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.mr_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(null);
      }
      return Unit_instance;
    };
  }
  function KRPagView$addAllEventListener$lambda_2(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.kr_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(null);
      }
      return Unit_instance;
    };
  }
  function KRPagView$loadPagFile$lambda$lambda(this$0) {
    return function (realPagView) {
      var tmp;
      if (realPagView !== undefined) {
        this$0.dr_1 = realPagView;
        this$0.dr_1.setRepeatCount(this$0.hr_1);
        addAllEventListener(this$0);
        tryAutoPlay(this$0);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRPagView$loadPagFile$lambda(this$0, $pagInstance) {
    return function (pagFile) {
      var tmp;
      if (pagFile !== undefined) {
        var tmp_0 = this$0.mn();
        // Inline function 'kotlin.js.unsafeCast' call
        tmp_0.width = pagFile.width();
        var tmp_1 = this$0.mn();
        // Inline function 'kotlin.js.unsafeCast' call
        tmp_1.height = pagFile.height();
        $pagInstance.PAGView.init(pagFile, this$0.mn()).then(KRPagView$loadPagFile$lambda$lambda(this$0));
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRPagView$loadPagFile$lambda_0(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.ir_1;
      var tmp;
      if (tmp0_safe_receiver == null) {
        tmp = null;
      } else {
        tmp0_safe_receiver.zq(null);
        tmp = Unit_instance;
      }
      return tmp;
    };
  }
  function KRPagView$initPag$lambda$lambda$lambda(this$0, $buffer) {
    return function (instance) {
      var tmp;
      if (instance !== undefined) {
        // Inline function 'kotlin.js.asDynamic' call
        kuiklyWindow.PAGInstance = instance;
        loadPagFile(this$0, $buffer);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRPagView$initPag$lambda$lambda(this$0) {
    return function (buffer) {
      // Inline function 'kotlin.js.asDynamic' call
      var pagInstance = kuiklyWindow.PAGInstance;
      var tmp;
      if (pagInstance !== undefined) {
        loadPagFile(this$0, buffer);
        tmp = Unit_instance;
      } else {
        // Inline function 'kotlin.js.asDynamic' call
        tmp = kuiklyWindow.libpag.PAGInit().then(KRPagView$initPag$lambda$lambda$lambda(this$0, buffer));
      }
      return tmp;
    };
  }
  function KRPagView$initPag$lambda(this$0) {
    return function (response) {
      var tmp;
      if (!response.ok) {
        var tmp0_safe_receiver = this$0.ir_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(null);
        }
        return Unit_instance;
      }
      var tmp_0 = response.arrayBuffer();
      tmp_0.then(KRPagView$initPag$lambda$lambda(this$0));
      return Unit_instance;
    };
  }
  function KRPagView$initPag$lambda_0(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.ir_1;
      var tmp;
      if (tmp0_safe_receiver == null) {
        tmp = null;
      } else {
        tmp0_safe_receiver.zq(null);
        tmp = Unit_instance;
      }
      return tmp;
    };
  }
  function KRPagView() {
    this.cr_1 = kuiklyDocument.createElement('canvas');
    this.dr_1 = null;
    this.er_1 = '';
    this.fr_1 = true;
    this.gr_1 = false;
    this.hr_1 = 0;
    this.ir_1 = null;
    this.jr_1 = null;
    this.kr_1 = null;
    this.lr_1 = null;
    this.mr_1 = null;
    this.nr_1 = null;
    this.or_1 = null;
    this.pr_1 = null;
    this.qr_1 = null;
  }
  protoOf(KRPagView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.cr_1;
  };
  protoOf(KRPagView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'src':
        setSrc_0(this, propValue);
        return true;
      case 'repeatCount':
        var tmp_0 = this;
        tmp_0.hr_1 = typeof propValue === 'number' ? propValue : THROW_CCE();
        return true;
      case 'autoPlay':
        autoPlay(this, propValue);
        return true;
      case 'loadFailure':
        var tmp_1 = this;
        tmp_1.ir_1 = propValue instanceof KuiklyRenderCallback ? propValue : THROW_CCE();
        tmp = true;
        break;
      case 'animationStart':
        var tmp_2 = this;
        tmp_2.jr_1 = propValue instanceof KuiklyRenderCallback ? propValue : THROW_CCE();
        tmp = true;
        break;
      case 'animationEnd':
        var tmp_3 = this;
        tmp_3.kr_1 = propValue instanceof KuiklyRenderCallback ? propValue : THROW_CCE();
        tmp = true;
        break;
      case 'animationCancel':
        var tmp_4 = this;
        tmp_4.lr_1 = propValue instanceof KuiklyRenderCallback ? propValue : THROW_CCE();
        tmp = true;
        break;
      case 'animationRepeat':
        var tmp_5 = this;
        tmp_5.mr_1 = propValue instanceof KuiklyRenderCallback ? propValue : THROW_CCE();
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  protoOf(KRPagView).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'play':
        play(this);
        tmp = Unit_instance;
        break;
      case 'stop':
        stop(this);
        tmp = Unit_instance;
        break;
      default:
        tmp = call_0.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  protoOf(KRPagView).ig = function () {
    onDestroy.call(this);
    destroy(this);
  };
  function Companion_11() {
    this.cs_1 = 'values';
    this.ds_1 = 'text';
    this.es_1 = 'fontSize';
    this.fs_1 = 'textPostProcessor';
    this.gs_1 = 16.0;
  }
  var Companion_instance_11;
  function Companion_getInstance_11() {
    return Companion_instance_11;
  }
  function KRTextProps() {
    this.hs_1 = null;
    this.is_1 = '';
    this.js_1 = 16.0;
    this.ks_1 = '';
    this.ls_1 = false;
  }
  protoOf(KRTextProps).ms = function (propKey, propValue) {
    switch (propKey) {
      case 'values':
        var tmp = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp.hs_1 = JSONArray_init_$Create$_0(propValue);
        break;
      case 'text':
        var tmp_0 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.is_1 = propValue;
        break;
      case 'fontSize':
        this.js_1 = toNumberFloat(propValue);
        break;
      case 'textPostProcessor':
        var tmp_1 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_1.ks_1 = propValue;
        break;
    }
  };
  function setLineBreakMode($this, lineBreakMode) {
    if ($this.os_1 > 0) {
      return Unit_instance;
    }
    if (lineBreakMode === 'wordWrapping') {
      $this.mn().style.overflowX = 'hidden';
      $this.mn().style.overflowY = 'hidden';
      $this.mn().style.whiteSpace = 'nowrap';
      $this.mn().style.wordBreak = 'break-word';
      $this.mn().style.textOverflow = 'ellipsis';
    } else {
      $this.mn().style.overflowX = 'hidden';
      $this.mn().style.overflowY = 'hidden';
      $this.mn().style.whiteSpace = 'nowrap';
      $this.mn().style.wordBreak = 'break-all';
      $this.mn().style.textOverflow = 'ellipsis';
    }
  }
  function getPlaceholderSpanRect($this, index) {
    var rectInfo = '0.0 0.0 0.0 0.0';
    if (!(index == null)) {
      // Inline function 'org.w3c.dom.get' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var placeholderSpan = $this.mn().childNodes[index];
      if (!(placeholderSpan == null) && !(placeholderSpan.style.width === '') && !(placeholderSpan.style.height === '')) {
        // Inline function 'kotlin.with' call
        rectInfo = '' + placeholderSpan.offsetLeft + ' ' + placeholderSpan.offsetTop + ' ' + placeholderSpan.offsetWidth + ' ' + placeholderSpan.offsetHeight;
      }
    }
    return rectInfo;
  }
  function setBackgroundImage($this, value) {
    var backgroundImagePrefix = 'background-image: ';
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var stringValue = value;
    if (startsWith(stringValue, backgroundImagePrefix)) {
      var tmp = $this.mn().style;
      var tmp2 = backgroundImagePrefix.length;
      // Inline function 'kotlin.text.substring' call
      var endIndex = stringValue.length - 1 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      tmp.backgroundImage = stringValue.substring(tmp2, endIndex);
    } else {
      var tmp_0 = $this.mn().style;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_0.backgroundImage = getCSSBackgroundImage(value);
      $this.mn().style.backgroundClip = 'text';
      // Inline function 'kotlin.js.asDynamic' call
      $this.mn().style.webkitBackgroundClip = 'text';
      $this.mn().style.color = 'transparent';
    }
  }
  function Companion_12() {
    this.ot_1 = 'KRRichTextView';
    this.pt_1 = 'KRGradientRichTextView';
    this.qt_1 = 'placeholderWidth';
    this.rt_1 = 'placeholderHeight';
    this.st_1 = 'numberOfLines';
    this.tt_1 = 'lineBreakMode';
    this.ut_1 = 'lineBreakMargin';
    this.vt_1 = 'values';
    this.wt_1 = 'text';
    this.xt_1 = 'textAlign';
    this.yt_1 = 'lineSpacing';
    this.zt_1 = 'lineHeight';
    this.au_1 = 'letterSpacing';
    this.bu_1 = 'color';
    this.cu_1 = 'fontSize';
    this.du_1 = 'textDecoration';
    this.eu_1 = 'fontWeight';
    this.fu_1 = 'fontStyle';
    this.gu_1 = 'fontFamily';
    this.hu_1 = 'backgroundImage';
    this.iu_1 = 'strokeWidth';
    this.ju_1 = 'strokeColor';
    this.ku_1 = 'fontVariant';
    this.lu_1 = 'spanRect';
    this.mu_1 = 'headIndent';
    this.nu_1 = 'grabText';
    this.ou_1 = 'wordWrapping';
  }
  var Companion_instance_12;
  function Companion_getInstance_12() {
    return Companion_instance_12;
  }
  function KRRichTextView() {
    this.ns_1 = new KRTextProps();
    this.os_1 = 0;
    this.ps_1 = false;
    this.qs_1 = '';
    this.rs_1 = 0.0;
    this.ss_1 = 0.0;
    this.ts_1 = new Array();
    this.us_1 = new Array();
    this.vs_1 = new Array();
    this.ws_1 = 0;
    this.xs_1 = '';
    this.ys_1 = 0;
    this.zs_1 = '';
    this.at_1 = null;
    this.bt_1 = '';
    this.ct_1 = 1.0;
    this.dt_1 = '';
    this.et_1 = '';
    this.ft_1 = 0.0;
    this.gt_1 = '';
    this.ht_1 = 'normal';
    this.it_1 = '';
    this.jt_1 = 0.0;
    this.kt_1 = '';
    this.lt_1 = 13.0;
    this.mt_1 = '';
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('p');
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var style = this_0.style;
    style.margin = '0';
    style.wordBreak = 'break-word';
    style.fontSize = '' + this.lt_1 + 'px';
    style.display = 'inline-block';
    // Inline function 'kotlin.js.asDynamic' call
    this_0.krRichTextView = this;
    tmp.nt_1 = this_0;
  }
  protoOf(KRRichTextView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.nt_1;
  };
  protoOf(KRRichTextView).pu = function (propKey, propValue) {
    var style = this.mn().style;
    this.ns_1.ms(propKey, propValue);
    switch (propKey) {
      case 'numberOfLines':
        var tmp = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp.os_1 = propValue;
        break;
      case 'lineBreakMargin':
        this.ft_1 = toNumberFloat(propValue);
        setLineBreakMode(this, '');
        break;
      case 'lineBreakMode':
        var tmp_0 = this;
        tmp_0.zs_1 = typeof propValue === 'string' ? propValue : THROW_CCE();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setLineBreakMode(this, propValue);
        break;
      case 'headIndent':
        this.mn().style.textIndent = toPxF(propValue);
        break;
      case 'values':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        var richTextValues = JSONArray_init_$Create$_0(propValue);
        this.at_1 = richTextValues;
        this.ps_1 = true;
        KuiklyProcessor_instance.qu().ru(richTextValues, this);
        break;
      case 'text':
        var tmp_1 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_1.bt_1 = propValue;
        this.mt_1 = this.bt_1;
        // Inline function 'kotlin.text.isNotEmpty' call

        var this_0 = this.ns_1.ks_1;
        if (charSequenceLength(this_0) > 0) {
          var tmp1_safe_receiver = KuiklyRenderAdapterManager_instance.kh_1;
          var tmp2_safe_receiver = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.su(new TextPostProcessorInput(this.ns_1.ks_1, this.bt_1, this.ns_1));
          var tmp3_safe_receiver = tmp2_safe_receiver == null ? null : tmp2_safe_receiver.tu_1;
          var tmp_2;
          if (tmp3_safe_receiver == null) {
            tmp_2 = null;
          } else {
            // Inline function 'kotlin.let' call
            var tmp_3 = this;
            // Inline function 'kotlin.js.unsafeCast' call
            // Inline function 'kotlin.js.asDynamic' call
            tmp_3.mt_1 = tmp3_safe_receiver;
            this.ns_1.ls_1 = true;
            tmp_2 = Unit_instance;
          }
          if (tmp_2 == null) {
            // Inline function 'kotlin.run' call
            this.mt_1 = this.bt_1;
          }
        } else {
          this.mt_1 = this.bt_1;
        }

        this.qs_1 = this.mt_1;
        break;
      case 'textPostProcessor':
        var tmp_4;
        // Inline function 'kotlin.text.isNotEmpty' call

        var this_1 = this.mn().innerText;
        if (charSequenceLength(this_1) > 0) {
          tmp_4 = !this.ns_1.ls_1;
        } else {
          tmp_4 = false;
        }

        if (tmp_4) {
          var tmp5_safe_receiver = KuiklyRenderAdapterManager_instance.kh_1;
          var tmp6_safe_receiver = tmp5_safe_receiver == null ? null : tmp5_safe_receiver.su(new TextPostProcessorInput(this.ns_1.ks_1, this.bt_1, this.ns_1));
          var tmp7_safe_receiver = tmp6_safe_receiver == null ? null : tmp6_safe_receiver.tu_1;
          if (tmp7_safe_receiver == null)
            null;
          else {
            // Inline function 'kotlin.let' call
            if (!equals(tmp7_safe_receiver, this.bt_1)) {
              var tmp_5 = this.mn();
              // Inline function 'kotlin.js.unsafeCast' call
              // Inline function 'kotlin.js.asDynamic' call
              tmp_5.innerText = tmp7_safe_receiver;
              this.ns_1.ls_1 = true;
            }
          }
        }

        break;
      case 'color':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        style.color = toRgbColor(propValue);
        break;
      case 'letterSpacing':
        style.letterSpacing = toPxF(propValue);
        break;
      case 'textDecoration':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        style.textDecoration = propValue;
        break;
      case 'textAlign':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        style.textAlign = propValue;
        break;
      case 'lineSpacing':
        style.lineHeight = toNumberFloat(propValue).toString();
        break;
      case 'lineHeight':
        style.lineHeight = toPxF(toNumberFloat(propValue));
        break;
      case 'fontWeight':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        style.fontWeight = propValue;
        break;
      case 'fontStyle':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        style.fontStyle = propValue;
        break;
      case 'fontFamily':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        style.fontFamily = propValue;
        break;
      case 'fontSize':
        style.fontSize = toPxF(toNumberFloat(propValue));
        break;
      case 'backgroundImage':
        setBackgroundImage(this, propValue);
        break;
      default:
        break;
    }
  };
  protoOf(KRRichTextView).sn = function (shadow) {
    setShadow.call(this, shadow);
    if (!this.uu()) {
      this.mn().innerText = this.mt_1;
    }
  };
  protoOf(KRRichTextView).uu = function () {
    var tmp;
    if (this.ps_1) {
      var tmp0_safe_receiver = this.at_1;
      var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.ko();
      tmp = (tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs) > 0;
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(KRRichTextView).vu = function (constraintSize) {
    return KuiklyProcessor_instance.qu().wu(constraintSize, this, this.mt_1);
  };
  protoOf(KRRichTextView).xu = function (methodName, params) {
    var tmp;
    if (methodName === 'spanRect') {
      tmp = getPlaceholderSpanRect(this, toInt(params));
    } else {
      tmp = call_1.call(this, methodName, params);
    }
    return tmp;
  };
  protoOf(KRRichTextView).yu = function (jsonObject) {
    var text = jsonObject.zu('value', '');
    // Inline function 'kotlin.text.isEmpty' call
    var this_0 = text;
    if (charSequenceLength(this_0) === 0) {
      text = jsonObject.ho('text');
    }
    // Inline function 'kotlin.text.ifEmpty' call
    var this_1 = text;
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(this_1) === 0) {
      tmp = null;
    } else {
      tmp = this_1;
    }
    return tmp;
  };
  function Companion_13() {
    this.av_1 = 'KRScrollContentView';
  }
  var Companion_instance_13;
  function Companion_getInstance_13() {
    return Companion_instance_13;
  }
  function KRScrollContentView() {
    var tmp = this;
    var tmp_0 = kuiklyDocument;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$1 = 'KRScrollContentView';
    tmp.bv_1 = tmp_0.createElement('div', tmp$ret$1);
  }
  protoOf(KRScrollContentView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.bv_1;
  };
  function notifyTextValueChanged($this, text) {
    // Inline function 'kotlin.collections.mutableMapOf' call
    var map = LinkedHashMap_init_$Create$();
    // Inline function 'kotlin.collections.set' call
    map.k2('text', text);
    var tmp0_safe_receiver = $this.cv_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(map);
    }
  }
  function setReturnKeyType($this, returnKeyType) {
    var supportedTypes = setOf(['search', 'send', 'done', 'go']);
    var tmp;
    if (supportedTypes.w(returnKeyType)) {
      tmp = returnKeyType;
    } else {
      tmp = 'next';
    }
    var returnKey = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    $this.mn().enterKeyHint = returnKey;
  }
  function Companion_14() {
    this.iv_1 = 'KRTextAreaView';
    this.jv_1 = 'text';
    this.kv_1 = 'placeholder';
    this.lv_1 = 'placeholderColor';
    this.mv_1 = 'textAlign';
    this.nv_1 = 'fontSize';
    this.ov_1 = 'fontWeight';
    this.pv_1 = 'tintColor';
    this.qv_1 = 'maxTextLength';
    this.rv_1 = 'autofocus';
    this.sv_1 = 'editable';
    this.tv_1 = 'keyboardType';
    this.uv_1 = 'returnKeyType';
    this.vv_1 = 'setText';
    this.wv_1 = 'focus';
    this.xv_1 = 'blur';
    this.yv_1 = 'getCursorIndex';
    this.zv_1 = 'setCursorIndex';
    this.aw_1 = 'textDidChange';
    this.bw_1 = 'inputFocus';
    this.cw_1 = 'inputBlur';
    this.dw_1 = 'inputReturn';
    this.ew_1 = 'textLengthBeyondLimit';
  }
  var Companion_instance_14;
  function Companion_getInstance_14() {
    return Companion_instance_14;
  }
  function KRTextAreaView$setProp$lambda(this$0) {
    return function (it) {
      notifyTextValueChanged(this$0, this$0.mn().value);
      return Unit_instance;
    };
  }
  function KRTextAreaView$setProp$lambda_0(this$0) {
    return function (it) {
      // Inline function 'kotlin.collections.mutableMapOf' call
      var map = LinkedHashMap_init_$Create$();
      // Inline function 'kotlin.collections.set' call
      var value = this$0.mn().value;
      map.k2('text', value);
      var tmp0_safe_receiver = this$0.dv_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(map);
      }
      return Unit_instance;
    };
  }
  function KRTextAreaView$setProp$lambda_1(this$0) {
    return function (it) {
      // Inline function 'kotlin.collections.mutableMapOf' call
      var map = LinkedHashMap_init_$Create$();
      // Inline function 'kotlin.collections.set' call
      var value = this$0.mn().value;
      map.k2('text', value);
      var tmp0_safe_receiver = this$0.ev_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(map);
      }
      return Unit_instance;
    };
  }
  function KRTextAreaView$setProp$lambda_2(this$0) {
    return function (it) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var event = it;
      var tmp;
      if (event.key === 'Enter' || event.keyCode === 13) {
        // Inline function 'kotlin.collections.mutableMapOf' call
        var map = LinkedHashMap_init_$Create$();
        // Inline function 'kotlin.collections.set' call
        var value = this$0.mn().value;
        map.k2('text', value);
        var tmp0_safe_receiver = this$0.fv_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(map);
        }
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRTextAreaView$setProp$lambda_3(this$0) {
    return function (it) {
      var tmp;
      if (this$0.mn().maxLength > 0 && this$0.mn().value.length > this$0.mn().maxLength) {
        // Inline function 'kotlin.collections.mutableMapOf' call
        var map = LinkedHashMap_init_$Create$();
        // Inline function 'kotlin.collections.set' call
        var value = this$0.mn().value;
        map.k2('text', value);
        var tmp0_safe_receiver = this$0.gv_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(map);
        }
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRTextAreaView$call$lambda(this$0) {
    return function () {
      this$0.mn().focus();
      return Unit_instance;
    };
  }
  function KRTextAreaView$call$lambda_0(this$0) {
    return function () {
      this$0.mn().blur();
      return Unit_instance;
    };
  }
  function KRTextAreaView$call$lambda_1($callback, this$0) {
    return function () {
      var tmp0_safe_receiver = $callback;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(mapOf(to('cursorIndex', this$0.mn().selectionStart)));
      }
      return Unit_instance;
    };
  }
  function KRTextAreaView() {
    this.cv_1 = null;
    this.dv_1 = null;
    this.ev_1 = null;
    this.fv_1 = null;
    this.gv_1 = null;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('textarea');
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var style = this_0.style;
    style.border = 'none';
    style.backgroundColor = 'transparent';
    tmp.hv_1 = this_0;
  }
  protoOf(KRTextAreaView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.hv_1;
  };
  protoOf(KRTextAreaView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'text':
        var tmp_0 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.value = propValue;
        notifyTextValueChanged(this, this.mn().value);
        tmp = true;
        break;
      case 'textDidChange':
        var tmp_1 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_1.cv_1 = propValue;
        var tmp_2 = this.mn();
        tmp_2.addEventListener('input', KRTextAreaView$setProp$lambda(this));
        tmp = true;
        break;
      case 'placeholder':
        var tmp_3 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_3.placeholder = propValue;
        tmp = true;
        break;
      case 'placeholderColor':
        var tmp_4 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setPlaceholderColor(tmp_4, toRgbColor(propValue));
        tmp = true;
        break;
      case 'textAlign':
        var tmp_5 = this.mn().style;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_5.textAlign = propValue;
        tmp = true;
        break;
      case 'fontWeight':
        var tmp_6 = this.mn().style;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_6.fontWeight = propValue;
        tmp = true;
        break;
      case 'fontSize':
        this.mn().style.fontSize = toPxF(toNumberFloat(propValue));
        tmp = true;
        break;
      case 'maxTextLength':
        var tmp_7 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_7.maxLength = propValue;
        tmp = true;
        break;
      case 'editable':
        var tmp_8 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_8.readOnly = !(propValue === 1);
        tmp = true;
        break;
      case 'autofocus':
        var tmp_9 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_9.autofocus = propValue === 1;
        tmp = true;
        break;
      case 'tintColor':
        // Inline function 'kotlin.js.asDynamic' call

        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.mn().style.caretColor = toRgbColor(propValue);
        tmp = true;
        break;
      case 'keyboardType':
        tmp = true;
        break;
      case 'returnKeyType':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setReturnKeyType(this, propValue);
        tmp = true;
        break;
      case 'inputFocus':
        var tmp_10 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_10.dv_1 = propValue;
        var tmp_11 = this.mn();
        tmp_11.addEventListener('focus', KRTextAreaView$setProp$lambda_0(this));
        tmp = true;
        break;
      case 'inputBlur':
        var tmp_12 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_12.ev_1 = propValue;
        var tmp_13 = this.mn();
        tmp_13.addEventListener('input', KRTextAreaView$setProp$lambda_1(this));
        tmp = true;
        break;
      case 'inputReturn':
        var tmp_14 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_14.fv_1 = propValue;
        var tmp_15 = this.mn();
        tmp_15.addEventListener('keydown', KRTextAreaView$setProp$lambda_2(this));
        tmp = true;
        break;
      case 'textLengthBeyondLimit':
        var tmp_16 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_16.gv_1 = propValue;
        var tmp_17 = this.mn();
        tmp_17.addEventListener('input', KRTextAreaView$setProp$lambda_3(this));
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  protoOf(KRTextAreaView).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'setText':
        var tmp_0;
        if (params == null) {
          return null;
        } else {
          tmp_0 = params;
        }

        var text = tmp_0;
        this.mn().value = text;
        notifyTextValueChanged(this, this.mn().value);
        tmp = Unit_instance;
        break;
      case 'focus':
        var tmp_1 = KuiklyRenderCoreContextScheduler_instance;
        tmp_1.ui(VOID, KRTextAreaView$call$lambda(this));
        tmp = Unit_instance;
        break;
      case 'blur':
        var tmp_2 = KuiklyRenderCoreContextScheduler_instance;
        tmp_2.ui(VOID, KRTextAreaView$call$lambda_0(this));
        tmp = Unit_instance;
        break;
      case 'getCursorIndex':
        var tmp_3 = KuiklyRenderCoreContextScheduler_instance;
        tmp_3.ui(VOID, KRTextAreaView$call$lambda_1(callback, this));
        tmp = Unit_instance;
        break;
      case 'setCursorIndex':
        var tmp3_elvis_lhs = params == null ? null : toIntOrNull(params);
        var tmp_4;
        if (tmp3_elvis_lhs == null) {
          return null;
        } else {
          tmp_4 = tmp3_elvis_lhs;
        }

        var index = tmp_4;
        this.mn().focus();
        this.mn().setSelectionRange(index, index);
        tmp = Unit_instance;
        break;
      default:
        tmp = call_0.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function notifyTextValueChanged_0($this, text) {
    // Inline function 'kotlin.collections.mutableMapOf' call
    var map = LinkedHashMap_init_$Create$();
    // Inline function 'kotlin.collections.set' call
    map.k2('text', text);
    var tmp0_safe_receiver = $this.fw_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(map);
    }
  }
  function setKeyBoardType($this, keyboardType) {
    var tmp = $this.mn();
    var tmp_0;
    switch (keyboardType) {
      case 'password':
        tmp_0 = 'password';
        break;
      case 'number':
        tmp_0 = 'number';
        break;
      case 'email':
        tmp_0 = 'email';
        break;
      default:
        tmp_0 = 'text';
        break;
    }
    tmp.type = tmp_0;
  }
  function setReturnKeyType_0($this, returnKeyType) {
    var supportedTypes = setOf(['search', 'send', 'done', 'go']);
    var tmp;
    if (supportedTypes.w(returnKeyType)) {
      tmp = returnKeyType;
    } else {
      tmp = 'next';
    }
    var returnKey = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    $this.mn().enterKeyHint = returnKey;
  }
  function Companion_15() {
    this.lw_1 = 'KRTextFieldView';
    this.mw_1 = 'text';
    this.nw_1 = 'placeholder';
    this.ow_1 = 'placeholderColor';
    this.pw_1 = 'textAlign';
    this.qw_1 = 'fontSize';
    this.rw_1 = 'fontWeight';
    this.sw_1 = 'tintColor';
    this.tw_1 = 'maxTextLength';
    this.uw_1 = 'autofocus';
    this.vw_1 = 'editable';
    this.ww_1 = 'keyboardType';
    this.xw_1 = 'returnKeyType';
    this.yw_1 = 'setText';
    this.zw_1 = 'focus';
    this.ax_1 = 'blur';
    this.bx_1 = 'getCursorIndex';
    this.cx_1 = 'setCursorIndex';
    this.dx_1 = 'textDidChange';
    this.ex_1 = 'inputFocus';
    this.fx_1 = 'inputBlur';
    this.gx_1 = 'inputReturn';
    this.hx_1 = 'textLengthBeyondLimit';
  }
  var Companion_instance_15;
  function Companion_getInstance_15() {
    return Companion_instance_15;
  }
  function KRTextFieldView$setProp$lambda(this$0) {
    return function (it) {
      notifyTextValueChanged_0(this$0, this$0.mn().value);
      return Unit_instance;
    };
  }
  function KRTextFieldView$setProp$lambda_0(this$0) {
    return function (it) {
      // Inline function 'kotlin.collections.mutableMapOf' call
      var map = LinkedHashMap_init_$Create$();
      // Inline function 'kotlin.collections.set' call
      var value = this$0.mn().value;
      map.k2('text', value);
      var tmp0_safe_receiver = this$0.gw_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(map);
      }
      return Unit_instance;
    };
  }
  function KRTextFieldView$setProp$lambda_1(this$0) {
    return function (it) {
      // Inline function 'kotlin.collections.mutableMapOf' call
      var map = LinkedHashMap_init_$Create$();
      // Inline function 'kotlin.collections.set' call
      var value = this$0.mn().value;
      map.k2('text', value);
      var tmp0_safe_receiver = this$0.hw_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(map);
      }
      return Unit_instance;
    };
  }
  function KRTextFieldView$setProp$lambda_2(this$0) {
    return function (it) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var event = it;
      var tmp;
      if (event.key === 'Enter' || event.keyCode === 13) {
        // Inline function 'kotlin.collections.mutableMapOf' call
        var map = LinkedHashMap_init_$Create$();
        // Inline function 'kotlin.collections.set' call
        var value = this$0.mn().value;
        map.k2('text', value);
        var tmp0_safe_receiver = this$0.iw_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(map);
        }
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRTextFieldView$setProp$lambda_3(this$0) {
    return function (it) {
      var tmp;
      if (this$0.mn().maxLength > 0 && this$0.mn().value.length > this$0.mn().maxLength) {
        // Inline function 'kotlin.collections.mutableMapOf' call
        var map = LinkedHashMap_init_$Create$();
        // Inline function 'kotlin.collections.set' call
        var value = this$0.mn().value;
        map.k2('text', value);
        var tmp0_safe_receiver = this$0.jw_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(map);
        }
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRTextFieldView$call$lambda(this$0) {
    return function () {
      this$0.mn().focus();
      return Unit_instance;
    };
  }
  function KRTextFieldView$call$lambda_0(this$0) {
    return function () {
      this$0.mn().blur();
      return Unit_instance;
    };
  }
  function KRTextFieldView$call$lambda_1($callback, this$0) {
    return function () {
      var tmp0_safe_receiver = $callback;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(mapOf(to('cursorIndex', this$0.mn().selectionStart)));
      }
      return Unit_instance;
    };
  }
  function KRTextFieldView() {
    this.fw_1 = null;
    this.gw_1 = null;
    this.hw_1 = null;
    this.iw_1 = null;
    this.jw_1 = null;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('input');
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var style = this_0.style;
    style.border = 'none';
    style.backgroundColor = 'transparent';
    tmp.kw_1 = this_0;
  }
  protoOf(KRTextFieldView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.kw_1;
  };
  protoOf(KRTextFieldView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'text':
        var tmp_0 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.value = propValue;
        notifyTextValueChanged_0(this, this.mn().value);
        tmp = true;
        break;
      case 'textDidChange':
        var tmp_1 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_1.fw_1 = propValue;
        var tmp_2 = this.mn();
        tmp_2.addEventListener('input', KRTextFieldView$setProp$lambda(this));
        tmp = true;
        break;
      case 'placeholder':
        var tmp_3 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_3.placeholder = propValue;
        tmp = true;
        break;
      case 'placeholderColor':
        var tmp_4 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setPlaceholderColor(tmp_4, toRgbColor(propValue));
        tmp = true;
        break;
      case 'textAlign':
        var tmp_5 = this.mn().style;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_5.textAlign = propValue;
        tmp = true;
        break;
      case 'fontWeight':
        var tmp_6 = this.mn().style;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_6.fontWeight = propValue;
        tmp = true;
        break;
      case 'fontSize':
        this.mn().style.fontSize = toPxF(toNumberFloat(propValue));
        tmp = true;
        break;
      case 'maxTextLength':
        var tmp_7 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_7.maxLength = propValue;
        tmp = true;
        break;
      case 'editable':
        var tmp_8 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_8.readOnly = !(propValue === 1);
        tmp = true;
        break;
      case 'autofocus':
        var tmp_9 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_9.autofocus = propValue === 1;
        tmp = true;
        break;
      case 'tintColor':
        // Inline function 'kotlin.js.asDynamic' call

        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.mn().style.caretColor = toRgbColor(propValue);
        tmp = true;
        break;
      case 'keyboardType':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setKeyBoardType(this, propValue);
        tmp = true;
        break;
      case 'returnKeyType':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setReturnKeyType_0(this, propValue);
        tmp = true;
        break;
      case 'inputFocus':
        var tmp_10 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_10.gw_1 = propValue;
        var tmp_11 = this.mn();
        tmp_11.addEventListener('focus', KRTextFieldView$setProp$lambda_0(this));
        tmp = true;
        break;
      case 'inputBlur':
        var tmp_12 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_12.hw_1 = propValue;
        var tmp_13 = this.mn();
        tmp_13.addEventListener('blur', KRTextFieldView$setProp$lambda_1(this));
        tmp = true;
        break;
      case 'inputReturn':
        var tmp_14 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_14.iw_1 = propValue;
        var tmp_15 = this.mn();
        tmp_15.addEventListener('keydown', KRTextFieldView$setProp$lambda_2(this));
        tmp = true;
        break;
      case 'textLengthBeyondLimit':
        var tmp_16 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_16.jw_1 = propValue;
        var tmp_17 = this.mn();
        tmp_17.addEventListener('input', KRTextFieldView$setProp$lambda_3(this));
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  protoOf(KRTextFieldView).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'setText':
        var tmp_0;
        if (params == null) {
          return null;
        } else {
          tmp_0 = params;
        }

        var text = tmp_0;
        this.mn().value = text;
        notifyTextValueChanged_0(this, this.mn().value);
        tmp = Unit_instance;
        break;
      case 'focus':
        var tmp_1 = KuiklyRenderCoreContextScheduler_instance;
        tmp_1.ui(VOID, KRTextFieldView$call$lambda(this));
        tmp = Unit_instance;
        break;
      case 'blur':
        var tmp_2 = KuiklyRenderCoreContextScheduler_instance;
        tmp_2.ui(VOID, KRTextFieldView$call$lambda_0(this));
        tmp = Unit_instance;
        break;
      case 'getCursorIndex':
        var tmp_3 = KuiklyRenderCoreContextScheduler_instance;
        tmp_3.ui(VOID, KRTextFieldView$call$lambda_1(callback, this));
        tmp = Unit_instance;
        break;
      case 'setCursorIndex':
        var tmp3_elvis_lhs = params == null ? null : toIntOrNull(params);
        var tmp_4;
        if (tmp3_elvis_lhs == null) {
          return null;
        } else {
          tmp_4 = tmp3_elvis_lhs;
        }

        var index = tmp_4;
        this.mn().focus();
        this.mn().setSelectionRange(index, index);
        tmp = Unit_instance;
        break;
      default:
        tmp = call_0.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function playControl($this, state) {
    switch (state.i1_1) {
      case 1:
        Log_instance.ix(['there is no prePlay func in web']);
        break;
      case 2:
        $this.mn().play();
        break;
      case 3:
        $this.mn().pause();
        break;
      case 4:
        $this.mn().pause();
        $this.mn().currentTime = 0.0;
        break;
      default:
        break;
    }
  }
  function setVideoPlaySource($this, src) {
    var tmp;
    if (src == null) {
      return Unit_instance;
    } else {
      tmp = src;
    }
    var source = tmp;
    $this.mn().src = source;
  }
  function setResizeMode($this, mode) {
    switch (mode.i1_1) {
      case 0:
        $this.mn().style.objectFit = 'contain';
        break;
      case 1:
        $this.mn().style.objectFit = 'cover';
        break;
      case 2:
        $this.mn().style.objectFit = 'fill';
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
  }
  function Companion_16() {
    this.ox_1 = 'KRVideoView';
    this.px_1 = 'src';
    this.qx_1 = 'muted';
    this.rx_1 = 'rate';
    this.sx_1 = 'resizeMode';
    this.tx_1 = 'playControl';
    this.ux_1 = 'stateChange';
    this.vx_1 = 'playTimeChange';
    this.wx_1 = 'firstFrame';
    this.xx_1 = 'customEvent';
  }
  var Companion_instance_16;
  function Companion_getInstance_16() {
    return Companion_instance_16;
  }
  function KRVideoView$video$lambda(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.lx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        var tmp = to('state', KRVideoPlayState_KRVideoPlayStatePlaying_getInstance().i1_1);
        // Inline function 'kotlin.collections.mapOf' call
        var tmp$ret$0 = emptyMap();
        tmp0_safe_receiver.zq(mapOf_0([tmp, to('extInfo', tmp$ret$0)]));
      }
      return Unit_instance;
    };
  }
  function KRVideoView$video$lambda_0(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.lx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        var tmp = to('state', KRVideoPlayState_KRVideoPlayStatePaused_getInstance().i1_1);
        // Inline function 'kotlin.collections.mapOf' call
        var tmp$ret$0 = emptyMap();
        tmp0_safe_receiver.zq(mapOf_0([tmp, to('extInfo', tmp$ret$0)]));
      }
      return Unit_instance;
    };
  }
  function KRVideoView$video$lambda_1(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.lx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        var tmp = to('state', KRVideoPlayState_KRVideoPlayStatePlayEnd_getInstance().i1_1);
        // Inline function 'kotlin.collections.mapOf' call
        var tmp$ret$0 = emptyMap();
        tmp0_safe_receiver.zq(mapOf_0([tmp, to('extInfo', tmp$ret$0)]));
      }
      return Unit_instance;
    };
  }
  function KRVideoView$video$lambda_2(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.lx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        var tmp = to('state', KRVideoPlayState_KRVideoPlayStateCaching_getInstance().i1_1);
        // Inline function 'kotlin.collections.mapOf' call
        var tmp$ret$0 = emptyMap();
        tmp0_safe_receiver.zq(mapOf_0([tmp, to('extInfo', tmp$ret$0)]));
      }
      return Unit_instance;
    };
  }
  function KRVideoView$video$lambda_3(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.lx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        var tmp = to('state', KRVideoPlayState_KRVideoPlayStateFailed_getInstance().i1_1);
        // Inline function 'kotlin.collections.mapOf' call
        var tmp$ret$0 = emptyMap();
        tmp0_safe_receiver.zq(mapOf_0([tmp, to('extInfo', tmp$ret$0)]));
      }
      return Unit_instance;
    };
  }
  function KRVideoView$video$lambda_4(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.kx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        // Inline function 'kotlin.collections.mapOf' call
        var tmp$ret$0 = emptyMap();
        tmp0_safe_receiver.zq(tmp$ret$0);
      }
      return Unit_instance;
    };
  }
  function KRVideoView$video$lambda_5($$this$apply, this$0) {
    return function (it) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var item = $$this$apply;
      var currentTime = item.currentTime * 1000;
      var totalTime = item.duration * 1000;
      var tmp0_safe_receiver = this$0.mx_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(mapOf_0([to('currentTime', numberToInt(currentTime)), to('totalTime', numberToInt(totalTime))]));
      }
      return Unit_instance;
    };
  }
  function KRVideoView() {
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('video');
    this_0.addEventListener('play', KRVideoView$video$lambda(this));
    this_0.addEventListener('pause', KRVideoView$video$lambda_0(this));
    this_0.addEventListener('ended', KRVideoView$video$lambda_1(this));
    this_0.addEventListener('waiting', KRVideoView$video$lambda_2(this));
    this_0.addEventListener('error', KRVideoView$video$lambda_3(this));
    this_0.addEventListener('loadeddata', KRVideoView$video$lambda_4(this));
    this_0.addEventListener('timeupdate', KRVideoView$video$lambda_5(this_0, this));
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.apply' call
    this_0.autoplay = true;
    this_0.style.backgroundColor = 'black';
    tmp.jx_1 = this_0;
    this.kx_1 = null;
    this.lx_1 = null;
    this.mx_1 = null;
    this.nx_1 = null;
  }
  protoOf(KRVideoView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.jx_1;
  };
  protoOf(KRVideoView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'src':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setVideoPlaySource(this, propValue);
        tmp = true;
        break;
      case 'muted':
        var tmp_0 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.muted = propValue === 1;
        tmp = true;
        break;
      case 'rate':
        var tmp_1 = this.mn();
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_1.playbackRate = numberToDouble(propValue);
        tmp = true;
        break;
      case 'resizeMode':
        var tmp_2 = Companion_instance_17;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        setResizeMode(this, tmp_2.yx(propValue));
        tmp = true;
        break;
      case 'playControl':
        var tmp_3 = Companion_instance_18;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        playControl(this, tmp_3.zx(propValue));
        tmp = true;
        break;
      case 'stateChange':
        var tmp_4 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_4.lx_1 = propValue;
        tmp = true;
        break;
      case 'playTimeChange':
        var tmp_5 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_5.mx_1 = propValue;
        tmp = true;
        break;
      case 'firstFrame':
        var tmp_6 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_6.kx_1 = propValue;
        tmp = true;
        break;
      case 'customEvent':
        var tmp_7 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_7.nx_1 = propValue;
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  var KRVideoPlayState_KRVideoPlayStateUnknown_instance;
  var KRVideoPlayState_KRVideoPlayStatePlaying_instance;
  var KRVideoPlayState_KRVideoPlayStateCaching_instance;
  var KRVideoPlayState_KRVideoPlayStatePaused_instance;
  var KRVideoPlayState_KRVideoPlayStatePlayEnd_instance;
  var KRVideoPlayState_KRVideoPlayStateFailed_instance;
  var KRVideoPlayState_entriesInitialized;
  function KRVideoPlayState_initEntries() {
    if (KRVideoPlayState_entriesInitialized)
      return Unit_instance;
    KRVideoPlayState_entriesInitialized = true;
    KRVideoPlayState_KRVideoPlayStateUnknown_instance = new KRVideoPlayState('KRVideoPlayStateUnknown', 0);
    KRVideoPlayState_KRVideoPlayStatePlaying_instance = new KRVideoPlayState('KRVideoPlayStatePlaying', 1);
    KRVideoPlayState_KRVideoPlayStateCaching_instance = new KRVideoPlayState('KRVideoPlayStateCaching', 2);
    KRVideoPlayState_KRVideoPlayStatePaused_instance = new KRVideoPlayState('KRVideoPlayStatePaused', 3);
    KRVideoPlayState_KRVideoPlayStatePlayEnd_instance = new KRVideoPlayState('KRVideoPlayStatePlayEnd', 4);
    KRVideoPlayState_KRVideoPlayStateFailed_instance = new KRVideoPlayState('KRVideoPlayStateFailed', 5);
  }
  function KRVideoPlayState(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  var KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFit_instance;
  var KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFill_instance;
  var KRVideoViewContentMode_KRVideoViewContentModeScaleToFill_instance;
  function Companion_17() {
  }
  protoOf(Companion_17).yx = function (resizeMode) {
    var tmp0 = values_0();
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var inductionVariable = 0;
      var last = tmp0.length;
      while (inductionVariable < last) {
        var element = tmp0[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (element.cy_1 === resizeMode) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp0_elvis_lhs = tmp$ret$1;
    return tmp0_elvis_lhs == null ? KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFit_getInstance() : tmp0_elvis_lhs;
  };
  var Companion_instance_17;
  function Companion_getInstance_17() {
    return Companion_instance_17;
  }
  function values_0() {
    return [KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFit_getInstance(), KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFill_getInstance(), KRVideoViewContentMode_KRVideoViewContentModeScaleToFill_getInstance()];
  }
  var KRVideoViewContentMode_entriesInitialized;
  function KRVideoViewContentMode_initEntries() {
    if (KRVideoViewContentMode_entriesInitialized)
      return Unit_instance;
    KRVideoViewContentMode_entriesInitialized = true;
    KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFit_instance = new KRVideoViewContentMode('KRVideoViewContentModeScaleAspectFit', 0, 'contain');
    KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFill_instance = new KRVideoViewContentMode('KRVideoViewContentModeScaleAspectFill', 1, 'cover');
    KRVideoViewContentMode_KRVideoViewContentModeScaleToFill_instance = new KRVideoViewContentMode('KRVideoViewContentModeScaleToFill', 2, 'stretch');
  }
  function KRVideoViewContentMode(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.cy_1 = value;
  }
  var KRVideoViewPlayControl_KRVideoViewPlayControlNone_instance;
  var KRVideoViewPlayControl_KRVideoViewPlayControlPrePlay_instance;
  var KRVideoViewPlayControl_KRVideoViewPlayControlPlay_instance;
  var KRVideoViewPlayControl_KRVideoViewPlayControlPause_instance;
  var KRVideoViewPlayControl_KRVideoViewPlayControlStop_instance;
  function Companion_18() {
  }
  protoOf(Companion_18).zx = function (value) {
    var tmp0 = values_1();
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var inductionVariable = 0;
      var last = tmp0.length;
      while (inductionVariable < last) {
        var element = tmp0[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (element.i1_1 === value) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp0_elvis_lhs = tmp$ret$1;
    return tmp0_elvis_lhs == null ? KRVideoViewPlayControl_KRVideoViewPlayControlNone_getInstance() : tmp0_elvis_lhs;
  };
  var Companion_instance_18;
  function Companion_getInstance_18() {
    return Companion_instance_18;
  }
  function values_1() {
    return [KRVideoViewPlayControl_KRVideoViewPlayControlNone_getInstance(), KRVideoViewPlayControl_KRVideoViewPlayControlPrePlay_getInstance(), KRVideoViewPlayControl_KRVideoViewPlayControlPlay_getInstance(), KRVideoViewPlayControl_KRVideoViewPlayControlPause_getInstance(), KRVideoViewPlayControl_KRVideoViewPlayControlStop_getInstance()];
  }
  var KRVideoViewPlayControl_entriesInitialized;
  function KRVideoViewPlayControl_initEntries() {
    if (KRVideoViewPlayControl_entriesInitialized)
      return Unit_instance;
    KRVideoViewPlayControl_entriesInitialized = true;
    KRVideoViewPlayControl_KRVideoViewPlayControlNone_instance = new KRVideoViewPlayControl('KRVideoViewPlayControlNone', 0);
    KRVideoViewPlayControl_KRVideoViewPlayControlPrePlay_instance = new KRVideoViewPlayControl('KRVideoViewPlayControlPrePlay', 1);
    KRVideoViewPlayControl_KRVideoViewPlayControlPlay_instance = new KRVideoViewPlayControl('KRVideoViewPlayControlPlay', 2);
    KRVideoViewPlayControl_KRVideoViewPlayControlPause_instance = new KRVideoViewPlayControl('KRVideoViewPlayControlPause', 3);
    KRVideoViewPlayControl_KRVideoViewPlayControlStop_instance = new KRVideoViewPlayControl('KRVideoViewPlayControlStop', 4);
  }
  function KRVideoViewPlayControl(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function KRVideoPlayState_KRVideoPlayStatePlaying_getInstance() {
    KRVideoPlayState_initEntries();
    return KRVideoPlayState_KRVideoPlayStatePlaying_instance;
  }
  function KRVideoPlayState_KRVideoPlayStateCaching_getInstance() {
    KRVideoPlayState_initEntries();
    return KRVideoPlayState_KRVideoPlayStateCaching_instance;
  }
  function KRVideoPlayState_KRVideoPlayStatePaused_getInstance() {
    KRVideoPlayState_initEntries();
    return KRVideoPlayState_KRVideoPlayStatePaused_instance;
  }
  function KRVideoPlayState_KRVideoPlayStatePlayEnd_getInstance() {
    KRVideoPlayState_initEntries();
    return KRVideoPlayState_KRVideoPlayStatePlayEnd_instance;
  }
  function KRVideoPlayState_KRVideoPlayStateFailed_getInstance() {
    KRVideoPlayState_initEntries();
    return KRVideoPlayState_KRVideoPlayStateFailed_instance;
  }
  function KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFit_getInstance() {
    KRVideoViewContentMode_initEntries();
    return KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFit_instance;
  }
  function KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFill_getInstance() {
    KRVideoViewContentMode_initEntries();
    return KRVideoViewContentMode_KRVideoViewContentModeScaleAspectFill_instance;
  }
  function KRVideoViewContentMode_KRVideoViewContentModeScaleToFill_getInstance() {
    KRVideoViewContentMode_initEntries();
    return KRVideoViewContentMode_KRVideoViewContentModeScaleToFill_instance;
  }
  function KRVideoViewPlayControl_KRVideoViewPlayControlNone_getInstance() {
    KRVideoViewPlayControl_initEntries();
    return KRVideoViewPlayControl_KRVideoViewPlayControlNone_instance;
  }
  function KRVideoViewPlayControl_KRVideoViewPlayControlPrePlay_getInstance() {
    KRVideoViewPlayControl_initEntries();
    return KRVideoViewPlayControl_KRVideoViewPlayControlPrePlay_instance;
  }
  function KRVideoViewPlayControl_KRVideoViewPlayControlPlay_getInstance() {
    KRVideoViewPlayControl_initEntries();
    return KRVideoViewPlayControl_KRVideoViewPlayControlPlay_instance;
  }
  function KRVideoViewPlayControl_KRVideoViewPlayControlPause_getInstance() {
    KRVideoViewPlayControl_initEntries();
    return KRVideoViewPlayControl_KRVideoViewPlayControlPause_instance;
  }
  function KRVideoViewPlayControl_KRVideoViewPlayControlStop_getInstance() {
    KRVideoViewPlayControl_initEntries();
    return KRVideoViewPlayControl_KRVideoViewPlayControlStop_instance;
  }
  function _get_deviceType__e5i9y3($this) {
    var tmp0 = $this.gy_1;
    // Inline function 'kotlin.getValue' call
    deviceType$factory();
    return tmp0.a1();
  }
  function setSuperTouchEventParams($this, params, timestamp, action) {
    if ($this.vy_1) {
      var touch = mapOf_0([to('x', params.d1('x')), to('y', params.d1('y')), to('pageX', params.d1('pageX')), to('pageY', params.d1('pageY')), to('pointerId', 0), to('hash', params.d1('x'))]);
      // Inline function 'kotlin.collections.arrayListOf' call
      var touches = ArrayList_init_$Create$();
      touches.d(touch);
      // Inline function 'kotlin.collections.set' call
      var key = 'pointerId';
      params.k2(key, 0);
      // Inline function 'kotlin.collections.set' call
      var key_0 = 'timestamp';
      params.k2(key_0, timestamp);
      // Inline function 'kotlin.collections.set' call
      params.k2('action', action);
      // Inline function 'kotlin.collections.set' call
      params.k2('touches', touches);
      // Inline function 'kotlin.collections.set' call
      var key_1 = 'consumed';
      params.k2(key_1, 0);
    }
    return params;
  }
  function setTouchEvent($this) {
    if ($this.ey_1) {
      return Unit_instance;
    }
    $this.ey_1 = true;
    switch (_get_deviceType__e5i9y3($this).i1_1) {
      case 0:
        bindTouchEvents($this);
        break;
      case 2:
        bindTouchEvents($this);
        break;
      case 1:
        bindMouseEvents($this);
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
  }
  function bindTouchEvents($this) {
    var tmp = $this.mn();
    tmp.addEventListener('touchstart', KRView$bindTouchEvents$lambda($this), json([to('passive', true)]));
    var tmp_0 = $this.mn();
    tmp_0.addEventListener('touchmove', KRView$bindTouchEvents$lambda_0($this), json([to('passive', true)]));
    var tmp_1 = $this.mn();
    tmp_1.addEventListener('touchend', KRView$bindTouchEvents$lambda_1($this), json([to('passive', true)]));
    var tmp_2 = $this.mn();
    tmp_2.addEventListener('touchcancel', KRView$bindTouchEvents$lambda_2($this), json([to('passive', true)]));
  }
  function bindMouseEvents($this) {
    var tmp = $this.mn();
    tmp.addEventListener('mousedown', KRView$bindMouseEvents$lambda($this));
    var tmp_0 = $this.mn();
    tmp_0.addEventListener('mousemove', KRView$bindMouseEvents$lambda_0($this));
    var tmp_1 = $this.mn();
    tmp_1.addEventListener('mouseup', KRView$bindMouseEvents$lambda_1($this));
    var tmp_2 = $this.mn();
    tmp_2.addEventListener('mouseleave', KRView$bindMouseEvents$lambda_2($this));
    var tmp_3 = kuiklyWindow;
    tmp_3.addEventListener('mouseup', KRView$bindMouseEvents$lambda_3($this));
  }
  function getPanEventParams($this, eventParams, state) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.collections.set' call
    var value = eventParams.d1('x') - $this.oy_1;
    eventParams.k2('x', value);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.collections.set' call
    var value_0 = eventParams.d1('y') - $this.py_1;
    eventParams.k2('y', value_0);
    var tmp = $this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.qy_1 = eventParams.d1('x');
    var tmp_0 = $this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_0.ry_1 = eventParams.d1('y');
    var tmp_1 = $this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_1.sy_1 = eventParams.d1('pageX');
    var tmp_2 = $this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_2.ty_1 = eventParams.d1('pageY');
    // Inline function 'kotlin.collections.set' call
    eventParams.k2('state', state);
    return eventParams;
  }
  function setScreenFramePause($this, propValue) {
    var result = equals(propValue, 1);
    if (!(result === $this.my_1)) {
      $this.my_1 = result;
      if ($this.my_1) {
        if ($this.ly_1 == null)
          null;
        else {
          // Inline function 'kotlin.also' call
          kuiklyWindow.clearTimeout($this.ny_1);
        }
      } else {
        if ($this.ly_1 == null)
          null;
        else {
          // Inline function 'kotlin.also' call
          executeScreenFrameCallback($this, $this.ly_1);
        }
      }
    }
  }
  function setScreenFrameEvent($this, callback) {
    if ($this.ly_1 == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      kuiklyWindow.clearTimeout($this.ny_1);
    }
    if (!(callback == null)) {
      var tmp = $this;
      tmp.ly_1 = new KuiklyRenderCallback(KRView$setScreenFrameEvent$lambda(callback, $this));
      if (!$this.my_1) {
        executeScreenFrameCallback($this, $this.ly_1);
      }
    }
  }
  function executeScreenFrameCallback($this, callback) {
    var tmp = $this;
    var tmp_0 = kuiklyWindow;
    tmp.ny_1 = tmp_0.setTimeout(KRView$executeScreenFrameCallback$lambda(callback), 16);
  }
  function Companion_19() {
    this.xy_1 = 'KRView';
    this.yy_1 = 'screenFrame';
    this.zy_1 = 'screenFramePause';
    this.az_1 = 16;
  }
  var Companion_instance_19;
  function Companion_getInstance_19() {
    return Companion_instance_19;
  }
  function KRView$deviceType$delegate$lambda() {
    return DeviceUtils_instance.bz();
  }
  function KRView$setProp$lambda($propValue) {
    return function (event) {
      if (event == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        $propValue.zq(mapOf_0([to('x', event.cz()), to('y', event.dz())]));
      }
      return Unit_instance;
    };
  }
  function KRView$setProp$lambda_0($propValue) {
    return function (event) {
      if (event == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        $propValue.zq(mapOf_0([to('x', event.cz()), to('y', event.dz())]));
      }
      return Unit_instance;
    };
  }
  function KRView$bindTouchEvents$lambda(this$0) {
    return function (it) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var eventParams = toPanEventParams(it);
      var position = this$0.mn().getBoundingClientRect();
      this$0.oy_1 = position.left;
      this$0.py_1 = position.top;
      // Inline function 'kotlin.apply' call
      var this_0 = fastMutableMapOf();
      this_0.n5(eventParams);
      var params = getPanEventParams(this$0, this_0, 'start');
      params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchDown');
      var tmp0_safe_receiver = this$0.hy_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(params);
      }
      var tmp1_safe_receiver = this$0.iy_1;
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.zq(params);
      }
      it.stopPropagation();
      return Unit_instance;
    };
  }
  function KRView$bindTouchEvents$lambda_0(this$0) {
    return function (it) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var eventParams = toPanEventParams(it);
      // Inline function 'kotlin.apply' call
      var this_0 = fastMutableMapOf();
      this_0.n5(eventParams);
      var params = getPanEventParams(this$0, this_0, 'move');
      params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchMove');
      var tmp0_safe_receiver = this$0.hy_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(params);
      }
      var tmp1_safe_receiver = this$0.jy_1;
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.zq(params);
      }
      it.stopPropagation();
      return Unit_instance;
    };
  }
  function KRView$bindTouchEvents$lambda_1(this$0) {
    return function (it) {
      // Inline function 'kotlin.apply' call
      var this_0 = fastMutableMapOf();
      this_0.k2('x', this$0.qy_1);
      this_0.k2('y', this$0.ry_1);
      this_0.k2('state', 'end');
      this_0.k2('pageX', this$0.sy_1);
      this_0.k2('pageY', this$0.ty_1);
      var params = this_0;
      params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchUp');
      var tmp0_safe_receiver = this$0.hy_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(params);
      }
      var tmp1_safe_receiver = this$0.ky_1;
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.zq(params);
      }
      it.stopPropagation();
      return Unit_instance;
    };
  }
  function KRView$bindTouchEvents$lambda_2(this$0) {
    return function (it) {
      // Inline function 'kotlin.apply' call
      var this_0 = fastMutableMapOf();
      this_0.k2('x', this$0.qy_1);
      this_0.k2('y', this$0.ry_1);
      this_0.k2('pageX', this$0.sy_1);
      this_0.k2('pageY', this$0.ty_1);
      this_0.k2('state', 'cancel');
      var params = this_0;
      params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchCancel');
      var tmp0_safe_receiver = this$0.ky_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(params);
      }
      it.stopPropagation();
      return Unit_instance;
    };
  }
  function KRView$bindMouseEvents$lambda(this$0) {
    return function (it) {
      this$0.fy_1 = true;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var eventParams = toPanEventParams_0(it);
      var position = this$0.mn().getBoundingClientRect();
      this$0.oy_1 = position.left;
      this$0.py_1 = position.top;
      // Inline function 'kotlin.apply' call
      var this_0 = fastMutableMapOf();
      this_0.n5(eventParams);
      var params = getPanEventParams(this$0, this_0, 'start');
      params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchDown');
      var tmp0_safe_receiver = this$0.hy_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(params);
      }
      var tmp1_safe_receiver = this$0.iy_1;
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.zq(params);
      }
      it.stopPropagation();
      return Unit_instance;
    };
  }
  function KRView$bindMouseEvents$lambda_0(this$0) {
    return function (it) {
      var tmp;
      if (this$0.fy_1) {
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var eventParams = toPanEventParams_0(it);
        // Inline function 'kotlin.apply' call
        var this_0 = fastMutableMapOf();
        this_0.n5(eventParams);
        var params = getPanEventParams(this$0, this_0, 'move');
        params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchMove');
        var tmp0_safe_receiver = this$0.hy_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(params);
        }
        var tmp1_safe_receiver = this$0.jy_1;
        if (tmp1_safe_receiver == null)
          null;
        else {
          tmp1_safe_receiver.zq(params);
        }
        it.stopPropagation();
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRView$bindMouseEvents$lambda_1(this$0) {
    return function (it) {
      var tmp;
      if (this$0.fy_1) {
        this$0.fy_1 = false;
        // Inline function 'kotlin.apply' call
        var this_0 = fastMutableMapOf();
        this_0.k2('x', this$0.qy_1);
        this_0.k2('y', this$0.ry_1);
        this_0.k2('state', 'end');
        this_0.k2('pageX', this$0.sy_1);
        this_0.k2('pageY', this$0.ty_1);
        var params = this_0;
        params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchUp');
        var tmp0_safe_receiver = this$0.hy_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(params);
        }
        var tmp1_safe_receiver = this$0.ky_1;
        if (tmp1_safe_receiver == null)
          null;
        else {
          tmp1_safe_receiver.zq(params);
        }
        it.stopPropagation();
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRView$bindMouseEvents$lambda_2(this$0) {
    return function (it) {
      var tmp;
      if (this$0.fy_1) {
        this$0.fy_1 = false;
        // Inline function 'kotlin.apply' call
        var this_0 = fastMutableMapOf();
        this_0.k2('x', this$0.qy_1);
        this_0.k2('y', this$0.ry_1);
        this_0.k2('pageX', this$0.sy_1);
        this_0.k2('pageY', this$0.ty_1);
        this_0.k2('state', 'cancel');
        var params = this_0;
        params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchCancel');
        var tmp0_safe_receiver = this$0.ky_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(params);
        }
        it.stopPropagation();
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRView$bindMouseEvents$lambda_3(this$0) {
    return function (it) {
      var tmp;
      if (this$0.fy_1) {
        this$0.fy_1 = false;
        // Inline function 'kotlin.apply' call
        var this_0 = fastMutableMapOf();
        this_0.k2('x', this$0.qy_1);
        this_0.k2('y', this$0.ry_1);
        this_0.k2('state', 'end');
        this_0.k2('pageX', this$0.sy_1);
        this_0.k2('pageY', this$0.ty_1);
        var params = this_0;
        params = setSuperTouchEventParams(this$0, params, numberToLong(it.timeStamp), 'touchUp');
        var tmp0_safe_receiver = this$0.hy_1;
        if (tmp0_safe_receiver == null)
          null;
        else {
          tmp0_safe_receiver.zq(params);
        }
        var tmp1_safe_receiver = this$0.ky_1;
        if (tmp1_safe_receiver == null)
          null;
        else {
          tmp1_safe_receiver.zq(params);
        }
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRView$setScreenFrameEvent$lambda($callback, this$0) {
    return function (it) {
      $callback.zq(null);
      executeScreenFrameCallback(this$0, this$0.ly_1);
      return Unit_instance;
    };
  }
  function KRView$executeScreenFrameCallback$lambda($callback) {
    return function () {
      var tmp0_safe_receiver = $callback;
      var tmp;
      if (tmp0_safe_receiver == null) {
        tmp = null;
      } else {
        tmp0_safe_receiver.zq(null);
        tmp = Unit_instance;
      }
      return tmp;
    };
  }
  function KRView() {
    this.dy_1 = kuiklyDocument.createElement('div');
    this.ey_1 = false;
    this.fy_1 = false;
    var tmp = this;
    tmp.gy_1 = lazy(KRView$deviceType$delegate$lambda);
    this.hy_1 = null;
    this.iy_1 = null;
    this.jy_1 = null;
    this.ky_1 = null;
    this.ly_1 = null;
    this.my_1 = false;
    this.ny_1 = 0;
    this.oy_1 = 0.0;
    this.py_1 = 0.0;
    this.qy_1 = 0.0;
    this.ry_1 = 0.0;
    this.sy_1 = 0.0;
    this.ty_1 = 0.0;
    this.uy_1 = 5;
    this.vy_1 = false;
    this.wy_1 = false;
  }
  protoOf(KRView).mn = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.dy_1;
  };
  protoOf(KRView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'pan':
        var tmp_0 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_0.hy_1 = propValue;
        setTouchEvent(this);
        tmp = true;
        break;
      case 'superTouch':
        var tmp_1 = this;
        tmp_1.vy_1 = typeof propValue === 'boolean' ? propValue : THROW_CCE();
        tmp = true;
        break;
      case 'touchDown':
        var tmp_2 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_2.iy_1 = propValue;
        setTouchEvent(this);
        tmp = true;
        break;
      case 'touchMove':
        var tmp_3 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_3.jy_1 = propValue;
        setTouchEvent(this);
        tmp = true;
        break;
      case 'touchUp':
        var tmp_4 = this;
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp_4.ky_1 = propValue;
        setTouchEvent(this);
        tmp = true;
        break;
      case 'doubleClick':
        var tmp_5 = KuiklyProcessor_instance.ez();
        var tmp_6 = this.mn();
        tmp_5.fz(tmp_6, KRView$setProp$lambda(propValue));
        tmp = true;
        break;
      case 'longPress':
        var tmp_7 = KuiklyProcessor_instance.ez();
        var tmp_8 = this.mn();
        tmp_7.gz(tmp_8, KRView$setProp$lambda_0(propValue));
        tmp = true;
        break;
      case 'screenFrame':
        setScreenFrameEvent(this, propValue instanceof KuiklyRenderCallback ? propValue : null);
        tmp = true;
        break;
      case 'screenFramePause':
        setScreenFramePause(this, propValue);
        tmp = true;
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  function toPanEventParams(_this__u8e3s4) {
    var event = _this__u8e3s4;
    // Inline function 'org.w3c.dom.get' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$1 = event.changedTouches[0];
    return getTouchParams(tmp$ret$1);
  }
  function toPanEventParams_0(_this__u8e3s4) {
    return getMouseParams(_this__u8e3s4);
  }
  function getTouchParams(params) {
    var tmp1_safe_receiver = params == null ? null : params.clientX;
    var tmp2_elvis_lhs = tmp1_safe_receiver == null ? null : tmp1_safe_receiver;
    var touchX = tmp2_elvis_lhs == null ? 0.0 : tmp2_elvis_lhs;
    var tmp4_safe_receiver = params == null ? null : params.clientY;
    var tmp5_elvis_lhs = tmp4_safe_receiver == null ? null : tmp4_safe_receiver;
    var touchY = tmp5_elvis_lhs == null ? 0.0 : tmp5_elvis_lhs;
    var tmp7_safe_receiver = params == null ? null : params.pageX;
    var tmp8_elvis_lhs = tmp7_safe_receiver == null ? null : tmp7_safe_receiver;
    var pageX = tmp8_elvis_lhs == null ? 0.0 : tmp8_elvis_lhs;
    var tmp10_safe_receiver = params == null ? null : params.pageY;
    var tmp11_elvis_lhs = tmp10_safe_receiver == null ? null : tmp10_safe_receiver;
    var pageY = tmp11_elvis_lhs == null ? 0.0 : tmp11_elvis_lhs;
    // Inline function 'kotlin.apply' call
    var this_0 = fastMutableMapOf();
    this_0.rh_1 = json([to('x', touchX), to('y', touchY), to('pageX', pageX), to('pageY', pageY)]);
    return this_0;
  }
  function getMouseParams(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    var pageX = event.pageX;
    var pageY = event.pageY;
    // Inline function 'kotlin.apply' call
    var this_0 = fastMutableMapOf();
    this_0.rh_1 = json([to('x', mouseX), to('y', mouseY), to('pageX', pageX), to('pageY', pageY)]);
    return this_0;
  }
  function deviceType$factory() {
    return getPropertyCallableRef('deviceType', 1, KProperty1, function (receiver) {
      return _get_deviceType__e5i9y3(receiver);
    }, null);
  }
  function Companion_20() {
    this.hz_1 = 'KRListView';
    this.iz_1 = 'KRScrollView';
    this.jz_1 = 'contentOffset';
    this.kz_1 = 'contentInsetWhenEndDrag';
    this.lz_1 = 'contentInset';
    this.mz_1 = 'scrollEnabled';
    this.nz_1 = 'pagingEnabled';
    this.oz_1 = 'bouncesEnable';
    this.pz_1 = 'nestedScroll';
    this.qz_1 = 'showScrollerIndicator';
    this.rz_1 = 'directionRow';
    this.sz_1 = 'dragBegin';
    this.tz_1 = 'willDragEnd';
    this.uz_1 = 'dragEnd';
    this.vz_1 = 'scroll';
    this.wz_1 = 'scrollEnd';
  }
  var Companion_instance_20;
  function Companion_getInstance_20() {
    return Companion_instance_20;
  }
  function KRListView() {
    this.xz_1 = KuiklyProcessor_instance.yz().zz();
  }
  protoOf(KRListView).mn = function () {
    return this.xz_1.mn();
  };
  protoOf(KRListView).nn = function (propKey, propValue) {
    var tmp;
    switch (propKey) {
      case 'scroll':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.xz_1.a10(propValue);
        this.xz_1.b10();
        tmp = true;
        break;
      case 'overflow':
        tmp = true;
        break;
      case 'dragBegin':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.xz_1.c10(propValue);
        tmp = true;
        break;
      case 'dragEnd':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.xz_1.d10(propValue);
        tmp = true;
        break;
      case 'willDragEnd':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.xz_1.e10(propValue);
        tmp = true;
        break;
      case 'scrollEnd':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        this.xz_1.f10(propValue);
        this.xz_1.g10();
        tmp = true;
        break;
      case 'borderRadius':
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        // Inline function 'kotlin.js.asDynamic' call

        var borderRadiusSpilt = propValue.split(',');
        var baseRadius = borderRadiusSpilt[0];
        if (baseRadius == borderRadiusSpilt[1] && baseRadius == borderRadiusSpilt[2] && baseRadius == borderRadiusSpilt[3]) {
          var tmp_0 = this.mn().style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$13 = borderRadiusSpilt[0];
          tmp_0.borderRadius = toPxF(tmp$ret$13);
        } else {
          var tmp_1 = this.mn().style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$14 = borderRadiusSpilt[0];
          tmp_1.borderTopLeftRadius = toPxF(tmp$ret$14);
          var tmp_2 = this.mn().style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$15 = borderRadiusSpilt[1];
          tmp_2.borderTopRightRadius = toPxF(tmp$ret$15);
          var tmp_3 = this.mn().style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$16 = borderRadiusSpilt[2];
          tmp_3.borderBottomLeftRadius = toPxF(tmp$ret$16);
          var tmp_4 = this.mn().style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$17 = borderRadiusSpilt[3];
          tmp_4.borderBottomRightRadius = toPxF(tmp$ret$17);
        }

        tmp = true;
        break;
      case 'scrollEnabled':
        tmp = this.xz_1.h10(propValue);
        break;
      case 'showScrollerIndicator':
        tmp = this.xz_1.i10(propValue);
        break;
      case 'directionRow':
        tmp = this.xz_1.j10(propValue);
        break;
      case 'pagingEnabled':
        tmp = this.xz_1.k10(propValue);
        break;
      case 'bouncesEnable':
        tmp = this.xz_1.l10(propValue);
        break;
      case 'nestedScroll':
        tmp = this.xz_1.m10(propValue);
        break;
      default:
        tmp = setProp.call(this, propKey, propValue);
        break;
    }
    return tmp;
  };
  protoOf(KRListView).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'contentOffset':
        this.xz_1.n10(params);
        tmp = Unit_instance;
        break;
      case 'contentInset':
        this.xz_1.o10(params);
        tmp = Unit_instance;
        break;
      case 'contentInsetWhenEndDrag':
        this.xz_1.p10(params);
        tmp = Unit_instance;
        break;
      default:
        tmp = call_0.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  protoOf(KRListView).ig = function () {
    this.xz_1.rg();
    onDestroy.call(this);
  };
  function KRListViewContentInset(contentInset) {
    contentInset = contentInset === VOID ? '' : contentInset;
    this.q10_1 = 0.0;
    this.r10_1 = 0.0;
    this.s10_1 = 0.0;
    this.t10_1 = 0.0;
    this.u10_1 = false;
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(contentInset) > 0) {
      var spilt = split(contentInset, [' ']);
      var tmp = this;
      // Inline function 'kotlin.text.toFloat' call
      var this_0 = spilt.j(0);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp.q10_1 = toDouble(this_0);
      var tmp_0 = this;
      // Inline function 'kotlin.text.toFloat' call
      var this_1 = spilt.j(1);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_0.r10_1 = toDouble(this_1);
      var tmp_1 = this;
      // Inline function 'kotlin.text.toFloat' call
      var this_2 = spilt.j(2);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_1.s10_1 = toDouble(this_2);
      var tmp_2 = this;
      // Inline function 'kotlin.text.toFloat' call
      var this_3 = spilt.j(3);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_2.t10_1 = toDouble(this_3);
      if (spilt.i() > 4) {
        this.u10_1 = toInt(spilt.j(4)) === 1;
      }
    }
  }
  function parseTimeStringToTimestamp($this, formatStr, valueStr) {
    var yearStart = indexOf(formatStr, 'yyyy');
    var mouthStart = indexOf(formatStr, 'MM');
    var dayStart = indexOf(formatStr, 'dd');
    if (yearStart === -1 || mouthStart === -1 || dayStart === -1) {
      Log_instance.mg(['KRCalendarModule', 'parseFormat: error, the params is yyyy MM dd must in formatStr']);
      return new Long(0, 0);
    }
    // Inline function 'kotlin.text.substring' call
    var endIndex = yearStart + 4 | 0;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$1 = valueStr.substring(yearStart, endIndex);
    var year = toInt(tmp$ret$1);
    // Inline function 'kotlin.text.substring' call
    var endIndex_0 = mouthStart + 2 | 0;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$3 = valueStr.substring(mouthStart, endIndex_0);
    var mouth = toInt(tmp$ret$3);
    // Inline function 'kotlin.text.substring' call
    var endIndex_1 = dayStart + 2 | 0;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$5 = valueStr.substring(dayStart, endIndex_1);
    var day = toInt(tmp$ret$5);
    var hourStart = indexOf(formatStr, 'HH');
    var minuteStart = indexOf(formatStr, 'mm');
    var secondStart = indexOf(formatStr, 'ss');
    var millisecondStart = indexOf(formatStr, 'SSS');
    var tmp;
    if (!(hourStart === -1)) {
      // Inline function 'kotlin.text.substring' call
      var endIndex_2 = hourStart + 2 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$7 = valueStr.substring(hourStart, endIndex_2);
      tmp = toInt(tmp$ret$7);
    } else {
      tmp = 0;
    }
    var hour = tmp;
    var tmp_0;
    if (!(minuteStart === -1)) {
      // Inline function 'kotlin.text.substring' call
      var endIndex_3 = minuteStart + 2 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$9 = valueStr.substring(minuteStart, endIndex_3);
      tmp_0 = toInt(tmp$ret$9);
    } else {
      tmp_0 = 0;
    }
    var minute = tmp_0;
    var tmp_1;
    if (!(secondStart === -1)) {
      // Inline function 'kotlin.text.substring' call
      var endIndex_4 = secondStart + 2 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$11 = valueStr.substring(secondStart, endIndex_4);
      tmp_1 = toInt(tmp$ret$11);
    } else {
      tmp_1 = 0;
    }
    var second = tmp_1;
    var tmp_2;
    if (!(millisecondStart === -1)) {
      // Inline function 'kotlin.text.substring' call
      var endIndex_5 = millisecondStart + 3 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$13 = valueStr.substring(millisecondStart, endIndex_5);
      tmp_2 = toInt(tmp$ret$13);
    } else {
      tmp_2 = 0;
    }
    var millisecond = tmp_2;
    // Inline function 'kotlin.js.asDynamic' call
    var date = new Date();
    date.setFullYear(year);
    date.setMonth(mouth - 1 | 0);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);
    date.setMilliseconds(millisecond);
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$15 = String(date.getTime());
    var tmp0_elvis_lhs = toLongOrNull(tmp$ret$15);
    return tmp0_elvis_lhs == null ? new Long(0, 0) : tmp0_elvis_lhs;
  }
  function curTimestamp($this) {
    return '' + Date.now();
  }
  function getField($this, params) {
    var tmp1_elvis_lhs = params == null ? null : toJSObjSafely($this, params);
    var tmp;
    if (tmp1_elvis_lhs == null) {
      // Inline function 'kotlin.run' call
      Log_instance.mg(['KRCalendarModule', 'getField: error, the params is null']);
      return null;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var paramsJSObj = tmp;
    var tmp2_elvis_lhs = toLongOrNull(paramsJSObj.ho('timeMillis'));
    var originTimestamp = tmp2_elvis_lhs == null ? new Long(0, 0) : tmp2_elvis_lhs;
    var operations = toOperations(paramsJSObj.ho('operations'));
    var filed = paramsJSObj.go('field');
    // Inline function 'kotlin.apply' call
    var this_0 = Calendar_instance.v10();
    this_0.x10(originTimestamp);
    var calendar = this_0;
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = operations.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      if (element instanceof Add) {
        calendar.c11(element.z10_1, element.a11_1);
      } else {
        if (element instanceof Set) {
          calendar.b11(element.z10_1, element.a11_1);
        } else {
          noWhenBranchMatchedException();
        }
      }
    }
    return calendar.j(filed);
  }
  function getTimeInMillis($this, params) {
    var tmp1_elvis_lhs = params == null ? null : toJSObjSafely($this, params);
    var tmp;
    if (tmp1_elvis_lhs == null) {
      // Inline function 'kotlin.run' call
      Log_instance.mg(['KRCalendarModule', 'getTimeInMillis: error, the params is null']);
      return null;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var paramsJSObj = tmp;
    var tmp2_elvis_lhs = toLongOrNull(paramsJSObj.ho('timeMillis'));
    var originTimestamp = tmp2_elvis_lhs == null ? new Long(0, 0) : tmp2_elvis_lhs;
    var operations = toOperations(paramsJSObj.ho('operations'));
    // Inline function 'kotlin.apply' call
    var this_0 = Calendar_instance.v10();
    this_0.x10(originTimestamp);
    var calendar = this_0;
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = operations.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      if (element instanceof Add) {
        calendar.c11(element.z10_1, element.a11_1);
      } else {
        if (element instanceof Set) {
          calendar.b11(element.z10_1, element.a11_1);
        } else {
          noWhenBranchMatchedException();
        }
      }
    }
    return calendar.d11().toString();
  }
  function dateStrFormat($this, date, formatString) {
    return replace(replace(replace(replace(replace(replace(replace(formatString, 'yyyy', date.getFullYear().toString()), 'MM', padStart((date.getMonth() + 1 | 0).toString(), 2, _Char___init__impl__6a9atx(48))), 'dd', padStart(date.getDate().toString(), 2, _Char___init__impl__6a9atx(48))), 'HH', padStart(date.getHours().toString(), 2, _Char___init__impl__6a9atx(48))), 'mm', padStart(date.getMinutes().toString(), 2, _Char___init__impl__6a9atx(48))), 'ss', padStart(date.getSeconds().toString(), 2, _Char___init__impl__6a9atx(48))), 'SSS', padStart(date.getMilliseconds().toString(), 3, _Char___init__impl__6a9atx(48)));
  }
  function getReplaceReadyFormatString($this, formatString) {
    var result = StringBuilder_init_$Create$();
    var inLiteral = false;
    var literalBuffer = StringBuilder_init_$Create$();
    var i = 0;
    while (i < formatString.length) {
      var char = charSequenceGet(formatString, i);
      if (char === _Char___init__impl__6a9atx(39)) {
        if (inLiteral) {
          if ((i + 1 | 0) < formatString.length && charSequenceGet(formatString, i + 1 | 0) === _Char___init__impl__6a9atx(39)) {
            literalBuffer.p6("'");
            i = i + 2 | 0;
          } else {
            result.e(literalBuffer);
            literalBuffer.i8();
            inLiteral = false;
            i = i + 1 | 0;
          }
        } else {
          inLiteral = true;
          i = i + 1 | 0;
        }
      } else {
        if (inLiteral) {
          literalBuffer.q6(char);
          i = i + 1 | 0;
        } else {
          result.q6(char);
          i = i + 1 | 0;
        }
      }
    }
    if (inLiteral) {
      result.p6("'").e(literalBuffer);
    }
    return result.toString();
  }
  function formatDateStrWithSingleQuote($this, date, formatString) {
    return dateStrFormat($this, date, getReplaceReadyFormatString($this, formatString));
  }
  function dateFormat($this, date, formatString) {
    if (!contains(formatString, "'")) {
      return dateStrFormat($this, date, formatString);
    }
    return formatDateStrWithSingleQuote($this, date, formatString);
  }
  function format($this, params) {
    var tmp1_elvis_lhs = params == null ? null : toJSObjSafely($this, params);
    var tmp;
    if (tmp1_elvis_lhs == null) {
      // Inline function 'kotlin.run' call
      Log_instance.mg(['KRCalendarModule', 'format: error, the params is null']);
      return null;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var paramsJSObj = tmp;
    return dateFormat($this, new Date(paramsJSObj.e11('timeMillis')), paramsJSObj.ho('format'));
  }
  function parseDateStringToLong($this, formatString, formattedTime) {
    var replaceReadyFormatString = getReplaceReadyFormatString($this, formatString);
    return parseTimeStringToTimestamp($this, replaceReadyFormatString, formattedTime);
  }
  function parseFormat($this, params) {
    var tmp1_elvis_lhs = params == null ? null : toJSObjSafely($this, params);
    var tmp;
    if (tmp1_elvis_lhs == null) {
      // Inline function 'kotlin.run' call
      Log_instance.mg(['KRCalendarModule', 'parseFormat: error, the params is null']);
      return new Long(0, 0);
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var paramsJSObj = tmp;
    var formatStr = paramsJSObj.ho('format');
    var formattedTime = paramsJSObj.ho('formattedTime');
    var tmp_0;
    try {
      tmp_0 = parseDateStringToLong($this, formatStr, formattedTime);
    } catch ($p) {
      var tmp_1;
      var e = $p;
      Log_instance.mg(['KRCalendarModule', 'parseFormat: error, e=' + e.message]);
      tmp_1 = new Long(0, 0);
      tmp_0 = tmp_1;
    }
    return tmp_0;
  }
  function toJSObjSafely($this, _this__u8e3s4) {
    var tmp;
    try {
      tmp = JSONObject_init_$Create$_0(_this__u8e3s4);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof JSONException) {
        var e = $p;
        tmp_0 = null;
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    return tmp;
  }
  function Companion_21() {
    this.f11_1 = 'KRCalendarModule';
    this.g11_1 = 'KRCalendarModule';
    this.h11_1 = 'method_cur_timestamp';
    this.i11_1 = 'method_get_field';
    this.j11_1 = 'method_get_time_in_millis';
    this.k11_1 = 'method_format';
    this.l11_1 = 'method_parse_format';
    this.m11_1 = 'operations';
    this.n11_1 = 'field';
    this.o11_1 = 'timeMillis';
    this.p11_1 = 'format';
    this.q11_1 = 'formattedTime';
  }
  var Companion_instance_21;
  function Companion_getInstance_21() {
    return Companion_instance_21;
  }
  function KRCalendarModule() {
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRCalendarModule).yn = function (method, params, callback) {
    switch (method) {
      case 'method_cur_timestamp':
        return curTimestamp(this);
      case 'method_get_field':
        return getField(this, params);
      case 'method_get_time_in_millis':
        return getTimeInMillis(this, params);
      case 'method_format':
        return format(this, params);
      case 'method_parse_format':
        return parseFormat(this, params).toString();
      default:
        return protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
    }
  };
  function Set(field, value) {
    Operation.call(this, 'set', field, value);
  }
  function Add(field, value) {
    Operation.call(this, 'add', field, value);
  }
  function Operation(opt, field, value) {
    this.y10_1 = opt;
    this.z10_1 = field;
    this.a11_1 = value;
  }
  function toOperations(_this__u8e3s4) {
    var tmp;
    try {
      tmp = JSONArray_init_$Create$_0(_this__u8e3s4);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof JSONException) {
        var e = $p;
        tmp_0 = JSONArray_init_$Create$();
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    var jsArray = tmp;
    // Inline function 'kotlin.collections.mutableListOf' call
    var list = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = jsArray.ko();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        try {
          var tmp0_elvis_lhs = jsArray.t11(i);
          var jsonObj = JSONObject_init_$Create$_0(tmp0_elvis_lhs == null ? '{}' : tmp0_elvis_lhs);
          var tmp1_safe_receiver = toOperation(jsonObj);
          if (tmp1_safe_receiver == null)
            null;
          else {
            // Inline function 'kotlin.let' call
            list.d(tmp1_safe_receiver);
          }
        } catch ($p) {
          if ($p instanceof JSONException) {
            var e_0 = $p;
            Log_instance.mg(['toOperations', 'parse json error']);
          } else {
            throw $p;
          }
        }
      }
       while (inductionVariable < last);
    return list;
  }
  function CalendarData() {
    this.w10_1 = new Long(0, 0);
  }
  protoOf(CalendarData).x10 = function (value) {
    this.w10_1 = value;
  };
  protoOf(CalendarData).d11 = function () {
    if (this.w10_1.equals(new Long(0, 0))) {
      this.w10_1 = numberToLong(Date.now());
    }
    return this.w10_1;
  };
  protoOf(CalendarData).c11 = function (field, value) {
    var date = new Date(this.d11());
    if (field === Field_YEAR_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setFullYear(date.getFullYear() + value | 0);
    } else if (field === Field_MONTH_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setMonth(date.getMonth() + value | 0);
    } else if (field === Field_DAY_OF_MONTH_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setDate(date.getDate() + value | 0);
    } else if (field === Field_HOUR_OF_DAY_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setHours(date.getHours() + value | 0);
    } else if (field === Field_MINUTE_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setMinutes(date.getMinutes() + value | 0);
    } else if (field === Field_SECOND_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setSeconds(date.getSeconds() + value | 0);
    } else if (field === Field_MILLISECOND_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setMilliseconds(date.getMilliseconds() + value | 0);
    }
    this.x10(numberToLong(date.getTime()));
  };
  protoOf(CalendarData).j = function (field) {
    var date = new Date(this.d11());
    var tmp;
    if (field === Field_YEAR_getInstance().w11_1) {
      tmp = date.getFullYear().toString();
    } else if (field === Field_MONTH_getInstance().w11_1) {
      tmp = date.getMonth().toString();
    } else if (field === Field_DAY_OF_MONTH_getInstance().w11_1) {
      tmp = date.getDate().toString();
    } else if (field === Field_DAY_OF_YEAR_getInstance().w11_1) {
      var startOfYear = new Date(date.getFullYear(), 0, 0);
      var tmp0 = this.d11();
      // Inline function 'kotlin.Long.minus' call
      var other = startOfYear.getTime();
      var gap = tmp0.n() - other;
      // Inline function 'kotlin.math.floor' call
      var x = gap / 86400000;
      tmp = Math.floor(x).toString();
    } else if (field === Field_DAY_OF_WEEK_getInstance().w11_1) {
      tmp = (date.getDay() + 1 | 0).toString();
    } else if (field === Field_HOUR_OF_DAY_getInstance().w11_1) {
      tmp = date.getHours().toString();
    } else if (field === Field_MINUTE_getInstance().w11_1) {
      tmp = date.getMinutes().toString();
    } else if (field === Field_SECOND_getInstance().w11_1) {
      tmp = date.getSeconds().toString();
    } else if (field === Field_MILLISECOND_getInstance().w11_1) {
      tmp = date.getMilliseconds().toString();
    } else {
      tmp = '';
    }
    return tmp;
  };
  protoOf(CalendarData).b11 = function (field, value) {
    var date = new Date(this.d11());
    if (field === Field_YEAR_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setFullYear(value);
    } else if (field === Field_MONTH_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setMonth(value);
    } else if (field === Field_DAY_OF_MONTH_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setDate(value);
    } else if (field === Field_DAY_OF_YEAR_getInstance().w11_1) {
      // Inline function 'kotlin.apply' call
      var year = date.getFullYear();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var milliseconds = date.getMilliseconds();
      // Inline function 'kotlin.js.asDynamic' call
      date.setFullYear(year, 0, value);
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      date.setHours(hours, minutes, seconds, milliseconds);
    } else if (field === Field_HOUR_OF_DAY_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setHours(value);
    } else if (field === Field_MINUTE_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setMinutes(value);
    } else if (field === Field_SECOND_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setSeconds(value);
    } else if (field === Field_MILLISECOND_getInstance().w11_1) {
      // Inline function 'kotlin.js.asDynamic' call
      date.setMilliseconds(value);
    }
    this.x10(numberToLong(date.getTime()));
  };
  var Field_YEAR_instance;
  var Field_MONTH_instance;
  var Field_DAY_OF_MONTH_instance;
  var Field_DAY_OF_YEAR_instance;
  var Field_DAY_OF_WEEK_instance;
  var Field_HOUR_OF_DAY_instance;
  var Field_MINUTE_instance;
  var Field_SECOND_instance;
  var Field_MILLISECOND_instance;
  var Field_entriesInitialized;
  function Field_initEntries() {
    if (Field_entriesInitialized)
      return Unit_instance;
    Field_entriesInitialized = true;
    Field_YEAR_instance = new Field('YEAR', 0, 1);
    Field_MONTH_instance = new Field('MONTH', 1, 2);
    Field_DAY_OF_MONTH_instance = new Field('DAY_OF_MONTH', 2, 5);
    Field_DAY_OF_YEAR_instance = new Field('DAY_OF_YEAR', 3, 6);
    Field_DAY_OF_WEEK_instance = new Field('DAY_OF_WEEK', 4, 7);
    Field_HOUR_OF_DAY_instance = new Field('HOUR_OF_DAY', 5, 11);
    Field_MINUTE_instance = new Field('MINUTE', 6, 12);
    Field_SECOND_instance = new Field('SECOND', 7, 13);
    Field_MILLISECOND_instance = new Field('MILLISECOND', 8, 14);
  }
  function Field(name, ordinal, id) {
    Enum.call(this, name, ordinal);
    this.w11_1 = id;
  }
  function Field_YEAR_getInstance() {
    Field_initEntries();
    return Field_YEAR_instance;
  }
  function Field_MONTH_getInstance() {
    Field_initEntries();
    return Field_MONTH_instance;
  }
  function Field_DAY_OF_MONTH_getInstance() {
    Field_initEntries();
    return Field_DAY_OF_MONTH_instance;
  }
  function Field_DAY_OF_YEAR_getInstance() {
    Field_initEntries();
    return Field_DAY_OF_YEAR_instance;
  }
  function Field_DAY_OF_WEEK_getInstance() {
    Field_initEntries();
    return Field_DAY_OF_WEEK_instance;
  }
  function Field_HOUR_OF_DAY_getInstance() {
    Field_initEntries();
    return Field_HOUR_OF_DAY_instance;
  }
  function Field_MINUTE_getInstance() {
    Field_initEntries();
    return Field_MINUTE_instance;
  }
  function Field_SECOND_getInstance() {
    Field_initEntries();
    return Field_SECOND_instance;
  }
  function Field_MILLISECOND_getInstance() {
    Field_initEntries();
    return Field_MILLISECOND_instance;
  }
  function Calendar() {
  }
  protoOf(Calendar).v10 = function () {
    return new CalendarData();
  };
  var Calendar_instance;
  function Calendar_getInstance() {
    return Calendar_instance;
  }
  function toOperation(_this__u8e3s4) {
    var field = _this__u8e3s4.go('field');
    var value = _this__u8e3s4.go('value');
    var tmp0_subject = _this__u8e3s4.x11('opt');
    return equals(tmp0_subject, 'set') ? new Set(field, value) : equals(tmp0_subject, 'add') ? new Add(field, value) : null;
  }
  function md5($this, params) {
    var tmp;
    if (params == null) {
      return '';
    } else {
      tmp = params;
    }
    var string = tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    return Companion_getInstance_22().y11_1(string, 16);
  }
  function sha256($this, params) {
    var tmp;
    if (params == null) {
      return '';
    } else {
      tmp = params;
    }
    var string = tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    return Companion_getInstance_22().z11_1(string);
  }
  function base64Decode($this, params) {
    var tmp;
    if (params == null) {
      return '';
    } else {
      tmp = params;
    }
    var string = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicWindow = kuiklyWindow;
    // Inline function 'kotlin.js.unsafeCast' call
    return dynamicWindow.decodeURIComponent(dynamicWindow.escape(dynamicWindow.atob(string), true), true);
  }
  function base64Encode($this, params) {
    var tmp;
    if (params == null) {
      return '';
    } else {
      tmp = params;
    }
    var string = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicWindow = kuiklyWindow;
    // Inline function 'kotlin.js.unsafeCast' call
    return dynamicWindow.btoa(dynamicWindow.unescape(dynamicWindow.encodeURIComponent(string, true), true));
  }
  function urlDecode($this, params) {
    var tmp;
    if (params == null) {
      return '';
    } else {
      tmp = params;
    }
    var string = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    return kuiklyWindow.decodeURIComponent(string);
  }
  function urlEncode($this, params) {
    var tmp;
    if (params == null) {
      return '';
    } else {
      tmp = params;
    }
    var string = tmp;
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    return kuiklyWindow.encodeURIComponent(string);
  }
  function Companion_22() {
    Companion_instance_22 = this;
    this.y11_1 = function kotlinCalculateMD5(string, bit) {
      function md5_RotateLeft(lValue, iShiftBits) {
        return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
      }
      function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 2.147483648E9;
        lY8 = lY & 2.147483648E9;
        lX4 = lX & 1073741824;
        lY4 = lY & 1073741824;
        lResult = (lX & 1073741823) + (lY & 1073741823);
        if (lX4 & lY4) {
          return lResult ^ 2.147483648E9 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 1073741824) {
            return lResult ^ 3.221225472E9 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 1073741824 ^ lX8 ^ lY8;
          }
        } else {
          return lResult ^ lX8 ^ lY8;
        }
      }
      function md5_F(x, y, z) {
        return x & y | ~x & z;
      }
      function md5_G(x, y, z) {
        return x & z | y & ~z;
      }
      function md5_H(x, y, z) {
        return x ^ y ^ z;
      }
      function md5_I(x, y, z) {
        return y ^ (x | ~z);
      }
      function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - lByteCount % 4) / 4;
          lBytePosition = lByteCount % 4 * 8;
          lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
          lByteCount++;
        }
        lWordCount = (lByteCount - lByteCount % 4) / 4;
        lBytePosition = lByteCount % 4 * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }
      function md5_WordToHex(lValue) {
        var WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = lValue >>> lCount * 8 & 255;
          WordToHexValue_temp = '0' + lByte.toString(16);
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      }
      function md5_Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode(c >> 6 | 192);
            utftext += String.fromCharCode(c & 63 | 128);
          } else {
            utftext += String.fromCharCode(c >> 12 | 224);
            utftext += String.fromCharCode(c >> 6 & 63 | 128);
            utftext += String.fromCharCode(c & 63 | 128);
          }
        }
        return utftext;
      }
      var x = Array();
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
      var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
      var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
      var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
      string = md5_Utf8Encode(string);
      x = md5_ConvertToWordArray(string);
      a = 1732584193;
      b = 4.023233417E9;
      c = 2.562383102E9;
      d = 271733878;
      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 3.61409036E9);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 3.90540271E9);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 606105819);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 3.250441966E9);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 4.118548399E9);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 1200080426);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 2.821735955E9);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 4.249261313E9);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 1770035416);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 2.336552879E9);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 4.294925233E9);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 2.304563134E9);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 1804603682);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 4.254626195E9);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 2.792965006E9);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 1236535329);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 4.129170786E9);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 3.225465664E9);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 643717713);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 3.921069994E9);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 3.593408605E9);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 38016083);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 3.634488961E9);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 3.889429448E9);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 568446438);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 3.275163606E9);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 4.107603335E9);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 1163531501);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 2.850285829E9);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 4.243563512E9);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 1735328473);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 2.368359562E9);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 4.294588738E9);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 2.272392833E9);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 1839030562);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 4.25965774E9);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 2.763975236E9);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 1272893353);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 4.139469664E9);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 3.200236656E9);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 681279174);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 3.936430074E9);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 3.572445317E9);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 76029189);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 3.654602809E9);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 3.873151461E9);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 530742520);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 3.299628645E9);
        a = md5_II(a, b, c, d, x[k + 0], S41, 4.096336452E9);
        d = md5_II(d, a, b, c, x[k + 7], S42, 1126891415);
        c = md5_II(c, d, a, b, x[k + 14], S43, 2.878612391E9);
        b = md5_II(b, c, d, a, x[k + 5], S44, 4.237533241E9);
        a = md5_II(a, b, c, d, x[k + 12], S41, 1700485571);
        d = md5_II(d, a, b, c, x[k + 3], S42, 2.39998069E9);
        c = md5_II(c, d, a, b, x[k + 10], S43, 4.293915773E9);
        b = md5_II(b, c, d, a, x[k + 1], S44, 2.240044497E9);
        a = md5_II(a, b, c, d, x[k + 8], S41, 1873313359);
        d = md5_II(d, a, b, c, x[k + 15], S42, 4.264355552E9);
        c = md5_II(c, d, a, b, x[k + 6], S43, 2.734768916E9);
        b = md5_II(b, c, d, a, x[k + 13], S44, 1309151649);
        a = md5_II(a, b, c, d, x[k + 4], S41, 4.149444226E9);
        d = md5_II(d, a, b, c, x[k + 11], S42, 3.174756917E9);
        c = md5_II(c, d, a, b, x[k + 2], S43, 718787259);
        b = md5_II(b, c, d, a, x[k + 9], S44, 3.951481745E9);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
      }
      if (bit == 32) {
        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
      }
      return (md5_WordToHex(b) + md5_WordToHex(c)).toLowerCase();
    };
    this.z11_1 = function kotlinCalculateSHA256(s) {
      var chrsz = 8;
      var hexcase = 0;
      function safe_add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
      }
      function S(X, n) {
        return X >>> n | X << 32 - n;
      }
      function R(X, n) {
        return X >>> n;
      }
      function Ch(x, y, z) {
        return x & y ^ ~x & z;
      }
      function Maj(x, y, z) {
        return x & y ^ x & z ^ y & z;
      }
      function Sigma0256(x) {
        return S(x, 2) ^ S(x, 13) ^ S(x, 22);
      }
      function Sigma1256(x) {
        return S(x, 6) ^ S(x, 11) ^ S(x, 25);
      }
      function Gamma0256(x) {
        return S(x, 7) ^ S(x, 18) ^ R(x, 3);
      }
      function Gamma1256(x) {
        return S(x, 17) ^ S(x, 19) ^ R(x, 10);
      }
      function core_sha256(m, l) {
        var K = [1116352408, 1899447441, 3.049323471E9, 3.921009573E9, 961987163, 1508970993, 2.453635748E9, 2.870763221E9, 3.62438108E9, 310598401, 607225278, 1426881987, 1925078388, 2.162078206E9, 2.614888103E9, 3.24822258E9, 3.835390401E9, 4.022224774E9, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2.554220882E9, 2.821834349E9, 2.952996808E9, 3.210313671E9, 3.336571891E9, 3.584528711E9, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2.17702635E9, 2.456956037E9, 2.730485921E9, 2.820302411E9, 3.2597308E9, 3.345764771E9, 3.516065817E9, 3.600352804E9, 4.094571909E9, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2.227730452E9, 2.361852424E9, 2.428436474E9, 2.756734187E9, 3.204031479E9, 3.329325298E9];
        var HASH = [1779033703, 3.144134277E9, 1013904242, 2.773480762E9, 1359893119, 2.600822924E9, 528734635, 1541459225];
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 128 << 24 - l % 32;
        m[(l + 64 >> 9 << 4) + 15] = l;
        for (i = 0; i < m.length; i += 16) {
          a = HASH[0];
          b = HASH[1];
          c = HASH[2];
          d = HASH[3];
          e = HASH[4];
          f = HASH[5];
          g = HASH[6];
          h = HASH[7];
          for (j = 0; j < 64; j++) {
            if (j < 16) {
              W[j] = m[j + i];
            } else {
              W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
            }
            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
            T2 = safe_add(Sigma0256(a), Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
          }
          HASH[0] = safe_add(a, HASH[0]);
          HASH[1] = safe_add(b, HASH[1]);
          HASH[2] = safe_add(c, HASH[2]);
          HASH[3] = safe_add(d, HASH[3]);
          HASH[4] = safe_add(e, HASH[4]);
          HASH[5] = safe_add(f, HASH[5]);
          HASH[6] = safe_add(g, HASH[6]);
          HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
      }
      function str2binb(str) {
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
          bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 24 - i % 32;
        }
        return bin;
      }
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utfText = '';
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utfText += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utfText += String.fromCharCode(c >> 6 | 192);
            utfText += String.fromCharCode(c & 63 | 128);
          } else {
            utfText += String.fromCharCode(c >> 12 | 224);
            utfText += String.fromCharCode(c >> 6 & 63 | 128);
            utfText += String.fromCharCode(c & 63 | 128);
          }
        }
        return utfText;
      }
      function binb2hex(binarray) {
        var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
        var str = '';
        for (var i = 0; i < binarray.length * 4; i++) {
          str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 15);
        }
        return str;
      }
      s = Utf8Encode(s);
      return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    };
    this.a12_1 = 'KRCodecModule';
    this.b12_1 = 'urlEncode';
    this.c12_1 = 'urlDecode';
    this.d12_1 = 'base64Encode';
    this.e12_1 = 'base64Decode';
    this.f12_1 = 'md5';
    this.g12_1 = 'sha256';
  }
  var Companion_instance_22;
  function Companion_getInstance_22() {
    if (Companion_instance_22 == null)
      new Companion_22();
    return Companion_instance_22;
  }
  function KRCodecModule() {
    Companion_getInstance_22();
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRCodecModule).yn = function (method, params, callback) {
    switch (method) {
      case 'urlEncode':
        return urlEncode(this, params);
      case 'urlDecode':
        return urlDecode(this, params);
      case 'base64Encode':
        return base64Encode(this, params);
      case 'base64Decode':
        return base64Decode(this, params);
      case 'md5':
        return md5(this, params);
      case 'sha256':
        return sha256(this, params);
      default:
        return protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
    }
  };
  function getKRCurrentTime($this) {
    var now = new Date();
    return '' + now.getFullYear() + '-' + padStart((now.getMonth() + 1 | 0).toString(), 2, _Char___init__impl__6a9atx(48)) + '-' + padStart(now.getDate().toString(), 2, _Char___init__impl__6a9atx(48)) + ' ' + padStart(now.getHours().toString(), 2, _Char___init__impl__6a9atx(48)) + ':' + padStart(now.getMinutes().toString(), 2, _Char___init__impl__6a9atx(48)) + ':' + padStart(now.getSeconds().toString(), 2, _Char___init__impl__6a9atx(48)) + '.' + padStart(now.getMilliseconds().toString(), 3, _Char___init__impl__6a9atx(48));
  }
  function logInfo($this, params) {
    var msg = params == null ? '' : params;
    Log_instance.n12([getKRCurrentTime($this) + '|I|' + Companion_instance_23.m12(msg) + '|' + msg]);
  }
  function logDebug($this, params) {
    var msg = params == null ? '' : params;
    Log_instance.o12([getKRCurrentTime($this) + '|D|' + Companion_instance_23.m12(msg) + '|' + msg]);
  }
  function logError($this, params) {
    var msg = params == null ? '' : params;
    Log_instance.mg([getKRCurrentTime($this) + '|E|' + Companion_instance_23.m12(msg) + '|' + msg]);
  }
  function Companion_23() {
    this.i12_1 = 'KRLogModule';
    this.j12_1 = 'logInfo';
    this.k12_1 = 'logDebug';
    this.l12_1 = 'logError';
  }
  protoOf(Companion_23).m12 = function (msg) {
    var prefix = '[KLog][';
    var suffix = ']:';
    var startIndex = indexOf(msg, prefix);
    if (!(startIndex === -1)) {
      var endIndex = indexOf(msg, suffix, startIndex + prefix.length | 0);
      if (!(endIndex === -1)) {
        // Inline function 'kotlin.text.substring' call
        var startIndex_0 = startIndex + prefix.length | 0;
        // Inline function 'kotlin.js.asDynamic' call
        return msg.substring(startIndex_0, endIndex);
      }
    }
    return '';
  };
  var Companion_instance_23;
  function Companion_getInstance_23() {
    return Companion_instance_23;
  }
  function KRLogModule() {
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRLogModule).yn = function (method, params, callback) {
    switch (method) {
      case 'logInfo':
        logInfo(this, params);
        break;
      case 'logDebug':
        logDebug(this, params);
        break;
      case 'logError':
        logError(this, params);
        break;
      default:
        protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
        break;
    }
    return null;
  };
  function Companion_24() {
    this.q12_1 = 'KRMemoryCacheModule';
    this.r12_1 = 'setObject';
  }
  var Companion_instance_24;
  function Companion_getInstance_24() {
    return Companion_instance_24;
  }
  function KRMemoryCacheModule() {
    KuiklyRenderBaseModule.call(this);
    var tmp = this;
    // Inline function 'kotlin.collections.mutableMapOf' call
    tmp.cq_1 = LinkedHashMap_init_$Create$();
  }
  protoOf(KRMemoryCacheModule).yn = function (method, params, callback) {
    if (method === 'setObject') {
      var json = JSONObject_init_$Create$_0(params == null ? '{}' : params);
      var tmp2_elvis_lhs = json.x11('value');
      var tmp;
      if (tmp2_elvis_lhs == null) {
        return null;
      } else {
        tmp = tmp2_elvis_lhs;
      }
      var value = tmp;
      var key = json.ho('key');
      this.s12(key, value);
    }
    return null;
  };
  protoOf(KRMemoryCacheModule).dq = function (key) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.cq_1.d1(key);
  };
  protoOf(KRMemoryCacheModule).s12 = function (key, value) {
    // Inline function 'kotlin.collections.set' call
    this.cq_1.k2(key, value);
  };
  function httpRequest($this, params, callback) {
    var paramsJSON = toJSONObjectSafely(params);
    var url = paramsJSON.ho('url');
    var method = paramsJSON.ho('method');
    var param = paramsJSON.t12('param');
    var header = paramsJSON.t12('headers');
    var cookie = paramsJSON.ho('cookie');
    var timeout = imul(paramsJSON.go('timeout'), 1000);
    var httpCode = {_v: 0};
    var httpHeaders = {_v: ''};
    url = getRequestUrl($this, method, url, param);
    Log_instance.ni(['httpRequestParams', toString_0(param), getPostParams($this, param)]);
    var requestTimeoutPromise = new Promise(KRNetworkModule$httpRequest$lambda(timeout));
    var tmp = kuiklyWindow;
    var tmp_0 = url;
    // Inline function 'org.w3c.fetch.INCLUDE' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp1_headers = getRequestHeaders($this, header, cookie);
    // Inline function 'org.w3c.fetch.CORS' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'org.w3c.fetch.RequestInit' call
    var body = method === 'POST' ? getPostParams($this, param) : null;
    var referrer = undefined;
    var referrerPolicy = undefined;
    var cache = undefined;
    var redirect = undefined;
    var integrity = undefined;
    var keepalive = undefined;
    var window_0 = undefined;
    var o = {};
    o['method'] = method;
    o['headers'] = tmp1_headers;
    o['body'] = body;
    o['referrer'] = referrer;
    o['referrerPolicy'] = referrerPolicy;
    o['mode'] = 'cors';
    o['credentials'] = 'include';
    o['cache'] = cache;
    o['redirect'] = redirect;
    o['integrity'] = integrity;
    o['keepalive'] = keepalive;
    o['window'] = window_0;
    var fetchPromise = tmp.fetch(tmp_0, o);
    var tmp_1 = Promise;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$11 = [requestTimeoutPromise, fetchPromise];
    var tmp_2 = tmp_1.race(tmp$ret$11);
    var tmp_3 = tmp_2.then(KRNetworkModule$httpRequest$lambda_0(httpCode, httpHeaders));
    var tmp_4 = tmp_3.then(KRNetworkModule$httpRequest$lambda_1(httpCode, $this, callback, httpHeaders));
    tmp_4.catch(KRNetworkModule$httpRequest$lambda_2($this, callback, httpCode));
  }
  function httpStreamRequest($this, params, callback) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var dataArray = params;
    var url = dataArray[0];
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var body = dataArray[1];
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var headerStr = dataArray[2];
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var cookie = dataArray[3];
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$9 = dataArray[4];
    var timeout = imul(numberToInt(tmp$ret$9), 1000);
    var tmp = Log_instance;
    tmp.ni(['httpStreamRequest', url == null ? '' : url, body, headerStr, cookie, timeout]);
    var httpCode = {_v: 0};
    var httpHeaders = {_v: ''};
    var requestTimeoutPromise = new Promise(KRNetworkModule$httpStreamRequest$lambda(timeout));
    var tmp_0 = kuiklyWindow;
    // Inline function 'org.w3c.fetch.INCLUDE' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp2_headers = getRequestHeaders($this, JSONObject_init_$Create$_0(headerStr), cookie);
    // Inline function 'org.w3c.fetch.CORS' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'org.w3c.fetch.RequestInit' call
    var body_0 = toBlob($this, body);
    var referrer = undefined;
    var referrerPolicy = undefined;
    var cache = undefined;
    var redirect = undefined;
    var integrity = undefined;
    var keepalive = undefined;
    var window_0 = undefined;
    var o = {};
    o['method'] = 'POST';
    o['headers'] = tmp2_headers;
    o['body'] = body_0;
    o['referrer'] = referrer;
    o['referrerPolicy'] = referrerPolicy;
    o['mode'] = 'cors';
    o['credentials'] = 'include';
    o['cache'] = cache;
    o['redirect'] = redirect;
    o['integrity'] = integrity;
    o['keepalive'] = keepalive;
    o['window'] = window_0;
    var fetchPromise = tmp_0.fetch(url, o);
    var tmp_1 = Promise;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$21 = [requestTimeoutPromise, fetchPromise];
    var tmp_2 = tmp_1.race(tmp$ret$21);
    var tmp_3 = tmp_2.then(KRNetworkModule$httpStreamRequest$lambda_0(httpCode, httpHeaders));
    var tmp_4 = tmp_3.then(KRNetworkModule$httpStreamRequest$lambda_1(httpCode, $this, callback, httpHeaders));
    tmp_4.catch(KRNetworkModule$httpStreamRequest$lambda_2($this, callback, httpHeaders, httpCode));
  }
  function toBlob($this, _this__u8e3s4) {
    var buffer = new ArrayBuffer(_this__u8e3s4.length);
    var uint8Array = new Uint8Array(buffer);
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index = 0;
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    while (inductionVariable < last) {
      var item = _this__u8e3s4[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      // Inline function 'org.khronos.webgl.set' call
      // Inline function 'kotlin.js.asDynamic' call
      uint8Array[_unary__edvuaz] = item;
    }
    return buffer;
  }
  function fireStreamRequestResultCallback($this, callback, arrayBuffer, headers, errorMsg, statusCode) {
    if (callback == null)
      null;
    else {
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$2 = [toByteArray($this, arrayBuffer), headers, errorMsg, statusCode];
      callback.zq(tmp$ret$2);
    }
  }
  function toByteArray($this, _this__u8e3s4) {
    var int8Array = new Uint8Array(_this__u8e3s4);
    var tmp = 0;
    var tmp_0 = int8Array.length;
    var tmp_1 = new Int8Array(tmp_0);
    while (tmp < tmp_0) {
      var tmp_2 = tmp;
      // Inline function 'org.khronos.webgl.get' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_1[tmp_2] = int8Array[tmp_2];
      tmp = tmp + 1 | 0;
    }
    return tmp_1;
  }
  function getRequestUrl($this, method, url, params) {
    if (method === 'GET') {
      var reqParams = '';
      if (!(params == null)) {
        // Inline function 'kotlin.collections.arrayListOf' call
        var urlParams = ArrayList_init_$Create$();
        var keys = params.u12();
        // Inline function 'kotlin.collections.iterator' call
        var _iterator__ex2g4s = keys;
        while (_iterator__ex2g4s.g()) {
          var key = _iterator__ex2g4s.h();
          var tmp0_safe_receiver = params.x11(key);
          var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : toString(tmp0_safe_receiver);
          var v = tmp1_elvis_lhs == null ? '' : tmp1_elvis_lhs;
          // Inline function 'kotlin.js.asDynamic' call
          var tmp$ret$2 = kuiklyWindow;
          urlParams.d(key + '=' + tmp$ret$2.encodeURIComponent(v));
        }
        reqParams = joinToString(urlParams, '&');
      }
      var tmp;
      if (contains(url, '?')) {
        tmp = url + '&' + reqParams;
      } else {
        tmp = url + '?' + reqParams;
      }
      return tmp;
    } else {
      return url;
    }
  }
  function fireSuccessCallback($this, callback, resultData, headers, statusCode) {
    if (callback == null)
      null;
    else {
      callback.zq(mapOf_0([to('data', resultData), to('success', 1), to('errorMsg', ''), to('headers', headers), to('statusCode', statusCode)]));
    }
  }
  function fireErrorCallback($this, callback, errorMsg, statusCode) {
    if (callback == null)
      null;
    else {
      callback.zq(mapOf_0([to('success', 0), to('errorMsg', errorMsg), to('statusCode', statusCode)]));
    }
  }
  function getPostParams($this, param) {
    if (param == null) {
      return '';
    }
    return param.toString();
  }
  function getRequestHeaders($this, header, cookie) {
    var headers = json([]);
    if (!(header == null)) {
      var headerKeys = header.u12();
      // Inline function 'kotlin.collections.iterator' call
      var _iterator__ex2g4s = headerKeys;
      while (_iterator__ex2g4s.g()) {
        var key = _iterator__ex2g4s.h();
        var headerString = header.x11(key);
        var tmp;
        if (headerString === null) {
          tmp = '';
        } else {
          if (!(headerString == null) ? typeof headerString === 'string' : false) {
            tmp = headerString;
          } else {
            tmp = toString(headerString);
          }
        }
        headers[key] = tmp;
      }
    }
    if (!(cookie == null)) {
      headers['Cookie'] = cookie;
    }
    return new Headers(headers);
  }
  function Companion_25() {
    this.v12_1 = 'KRNetworkModule';
    this.w12_1 = 'httpRequest';
    this.x12_1 = 'httpStreamRequest';
    this.y12_1 = 'success';
    this.z12_1 = 'errorMsg';
    this.a13_1 = 'headers';
    this.b13_1 = 'statusCode';
    this.c13_1 = 'GET';
    this.d13_1 = 'POST';
    this.e13_1 = -1000;
  }
  var Companion_instance_25;
  function Companion_getInstance_25() {
    return Companion_instance_25;
  }
  function KRNetworkModule$httpRequest$lambda$lambda($reject) {
    return function () {
      $reject(Error_init_$Create$('request timeout'));
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpRequest$lambda($timeout) {
    return function (_unused_var__etf5q3, reject) {
      var tmp = kuiklyWindow;
      tmp.setTimeout(KRNetworkModule$httpRequest$lambda$lambda(reject), $timeout);
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpRequest$lambda_0($httpCode, $httpHeaders) {
    return function (rsp) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var response = rsp;
      $httpCode._v = response.status;
      $httpHeaders._v = JSON.stringify(response.headers);
      var tmp;
      if (!response.ok) {
        tmp = '';
      } else {
        tmp = response.json();
      }
      return tmp;
    };
  }
  function KRNetworkModule$httpRequest$lambda_1($httpCode, this$0, $callback, $httpHeaders) {
    return function (data) {
      var tmp;
      var containsArg = $httpCode._v;
      if (200 <= containsArg ? containsArg <= 299 : false) {
        fireSuccessCallback(this$0, $callback, JSON.stringify(data), $httpHeaders._v, $httpCode._v);
        tmp = Unit_instance;
      } else {
        fireErrorCallback(this$0, $callback, 'request error', $httpCode._v);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpRequest$lambda_2(this$0, $callback, $httpCode) {
    return function (it) {
      var errorMsg = it.message;
      fireErrorCallback(this$0, $callback, errorMsg == null ? 'io exception' : errorMsg, !($httpCode._v === 0) ? $httpCode._v : -1000);
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpStreamRequest$lambda$lambda($reject) {
    return function () {
      $reject(Error_init_$Create$('httpStreamRequest timeout'));
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpStreamRequest$lambda($timeout) {
    return function (_unused_var__etf5q3, reject) {
      var tmp = kuiklyWindow;
      tmp.setTimeout(KRNetworkModule$httpStreamRequest$lambda$lambda(reject), $timeout);
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpStreamRequest$lambda_0($httpCode, $httpHeaders) {
    return function (rsp) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var response = rsp;
      $httpCode._v = response.status;
      $httpHeaders._v = JSON.stringify(response.headers);
      var tmp;
      if (!response.ok) {
        tmp = new ArrayBuffer(0);
      } else {
        tmp = response.arrayBuffer();
      }
      return tmp;
    };
  }
  function KRNetworkModule$httpStreamRequest$lambda_1($httpCode, this$0, $callback, $httpHeaders) {
    return function (data) {
      var tmp;
      var containsArg = $httpCode._v;
      if (200 <= containsArg ? containsArg <= 299 : false) {
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        fireStreamRequestResultCallback(this$0, $callback, data, $httpHeaders._v, '', $httpCode._v);
        tmp = Unit_instance;
      } else {
        fireStreamRequestResultCallback(this$0, $callback, new ArrayBuffer(0), $httpHeaders._v, 'request error', $httpCode._v);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function KRNetworkModule$httpStreamRequest$lambda_2(this$0, $callback, $httpHeaders, $httpCode) {
    return function (it) {
      var errorMsg = it.message;
      var tmp = new ArrayBuffer(0);
      fireStreamRequestResultCallback(this$0, $callback, tmp, errorMsg == null ? 'io exception' : errorMsg, $httpHeaders._v, !($httpCode._v === 0) ? $httpCode._v : -1000);
      return Unit_instance;
    };
  }
  function KRNetworkModule() {
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRNetworkModule).yn = function (method, params, callback) {
    var tmp;
    if (method === 'httpRequest') {
      httpRequest(this, params, callback);
      tmp = Unit_instance;
    } else {
      tmp = protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
    }
    return tmp;
  };
  protoOf(KRNetworkModule).xn = function (method, params, callback) {
    var tmp;
    if (method === 'httpStreamRequest') {
      httpStreamRequest(this, params, callback);
      tmp = Unit_instance;
    } else {
      tmp = protoOf(KuiklyRenderBaseModule).xn.call(this, method, params, callback);
    }
    return tmp;
  };
  function addNotify($this, params, callback) {
    var tmp;
    if (callback == null) {
      return Unit_instance;
    } else {
      tmp = callback;
    }
    var cb = tmp;
    var tmp_0;
    if (params == null) {
      return Unit_instance;
    } else {
      tmp_0 = params;
    }
    var jsonStr = tmp_0;
    var jsonObject = JSONObject_init_$Create$_0(jsonStr);
    var eventName = jsonObject.ho('eventName');
    var id = jsonObject.ho('id');
    if (eventName === '' || id === '') {
      return Unit_instance;
    }
    var callbackList = $this.h13_1.d1(eventName);
    if (callbackList == null) {
      // Inline function 'kotlin.collections.mutableListOf' call
      callbackList = ArrayList_init_$Create$();
      var tmp0 = $this.h13_1;
      // Inline function 'kotlin.collections.set' call
      var value = callbackList;
      tmp0.k2(eventName, value);
    }
    callbackList.d(new KRCallbackWrapper(id, cb));
  }
  function removeNotify($this, params) {
    var tmp;
    if (params == null) {
      return Unit_instance;
    } else {
      tmp = params;
    }
    var jsonStr = tmp;
    var jsonObject = JSONObject_init_$Create$_0(jsonStr);
    var eventName = jsonObject.ho('eventName');
    var id = jsonObject.ho('id');
    if (eventName === '' || id === '') {
      return Unit_instance;
    }
    var tmp1_safe_receiver = $this.h13_1.d1(eventName);
    if (tmp1_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      var size = tmp1_safe_receiver.i();
      var inductionVariable = 0;
      if (inductionVariable < size)
        $l$loop: do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          var wrapper = tmp1_safe_receiver.j(i);
          if (wrapper.i13_1 === id) {
            tmp1_safe_receiver.t2(i);
            break $l$loop;
          }
        }
         while (inductionVariable < size);
      if (tmp1_safe_receiver.k()) {
        $this.h13_1.m3(eventName);
      }
    }
  }
  function postNotify($this, params) {
    var tmp;
    if (params == null) {
      return Unit_instance;
    } else {
      tmp = params;
    }
    var jsonStr = tmp;
    var jsonObject = JSONObject_init_$Create$_0(jsonStr);
    var eventName = jsonObject.ho('eventName');
    var data = jsonObject.ho('data');
    if (!(eventName === '')) {
      dispatchEvent($this, eventName, data);
    }
  }
  function dispatchEvent($this, eventName, data) {
    var tmp0_safe_receiver = $this.h13_1.d1(eventName);
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.collections.forEach' call
      var _iterator__ex2g4s = tmp0_safe_receiver.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        element.j13_1.zq(data);
      }
    }
  }
  function Companion_26() {
    Companion_instance_26 = this;
    this.k13_1 = 'KRNotifyModule';
    this.l13_1 = 'addNotify';
    this.m13_1 = 'removeNotify';
    this.n13_1 = 'postNotify';
    this.o13_1 = 'eventName';
    this.p13_1 = 'data';
    this.q13_1 = 'id';
    var tmp = this;
    // Inline function 'kotlin.collections.mutableSetOf' call
    tmp.r13_1 = LinkedHashSet_init_$Create$();
  }
  var Companion_instance_26;
  function Companion_getInstance_26() {
    if (Companion_instance_26 == null)
      new Companion_26();
    return Companion_instance_26;
  }
  function KRNotifyModule() {
    Companion_getInstance_26();
    KuiklyRenderBaseModule.call(this);
    var tmp = this;
    // Inline function 'kotlin.collections.mutableMapOf' call
    tmp.h13_1 = LinkedHashMap_init_$Create$();
    Companion_getInstance_26().r13_1.d(this);
  }
  protoOf(KRNotifyModule).ig = function () {
    protoOf(KuiklyRenderBaseModule).ig.call(this);
    Companion_getInstance_26().r13_1.m2(this);
  };
  protoOf(KRNotifyModule).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'addNotify':
        addNotify(this, params, callback);
        tmp = Unit_instance;
        break;
      case 'removeNotify':
        removeNotify(this, params);
        tmp = Unit_instance;
        break;
      case 'postNotify':
        postNotify(this, params);
        tmp = Unit_instance;
        break;
      default:
        tmp = protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function KRCallbackWrapper(callbackId, callback) {
    this.i13_1 = callbackId;
    this.j13_1 = callback;
  }
  protoOf(KRCallbackWrapper).toString = function () {
    return 'KRCallbackWrapper(callbackId=' + this.i13_1 + ', callback=' + toString(this.j13_1) + ')';
  };
  protoOf(KRCallbackWrapper).hashCode = function () {
    var result = getStringHashCode(this.i13_1);
    result = imul(result, 31) + hashCode(this.j13_1) | 0;
    return result;
  };
  protoOf(KRCallbackWrapper).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof KRCallbackWrapper))
      return false;
    var tmp0_other_with_cast = other instanceof KRCallbackWrapper ? other : THROW_CCE();
    if (!(this.i13_1 === tmp0_other_with_cast.i13_1))
      return false;
    if (!equals(this.j13_1, tmp0_other_with_cast.j13_1))
      return false;
    return true;
  };
  function Companion_27() {
    this.s13_1 = 'on_create_start';
    this.t13_1 = 'on_new_page_start';
    this.u13_1 = 'on_new_page_end';
    this.v13_1 = 'on_build_start';
    this.w13_1 = 'on_build_end';
    this.x13_1 = 'on_layout_start';
    this.y13_1 = 'on_layout_end';
    this.z13_1 = 'on_create_end';
  }
  var Companion_instance_27;
  function Companion_getInstance_27() {
    return Companion_instance_27;
  }
  function PageCreateTrace(jsonStr) {
    var jsonObject = toJSONObjectSafely(jsonStr);
    this.a14_1 = jsonObject.i14('on_create_start', new Long(-1, -1));
    this.b14_1 = jsonObject.i14('on_new_page_start', new Long(-1, -1));
    this.c14_1 = jsonObject.i14('on_new_page_end', new Long(-1, -1));
    this.d14_1 = jsonObject.i14('on_build_start', new Long(-1, -1));
    this.e14_1 = jsonObject.i14('on_build_end', new Long(-1, -1));
    this.f14_1 = jsonObject.i14('on_layout_start', new Long(-1, -1));
    this.g14_1 = jsonObject.i14('on_layout_end', new Long(-1, -1));
    this.h14_1 = jsonObject.i14('on_create_end', new Long(-1, -1));
  }
  protoOf(PageCreateTrace).toString = function () {
    return '[PageCreateTrace] ' + ('onCreateStartTimeMills: ' + this.a14_1.toString() + ' \n') + ('onCreateEndTimeMills: ' + this.h14_1.toString() + ' \n') + ('newPageStartTimeMills: ' + this.b14_1.toString() + ' \n') + ('newPageEndTimeMills: ' + this.c14_1.toString() + ' \n') + ('onBuildStartTimeMills: ' + this.d14_1.toString() + ' \n') + ('onBuildEndTimeMills: ' + this.e14_1.toString() + ' \n') + ('onLayoutStartTimeMills: ' + this.f14_1.toString() + ' \n') + ('onLayoutEndTimeMills: ' + this.g14_1.toString());
  };
  function onCreatePageFinish($this, jsonString) {
    if (jsonString == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      $this.l14_1 = new PageCreateTrace(jsonString);
      var tmp0_safe_receiver = $this.k14_1;
      var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.t14('KRLaunchMonitor');
      var tmp;
      if (tmp1_safe_receiver == null) {
        tmp = null;
      } else {
        tmp1_safe_receiver.x14($this.l14_1);
        tmp = Unit_instance;
      }
    }
  }
  function getPerformanceData($this, callback) {
    var tmp0_safe_receiver = $this.k14_1;
    var performanceData = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.y14();
    if (callback == null)
      null;
    else {
      callback.zq(performanceData == null ? null : performanceData.g15());
    }
  }
  function Companion_28() {
    this.h15_1 = 'KRPerformanceModule';
    this.i15_1 = 'onPageCreateFinish';
    this.j15_1 = 'getPerformanceData';
  }
  var Companion_instance_28;
  function Companion_getInstance_28() {
    return Companion_instance_28;
  }
  function KRPerformanceModule(performanceManager) {
    KuiklyRenderBaseModule.call(this);
    this.k14_1 = performanceManager;
    this.l14_1 = null;
  }
  protoOf(KRPerformanceModule).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'onPageCreateFinish':
        onCreatePageFinish(this, params);
        tmp = Unit_instance;
        break;
      case 'getPerformanceData':
        getPerformanceData(this, callback);
        tmp = Unit_instance;
        break;
      default:
        tmp = protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function openPage($this, param) {
    if (param == null) {
      return Unit_instance;
    }
    var params = toJSONObjectSafely(param);
    var pageName = params.ho('pageName');
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(pageName) === 0) {
      return Unit_instance;
    }
    var tmp;
    // Inline function 'kotlin.js.asDynamic' call
    if (!(typeof kuiklyWindow.URL === 'undefined')) {
      var urlInstance = new URL(kuiklyWindow.location.href);
      tmp = '' + urlInstance.origin + urlInstance.pathname;
    } else {
      tmp = '';
    }
    var urlPrefix = tmp;
    var tmp0_elvis_lhs = params.t12('pageData');
    var pageData = (tmp0_elvis_lhs == null ? JSONObject_init_$Create$() : tmp0_elvis_lhs).k15();
    // Inline function 'kotlin.collections.set' call
    var key = 'page_name';
    pageData.k2(key, pageName);
    var tmp_0 = pageData.g1();
    var urlParamsString = joinToString(tmp_0, '&', VOID, VOID, VOID, VOID, KRRouterModule$openPage$lambda);
    kuiklyWindow.open(urlPrefix + '?' + urlParamsString);
  }
  function closePage($this) {
    try {
      kuiklyWindow.close();
    } catch ($p) {
      var e = $p;
      Log_instance.mg(['close page error: ' + e]);
    }
  }
  function Companion_29() {
    this.l15_1 = 'KRRouterModule';
    this.m15_1 = 'openPage';
    this.n15_1 = 'closePage';
  }
  var Companion_instance_29;
  function Companion_getInstance_29() {
    return Companion_instance_29;
  }
  function KRRouterModule$openPage$lambda(_destruct__k2r9zo) {
    // Inline function 'kotlin.collections.component1' call
    var key = _destruct__k2r9zo.z();
    // Inline function 'kotlin.collections.component2' call
    var value = _destruct__k2r9zo.a1();
    return key + '=' + toString(value);
  }
  function KRRouterModule() {
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRRouterModule).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'openPage':
        openPage(this, params);
        tmp = Unit_instance;
        break;
      case 'closePage':
        closePage(this);
        tmp = Unit_instance;
        break;
      default:
        tmp = protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function getItem($this, key) {
    if (key == null) {
      return null;
    }
    return kuiklyWindow.localStorage.getItem(key);
  }
  function setItem($this, params) {
    var json = toJSONObjectSafely(params);
    var key = json.ho('key');
    var value = json.ho('value');
    kuiklyWindow.localStorage.setItem(key, value);
  }
  function Companion_30() {
    this.p15_1 = 'KRSharedPreferencesModule';
    this.q15_1 = 'getItem';
    this.r15_1 = 'setItem';
  }
  var Companion_instance_30;
  function Companion_getInstance_30() {
    return Companion_instance_30;
  }
  function KRSharedPreferencesModule() {
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRSharedPreferencesModule).yn = function (method, params, callback) {
    var tmp;
    switch (method) {
      case 'getItem':
        tmp = getItem(this, params);
        break;
      case 'setItem':
        setItem(this, params);
        tmp = Unit_instance;
        break;
      default:
        tmp = protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
        break;
    }
    return tmp;
  };
  function snapshotPager($this) {
  }
  function Companion_31() {
    this.t15_1 = 'KRSnapshotModule';
    this.u15_1 = 'snapshotPager';
  }
  var Companion_instance_31;
  function Companion_getInstance_31() {
    return Companion_instance_31;
  }
  function KRSnapshotModule() {
    KuiklyRenderBaseModule.call(this);
  }
  protoOf(KRSnapshotModule).yn = function (method, params, callback) {
    var tmp;
    if (method === 'snapshotPager') {
      snapshotPager(this);
      tmp = Unit_instance;
    } else {
      tmp = protoOf(KuiklyRenderBaseModule).yn.call(this, method, params, callback);
    }
    return tmp;
  };
  function IKuiklyRenderModuleExport() {
  }
  function IKuiklyRenderShadowExport() {
  }
  function IKuiklyRenderViewExport() {
  }
  function KuiklyRenderBaseModule() {
    this.s11_1 = null;
  }
  protoOf(KuiklyRenderBaseModule).qn = function (value) {
    this.s11_1 = value;
  };
  function get_propHandlers() {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return propHandlers;
  }
  var propHandlers;
  function getCSSTransform_0(value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var transformSpilt = split(value, ['|']);
    var anchorSpilt = split(transformSpilt.j(3), [' ']);
    var anchorX = toPercentage(anchorSpilt.j(0));
    var anchorY = toPercentage(anchorSpilt.j(1));
    var transformOrigin = anchorX + ' ' + anchorY;
    var translateSpilt = split(transformSpilt.j(2), [' ']);
    var translateX = toPercentage(translateSpilt.j(0));
    var translateY = toPercentage(translateSpilt.j(1));
    var rotate = transformSpilt.j(0) + 'deg';
    var scaleSpilt = split(transformSpilt.j(1), [' ']);
    var scaleX = scaleSpilt.j(0);
    var scaleY = scaleSpilt.j(1);
    var skewSplit = split(transformSpilt.j(4), [' ']);
    var skewX = skewSplit.j(0) + 'deg';
    var skewY = skewSplit.j(1) + 'deg';
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [transformOrigin, 'translate(' + translateX + ', ' + translateY + ') rotate(' + rotate + ') scale(' + scaleX + ', ' + scaleY + ') skew(' + skewX + ', ' + skewY + ')'];
  }
  function getCSSBackgroundImage(value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var startIndex = indexOf(value, '(');
    var tmp1 = startIndex + 1 | 0;
    // Inline function 'kotlin.text.substring' call
    var endIndex = value.length - 1 | 0;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$1 = value.substring(tmp1, endIndex);
    var spilt = split(tmp$ret$1, [',']);
    var bgImage = 'linear-gradient(';
    var direction;
    switch (spilt.j(0)) {
      case '0':
        direction = 'to top';
        break;
      case '1':
        direction = 'to bottom';
        break;
      case '2':
        direction = 'to left';
        break;
      case '3':
        direction = 'to right';
        break;
      case '4':
        direction = 'to top left';
        break;
      case '5':
        direction = 'to top right';
        break;
      case '6':
        direction = 'to bottom left';
        break;
      case '7':
        direction = 'to bottom right';
        break;
      default:
        direction = 'to top';
        break;
    }
    bgImage = bgImage + (direction + ',');
    var inductionVariable = 1;
    var last = spilt.i();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var colorStopSpilt = split(spilt.j(i), [' ']);
        var tmp;
        if (colorStopSpilt.i() === 2) {
          var tmp_0 = toRgbColor(colorStopSpilt.j(0)) + ' ';
          // Inline function 'kotlin.text.toFloat' call
          var this_0 = colorStopSpilt.j(1);
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          tmp = tmp_0 + toDouble(this_0) * 100.0 + '%';
        } else {
          tmp = toRgbColor(colorStopSpilt.j(0));
        }
        var color = tmp;
        bgImage = bgImage + color;
        if (!(i === (spilt.i() - 1 | 0))) {
          bgImage = bgImage + ',';
        }
      }
       while (inductionVariable < last);
    return bgImage + ')';
  }
  function getShadowString(shadowList) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    if (shadowList.i() < 4) {
      return '';
    }
    var offsetX = toPxF(shadowList.j(0));
    var offsetY = toPxF(shadowList.j(1));
    var radius = toPxF(shadowList.j(2));
    var color = toRgbColor(shadowList.j(3));
    return offsetX + ' ' + offsetY + ' ' + radius + ' ' + color;
  }
  function setKRAnimation(_this__u8e3s4, animation) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    bindAnimationEndEvent(_this__u8e3s4);
    if (animation == null) {
      var animationQueue = getAnimationQueue(_this__u8e3s4);
      if (!(animationQueue == null)) {
        var animationQueueCopy = LinkedHashMap_init_$Create$_0(animationQueue);
        // Inline function 'kotlin.collections.forEach' call
        // Inline function 'kotlin.collections.iterator' call
        var _iterator__ex2g4s = animationQueueCopy.g1().f();
        while (_iterator__ex2g4s.g()) {
          var element = _iterator__ex2g4s.h();
          // Inline function 'kotlin.collections.component2' call
          var v = element.a1();
          v.jl();
          v.kl();
        }
      }
    } else {
      // Inline function 'kotlin.text.isEmpty' call
      if (charSequenceLength(animation) === 0) {
        var forceCommit = false;
        if (get_exportAnimationTimeoutId(_this__u8e3s4) > 0) {
          kuiklyWindow.clearTimeout(get_exportAnimationTimeoutId(_this__u8e3s4));
          forceCommit = true;
        }
        var commitAnimation = get_hrAnimation(_this__u8e3s4);
        set_hrAnimation(_this__u8e3s4, null);
        var animationQueue_0 = getAnimationQueue(_this__u8e3s4);
        if (!(animationQueue_0 == null)) {
          // Inline function 'kotlin.collections.forEach' call
          // Inline function 'kotlin.collections.iterator' call
          var _iterator__ex2g4s_0 = animationQueue_0.g1().f();
          while (_iterator__ex2g4s_0.g()) {
            var element_0 = _iterator__ex2g4s_0.h();
            // Inline function 'kotlin.collections.component2' call
            var v_0 = element_0.a1();
            v_0.cl(forceCommit);
          }
          var tmp0_safe_receiver = get_kuiklyAnimation(_this__u8e3s4);
          if (tmp0_safe_receiver == null)
            null;
          else
            tmp0_safe_receiver.w15(getAnimationStepOption(_this__u8e3s4, commitAnimation));
          var tmp1_safe_receiver = get_kuiklyAnimation(_this__u8e3s4);
          var tmp;
          if (tmp1_safe_receiver == null) {
            tmp = null;
          } else {
            // Inline function 'kotlin.js.unsafeCast' call
            // Inline function 'kotlin.js.asDynamic' call
            tmp = tmp1_safe_receiver.x15(_this__u8e3s4);
          }
          set_kuiklyAnimationGroup(_this__u8e3s4, tmp);
          if (get_kuiklyAnimationGroup(_this__u8e3s4) != null && get_kuiklyAnimationGroup(_this__u8e3s4) != '') {
            var tmp_0 = kuiklyWindow;
            set_exportAnimationTimeoutId(_this__u8e3s4, tmp_0.setTimeout(setKRAnimation$lambda(_this__u8e3s4), 10));
          }
        }
      } else {
        if (get_isRepeatAnimation(_this__u8e3s4)) {
          var animationQueue_1 = getAnimationQueue(_this__u8e3s4);
          if (!(animationQueue_1 == null)) {
            var animationQueueCopy_0 = LinkedHashMap_init_$Create$_0(animationQueue_1);
            // Inline function 'kotlin.collections.forEach' call
            // Inline function 'kotlin.collections.iterator' call
            var _iterator__ex2g4s_1 = animationQueueCopy_0.g1().f();
            while (_iterator__ex2g4s_1.g()) {
              var element_1 = _iterator__ex2g4s_1.h();
              element_1.a1().ql();
            }
          }
          set_isRepeatAnimation(_this__u8e3s4, false);
        }
        var newAnimation = new KRCSSAnimation(animation, _this__u8e3s4);
        var tmp_1 = newAnimation;
        tmp_1.qj_1 = setKRAnimation$lambda_0(_this__u8e3s4);
        var tmp_2;
        if (!(get_hrAnimation(_this__u8e3s4) == null)) {
          var tmp4_safe_receiver = get_hrAnimation(_this__u8e3s4);
          tmp_2 = (tmp4_safe_receiver == null ? null : tmp4_safe_receiver.ll()) === true;
        } else {
          tmp_2 = false;
        }
        if (tmp_2) {
          var tmp2_safe_receiver = get_hrAnimation(_this__u8e3s4);
          if (tmp2_safe_receiver == null)
            null;
          else {
            tmp2_safe_receiver.el();
          }
          var tmp3_safe_receiver = get_kuiklyAnimation(_this__u8e3s4);
          if (tmp3_safe_receiver == null)
            null;
          else
            tmp3_safe_receiver.w15(getAnimationStepOption(_this__u8e3s4, get_hrAnimation(_this__u8e3s4)));
        }
        set_hrAnimation(_this__u8e3s4, newAnimation);
        addKRAnimation(_this__u8e3s4, newAnimation);
      }
    }
  }
  function convertGradientStringToCssMask(gradientStr) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var directionMap = mapOf_0([to(0, 'to top'), to(1, 'to bottom'), to(2, 'to left'), to(3, 'to right'), to(4, 'to top left'), to(5, 'to top right'), to(6, 'to bottom left'), to(7, 'to bottom right')]);
    // Inline function 'kotlin.text.toRegex' call
    var this_0 = 'linear-gradient\\((\\d+),(.+)\\)';
    var pattern = Regex_init_$Create$(this_0);
    var tmp0_elvis_lhs = pattern.v8(gradientStr);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return gradientStr;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var match = tmp;
    var _destruct__k2r9zo = match.u9();
    // Inline function 'kotlin.text.Destructured.component1' call
    var dirNum = _destruct__k2r9zo.rc_1.t9().j(1);
    // Inline function 'kotlin.text.Destructured.component2' call
    var stops = _destruct__k2r9zo.rc_1.t9().j(2);
    var tmp1_elvis_lhs = directionMap.d1(toInt(dirNum));
    var direction = tmp1_elvis_lhs == null ? 'to bottom' : tmp1_elvis_lhs;
    // Inline function 'kotlin.text.toRegex' call
    var this_1 = 'rgba\\((\\d+),(\\d+),(\\d+),([\\d.]+)\\)\\s*([\\d.]+)?';
    var colorStopPattern = Regex_init_$Create$(this_1);
    // Inline function 'kotlin.text.toRegex' call
    var this_2 = ',(?![^()]*\\))';
    // Inline function 'kotlin.text.split' call
    var tmp_0 = Regex_init_$Create$(this_2).y8(stops, 0);
    var processedStops = joinToString(tmp_0, ', ', VOID, VOID, VOID, VOID, convertGradientStringToCssMask$lambda(colorStopPattern));
    return 'linear-gradient(' + direction + ', ' + processedStops + ')';
  }
  function setFrame(_this__u8e3s4, frame, style) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicElement = _this__u8e3s4;
    style.position = 'absolute';
    var left = frame.wl_1;
    var top = frame.xl_1;
    dynamicElement.rawLeft = left;
    dynamicElement.rawTop = top;
    style.left = toPxF(left);
    style.top = toPxF(top);
    style.width = toPxF(frame.yl_1);
    style.height = toPxF(frame.zl_1);
    // Inline function 'kotlin.js.asDynamic' call
    if (style.checkAndUpdatePosition != null) {
      // Inline function 'kotlin.js.asDynamic' call
      style.checkAndUpdatePosition();
    } else {
      checkAndUpdatePositionForH5(_this__u8e3s4, frame, style);
    }
  }
  function set_animationCompletionBlock(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    if (!(value == null)) {
      putViewData(_this__u8e3s4, 'animationCompletion', value);
    } else {
      removeViewData(_this__u8e3s4, 'animationCompletion');
    }
  }
  function get_animationCompletionBlock(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return getViewData(_this__u8e3s4, 'animationCompletion');
  }
  function toPercentage(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.text.toFloat' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return (toDouble(_this__u8e3s4) * 100).toString() + '%';
  }
  function bindAnimationEndEvent(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    if (!get_isBindAnimationEndEvent(_this__u8e3s4)) {
      set_isBindAnimationEndEvent(_this__u8e3s4, true);
      _this__u8e3s4.addEventListener('transitionend', bindAnimationEndEvent$lambda(_this__u8e3s4));
    }
  }
  function getAnimationQueue(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return getViewData(_this__u8e3s4, 'animationQueue');
  }
  function set_exportAnimationTimeoutId(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.exportAnimationTimeoutId = value;
  }
  function get_exportAnimationTimeoutId(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp0_elvis_lhs = getViewData(_this__u8e3s4, 'exportAnimationTimeoutId');
    return tmp0_elvis_lhs == null ? 0 : tmp0_elvis_lhs;
  }
  function set_hrAnimation(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var animation = get_hrAnimation(_this__u8e3s4);
    if (equals(value, animation)) {
      return Unit_instance;
    }
    if (value == null) {
      if (removeViewData(_this__u8e3s4, 'animation') == null)
        return Unit_instance;
    } else {
      putViewData(_this__u8e3s4, 'animation', value);
    }
  }
  function get_hrAnimation(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return getViewData(_this__u8e3s4, 'animation');
  }
  function set_kuiklyAnimation(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var animation = get_kuiklyAnimation(_this__u8e3s4);
    if (equals(value, animation)) {
      return Unit_instance;
    }
    if (value == null) {
      if (removeViewData(_this__u8e3s4, 'kuiklyAnimation') == null)
        return Unit_instance;
    } else {
      putViewData(_this__u8e3s4, 'kuiklyAnimation', value);
    }
  }
  function get_kuiklyAnimation(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return getViewData(_this__u8e3s4, 'kuiklyAnimation');
  }
  function getAnimationStepOption(_this__u8e3s4, animation) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp = to('duration', animation == null ? null : animation.rj_1);
    var tmp_0 = to('delay', animation == null ? null : animation.xj_1);
    var tmp_1 = to('timingFunction', animation == null ? null : animation.gk());
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return json([tmp, tmp_0, tmp_1, to('transformOrigin', _this__u8e3s4.style.transformOrigin)]);
  }
  function set_kuiklyAnimationGroup(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    putViewData(_this__u8e3s4, 'kuiklyAnimationGroup', !(value == null) ? value : THROW_CCE());
  }
  function get_kuiklyAnimationGroup(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return getViewData(_this__u8e3s4, 'kuiklyAnimationGroup');
  }
  function exportAnimation(_this__u8e3s4, group) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    _this__u8e3s4.setAttribute('animation', group);
  }
  function set_isRepeatAnimation(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.isRepeatAnimation = value;
  }
  function get_isRepeatAnimation(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp0_elvis_lhs = getViewData(_this__u8e3s4, 'isRepeatAnimation');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var isRepeatAnimation = tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    return isRepeatAnimation;
  }
  function clearAnimationTimeout(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var animationQueue = getAnimationQueue(_this__u8e3s4);
    if (animationQueue == null && get_exportAnimationTimeoutId(_this__u8e3s4) > 0) {
      kuiklyWindow.clearTimeout(get_exportAnimationTimeoutId(_this__u8e3s4));
      set_exportAnimationTimeoutId(_this__u8e3s4, 0);
    }
  }
  function addKRAnimation(_this__u8e3s4, hrAnimation) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp0_elvis_lhs = getAnimationQueue(_this__u8e3s4);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.apply' call
      var this_0 = LinkedHashMap_init_$Create$();
      putViewData(_this__u8e3s4, 'animationQueue', this_0);
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var animationQueue = tmp;
    // Inline function 'kotlin.collections.set' call
    var key = hashCode(hrAnimation);
    animationQueue.k2(key, hrAnimation);
  }
  function checkAndUpdatePositionForH5(_this__u8e3s4, frame, style) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    if (endsWith(style.borderWidth, 'px')) {
      var tmp = Promise.resolve(null);
      tmp.then(checkAndUpdatePositionForH5$lambda(style, _this__u8e3s4));
    }
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_safe_receiver = _this__u8e3s4.parentElement;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.js.asDynamic' call
      var dynamicChild = _this__u8e3s4;
      if (endsWith(tmp0_safe_receiver.style.borderWidth, 'px') && typeof dynamicChild.isAdujustedOffset === 'undefined') {
        var borderWidth = pxToDouble(tmp0_safe_receiver.style.borderWidth);
        style.left = toPxF(frame.wl_1 - borderWidth);
        style.top = toPxF(frame.xl_1 - borderWidth);
      }
    }
  }
  function getViewData(_this__u8e3s4, key) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    return _this__u8e3s4[key];
  }
  function putViewData(_this__u8e3s4, key, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4[key] = value;
  }
  function removeViewData(_this__u8e3s4, key) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4[key] = null;
    return null;
  }
  function set_isBindAnimationEndEvent(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.isBindAnimationEndEvent = value;
  }
  function get_isBindAnimationEndEvent(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp0_elvis_lhs = getViewData(_this__u8e3s4, 'isBindAnimationEndEvent');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var isBindEvent = tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    return isBindEvent;
  }
  function handlePropTransitionEnd(_this__u8e3s4, name) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var propertyName = name;
    if (KRCssConst_getInstance().f17_1.x(propertyName) >= 0) {
      propertyName = 'frame';
      var _unary__edvuaz = get_frameAnimationEndCount(_this__u8e3s4);
      set_frameAnimationEndCount(_this__u8e3s4, _unary__edvuaz + 1 | 0);
    } else if (propertyName === 'background-color') {
      propertyName = 'backgroundColor';
    }
    var animationQueue = getAnimationQueue(_this__u8e3s4);
    if (!(animationQueue == null)) {
      var animationQueueCopy = LinkedHashMap_init_$Create$_0(animationQueue);
      // Inline function 'kotlin.collections.forEach' call
      // Inline function 'kotlin.collections.iterator' call
      var _iterator__ex2g4s = animationQueueCopy.g1().f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        $l$block: {
          var animationKeys = element.a1().fl();
          var tmp;
          // Inline function 'kotlin.collections.isNotEmpty' call
          if (!animationKeys.k()) {
            tmp = animationKeys.w(propertyName);
          } else {
            tmp = false;
          }
          if (tmp) {
            if (get_isRepeatAnimation(_this__u8e3s4) || element.a1().ml()) {
              set_isRepeatAnimation(_this__u8e3s4, true);
              break $l$block;
            }
            if (propertyName === 'frame') {
              set_frameAnimationRemainCount(_this__u8e3s4, element.a1().vl());
            }
            var tmp_0;
            if (!(propertyName === 'frame')) {
              tmp_0 = true;
            } else {
              var containsUpper = get_frameAnimationEndCount(_this__u8e3s4);
              var containsArg = get_frameAnimationRemainCount(_this__u8e3s4);
              tmp_0 = 1 <= containsArg ? containsArg <= containsUpper : false;
            }
            if (tmp_0) {
              element.a1().nl(propertyName);
            }
          } else {
            if (animationKeys.k()) {
              element.a1().kl();
            }
          }
        }
      }
    }
    if (get_isRepeatAnimation(_this__u8e3s4)) {
      exportAnimation(_this__u8e3s4, '');
      var tmp_1 = kuiklyWindow;
      tmp_1.setTimeout(handlePropTransitionEnd$lambda(_this__u8e3s4), 10);
    } else if (getAnimationQueue(_this__u8e3s4) == null) {
      exportAnimation(_this__u8e3s4, '');
    }
  }
  function handleStyleTransitionEnd(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var animationQueue1 = getAnimationQueue(_this__u8e3s4);
    if (!(animationQueue1 == null)) {
      var animationQueueCopy1 = LinkedHashMap_init_$Create$_0(animationQueue1);
      // Inline function 'kotlin.collections.forEach' call
      // Inline function 'kotlin.collections.iterator' call
      var _iterator__ex2g4s = animationQueueCopy1.g1().f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        var animationKeys = element.a1().fl();
        if (animationKeys.k()) {
          element.a1().kl();
        }
      }
    }
    var animationQueue = getAnimationQueue(_this__u8e3s4);
    if (!(animationQueue == null)) {
      var size = animationQueue.i();
      if (size > 0) {
        var animation = first(animationQueue.g1()).a1();
        if (get_isRepeatAnimation(_this__u8e3s4) || animation.ml()) {
          set_isRepeatAnimation(_this__u8e3s4, true);
        } else {
          animation.pl();
        }
      }
      if (animationQueue.i() === 0) {
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        _this__u8e3s4.style.transition = '';
      }
    }
    if (get_isRepeatAnimation(_this__u8e3s4)) {
      repeatStyleAnimation(_this__u8e3s4);
    }
  }
  function KRCssConst() {
    KRCssConst_instance = this;
    this.y15_1 = 'opacity';
    this.z15_1 = 'visibility';
    this.a16_1 = 'overflow';
    this.b16_1 = 'backgroundColor';
    this.c16_1 = 'background-color';
    this.d16_1 = 'touchEnable';
    this.e16_1 = 'transform';
    this.f16_1 = 'backgroundImage';
    this.g16_1 = 'boxShadow';
    this.h16_1 = 'textShadow';
    this.i16_1 = 'borderRadius';
    this.j16_1 = 'strokeWidth';
    this.k16_1 = 'strokeColor';
    this.l16_1 = 'border';
    this.m16_1 = 'click';
    this.n16_1 = 'maskLinearGradient';
    this.o16_1 = 'doubleClick';
    this.p16_1 = 'longPress';
    this.q16_1 = 'frame';
    this.r16_1 = 'color';
    this.s16_1 = 'zIndex';
    this.t16_1 = 'accessibility';
    this.u16_1 = 'pan';
    this.v16_1 = 'superTouch';
    this.w16_1 = 'animation';
    this.x16_1 = 'animationQueue';
    this.y16_1 = 'animationCompletion';
    this.z16_1 = 'kuiklyAnimation';
    this.a17_1 = ' ';
    this.b17_1 = '';
    this.c17_1 = 'touchDown';
    this.d17_1 = 'touchUp';
    this.e17_1 = 'touchMove';
    this.f17_1 = listOf(['width', 'height', 'left', 'top']);
  }
  var KRCssConst_instance;
  function KRCssConst_getInstance() {
    if (KRCssConst_instance == null)
      new KRCssConst();
    return KRCssConst_instance;
  }
  function set_frameAnimationEndCount(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.frameAnimationEndCount = value;
  }
  function get_frameAnimationEndCount(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp0_elvis_lhs = getViewData(_this__u8e3s4, 'frameAnimationEndCount');
    return tmp0_elvis_lhs == null ? 0 : tmp0_elvis_lhs;
  }
  function set_frameAnimationRemainCount(_this__u8e3s4, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.frameAnimationRemainCount = value;
  }
  function get_frameAnimationRemainCount(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp0_elvis_lhs = getViewData(_this__u8e3s4, 'frameAnimationRemainCount');
    return tmp0_elvis_lhs == null ? 0 : tmp0_elvis_lhs;
  }
  function repeatStyleAnimation(_this__u8e3s4) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicElement = _this__u8e3s4;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var ele = _this__u8e3s4;
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicStyle = ele.style;
    var hasAnimationData = typeof dynamicElement.animationData;
    if (hasAnimationData === 'object') {
      // Inline function 'kotlin.js.unsafeCast' call
      var data = dynamicElement.animationData;
      ele.style.transition = '';
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var rules = data['rules'];
      if (rules == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        var tmp = Object.keys(rules);
        var ruleList = (!(tmp == null) ? isArray(tmp) : false) ? tmp : THROW_CCE();
        var inductionVariable = 0;
        var last = ruleList.length;
        while (inductionVariable < last) {
          var key = ruleList[inductionVariable];
          inductionVariable = inductionVariable + 1 | 0;
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          var value = rules[key];
          dynamicStyle[key] = value['oldValue'];
        }
        var tmp_0 = kuiklyWindow;
        tmp_0.setTimeout(repeatStyleAnimation$lambda(ele, data, ruleList, rules, dynamicStyle), 50);
      }
    }
  }
  function setCommonProp(_this__u8e3s4, key, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var ele = _this__u8e3s4;
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicElement = ele;
    if (tryAddAnimationOperation(_this__u8e3s4, key, value)) {
      return true;
    }
    var tmp0_safe_receiver = get_propHandlers().d1(key);
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver(ele.style, value, ele);
    var result = tmp1_elvis_lhs == null ? false : tmp1_elvis_lhs;
    // Inline function 'kotlin.text.isNotEmpty' call
    var this_0 = ele.style.borderWidth;
    if (charSequenceLength(this_0) > 0) {
      var tmp = Promise.resolve(null);
      tmp.then(setCommonProp$lambda(dynamicElement));
    }
    return result;
  }
  function tryAddAnimationOperation(_this__u8e3s4, key, value) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var animation = get_hrAnimation(_this__u8e3s4);
    if (!(animation == null) && animation.vk(key)) {
      animation.wk(key, value);
      return true;
    }
    return false;
  }
  function indexOfChild(node) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var parent = node == null ? null : node.parentElement;
    if (!(parent == null)) {
      var childNodes = parent.childNodes;
      var length = parent.childElementCount;
      var inductionVariable = 0;
      if (inductionVariable < length)
        do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          // Inline function 'org.w3c.dom.get' call
          // Inline function 'kotlin.js.asDynamic' call
          if (node === childNodes[i]) {
            return i;
          }
        }
         while (inductionVariable < length);
    }
    return -1;
  }
  function setPlaceholderColor(el, color) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var uniqueClass = 'phcolor_' + Default_getInstance().hb(1000000);
    el.classList.add(uniqueClass);
    var css = trimIndent('\n        .' + uniqueClass + '::placeholder { color: ' + color + '; opacity: 1; }\n    ');
    var style = kuiklyDocument.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(kuiklyDocument.createTextNode(css));
    var tmp0_safe_receiver = kuiklyDocument.head;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.appendChild(style);
  }
  function propHandlers$lambda(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.opacity = toString(value);
    return true;
  }
  function propHandlers$lambda_0(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    if (value === 0) {
      tmp = 'hidden';
    } else {
      tmp = 'visible';
    }
    cssStyle.visibility = tmp;
    return true;
  }
  function propHandlers$lambda_1(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    if (value === 1) {
      tmp = 'hidden';
    } else {
      tmp = 'visible';
    }
    var overflow = tmp;
    cssStyle.overflowX = overflow;
    cssStyle.overflowY = overflow;
    return true;
  }
  function propHandlers$lambda_2(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.backgroundColor = toRgbColor(value);
    return true;
  }
  function propHandlers$lambda_3(cssStyle, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    ele.onclick = null;
    ele.onprogress = null;
    ele.ondblclick = null;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    if (value === 0) {
      tmp = 'none';
    } else {
      tmp = 'auto';
    }
    cssStyle.pointerEvents = tmp;
    return true;
  }
  function propHandlers$lambda_4(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var transformContent = getCSSTransform_0(value);
    cssStyle.transformOrigin = transformContent[0];
    cssStyle.transform = transformContent[1];
    return true;
  }
  function propHandlers$lambda_5(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var stringValue = value;
    var backgroundImagePrefix = 'background-image: ';
    if (startsWith(stringValue, backgroundImagePrefix)) {
      var tmp2 = backgroundImagePrefix.length;
      // Inline function 'kotlin.text.substring' call
      var endIndex = stringValue.length - 1 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      cssStyle.backgroundImage = stringValue.substring(tmp2, endIndex);
    } else {
      cssStyle.backgroundImage = getCSSBackgroundImage(stringValue);
    }
    return true;
  }
  function propHandlers$lambda_6(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var boxShadowSpilt = split(typeof value === 'string' ? value : THROW_CCE(), [' ']);
    cssStyle.boxShadow = getShadowString(boxShadowSpilt);
    return true;
  }
  function propHandlers$lambda_7(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    var textShadowSpilt = split(typeof value === 'string' ? value : THROW_CCE(), [' ']);
    cssStyle.textShadow = getShadowString(textShadowSpilt);
    return true;
  }
  function propHandlers$lambda_8(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    var usedWidth = value / 4;
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicCssStyle = cssStyle;
    dynamicCssStyle.webkitTextStroke = '' + usedWidth + 'px ' + dynamicCssStyle.webkitTextStroke;
    return true;
  }
  function propHandlers$lambda_9(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.webkitTextStroke = toString(value);
    return true;
  }
  function propHandlers$lambda_10(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.with' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.asDynamic' call
    var borderRadiusSpilt = value.split(',');
    var baseRadius = borderRadiusSpilt[0];
    if (baseRadius == borderRadiusSpilt[1] && baseRadius == borderRadiusSpilt[2] && baseRadius == borderRadiusSpilt[3]) {
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$3 = borderRadiusSpilt[0];
      cssStyle.borderRadius = toPxF(tmp$ret$3);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$4 = borderRadiusSpilt[0];
      cssStyle.borderTopLeftRadius = toPxF(tmp$ret$4);
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$5 = borderRadiusSpilt[1];
      cssStyle.borderTopRightRadius = toPxF(tmp$ret$5);
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$6 = borderRadiusSpilt[2];
      cssStyle.borderBottomLeftRadius = toPxF(tmp$ret$6);
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$7 = borderRadiusSpilt[3];
      cssStyle.borderBottomRightRadius = toPxF(tmp$ret$7);
    }
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.overflow = 'hidden';
    return true;
  }
  function propHandlers$lambda_11(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var borders = split(value, [' ']);
    // Inline function 'kotlin.text.toFloat' call
    var this_0 = borders.j(0);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$4 = toDouble(this_0);
    cssStyle.borderWidth = toPxF(tmp$ret$4);
    cssStyle.borderStyle = borders.j(1);
    cssStyle.borderColor = toRgbColor(borders.j(2));
    cssStyle.boxSizing = 'border-box';
    return true;
  }
  function propHandlers$lambda_12(_unused_var__etf5q3, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    ele.addEventListener('click', propHandlers$lambda$lambda(value));
    return true;
  }
  function propHandlers$lambda$lambda($value) {
    return function (event) {
      // Inline function 'kotlin.js.asDynamic' call
      var clickEvent = event;
      clickEvent.stopPropagation();
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp = $value;
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$3 = clickEvent.offsetX;
      var tmp_0 = to('x', tmp$ret$3);
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$4 = clickEvent.offsetY;
      tmp.zq(mapOf_0([tmp_0, to('y', tmp$ret$4)]));
      return Unit_instance;
    };
  }
  function propHandlers$lambda_13(_unused_var__etf5q3, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    ele.addEventListener('dblclick', propHandlers$lambda$lambda_0(value));
    return true;
  }
  function propHandlers$lambda$lambda_0($value) {
    return function (event) {
      // Inline function 'kotlin.js.asDynamic' call
      var clickEvent = event;
      clickEvent.stopPropagation();
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp = $value;
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$3 = clickEvent.offsetX;
      var tmp_0 = to('x', tmp$ret$3);
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$4 = clickEvent.offsetY;
      tmp.zq(mapOf_0([tmp_0, to('y', tmp$ret$4)]));
      return Unit_instance;
    };
  }
  function propHandlers$lambda_14(_unused_var__etf5q3, _unused_var__etf5q3_0, _unused_var__etf5q3_1) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    return true;
  }
  function propHandlers$lambda_15(_unused_var__etf5q3, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    setKRAnimation(ele, value);
    return true;
  }
  function propHandlers$lambda_16(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var linearValue = convertGradientStringToCssMask(value);
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.webkitMask = linearValue;
    return true;
  }
  function propHandlers$lambda_17(cssStyle, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    setFrame(ele, value, cssStyle);
    return true;
  }
  function propHandlers$lambda_18(_unused_var__etf5q3, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    set_animationCompletionBlock(ele, value);
    return true;
  }
  function propHandlers$lambda_19(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.color = toRgbColor(value);
    return true;
  }
  function propHandlers$lambda_20(cssStyle, value, _unused_var__etf5q3) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    cssStyle.zIndex = value.toString();
    return true;
  }
  function propHandlers$lambda_21(_unused_var__etf5q3, value, ele) {
    _init_properties_KuiklyRenderCSSKTX_kt__u45o1x();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    ele.setAttribute('aria-label', value);
    return true;
  }
  function setKRAnimation$lambda($this_setKRAnimation) {
    return function () {
      exportAnimation($this_setKRAnimation, get_kuiklyAnimationGroup($this_setKRAnimation));
      return Unit_instance;
    };
  }
  function setKRAnimation$lambda_0($this_setKRAnimation) {
    return function (hrAnimation, finished, propKey, animationKey) {
      var tmp0_safe_receiver = get_animationCompletionBlock($this_setKRAnimation);
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(mapOf_0([to('finish', finished ? 1 : 0), to('attr', propKey), to('animationKey', animationKey)]));
      }
      hrAnimation.kl();
      clearAnimationTimeout($this_setKRAnimation);
      return Unit_instance;
    };
  }
  function convertGradientStringToCssMask$lambda($colorStopPattern) {
    return function (stop) {
      var tmp0_safe_receiver = $colorStopPattern.v8(stop);
      var tmp;
      if (tmp0_safe_receiver == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.let' call
        var _destruct__k2r9zo = tmp0_safe_receiver.u9();
        // Inline function 'kotlin.text.Destructured.component1' call
        var r = _destruct__k2r9zo.rc_1.t9().j(1);
        // Inline function 'kotlin.text.Destructured.component2' call
        var g = _destruct__k2r9zo.rc_1.t9().j(2);
        // Inline function 'kotlin.text.Destructured.component3' call
        var b = _destruct__k2r9zo.rc_1.t9().j(3);
        // Inline function 'kotlin.text.Destructured.component4' call
        var a = _destruct__k2r9zo.rc_1.t9().j(4);
        // Inline function 'kotlin.text.Destructured.component5' call
        var pos = _destruct__k2r9zo.rc_1.t9().j(5);
        // Inline function 'kotlin.takeIf' call
        var tmp_0;
        // Inline function 'kotlin.text.isNotEmpty' call
        if (charSequenceLength(pos) > 0) {
          tmp_0 = pos;
        } else {
          tmp_0 = null;
        }
        var tmp0_safe_receiver_0 = tmp_0;
        var tmp_1;
        if (tmp0_safe_receiver_0 == null) {
          tmp_1 = null;
        } else {
          // Inline function 'kotlin.let' call
          // Inline function 'kotlin.text.toFloat' call
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          var tmp$ret$10 = toDouble(tmp0_safe_receiver_0);
          tmp_1 = '' + numberToInt(tmp$ret$10 * 100) + '%';
        }
        var tmp1_elvis_lhs = tmp_1;
        var position = tmp1_elvis_lhs == null ? '' : tmp1_elvis_lhs;
        // Inline function 'kotlin.text.toFloat' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp_2 = toDouble(a);
        var tmp_3;
        // Inline function 'kotlin.text.isNotEmpty' call
        if (charSequenceLength(position) > 0) {
          tmp_3 = ' ' + position;
        } else {
          tmp_3 = '';
        }
        tmp = 'rgba(' + r + ',' + g + ',' + b + ',' + tmp_2 + ')' + tmp_3;
      }
      var tmp1_elvis_lhs_0 = tmp;
      return tmp1_elvis_lhs_0 == null ? stop : tmp1_elvis_lhs_0;
    };
  }
  function bindAnimationEndEvent$lambda($this_bindAnimationEndEvent) {
    return function (event) {
      // Inline function 'kotlin.js.unsafeCast' call
      var propertyName = event.propertyName;
      var tmp;
      if (typeof propertyName === 'string') {
        handlePropTransitionEnd($this_bindAnimationEndEvent, propertyName);
        tmp = Unit_instance;
      } else {
        handleStyleTransitionEnd($this_bindAnimationEndEvent);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function checkAndUpdatePositionForH5$lambda($style, $this_checkAndUpdatePositionForH5) {
    return function (it) {
      var borderWidth = pxToDouble($style.borderWidth);
      var inductionVariable = 0;
      var last = $this_checkAndUpdatePositionForH5.children.length;
      var tmp;
      if (inductionVariable < last) {
        do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          // Inline function 'org.w3c.dom.get' call
          // Inline function 'kotlin.js.asDynamic' call
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          var child = $this_checkAndUpdatePositionForH5.children[i];
          // Inline function 'kotlin.js.asDynamic' call
          var dynamicChild = child;
          var tmp_0 = child.style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$5 = dynamicChild.rawLeft;
          tmp_0.left = toPxF(tmp$ret$5 - borderWidth);
          var tmp_1 = child.style;
          // Inline function 'kotlin.js.unsafeCast' call
          var tmp$ret$6 = dynamicChild.rawTop;
          tmp_1.top = toPxF(tmp$ret$6 - borderWidth);
          dynamicChild.isAdujustedOffset = true;
        }
         while (inductionVariable < last);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function handlePropTransitionEnd$lambda($this_handlePropTransitionEnd) {
    return function () {
      exportAnimation($this_handlePropTransitionEnd, get_kuiklyAnimationGroup($this_handlePropTransitionEnd));
      return Unit_instance;
    };
  }
  function repeatStyleAnimation$lambda($ele, $data, $ruleList, $rules, $dynamicStyle) {
    return function () {
      var tmp = $ele.style;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp.transition = $data['transition'];
      var indexedObject = $ruleList;
      var inductionVariable = 0;
      var last = indexedObject.length;
      while (inductionVariable < last) {
        var key = indexedObject[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var value = $rules[key];
        $dynamicStyle[key] = value['newValue'];
      }
      return Unit_instance;
    };
  }
  function setCommonProp$lambda($dynamicElement) {
    return function (it) {
      var tmp;
      if (typeof $dynamicElement.forceUpdateChildrenStyle === 'function') {
        $dynamicElement.forceUpdateChildrenStyle();
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  var properties_initialized_KuiklyRenderCSSKTX_kt_rcmt9;
  function _init_properties_KuiklyRenderCSSKTX_kt__u45o1x() {
    if (!properties_initialized_KuiklyRenderCSSKTX_kt_rcmt9) {
      properties_initialized_KuiklyRenderCSSKTX_kt_rcmt9 = true;
      var tmp = to('opacity', propHandlers$lambda);
      var tmp_0 = to('visibility', propHandlers$lambda_0);
      var tmp_1 = to('overflow', propHandlers$lambda_1);
      var tmp_2 = to('backgroundColor', propHandlers$lambda_2);
      var tmp_3 = to('touchEnable', propHandlers$lambda_3);
      var tmp_4 = to('transform', propHandlers$lambda_4);
      var tmp_5 = to('backgroundImage', propHandlers$lambda_5);
      var tmp_6 = to('boxShadow', propHandlers$lambda_6);
      var tmp_7 = to('textShadow', propHandlers$lambda_7);
      var tmp_8 = to('strokeWidth', propHandlers$lambda_8);
      var tmp_9 = to('strokeColor', propHandlers$lambda_9);
      var tmp_10 = to('borderRadius', propHandlers$lambda_10);
      var tmp_11 = to('border', propHandlers$lambda_11);
      var tmp_12 = to('click', propHandlers$lambda_12);
      var tmp_13 = to('doubleClick', propHandlers$lambda_13);
      var tmp_14 = to('longPress', propHandlers$lambda_14);
      var tmp_15 = to('animation', propHandlers$lambda_15);
      var tmp_16 = to('maskLinearGradient', propHandlers$lambda_16);
      var tmp_17 = to('frame', propHandlers$lambda_17);
      var tmp_18 = to('animationCompletion', propHandlers$lambda_18);
      var tmp_19 = to('color', propHandlers$lambda_19);
      var tmp_20 = to('zIndex', propHandlers$lambda_20);
      propHandlers = mapOf_0([tmp, tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, tmp_8, tmp_9, tmp_10, tmp_11, tmp_12, tmp_13, tmp_14, tmp_15, tmp_16, tmp_17, tmp_18, tmp_19, tmp_20, to('accessibility', propHandlers$lambda_21)]);
    }
  }
  function toRgbColor(_this__u8e3s4) {
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(_this__u8e3s4) === 0) {
      return _this__u8e3s4;
    }
    if (startsWith(_this__u8e3s4, 'rgba')) {
      return _this__u8e3s4;
    }
    var tmp;
    if (!(KuiklyRenderAdapterManager_instance.ih_1 == null)) {
      var tmp0_safe_receiver = KuiklyRenderAdapterManager_instance.ih_1;
      tmp = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.g17(_this__u8e3s4);
    } else {
      tmp = toLongOrNull(_this__u8e3s4);
    }
    var color = tmp;
    if (color == null) {
      color = new Long(0, 0);
    }
    var alpha = color.x1(24).y1(new Long(255, 0)).a2() / 255;
    var red = color.x1(16).y1(new Long(255, 0));
    var green = color.x1(8).y1(new Long(255, 0));
    var blue = color.y1(new Long(255, 0));
    return 'rgba(' + red.toString() + ', ' + green.toString() + ', ' + blue.toString() + ', ' + alpha + ')';
  }
  function toPxF(_this__u8e3s4) {
    return toString(_this__u8e3s4) + 'px';
  }
  function KuiklyRenderCallback(cb) {
    this.yq_1 = cb;
  }
  protoOf(KuiklyRenderCallback).zq = function (result) {
    this.yq_1(result);
  };
  function DOMRect(x, y, width, height) {
    x = x === VOID ? 0.0 : x;
    y = y === VOID ? 0.0 : y;
    width = width === VOID ? 0.0 : width;
    height = height === VOID ? 0.0 : height;
    this.wl_1 = x;
    this.xl_1 = y;
    this.yl_1 = width;
    this.zl_1 = height;
  }
  protoOf(DOMRect).h17 = function () {
    return this.wl_1;
  };
  protoOf(DOMRect).i17 = function () {
    return this.xl_1;
  };
  protoOf(DOMRect).j17 = function () {
    return this.wl_1 + this.yl_1;
  };
  protoOf(DOMRect).k17 = function () {
    return this.xl_1 + this.zl_1;
  };
  protoOf(DOMRect).toString = function () {
    return 'DOMRect(x=' + this.wl_1 + ', y=' + this.xl_1 + ', width=' + this.yl_1 + ', height=' + this.zl_1 + ', left=' + this.h17() + ', top=' + this.i17() + ', right=' + this.j17() + ', bottom=' + this.k17() + ')';
  };
  function pxToDouble(_this__u8e3s4) {
    var result = replace(_this__u8e3s4, 'px', '');
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(result) === 0) {
      tmp = 0.0;
    } else {
      tmp = toDouble(result);
    }
    return tmp;
  }
  function toNumberFloat(_this__u8e3s4) {
    return numberToDouble(isNumber(_this__u8e3s4) ? _this__u8e3s4 : THROW_CCE());
  }
  function get_width(_this__u8e3s4) {
    return _this__u8e3s4.x6_1;
  }
  function get_height(_this__u8e3s4) {
    return _this__u8e3s4.y6_1;
  }
  function toJSONObject(_this__u8e3s4) {
    var serializationObject = JSONObject_init_$Create$();
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = _this__u8e3s4.g1().f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      // Inline function 'kotlin.collections.component1' call
      var key = element.z();
      // Inline function 'kotlin.collections.component2' call
      var value = element.a1();
      if (typeof value === 'number') {
        serializationObject.p17(key, value);
      } else {
        if (value instanceof Long) {
          serializationObject.o17(key, value);
        } else {
          if (typeof value === 'number') {
            serializationObject.n17(key, value);
          } else {
            if (typeof value === 'number') {
              serializationObject.l17(key, value);
            } else {
              if (typeof value === 'string') {
                serializationObject.l17(key, value);
              } else {
                if (typeof value === 'boolean') {
                  serializationObject.m17(key, value);
                } else {
                  if (isInterface(value, KtMap)) {
                    // Inline function 'kotlin.js.unsafeCast' call
                    // Inline function 'kotlin.js.asDynamic' call
                    var map = value;
                    serializationObject.l17(key, toJSONObject(map));
                  } else {
                    if (isInterface(value, KtList)) {
                      // Inline function 'kotlin.js.unsafeCast' call
                      // Inline function 'kotlin.js.asDynamic' call
                      var list = value;
                      serializationObject.l17(key, toJSONArray(list));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return serializationObject;
  }
  function toJSONArray(_this__u8e3s4) {
    var serializationArray = JSONArray_init_$Create$();
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = _this__u8e3s4.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      if (typeof element === 'number') {
        serializationArray.u17(element);
      } else {
        if (element instanceof Long) {
          serializationArray.t17(element);
        } else {
          if (typeof element === 'number') {
            serializationArray.q17(element);
          } else {
            if (typeof element === 'number') {
              serializationArray.s17(element);
            } else {
              if (typeof element === 'string') {
                serializationArray.q17(element);
              } else {
                if (typeof element === 'boolean') {
                  serializationArray.r17(element);
                } else {
                  if (isInterface(element, KtMap)) {
                    // Inline function 'kotlin.js.unsafeCast' call
                    // Inline function 'kotlin.js.asDynamic' call
                    var map = element;
                    serializationArray.q17(toJSONObject(map));
                  } else {
                    if (isInterface(element, KtList)) {
                      // Inline function 'kotlin.js.unsafeCast' call
                      // Inline function 'kotlin.js.asDynamic' call
                      var list = element;
                      serializationArray.q17(toJSONArray(list));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return serializationArray;
  }
  function toJSONObjectSafely(_this__u8e3s4) {
    return JSONObject_init_$Create$_0(_this__u8e3s4 == null ? '{}' : _this__u8e3s4);
  }
  function pxToFloat(_this__u8e3s4) {
    var result = replace(_this__u8e3s4, 'px', '');
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(result) === 0) {
      tmp = 0.0;
    } else {
      // Inline function 'kotlin.text.toFloat' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = toDouble(result);
    }
    return tmp;
  }
  function splitCanvasColorDefinitions(colorString) {
    var result = new Array();
    var currentPart = StringBuilder_init_$Create$();
    var bracketCount = 0;
    var inductionVariable = 0;
    var last = colorString.length;
    while (inductionVariable < last) {
      var char = charSequenceGet(colorString, inductionVariable);
      inductionVariable = inductionVariable + 1 | 0;
      if (char === _Char___init__impl__6a9atx(40)) {
        bracketCount = bracketCount + 1 | 0;
        currentPart.q6(char);
      } else if (char === _Char___init__impl__6a9atx(41)) {
        bracketCount = bracketCount - 1 | 0;
        currentPart.q6(char);
      } else if (char === _Char___init__impl__6a9atx(44)) {
        if (bracketCount === 0) {
          // Inline function 'kotlin.text.trim' call
          var this_0 = currentPart.toString();
          // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
          var element = toString(trim(isCharSequence(this_0) ? this_0 : THROW_CCE()));
          // Inline function 'kotlin.js.asDynamic' call
          result[result.length] = element;
          currentPart = StringBuilder_init_$Create$();
        } else {
          currentPart.q6(char);
        }
      } else
        currentPart.q6(char);
    }
    // Inline function 'kotlin.text.isNotEmpty' call
    var this_1 = currentPart;
    if (charSequenceLength(this_1) > 0) {
      // Inline function 'kotlin.text.trim' call
      var this_2 = currentPart.toString();
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
      var element_0 = toString(trim(isCharSequence(this_2) ? this_2 : THROW_CCE()));
      // Inline function 'kotlin.js.asDynamic' call
      result[result.length] = element_0;
    }
    return result;
  }
  function getRenderViewHandler($this, tag) {
    return get($this.kj_1, tag);
  }
  function getShadowHandler($this, tag) {
    var tmp0_safe_receiver = $this.lj_1;
    return tmp0_safe_receiver == null ? null : get(tmp0_safe_receiver, tag);
  }
  function isShadowViewHybridComponent($this, viewName) {
    switch (viewName) {
      case 'KRRichTextView':
        return true;
      case 'KRGradientRichTextView':
        return true;
      default:
        return false;
    }
  }
  function getModuleHandler($this, moduleName) {
    var moduleHandler = get($this.mj_1, moduleName);
    if (moduleHandler == null) {
      var tmp0_safe_receiver = $this.jj_1;
      var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.kg();
      var tmp2_safe_receiver = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.yd(moduleName);
      var tmp;
      if (tmp2_safe_receiver == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.apply' call
        var tmp0_safe_receiver_0 = $this.jj_1;
        tmp2_safe_receiver.qn(tmp0_safe_receiver_0 == null ? null : tmp0_safe_receiver_0.jg());
        set($this.mj_1, moduleName, tmp2_safe_receiver);
        tmp = tmp2_safe_receiver;
      }
      moduleHandler = tmp;
    }
    return moduleHandler;
  }
  function recordSetPropOperation($this, ele, propKey) {
    var tmp0_safe_receiver = $this.jj_1;
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.jg();
    var tmp;
    if (tmp1_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var kuiklyRenderViewContext = tmp;
    var tmp2_elvis_lhs = kuiklyRenderViewContext.yg(ele, 'kr_set_prop_operation');
    var tmp_0;
    if (tmp2_elvis_lhs == null) {
      // Inline function 'kotlin.collections.mutableSetOf' call
      // Inline function 'kotlin.apply' call
      var this_0 = LinkedHashSet_init_$Create$();
      kuiklyRenderViewContext.zg(ele, 'kr_set_prop_operation', this_0);
      tmp_0 = this_0;
    } else {
      tmp_0 = tmp2_elvis_lhs;
    }
    var setPropOperationSet = tmp_0;
    setPropOperationSet.d(propKey);
  }
  function prepareForReuse($this, viewExport) {
    var tmp0_safe_receiver = $this.jj_1;
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.jg();
    var tmp2_safe_receiver = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.ah(viewExport.mn(), 'kr_set_prop_operation');
    if (tmp2_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      var _iterator__ex2g4s = tmp2_safe_receiver.f();
      while (_iterator__ex2g4s.g()) {
        var propKey = _iterator__ex2g4s.h();
        viewExport.rn(propKey);
      }
    }
    viewExport.tn();
  }
  function pushRenderViewHandlerToReuseQueue($this, viewName, renderViewHandler) {
    if (!renderViewHandler.w17_1.pn()) {
      return Unit_instance;
    }
    var reuseQueue = get($this.nj_1, viewName);
    if (reuseQueue == null) {
      reuseQueue = new Array();
      set($this.nj_1, viewName, reuseQueue);
    }
    if (reuseQueue.length >= 50) {
      return Unit_instance;
    }
    prepareForReuse($this, renderViewHandler.w17_1);
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
    var this_0 = reuseQueue;
    // Inline function 'kotlin.js.asDynamic' call
    this_0[this_0.length] = renderViewHandler;
  }
  function popRenderViewHandlerFromReuseQueue($this, viewName) {
    var queue = get($this.nj_1, viewName);
    if (queue == null || queue.length === 0) {
      return null;
    }
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.removeLast' call
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.get' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var last = queue[queue.length - 1 | 0];
    // Inline function 'kotlin.js.asDynamic' call
    queue.length = queue.length - 1 | 0;
    return last;
  }
  function createRenderViewHandler($this, tag, viewName) {
    var tmp0_elvis_lhs = $this.jj_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var renderView = tmp;
    var renderViewHandler = get($this.kj_1, tag);
    if (renderViewHandler == null) {
      renderViewHandler = popRenderViewHandlerFromReuseQueue($this, viewName);
    }
    if (renderViewHandler == null) {
      var viewExport = null;
      if (isShadowViewHybridComponent($this, viewName)) {
        var shadowHandler = getShadowHandler($this, tag);
        if (!(shadowHandler == null) ? isInterface(shadowHandler, IKuiklyRenderViewExport) : false) {
          viewExport = shadowHandler;
        }
      }
      var tmp1_elvis_lhs = viewExport;
      renderViewHandler = new RenderViewHandler(viewName, tmp1_elvis_lhs == null ? renderView.kg().zd(viewName) : tmp1_elvis_lhs);
    }
    if (renderViewHandler.w17_1.mn().id === '') {
      renderViewHandler.w17_1.mn().id = tag.toString();
    }
    renderViewHandler.w17_1.qn(renderView.jg());
    set($this.kj_1, tag, renderViewHandler);
  }
  function innerRemoveRenderView($this, tag) {
    var renderViewHandler = getRenderViewHandler($this, tag);
    var tmp1_safe_receiver = renderViewHandler == null ? null : renderViewHandler.w17_1;
    if (tmp1_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      pushRenderViewHandlerToReuseQueue($this, renderViewHandler.v17_1, renderViewHandler);
      tmp1_safe_receiver.wn();
      tmp1_safe_receiver.ig();
    }
    // Inline function 'com.tencent.kuikly.core.render.web.collection.map.remove' call
    var this_0 = $this.kj_1;
    var value = get(this_0, tag);
    this_0.delete(tag);
  }
  function Companion_32() {
    this.x17_1 = -1;
    this.y17_1 = 'kr_set_prop_operation';
    this.z17_1 = 50;
  }
  var Companion_instance_32;
  function Companion_getInstance_32() {
    return Companion_instance_32;
  }
  function KuiklyRenderLayerHandler$onDestroy$lambda(value, _unused_var__etf5q3) {
    value.ig();
    return Unit_instance;
  }
  function KuiklyRenderLayerHandler$onDestroy$lambda_0(value, _unused_var__etf5q3) {
    value.w17_1.ig();
    return Unit_instance;
  }
  function KuiklyRenderLayerHandler() {
    this.jj_1 = null;
    this.kj_1 = new Map();
    this.lj_1 = null;
    this.mj_1 = new Map();
    this.nj_1 = new Map();
  }
  protoOf(KuiklyRenderLayerHandler).oj = function (renderView) {
    this.jj_1 = renderView;
  };
  protoOf(KuiklyRenderLayerHandler).vi = function (tag, viewName) {
    createRenderViewHandler(this, tag, viewName);
  };
  protoOf(KuiklyRenderLayerHandler).wi = function (tag) {
    innerRemoveRenderView(this, tag);
  };
  protoOf(KuiklyRenderLayerHandler).xi = function (parentTag, childTag, index) {
    var isRootViewTag = parentTag === -1;
    var tmp;
    if (isRootViewTag) {
      var tmp0_safe_receiver = this.jj_1;
      var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.ke();
      var tmp_0;
      if (tmp1_elvis_lhs == null) {
        return Unit_instance;
      } else {
        tmp_0 = tmp1_elvis_lhs;
      }
      tmp = tmp_0;
    } else {
      var tmp2_safe_receiver = getRenderViewHandler(this, parentTag);
      var tmp3_safe_receiver = tmp2_safe_receiver == null ? null : tmp2_safe_receiver.w17_1;
      var tmp4_elvis_lhs = tmp3_safe_receiver == null ? null : tmp3_safe_receiver.mn();
      var tmp_1;
      if (tmp4_elvis_lhs == null) {
        return Unit_instance;
      } else {
        tmp_1 = tmp4_elvis_lhs;
      }
      tmp = tmp_1;
    }
    var parentEle = tmp;
    var tmp5_safe_receiver = getRenderViewHandler(this, childTag);
    var tmp6_elvis_lhs = tmp5_safe_receiver == null ? null : tmp5_safe_receiver.w17_1;
    var tmp_2;
    if (tmp6_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp_2 = tmp6_elvis_lhs;
    }
    var viewExport = tmp_2;
    var childView = viewExport.mn();
    var tmp_3;
    if (index > 0) {
      var size = parentEle.childNodes.length;
      var tmp_4;
      if (index < size) {
        // Inline function 'org.w3c.dom.get' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp_4 = parentEle.childNodes[index];
      } else {
        tmp_4 = null;
      }
      tmp_3 = tmp_4;
    } else {
      tmp_3 = null;
    }
    var referenceEle = tmp_3;
    if (!(referenceEle == null)) {
      parentEle.insertBefore(childView, referenceEle);
    } else {
      parentEle.appendChild(childView);
    }
    viewExport.un(parentEle);
  };
  protoOf(KuiklyRenderLayerHandler).yi = function (tag, propKey, propValue) {
    var tmp0_safe_receiver = getRenderViewHandler(this, tag);
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.w17_1;
    if (tmp1_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      var process = tmp1_safe_receiver.nn(propKey, propValue);
      if (!process) {
        var tmp0_safe_receiver_0 = this.jj_1;
        var tmp1_safe_receiver_0 = tmp0_safe_receiver_0 == null ? null : tmp0_safe_receiver_0.kg();
        var tmp2_elvis_lhs = tmp1_safe_receiver_0 == null ? null : tmp1_safe_receiver_0.be(tmp1_safe_receiver, propKey, propValue);
        process = tmp2_elvis_lhs == null ? false : tmp2_elvis_lhs;
      }
      if (tmp1_safe_receiver.pn() && process) {
        recordSetPropOperation(this, tmp1_safe_receiver.mn(), propKey);
      }
    }
  };
  protoOf(KuiklyRenderLayerHandler).ij = function (tag, shadow) {
    var tmp0_safe_receiver = getRenderViewHandler(this, tag);
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.w17_1;
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.sn(shadow);
    }
  };
  protoOf(KuiklyRenderLayerHandler).zi = function (tag, frame) {
    var tmp0_safe_receiver = getRenderViewHandler(this, tag);
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.w17_1;
    if (tmp1_safe_receiver == null)
      null;
    else
      tmp1_safe_receiver.nn('frame', frame);
  };
  protoOf(KuiklyRenderLayerHandler).aj = function (tag, constraintSize) {
    var tmp0_safe_receiver = getShadowHandler(this, tag);
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.vu(constraintSize);
    var tmp;
    if (tmp1_elvis_lhs == null) {
      return constraintSize;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    return tmp;
  };
  protoOf(KuiklyRenderLayerHandler).bj = function (tag, method, params, callback) {
    var tmp0_safe_receiver = getRenderViewHandler(this, tag);
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.w17_1;
    if (tmp1_safe_receiver == null)
      null;
    else
      tmp1_safe_receiver.yn(method, params, callback);
  };
  protoOf(KuiklyRenderLayerHandler).dj = function (moduleName, method, params, callback) {
    var tmp0_safe_receiver = getModuleHandler(this, moduleName);
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.xn(method, params, callback);
  };
  protoOf(KuiklyRenderLayerHandler).ej = function (tag, viewName) {
    if (this.lj_1 == null) {
      this.lj_1 = new Map();
    }
    var tmp0_safe_receiver = this.jj_1;
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.kg();
    var tmp;
    if (tmp1_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var kuiklyRenderExport = tmp;
    var tmp2_safe_receiver = this.lj_1;
    if (tmp2_safe_receiver == null)
      null;
    else
      set(tmp2_safe_receiver, tag, kuiklyRenderExport.ae(viewName));
  };
  protoOf(KuiklyRenderLayerHandler).fj = function (tag) {
    var tmp0_safe_receiver = this.lj_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.map.remove' call
      var value = get(tmp0_safe_receiver, tag);
      tmp0_safe_receiver.delete(tag);
    }
  };
  protoOf(KuiklyRenderLayerHandler).gj = function (tag, propKey, propValue) {
    var tmp0_safe_receiver = getShadowHandler(this, tag);
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.pu(propKey, propValue);
    }
  };
  protoOf(KuiklyRenderLayerHandler).hj = function (tag) {
    return getShadowHandler(this, tag);
  };
  protoOf(KuiklyRenderLayerHandler).cj = function (tag, method, params) {
    var tmp0_safe_receiver = this.hj(tag);
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.xu(method, params);
  };
  protoOf(KuiklyRenderLayerHandler).ug = function (name) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return getModuleHandler(this, name);
  };
  protoOf(KuiklyRenderLayerHandler).ig = function () {
    this.mj_1.forEach(KuiklyRenderLayerHandler$onDestroy$lambda);
    this.kj_1.forEach(KuiklyRenderLayerHandler$onDestroy$lambda_0);
  };
  function RenderViewHandler(viewName, viewExport) {
    this.v17_1 = viewName;
    this.w17_1 = viewExport;
  }
  protoOf(RenderViewHandler).toString = function () {
    return 'RenderViewHandler(viewName=' + this.v17_1 + ', viewExport=' + toString(this.w17_1) + ')';
  };
  protoOf(RenderViewHandler).hashCode = function () {
    var result = getStringHashCode(this.v17_1);
    result = imul(result, 31) + hashCode(this.w17_1) | 0;
    return result;
  };
  protoOf(RenderViewHandler).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof RenderViewHandler))
      return false;
    var tmp0_other_with_cast = other instanceof RenderViewHandler ? other : THROW_CCE();
    if (!(this.v17_1 === tmp0_other_with_cast.v17_1))
      return false;
    if (!equals(this.w17_1, tmp0_other_with_cast.w17_1))
      return false;
    return true;
  };
  function JSON_0() {
    this.a18_1 = false;
  }
  protoOf(JSON_0).b18 = function (value) {
    if (!(value == null) ? typeof value === 'number' : false) {
      return value;
    } else {
      if (isNumber(value)) {
        return numberToDouble(value);
      } else {
        if (!(value == null) ? typeof value === 'string' : false) {
          try {
            return toDouble(value);
          } catch ($p) {
            if ($p instanceof NumberFormatException) {
              var ignored = $p;
            } else {
              throw $p;
            }
          }
        }
      }
    }
    return null;
  };
  protoOf(JSON_0).c18 = function (value) {
    if (!(value == null) ? typeof value === 'number' : false) {
      return value;
    } else {
      if (isNumber(value)) {
        return numberToInt(value);
      } else {
        if (!(value == null) ? typeof value === 'string' : false) {
          try {
            return toInt(value);
          } catch ($p) {
            if ($p instanceof NumberFormatException) {
              var ignored = $p;
            } else {
              throw $p;
            }
          }
        }
      }
    }
    return null;
  };
  protoOf(JSON_0).d18 = function (value) {
    if (value instanceof Long) {
      return value;
    } else {
      if (isNumber(value)) {
        return numberToLong(value);
      } else {
        if (!(value == null) ? typeof value === 'string' : false) {
          try {
            return toLong(value);
          } catch ($p) {
            if ($p instanceof NumberFormatException) {
              var ignored = $p;
            } else {
              throw $p;
            }
          }
        }
      }
    }
    return null;
  };
  protoOf(JSON_0).e18 = function (value) {
    if (!(value == null) ? typeof value === 'string' : false) {
      return value;
    } else {
      if (!(value == null)) {
        return toString(value);
      }
    }
    return null;
  };
  protoOf(JSON_0).f18 = function (number) {
    var doubleValue = numberToDouble(number);
    var longValue = numberToLong(number);
    var tmp;
    if (doubleValue === longValue.n()) {
      tmp = longValue.toString();
    } else {
      tmp = toString(number);
    }
    return tmp;
  };
  protoOf(JSON_0).g18 = function (actual, requiredType) {
    if (actual == null) {
      throw JSONException_init_$Create$('Value is null.');
    } else {
      throw JSONException_init_$Create$('Value ' + toString_0(actual) + ' of type ' + getKClassFromExpression(actual).b7() + ' cannot be converted to ' + requiredType);
    }
  };
  var JSON_instance;
  function JSON_getInstance() {
    return JSON_instance;
  }
  function JSONArray_init_$Init$($this) {
    JSONArray.call($this, JSONEngine_instance.h18());
    return $this;
  }
  function JSONArray_init_$Create$() {
    return JSONArray_init_$Init$(objectCreate(protoOf(JSONArray)));
  }
  function JSONArray_init_$Init$_0(json, $this) {
    // Inline function 'kotlin.also' call
    var this_0 = JSONEngine_instance.i18(json);
    if (!(this_0 instanceof JSONArray)) {
      throw JSON_instance.g18(this_0, 'JSONArray');
    }
    var tmp = this_0;
    JSONArray.call($this, (tmp instanceof JSONArray ? tmp : THROW_CCE()).jo_1);
    return $this;
  }
  function JSONArray_init_$Create$_0(json) {
    return JSONArray_init_$Init$_0(json, objectCreate(protoOf(JSONArray)));
  }
  function JSONArray(values) {
    this.jo_1 = values;
  }
  protoOf(JSONArray).ko = function () {
    return this.jo_1.i();
  };
  protoOf(JSONArray).r17 = function (value) {
    this.jo_1.d(value);
    return this;
  };
  protoOf(JSONArray).s17 = function (value) {
    this.jo_1.d(value);
    return this;
  };
  protoOf(JSONArray).u17 = function (value) {
    this.jo_1.d(value);
    return this;
  };
  protoOf(JSONArray).t17 = function (value) {
    this.jo_1.d(value);
    return this;
  };
  protoOf(JSONArray).q17 = function (value) {
    this.jo_1.d(value);
    return this;
  };
  protoOf(JSONArray).j18 = function (index) {
    var tmp;
    if (index < 0 || index >= this.jo_1.i()) {
      tmp = null;
    } else {
      tmp = this.jo_1.j(index);
    }
    return tmp;
  };
  protoOf(JSONArray).lo = function (index) {
    return this.k18(index, NaN);
  };
  protoOf(JSONArray).k18 = function (index, fallback) {
    var o = this.j18(index);
    var result = JSON_instance.b18(o);
    return result == null ? fallback : result;
  };
  protoOf(JSONArray).t11 = function (index) {
    return this.l18(index, '');
  };
  protoOf(JSONArray).l18 = function (index, fallback) {
    var o = this.j18(index);
    var result = JSON_instance.e18(o);
    return result == null ? fallback : result;
  };
  protoOf(JSONArray).m18 = function (index) {
    var o = this.j18(index);
    var tmp;
    if (o instanceof JSONObject) {
      tmp = o;
    } else {
      tmp = null;
    }
    return tmp;
  };
  protoOf(JSONArray).toString = function () {
    var tmp;
    try {
      tmp = JSONEngine_instance.n18(this);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof JSONException) {
        var e = $p;
        tmp_0 = '[]';
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    return tmp;
  };
  protoOf(JSONArray).o18 = function () {
    // Inline function 'kotlin.collections.mutableListOf' call
    var list = ArrayList_init_$Create$();
    var size = this.ko();
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var value = this.j18(i);
        if (!(value == null) ? typeof value === 'number' : false) {
          list.d(value);
        } else {
          if (value instanceof Long) {
            list.d(value);
          } else {
            if (!(value == null) ? typeof value === 'number' : false) {
              list.d(value);
            } else {
              if (!(value == null) ? typeof value === 'number' : false) {
                list.d(value);
              } else {
                if (!(value == null) ? typeof value === 'string' : false) {
                  list.d(value);
                } else {
                  if (!(value == null) ? typeof value === 'boolean' : false) {
                    list.d(value);
                  } else {
                    if (value instanceof JSONObject) {
                      list.d(value.k15());
                    } else {
                      if (value instanceof JSONArray) {
                        list.d(value.o18());
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
       while (inductionVariable < size);
    return list;
  };
  protoOf(JSONArray).p18 = function (stringer) {
    stringer.s18();
    var _iterator__ex2g4s = this.jo_1.f();
    while (_iterator__ex2g4s.g()) {
      var value = _iterator__ex2g4s.h();
      if (value == null) {
        stringer.t18(null);
      } else {
        stringer.t18(value);
      }
    }
    stringer.u18();
  };
  protoOf(JSONArray).equals = function (other) {
    var tmp;
    if (other instanceof JSONArray) {
      tmp = equals(other.jo_1, this.jo_1);
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(JSONArray).hashCode = function () {
    return hashCode(this.jo_1);
  };
  function JSONEngine() {
  }
  protoOf(JSONEngine).i18 = function (jsonStr) {
    if (!JSON_instance.a18_1) {
      return (new JSONTokener(jsonStr)).x18();
    }
    return parseFromEngine(jsonStr);
  };
  protoOf(JSONEngine).y18 = function (jsonObject) {
    if (!JSON_instance.a18_1) {
      return commonStringify(jsonObject);
    }
    return stringifyFromEngine(jsonObject);
  };
  protoOf(JSONEngine).n18 = function (jsonArray) {
    if (!JSON_instance.a18_1) {
      return commonStringify_0(jsonArray);
    }
    return stringifyFromEngine(jsonArray);
  };
  protoOf(JSONEngine).z18 = function () {
    if (!JSON_instance.a18_1) {
      // Inline function 'kotlin.collections.mutableMapOf' call
      return LinkedHashMap_init_$Create$();
    }
    // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.getEmptyObject' call
    var tmp$ret$1 = {};
    return new FastMutableMap(tmp$ret$1);
  };
  protoOf(JSONEngine).h18 = function () {
    if (!JSON_instance.a18_1) {
      // Inline function 'kotlin.collections.mutableListOf' call
      return ArrayList_init_$Create$();
    }
    // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.getEmptyArray' call
    var tmp$ret$1 = [];
    return new FastMutableList(tmp$ret$1);
  };
  var JSONEngine_instance;
  function JSONEngine_getInstance() {
    return JSONEngine_instance;
  }
  function parseFromEngine(jsonStr) {
    try {
      var tmp = JSON;
      return tmp.parse(jsonStr, parseFromEngine$lambda);
    } catch ($p) {
      var error = $p;
      Log_instance.mg(['JSONEngine', 'can not convert to json: ' + error]);
      Log_instance.o12(['JSONEngine', 'bad case: ' + jsonStr]);
      return (new JSONTokener(jsonStr)).x18();
    }
  }
  function commonStringify(jsonObject) {
    var stringer = new JSONStringer();
    jsonObject.p18(stringer);
    return stringer.toString();
  }
  function stringifyFromEngine(json) {
    try {
      var tmp = JSON;
      return tmp.stringify(json, stringifyFromEngine$lambda);
    } catch ($p) {
      var error = $p;
      Log_instance.mg(['JSONEngine', 'can not convert to string: ' + error]);
      if (json instanceof JSONObject) {
        return commonStringify(json);
      }
      if (json instanceof JSONArray) {
        return commonStringify_0(json);
      }
      throw JSONException_init_$Create$('unsupported type');
    }
  }
  function commonStringify_0(jsonObject) {
    var stringer = new JSONStringer();
    jsonObject.p18(stringer);
    return stringer.toString();
  }
  function getStringifyObject(jsonObject) {
    // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.getEmptyObject' call
    var result = {};
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = jsonObject.u12();
    while (_iterator__ex2g4s.g()) {
      var key = _iterator__ex2g4s.h();
      result[key] = jsonObject.x11(key);
    }
    return result;
  }
  function getStringifyArray(jsonArray) {
    // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.getEmptyArray' call
    var result = [];
    var inductionVariable = 0;
    var last = jsonArray.ko();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        result[i] = jsonArray.j18(i);
      }
       while (inductionVariable < last);
    return result;
  }
  function parseFromEngine$lambda(_unused_var__etf5q3, value) {
    var tmp;
    if (!(typeof value === 'object') || value === null) {
      var tmp_0;
      var tmp_1;
      if (typeof value === 'number') {
        // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.isInteger' call
        tmp_1 = value % 1 === 0;
      } else {
        tmp_1 = false;
      }
      if (tmp_1) {
        // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.isSafeInteger' call
        tmp_0 = !(value > Number.MIN_SAFE_INTEGER && value < Number.MAX_SAFE_INTEGER);
      } else {
        tmp_0 = false;
      }
      if (tmp_0) {
        throw JSONException_init_$Create$('parse unsafe number: ' + toString_0(value));
      }
      tmp = value;
    } else {
      // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.isArray' call
      // Inline function 'kotlin.js.unsafeCast' call
      if (Array.isArray(value)) {
        tmp = new JSONArray(new FastMutableList(value));
      } else {
        tmp = new JSONObject(new FastMutableMap(value));
      }
    }
    return tmp;
  }
  function stringifyFromEngine$lambda(_unused_var__etf5q3, value) {
    var tmp;
    if (typeof value === 'object' && !(value === null)) {
      var tmp_0;
      if (value instanceof JSONObject) {
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp1_elvis_lhs = value.eo_1.rh_1;
        tmp_0 = tmp1_elvis_lhs == null ? getStringifyObject(value) : tmp1_elvis_lhs;
      } else {
        if (value instanceof JSONArray) {
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          var tmp2_elvis_lhs = value.jo_1.nh_1;
          tmp_0 = tmp2_elvis_lhs == null ? getStringifyArray(value) : tmp2_elvis_lhs;
        } else {
          if (value instanceof Long) {
            // Inline function 'kotlin.also' call
            var this_0 = parseInt(value.toString(), 10);
            // Inline function 'com.tencent.kuikly.core.render.web.nvi.serialization.json.isSafeInteger' call
            if (!(this_0 > Number.MIN_SAFE_INTEGER && this_0 < Number.MAX_SAFE_INTEGER)) {
              throw JSONException_init_$Create$('stringify unsafe integer: ' + value.toString());
            }
            tmp_0 = this_0;
          } else {
            tmp_0 = toString(value);
          }
        }
      }
      tmp = tmp_0;
    } else {
      tmp = value;
    }
    return tmp;
  }
  function JSONException_init_$Init$(s, $this) {
    Exception_init_$Init$(s, $this);
    JSONException.call($this);
    return $this;
  }
  function JSONException_init_$Create$(s) {
    var tmp = JSONException_init_$Init$(s, objectCreate(protoOf(JSONException)));
    captureStack(tmp, JSONException_init_$Create$);
    return tmp;
  }
  function JSONException() {
    captureStack(this, JSONException);
  }
  function JSONObject_init_$Init$($this) {
    JSONObject.call($this, JSONEngine_instance.z18());
    return $this;
  }
  function JSONObject_init_$Create$() {
    return JSONObject_init_$Init$(objectCreate(protoOf(JSONObject)));
  }
  function JSONObject_init_$Init$_0(json, $this) {
    // Inline function 'kotlin.also' call
    var this_0 = JSONEngine_instance.i18(json);
    if (!(this_0 instanceof JSONObject)) {
      throw JSON_instance.g18(this_0, 'JSONObject');
    }
    var tmp = this_0;
    JSONObject.call($this, (tmp instanceof JSONObject ? tmp : THROW_CCE()).eo_1);
    return $this;
  }
  function JSONObject_init_$Create$_0(json) {
    return JSONObject_init_$Init$_0(json, objectCreate(protoOf(JSONObject)));
  }
  function Companion_33() {
    this.a19_1 = 'JSONObject';
  }
  var Companion_instance_33;
  function Companion_getInstance_33() {
    return Companion_instance_33;
  }
  function JSONObject(nameValuePairs) {
    this.eo_1 = nameValuePairs;
  }
  protoOf(JSONObject).m17 = function (name, value) {
    // Inline function 'kotlin.collections.set' call
    this.eo_1.k2(name, value);
    return this;
  };
  protoOf(JSONObject).p17 = function (name, value) {
    // Inline function 'kotlin.collections.set' call
    this.eo_1.k2(name, value);
    return this;
  };
  protoOf(JSONObject).o17 = function (name, value) {
    // Inline function 'kotlin.collections.set' call
    this.eo_1.k2(name, value);
    return this;
  };
  protoOf(JSONObject).n17 = function (name, value) {
    // Inline function 'kotlin.collections.set' call
    this.eo_1.k2(name, value);
    return this;
  };
  protoOf(JSONObject).l17 = function (name, value) {
    // Inline function 'kotlin.collections.set' call
    this.eo_1.k2(name, value);
    return this;
  };
  protoOf(JSONObject).x11 = function (name) {
    return this.eo_1.d1(name);
  };
  protoOf(JSONObject).fo = function (name) {
    return this.b19(name, 0.0);
  };
  protoOf(JSONObject).b19 = function (name, fallback) {
    var o = this.x11(name);
    var result = JSON_instance.b18(o);
    return result == null ? fallback : result;
  };
  protoOf(JSONObject).go = function (name) {
    return this.c19(name, 0);
  };
  protoOf(JSONObject).c19 = function (name, fallback) {
    var o = this.x11(name);
    var result = JSON_instance.c18(o);
    return result == null ? fallback : result;
  };
  protoOf(JSONObject).e11 = function (name) {
    return this.i14(name, new Long(0, 0));
  };
  protoOf(JSONObject).i14 = function (name, fallback) {
    var o = this.x11(name);
    var result = JSON_instance.d18(o);
    return result == null ? fallback : result;
  };
  protoOf(JSONObject).ho = function (name) {
    return this.zu(name, '');
  };
  protoOf(JSONObject).zu = function (name, fallback) {
    var o = this.x11(name);
    var result = JSON_instance.e18(o);
    return result == null ? fallback : result;
  };
  protoOf(JSONObject).io = function (name) {
    var value = this.x11(name);
    var tmp;
    if (value instanceof JSONArray) {
      tmp = value;
    } else {
      if (!(value == null) ? typeof value === 'string' : false) {
        var tmp_0;
        try {
          tmp_0 = JSONArray_init_$Create$_0(value);
        } catch ($p) {
          var tmp_1;
          if ($p instanceof JSONException) {
            var e = $p;
            Log_instance.o12(['JSONObject', value + ' can not convert to json']);
            tmp_1 = null;
          } else {
            throw $p;
          }
          tmp_0 = tmp_1;
        }
        tmp = tmp_0;
      } else {
        tmp = null;
      }
    }
    return tmp;
  };
  protoOf(JSONObject).t12 = function (name) {
    var value = this.x11(name);
    var tmp;
    if (value instanceof JSONObject) {
      tmp = value;
    } else {
      if (!(value == null) ? typeof value === 'string' : false) {
        var tmp_0;
        try {
          tmp_0 = JSONObject_init_$Create$_0(value);
        } catch ($p) {
          var tmp_1;
          if ($p instanceof JSONException) {
            var e = $p;
            Log_instance.o12(['JSONObject', value + ' can not convert to json']);
            tmp_1 = null;
          } else {
            throw $p;
          }
          tmp_0 = tmp_1;
        }
        tmp = tmp_0;
      } else {
        tmp = null;
      }
    }
    return tmp;
  };
  protoOf(JSONObject).u12 = function () {
    return this.eo_1.e1().f();
  };
  protoOf(JSONObject).toString = function () {
    var tmp;
    try {
      tmp = JSONEngine_instance.y18(this);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof JSONException) {
        var e = $p;
        tmp_0 = '{}';
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    return tmp;
  };
  protoOf(JSONObject).k15 = function () {
    // Inline function 'kotlin.collections.mutableMapOf' call
    var map = LinkedHashMap_init_$Create$();
    var keys = this.u12();
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = keys;
    while (_iterator__ex2g4s.g()) {
      var key = _iterator__ex2g4s.h();
      var value = this.x11(key);
      if (!(value == null) ? typeof value === 'number' : false) {
        // Inline function 'kotlin.collections.set' call
        map.k2(key, value);
      } else {
        if (value instanceof Long) {
          // Inline function 'kotlin.collections.set' call
          map.k2(key, value);
        } else {
          if (!(value == null) ? typeof value === 'number' : false) {
            // Inline function 'kotlin.collections.set' call
            map.k2(key, value);
          } else {
            if (!(value == null) ? typeof value === 'number' : false) {
              // Inline function 'kotlin.collections.set' call
              map.k2(key, value);
            } else {
              if (!(value == null) ? typeof value === 'string' : false) {
                // Inline function 'kotlin.collections.set' call
                map.k2(key, value);
              } else {
                if (!(value == null) ? typeof value === 'boolean' : false) {
                  // Inline function 'kotlin.collections.set' call
                  map.k2(key, value);
                } else {
                  if (value instanceof JSONObject) {
                    // Inline function 'kotlin.collections.set' call
                    var value_0 = value.k15();
                    map.k2(key, value_0);
                  } else {
                    if (value instanceof JSONArray) {
                      // Inline function 'kotlin.collections.set' call
                      var value_1 = value.o18();
                      map.k2(key, value_1);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return map;
  };
  protoOf(JSONObject).p18 = function (stringer) {
    stringer.d19();
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = this.eo_1.g1().f();
    while (_iterator__ex2g4s.g()) {
      var _destruct__k2r9zo = _iterator__ex2g4s.h();
      // Inline function 'kotlin.collections.component1' call
      var key = _destruct__k2r9zo.z();
      // Inline function 'kotlin.collections.component2' call
      var value = _destruct__k2r9zo.a1();
      stringer.e19(key).t18(value);
    }
    stringer.f19();
  };
  var Scope_EMPTY_ARRAY_instance;
  var Scope_NONEMPTY_ARRAY_instance;
  var Scope_EMPTY_OBJECT_instance;
  var Scope_DANGLING_KEY_instance;
  var Scope_NONEMPTY_OBJECT_instance;
  var Scope_NULL_OBJ_instance;
  var Scope_entriesInitialized;
  function Scope_initEntries() {
    if (Scope_entriesInitialized)
      return Unit_instance;
    Scope_entriesInitialized = true;
    Scope_EMPTY_ARRAY_instance = new Scope('EMPTY_ARRAY', 0);
    Scope_NONEMPTY_ARRAY_instance = new Scope('NONEMPTY_ARRAY', 1);
    Scope_EMPTY_OBJECT_instance = new Scope('EMPTY_OBJECT', 2);
    Scope_DANGLING_KEY_instance = new Scope('DANGLING_KEY', 3);
    Scope_NONEMPTY_OBJECT_instance = new Scope('NONEMPTY_OBJECT', 4);
    Scope_NULL_OBJ_instance = new Scope('NULL_OBJ', 5);
  }
  function Scope(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function beforeValue($this) {
    if ($this.q18_1.k()) {
      return Unit_instance;
    }
    var context = peek($this);
    if (context.equals(Scope_EMPTY_ARRAY_getInstance())) {
      replaceTop($this, Scope_NONEMPTY_ARRAY_getInstance());
      newline($this);
    } else if (context.equals(Scope_NONEMPTY_ARRAY_getInstance())) {
      $this.r18_1.q6(_Char___init__impl__6a9atx(44));
      newline($this);
    } else if (context.equals(Scope_DANGLING_KEY_getInstance())) {
      $this.r18_1.p6(': ');
      replaceTop($this, Scope_NONEMPTY_OBJECT_getInstance());
    } else if (!context.equals(Scope_NULL_OBJ_getInstance())) {
      throw JSONException_init_$Create$('Nesting problem');
    }
  }
  function peek($this) {
    if ($this.q18_1.k()) {
      throw JSONException_init_$Create$('Nesting problem');
    }
    return $this.q18_1.j($this.q18_1.i() - 1 | 0);
  }
  function replaceTop($this, topOfStack) {
    $this.q18_1.u3($this.q18_1.i() - 1 | 0, topOfStack);
  }
  function newline($this) {
  }
  function beforeKey($this) {
    var context = peek($this);
    if (context.equals(Scope_NONEMPTY_OBJECT_getInstance())) {
      $this.r18_1.q6(_Char___init__impl__6a9atx(44));
    } else if (!context.equals(Scope_EMPTY_OBJECT_getInstance())) {
      throw JSONException_init_$Create$('Nesting problem');
    }
    newline($this);
    replaceTop($this, Scope_DANGLING_KEY_getInstance());
  }
  function string_0($this, value) {
    $this.r18_1.p6('"');
    var i = 0;
    var length = value.length;
    while (i < length) {
      var c = charSequenceGet(value, i);
      if (c === _Char___init__impl__6a9atx(34) || (c === _Char___init__impl__6a9atx(92) || c === _Char___init__impl__6a9atx(47)))
        $this.r18_1.q6(_Char___init__impl__6a9atx(92)).q6(c);
      else if (c === _Char___init__impl__6a9atx(9))
        $this.r18_1.p6('\\t');
      else if (c === _Char___init__impl__6a9atx(8))
        $this.r18_1.p6('\\b');
      else if (c === _Char___init__impl__6a9atx(10))
        $this.r18_1.p6('\\n');
      else if (c === _Char___init__impl__6a9atx(13))
        $this.r18_1.p6('\\r');
      else {
        // Inline function 'kotlin.code' call
        if (Char__toInt_impl_vasixd(c) <= 31) {
          // Inline function 'kotlin.code' call
          var tmp$ret$1 = Char__toInt_impl_vasixd(c);
          $this.r18_1.p6('\\u' + padStart(toString_2(tmp$ret$1, 16), 4, _Char___init__impl__6a9atx(48)));
        } else {
          $this.r18_1.q6(c);
        }
      }
      i = i + 1 | 0;
    }
    $this.r18_1.p6('"');
  }
  function Scope_EMPTY_ARRAY_getInstance() {
    Scope_initEntries();
    return Scope_EMPTY_ARRAY_instance;
  }
  function Scope_NONEMPTY_ARRAY_getInstance() {
    Scope_initEntries();
    return Scope_NONEMPTY_ARRAY_instance;
  }
  function Scope_EMPTY_OBJECT_getInstance() {
    Scope_initEntries();
    return Scope_EMPTY_OBJECT_instance;
  }
  function Scope_DANGLING_KEY_getInstance() {
    Scope_initEntries();
    return Scope_DANGLING_KEY_instance;
  }
  function Scope_NONEMPTY_OBJECT_getInstance() {
    Scope_initEntries();
    return Scope_NONEMPTY_OBJECT_instance;
  }
  function Scope_NULL_OBJ_getInstance() {
    Scope_initEntries();
    return Scope_NULL_OBJ_instance;
  }
  function JSONStringer() {
    var tmp = this;
    // Inline function 'kotlin.collections.arrayListOf' call
    tmp.q18_1 = ArrayList_init_$Create$();
    this.r18_1 = StringBuilder_init_$Create$();
  }
  protoOf(JSONStringer).d19 = function () {
    return this.g19(Scope_EMPTY_OBJECT_getInstance(), '{');
  };
  protoOf(JSONStringer).f19 = function () {
    return this.h19(Scope_EMPTY_OBJECT_getInstance(), Scope_NONEMPTY_OBJECT_getInstance(), '}');
  };
  protoOf(JSONStringer).s18 = function () {
    return this.g19(Scope_EMPTY_ARRAY_getInstance(), '[');
  };
  protoOf(JSONStringer).u18 = function () {
    return this.h19(Scope_EMPTY_ARRAY_getInstance(), Scope_NONEMPTY_ARRAY_getInstance(), ']');
  };
  protoOf(JSONStringer).e19 = function (name) {
    beforeKey(this);
    string_0(this, name);
    return this;
  };
  protoOf(JSONStringer).t18 = function (value) {
    if (this.q18_1.k()) {
      throw JSONException_init_$Create$('Nesting problem');
    }
    if (value instanceof JSONArray) {
      value.p18(this);
      return this;
    } else {
      if (value instanceof JSONObject) {
        value.p18(this);
        return this;
      }
    }
    beforeValue(this);
    if (!(value == null) ? typeof value === 'boolean' : false) {
      this.r18_1.h8(value);
    } else {
      if (isNumber(value)) {
        this.r18_1.p6(JSON_instance.f18(value));
      } else {
        if (value == null) {
          this.r18_1.p6('null');
        } else {
          string_0(this, toString(value));
        }
      }
    }
    return this;
  };
  protoOf(JSONStringer).g19 = function (empty, openBracket) {
    var tmp;
    if (this.q18_1.k()) {
      // Inline function 'kotlin.text.isNotEmpty' call
      var this_0 = this.r18_1;
      tmp = charSequenceLength(this_0) > 0;
    } else {
      tmp = false;
    }
    if (tmp) {
      throw JSONException_init_$Create$('Nesting problem: multiple top-level roots');
    }
    beforeValue(this);
    this.q18_1.d(empty);
    this.r18_1.p6(openBracket);
    return this;
  };
  protoOf(JSONStringer).h19 = function (empty, nonempty, closeBracket) {
    var context = peek(this);
    if (!context.equals(nonempty) && !context.equals(empty)) {
      throw JSONException_init_$Create$('Nesting problem');
    }
    this.q18_1.t2(this.q18_1.i() - 1 | 0);
    if (context.equals(nonempty)) {
      newline(this);
    }
    this.r18_1.p6(closeBracket);
    return this;
  };
  protoOf(JSONStringer).toString = function () {
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    var this_0 = this.r18_1;
    if (charSequenceLength(this_0) === 0) {
      tmp = '{}';
    } else {
      tmp = this.r18_1.toString();
    }
    return tmp;
  };
  function nextCleanInternal($this) {
    loop: while ($this.w18_1 < $this.v18_1.length) {
      var tmp = $this.v18_1;
      var _unary__edvuaz = $this.w18_1;
      $this.w18_1 = _unary__edvuaz + 1 | 0;
      var c = charSequenceGet(tmp, _unary__edvuaz);
      var tmp_0;
      if (c === _Char___init__impl__6a9atx(9) || c === _Char___init__impl__6a9atx(32) || (c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13))) {
        continue loop;
      } else if (c === _Char___init__impl__6a9atx(47)) {
        if ($this.w18_1 === $this.v18_1.length) {
          // Inline function 'kotlin.code' call
          return Char__toInt_impl_vasixd(c);
        }
        var peek = charSequenceGet($this.v18_1, $this.w18_1);
        var tmp_1;
        if (peek === _Char___init__impl__6a9atx(42)) {
          $this.w18_1 = $this.w18_1 + 1 | 0;
          var commentEnd = indexOf($this.v18_1, '*/', $this.w18_1);
          if (commentEnd === -1) {
            throw syntaxError($this, 'Unterminated comment');
          }
          $this.w18_1 = commentEnd + 2 | 0;
          continue loop;
        } else if (peek === _Char___init__impl__6a9atx(47)) {
          $this.w18_1 = $this.w18_1 + 1 | 0;
          skipToEndOfLine($this);
          continue loop;
        } else {
          // Inline function 'kotlin.code' call
          tmp_1 = Char__toInt_impl_vasixd(c);
        }
        tmp_0 = tmp_1;
      } else if (c === _Char___init__impl__6a9atx(35)) {
        skipToEndOfLine($this);
        continue loop;
      } else {
        // Inline function 'kotlin.code' call
        tmp_0 = Char__toInt_impl_vasixd(c);
      }
      return tmp_0;
    }
    return -1;
  }
  function syntaxError($this, message) {
    return JSONException_init_$Create$(message + toString($this));
  }
  function skipToEndOfLine($this) {
    $l$loop: while ($this.w18_1 < $this.v18_1.length) {
      var c = charSequenceGet($this.v18_1, $this.w18_1);
      if (c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(10)) {
        $this.w18_1 = $this.w18_1 + 1 | 0;
        break $l$loop;
      }
      $this.w18_1 = $this.w18_1 + 1 | 0;
    }
  }
  function readObject($this) {
    var result = JSONObject_init_$Create$();
    var first = nextCleanInternal($this);
    // Inline function 'kotlin.code' call
    var this_0 = _Char___init__impl__6a9atx(125);
    if (first === Char__toInt_impl_vasixd(this_0)) {
      return result;
    } else {
      if (!(first === -1)) {
        $this.w18_1 = $this.w18_1 - 1 | 0;
      }
    }
    loop: while (true) {
      var name = $this.x18();
      if (!(!(name == null) ? typeof name === 'string' : false)) {
        var tmp = 'Names must be strings, but ' + toString_0(name) + ' is of type ';
        var tmp_0;
        if (name === null) {
          tmp_0 = 'null';
        } else {
          tmp_0 = getKClassFromExpression(name).b7();
        }
        throw syntaxError($this, tmp + tmp_0);
      }
      var separator = nextCleanInternal($this);
      var tmp_1;
      // Inline function 'kotlin.code' call
      var this_1 = _Char___init__impl__6a9atx(58);
      if (!(separator === Char__toInt_impl_vasixd(this_1))) {
        // Inline function 'kotlin.code' call
        var this_2 = _Char___init__impl__6a9atx(61);
        tmp_1 = !(separator === Char__toInt_impl_vasixd(this_2));
      } else {
        tmp_1 = false;
      }
      if (tmp_1) {
        throw syntaxError($this, "Expected ':' after " + name);
      }
      if ($this.w18_1 < $this.v18_1.length && charSequenceGet($this.v18_1, $this.w18_1) === _Char___init__impl__6a9atx(62)) {
        $this.w18_1 = $this.w18_1 + 1 | 0;
      }
      result.l17(ensureNotNull(typeof name === 'string' ? name : THROW_CCE()), $this.x18());
      var tmp0_subject = nextCleanInternal($this);
      // Inline function 'kotlin.code' call
      var this_3 = _Char___init__impl__6a9atx(125);
      if (tmp0_subject === Char__toInt_impl_vasixd(this_3))
        return result;
      else {
        var tmp_2;
        // Inline function 'kotlin.code' call
        var this_4 = _Char___init__impl__6a9atx(59);
        if (tmp0_subject === Char__toInt_impl_vasixd(this_4)) {
          tmp_2 = true;
        } else {
          // Inline function 'kotlin.code' call
          var this_5 = _Char___init__impl__6a9atx(44);
          tmp_2 = tmp0_subject === Char__toInt_impl_vasixd(this_5);
        }
        if (tmp_2)
          continue loop;
        else {
          throw syntaxError($this, 'Unterminated object');
        }
      }
    }
  }
  function readArray($this) {
    var result = JSONArray_init_$Create$();
    loop: while (true) {
      var tmp0_subject = nextCleanInternal($this);
      if (tmp0_subject === -1)
        throw syntaxError($this, 'Unterminated array');
      else {
        // Inline function 'kotlin.code' call
        var this_0 = _Char___init__impl__6a9atx(93);
        if (tmp0_subject === Char__toInt_impl_vasixd(this_0)) {
          return result;
        } else {
          var tmp;
          // Inline function 'kotlin.code' call
          var this_1 = _Char___init__impl__6a9atx(44);
          if (tmp0_subject === Char__toInt_impl_vasixd(this_1)) {
            tmp = true;
          } else {
            // Inline function 'kotlin.code' call
            var this_2 = _Char___init__impl__6a9atx(59);
            tmp = tmp0_subject === Char__toInt_impl_vasixd(this_2);
          }
          if (tmp)
            continue loop;
          else {
            $this.w18_1 = $this.w18_1 - 1 | 0;
          }
        }
      }
      result.q17($this.x18());
      var tmp1_subject = nextCleanInternal($this);
      var tmp_0;
      // Inline function 'kotlin.code' call
      var this_3 = _Char___init__impl__6a9atx(93);
      if (tmp1_subject === Char__toInt_impl_vasixd(this_3)) {
        tmp_0 = result;
      } else {
        var tmp_1;
        // Inline function 'kotlin.code' call
        var this_4 = _Char___init__impl__6a9atx(44);
        if (tmp1_subject === Char__toInt_impl_vasixd(this_4)) {
          tmp_1 = true;
        } else {
          // Inline function 'kotlin.code' call
          var this_5 = _Char___init__impl__6a9atx(59);
          tmp_1 = tmp1_subject === Char__toInt_impl_vasixd(this_5);
        }
        if (tmp_1) {
          continue loop;
        } else {
          throw syntaxError($this, 'Unterminated array');
        }
      }
      return tmp_0;
    }
  }
  function readEscapeCharacter($this) {
    var tmp = $this.v18_1;
    var _unary__edvuaz = $this.w18_1;
    $this.w18_1 = _unary__edvuaz + 1 | 0;
    var escaped = charSequenceGet(tmp, _unary__edvuaz);
    var tmp_0;
    if (escaped === _Char___init__impl__6a9atx(117)) {
      if (($this.w18_1 + 4 | 0) > $this.v18_1.length) {
        throw syntaxError($this, 'Unterminated escape sequence');
      }
      var tmp0 = $this.v18_1;
      var tmp1 = $this.w18_1;
      // Inline function 'kotlin.text.substring' call
      var endIndex = $this.w18_1 + 4 | 0;
      // Inline function 'kotlin.js.asDynamic' call
      var hex = tmp0.substring(tmp1, endIndex);
      $this.w18_1 = $this.w18_1 + 4 | 0;
      var tmp_1;
      try {
        tmp_1 = numberToChar(toInt_0(hex, 16));
      } catch ($p) {
        var tmp_2;
        if ($p instanceof NumberFormatException) {
          var nfe = $p;
          throw syntaxError($this, 'Invalid escape sequence: ' + hex);
        } else {
          throw $p;
        }
      }
      return tmp_1;
    } else if (escaped === _Char___init__impl__6a9atx(116)) {
      tmp_0 = _Char___init__impl__6a9atx(9);
    } else if (escaped === _Char___init__impl__6a9atx(98)) {
      tmp_0 = _Char___init__impl__6a9atx(8);
    } else if (escaped === _Char___init__impl__6a9atx(110)) {
      tmp_0 = _Char___init__impl__6a9atx(10);
    } else if (escaped === _Char___init__impl__6a9atx(114)) {
      tmp_0 = _Char___init__impl__6a9atx(13);
    } else if (escaped === _Char___init__impl__6a9atx(102)) {
      tmp_0 = _Char___init__impl__6a9atx(12);
    } else if (escaped === _Char___init__impl__6a9atx(39) || (escaped === _Char___init__impl__6a9atx(34) || escaped === _Char___init__impl__6a9atx(92))) {
      tmp_0 = escaped;
    } else {
      tmp_0 = escaped;
    }
    return tmp_0;
  }
  function readLiteral($this) {
    var literal = nextToInternal($this, '{}[]/\\:,=;# \t');
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(literal) === 0) {
      throw syntaxError($this, 'Expected literal value');
    } else {
      if ('true' === literal) {
        return true;
      } else {
        if ('false' === literal) {
          return false;
        } else {
          if ('null' === literal) {
            return null;
          } else {
            if (indexOf_0(literal, _Char___init__impl__6a9atx(46)) === -1) {
              var base = 10;
              var number = literal;
              if (startsWith(number, '0x') || startsWith(number, '0X')) {
                // Inline function 'kotlin.text.substring' call
                // Inline function 'kotlin.js.asDynamic' call
                number = number.substring(2);
                base = 16;
              } else if (startsWith(number, '0') && number.length > 1) {
                // Inline function 'kotlin.text.substring' call
                // Inline function 'kotlin.js.asDynamic' call
                number = number.substring(1);
                base = 8;
              }
              try {
                var longValue = toLong_0(number, base);
                var tmp;
                if (longValue.p1(new Long(2147483647, 0)) <= 0 && longValue.p1(new Long(-2147483648, -1)) >= 0) {
                  tmp = longValue.z1();
                } else {
                  tmp = longValue;
                }
                return tmp;
              } catch ($p) {
                if ($p instanceof NumberFormatException) {
                  var e = $p;
                } else {
                  throw $p;
                }
              }
            }
          }
        }
      }
    }
    try {
      return toDouble(literal);
    } catch ($p) {
      if ($p instanceof NumberFormatException) {
        var ignored = $p;
      } else {
        throw $p;
      }
    }
    return literal + '';
  }
  function nextToInternal($this, excluded) {
    var start = $this.w18_1;
    while ($this.w18_1 < $this.v18_1.length) {
      var c = charSequenceGet($this.v18_1, $this.w18_1);
      if (c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(10) || !(indexOf_0(excluded, c) === -1)) {
        var tmp0 = $this.v18_1;
        // Inline function 'kotlin.text.substring' call
        var endIndex = $this.w18_1;
        // Inline function 'kotlin.js.asDynamic' call
        return tmp0.substring(start, endIndex);
      }
      $this.w18_1 = $this.w18_1 + 1 | 0;
    }
    // Inline function 'kotlin.text.substring' call
    // Inline function 'kotlin.js.asDynamic' call
    return $this.v18_1.substring(start);
  }
  function JSONTokener(json) {
    this.v18_1 = json;
    this.w18_1 = 0;
    if (startsWith(json, '\uFEFF')) {
      var tmp = this;
      // Inline function 'kotlin.text.substring' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp.v18_1 = this.v18_1.substring(1);
    }
  }
  protoOf(JSONTokener).x18 = function () {
    var c = nextCleanInternal(this);
    var tmp;
    if (c === -1) {
      throw syntaxError(this, 'End of input');
    } else {
      // Inline function 'kotlin.code' call
      var this_0 = _Char___init__impl__6a9atx(123);
      if (c === Char__toInt_impl_vasixd(this_0)) {
        tmp = readObject(this);
      } else {
        // Inline function 'kotlin.code' call
        var this_1 = _Char___init__impl__6a9atx(91);
        if (c === Char__toInt_impl_vasixd(this_1)) {
          tmp = readArray(this);
        } else {
          var tmp_0;
          // Inline function 'kotlin.code' call
          var this_2 = _Char___init__impl__6a9atx(39);
          if (c === Char__toInt_impl_vasixd(this_2)) {
            tmp_0 = true;
          } else {
            // Inline function 'kotlin.code' call
            var this_3 = _Char___init__impl__6a9atx(34);
            tmp_0 = c === Char__toInt_impl_vasixd(this_3);
          }
          if (tmp_0) {
            tmp = this.i19(numberToChar(c));
          } else {
            this.w18_1 = this.w18_1 - 1 | 0;
            tmp = readLiteral(this);
          }
        }
      }
    }
    return tmp;
  };
  protoOf(JSONTokener).i19 = function (quote) {
    var builder = null;
    var start = this.w18_1;
    while (this.w18_1 < this.v18_1.length) {
      var tmp = this.v18_1;
      var _unary__edvuaz = this.w18_1;
      this.w18_1 = _unary__edvuaz + 1 | 0;
      var c = charSequenceGet(tmp, _unary__edvuaz);
      // Inline function 'kotlin.code' call
      var tmp_0 = Char__toInt_impl_vasixd(c);
      // Inline function 'kotlin.code' call
      if (tmp_0 === Char__toInt_impl_vasixd(quote)) {
        var tmp_1;
        if (builder == null) {
          var tmp2 = this.v18_1;
          var tmp3 = start;
          // Inline function 'kotlin.text.substring' call
          var endIndex = this.w18_1 - 1 | 0;
          // Inline function 'kotlin.js.asDynamic' call
          tmp_1 = tmp2.substring(tmp3, endIndex) + '';
        } else {
          builder.f8(this.v18_1, start, this.w18_1 - 1 | 0);
          tmp_1 = builder.toString();
        }
        return tmp_1;
      }
      // Inline function 'kotlin.code' call
      var tmp_2 = Char__toInt_impl_vasixd(c);
      // Inline function 'kotlin.code' call
      var this_0 = _Char___init__impl__6a9atx(92);
      if (tmp_2 === Char__toInt_impl_vasixd(this_0)) {
        if (this.w18_1 === this.v18_1.length) {
          throw syntaxError(this, 'Unterminated escape sequence');
        }
        if (builder == null) {
          builder = StringBuilder_init_$Create$();
        }
        builder.f8(this.v18_1, start, this.w18_1 - 1 | 0);
        builder.q6(readEscapeCharacter(this));
        start = this.w18_1;
      }
    }
    throw syntaxError(this, 'Unterminated string');
  };
  function KRMonitor() {
  }
  protoOf(KRMonitor).zf = function () {
  };
  protoOf(KRMonitor).ag = function () {
  };
  protoOf(KRMonitor).bg = function () {
  };
  protoOf(KRMonitor).cg = function () {
  };
  protoOf(KRMonitor).dg = function () {
  };
  protoOf(KRMonitor).eg = function () {
  };
  protoOf(KRMonitor).xf = function () {
  };
  protoOf(KRMonitor).yf = function () {
  };
  protoOf(KRMonitor).fg = function () {
  };
  protoOf(KRMonitor).gg = function () {
  };
  protoOf(KRMonitor).hg = function () {
  };
  protoOf(KRMonitor).ig = function () {
  };
  function Companion_34() {
    this.k19_1 = 'mode';
    this.l19_1 = 'pageExistTime';
    this.m19_1 = 'isFirstLaunchOfProcess';
    this.n19_1 = 'isFirstLaunchOfPage';
    this.o19_1 = 'mainFPS';
    this.p19_1 = 'kotlinFPS';
    this.q19_1 = 'memory';
    this.r19_1 = 'pageLoadTime';
  }
  var Companion_instance_34;
  function Companion_getInstance_34() {
    return Companion_instance_34;
  }
  function KRPerformanceData(pageName, spentTime, isColdLaunch, isPageColdLaunch, executeMode, launchData, memoryData) {
    this.z14_1 = pageName;
    this.a15_1 = spentTime;
    this.b15_1 = isColdLaunch;
    this.c15_1 = isPageColdLaunch;
    this.d15_1 = executeMode;
    this.e15_1 = launchData;
    this.f15_1 = memoryData;
  }
  protoOf(KRPerformanceData).g15 = function () {
    // Inline function 'kotlin.apply' call
    var this_0 = JSONObject_init_$Create$();
    this_0.p17('mode', this.d15_1);
    this_0.o17('pageExistTime', this.a15_1);
    this_0.m17('isFirstLaunchOfProcess', this.b15_1);
    this_0.m17('isFirstLaunchOfPage', this.c15_1);
    var tmp0_safe_receiver = this.e15_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      this_0.l17('pageLoadTime', tmp0_safe_receiver.g15());
    }
    var tmp1_safe_receiver = this.f15_1;
    if (tmp1_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      this_0.l17('memory', tmp1_safe_receiver.g15());
    }
    return this_0;
  };
  protoOf(KRPerformanceData).toString = function () {
    return '[KRLaunchMeta] ' + ('pageName: ' + this.z14_1 + ', ') + ('spentTime: ' + this.a15_1.toString() + ', ') + ('isColdLaunch: ' + this.b15_1 + ', ') + ('executeMode: ' + this.d15_1);
  };
  protoOf(KRPerformanceData).hashCode = function () {
    var result = getStringHashCode(this.z14_1);
    result = imul(result, 31) + this.a15_1.hashCode() | 0;
    result = imul(result, 31) + getBooleanHashCode(this.b15_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.c15_1) | 0;
    result = imul(result, 31) + this.d15_1 | 0;
    result = imul(result, 31) + (this.e15_1 == null ? 0 : hashCode(this.e15_1)) | 0;
    result = imul(result, 31) + (this.f15_1 == null ? 0 : this.f15_1.hashCode()) | 0;
    return result;
  };
  protoOf(KRPerformanceData).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof KRPerformanceData))
      return false;
    var tmp0_other_with_cast = other instanceof KRPerformanceData ? other : THROW_CCE();
    if (!(this.z14_1 === tmp0_other_with_cast.z14_1))
      return false;
    if (!this.a15_1.equals(tmp0_other_with_cast.a15_1))
      return false;
    if (!(this.b15_1 === tmp0_other_with_cast.b15_1))
      return false;
    if (!(this.c15_1 === tmp0_other_with_cast.c15_1))
      return false;
    if (!(this.d15_1 === tmp0_other_with_cast.d15_1))
      return false;
    if (!equals(this.e15_1, tmp0_other_with_cast.e15_1))
      return false;
    if (!equals(this.f15_1, tmp0_other_with_cast.f15_1))
      return false;
    return true;
  };
  function getLaunchData($this) {
    var tmp0_safe_receiver = $this.t14('KRLaunchMonitor');
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.x19();
  }
  function getMemoryData($this) {
    var tmp0_safe_receiver = $this.t14('KRMemoryMonitor');
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.x19();
  }
  function Companion_35() {
    Companion_instance_35 = this;
    this.c1a_1 = 'KRPerformanceManager';
    this.d1a_1 = true;
    var tmp = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp.e1a_1 = ArrayList_init_$Create$();
  }
  var Companion_instance_35;
  function Companion_getInstance_35() {
    if (Companion_instance_35 == null)
      new Companion_35();
    return Companion_instance_35;
  }
  function KRPerformanceManager$lambda(this$0) {
    return function (it) {
      var tmp0_safe_receiver = this$0.p14_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.f1a(it);
      }
      return Unit_instance;
    };
  }
  function KRPerformanceManager(pageName, executeMode, monitorTypes) {
    Companion_getInstance_35();
    this.m14_1 = pageName;
    this.n14_1 = executeMode;
    var tmp = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp.o14_1 = ArrayList_init_$Create$();
    this.p14_1 = null;
    this.q14_1 = new Long(0, 0);
    this.r14_1 = false;
    this.s14_1 = false;
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = monitorTypes.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      switch (element.i1_1) {
        case 0:
          // Inline function 'kotlin.apply' call

          var this_0 = new KRLaunchMonitor();
          this_0.g1a(KRPerformanceManager$lambda(this));
          this.o14_1.d(this_0);
          break;
        case 1:
          Log_instance.o12(['Frame monitoring not supported yet']);
          break;
        case 2:
          this.o14_1.d(new KRMemoryMonitor());
          break;
        default:
          noWhenBranchMatchedException();
          break;
      }
    }
    if (!Companion_getInstance_35().e1a_1.w(this.m14_1)) {
      Companion_getInstance_35().e1a_1.d(this.m14_1);
      this.s14_1 = true;
    }
  }
  protoOf(KRPerformanceManager).t14 = function (name) {
    // Inline function 'kotlin.collections.find' call
    var tmp0 = this.o14_1;
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var _iterator__ex2g4s = tmp0.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (element.j19() === name) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return tmp$ret$1;
  };
  protoOf(KRPerformanceManager).h1a = function (dataCallback) {
    this.p14_1 = dataCallback;
  };
  protoOf(KRPerformanceManager).zf = function () {
    Log_instance.o12(['KRPerformanceManager', '--onInit--']);
    this.q14_1 = numberToLong(Date.now());
    if (Companion_getInstance_35().d1a_1) {
      this.r14_1 = true;
      Companion_getInstance_35().d1a_1 = false;
    }
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.zf();
    }
  };
  protoOf(KRPerformanceManager).ag = function () {
    Log_instance.o12(['KRPerformanceManager', '--onPreloadDexClassFinish--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.ag();
    }
  };
  protoOf(KRPerformanceManager).bg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onRenderCoreInitStart--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.bg();
    }
  };
  protoOf(KRPerformanceManager).cg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onRenderCoreInitFinish--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.cg();
    }
  };
  protoOf(KRPerformanceManager).dg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onRenderContextInitStart--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.dg();
    }
  };
  protoOf(KRPerformanceManager).eg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onRenderContextInitFinish--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.eg();
    }
  };
  protoOf(KRPerformanceManager).xf = function () {
    Log_instance.o12(['KRPerformanceManager', '--onCreatePageStart--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.xf();
    }
  };
  protoOf(KRPerformanceManager).yf = function () {
    Log_instance.o12(['KRPerformanceManager', '--onRenderPageFinish--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.yf();
    }
  };
  protoOf(KRPerformanceManager).gg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onResume--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.gg();
    }
  };
  protoOf(KRPerformanceManager).fg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onFirstFramePaint--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.fg();
    }
  };
  protoOf(KRPerformanceManager).hg = function () {
    Log_instance.o12(['KRPerformanceManager', '--onPause--']);
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.hg();
    }
  };
  protoOf(KRPerformanceManager).ig = function () {
    Log_instance.o12(['KRPerformanceManager', '--onDestroy--']);
    var performanceData = this.y14();
    var tmp0_safe_receiver = this.p14_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.i1a(performanceData);
    }
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = this.o14_1.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      element.ig();
    }
  };
  protoOf(KRPerformanceManager).y14 = function () {
    var launchData = getLaunchData(this);
    var memoryData = getMemoryData(this);
    var spentTime = numberToLong(Date.now()).r1(this.q14_1);
    return new KRPerformanceData(this.m14_1, spentTime, this.r14_1, this.s14_1, this.n14_1.fi_1, launchData, memoryData);
  };
  var KRMonitorType_LAUNCH_instance;
  var KRMonitorType_FRAME_instance;
  var KRMonitorType_MEMORY_instance;
  var KRMonitorType_entriesInitialized;
  function KRMonitorType_initEntries() {
    if (KRMonitorType_entriesInitialized)
      return Unit_instance;
    KRMonitorType_entriesInitialized = true;
    KRMonitorType_LAUNCH_instance = new KRMonitorType('LAUNCH', 0);
    KRMonitorType_FRAME_instance = new KRMonitorType('FRAME', 1);
    KRMonitorType_MEMORY_instance = new KRMonitorType('MEMORY', 2);
  }
  function KRMonitorType(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function KRMonitorType_LAUNCH_getInstance() {
    KRMonitorType_initEntries();
    return KRMonitorType_LAUNCH_instance;
  }
  function KRMonitorType_MEMORY_getInstance() {
    KRMonitorType_initEntries();
    return KRMonitorType_MEMORY_instance;
  }
  function Companion_36() {
    this.j1a_1 = 'firstPaintCost';
    this.k1a_1 = 'initViewCost';
    this.l1a_1 = 'preloadDexClassCost';
    this.m1a_1 = 'fetchContextCodeCost';
    this.n1a_1 = 'initRenderContextCost';
    this.o1a_1 = 'initRenderCoreCost';
    this.p1a_1 = 'newPageCost';
    this.q1a_1 = 'pageBuildCost';
    this.r1a_1 = 'pageLayoutCost';
    this.s1a_1 = 'createPageCost';
    this.t1a_1 = 'createInstanceCost';
    this.u1a_1 = 'renderCost';
    this.v1a_1 = 0;
    this.w1a_1 = 1;
    this.x1a_1 = 2;
    this.y1a_1 = 3;
    this.z1a_1 = 4;
    this.a1b_1 = 5;
    this.b1b_1 = 6;
    this.c1b_1 = 7;
    this.d1b_1 = 8;
    this.e1b_1 = 9;
    this.f1b_1 = 10;
    this.g1b_1 = 11;
    this.h1b_1 = 12;
    this.i1b_1 = 13;
    this.j1b_1 = 14;
    this.k1b_1 = 15;
    this.l1b_1 = 16;
    this.m1b_1 = 17;
    this.n1b_1 = 18;
  }
  var Companion_instance_36;
  function Companion_getInstance_36() {
    return Companion_instance_36;
  }
  function KRLaunchData(eventTimestamps) {
    this.s19_1 = eventTimestamps;
  }
  protoOf(KRLaunchData).o1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[1].r1(this.s19_1[0]);
  };
  protoOf(KRLaunchData).p1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[2].r1(this.s19_1[0]);
  };
  protoOf(KRLaunchData).q1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[3].r1(this.s19_1[2]);
  };
  protoOf(KRLaunchData).r1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[15].r1(this.s19_1[6]);
  };
  protoOf(KRLaunchData).s1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[5].r1(this.s19_1[4]);
  };
  protoOf(KRLaunchData).t1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[8].r1(this.s19_1[7]);
  };
  protoOf(KRLaunchData).u1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[11].r1(this.s19_1[10]);
  };
  protoOf(KRLaunchData).v1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[13].r1(this.s19_1[12]);
  };
  protoOf(KRLaunchData).w1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[14].r1(this.s19_1[9]);
  };
  protoOf(KRLaunchData).x1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[16].r1(this.s19_1[14]);
  };
  protoOf(KRLaunchData).y1b = function () {
    if (this.s19_1.length < 18) {
      return new Long(0, 0);
    }
    return this.s19_1[16].r1(this.s19_1[0]);
  };
  protoOf(KRLaunchData).g15 = function () {
    // Inline function 'kotlin.apply' call
    var this_0 = JSONObject_init_$Create$();
    this_0.o17('firstPaintCost', this.y1b());
    this_0.o17('initViewCost', this.p1b());
    this_0.o17('preloadDexClassCost', this.o1b());
    this_0.p17('fetchContextCodeCost', 0);
    this_0.o17('initRenderContextCost', this.s1b());
    this_0.o17('initRenderCoreCost', this.q1b());
    this_0.o17('newPageCost', this.t1b());
    this_0.o17('pageBuildCost', this.u1b());
    this_0.o17('pageLayoutCost', this.v1b());
    this_0.o17('createPageCost', this.w1b());
    this_0.o17('createInstanceCost', this.r1b());
    this_0.o17('renderCost', this.x1b());
    return this_0;
  };
  protoOf(KRLaunchData).toString = function () {
    return '[KRLaunchMeta] \n' + ('firstFramePaintCost: ' + this.y1b().toString() + ' \n') + ('   -- initRenderViewCost: ' + this.p1b().toString() + ' \n') + ('       -- preloadDexClassCost: ' + this.o1b().toString() + ' \n') + ('   -- initRenderCoreCost: ' + this.q1b().toString() + ' \n') + ('   -- initRenderContextCost: ' + this.s1b().toString() + ' \n') + ('   -- createInstanceCost: ' + this.r1b().toString() + ' \n') + ('       -- newPageCost: ' + this.t1b().toString() + ' \n') + ('       -- onPageCreateCost: ' + this.w1b().toString() + ' \n') + ('           -- pageBuildCost: ' + this.u1b().toString() + ' \n') + ('           -- pageLayoutCost: ' + this.v1b().toString() + ' \n') + ('   -- renderCost: ' + this.x1b().toString() + ' \n');
  };
  function checkIsValidTimestamps($this) {
    var inductionVariable = 1;
    var last = $this.u14_1.length - 1 | 0;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if ($this.u14_1[i].p1($this.u14_1[i - 1 | 0]) < 0) {
          Log_instance.o12(['KRLaunchMonitor', 'timestamp is invalid:[' + i + '] ' + $this.u14_1[i].toString() + ' < [' + (i - 1 | 0) + '] ' + $this.u14_1[i - 1 | 0].toString()]);
          return false;
        }
      }
       while (inductionVariable < last);
    return true;
  }
  function tryNotifyListener($this) {
    if ($this.w14_1) {
      return Unit_instance;
    }
    var tmp0_safe_receiver = $this.x19();
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      $this.w14_1 = true;
      // Inline function 'kotlin.collections.forEach' call
      var _iterator__ex2g4s = $this.v14_1.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        element(tmp0_safe_receiver);
      }
    }
  }
  function Companion_37() {
    this.z1b_1 = 'KRLaunchMonitor';
  }
  var Companion_instance_37;
  function Companion_getInstance_37() {
    return Companion_instance_37;
  }
  function KRLaunchMonitor() {
    KRMonitor.call(this);
    var tmp = this;
    var tmp_0 = 0;
    // Inline function 'kotlin.arrayOfNulls' call
    var tmp_1 = Array(18);
    while (tmp_0 < 18) {
      tmp_1[tmp_0] = new Long(0, 0);
      tmp_0 = tmp_0 + 1 | 0;
    }
    tmp.u14_1 = tmp_1;
    var tmp_2 = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_2.v14_1 = ArrayList_init_$Create$();
    this.w14_1 = false;
    this.u14_1[17] = new Long(-1, 2147483647);
  }
  protoOf(KRLaunchMonitor).j19 = function () {
    return 'KRLaunchMonitor';
  };
  protoOf(KRLaunchMonitor).zf = function () {
    this.u14_1[0] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).ag = function () {
    this.u14_1[1] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).bg = function () {
    this.u14_1[2] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).cg = function () {
    this.u14_1[3] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).dg = function () {
    this.u14_1[4] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).eg = function () {
    this.u14_1[5] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).xf = function () {
    this.u14_1[6] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).yf = function () {
    this.u14_1[15] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).x14 = function (createTrace) {
    Log_instance.o12(['KRLaunchMonitor', '--onPageCreateFinish--']);
    if (createTrace == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      this.u14_1[9] = createTrace.a14_1;
      this.u14_1[10] = createTrace.d14_1;
      this.u14_1[11] = createTrace.e14_1;
      this.u14_1[12] = createTrace.f14_1;
      this.u14_1[13] = createTrace.g14_1;
      this.u14_1[7] = createTrace.b14_1;
      this.u14_1[8] = createTrace.c14_1;
      this.u14_1[14] = createTrace.h14_1;
    }
    tryNotifyListener(this);
  };
  protoOf(KRLaunchMonitor).fg = function () {
    if (this.u14_1[16].equals(new Long(0, 0))) {
      this.u14_1[16] = numberToLong(Date.now());
    }
  };
  protoOf(KRLaunchMonitor).hg = function () {
    this.u14_1[17] = numberToLong(Date.now());
  };
  protoOf(KRLaunchMonitor).ig = function () {
    this.v14_1.b3();
  };
  protoOf(KRLaunchMonitor).x19 = function () {
    var isValid = checkIsValidTimestamps(this);
    if (!isValid) {
      return null;
    }
    // Inline function 'kotlin.collections.copyOf' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$1 = this.u14_1.slice();
    return new KRLaunchData(tmp$ret$1);
  };
  protoOf(KRLaunchMonitor).g1a = function (listener) {
    this.v14_1.d(listener);
  };
  function Companion_38() {
    this.a1c_1 = 'avgIncrement';
    this.b1c_1 = 'peakIncrement';
    this.c1c_1 = 'appPeak';
    this.d1c_1 = 'appAvg';
  }
  var Companion_instance_38;
  function Companion_getInstance_38() {
    return Companion_instance_38;
  }
  function KRMemoryData(initPss, initHeap, pssList, heapList) {
    initPss = initPss === VOID ? new Long(0, 0) : initPss;
    initHeap = initHeap === VOID ? new Long(0, 0) : initHeap;
    var tmp;
    if (pssList === VOID) {
      // Inline function 'kotlin.collections.mutableListOf' call
      tmp = ArrayList_init_$Create$();
    } else {
      tmp = pssList;
    }
    pssList = tmp;
    var tmp_0;
    if (heapList === VOID) {
      // Inline function 'kotlin.collections.mutableListOf' call
      tmp_0 = ArrayList_init_$Create$();
    } else {
      tmp_0 = heapList;
    }
    heapList = tmp_0;
    this.t19_1 = initPss;
    this.u19_1 = initHeap;
    this.v19_1 = pssList;
    this.w19_1 = heapList;
  }
  protoOf(KRMemoryData).e1c = function (pss, heap) {
    this.t19_1 = pss;
    this.u19_1 = heap;
  };
  protoOf(KRMemoryData).f1c = function () {
    var tmp;
    var tmp_0;
    if (this.u19_1.p1(new Long(0, 0)) > 0) {
      // Inline function 'kotlin.collections.isNotEmpty' call
      tmp_0 = !this.v19_1.k();
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      // Inline function 'kotlin.collections.isNotEmpty' call
      tmp = !this.w19_1.k();
    } else {
      tmp = false;
    }
    var isValid = tmp;
    if (!isValid) {
      Log_instance.o12(['KRMemoryMonitor', this.t19_1.toString() + ', ' + this.u19_1.toString() + ', ' + this.v19_1.i() + ', ' + this.w19_1.i()]);
    }
    return isValid;
  };
  protoOf(KRMemoryData).g1c = function (pss, javaHeap) {
    this.v19_1.d(pss);
    this.w19_1.d(javaHeap);
  };
  protoOf(KRMemoryData).h1c = function () {
    var tmp0_elvis_lhs = getMax(this.v19_1);
    return tmp0_elvis_lhs == null ? new Long(0, 0) : tmp0_elvis_lhs;
  };
  protoOf(KRMemoryData).i1c = function () {
    // Inline function 'kotlin.collections.map' call
    var this_0 = this.v19_1;
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s = this_0.f();
    while (_iterator__ex2g4s.g()) {
      var item = _iterator__ex2g4s.h();
      var tmp$ret$0 = item.r1(this.t19_1);
      destination.d(tmp$ret$0);
    }
    var tmp0_elvis_lhs = getMax(destination);
    return tmp0_elvis_lhs == null ? new Long(0, 0) : tmp0_elvis_lhs;
  };
  protoOf(KRMemoryData).j1c = function () {
    if (this.v19_1.i() > 0) {
      return numberToLong(average(this.v19_1));
    }
    return new Long(0, 0);
  };
  protoOf(KRMemoryData).k1c = function () {
    if (this.v19_1.i() > 0) {
      // Inline function 'kotlin.collections.map' call
      var this_0 = this.v19_1;
      // Inline function 'kotlin.collections.mapTo' call
      var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
      var _iterator__ex2g4s = this_0.f();
      while (_iterator__ex2g4s.g()) {
        var item = _iterator__ex2g4s.h();
        var tmp$ret$0 = item.r1(this.t19_1);
        destination.d(tmp$ret$0);
      }
      return numberToLong(average(destination));
    }
    return new Long(0, 0);
  };
  protoOf(KRMemoryData).g15 = function () {
    // Inline function 'kotlin.apply' call
    var this_0 = JSONObject_init_$Create$();
    this_0.o17('avgIncrement', this.k1c());
    this_0.o17('peakIncrement', this.i1c());
    this_0.o17('appPeak', this.h1c());
    this_0.o17('appAvg', this.j1c());
    return this_0;
  };
  protoOf(KRMemoryData).toString = function () {
    return 'KRMemoryData(initPss=' + this.t19_1.toString() + ', initHeap=' + this.u19_1.toString() + ', pssList=' + toString(this.v19_1) + ', heapList=' + toString(this.w19_1) + ')';
  };
  protoOf(KRMemoryData).hashCode = function () {
    var result = this.t19_1.hashCode();
    result = imul(result, 31) + this.u19_1.hashCode() | 0;
    result = imul(result, 31) + hashCode(this.v19_1) | 0;
    result = imul(result, 31) + hashCode(this.w19_1) | 0;
    return result;
  };
  protoOf(KRMemoryData).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof KRMemoryData))
      return false;
    var tmp0_other_with_cast = other instanceof KRMemoryData ? other : THROW_CCE();
    if (!this.t19_1.equals(tmp0_other_with_cast.t19_1))
      return false;
    if (!this.u19_1.equals(tmp0_other_with_cast.u19_1))
      return false;
    if (!equals(this.v19_1, tmp0_other_with_cast.v19_1))
      return false;
    if (!equals(this.w19_1, tmp0_other_with_cast.w19_1))
      return false;
    return true;
  };
  function getMax(_this__u8e3s4) {
    var iterator = _this__u8e3s4.f();
    if (!iterator.g())
      return null;
    var max = iterator.h();
    while (iterator.g()) {
      var e = iterator.h();
      if (compareTo(max, e) < 0)
        max = e;
    }
    return max;
  }
  function start($this) {
    $this.y19_1 = true;
    $this.z19_1 = true;
    recordMemoryData$default($this);
  }
  function getPssSize($this) {
    return new Long(0, 0);
  }
  function getUsedHeapSize($this) {
    // Inline function 'kotlin.js.asDynamic' call
    var heapSize = kuiklyWindow.performance.memory.usedJSHeapSize;
    // Inline function 'kotlin.js.unsafeCast' call
    return numberToLong(heapSize);
  }
  function recordMemoryData($this, isInit) {
    // Inline function 'kotlin.js.asDynamic' call
    if (!(typeof kuiklyWindow.performance.memory === 'undefined')) {
      var pssSize = getPssSize($this);
      var usedHeapSize = getUsedHeapSize($this);
      if (isInit) {
        $this.b1a_1.e1c(pssSize, usedHeapSize);
        Log_instance.o12(['KRMemoryMonitor', 'initMemory, pssSize: ' + pssSize.toString() + ', heapSize: ' + usedHeapSize.toString()]);
      } else {
        Log_instance.o12(['KRMemoryMonitor', 'dumpMemory[' + $this.a1a_1 + '], pssSize: ' + pssSize.toString() + ', heapSize: ' + usedHeapSize.toString()]);
        $this.b1a_1.g1c(pssSize, usedHeapSize);
      }
    }
  }
  function recordMemoryData$default($this, isInit, $super) {
    isInit = isInit === VOID ? false : isInit;
    return recordMemoryData($this, isInit);
  }
  function Companion_39() {
    this.l1c_1 = 'KRMemoryMonitor';
    this.m1c_1 = 'KRMemoryMonitor';
  }
  var Companion_instance_39;
  function Companion_getInstance_39() {
    return Companion_instance_39;
  }
  function KRMemoryMonitor() {
    KRMonitor.call(this);
    this.y19_1 = false;
    this.z19_1 = false;
    this.a1a_1 = 0;
    this.b1a_1 = new KRMemoryData();
  }
  protoOf(KRMemoryMonitor).j19 = function () {
    return 'KRMemoryMonitor';
  };
  protoOf(KRMemoryMonitor).zf = function () {
    recordMemoryData(this, true);
  };
  protoOf(KRMemoryMonitor).fg = function () {
    start(this);
  };
  protoOf(KRMemoryMonitor).hg = function () {
    if (!this.y19_1) {
      return Unit_instance;
    }
    this.z19_1 = false;
  };
  protoOf(KRMemoryMonitor).gg = function () {
    if (!this.y19_1) {
      return Unit_instance;
    }
    this.z19_1 = true;
    recordMemoryData$default(this);
  };
  protoOf(KRMemoryMonitor).ig = function () {
  };
  protoOf(KRMemoryMonitor).x19 = function () {
    if (this.b1a_1.f1c()) {
      return this.b1a_1;
    }
    return null;
  };
  var AnimationTimingFunction_LINEAR_instance;
  var AnimationTimingFunction_EASE_IN_instance;
  var AnimationTimingFunction_EASE_OUT_instance;
  var AnimationTimingFunction_EASE_IN_OUT_instance;
  var AnimationTimingFunction_SIMULATE_SPRING_ANIMATION_instance;
  var AnimationTimingFunction_entriesInitialized;
  function AnimationTimingFunction_initEntries() {
    if (AnimationTimingFunction_entriesInitialized)
      return Unit_instance;
    AnimationTimingFunction_entriesInitialized = true;
    AnimationTimingFunction_LINEAR_instance = new AnimationTimingFunction('LINEAR', 0, 'linear');
    AnimationTimingFunction_EASE_IN_instance = new AnimationTimingFunction('EASE_IN', 1, 'ease-in');
    AnimationTimingFunction_EASE_OUT_instance = new AnimationTimingFunction('EASE_OUT', 2, 'ease-out');
    AnimationTimingFunction_EASE_IN_OUT_instance = new AnimationTimingFunction('EASE_IN_OUT', 3, 'ease-in-out');
    AnimationTimingFunction_SIMULATE_SPRING_ANIMATION_instance = new AnimationTimingFunction('SIMULATE_SPRING_ANIMATION', 4, 'cubic-bezier(0.68, -0.55, 0.27, 1.55)');
  }
  function AnimationTimingFunction(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.ul_1 = value;
  }
  function AnimationOption(duration, timingFunction, delay, transformOrigin) {
    duration = duration === VOID ? 400 : duration;
    timingFunction = timingFunction === VOID ? AnimationTimingFunction_LINEAR_getInstance().ul_1 : timingFunction;
    delay = delay === VOID ? 0 : delay;
    transformOrigin = transformOrigin === VOID ? '50% 50% 0px' : transformOrigin;
    this.n1c_1 = duration;
    this.o1c_1 = timingFunction;
    this.p1c_1 = delay;
    this.q1c_1 = transformOrigin;
  }
  protoOf(AnimationOption).toString = function () {
    return 'AnimationOption(duration=' + toString(this.n1c_1) + ', timingFunction=' + this.o1c_1 + ', delay=' + toString(this.p1c_1) + ', transformOrigin=' + this.q1c_1 + ')';
  };
  protoOf(AnimationOption).hashCode = function () {
    var result = hashCode(this.n1c_1);
    result = imul(result, 31) + getStringHashCode(this.o1c_1) | 0;
    result = imul(result, 31) + hashCode(this.p1c_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.q1c_1) | 0;
    return result;
  };
  protoOf(AnimationOption).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof AnimationOption))
      return false;
    var tmp0_other_with_cast = other instanceof AnimationOption ? other : THROW_CCE();
    if (!equals(this.n1c_1, tmp0_other_with_cast.n1c_1))
      return false;
    if (!(this.o1c_1 === tmp0_other_with_cast.o1c_1))
      return false;
    if (!equals(this.p1c_1, tmp0_other_with_cast.p1c_1))
      return false;
    if (!(this.q1c_1 === tmp0_other_with_cast.q1c_1))
      return false;
    return true;
  };
  function AnimationTimingFunction_LINEAR_getInstance() {
    AnimationTimingFunction_initEntries();
    return AnimationTimingFunction_LINEAR_instance;
  }
  function AnimationTimingFunction_EASE_IN_getInstance() {
    AnimationTimingFunction_initEntries();
    return AnimationTimingFunction_EASE_IN_instance;
  }
  function AnimationTimingFunction_EASE_OUT_getInstance() {
    AnimationTimingFunction_initEntries();
    return AnimationTimingFunction_EASE_OUT_instance;
  }
  function AnimationTimingFunction_EASE_IN_OUT_getInstance() {
    AnimationTimingFunction_initEntries();
    return AnimationTimingFunction_EASE_IN_OUT_instance;
  }
  function AnimationTimingFunction_SIMULATE_SPRING_ANIMATION_getInstance() {
    AnimationTimingFunction_initEntries();
    return AnimationTimingFunction_SIMULATE_SPRING_ANIMATION_instance;
  }
  function KuiklyProcessor() {
    this.ti_1 = false;
  }
  protoOf(KuiklyProcessor).fk = function () {
    var tmp = this.oi_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('animationProcessor');
    }
  };
  protoOf(KuiklyProcessor).ez = function () {
    var tmp = this.pi_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('eventProcessor');
    }
  };
  protoOf(KuiklyProcessor).eq = function () {
    var tmp = this.qi_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('imageProcessor');
    }
  };
  protoOf(KuiklyProcessor).yz = function () {
    var tmp = this.ri_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('listProcessor');
    }
  };
  protoOf(KuiklyProcessor).qu = function () {
    var tmp = this.si_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('richTextProcessor');
    }
  };
  var KuiklyProcessor_instance;
  function KuiklyProcessor_getInstance() {
    return KuiklyProcessor_instance;
  }
  function FontSizeToLineHeightMap() {
    FontSizeToLineHeightMap_instance = this;
    this.r1c_1 = 1.3;
    this.s1c_1 = new FastMutableMap({8: 11, 9: 13, 10: 14, 11: 16, 12: 17, 13: 18, 14: 20, 15: 21, 16: 22, 17: 24, 18: 25, 19: 26, 20: 28, 21: 29, 22: 30, 23: 32, 24: 33, 25: 36, 26: 37, 27: 38, 28: 40, 29: 41, 30: 42, 31: 44, 32: 45, 33: 46, 34: 48});
  }
  protoOf(FontSizeToLineHeightMap).t1c = function (fontSize) {
    var tmp0_safe_receiver = this.s1c_1.d1(fontSize.toString());
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver;
    return tmp1_elvis_lhs == null ? fontSize * 1.3 : tmp1_elvis_lhs;
  };
  var FontSizeToLineHeightMap_instance;
  function FontSizeToLineHeightMap_getInstance() {
    if (FontSizeToLineHeightMap_instance == null)
      new FontSizeToLineHeightMap();
    return FontSizeToLineHeightMap_instance;
  }
  function IKuiklyRenderCoreScheduler() {
  }
  function KuiklyRenderCoreContextScheduler$scheduleTask$lambda($task) {
    return function () {
      $task();
      return Unit_instance;
    };
  }
  function KuiklyRenderCoreContextScheduler() {
  }
  protoOf(KuiklyRenderCoreContextScheduler).mi = function (delayMs, task) {
    var tmp = kuiklyWindow;
    tmp.setTimeout(KuiklyRenderCoreContextScheduler$scheduleTask$lambda(task), delayMs);
  };
  var KuiklyRenderCoreContextScheduler_instance;
  function KuiklyRenderCoreContextScheduler_getInstance() {
    return KuiklyRenderCoreContextScheduler_instance;
  }
  function setNeedSyncMainQueueTasks($this) {
    if (!$this.v1c_1) {
      $this.v1c_1 = true;
      Promise.resolve().then(KuiklyRenderCoreUIScheduler$setNeedSyncMainQueueTasks$lambda($this));
    }
  }
  function addTaskToMainQueue($this, task) {
    if ($this.w1c_1 == null) {
      $this.w1c_1 = new Array();
    }
    var tmp0_safe_receiver = $this.w1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.add' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp0_safe_receiver[tmp0_safe_receiver.length] = task;
    }
    setNeedSyncMainQueueTasks($this);
  }
  function KuiklyRenderCoreUIScheduler$setNeedSyncMainQueueTasks$lambda$lambda(task) {
    task();
    return Unit_instance;
  }
  function KuiklyRenderCoreUIScheduler$setNeedSyncMainQueueTasks$lambda(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.u1c_1;
      if (tmp0_safe_receiver == null)
        null;
      else
        tmp0_safe_receiver();
      var performTask = this$0.w1c_1;
      this$0.w1c_1 = null;
      this$0.v1c_1 = false;
      var tmp;
      if (performTask == null) {
        tmp = null;
      } else {
        performTask.forEach(KuiklyRenderCoreUIScheduler$setNeedSyncMainQueueTasks$lambda$lambda);
        tmp = Unit_instance;
      }
      return tmp;
    };
  }
  function KuiklyRenderCoreUIScheduler(preRunKuiklyRenderCoreUITask) {
    preRunKuiklyRenderCoreUITask = preRunKuiklyRenderCoreUITask === VOID ? null : preRunKuiklyRenderCoreUITask;
    this.u1c_1 = preRunKuiklyRenderCoreUITask;
    this.v1c_1 = false;
    this.w1c_1 = null;
  }
  protoOf(KuiklyRenderCoreUIScheduler).mi = function (delayMs, task) {
    addTaskToMainQueue(this, task);
  };
  var DeviceType_MOBILE_instance;
  var DeviceType_DESKTOP_instance;
  var DeviceType_MINIPROGRAM_instance;
  var DeviceType_entriesInitialized;
  function DeviceType_initEntries() {
    if (DeviceType_entriesInitialized)
      return Unit_instance;
    DeviceType_entriesInitialized = true;
    DeviceType_MOBILE_instance = new DeviceType('MOBILE', 0);
    DeviceType_DESKTOP_instance = new DeviceType('DESKTOP', 1);
    DeviceType_MINIPROGRAM_instance = new DeviceType('MINIPROGRAM', 2);
  }
  function DeviceType(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function DeviceUtils() {
  }
  protoOf(DeviceUtils).bz = function () {
    // Inline function 'kotlin.js.unsafeCast' call
    var isInMiniProgram = typeof window === 'undefined' || typeof wx !== 'undefined';
    if (isInMiniProgram) {
      return DeviceType_MINIPROGRAM_getInstance();
    }
    // Inline function 'kotlin.js.unsafeCast' call
    var hasTouchSupport = typeof window !== 'undefined' && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));
    // Inline function 'kotlin.js.unsafeCast' call
    var isMobile = typeof navigator !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    return hasTouchSupport || isMobile ? DeviceType_MOBILE_getInstance() : DeviceType_DESKTOP_getInstance();
  };
  var DeviceUtils_instance;
  function DeviceUtils_getInstance() {
    return DeviceUtils_instance;
  }
  function DeviceType_MOBILE_getInstance() {
    DeviceType_initEntries();
    return DeviceType_MOBILE_instance;
  }
  function DeviceType_DESKTOP_getInstance() {
    DeviceType_initEntries();
    return DeviceType_DESKTOP_instance;
  }
  function DeviceType_MINIPROGRAM_getInstance() {
    DeviceType_initEntries();
    return DeviceType_MINIPROGRAM_instance;
  }
  function Log() {
  }
  protoOf(Log).ni = function (msg) {
    if (KuiklyProcessor_instance.ti_1) {
      this.o12([msg]);
    }
  };
  protoOf(Log).n12 = function (msg) {
    console.info.apply(console, msg);
  };
  protoOf(Log).o12 = function (msg) {
    console.log.apply(console, msg);
  };
  protoOf(Log).ix = function (msg) {
    console.warn.apply(console, msg);
  };
  protoOf(Log).mg = function (msg) {
    console.error.apply(console, msg);
  };
  var Log_instance;
  function Log_getInstance() {
    return Log_instance;
  }
  //region block: post-declaration
  protoOf(KuiklyRenderExport).xd = renderViewExport$default;
  protoOf(FastMutableMap).asJsReadonlyMapView = asJsReadonlyMapView;
  protoOf(KRActivityIndicatorView).pn = get_reusable;
  protoOf(KRActivityIndicatorView).qn = set_kuiklyRenderContext;
  protoOf(KRActivityIndicatorView).rn = resetProp;
  protoOf(KRActivityIndicatorView).sn = setShadow;
  protoOf(KRActivityIndicatorView).tn = resetShadow;
  protoOf(KRActivityIndicatorView).un = onAddToParent;
  protoOf(KRActivityIndicatorView).vn = onRemoveFromParent;
  protoOf(KRActivityIndicatorView).wn = removeFromParent;
  protoOf(KRActivityIndicatorView).on = onFrameChange;
  protoOf(KRActivityIndicatorView).xn = call;
  protoOf(KRActivityIndicatorView).yn = call_0;
  protoOf(KRActivityIndicatorView).ig = onDestroy;
  protoOf(KRBlurView).pn = get_reusable;
  protoOf(KRBlurView).qn = set_kuiklyRenderContext;
  protoOf(KRBlurView).rn = resetProp;
  protoOf(KRBlurView).sn = setShadow;
  protoOf(KRBlurView).tn = resetShadow;
  protoOf(KRBlurView).un = onAddToParent;
  protoOf(KRBlurView).vn = onRemoveFromParent;
  protoOf(KRBlurView).wn = removeFromParent;
  protoOf(KRBlurView).on = onFrameChange;
  protoOf(KRBlurView).xn = call;
  protoOf(KRBlurView).yn = call_0;
  protoOf(KRBlurView).ig = onDestroy;
  protoOf(KRCanvasView).pn = get_reusable;
  protoOf(KRCanvasView).qn = set_kuiklyRenderContext;
  protoOf(KRCanvasView).rn = resetProp;
  protoOf(KRCanvasView).sn = setShadow;
  protoOf(KRCanvasView).tn = resetShadow;
  protoOf(KRCanvasView).un = onAddToParent;
  protoOf(KRCanvasView).vn = onRemoveFromParent;
  protoOf(KRCanvasView).wn = removeFromParent;
  protoOf(KRCanvasView).on = onFrameChange;
  protoOf(KRCanvasView).xn = call;
  protoOf(KRCanvasView).ig = onDestroy;
  protoOf(KRHoverView).pn = get_reusable;
  protoOf(KRHoverView).qn = set_kuiklyRenderContext;
  protoOf(KRHoverView).rn = resetProp;
  protoOf(KRHoverView).sn = setShadow;
  protoOf(KRHoverView).tn = resetShadow;
  protoOf(KRHoverView).vn = onRemoveFromParent;
  protoOf(KRHoverView).wn = removeFromParent;
  protoOf(KRHoverView).on = onFrameChange;
  protoOf(KRHoverView).xn = call;
  protoOf(KRHoverView).yn = call_0;
  protoOf(KRHoverView).ig = onDestroy;
  protoOf(KRImageView).pn = get_reusable;
  protoOf(KRImageView).rn = resetProp;
  protoOf(KRImageView).sn = setShadow;
  protoOf(KRImageView).tn = resetShadow;
  protoOf(KRImageView).un = onAddToParent;
  protoOf(KRImageView).vn = onRemoveFromParent;
  protoOf(KRImageView).wn = removeFromParent;
  protoOf(KRImageView).on = onFrameChange;
  protoOf(KRImageView).xn = call;
  protoOf(KRImageView).yn = call_0;
  protoOf(KRImageView).ig = onDestroy;
  protoOf(KRMaskView).pn = get_reusable;
  protoOf(KRMaskView).qn = set_kuiklyRenderContext;
  protoOf(KRMaskView).nn = setProp;
  protoOf(KRMaskView).rn = resetProp;
  protoOf(KRMaskView).sn = setShadow;
  protoOf(KRMaskView).tn = resetShadow;
  protoOf(KRMaskView).un = onAddToParent;
  protoOf(KRMaskView).vn = onRemoveFromParent;
  protoOf(KRMaskView).wn = removeFromParent;
  protoOf(KRMaskView).on = onFrameChange;
  protoOf(KRMaskView).xn = call;
  protoOf(KRMaskView).yn = call_0;
  protoOf(KRMaskView).ig = onDestroy;
  protoOf(KRPagView).pn = get_reusable;
  protoOf(KRPagView).qn = set_kuiklyRenderContext;
  protoOf(KRPagView).rn = resetProp;
  protoOf(KRPagView).sn = setShadow;
  protoOf(KRPagView).tn = resetShadow;
  protoOf(KRPagView).un = onAddToParent;
  protoOf(KRPagView).vn = onRemoveFromParent;
  protoOf(KRPagView).wn = removeFromParent;
  protoOf(KRPagView).on = onFrameChange;
  protoOf(KRPagView).xn = call;
  protoOf(KRRichTextView).pn = get_reusable;
  protoOf(KRRichTextView).qn = set_kuiklyRenderContext;
  protoOf(KRRichTextView).nn = setProp;
  protoOf(KRRichTextView).rn = resetProp;
  protoOf(KRRichTextView).tn = resetShadow;
  protoOf(KRRichTextView).un = onAddToParent;
  protoOf(KRRichTextView).vn = onRemoveFromParent;
  protoOf(KRRichTextView).wn = removeFromParent;
  protoOf(KRRichTextView).on = onFrameChange;
  protoOf(KRRichTextView).xn = call;
  protoOf(KRRichTextView).yn = call_0;
  protoOf(KRRichTextView).ig = onDestroy;
  protoOf(KRScrollContentView).pn = get_reusable;
  protoOf(KRScrollContentView).qn = set_kuiklyRenderContext;
  protoOf(KRScrollContentView).nn = setProp;
  protoOf(KRScrollContentView).rn = resetProp;
  protoOf(KRScrollContentView).sn = setShadow;
  protoOf(KRScrollContentView).tn = resetShadow;
  protoOf(KRScrollContentView).un = onAddToParent;
  protoOf(KRScrollContentView).vn = onRemoveFromParent;
  protoOf(KRScrollContentView).wn = removeFromParent;
  protoOf(KRScrollContentView).on = onFrameChange;
  protoOf(KRScrollContentView).xn = call;
  protoOf(KRScrollContentView).yn = call_0;
  protoOf(KRScrollContentView).ig = onDestroy;
  protoOf(KRTextAreaView).pn = get_reusable;
  protoOf(KRTextAreaView).qn = set_kuiklyRenderContext;
  protoOf(KRTextAreaView).rn = resetProp;
  protoOf(KRTextAreaView).sn = setShadow;
  protoOf(KRTextAreaView).tn = resetShadow;
  protoOf(KRTextAreaView).un = onAddToParent;
  protoOf(KRTextAreaView).vn = onRemoveFromParent;
  protoOf(KRTextAreaView).wn = removeFromParent;
  protoOf(KRTextAreaView).on = onFrameChange;
  protoOf(KRTextAreaView).xn = call;
  protoOf(KRTextAreaView).ig = onDestroy;
  protoOf(KRTextFieldView).pn = get_reusable;
  protoOf(KRTextFieldView).qn = set_kuiklyRenderContext;
  protoOf(KRTextFieldView).rn = resetProp;
  protoOf(KRTextFieldView).sn = setShadow;
  protoOf(KRTextFieldView).tn = resetShadow;
  protoOf(KRTextFieldView).un = onAddToParent;
  protoOf(KRTextFieldView).vn = onRemoveFromParent;
  protoOf(KRTextFieldView).wn = removeFromParent;
  protoOf(KRTextFieldView).on = onFrameChange;
  protoOf(KRTextFieldView).xn = call;
  protoOf(KRTextFieldView).ig = onDestroy;
  protoOf(KRVideoView).pn = get_reusable;
  protoOf(KRVideoView).qn = set_kuiklyRenderContext;
  protoOf(KRVideoView).rn = resetProp;
  protoOf(KRVideoView).sn = setShadow;
  protoOf(KRVideoView).tn = resetShadow;
  protoOf(KRVideoView).un = onAddToParent;
  protoOf(KRVideoView).vn = onRemoveFromParent;
  protoOf(KRVideoView).wn = removeFromParent;
  protoOf(KRVideoView).on = onFrameChange;
  protoOf(KRVideoView).xn = call;
  protoOf(KRVideoView).yn = call_0;
  protoOf(KRVideoView).ig = onDestroy;
  protoOf(KRView).pn = get_reusable;
  protoOf(KRView).qn = set_kuiklyRenderContext;
  protoOf(KRView).rn = resetProp;
  protoOf(KRView).sn = setShadow;
  protoOf(KRView).tn = resetShadow;
  protoOf(KRView).un = onAddToParent;
  protoOf(KRView).vn = onRemoveFromParent;
  protoOf(KRView).wn = removeFromParent;
  protoOf(KRView).on = onFrameChange;
  protoOf(KRView).xn = call;
  protoOf(KRView).yn = call_0;
  protoOf(KRView).ig = onDestroy;
  protoOf(KRListView).pn = get_reusable;
  protoOf(KRListView).qn = set_kuiklyRenderContext;
  protoOf(KRListView).rn = resetProp;
  protoOf(KRListView).sn = setShadow;
  protoOf(KRListView).tn = resetShadow;
  protoOf(KRListView).un = onAddToParent;
  protoOf(KRListView).vn = onRemoveFromParent;
  protoOf(KRListView).wn = removeFromParent;
  protoOf(KRListView).on = onFrameChange;
  protoOf(KRListView).xn = call;
  protoOf(KuiklyRenderBaseModule).xn = call;
  protoOf(KuiklyRenderBaseModule).yn = call_0;
  protoOf(KuiklyRenderBaseModule).ig = onDestroy;
  protoOf(KuiklyRenderCoreContextScheduler).ui = scheduleTask$default;
  protoOf(KuiklyRenderCoreUIScheduler).ui = scheduleTask$default;
  //endregion
  //region block: init
  Companion_instance = new Companion();
  KuiklyRenderAdapterManager_instance = new KuiklyRenderAdapterManager();
  Companion_instance_0 = new Companion_0();
  Companion_instance_1 = new Companion_1();
  Companion_instance_3 = new Companion_3();
  Companion_instance_4 = new Companion_4();
  Companion_instance_5 = new Companion_5();
  Companion_instance_6 = new Companion_6();
  Companion_instance_7 = new Companion_7();
  Companion_instance_8 = new Companion_8();
  Companion_instance_9 = new Companion_9();
  Companion_instance_10 = new Companion_10();
  Companion_instance_11 = new Companion_11();
  Companion_instance_12 = new Companion_12();
  Companion_instance_13 = new Companion_13();
  Companion_instance_14 = new Companion_14();
  Companion_instance_15 = new Companion_15();
  Companion_instance_16 = new Companion_16();
  Companion_instance_17 = new Companion_17();
  Companion_instance_18 = new Companion_18();
  Companion_instance_19 = new Companion_19();
  Companion_instance_20 = new Companion_20();
  Companion_instance_21 = new Companion_21();
  Calendar_instance = new Calendar();
  Companion_instance_23 = new Companion_23();
  Companion_instance_24 = new Companion_24();
  Companion_instance_25 = new Companion_25();
  Companion_instance_27 = new Companion_27();
  Companion_instance_28 = new Companion_28();
  Companion_instance_29 = new Companion_29();
  Companion_instance_30 = new Companion_30();
  Companion_instance_31 = new Companion_31();
  Companion_instance_32 = new Companion_32();
  JSON_instance = new JSON_0();
  JSONEngine_instance = new JSONEngine();
  Companion_instance_33 = new Companion_33();
  Companion_instance_34 = new Companion_34();
  Companion_instance_36 = new Companion_36();
  Companion_instance_37 = new Companion_37();
  Companion_instance_38 = new Companion_38();
  Companion_instance_39 = new Companion_39();
  KuiklyProcessor_instance = new KuiklyProcessor();
  KuiklyRenderCoreContextScheduler_instance = new KuiklyRenderCoreContextScheduler();
  DeviceUtils_instance = new DeviceUtils();
  Log_instance = new Log();
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = KuiklyRenderCoreExecuteMode;
  _.$_$.b = KRListViewContentInset;
  _.$_$.c = KRListView;
  _.$_$.d = KRActivityIndicatorView;
  _.$_$.e = KRBlurView;
  _.$_$.f = KRCanvasView;
  _.$_$.g = KRHoverView;
  _.$_$.h = KRImageView;
  _.$_$.i = KRMaskView;
  _.$_$.j = KRPagView;
  _.$_$.k = KRRichTextView;
  _.$_$.l = KRScrollContentView;
  _.$_$.m = KRTextAreaView;
  _.$_$.n = KRTextFieldView;
  _.$_$.o = KRVideoView;
  _.$_$.p = KRView;
  _.$_$.q = toPanEventParams;
  _.$_$.r = KRCalendarModule;
  _.$_$.s = KRCodecModule;
  _.$_$.t = KRLogModule;
  _.$_$.u = KRMemoryCacheModule;
  _.$_$.v = KRNetworkModule;
  _.$_$.w = KRNotifyModule;
  _.$_$.x = KRPerformanceModule;
  _.$_$.y = KRRouterModule;
  _.$_$.z = KRSharedPreferencesModule;
  _.$_$.a1 = KRSnapshotModule;
  _.$_$.b1 = coreExecuteMode;
  _.$_$.c1 = onGetLaunchData;
  _.$_$.d1 = onGetPerformanceData;
  _.$_$.e1 = performanceMonitorTypes;
  _.$_$.f1 = registerExternalModule;
  _.$_$.g1 = registerViewExternalPropHandler;
  _.$_$.h1 = syncRenderingWhenPageAppear;
  _.$_$.i1 = KuiklyRenderViewDelegatorDelegate;
  _.$_$.j1 = indexOfChild;
  _.$_$.k1 = pxToFloat;
  _.$_$.l1 = toNumberFloat;
  _.$_$.m1 = toPxF;
  _.$_$.n1 = toRgbColor;
  _.$_$.o1 = get_width;
  _.$_$.p1 = KRPerformanceManager;
  _.$_$.q1 = KuiklyRenderView;
  _.$_$.r1 = KuiklyRenderCoreExecuteMode_JS_getInstance;
  _.$_$.s1 = onPageLoadComplete$default;
  _.$_$.t1 = JSONObject_init_$Create$;
  _.$_$.u1 = JSONObject_init_$Create$_0;
  _.$_$.v1 = FontSizeToLineHeightMap_getInstance;
  _.$_$.w1 = KuiklyProcessor_instance;
  _.$_$.x1 = KuiklyRenderCoreContextScheduler_instance;
  _.$_$.y1 = Log_instance;
  //endregion
  return _;
}));



/***/ }),

/***/ "./kotlin/KuiklyCore-render-web-h5.js":
/*!********************************************!*\
  !*** ./kotlin/KuiklyCore-render-web-h5.js ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
  if (true)
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./kotlin-kotlin-stdlib.js */ "./kotlin/kotlin-kotlin-stdlib.js"), __webpack_require__(/*! ./KuiklyCore-render-web-base.js */ "./kotlin/KuiklyCore-render-web-base.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  else {}
}(function (_, kotlin_kotlin, kotlin_com_tencent_kuikly_open_core_render_web_base) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var Unit_instance = kotlin_kotlin.$_$.u;
  var KRPerformanceManager = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.p1;
  var Log_instance = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.y1;
  var KuiklyRenderView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.q1;
  var emptyMap = kotlin_kotlin.$_$.f1;
  var KuiklyProcessor_instance = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.w1;
  var contains = kotlin_kotlin.$_$.t2;
  var protoOf = kotlin_kotlin.$_$.o2;
  var initMetadataForCompanion = kotlin_kotlin.$_$.a2;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.d;
  var VOID = kotlin_kotlin.$_$.b;
  var initMetadataForClass = kotlin_kotlin.$_$.z1;
  var KRMemoryCacheModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.u;
  var KRSharedPreferencesModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.z;
  var KRRouterModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.y;
  var KRPerformanceModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.x;
  var KRNotifyModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.w;
  var KRLogModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.t;
  var KRCodecModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.s;
  var KRSnapshotModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.a1;
  var KRCalendarModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.r;
  var KRNetworkModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.v;
  var KRView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.p;
  var KRImageView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.h;
  var KRTextFieldView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.n;
  var KRTextAreaView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.m;
  var KRRichTextView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.k;
  var KRListView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.c;
  var KRScrollContentView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.l;
  var KRHoverView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.g;
  var KRVideoView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.o;
  var KRCanvasView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.f;
  var KRBlurView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.e;
  var KRActivityIndicatorView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.d;
  var KRPagView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.j;
  var KRMaskView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.i;
  var KuiklyRenderCoreExecuteMode_JS_getInstance = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.r1;
  var lazy = kotlin_kotlin.$_$.w3;
  var KProperty1 = kotlin_kotlin.$_$.s2;
  var getPropertyCallableRef = kotlin_kotlin.$_$.w1;
  var Regex_init_$Create$ = kotlin_kotlin.$_$.i;
  var toIntOrNull = kotlin_kotlin.$_$.d3;
  var THROW_CCE = kotlin_kotlin.$_$.s3;
  var round = kotlin_kotlin.$_$.r2;
  var toPanEventParams = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.q;
  var Long = kotlin_kotlin.$_$.p3;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.f;
  var to = kotlin_kotlin.$_$.b4;
  var json = kotlin_kotlin.$_$.i2;
  var split = kotlin_kotlin.$_$.a3;
  var toDouble = kotlin_kotlin.$_$.c3;
  var isNaN_0 = kotlin_kotlin.$_$.v3;
  var KRListViewContentInset = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.b;
  var KuiklyRenderCoreContextScheduler_instance = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.x1;
  var THROW_IAE = kotlin_kotlin.$_$.t3;
  var Enum = kotlin_kotlin.$_$.n3;
  var JSONObject_init_$Create$ = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.u1;
  var numberToLong = kotlin_kotlin.$_$.m2;
  var numberToInt = kotlin_kotlin.$_$.l2;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.x3;
  var initMetadataForObject = kotlin_kotlin.$_$.c2;
  var toString = kotlin_kotlin.$_$.p2;
  var Pair = kotlin_kotlin.$_$.r3;
  var abs = kotlin_kotlin.$_$.q2;
  var replace = kotlin_kotlin.$_$.z2;
  var indexOfChild = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.j1;
  var charSequenceLength = kotlin_kotlin.$_$.s1;
  var get_width = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.o1;
  var toPxF = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.m1;
  var FontSizeToLineHeightMap_getInstance = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.v1;
  var pxToFloat = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.k1;
  var toRgbColor = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.n1;
  var toNumberFloat = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.l1;
  var JSONObject_init_$Create$_0 = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.t1;
  //endregion
  //region block: pre-declaration
  initMetadataForCompanion(Companion);
  initMetadataForClass(KuiklyRenderViewDelegator$renderViewCallback$1);
  initMetadataForClass(KuiklyRenderViewDelegator$initPerformanceManager$1);
  initMetadataForClass(KuiklyRenderViewDelegator, 'KuiklyRenderViewDelegator');
  initMetadataForCompanion(Companion_0);
  initMetadataForClass(H5ListPagingHelper, 'H5ListPagingHelper');
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(H5ListView, 'H5ListView', H5ListView);
  initMetadataForClass(KRNestedScrollMode, 'KRNestedScrollMode', VOID, Enum);
  initMetadataForClass(KRNestedScrollState, 'KRNestedScrollState', VOID, Enum);
  initMetadataForClass(H5NestScrollHelper, 'H5NestScrollHelper');
  initMetadataForObject(AnimationProcessor, 'AnimationProcessor');
  initMetadataForCompanion(Companion_2);
  initMetadataForClass(H5Animation, 'H5Animation');
  initMetadataForClass(StyleSheet, 'StyleSheet', StyleSheet);
  initMetadataForObject(H5StyleSheet, 'H5StyleSheet');
  initMetadataForObject(EventProcessor, 'EventProcessor');
  initMetadataForClass(H5Event, 'H5Event');
  initMetadataForClass(DoubleTapHandler, 'DoubleTapHandler');
  initMetadataForClass(LongPressHandler, 'LongPressHandler');
  initMetadataForObject(ImageProcessor, 'ImageProcessor');
  initMetadataForObject(ListProcessor, 'ListProcessor');
  initMetadataForObject(RichTextProcessor, 'RichTextProcessor');
  //endregion
  function _get_pendingTaskList__cixfl5($this) {
    var tmp0 = $this.f1d_1;
    // Inline function 'kotlin.getValue' call
    pendingTaskList$factory();
    return tmp0.a1();
  }
  function runKuiklyRenderViewTask($this, task) {
    var rv = $this.y1c_1;
    if (!(rv == null)) {
      task(rv);
    } else {
      _get_pendingTaskList__cixfl5($this).d(task);
    }
  }
  function tryRunKuiklyRenderViewPendingTask($this, kuiklyRenderView) {
    if (kuiklyRenderView == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      // Inline function 'kotlin.collections.forEach' call
      var _iterator__ex2g4s = _get_pendingTaskList__cixfl5($this).f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        element(kuiklyRenderView);
      }
      _get_pendingTaskList__cixfl5($this).b3();
    }
  }
  function initPerformanceManager($this, pageName) {
    var monitorOptions = $this.x1c_1.wm();
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!monitorOptions.k()) {
      // Inline function 'kotlin.apply' call
      var this_0 = new KRPerformanceManager(pageName, $this.d1d_1, monitorOptions);
      this_0.h1a(new KuiklyRenderViewDelegator$initPerformanceManager$1($this));
      return this_0;
    }
    return $this.z1c_1;
  }
  function loadingKuiklyRenderView($this, size) {
    initRenderView($this, size);
  }
  function initRenderView($this, size) {
    Log_instance.ni(['KuiklyRenderViewDelegator', 'initRenderView, pageName: ' + $this.b1d_1]);
    $this.y1c_1 = new KuiklyRenderView($this.d1d_1, $this.x1c_1);
    var tmp0_safe_receiver = $this.y1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.apply' call
      tmp0_safe_receiver.vg($this.g1d_1);
      registerKuiklyRenderExport($this, tmp0_safe_receiver);
      var tmp = $this.c1d_1;
      var tmp0_elvis_lhs = $this.b1d_1;
      var tmp_0 = tmp0_elvis_lhs == null ? '' : tmp0_elvis_lhs;
      var tmp1_elvis_lhs = $this.a1d_1;
      var tmp_1;
      if (tmp1_elvis_lhs == null) {
        // Inline function 'kotlin.collections.mapOf' call
        tmp_1 = emptyMap();
      } else {
        tmp_1 = tmp1_elvis_lhs;
      }
      tmp0_safe_receiver.lg(tmp, tmp_0, tmp_1, size);
    }
    $this.x1c_1.xm();
    var tmp1_safe_receiver = $this.y1c_1;
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.ng();
    }
    if ($this.x1c_1.zm()) {
      var tmp2_safe_receiver = $this.y1c_1;
      if (tmp2_safe_receiver == null)
        null;
      else {
        tmp2_safe_receiver.sg();
      }
    }
    tryRunKuiklyRenderViewPendingTask($this, $this.y1c_1);
  }
  function registerKuiklyRenderExport($this, kuiklyRenderView) {
    var tmp1_safe_receiver = kuiklyRenderView == null ? null : kuiklyRenderView.kg();
    if (tmp1_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.also' call
      registerModule($this, tmp1_safe_receiver);
      registerRenderView($this, tmp1_safe_receiver);
      registerViewExternalPropHandler($this, tmp1_safe_receiver);
    }
  }
  function registerModule($this, kuiklyRenderExport) {
    // Inline function 'kotlin.with' call
    kuiklyRenderExport.vd('KRMemoryCacheModule', KuiklyRenderViewDelegator$registerModule$lambda);
    kuiklyRenderExport.vd('KRSharedPreferencesModule', KuiklyRenderViewDelegator$registerModule$lambda_0);
    kuiklyRenderExport.vd('KRRouterModule', KuiklyRenderViewDelegator$registerModule$lambda_1);
    kuiklyRenderExport.vd('KRPerformanceModule', KuiklyRenderViewDelegator$registerModule$lambda_2($this));
    kuiklyRenderExport.vd('KRNotifyModule', KuiklyRenderViewDelegator$registerModule$lambda_3);
    kuiklyRenderExport.vd('KRLogModule', KuiklyRenderViewDelegator$registerModule$lambda_4);
    kuiklyRenderExport.vd('KRCodecModule', KuiklyRenderViewDelegator$registerModule$lambda_5);
    kuiklyRenderExport.vd('KRSnapshotModule', KuiklyRenderViewDelegator$registerModule$lambda_6);
    kuiklyRenderExport.vd('KRCalendarModule', KuiklyRenderViewDelegator$registerModule$lambda_7);
    kuiklyRenderExport.vd('KRNetworkModule', KuiklyRenderViewDelegator$registerModule$lambda_8);
    $this.x1c_1.tm(kuiklyRenderExport);
  }
  function registerViewExternalPropHandler($this, kuiklyRenderExport) {
    $this.x1c_1.um(kuiklyRenderExport);
  }
  function registerRenderView($this, kuiklyRenderExport) {
    // Inline function 'kotlin.with' call
    kuiklyRenderExport.xd('KRView', KuiklyRenderViewDelegator$registerRenderView$lambda);
    var tmp0_safe_receiver = $this.y1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      kuiklyRenderExport.xd('KRImageView', KuiklyRenderViewDelegator$registerRenderView$lambda_0(tmp0_safe_receiver));
      kuiklyRenderExport.xd('KRAPNGView', KuiklyRenderViewDelegator$registerRenderView$lambda_1(tmp0_safe_receiver));
    }
    kuiklyRenderExport.xd('KRTextFieldView', KuiklyRenderViewDelegator$registerRenderView$lambda_2);
    kuiklyRenderExport.xd('KRTextAreaView', KuiklyRenderViewDelegator$registerRenderView$lambda_3);
    var tmp = KuiklyRenderViewDelegator$registerRenderView$lambda_4;
    kuiklyRenderExport.wd('KRRichTextView', tmp, KuiklyRenderViewDelegator$registerRenderView$lambda_5);
    var tmp_0 = KuiklyRenderViewDelegator$registerRenderView$lambda_6;
    kuiklyRenderExport.wd('KRGradientRichTextView', tmp_0, KuiklyRenderViewDelegator$registerRenderView$lambda_7);
    kuiklyRenderExport.xd('KRListView', KuiklyRenderViewDelegator$registerRenderView$lambda_8);
    kuiklyRenderExport.xd('KRScrollView', KuiklyRenderViewDelegator$registerRenderView$lambda_9);
    kuiklyRenderExport.xd('KRScrollContentView', KuiklyRenderViewDelegator$registerRenderView$lambda_10);
    kuiklyRenderExport.xd('KRHoverView', KuiklyRenderViewDelegator$registerRenderView$lambda_11);
    kuiklyRenderExport.xd('KRVideoView', KuiklyRenderViewDelegator$registerRenderView$lambda_12);
    kuiklyRenderExport.xd('KRCanvasView', KuiklyRenderViewDelegator$registerRenderView$lambda_13);
    kuiklyRenderExport.xd('KRBlurView', KuiklyRenderViewDelegator$registerRenderView$lambda_14);
    kuiklyRenderExport.xd('KRActivityIndicatorView', KuiklyRenderViewDelegator$registerRenderView$lambda_15);
    kuiklyRenderExport.xd('KRPAGView', KuiklyRenderViewDelegator$registerRenderView$lambda_16);
    kuiklyRenderExport.xd('KRMaskView', KuiklyRenderViewDelegator$registerRenderView$lambda_17);
    $this.x1c_1.sm(kuiklyRenderExport);
  }
  function initGlobalObject($this) {
    // Inline function 'kotlin.js.asDynamic' call
    var dynamicWindow = window;
    if (typeof dynamicWindow.kuiklyDocument === 'undefined') {
      dynamicWindow.kuiklyDocument = document;
    }
    if (typeof dynamicWindow.kuiklyWindow === 'undefined') {
      dynamicWindow.kuiklyWindow = window;
    }
  }
  function injectHostFunc($this) {
    KuiklyProcessor_instance.oi_1 = AnimationProcessor_instance;
    KuiklyProcessor_instance.si_1 = RichTextProcessor_getInstance();
    KuiklyProcessor_instance.pi_1 = EventProcessor_instance;
    KuiklyProcessor_instance.qi_1 = ImageProcessor_instance;
    KuiklyProcessor_instance.ri_1 = ListProcessor_instance;
    KuiklyProcessor_instance.ti_1 = contains(window.location.href, 'is_dev');
  }
  function Companion() {
    this.h1d_1 = 'KuiklyRenderViewDelegator';
    this.i1d_1 = 'is_dev';
  }
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  function KuiklyRenderViewDelegator$pendingTaskList$delegate$lambda() {
    // Inline function 'kotlin.collections.mutableListOf' call
    return ArrayList_init_$Create$();
  }
  function KuiklyRenderViewDelegator$renderViewCallback$1(this$0) {
    this.j1d_1 = this$0;
  }
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).zf = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zf();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).ag = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.ag();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).bg = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.bg();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).cg = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.cg();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).dg = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.dg();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).eg = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.eg();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).xf = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.xf();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).yf = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.yf();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).fg = function () {
    this.j1d_1.e1d_1 = true;
    this.j1d_1.x1c_1.ym();
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.fg();
    }
    this.j1d_1.x1c_1.dn(true, VOID, this.j1d_1.d1d_1);
    // Inline function 'kotlin.collections.mapOf' call
    var tmp$ret$0 = emptyMap();
    this.j1d_1.og('pageFirstFramePaint', tmp$ret$0);
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).gg = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.gg();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).hg = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.hg();
    }
  };
  protoOf(KuiklyRenderViewDelegator$renderViewCallback$1).ig = function () {
    var tmp0_safe_receiver = this.j1d_1.z1c_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.ig();
    }
  };
  function KuiklyRenderViewDelegator$onDetach$lambda(it) {
    it.rg();
    return Unit_instance;
  }
  function KuiklyRenderViewDelegator$onPause$lambda(it) {
    it.qg();
    return Unit_instance;
  }
  function KuiklyRenderViewDelegator$onResume$lambda(it) {
    it.pg();
    return Unit_instance;
  }
  function KuiklyRenderViewDelegator$sendEvent$lambda($event, $data) {
    return function (it) {
      it.og($event, $data);
      return Unit_instance;
    };
  }
  function KuiklyRenderViewDelegator$addKuiklyRenderViewLifeCycleCallback$lambda($callback) {
    return function (it) {
      it.vg($callback);
      return Unit_instance;
    };
  }
  function KuiklyRenderViewDelegator$initPerformanceManager$1(this$0) {
    this.k1d_1 = this$0;
  }
  protoOf(KuiklyRenderViewDelegator$initPerformanceManager$1).f1a = function (data) {
    this.k1d_1.x1c_1.an(data);
  };
  protoOf(KuiklyRenderViewDelegator$initPerformanceManager$1).i1a = function (data) {
    this.k1d_1.x1c_1.bn(data);
  };
  function KuiklyRenderViewDelegator$registerModule$lambda() {
    return new KRMemoryCacheModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_0() {
    return new KRSharedPreferencesModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_1() {
    return new KRRouterModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_2(this$0) {
    return function () {
      return new KRPerformanceModule(this$0.z1c_1);
    };
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_3() {
    return new KRNotifyModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_4() {
    return new KRLogModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_5() {
    return new KRCodecModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_6() {
    return new KRSnapshotModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_7() {
    return new KRCalendarModule();
  }
  function KuiklyRenderViewDelegator$registerModule$lambda_8() {
    return new KRNetworkModule();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda() {
    return new KRView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_0($it) {
    return function () {
      return new KRImageView($it.jg());
    };
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_1($it) {
    return function () {
      return new KRImageView($it.jg());
    };
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_2() {
    return new KRTextFieldView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_3() {
    return new KRTextAreaView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_4() {
    return new KRRichTextView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_5() {
    return new KRRichTextView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_6() {
    return new KRRichTextView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_7() {
    return new KRRichTextView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_8() {
    return new KRListView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_9() {
    return new KRListView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_10() {
    return new KRScrollContentView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_11() {
    return new KRHoverView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_12() {
    return new KRVideoView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_13() {
    return new KRCanvasView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_14() {
    return new KRBlurView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_15() {
    return new KRActivityIndicatorView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_16() {
    return new KRPagView();
  }
  function KuiklyRenderViewDelegator$registerRenderView$lambda_17() {
    return new KRMaskView();
  }
  function KuiklyRenderViewDelegator(delegate) {
    this.x1c_1 = delegate;
    this.y1c_1 = null;
    this.z1c_1 = null;
    this.a1d_1 = null;
    this.b1d_1 = null;
    this.c1d_1 = '';
    this.d1d_1 = KuiklyRenderCoreExecuteMode_JS_getInstance();
    this.e1d_1 = false;
    var tmp = this;
    tmp.f1d_1 = lazy(KuiklyRenderViewDelegator$pendingTaskList$delegate$lambda);
    var tmp_0 = this;
    tmp_0.g1d_1 = new KuiklyRenderViewDelegator$renderViewCallback$1(this);
  }
  protoOf(KuiklyRenderViewDelegator).l1d = function (container, pageName, pageData, size) {
    initGlobalObject(this);
    this.d1d_1 = this.x1c_1.vm();
    this.z1c_1 = initPerformanceManager(this, pageName);
    this.c1d_1 = container;
    this.b1d_1 = pageName;
    this.a1d_1 = pageData;
    injectHostFunc(this);
    loadingKuiklyRenderView(this, size);
  };
  protoOf(KuiklyRenderViewDelegator).m1d = function () {
    runKuiklyRenderViewTask(this, KuiklyRenderViewDelegator$onDetach$lambda);
  };
  protoOf(KuiklyRenderViewDelegator).hg = function () {
    runKuiklyRenderViewTask(this, KuiklyRenderViewDelegator$onPause$lambda);
  };
  protoOf(KuiklyRenderViewDelegator).gg = function () {
    runKuiklyRenderViewTask(this, KuiklyRenderViewDelegator$onResume$lambda);
  };
  protoOf(KuiklyRenderViewDelegator).og = function (event, data) {
    runKuiklyRenderViewTask(this, KuiklyRenderViewDelegator$sendEvent$lambda(event, data));
  };
  protoOf(KuiklyRenderViewDelegator).n1d = function (callback) {
    runKuiklyRenderViewTask(this, KuiklyRenderViewDelegator$addKuiklyRenderViewLifeCycleCallback$lambda(callback));
  };
  function pendingTaskList$factory() {
    return getPropertyCallableRef('pendingTaskList', 1, KProperty1, function (receiver) {
      return _get_pendingTaskList__cixfl5(receiver);
    }, null);
  }
  function checkIOSVersion($this) {
    var userAgent = kuiklyWindow.navigator.userAgent;
    var match = Regex_init_$Create$('OS (\\d+)_').v8(userAgent);
    if (!(match == null)) {
      var version = toIntOrNull(match.t9().j(1));
      return !(version == null) && version <= 14;
    }
    return false;
  }
  function setElementPosition($this, x, y) {
    if ($this.f1e_1) {
      var tmp = $this.o1d_1.firstElementChild;
      (tmp instanceof HTMLElement ? tmp : THROW_CCE()).style.left = '' + x + 'px';
      var tmp_0 = $this.o1d_1.firstElementChild;
      (tmp_0 instanceof HTMLElement ? tmp_0 : THROW_CCE()).style.top = '' + y + 'px';
    } else {
      $this.o1d_1.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }
  }
  function getNewPageIndex($this, delta, offset, newPageIndex) {
    var resultPageIndex = newPageIndex;
    // Inline function 'kotlin.math.abs' call
    if (Math.abs(delta) > offset) {
      if (delta > 0) {
        if ($this.z1d_1 > 0) {
          resultPageIndex = $this.z1d_1 - 1;
        }
      } else {
        if ($this.z1d_1 < $this.y1d_1 - 1) {
          resultPageIndex = $this.z1d_1 + 1;
        }
      }
    }
    return resultPageIndex;
  }
  function modifyOverflowIfPageList($this, element, isVisible) {
    if (element.classList.contains('page-list')) {
      if (isVisible) {
        element.style.overflowX = 'visible';
        element.style.overflowY = 'visible';
      } else {
        element.style.overflowX = 'hidden';
        element.style.overflowY = 'hidden';
      }
    }
    var inductionVariable = 0;
    var last = element.children.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'org.w3c.dom.get' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp = element.children[i];
        modifyOverflowIfPageList($this, tmp instanceof HTMLElement ? tmp : THROW_CCE(), isVisible);
      }
       while (inductionVariable < last);
  }
  function Companion_0() {
    this.g1e_1 = 20;
    this.h1e_1 = 200;
  }
  var Companion_instance_0;
  function Companion_getInstance_0() {
    return Companion_instance_0;
  }
  function H5ListPagingHelper$handlePagerScrollTo$lambda($isAnimation, this$0, $scrollOffsetX, $scrollOffsetY) {
    return function () {
      var tmp;
      if ($isAnimation) {
        var tmp_0;
        if (this$0.f1e_1) {
          var tmp_1 = this$0.o1d_1.firstElementChild;
          (tmp_1 instanceof HTMLElement ? tmp_1 : THROW_CCE()).style.transition = 'all 200ms';
          tmp_0 = Unit_instance;
        } else {
          this$0.o1d_1.style.transition = 'transform 200ms';
          tmp_0 = Unit_instance;
        }
        tmp = tmp_0;
      }
      setElementPosition(this$0, $scrollOffsetX, $scrollOffsetY);
      return Unit_instance;
    };
  }
  function H5ListPagingHelper$handlePagerScrollTo$lambda_0(this$0) {
    return function () {
      var tmp;
      if (this$0.f1e_1) {
        var tmp_0 = this$0.o1d_1.firstElementChild;
        (tmp_0 instanceof HTMLElement ? tmp_0 : THROW_CCE()).style.transition = '';
        tmp = Unit_instance;
      } else {
        this$0.o1d_1.style.transition = '';
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function H5ListPagingHelper$setContentOffset$lambda(this$0, $offsetX, $offsetY, $animate) {
    return function () {
      this$0.i1e(-$offsetX, -$offsetY, $animate);
      return Unit_instance;
    };
  }
  function H5ListPagingHelper(ele, listElement) {
    this.o1d_1 = ele;
    this.p1d_1 = listElement;
    this.q1d_1 = 0.0;
    this.r1d_1 = 0.0;
    this.s1d_1 = 0.0;
    this.t1d_1 = 0.0;
    this.u1d_1 = 0.0;
    this.v1d_1 = 0.0;
    this.w1d_1 = 0.0;
    this.x1d_1 = 0.0;
    this.y1d_1 = 0.0;
    this.z1d_1 = 0.0;
    this.a1e_1 = false;
    this.b1e_1 = null;
    this.c1e_1 = false;
    this.d1e_1 = 'column';
    this.e1e_1 = 0;
    this.f1e_1 = checkIOSVersion(this);
  }
  protoOf(H5ListPagingHelper).j1e = function (it) {
    this.e1e_1 = 1;
    this.b1e_1 = it;
    this.o1d_1.style.overflowX = 'visible';
    this.o1d_1.style.overflowY = 'visible';
    if (this.f1e_1) {
      this.o1d_1.style.position = 'relative';
      var tmp = this.o1d_1.firstElementChild;
      (tmp instanceof HTMLElement ? tmp : THROW_CCE()).style.position = 'absolute';
    }
    if (!this.o1d_1.classList.contains('page-list')) {
      this.o1d_1.classList.add('page-list');
      this.z1d_1 = 0.0;
    }
    if (this.d1e_1 === 'column') {
      // Inline function 'kotlin.apply' call
      this.o1d_1.style.setProperty('overscroll-behavior-y', this.c1e_1 ? 'auto' : 'none');
      var tmp_0 = this.o1d_1.firstElementChild;
      var containerHeight = (tmp_0 instanceof HTMLElement ? tmp_0 : THROW_CCE()).offsetHeight;
      var pageHeight = this.o1d_1.offsetHeight;
      this.t1d_1 = containerHeight - pageHeight;
      var tmp_1 = this;
      // Inline function 'kotlin.math.round' call
      var x = containerHeight / pageHeight;
      tmp_1.y1d_1 = round(x);
    } else {
      // Inline function 'kotlin.apply' call
      this.o1d_1.style.setProperty('overscroll-behavior-x', this.c1e_1 ? 'auto' : 'none');
      var tmp_2 = this.o1d_1.firstElementChild;
      var containerWidth = (tmp_2 instanceof HTMLElement ? tmp_2 : THROW_CCE()).offsetWidth;
      var pageWidth = this.o1d_1.offsetWidth;
      this.s1d_1 = containerWidth - pageWidth;
      var tmp_3 = this;
      // Inline function 'kotlin.math.round' call
      var x_0 = containerWidth / pageWidth;
      tmp_3.y1d_1 = round(x_0);
    }
    var offsetX = this.o1d_1.scrollLeft;
    var offsetY = this.o1d_1.scrollTop;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var eventsParams = toPanEventParams(it);
    var tmp_4 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_4.u1d_1 = eventsParams.d1('y');
    var tmp_5 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_5.w1d_1 = eventsParams.d1('x');
    var offsetMap = this.p1d_1.k1e(offsetX, offsetY, this.e1e_1);
    var tmp0_safe_receiver = this.p1d_1.l1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5ListPagingHelper).m1e = function (it) {
    if (this.b1e_1 == null) {
      return Unit_instance;
    }
    var tmp = this.b1e_1;
    var lastEventsParams = toPanEventParams(tmp instanceof TouchEvent ? tmp : THROW_CCE());
    var eventsParams = toPanEventParams(it);
    this.b1e_1 = it;
    var tmp_0 = this;
    var tmp_1 = eventsParams.d1('y');
    tmp_0.v1d_1 = (!(tmp_1 == null) ? typeof tmp_1 === 'number' : false) ? tmp_1 : THROW_CCE();
    var tmp_2 = this;
    var tmp_3 = eventsParams.d1('x');
    tmp_2.x1d_1 = (!(tmp_3 == null) ? typeof tmp_3 === 'number' : false) ? tmp_3 : THROW_CCE();
    var tmp_4 = lastEventsParams.d1('y');
    var lastEventY = (!(tmp_4 == null) ? typeof tmp_4 === 'number' : false) ? tmp_4 : THROW_CCE();
    var tmp_5 = lastEventsParams.d1('x');
    var lastEventX = (!(tmp_5 == null) ? typeof tmp_5 === 'number' : false) ? tmp_5 : THROW_CCE();
    var deltaY = this.v1d_1 - lastEventY;
    var deltaX = this.x1d_1 - lastEventX;
    // Inline function 'kotlin.math.abs' call
    var absDeltaY = Math.abs(deltaY);
    // Inline function 'kotlin.math.abs' call
    var absDeltaX = Math.abs(deltaX);
    var delta = 0.0;
    var canScroll = true;
    var needParentNodeScroll = false;
    if (this.d1e_1 === 'column' && absDeltaY > absDeltaX) {
      delta = deltaY;
      this.r1d_1 = this.r1d_1 + deltaY;
      if (deltaY > 0) {
        if (this.r1d_1 > 0) {
          this.r1d_1 = 0.0;
          if (this.z1d_1 === 0.0) {
            canScroll = false;
          }
        }
      } else {
        if (this.r1d_1 < -this.t1d_1) {
          this.r1d_1 = -this.t1d_1;
          if (this.z1d_1 === this.y1d_1 - 1) {
            canScroll = false;
          }
        }
      }
    } else if (this.d1e_1 === 'row' && absDeltaX > absDeltaY) {
      delta = deltaX;
      this.q1d_1 = this.q1d_1 + deltaX;
      if (deltaX > 0) {
        if (this.q1d_1 >= 0) {
          this.q1d_1 = 0.0;
          if (this.z1d_1 === 0.0) {
            canScroll = false;
          }
        }
      } else {
        if (this.q1d_1 <= -this.s1d_1) {
          this.q1d_1 = -this.s1d_1;
          if (this.z1d_1 === this.y1d_1 - 1) {
            canScroll = false;
          }
        }
      }
    } else {
      needParentNodeScroll = true;
    }
    if (needParentNodeScroll) {
      Log_instance.ni(['pagelist needParentNodeScroll']);
      return Unit_instance;
    } else {
      it.preventDefault();
      it.stopPropagation();
      if (!canScroll) {
        Log_instance.ni(["pagelist can't scroll"]);
        return Unit_instance;
      }
    }
    Log_instance.ni(['pagelist scroll']);
    setElementPosition(this, this.q1d_1, this.r1d_1);
    // Inline function 'kotlin.math.abs' call
    var x = delta;
    if (Math.abs(x) < 2) {
      return Unit_instance;
    }
    this.a1e_1 = true;
    var tmp_6 = this.p1d_1;
    // Inline function 'kotlin.math.abs' call
    var x_0 = this.q1d_1;
    var tmp_7 = Math.abs(x_0);
    // Inline function 'kotlin.math.abs' call
    var x_1 = this.r1d_1;
    var tmp$ret$4 = Math.abs(x_1);
    var offsetMap = tmp_6.k1e(tmp_7, tmp$ret$4, this.e1e_1);
    var tmp0_safe_receiver = this.p1d_1.n1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5ListPagingHelper).o1e = function (it) {
    if (!this.a1e_1) {
      return Unit_instance;
    }
    this.e1e_1 = 0;
    this.a1e_1 = false;
    var deltaY = this.v1d_1 - this.u1d_1;
    var deltaX = this.x1d_1 - this.w1d_1;
    var offset = 50.0;
    var scrollOffsetX = 0.0;
    var scrollOffsetY = 0.0;
    var newPageIndex = this.z1d_1;
    if (this.d1e_1 === 'column') {
      Log_instance.ni(['delta y: ', deltaY, ' currentTranslateY: ', this.r1d_1]);
      newPageIndex = getNewPageIndex(this, deltaY, offset, newPageIndex);
      scrollOffsetY = (-this.o1d_1.offsetHeight | 0) * newPageIndex;
      this.r1d_1 = scrollOffsetY;
    } else {
      Log_instance.ni(['delta x: ', deltaX, ' currentTranslateX: ', this.q1d_1]);
      newPageIndex = getNewPageIndex(this, deltaX, offset, newPageIndex);
      scrollOffsetX = (-this.o1d_1.offsetWidth | 0) * newPageIndex;
      this.q1d_1 = scrollOffsetX;
    }
    if (!(newPageIndex === this.z1d_1)) {
      this.z1d_1 = newPageIndex;
      it.stopPropagation();
    }
    this.i1e(scrollOffsetX, scrollOffsetY, true);
    var tmp = this.p1d_1;
    // Inline function 'kotlin.math.abs' call
    var x = this.q1d_1;
    var tmp_0 = Math.abs(x);
    // Inline function 'kotlin.math.abs' call
    var x_0 = this.r1d_1;
    var tmp$ret$1 = Math.abs(x_0);
    var offsetMap = tmp.k1e(tmp_0, tmp$ret$1, this.e1e_1);
    var tmp0_safe_receiver = this.p1d_1.p1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
    var tmp1_safe_receiver = this.p1d_1.q1e();
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.zq(offsetMap);
    }
    var tmp2_safe_receiver = this.p1d_1.n1e();
    if (tmp2_safe_receiver == null)
      null;
    else {
      tmp2_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5ListPagingHelper).i1e = function (scrollOffsetX, scrollOffsetY, isAnimation) {
    var tmp = kuiklyWindow;
    tmp.setTimeout(H5ListPagingHelper$handlePagerScrollTo$lambda(isAnimation, this, scrollOffsetX, scrollOffsetY), 20);
    if (isAnimation) {
      var tmp_0 = kuiklyWindow;
      tmp_0.setTimeout(H5ListPagingHelper$handlePagerScrollTo$lambda_0(this), 200);
    }
  };
  protoOf(H5ListPagingHelper).r1e = function (offsetX, offsetY, animate) {
    var elementHeight = this.o1d_1.offsetHeight;
    var elementWidth = this.o1d_1.offsetWidth;
    if (this.d1e_1 === 'column' && elementHeight > 0) {
      var tmp = this;
      // Inline function 'kotlin.math.round' call
      var x = offsetY / elementHeight;
      tmp.z1d_1 = round(x);
      this.r1d_1 = -offsetY;
    } else if (this.d1e_1 === 'row' && elementWidth > 0) {
      var tmp_0 = this;
      // Inline function 'kotlin.math.round' call
      var x_0 = offsetX / elementWidth;
      tmp_0.z1d_1 = round(x_0);
      this.q1d_1 = -offsetX;
    } else {
      Log_instance.ni(['ele offset is invalid', elementWidth, elementHeight]);
    }
    this.o1d_1.style.overflowX = 'visible';
    this.o1d_1.style.overflowY = 'visible';
    this.o1d_1.classList.add('page-list');
    var offsetMap = this.p1d_1.k1e(offsetX, offsetY, this.e1e_1);
    var tmp0_safe_receiver = this.p1d_1.p1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
    var tmp1_safe_receiver = this.p1d_1.q1e();
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.zq(offsetMap);
    }
    var tmp2_safe_receiver = this.p1d_1.n1e();
    if (tmp2_safe_receiver == null)
      null;
    else {
      tmp2_safe_receiver.zq(offsetMap);
    }
    if (animate) {
      this.i1e(-offsetX, -offsetY, animate);
    } else {
      var tmp_1 = kuiklyWindow;
      tmp_1.setTimeout(H5ListPagingHelper$setContentOffset$lambda(this, offsetX, offsetY, animate), 200);
    }
    var tmp3_safe_receiver = this.o1d_1.firstElementChild;
    var tmp4_safe_receiver = tmp3_safe_receiver == null ? null : tmp3_safe_receiver.children;
    var length = tmp4_safe_receiver == null ? null : tmp4_safe_receiver.length;
    if (!(length == null)) {
      var inductionVariable = 0;
      if (inductionVariable < length)
        do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          var tmp5_safe_receiver = this.o1d_1.firstElementChild;
          var tmp6_safe_receiver = tmp5_safe_receiver == null ? null : tmp5_safe_receiver.children;
          var tmp_2;
          if (tmp6_safe_receiver == null) {
            tmp_2 = null;
          } else {
            // Inline function 'org.w3c.dom.get' call
            // Inline function 'kotlin.js.asDynamic' call
            tmp_2 = tmp6_safe_receiver[i];
          }
          var tmp_3 = tmp_2;
          var element = tmp_3 instanceof HTMLElement ? tmp_3 : THROW_CCE();
          if (element.offsetLeft === offsetX) {
            modifyOverflowIfPageList(this, element, true);
          } else {
            modifyOverflowIfPageList(this, element, false);
          }
        }
         while (inductionVariable < length);
    }
  };
  function checkHasRefreshChild($this) {
    var tmp0_safe_receiver = $this.o1f_1.firstElementChild;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var firstChild = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.firstElementChild;
    if (!(firstChild === null)) {
      return contains(firstChild.style.transform, 'translate(0%, -100%) rotate(0deg) scale(1, 1) skew(0deg, 0deg)');
    }
    return false;
  }
  function Companion_1() {
    Companion_instance_1 = this;
    this.w1f_1 = 'touchstart';
    this.x1f_1 = 'touchend';
    this.y1f_1 = 'touchmove';
    this.z1f_1 = 'scroll';
    this.a1g_1 = 200;
    this.b1g_1 = new Long(250, 0);
    this.c1g_1 = 'ease-in';
    this.d1g_1 = 50;
    this.e1g_1 = 'list-no-scrollbar';
    this.f1g_1 = 'column';
    this.g1g_1 = 'row';
    this.h1g_1 = 'none';
    this.i1g_1 = 2;
  }
  var Companion_instance_1;
  function Companion_getInstance_1() {
    if (Companion_instance_1 == null)
      new Companion_1();
    return Companion_instance_1;
  }
  function H5ListView$handleTouchEnd$lambda(this$0) {
    return function () {
      this$0.o1f_1.style.transform = '';
      return Unit_instance;
    };
  }
  function H5ListView$setScrollEvent$lambda(this$0) {
    return function (it) {
      var tmp;
      if (this$0.g1f_1) {
        var tmp_0 = this$0.u1f_1;
        tmp_0.j1e(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      var tmp_1;
      if (this$0.i1f_1) {
        var tmp_2 = this$0.v1f_1;
        tmp_2.i1h(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      this$0.j1h(it instanceof TouchEvent ? it : THROW_CCE());
      return Unit_instance;
    };
  }
  function H5ListView$setScrollEvent$lambda_0(this$0) {
    return function (it) {
      var tmp;
      if (this$0.g1f_1) {
        var tmp_0 = this$0.u1f_1;
        tmp_0.m1e(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      var tmp_1;
      if (this$0.i1f_1) {
        var tmp_2 = this$0.v1f_1;
        tmp_2.k1h(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      this$0.l1h(it instanceof TouchEvent ? it : THROW_CCE());
      return Unit_instance;
    };
  }
  function H5ListView$setScrollEvent$lambda_1(this$0) {
    return function (it) {
      var tmp;
      if (this$0.g1f_1) {
        var tmp_0 = this$0.u1f_1;
        tmp_0.o1e(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      var tmp_1;
      if (this$0.i1f_1) {
        var tmp_2 = this$0.v1f_1;
        tmp_2.m1h(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      this$0.n1h();
      return Unit_instance;
    };
  }
  function H5ListView$setScrollEvent$lambda_2(this$0) {
    return function (it) {
      var tmp;
      if (this$0.g1f_1) {
        return Unit_instance;
      }
      var tmp_0;
      if (this$0.i1f_1) {
        var tmp_1 = this$0.v1f_1;
        tmp_1.o1h(it instanceof TouchEvent ? it : THROW_CCE());
        return Unit_instance;
      }
      this$0.p1h();
      return Unit_instance;
    };
  }
  function H5ListView$setScrollEndEvent$lambda$lambda(this$0) {
    return function () {
      var offsetMap = this$0.k1e(this$0.o1f_1.scrollLeft, this$0.o1f_1.scrollTop, this$0.f1f_1);
      var tmp0_safe_receiver = this$0.t1f_1;
      var tmp;
      if (tmp0_safe_receiver == null) {
        tmp = null;
      } else {
        tmp0_safe_receiver.zq(offsetMap);
        tmp = Unit_instance;
      }
      return tmp;
    };
  }
  function H5ListView$setScrollEndEvent$lambda(this$0) {
    return function (it) {
      var tmp;
      if (this$0.t1e_1 > 0) {
        kuiklyWindow.clearTimeout(this$0.t1e_1);
        tmp = Unit_instance;
      }
      var tmp_0 = this$0;
      var tmp_1 = kuiklyWindow;
      tmp_0.t1e_1 = tmp_1.setTimeout(H5ListView$setScrollEndEvent$lambda$lambda(this$0), 200);
      return Unit_instance;
    };
  }
  function H5ListView$setContentInset$lambda(this$0, $contentInset) {
    return function () {
      var tmp = this$0.o1f_1.style;
      var tmp_0;
      if ($contentInset.u10_1) {
        tmp_0 = 'transform 250ms ease-in';
      } else {
        tmp_0 = '';
      }
      tmp.transition = tmp_0;
      this$0.o1f_1.style.transform = 'translate(' + $contentInset.r10_1 + 'px, ' + $contentInset.q10_1 + 'px)';
      return Unit_instance;
    };
  }
  function H5ListView$setContentInsetWhenEndDrag$lambda(this$0, $contentInset, $transform) {
    return function () {
      this$0.o1f_1.style.transition = '';
      this$0.o1f_1.style.transform = $contentInset.r10_1 === 0.0 && $contentInset.q10_1 === 0.0 ? '' : $transform;
      return Unit_instance;
    };
  }
  function H5ListView() {
    Companion_getInstance_1();
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('div');
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.apply' call
    var this_1 = this_0.style;
    this_1.overflowX = 'hidden';
    this_1.overflowY = 'scroll';
    tmp.s1e_1 = this_0;
    this.t1e_1 = 0;
    var tmp_0 = this;
    // Inline function 'kotlin.collections.mutableMapOf' call
    tmp_0.u1e_1 = LinkedHashMap_init_$Create$();
    this.v1e_1 = 0.0;
    this.w1e_1 = 0.0;
    this.x1e_1 = 0.0;
    this.y1e_1 = 0.0;
    this.z1e_1 = 0.0;
    this.a1f_1 = 0.0;
    this.b1f_1 = true;
    this.c1f_1 = true;
    this.d1f_1 = 'column';
    this.e1f_1 = 'none';
    this.f1f_1 = 0;
    this.g1f_1 = false;
    this.h1f_1 = false;
    this.i1f_1 = false;
    this.j1f_1 = false;
    this.k1f_1 = 0.0;
    this.l1f_1 = false;
    this.m1f_1 = 8;
    this.n1f_1 = -1;
    var tmp_1 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_1.o1f_1 = this.s1e_1;
    this.p1f_1 = null;
    this.q1f_1 = null;
    this.r1f_1 = null;
    this.s1f_1 = null;
    this.t1f_1 = null;
    this.u1f_1 = new H5ListPagingHelper(this.o1f_1, this);
    this.v1f_1 = new H5NestScrollHelper(this.o1f_1, this);
  }
  protoOf(H5ListView).mn = function () {
    return this.o1f_1;
  };
  protoOf(H5ListView).a10 = function (_set____db54di) {
    this.p1f_1 = _set____db54di;
  };
  protoOf(H5ListView).n1e = function () {
    return this.p1f_1;
  };
  protoOf(H5ListView).c10 = function (_set____db54di) {
    this.q1f_1 = _set____db54di;
  };
  protoOf(H5ListView).l1e = function () {
    return this.q1f_1;
  };
  protoOf(H5ListView).d10 = function (_set____db54di) {
    this.r1f_1 = _set____db54di;
  };
  protoOf(H5ListView).q1e = function () {
    return this.r1f_1;
  };
  protoOf(H5ListView).e10 = function (_set____db54di) {
    this.s1f_1 = _set____db54di;
  };
  protoOf(H5ListView).p1e = function () {
    return this.s1f_1;
  };
  protoOf(H5ListView).f10 = function (_set____db54di) {
    this.t1f_1 = _set____db54di;
  };
  protoOf(H5ListView).h10 = function (params) {
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.b1f_1 = params === 1;
    // Inline function 'kotlin.apply' call
    var this_0 = this.o1f_1.style;
    if (this.d1f_1 === 'column') {
      this_0.overflowY = this.b1f_1 ? 'scroll' : 'hidden';
      this_0.overflowX = 'hidden';
    } else {
      this_0.overflowX = this.b1f_1 ? 'scroll' : 'hidden';
      this_0.overflowY = 'hidden';
    }
    return true;
  };
  protoOf(H5ListView).l10 = function (params) {
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.h1f_1 = params === 1;
    this.u1f_1.c1e_1 = this.h1f_1;
    return true;
  };
  protoOf(H5ListView).m10 = function (propValue) {
    this.i1f_1 = true;
    this.v1f_1.m10(propValue);
    return true;
  };
  protoOf(H5ListView).k10 = function (params) {
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.g1f_1 = params === 1;
    return true;
  };
  protoOf(H5ListView).j10 = function (params) {
    var tmp;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    if (params === 1) {
      tmp = 'row';
    } else {
      tmp = 'column';
    }
    var direction = tmp;
    // Inline function 'kotlin.apply' call
    var this_0 = this.o1f_1.style;
    if (direction === 'column') {
      this_0.overflowX = 'hidden';
      this_0.overflowY = 'scroll';
    } else {
      this_0.overflowX = 'scroll';
      this_0.overflowY = 'hidden';
    }
    this.d1f_1 = direction;
    this.u1f_1.d1e_1 = this.d1f_1;
    this.v1f_1.y1g_1 = this.d1f_1;
    return true;
  };
  protoOf(H5ListView).k1e = function (offsetX, offsetY, isDragging) {
    // Inline function 'kotlin.collections.set' call
    this.u1e_1.k2('offsetX', offsetX);
    // Inline function 'kotlin.collections.set' call
    this.u1e_1.k2('offsetY', offsetY);
    var tmp6 = this.u1e_1;
    var tmp7 = 'viewWidth';
    // Inline function 'kotlin.collections.set' call
    var value = this.o1f_1.offsetWidth;
    tmp6.k2(tmp7, value);
    var tmp9 = this.u1e_1;
    var tmp10 = 'viewHeight';
    // Inline function 'kotlin.collections.set' call
    var value_0 = this.o1f_1.offsetHeight;
    tmp9.k2(tmp10, value_0);
    var tmp12 = this.u1e_1;
    var tmp13 = 'contentWidth';
    // Inline function 'kotlin.collections.set' call
    var value_1 = this.o1f_1.scrollWidth;
    tmp12.k2(tmp13, value_1);
    var tmp15 = this.u1e_1;
    var tmp16 = 'contentHeight';
    // Inline function 'kotlin.collections.set' call
    var value_2 = this.o1f_1.scrollHeight;
    tmp15.k2(tmp16, value_2);
    var tmp18 = this.u1e_1;
    // Inline function 'kotlin.collections.set' call
    var key = 'isDragging';
    tmp18.k2(key, isDragging);
    return this.u1e_1;
  };
  protoOf(H5ListView).j1h = function (it) {
    this.f1f_1 = 1;
    this.k1f_1 = 0.0;
    this.l1f_1 = checkHasRefreshChild(this);
    this.n1f_1 = -1;
    var offsetX = this.o1f_1.scrollLeft;
    var offsetY = this.o1f_1.scrollTop;
    this.v1e_1 = offsetX;
    this.w1e_1 = offsetY;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var eventsParams = toPanEventParams(it);
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.x1e_1 = eventsParams.d1('y');
    var tmp_0 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_0.z1e_1 = eventsParams.d1('x');
    // Inline function 'kotlin.collections.set' call
    this.u1e_1.k2('offsetX', offsetX);
    // Inline function 'kotlin.collections.set' call
    this.u1e_1.k2('offsetY', offsetY);
    var offsetMap = this.k1e(offsetX, offsetY, this.f1f_1);
    this.j1f_1 = (offsetY === 0.0 && !this.g1f_1);
    var tmp0_safe_receiver = this.q1f_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5ListView).l1h = function (it) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var eventsParams = toPanEventParams(it);
    var tmp = eventsParams.d1('y');
    var deltaY = ((!(tmp == null) ? typeof tmp === 'number' : false) ? tmp : THROW_CCE()) - this.x1e_1;
    var tmp_0 = eventsParams.d1('x');
    var deltaX = ((!(tmp_0 == null) ? typeof tmp_0 === 'number' : false) ? tmp_0 : THROW_CCE()) - this.z1e_1;
    // Inline function 'kotlin.math.abs' call
    var absDeltaY = Math.abs(deltaY);
    // Inline function 'kotlin.math.abs' call
    var absDeltaX = Math.abs(deltaX);
    if (this.n1f_1 === -1) {
      if (absDeltaY > this.m1f_1 && absDeltaY > absDeltaX) {
        this.n1f_1 = 1;
      } else if (absDeltaX > this.m1f_1 && absDeltaX > absDeltaY) {
        this.n1f_1 = 0;
      }
    }
    if (this.d1f_1 === 'column' && this.n1f_1 === 1 || (this.d1f_1 === 'row' && this.n1f_1 === 0)) {
      it.stopPropagation();
    }
    if (this.j1f_1 && deltaY > 0 && this.l1f_1 && this.n1f_1 === 1) {
      var tmp_1 = this;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_1.y1e_1 = eventsParams.d1('y');
      this.o1f_1.style.transform = 'translate(0, ' + deltaY + 'px)';
      this.o1f_1.style.overflowY = 'visible';
      this.o1f_1.style.overflowX = 'visible';
      var offsetMap = this.k1e(this.o1f_1.scrollLeft, -deltaY, this.f1f_1);
      var tmp0_safe_receiver = this.p1f_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.zq(offsetMap);
      }
    }
  };
  protoOf(H5ListView).n1h = function () {
    this.f1f_1 = 0;
    var offsetX = this.o1f_1.scrollLeft;
    var offsetY = this.o1f_1.scrollTop;
    if (this.j1f_1) {
      var deltaY = this.y1e_1 - this.x1e_1;
      if (this.k1f_1 === 0.0) {
        this.o1f_1.style.transform = 'translate(0, 0)';
        if (this.b1f_1) {
          this.o1f_1.style.overflowY = 'scroll';
        }
        var tmp = kuiklyWindow;
        tmp.setTimeout(H5ListView$handleTouchEnd$lambda(this), 0);
      } else if (deltaY > this.k1f_1) {
        this.o1f_1.style.transition = 'transform 250ms ease-in';
        this.o1f_1.style.transform = 'translate(0, ' + this.k1f_1 + 'px)';
      }
      if (deltaY > 0) {
        offsetY = -deltaY;
      }
    }
    // Inline function 'kotlin.collections.set' call
    this.u1e_1.k2('offsetX', offsetX);
    var tmp3 = this.u1e_1;
    // Inline function 'kotlin.collections.set' call
    var value = offsetY;
    tmp3.k2('offsetY', value);
    var offsetMap = this.k1e(offsetX, offsetY, this.f1f_1);
    var tmp0_safe_receiver = this.s1f_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
    var tmp1_safe_receiver = this.r1f_1;
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.zq(offsetMap);
    }
    var tmp2_safe_receiver = this.p1f_1;
    if (tmp2_safe_receiver == null)
      null;
    else {
      tmp2_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5ListView).p1h = function () {
    var offsetMap = this.k1e(this.o1f_1.scrollLeft, this.o1f_1.scrollTop, this.f1f_1);
    var tmp0_safe_receiver = this.p1f_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5ListView).b10 = function () {
    var tmp = this.o1f_1;
    tmp.addEventListener('touchstart', H5ListView$setScrollEvent$lambda(this), json([to('passive', true)]));
    var tmp_0 = this.o1f_1;
    tmp_0.addEventListener('touchmove', H5ListView$setScrollEvent$lambda_0(this), json([to('passive', !this.g1f_1 && !this.i1f_1)]));
    var tmp_1 = this.o1f_1;
    tmp_1.addEventListener('touchend', H5ListView$setScrollEvent$lambda_1(this), json([to('passive', true)]));
    var tmp_2 = this.o1f_1;
    tmp_2.addEventListener('scroll', H5ListView$setScrollEvent$lambda_2(this), json([to('passive', false)]));
  };
  protoOf(H5ListView).g10 = function () {
    var tmp = this.o1f_1;
    tmp.addEventListener('scroll', H5ListView$setScrollEndEvent$lambda(this), json([to('passive', true)]));
  };
  protoOf(H5ListView).n10 = function (params) {
    if (params === null) {
      return Unit_instance;
    }
    var contentOffsetSplits = split(params, [' ']);
    // Inline function 'kotlin.text.toFloat' call
    var this_0 = contentOffsetSplits.j(0);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var offsetX = toDouble(this_0);
    // Inline function 'kotlin.text.toFloat' call
    var this_1 = contentOffsetSplits.j(1);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var offsetY = toDouble(this_1);
    var animate = contentOffsetSplits.j(2) === '1';
    if (isNaN_0(offsetX) || isNaN_0(offsetY)) {
      return Unit_instance;
    }
    if (this.g1f_1) {
      this.u1f_1.r1e(offsetX, offsetY, animate);
      return Unit_instance;
    }
    var tmp = this.o1f_1;
    var tmp_0;
    if (animate) {
      // Inline function 'org.w3c.dom.SMOOTH' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      tmp_0 = 'smooth';
    } else {
      // Inline function 'org.w3c.dom.AUTO' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      tmp_0 = 'auto';
    }
    // Inline function 'org.w3c.dom.ScrollToOptions' call
    var behavior = tmp_0;
    var o = {};
    o['left'] = offsetX;
    o['top'] = offsetY;
    o['behavior'] = behavior;
    tmp.scrollTo(o);
  };
  protoOf(H5ListView).i10 = function (params) {
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.c1f_1 = params === 1;
    if (this.c1f_1) {
      this.o1f_1.classList.remove('list-no-scrollbar');
    } else {
      this.o1f_1.classList.add('list-no-scrollbar');
    }
    return true;
  };
  protoOf(H5ListView).o10 = function (params) {
    var tmp;
    if (params == null) {
      return Unit_instance;
    } else {
      tmp = params;
    }
    var contentInsetString = tmp;
    var contentInset = new KRListViewContentInset(contentInsetString);
    var tmp_0 = KuiklyRenderCoreContextScheduler_instance;
    tmp_0.mi(0, H5ListView$setContentInset$lambda(this, contentInset));
  };
  protoOf(H5ListView).p10 = function (params) {
    var tmp;
    if (params == null) {
      return Unit_instance;
    } else {
      tmp = params;
    }
    var contentInsetString = tmp;
    var contentInset = new KRListViewContentInset(contentInsetString);
    var transform = 'translate(' + contentInset.r10_1 + 'px, ' + contentInset.q10_1 + 'px)';
    if (contentInset.q10_1 === 0.0) {
      this.o1f_1.style.overflowY = 'scroll';
      this.o1f_1.style.overflowX = 'hidden';
      var tmp_0 = KuiklyRenderCoreContextScheduler_instance;
      tmp_0.mi(250, H5ListView$setContentInsetWhenEndDrag$lambda(this, contentInset, transform));
    } else {
      this.k1f_1 = contentInset.q10_1;
    }
  };
  protoOf(H5ListView).rg = function () {
    if (this.t1e_1 > 0) {
      kuiklyWindow.clearTimeout(this.t1e_1);
    }
  };
  var KRNestedScrollMode_SELF_ONLY_instance;
  var KRNestedScrollMode_SELF_FIRST_instance;
  var KRNestedScrollMode_PARENT_FIRST_instance;
  function valueOf(value) {
    switch (value) {
      case 'SELF_ONLY':
        return KRNestedScrollMode_SELF_ONLY_getInstance();
      case 'SELF_FIRST':
        return KRNestedScrollMode_SELF_FIRST_getInstance();
      case 'PARENT_FIRST':
        return KRNestedScrollMode_PARENT_FIRST_getInstance();
      default:
        KRNestedScrollMode_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var KRNestedScrollMode_entriesInitialized;
  function KRNestedScrollMode_initEntries() {
    if (KRNestedScrollMode_entriesInitialized)
      return Unit_instance;
    KRNestedScrollMode_entriesInitialized = true;
    KRNestedScrollMode_SELF_ONLY_instance = new KRNestedScrollMode('SELF_ONLY', 0, 'SELF_ONLY');
    KRNestedScrollMode_SELF_FIRST_instance = new KRNestedScrollMode('SELF_FIRST', 1, 'SELF_FIRST');
    KRNestedScrollMode_PARENT_FIRST_instance = new KRNestedScrollMode('PARENT_FIRST', 2, 'PARENT_FIRST');
  }
  function KRNestedScrollMode(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.s1h_1 = value;
  }
  var KRNestedScrollState_CAN_SCROLL_instance;
  var KRNestedScrollState_SCROLL_BOUNDARY_instance;
  var KRNestedScrollState_CANNOT_SCROLL_instance;
  var KRNestedScrollState_entriesInitialized;
  function KRNestedScrollState_initEntries() {
    if (KRNestedScrollState_entriesInitialized)
      return Unit_instance;
    KRNestedScrollState_entriesInitialized = true;
    KRNestedScrollState_CAN_SCROLL_instance = new KRNestedScrollState('CAN_SCROLL', 0, 'CAN_SCROLL');
    KRNestedScrollState_SCROLL_BOUNDARY_instance = new KRNestedScrollState('SCROLL_BOUNDARY', 1, 'SCROLL_BOUNDARY');
    KRNestedScrollState_CANNOT_SCROLL_instance = new KRNestedScrollState('CANNOT_SCROLL', 2, 'CANNOT_SCROLL');
  }
  function KRNestedScrollState(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.v1h_1 = value;
  }
  function KRNestedScrollMode_SELF_ONLY_getInstance() {
    KRNestedScrollMode_initEntries();
    return KRNestedScrollMode_SELF_ONLY_instance;
  }
  function KRNestedScrollMode_SELF_FIRST_getInstance() {
    KRNestedScrollMode_initEntries();
    return KRNestedScrollMode_SELF_FIRST_instance;
  }
  function KRNestedScrollMode_PARENT_FIRST_getInstance() {
    KRNestedScrollMode_initEntries();
    return KRNestedScrollMode_PARENT_FIRST_instance;
  }
  function KRNestedScrollState_CAN_SCROLL_getInstance() {
    KRNestedScrollState_initEntries();
    return KRNestedScrollState_CAN_SCROLL_instance;
  }
  function KRNestedScrollState_SCROLL_BOUNDARY_getInstance() {
    KRNestedScrollState_initEntries();
    return KRNestedScrollState_SCROLL_BOUNDARY_instance;
  }
  function dispatchScrollEventToParent($this, deltaX, deltaY) {
    var detail = json([to('deltaX', deltaX), to('deltaY', deltaY)]);
    // Inline function 'org.w3c.dom.CustomEventInit' call
    var o = {};
    o['detail'] = detail;
    o['bubbles'] = true;
    o['cancelable'] = true;
    o['composed'] = false;
    var scrollEvent = new CustomEvent('nestedScrollToParent', o);
    $this.j1g_1.dispatchEvent(scrollEvent);
  }
  function dispatchScrollEventToChild($this, deltaX, deltaY) {
    var detail = json([to('deltaX', deltaX), to('deltaY', deltaY)]);
    // Inline function 'org.w3c.dom.CustomEventInit' call
    var o = {};
    o['detail'] = detail;
    o['bubbles'] = true;
    o['cancelable'] = true;
    o['composed'] = false;
    var scrollEvent = new CustomEvent('nestedScrollToChild', o);
    dispatchToChildElements($this, scrollEvent);
  }
  function dispatchToChildElements($this, event) {
    var childElements = $this.j1g_1.querySelectorAll('[data-nested-scroll]');
    var inductionVariable = 0;
    var last = childElements.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'org.w3c.dom.get' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp = childElements[i];
        var childElement = tmp instanceof HTMLElement ? tmp : null;
        if (childElement == null)
          null;
        else
          childElement.dispatchEvent(event);
      }
       while (inductionVariable < last);
  }
  function getNestScrollMode($this, rule) {
    return rule === '' ? KRNestedScrollMode_SELF_FIRST_getInstance() : valueOf(rule);
  }
  function startInertiaScroll($this, initialVelocityX, initialVelocityY) {
    var currentVelocityX = {_v: initialVelocityX};
    var currentVelocityY = {_v: initialVelocityY};
    var currentX = {_v: $this.j1g_1.scrollLeft};
    var currentY = {_v: $this.j1g_1.scrollTop};
    var tmp = $this;
    var tmp_0 = kuiklyWindow;
    tmp.e1h_1 = tmp_0.requestAnimationFrame(H5NestScrollHelper$startInertiaScroll$animate$ref(currentVelocityX, $this, currentVelocityY, currentX, currentY));
  }
  function cancelInertiaScroll($this) {
    kuiklyWindow.cancelAnimationFrame($this.e1h_1);
  }
  function startInertiaScroll$animate(currentVelocityX, this$0, currentVelocityY, currentX, currentY, timestamp) {
    var tmp;
    // Inline function 'kotlin.math.abs' call
    var x = currentVelocityX._v;
    if (Math.abs(x) < this$0.g1h_1) {
      // Inline function 'kotlin.math.abs' call
      var x_0 = currentVelocityY._v;
      tmp = Math.abs(x_0) < this$0.g1h_1;
    } else {
      tmp = false;
    }
    if (tmp) {
      kuiklyWindow.cancelAnimationFrame(this$0.e1h_1);
      return Unit_instance;
    }
    currentVelocityX._v = currentVelocityX._v * this$0.f1h_1;
    currentVelocityY._v = currentVelocityY._v * this$0.f1h_1;
    currentX._v = currentX._v - currentVelocityX._v;
    currentY._v = currentY._v - currentVelocityY._v;
    var maxScrollX = this$0.j1g_1.scrollWidth - this$0.j1g_1.clientWidth | 0;
    var maxScrollY = this$0.j1g_1.scrollHeight - this$0.j1g_1.clientHeight | 0;
    if (currentX._v < 0) {
      currentX._v = 0.0;
      currentVelocityX._v = 0.0;
    } else if (currentX._v > maxScrollX) {
      currentX._v = maxScrollX;
      currentVelocityX._v = 0.0;
    }
    if (currentY._v < 0) {
      currentY._v = 0.0;
      currentVelocityX._v = 0.0;
    } else if (currentY._v > maxScrollY) {
      currentY._v = maxScrollY;
      currentVelocityY._v = 0.0;
    }
    if (this$0.y1g_1 === 'column') {
      this$0.j1g_1.scrollTo(this$0.j1g_1.scrollLeft, currentY._v);
    } else {
      this$0.j1g_1.scrollTo(currentX._v, this$0.j1g_1.scrollTop);
    }
    var offsetMap = this$0.k1g_1.k1e(currentX._v, currentY._v, this$0.t1g_1);
    var tmp0_safe_receiver = this$0.k1g_1.n1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
    var tmp_0 = this$0;
    var tmp_1 = kuiklyWindow;
    tmp_0.e1h_1 = tmp_1.requestAnimationFrame(H5NestScrollHelper$startInertiaScroll$animate$ref_0(currentVelocityX, this$0, currentVelocityY, currentX, currentY));
  }
  function H5NestScrollHelper$lambda(this$0) {
    return function (event) {
      var tmp;
      if (event.target == this$0.j1g_1) {
        return Unit_instance;
      }
      // Inline function 'kotlin.js.unsafeCast' call
      var deltaY = event.detail.deltaY;
      // Inline function 'kotlin.js.unsafeCast' call
      var deltaX = event.detail.deltaX;
      this$0.w1g_1 = deltaY;
      this$0.x1g_1 = deltaX;
      return Unit_instance;
    };
  }
  function H5NestScrollHelper$lambda_0(this$0) {
    return function (event) {
      var tmp;
      if (event.target == this$0.j1g_1) {
        // Inline function 'kotlin.js.unsafeCast' call
        var deltaY = event.detail.deltaY;
        // Inline function 'kotlin.js.unsafeCast' call
        var deltaX = event.detail.deltaX;
        this$0.w1g_1 = deltaY;
        this$0.x1g_1 = deltaX;
        this$0.v1g_1 = KRNestedScrollState_SCROLL_BOUNDARY_getInstance();
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function H5NestScrollHelper$startInertiaScroll$animate$ref($currentVelocityX, this$0, $currentVelocityY, $currentX, $currentY) {
    var l = function (p0) {
      startInertiaScroll$animate($currentVelocityX, this$0, $currentVelocityY, $currentX, $currentY, p0);
      return Unit_instance;
    };
    l.callableName = 'animate';
    return l;
  }
  function H5NestScrollHelper$startInertiaScroll$animate$ref_0($currentVelocityX, this$0, $currentVelocityY, $currentX, $currentY) {
    var l = function (p0) {
      startInertiaScroll$animate($currentVelocityX, this$0, $currentVelocityY, $currentX, $currentY, p0);
      return Unit_instance;
    };
    l.callableName = 'animate';
    return l;
  }
  function H5NestScrollHelper(ele, listElement) {
    this.j1g_1 = ele;
    this.k1g_1 = listElement;
    this.l1g_1 = KRNestedScrollMode_SELF_FIRST_getInstance();
    this.m1g_1 = KRNestedScrollMode_SELF_FIRST_getInstance();
    this.n1g_1 = 0.0;
    this.o1g_1 = 0.0;
    this.p1g_1 = 0.0;
    this.q1g_1 = 0.0;
    this.r1g_1 = 0.0;
    this.s1g_1 = 0.0;
    this.t1g_1 = 0;
    this.u1g_1 = KRNestedScrollState_CAN_SCROLL_getInstance();
    this.v1g_1 = KRNestedScrollState_CAN_SCROLL_getInstance();
    this.w1g_1 = 0.0;
    this.x1g_1 = 0.0;
    this.y1g_1 = 'column';
    this.z1g_1 = new Long(0, 0);
    this.a1h_1 = 0.0;
    this.b1h_1 = 0.0;
    this.c1h_1 = 0.0;
    this.d1h_1 = 0.0;
    this.e1h_1 = 0;
    this.f1h_1 = 0.97;
    this.g1h_1 = 0.1;
    this.h1h_1 = false;
    this.j1g_1.setAttribute('data-nested-scroll', 'true');
    this.j1g_1.addEventListener('nestedScrollToParent', H5NestScrollHelper$lambda(this), json([to('passive', false)]));
    this.j1g_1.addEventListener('nestedScrollToChild', H5NestScrollHelper$lambda_0(this), json([to('passive', false)]));
  }
  protoOf(H5NestScrollHelper).m10 = function (propValue) {
    if (typeof propValue === 'string') {
      // Inline function 'kotlin.apply' call
      var this_0 = JSONObject_init_$Create$(propValue);
      this.l1g_1 = getNestScrollMode(this, this_0.zu('forward', ''));
      this.m1g_1 = getNestScrollMode(this, this_0.zu('backward', ''));
    }
    return true;
  };
  protoOf(H5NestScrollHelper).i1h = function (event) {
    this.t1g_1 = 1;
    // Inline function 'org.w3c.dom.get' call
    // Inline function 'kotlin.js.asDynamic' call
    var touch = (event instanceof TouchEvent ? event : THROW_CCE()).touches[0];
    if (!(touch == null)) {
      this.p1g_1 = touch.clientY;
      this.r1g_1 = touch.clientX;
      this.c1h_1 = this.p1g_1;
      this.d1h_1 = this.r1g_1;
      this.z1g_1 = numberToLong((new Date()).getTime());
    }
    this.n1g_1 = this.j1g_1.scrollTop;
    this.o1g_1 = this.j1g_1.scrollLeft;
    this.v1g_1 = KRNestedScrollState_CAN_SCROLL_getInstance();
    this.u1g_1 = KRNestedScrollState_CAN_SCROLL_getInstance();
    this.q1g_1 = this.p1g_1;
    this.s1g_1 = this.r1g_1;
    this.w1g_1 = 0.0;
    this.x1g_1 = 0.0;
    this.a1h_1 = 0.0;
    this.b1h_1 = 0.0;
    this.h1h_1 = false;
    cancelInertiaScroll(this);
  };
  protoOf(H5NestScrollHelper).k1h = function (event) {
    // Inline function 'org.w3c.dom.get' call
    // Inline function 'kotlin.js.asDynamic' call
    var touch = (event instanceof TouchEvent ? event : THROW_CCE()).touches[0];
    var deltaY = 0.0;
    var deltaX = 0.0;
    var distanceY = 0.0;
    var distanceX = 0.0;
    if (!(touch == null)) {
      var currentTime = (new Date()).getTime();
      var timeDelta = currentTime - this.z1g_1.n();
      if (timeDelta > 0) {
        this.a1h_1 = (touch.clientY - this.c1h_1) / timeDelta;
        this.b1h_1 = (touch.clientX - this.d1h_1) / timeDelta;
      }
      this.z1g_1 = numberToLong(currentTime);
      this.c1h_1 = touch.clientY;
      this.d1h_1 = touch.clientX;
      distanceY = touch.clientY - this.p1g_1 - this.w1g_1;
      distanceX = touch.clientX - this.r1g_1 - this.x1g_1;
      deltaY = touch.clientY - this.q1g_1;
      deltaX = touch.clientX - this.s1g_1;
      this.q1g_1 = touch.clientY;
      this.s1g_1 = touch.clientX;
    }
    var canScrollUp = this.j1g_1.scrollTop > 0;
    // Inline function 'kotlin.math.ceil' call
    var x = this.j1g_1.scrollTop + this.j1g_1.offsetHeight;
    var tmp$ret$2 = Math.ceil(x);
    var canScrollDown = numberToInt(tmp$ret$2) < this.j1g_1.scrollHeight;
    var canScrollLeft = this.j1g_1.scrollLeft > 0;
    // Inline function 'kotlin.math.ceil' call
    var x_0 = this.j1g_1.scrollLeft + this.j1g_1.offsetWidth;
    var tmp$ret$3 = Math.ceil(x_0);
    var canScrollRight = numberToInt(tmp$ret$3) < this.j1g_1.scrollWidth;
    var delta = this.y1g_1 === 'column' ? deltaY : deltaX;
    var scrollMode = delta < 0 ? this.l1g_1 : this.m1g_1;
    switch (scrollMode.i1_1) {
      case 1:
        if (this.y1g_1 === 'column') {
          this.h1h_1 = deltaY < 0 && canScrollDown || (deltaY > 0 && canScrollUp);
        } else if (this.y1g_1 === 'row') {
          this.h1h_1 = deltaX < 0 && canScrollRight || (deltaX > 0 && canScrollLeft);
        }

        this.v1g_1 = KRNestedScrollState_CAN_SCROLL_getInstance();
        break;
      case 2:
        this.h1h_1 = this.v1g_1.equals(KRNestedScrollState_SCROLL_BOUNDARY_getInstance());
        break;
      case 0:
        this.h1h_1 = true;
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    if (this.h1h_1) {
      event.preventDefault();
      event.stopPropagation();
      if (this.y1g_1 === 'column') {
        this.j1g_1.scrollTo(this.j1g_1.scrollLeft, this.n1g_1 - distanceY);
      } else {
        this.j1g_1.scrollTo(this.o1g_1 - distanceX, this.j1g_1.scrollTop);
      }
      var offsetMap = this.k1g_1.k1e(this.j1g_1.scrollLeft, this.j1g_1.scrollTop, this.t1g_1);
      var tmp1_safe_receiver = this.k1g_1.n1e();
      if (tmp1_safe_receiver == null)
        null;
      else {
        tmp1_safe_receiver.zq(offsetMap);
      }
    } else if (this.u1g_1.equals(KRNestedScrollState_CAN_SCROLL_getInstance())) {
      if (scrollMode.equals(KRNestedScrollMode_SELF_FIRST_getInstance())) {
        dispatchScrollEventToChild(this, distanceX, distanceY);
        dispatchScrollEventToParent(this, distanceX, distanceY);
      }
    }
    if (scrollMode.equals(KRNestedScrollMode_SELF_FIRST_getInstance())) {
      this.u1g_1 = this.h1h_1 ? KRNestedScrollState_CAN_SCROLL_getInstance() : KRNestedScrollState_SCROLL_BOUNDARY_getInstance();
    }
  };
  protoOf(H5NestScrollHelper).m1h = function (event) {
    this.t1g_1 = 0;
    if (!this.h1h_1) {
      return Unit_instance;
    }
    var tmp;
    // Inline function 'kotlin.math.abs' call
    var x = this.b1h_1;
    if (Math.abs(x) > this.g1h_1) {
      tmp = true;
    } else {
      // Inline function 'kotlin.math.abs' call
      var x_0 = this.a1h_1;
      tmp = Math.abs(x_0) > this.g1h_1;
    }
    if (tmp) {
      var frameVelocityX = this.b1h_1 * 6.67;
      var frameVelocityY = this.a1h_1 * 6.67;
      startInertiaScroll(this, frameVelocityX, frameVelocityY);
    }
    var offsetX = this.j1g_1.scrollLeft;
    var offsetY = this.j1g_1.scrollTop;
    var offsetMap = this.k1g_1.k1e(offsetX, offsetY, this.t1g_1);
    var tmp0_safe_receiver = this.k1g_1.p1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
    var tmp1_safe_receiver = this.k1g_1.q1e();
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.zq(offsetMap);
    }
    var tmp2_safe_receiver = this.k1g_1.n1e();
    if (tmp2_safe_receiver == null)
      null;
    else {
      tmp2_safe_receiver.zq(offsetMap);
    }
  };
  protoOf(H5NestScrollHelper).o1h = function (event) {
    var offsetMap = this.k1g_1.k1e(this.j1g_1.scrollLeft, this.j1g_1.scrollTop, this.t1g_1);
    var tmp0_safe_receiver = this.k1g_1.n1e();
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.zq(offsetMap);
    }
  };
  function AnimationProcessor() {
  }
  protoOf(AnimationProcessor).hk = function (options) {
    return new H5Animation(options);
  };
  var AnimationProcessor_instance;
  function AnimationProcessor_getInstance() {
    return AnimationProcessor_instance;
  }
  function getAnimationJson($this) {
    var tmp = $this.b1i_1;
    var _unary__edvuaz = $this.a1i_1;
    $this.a1i_1 = _unary__edvuaz + 1 | 0;
    var animIndex = 'kuikly-animation_' + tmp + '_create-animation__' + _unary__edvuaz;
    var selector = '[animation="' + animIndex + '"]';
    var stepList = 'transition: ' + $this.z1h_1.join(',') + ';';
    var animationList = $this.y1h_1.join(';');
    H5StyleSheet_getInstance().g1i_1.j1i(selector + ' { ' + stepList + animationList + ' }');
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.clear' call
    // Inline function 'kotlin.js.asDynamic' call
    $this.y1h_1.length = 0;
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.clear' call
    // Inline function 'kotlin.js.asDynamic' call
    $this.z1h_1.length = 0;
    return animIndex;
  }
  function Companion_2() {
    this.k1i_1 = 0;
  }
  var Companion_instance_2;
  function Companion_getInstance_2() {
    return Companion_instance_2;
  }
  function H5Animation$step$lambda($transforms) {
    return function (transform) {
      $transforms.push(transform.y6_1);
      return Unit_instance;
    };
  }
  function H5Animation$step$lambda_0(this$0, $duration, $timingFunction, $delay) {
    return function (rule) {
      this$0.y1h_1.push(rule.y6_1 + '!important');
      this$0.z1h_1.push(rule.x6_1 + ' ' + toString($duration) + 's ' + toString($timingFunction) + ' ' + toString($delay) + 's');
      return Unit_instance;
    };
  }
  function H5Animation(options) {
    this.w1h_1 = new Array();
    this.x1h_1 = new Array();
    this.y1h_1 = new Array();
    this.z1h_1 = new Array();
    this.a1i_1 = 0;
    var tmp = this;
    Companion_instance_2.k1i_1 = Companion_instance_2.k1i_1 + 1 | 0;
    tmp.b1i_1 = Companion_instance_2.k1i_1;
    this.c1i_1 = options.p1c_1;
    this.d1i_1 = options.q1c_1;
    this.e1i_1 = options.n1c_1;
    this.f1i_1 = options.o1c_1;
  }
  protoOf(H5Animation).x15 = function (ele) {
    return getAnimationJson(this);
  };
  protoOf(H5Animation).w15 = function (options) {
    var tmp;
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.isEmpty' call
    if (this.w1h_1.length === 0) {
      // Inline function 'com.tencent.kuikly.core.render.web.collection.array.isEmpty' call
      tmp = this.x1h_1.length === 0;
    } else {
      tmp = false;
    }
    if (tmp) {
      return this;
    }
    var tmp0_elvis_lhs = options['transformOrigin'];
    var transformOrigin = tmp0_elvis_lhs == null ? '50% 50% 0' : tmp0_elvis_lhs;
    var tmp1_elvis_lhs = options['delay'];
    var delay = tmp1_elvis_lhs == null ? '0' : tmp1_elvis_lhs;
    var tmp2_elvis_lhs = options['duration'];
    var duration = tmp2_elvis_lhs == null ? '0' : tmp2_elvis_lhs;
    var tmp3_elvis_lhs = options['timingFunction'];
    var timingFunction = tmp3_elvis_lhs == null ? 'linear' : tmp3_elvis_lhs;
    var transforms = new Array();
    this.x1h_1.forEach(H5Animation$step$lambda(transforms));
    var transformSequence = transforms.length > 0 ? 'transform:' + transforms.join(' ') + '!important' : '';
    if (!(transformSequence === '')) {
      this.y1h_1.push(transformSequence);
      this.y1h_1.push('transform-origin: ' + toString(transformOrigin));
      this.z1h_1.push('transform ' + toString(duration) + 's ' + toString(timingFunction) + ' ' + toString(delay) + 's');
    }
    this.w1h_1.forEach(H5Animation$step$lambda_0(this, duration, timingFunction, delay));
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.clear' call
    // Inline function 'kotlin.js.asDynamic' call
    this.w1h_1.length = 0;
    // Inline function 'com.tencent.kuikly.core.render.web.collection.array.clear' call
    // Inline function 'kotlin.js.asDynamic' call
    this.x1h_1.length = 0;
    return this;
  };
  protoOf(H5Animation).jm = function (angle) {
    this.x1h_1.push(new Pair('rotate', 'rotate(' + angle + 'deg)'));
    return this;
  };
  protoOf(H5Animation).lm = function (skewX, skewY) {
    this.x1h_1.push(new Pair('skew', 'skew(' + skewX + 'deg, ' + skewY + 'deg)'));
    return this;
  };
  protoOf(H5Animation).km = function (scaleX, scaleY) {
    this.x1h_1.push(new Pair('scale', 'scale(' + scaleX + ', ' + scaleY + ')'));
    return this;
  };
  protoOf(H5Animation).im = function (translateX, translateY) {
    this.x1h_1.push(new Pair('translate', 'translate(' + translateX + 'px, ' + translateY + 'px)'));
    return this;
  };
  protoOf(H5Animation).mm = function (opacity) {
    this.w1h_1.push(new Pair('opacity', 'opacity: ' + opacity));
    return this;
  };
  protoOf(H5Animation).nm = function (value) {
    this.w1h_1.push(new Pair('background-color', 'background-color: ' + value));
    return this;
  };
  protoOf(H5Animation).qm = function (value) {
    this.w1h_1.push(new Pair('width', 'width: ' + value + 'px'));
    return this;
  };
  protoOf(H5Animation).rm = function (value) {
    this.w1h_1.push(new Pair('height', 'height: ' + value + 'px'));
    return this;
  };
  protoOf(H5Animation).pm = function (value) {
    this.w1h_1.push(new Pair('top', 'top: ' + value + 'px'));
    return this;
  };
  protoOf(H5Animation).om = function (value) {
    this.w1h_1.push(new Pair('left', 'left: ' + value + 'px'));
    return this;
  };
  function appendStyleSheet($this) {
    var style = $this.h1i_1;
    if (!(style == null)) {
      // Inline function 'org.w3c.dom.get' call
      // Inline function 'kotlin.js.asDynamic' call
      var head = kuiklyDocument.getElementsByTagName('head')[0];
      style.setAttribute('type', 'text/css');
      style.setAttribute('data-type', 'kuikly');
      if (head == null)
        null;
      else
        head.appendChild(style);
      var tmp = $this;
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp.i1i_1 = style.sheet;
    }
  }
  function StyleSheet() {
    this.h1i_1 = null;
    this.i1i_1 = null;
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.h1i_1 = kuiklyDocument.createElement('style');
  }
  protoOf(StyleSheet).l1i = function (cssText, index) {
    if (this.i1i_1 == null) {
      appendStyleSheet(this);
    }
    var tmp0_safe_receiver = this.i1i_1;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.insertRule(cssText, index);
  };
  protoOf(StyleSheet).j1i = function (cssText, index, $super) {
    index = index === VOID ? 0 : index;
    var tmp;
    if ($super === VOID) {
      this.l1i(cssText, index);
      tmp = Unit_instance;
    } else {
      tmp = $super.l1i.call(this, cssText, index);
    }
    return tmp;
  };
  function H5StyleSheet() {
    H5StyleSheet_instance = this;
    this.g1i_1 = new StyleSheet();
  }
  var H5StyleSheet_instance;
  function H5StyleSheet_getInstance() {
    if (H5StyleSheet_instance == null)
      new H5StyleSheet();
    return H5StyleSheet_instance;
  }
  function handleEventCallback($this, event, callback) {
    if (event instanceof TouchEvent) {
      // Inline function 'org.w3c.dom.get' call
      // Inline function 'kotlin.js.asDynamic' call
      var touch = event.touches[0];
      if (touch == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        callback(new H5Event(touch.screenX, touch.screenY, touch.clientX, touch.clientY, touch.pageX, touch.pageY));
      }
    } else {
      if (event instanceof MouseEvent) {
        callback(new H5Event(event.screenX, event.screenY, event.clientX, event.clientY, numberToInt(event.pageX), numberToInt(event.pageY)));
      }
    }
  }
  function EventProcessor$doubleClick$lambda($callback) {
    return function (event) {
      handleEventCallback(EventProcessor_instance, event, $callback);
      return Unit_instance;
    };
  }
  function EventProcessor$longPress$lambda($callback) {
    return function (event) {
      handleEventCallback(EventProcessor_instance, event, $callback);
      return Unit_instance;
    };
  }
  function EventProcessor() {
  }
  protoOf(EventProcessor).fz = function (ele, callback) {
    new DoubleTapHandler(ele, EventProcessor$doubleClick$lambda(callback));
  };
  protoOf(EventProcessor).gz = function (ele, callback) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = ele;
    new LongPressHandler(tmp, EventProcessor$longPress$lambda(callback));
  };
  var EventProcessor_instance;
  function EventProcessor_getInstance() {
    return EventProcessor_instance;
  }
  function H5Event(screenX, screenY, clientX, clientY, pageX, pageY) {
    this.m1i_1 = screenX;
    this.n1i_1 = screenY;
    this.o1i_1 = clientX;
    this.p1i_1 = clientY;
    this.q1i_1 = pageX;
    this.r1i_1 = pageY;
  }
  protoOf(H5Event).cz = function () {
    return this.o1i_1;
  };
  protoOf(H5Event).dz = function () {
    return this.p1i_1;
  };
  protoOf(H5Event).toString = function () {
    return 'H5Event(screenX=' + this.m1i_1 + ', screenY=' + this.n1i_1 + ', clientX=' + this.o1i_1 + ', clientY=' + this.p1i_1 + ', pageX=' + this.q1i_1 + ', pageY=' + this.r1i_1 + ')';
  };
  protoOf(H5Event).hashCode = function () {
    var result = this.m1i_1;
    result = imul(result, 31) + this.n1i_1 | 0;
    result = imul(result, 31) + this.o1i_1 | 0;
    result = imul(result, 31) + this.p1i_1 | 0;
    result = imul(result, 31) + this.q1i_1 | 0;
    result = imul(result, 31) + this.r1i_1 | 0;
    return result;
  };
  protoOf(H5Event).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof H5Event))
      return false;
    var tmp0_other_with_cast = other instanceof H5Event ? other : THROW_CCE();
    if (!(this.m1i_1 === tmp0_other_with_cast.m1i_1))
      return false;
    if (!(this.n1i_1 === tmp0_other_with_cast.n1i_1))
      return false;
    if (!(this.o1i_1 === tmp0_other_with_cast.o1i_1))
      return false;
    if (!(this.p1i_1 === tmp0_other_with_cast.p1i_1))
      return false;
    if (!(this.q1i_1 === tmp0_other_with_cast.q1i_1))
      return false;
    if (!(this.r1i_1 === tmp0_other_with_cast.r1i_1))
      return false;
    return true;
  };
  function setupListeners($this) {
    $this.s1i_1.addEventListener('touchstart', TouchEventHandlers$DoubleTapHandler$setupListeners$lambda($this));
    $this.s1i_1.addEventListener('mousedown', TouchEventHandlers$DoubleTapHandler$setupListeners$lambda_0($this));
  }
  function handleTap($this, event) {
    if (event.touches.length === 1) {
      // Inline function 'org.w3c.dom.get' call
      // Inline function 'kotlin.js.asDynamic' call
      var touch = event.touches[0];
      var currentTime = Date.now();
      var x = touch == null ? null : touch.clientX;
      var y = touch == null ? null : touch.clientY;
      if (!(x == null) && !(y == null)) {
        if (currentTime - $this.w1i_1 < $this.u1i_1 && abs(x - $this.x1i_1 | 0) < $this.v1i_1 && abs(y - $this.y1i_1 | 0) < $this.v1i_1) {
          event.preventDefault();
          $this.t1i_1(event);
          $this.w1i_1 = 0.0;
        } else {
          $this.w1i_1 = currentTime;
          $this.x1i_1 = x;
          $this.y1i_1 = y;
        }
      }
    }
  }
  function handleMouseTap($this, event) {
    var currentTime = Date.now();
    var x = event.clientX;
    var y = event.clientY;
    if (currentTime - $this.w1i_1 < $this.u1i_1 && abs(x - $this.x1i_1 | 0) < $this.v1i_1 && abs(y - $this.y1i_1 | 0) < $this.v1i_1) {
      event.preventDefault();
      $this.t1i_1(event);
      $this.w1i_1 = 0.0;
    } else {
      $this.w1i_1 = currentTime;
      $this.x1i_1 = x;
      $this.y1i_1 = y;
    }
  }
  function TouchEventHandlers$DoubleTapHandler$setupListeners$lambda(this$0) {
    return function (event) {
      if (!(event instanceof TouchEvent))
        THROW_CCE();
      handleTap(this$0, event);
      return Unit_instance;
    };
  }
  function TouchEventHandlers$DoubleTapHandler$setupListeners$lambda_0(this$0) {
    return function (event) {
      if (!(event instanceof MouseEvent))
        THROW_CCE();
      var tmp;
      if (event.button === 0) {
        handleMouseTap(this$0, event);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function setupListeners_0($this) {
    $this.z1i_1.addEventListener('contextmenu', TouchEventHandlers$LongPressHandler$setupListeners$lambda);
    $this.z1i_1.addEventListener('touchstart', TouchEventHandlers$LongPressHandler$setupListeners$lambda_0($this));
    $this.z1i_1.addEventListener('touchmove', TouchEventHandlers$LongPressHandler$setupListeners$lambda_1($this));
    $this.z1i_1.addEventListener('touchend', TouchEventHandlers$LongPressHandler$setupListeners$lambda_2($this));
    $this.z1i_1.addEventListener('touchcancel', TouchEventHandlers$LongPressHandler$setupListeners$lambda_3($this));
    $this.z1i_1.addEventListener('mousedown', TouchEventHandlers$LongPressHandler$setupListeners$lambda_4($this));
    $this.z1i_1.addEventListener('mousemove', TouchEventHandlers$LongPressHandler$setupListeners$lambda_5($this));
    $this.z1i_1.addEventListener('mouseup', TouchEventHandlers$LongPressHandler$setupListeners$lambda_6($this));
    $this.z1i_1.addEventListener('mouseleave', TouchEventHandlers$LongPressHandler$setupListeners$lambda_7($this));
  }
  function startTimer($this, event) {
    cancelTimer($this);
    $this.g1j_1 = false;
    var tmp = $this;
    var tmp_0 = kuiklyWindow;
    tmp.d1j_1 = tmp_0.setTimeout(TouchEventHandlers$LongPressHandler$startTimer$lambda($this, event), $this.b1j_1);
  }
  function cancelTimer($this) {
    var tmp0_safe_receiver = $this.d1j_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      kuiklyWindow.clearTimeout(tmp0_safe_receiver);
      $this.d1j_1 = null;
    }
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda(event) {
    event.preventDefault();
    return Unit_instance;
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_0(this$0) {
    return function (event) {
      if (!(event instanceof TouchEvent))
        THROW_CCE();
      var tmp;
      if (event.touches.length === 1) {
        // Inline function 'org.w3c.dom.get' call
        // Inline function 'kotlin.js.asDynamic' call
        var touch = event.touches[0];
        if (!(touch == null)) {
          this$0.e1j_1 = touch.clientX;
          this$0.f1j_1 = touch.clientY;
        }
        startTimer(this$0, event);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_1(this$0) {
    return function (event) {
      if (!(event instanceof TouchEvent))
        THROW_CCE();
      var tmp;
      if (event.touches.length === 1) {
        // Inline function 'org.w3c.dom.get' call
        // Inline function 'kotlin.js.asDynamic' call
        var touch = event.touches[0];
        var tmp_0;
        if (!(touch == null)) {
          var moveX = touch.clientX;
          var moveY = touch.clientY;
          var tmp_1;
          if (abs(moveX - this$0.e1j_1 | 0) > this$0.c1j_1 || abs(moveY - this$0.f1j_1 | 0) > this$0.c1j_1) {
            cancelTimer(this$0);
            tmp_1 = Unit_instance;
          }
          tmp_0 = tmp_1;
        }
        tmp = tmp_0;
      }
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_2(this$0) {
    return function (_unused_var__etf5q3) {
      cancelTimer(this$0);
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_3(this$0) {
    return function (_unused_var__etf5q3) {
      cancelTimer(this$0);
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_4(this$0) {
    return function (event) {
      if (!(event instanceof MouseEvent))
        THROW_CCE();
      var tmp;
      if (event.button === 0) {
        this$0.e1j_1 = event.clientX;
        this$0.f1j_1 = event.clientY;
        startTimer(this$0, event);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_5(this$0) {
    return function (event) {
      if (!(event instanceof MouseEvent))
        THROW_CCE();
      var moveX = event.clientX;
      var moveY = event.clientY;
      var tmp;
      if (abs(moveX - this$0.e1j_1 | 0) > this$0.c1j_1 || abs(moveY - this$0.f1j_1 | 0) > this$0.c1j_1) {
        cancelTimer(this$0);
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_6(this$0) {
    return function (_unused_var__etf5q3) {
      cancelTimer(this$0);
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$setupListeners$lambda_7(this$0) {
    return function (_unused_var__etf5q3) {
      cancelTimer(this$0);
      return Unit_instance;
    };
  }
  function TouchEventHandlers$LongPressHandler$startTimer$lambda(this$0, $event) {
    return function () {
      this$0.g1j_1 = true;
      $event.preventDefault();
      this$0.a1j_1($event);
      return Unit_instance;
    };
  }
  function DoubleTapHandler(element, onDoubleTap, doubleTapDelay, moveTolerance) {
    doubleTapDelay = doubleTapDelay === VOID ? 300 : doubleTapDelay;
    moveTolerance = moveTolerance === VOID ? 10 : moveTolerance;
    this.s1i_1 = element;
    this.t1i_1 = onDoubleTap;
    this.u1i_1 = doubleTapDelay;
    this.v1i_1 = moveTolerance;
    this.w1i_1 = 0.0;
    this.x1i_1 = 0;
    this.y1i_1 = 0;
    setupListeners(this);
  }
  function LongPressHandler(element, onLongPress, longPressDelay, moveTolerance) {
    longPressDelay = longPressDelay === VOID ? 700 : longPressDelay;
    moveTolerance = moveTolerance === VOID ? 10 : moveTolerance;
    this.z1i_1 = element;
    this.a1j_1 = onLongPress;
    this.b1j_1 = longPressDelay;
    this.c1j_1 = moveTolerance;
    this.d1j_1 = null;
    this.e1j_1 = 0;
    this.f1j_1 = 0;
    this.g1j_1 = false;
    setupListeners_0(this);
  }
  function ImageProcessor() {
    this.h1j_1 = 'assets://';
    this.i1j_1 = 'assets/';
  }
  protoOf(ImageProcessor).fq = function (src) {
    return replace(src, 'assets://', 'assets/');
  };
  var ImageProcessor_instance;
  function ImageProcessor_getInstance() {
    return ImageProcessor_instance;
  }
  function ListProcessor() {
  }
  protoOf(ListProcessor).zz = function () {
    return new H5ListView();
  };
  var ListProcessor_instance;
  function ListProcessor_getInstance() {
    return ListProcessor_instance;
  }
  function _get_measureElement__nr340d($this) {
    var tmp0 = $this.a1k_1;
    // Inline function 'kotlin.getValue' call
    measureElement$factory();
    return tmp0.a1();
  }
  function setMultiLineStyle($this, lines, ele) {
    if (lines > 0) {
      ele.style.display = '-webkit-box';
      // Inline function 'kotlin.js.asDynamic' call
      ele.style.webkitLineClamp = lines.toString();
      // Inline function 'kotlin.js.asDynamic' call
      ele.style.webkitBoxOrient = 'vertical';
      ele.style.whiteSpace = 'pre-wrap';
      ele.style.overflowY = 'hidden';
    } else {
      ele.style.display = 'inline-block';
      // Inline function 'kotlin.js.asDynamic' call
      ele.style.webkitLineClamp = '';
      // Inline function 'kotlin.js.asDynamic' call
      ele.style.webkitBoxOrient = '';
      ele.style.whiteSpace = 'pre-wrap';
      ele.style.overflowY = 'auto';
    }
  }
  function insertChild($this, parent, child, index) {
    if (parent.childElementCount === 0 || index >= parent.childElementCount) {
      parent.appendChild(child);
    } else {
      // Inline function 'org.w3c.dom.get' call
      // Inline function 'kotlin.js.asDynamic' call
      var beforeChild = parent.children[index];
      var insertIndex = indexOfChild(beforeChild);
      if (insertIndex >= 0) {
        // Inline function 'org.w3c.dom.get' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp$ret$3 = parent.childNodes[insertIndex];
        parent.insertBefore(child, tmp$ret$3);
      } else {
        parent.appendChild(child);
      }
    }
  }
  function calculateRenderViewSizeByDom($this, constraintSize, view, renderText) {
    var ele = view.mn();
    var originParent = ele.parentElement;
    var index = indexOfChild(ele);
    var newEle = _get_measureElement__nr340d($this);
    if (view.uu()) {
      newEle = ele;
    } else {
      newEle.style.cssText = ele.style.cssText;
      var tmp = newEle;
      // Inline function 'kotlin.text.ifEmpty' call
      var tmp_0;
      // Inline function 'kotlin.text.isEmpty' call
      if (charSequenceLength(renderText) === 0) {
        tmp_0 = ele.innerText;
      } else {
        tmp_0 = renderText;
      }
      tmp.innerText = tmp_0;
    }
    newEle.style.width = '';
    newEle.style.height = '';
    if (get_width(constraintSize) > 0) {
      newEle.style.maxWidth = toPxF(get_width(constraintSize));
    }
    newEle.style.whiteSpace = 'pre-wrap';
    if (view.os_1 > 0) {
      setMultiLineStyle($this, view.os_1, ele);
    }
    var tmp0_safe_receiver = kuiklyDocument.body;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.appendChild(newEle);
    var w = newEle.offsetWidth;
    var h = newEle.offsetHeight;
    if (view.os_1 > 0) {
      var tmp_1;
      if (!(newEle.style.lineHeight === '')) {
        tmp_1 = pxToFloat(newEle.style.lineHeight);
      } else {
        tmp_1 = FontSizeToLineHeightMap_getInstance().t1c(pxToFloat(newEle.style.fontSize));
      }
      var singleLineHeight = tmp_1;
      var expectHeight = singleLineHeight * view.os_1;
      if (expectHeight - h > singleLineHeight / 2) {
        setMultiLineStyle($this, 0, ele);
        w = newEle.offsetWidth;
        h = newEle.offsetHeight;
      }
    }
    var tmp1_safe_receiver = kuiklyDocument.body;
    if (tmp1_safe_receiver == null)
      null;
    else
      tmp1_safe_receiver.removeChild(newEle);
    Log_instance.ni(['calculate size by dom, size: ', w, h]);
    var realWidth = w < get_width(constraintSize) ? w + 0.5 : get_width(constraintSize);
    var realHeight = h;
    if (!(index === -1) && !(originParent == null)) {
      insertChild($this, originParent, newEle, index);
    }
    Log_instance.ni(['real size by dom, size:', realWidth, realHeight]);
    return new Pair(realWidth, realHeight);
  }
  function getCanvasContext($this) {
    if ($this.j1j_1 == null) {
      var tmp = kuiklyDocument.createElement('canvas');
      var canvas = tmp instanceof HTMLCanvasElement ? tmp : THROW_CCE();
      var tmp_0 = $this;
      var tmp_1 = canvas.getContext('2d');
      tmp_0.j1j_1 = tmp_1 instanceof CanvasRenderingContext2D ? tmp_1 : THROW_CCE();
    }
    return $this.j1j_1;
  }
  function getDefaultFontFamily($this) {
    if ($this.k1j_1 === '') {
      var tmp = $this;
      var tmp0_safe_receiver = kuiklyDocument.documentElement;
      var tmp_0;
      if (tmp0_safe_receiver == null) {
        tmp_0 = null;
      } else {
        // Inline function 'kotlin.let' call
        tmp_0 = kuiklyWindow.getComputedStyle(tmp0_safe_receiver).fontFamily;
      }
      var tmp1_elvis_lhs = tmp_0;
      tmp.k1j_1 = tmp1_elvis_lhs == null ? '' : tmp1_elvis_lhs;
    }
    return $this.k1j_1;
  }
  function calculateRenderViewSizeByCanvas($this, constraintSize, view, renderText) {
    if (!$this.l1j_1) {
      return calculateRenderViewSizeByDom($this, constraintSize, view, renderText);
    }
    var ele = view.mn();
    var style = view.mn().style;
    style.whiteSpace = 'pre-wrap';
    var canvasCtx = getCanvasContext($this);
    var defaultFont = getDefaultFontFamily($this);
    var fontWeight = ele.style.fontWeight;
    var fontSize = ele.style.fontSize;
    var fontFamily = ele.style.fontFamily;
    var lineHeight = ele.style.lineHeight;
    if (fontFamily === '') {
      fontFamily = defaultFont;
    }
    var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
    if (canvasCtx == null)
      null;
    else {
      canvasCtx.font = font;
    }
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var textArray = renderText.split('\n');
    var maxWidth = {_v: 0.0};
    var lines = {_v: 0.0};
    var totalHeight = {_v: 0.0};
    textArray.forEach(RichTextProcessor$calculateRenderViewSizeByCanvas$lambda(canvasCtx, lines, maxWidth, totalHeight));
    if (!$this.l1j_1) {
      return calculateRenderViewSizeByDom($this, constraintSize, view, renderText);
    }
    style.width = '';
    style.height = '';
    if (get_width(constraintSize) > 0) {
      style.maxWidth = toPxF(get_width(constraintSize));
    }
    Log_instance.ni(['canvas measure size: ', ele.innerText, maxWidth._v, totalHeight._v, get_width(constraintSize)]);
    var realWidth;
    var realHeight;
    if (maxWidth._v < get_width(constraintSize) || get_width(constraintSize) === 0.0) {
      realWidth = maxWidth._v + 0.5;
      var tmp;
      if (!(lineHeight === '')) {
        tmp = pxToFloat(lineHeight) * lines._v;
      } else {
        tmp = totalHeight._v;
      }
      realHeight = tmp;
      Log_instance.ni(['canvas real size: ', realWidth, realHeight]);
      return new Pair(realWidth, realHeight);
    } else {
      return calculateRenderViewSizeByDom($this, constraintSize, view, renderText);
    }
  }
  function createSpan($this, value, view) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var span = kuiklyDocument.createElement('span');
    var tmp0_elvis_lhs = view.yu(value);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return span;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var text = tmp;
    span.innerText = text;
    var style = span.style;
    var color = value.zu('color', '');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(color) > 0) {
      style.color = toRgbColor(color);
    }
    var fontSize = value.b19('fontSize', 0.0);
    if (!(fontSize === 0.0)) {
      style.fontSize = toPxF(fontSize);
    }
    var fontFamily = value.ho('fontFamily');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(fontFamily) > 0) {
      style.fontFamily = fontFamily;
    }
    var fontWeight = value.ho('fontWeight');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(fontWeight) > 0) {
      style.fontWeight = fontWeight;
    }
    var fontStyle = value.ho('fontStyle');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(fontStyle) > 0) {
      style.fontStyle = fontStyle;
    }
    var fontVariant = value.ho('fontVariant');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(fontVariant) > 0) {
      style.fontVariant = fontVariant;
    }
    var strokeColor = toRgbColor(value.ho('strokeColor'));
    var strokeWidth = value.b19('strokeWidth', 0.0);
    if (!(strokeWidth === 0.0)) {
      var usedStrokeWidth = strokeWidth / 4;
      // Inline function 'kotlin.js.asDynamic' call
      style.webkitTextStroke = '' + usedStrokeWidth + 'px ' + strokeColor;
    }
    var lineSpacing = value.b19('letterSpacing', -1.0);
    if (!(lineSpacing === -1.0)) {
      style.lineHeight = toNumberFloat(lineSpacing).toString();
    }
    var lineHeight = value.b19('lineHeight', -1.0);
    if (!(lineHeight === -1.0)) {
      style.lineHeight = toPxF(toNumberFloat(lineHeight));
    }
    var textShadow = value.ho('textShadow');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(textShadow) > 0) {
      // Inline function 'kotlin.js.asDynamic' call
      var textShadowSpilt = textShadow.split(' ');
      var offsetX = '' + textShadowSpilt[0] + 'px';
      var offsetY = '' + textShadowSpilt[1] + 'px';
      var radius = '' + textShadowSpilt[2] + 'px';
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$10 = textShadowSpilt[3];
      var shadowColor = toRgbColor(tmp$ret$10);
      style.textShadow = offsetX + ' ' + offsetY + ' ' + radius + ' ' + shadowColor;
    }
    var textDecoration = value.ho('textDecoration');
    // Inline function 'kotlin.text.isNotEmpty' call
    if (charSequenceLength(textDecoration) > 0) {
      style.textDecoration = textDecoration;
    }
    var textIndent = value.b19('headIndent', 0.0);
    if (!(textIndent === 0.0)) {
      style.textIndent = toPxF(textIndent);
    }
    var placeHolderWidth = value.b19('placeholderWidth', 0.0);
    var placeHolderHeight = value.b19('placeholderHeight', 0.0);
    if (!(placeHolderWidth === 0.0) && !(placeHolderHeight === 0.0)) {
      style.width = toPxF(placeHolderWidth);
      style.height = toPxF(placeHolderHeight);
      style.display = 'inline-block';
      style.verticalAlign = 'middle';
    }
    return span;
  }
  function RichTextProcessor$measureElement$delegate$lambda() {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.apply' call
    var this_0 = kuiklyDocument.createElement('p');
    this_0.style.display = 'inline-block';
    // Inline function 'kotlin.js.asDynamic' call
    this_0.style.webkitLineClamp = '';
    // Inline function 'kotlin.js.asDynamic' call
    this_0.style.webkitBoxOrient = '';
    this_0.style.whiteSpace = 'pre-wrap';
    this_0.style.overflowY = 'auto';
    return this_0;
  }
  function RichTextProcessor$calculateRenderViewSizeByCanvas$lambda($canvasCtx, $lines, $maxWidth, $totalHeight) {
    return function (line) {
      var tmp0_safe_receiver = $canvasCtx;
      var metrics = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.measureText(line);
      var tmp;
      if (metrics == null) {
        RichTextProcessor_getInstance().l1j_1 = false;
        return Unit_instance;
      }
      var tmp_0;
      if (!(typeof metrics.fontBoundingBoxAscent === 'number')) {
        RichTextProcessor_getInstance().l1j_1 = false;
        return Unit_instance;
      }
      $lines._v = $lines._v + 1;
      var tmp0 = $maxWidth._v;
      // Inline function 'kotlin.math.max' call
      var b = metrics.width;
      var tmp$ret$0 = Math.max(tmp0, b);
      $maxWidth._v = tmp$ret$0;
      $totalHeight._v = $totalHeight._v + (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent);
      return Unit_instance;
    };
  }
  function RichTextProcessor() {
    RichTextProcessor_instance = this;
    this.j1j_1 = null;
    this.k1j_1 = '';
    this.l1j_1 = true;
    this.m1j_1 = 'placeholderWidth';
    this.n1j_1 = 'placeholderHeight';
    this.o1j_1 = 'color';
    this.p1j_1 = 'fontSize';
    this.q1j_1 = 'textDecoration';
    this.r1j_1 = 'fontWeight';
    this.s1j_1 = 'fontStyle';
    this.t1j_1 = 'fontFamily';
    this.u1j_1 = 'letterSpacing';
    this.v1j_1 = 'strokeWidth';
    this.w1j_1 = 'strokeColor';
    this.x1j_1 = 'fontVariant';
    this.y1j_1 = 'headIndent';
    this.z1j_1 = 'lineHeight';
    var tmp = this;
    tmp.a1k_1 = lazy(RichTextProcessor$measureElement$delegate$lambda);
  }
  protoOf(RichTextProcessor).wu = function (constraintSize, view, renderText) {
    var tmp;
    if (view.mn().children.length > 0) {
      tmp = calculateRenderViewSizeByDom(this, constraintSize, view, renderText);
    } else {
      tmp = calculateRenderViewSizeByCanvas(this, constraintSize, view, renderText);
    }
    return tmp;
  };
  protoOf(RichTextProcessor).ru = function (richTextValues, view) {
    var inductionVariable = 0;
    var last = richTextValues.ko();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = view.mn();
        var tmp0_elvis_lhs = richTextValues.m18(i);
        tmp.appendChild(createSpan(this, tmp0_elvis_lhs == null ? JSONObject_init_$Create$_0() : tmp0_elvis_lhs, view));
      }
       while (inductionVariable < last);
  };
  var RichTextProcessor_instance;
  function RichTextProcessor_getInstance() {
    if (RichTextProcessor_instance == null)
      new RichTextProcessor();
    return RichTextProcessor_instance;
  }
  function measureElement$factory() {
    return getPropertyCallableRef('measureElement', 1, KProperty1, function (receiver) {
      return _get_measureElement__nr340d(receiver);
    }, null);
  }
  //region block: init
  Companion_instance = new Companion();
  Companion_instance_0 = new Companion_0();
  AnimationProcessor_instance = new AnimationProcessor();
  Companion_instance_2 = new Companion_2();
  EventProcessor_instance = new EventProcessor();
  ImageProcessor_instance = new ImageProcessor();
  ListProcessor_instance = new ListProcessor();
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = KuiklyRenderViewDelegator;
  //endregion
  return _;
}));



/***/ }),

/***/ "./kotlin/KuiklyUISecond-desktop-render-layer.js":
/*!*******************************************************!*\
  !*** ./kotlin/KuiklyUISecond-desktop-render-layer.js ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
  if (true)
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./kotlin-kotlin-stdlib.js */ "./kotlin/kotlin-kotlin-stdlib.js"), __webpack_require__(/*! ./KuiklyCore-render-web-base.js */ "./kotlin/KuiklyCore-render-web-base.js"), __webpack_require__(/*! ./KuiklyCore-render-web-h5.js */ "./kotlin/KuiklyCore-render-web-h5.js"), __webpack_require__(/*! ./KuiklyCore-core.js */ "./kotlin/KuiklyCore-core.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  else {}
}(function (_, kotlin_kotlin, kotlin_com_tencent_kuikly_open_core_render_web_base, kotlin_com_tencent_kuikly_open_core_render_web_h5, kotlin_com_tencent_kuikly_open_core) {
  'use strict';
  //region block: imports
  var protoOf = kotlin_kotlin.$_$.o2;
  var initMetadataForClass = kotlin_kotlin.$_$.z1;
  var KuiklyRenderView = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.q1;
  var KuiklyRenderCoreExecuteMode = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.a;
  var Unit_instance = kotlin_kotlin.$_$.u;
  var VOID = kotlin_kotlin.$_$.b;
  var KuiklyRenderViewDelegator = kotlin_com_tencent_kuikly_open_core_render_web_h5.$_$.a;
  var toString = kotlin_kotlin.$_$.p2;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.f;
  var iterator = kotlin_kotlin.$_$.h2;
  var THROW_CCE = kotlin_kotlin.$_$.s3;
  var Exception = kotlin_kotlin.$_$.o3;
  var KtMap = kotlin_kotlin.$_$.a1;
  var isInterface = kotlin_kotlin.$_$.f2;
  var Pair = kotlin_kotlin.$_$.r3;
  var replace = kotlin_kotlin.$_$.z2;
  var to = kotlin_kotlin.$_$.b4;
  var mapOf = kotlin_kotlin.$_$.l1;
  var toString_0 = kotlin_kotlin.$_$.a4;
  var onPageLoadComplete$default = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.s1;
  var printStackTrace = kotlin_kotlin.$_$.y3;
  var registerExternalModule = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.f1;
  var registerViewExternalPropHandler = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.g1;
  var coreExecuteMode = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.b1;
  var performanceMonitorTypes = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.e1;
  var syncRenderingWhenPageAppear = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.h1;
  var onGetLaunchData = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.c1;
  var onGetPerformanceData = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.d1;
  var KuiklyRenderViewDelegatorDelegate = kotlin_com_tencent_kuikly_open_core_render_web_base.$_$.i1;
  var toInt = kotlin_kotlin.$_$.e3;
  //endregion
  //region block: pre-declaration
  initMetadataForClass(LifeCycleCallbakc, 'LifeCycleCallbakc', LifeCycleCallbakc);
  initMetadataForClass(DesktopRenderLayerAPI, 'DesktopRenderLayerAPI', DesktopRenderLayerAPI);
  initMetadataForClass(DesktopRenderViewDelegator$init$1, VOID, VOID, LifeCycleCallbakc);
  initMetadataForClass(DesktopRenderViewDelegator, 'DesktopRenderViewDelegator', DesktopRenderViewDelegator, VOID, [KuiklyRenderViewDelegatorDelegate]);
  //endregion
  function LifeCycleCallbakc() {
  }
  protoOf(LifeCycleCallbakc).zf = function () {
  };
  protoOf(LifeCycleCallbakc).ag = function () {
  };
  protoOf(LifeCycleCallbakc).bg = function () {
  };
  protoOf(LifeCycleCallbakc).cg = function () {
  };
  protoOf(LifeCycleCallbakc).dg = function () {
  };
  protoOf(LifeCycleCallbakc).eg = function () {
  };
  protoOf(LifeCycleCallbakc).xf = function () {
  };
  protoOf(LifeCycleCallbakc).yf = function () {
  };
  protoOf(LifeCycleCallbakc).fg = function () {
  };
  protoOf(LifeCycleCallbakc).gg = function () {
  };
  protoOf(LifeCycleCallbakc).hg = function () {
  };
  protoOf(LifeCycleCallbakc).ig = function () {
  };
  function initDesktopRenderLayer() {
    main();
  }
  function createRenderViewDelegator() {
    return new DesktopRenderViewDelegator();
  }
  function getKuiklyRenderViewClass() {
    return KuiklyRenderView;
  }
  function getKuiklyRenderCoreExecuteModeClass() {
    return KuiklyRenderCoreExecuteMode;
  }
  function DesktopRenderLayerAPI() {
  }
  protoOf(DesktopRenderLayerAPI).createRenderViewDelegator = function () {
    return new DesktopRenderViewDelegator();
  };
  protoOf(DesktopRenderLayerAPI).getKuiklyRenderViewClass = function () {
    return KuiklyRenderView;
  };
  protoOf(DesktopRenderLayerAPI).getKuiklyRenderCoreExecuteModeClass = function () {
    return KuiklyRenderCoreExecuteMode;
  };
  function DesktopRenderViewDelegator$init$1() {
    LifeCycleCallbakc.call(this);
  }
  protoOf(DesktopRenderViewDelegator$init$1).fg = function () {
    var onFirstFramePaintEvent = new CustomEvent('onFirstFramePaint');
    window.dispatchEvent(onFirstFramePaintEvent);
  };
  function DesktopRenderViewDelegator() {
    this.delegator = new KuiklyRenderViewDelegator(this);
  }
  protoOf(DesktopRenderViewDelegator).b1k = function () {
    return this.delegator;
  };
  protoOf(DesktopRenderViewDelegator).init = function (container, pageName, pageData, size) {
    console.log('[Desktop Render Layer] \u521D\u59CB\u5316\u6E32\u67D3\u89C6\u56FE: container=' + toString(container) + ', pageName=' + pageName);
    var tmp;
    if (isInterface(pageData, KtMap)) {
      tmp = isInterface(pageData, KtMap) ? pageData : THROW_CCE();
    } else {
      // Inline function 'kotlin.collections.mutableMapOf' call
      var newMap = LinkedHashMap_init_$Create$();
      if (!(pageData == null)) {
        try {
          // Inline function 'kotlin.js.asDynamic' call
          var jsObject = pageData;
          var _iterator__ex2g4s = iterator(Object.keys(jsObject));
          while (_iterator__ex2g4s.g()) {
            var key = _iterator__ex2g4s.h();
            var keyStr = (!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE();
            // Inline function 'kotlin.collections.set' call
            var value = jsObject[keyStr];
            newMap.k2(keyStr, value);
          }
        } catch ($p) {
          if ($p instanceof Exception) {
            var e = $p;
            console.warn('[Desktop Render Layer] \u65E0\u6CD5\u8F6C\u6362 pageData: ' + e.message);
          } else {
            throw $p;
          }
        }
      }
      tmp = newMap;
    }
    var kotlinPageData = tmp;
    console.log('[Desktop Render Layer] \u8F6C\u6362\u540E\u7684 pageData: ' + toString(kotlinPageData));
    var tmp_0;
    try {
      // Inline function 'kotlin.js.asDynamic' call
      var dynamicSize = size;
      var tmp_1;
      var tmp_2 = Array.isArray(dynamicSize);
      if ((!(tmp_2 == null) ? typeof tmp_2 === 'boolean' : false) ? tmp_2 : THROW_CCE()) {
        console.log('[Desktop Render Layer] size \u662F\u6570\u7EC4\uFF0C\u8F6C\u6362\u4E3A SizeI');
        var tmp_3 = dynamicSize[0];
        var tmp_4 = (!(tmp_3 == null) ? typeof tmp_3 === 'number' : false) ? tmp_3 : THROW_CCE();
        var tmp_5 = dynamicSize[1];
        tmp_1 = new Pair(tmp_4, (!(tmp_5 == null) ? typeof tmp_5 === 'number' : false) ? tmp_5 : THROW_CCE());
      } else {
        if (dynamicSize.width != undefined && dynamicSize.height != undefined) {
          console.log('[Desktop Render Layer] size \u6709 width/height \u5C5E\u6027');
          var tmp_6 = dynamicSize.width;
          var tmp_7 = (!(tmp_6 == null) ? typeof tmp_6 === 'number' : false) ? tmp_6 : THROW_CCE();
          var tmp_8 = dynamicSize.height;
          tmp_1 = new Pair(tmp_7, (!(tmp_8 == null) ? typeof tmp_8 === 'number' : false) ? tmp_8 : THROW_CCE());
        } else {
          console.warn('[Desktop Render Layer] \u65E0\u6CD5\u8BC6\u522B\u7684 size \u683C\u5F0F\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u503C');
          tmp_1 = new Pair(window.innerWidth, window.innerHeight);
        }
      }
      tmp_0 = tmp_1;
    } catch ($p) {
      var tmp_9;
      if ($p instanceof Exception) {
        var e_0 = $p;
        console.error('[Desktop Render Layer] \u8F6C\u6362 size \u5931\u8D25: ' + e_0.message);
        tmp_9 = new Pair(window.innerWidth, window.innerHeight);
      } else {
        throw $p;
      }
      tmp_0 = tmp_9;
    }
    var kotlinSize = tmp_0;
    console.log('[Desktop Render Layer] \u8F6C\u6362\u540E\u7684 size: ' + kotlinSize.toString());
    this.delegator.l1d(container, pageName, kotlinPageData, kotlinSize);
    this.delegator.n1d(new DesktopRenderViewDelegator$init$1());
  };
  protoOf(DesktopRenderViewDelegator).resume = function () {
    console.log('[Desktop Render Layer] \u9875\u9762\u663E\u793A');
    this.delegator.gg();
  };
  protoOf(DesktopRenderViewDelegator).pause = function () {
    console.log('[Desktop Render Layer] \u9875\u9762\u9690\u85CF');
    this.delegator.hg();
  };
  protoOf(DesktopRenderViewDelegator).detach = function () {
    console.log('[Desktop Render Layer] \u9875\u9762\u9500\u6BC1');
    this.delegator.m1d();
  };
  protoOf(DesktopRenderViewDelegator).sendEvent = function (event, data) {
    console.log('[Desktop Render Layer] \u53D1\u9001\u4E8B\u4EF6: ' + event + ', data: ' + toString(data));
    this.delegator.og(event, data);
  };
  protoOf(DesktopRenderViewDelegator).refresh = function () {
    console.log('[Desktop Render Layer] \u5237\u65B0\u8C03\u7528');
    var tmp = Math.random();
    var randomValue = (!(tmp == null) ? typeof tmp === 'number' : false) ? tmp : THROW_CCE();
    var randomKey = 'refresh_' + replace(randomValue.toString(), '.', '');
    var kotlinData = mapOf([to('refreshKey', randomKey), to('forceRefresh', true), to('randomValue', randomValue)]);
    console.log('[Desktop Render Layer] \u4F7F\u7528\u968F\u673A\u5237\u65B0\u6570\u636E: ' + toString(kotlinData));
    this.sendEvent('refresh', kotlinData);
  };
  protoOf(DesktopRenderViewDelegator).xm = function () {
    console.log('[Desktop Render Layer] KuiklyRenderView \u5DF2\u521B\u5EFA');
  };
  protoOf(DesktopRenderViewDelegator).ym = function () {
    console.log('[Desktop Render Layer] KuiklyRenderView \u5185\u5BB9\u89C6\u56FE\u5DF2\u521B\u5EFA');
  };
  protoOf(DesktopRenderViewDelegator).cn = function (isSucceed, errorReason, executeMode) {
    console.log('[Desktop Render Layer] \u9875\u9762\u52A0\u8F7D\u5B8C\u6210: succeed=' + isSucceed + ', mode=' + executeMode.toString());
    if (!isSucceed && !(errorReason == null)) {
      console.error('[Desktop Render Layer] \u9875\u9762\u52A0\u8F7D\u5931\u8D25: ' + toString_0(errorReason));
    }
  };
  protoOf(DesktopRenderViewDelegator).c1k = function (throwable, errorReason, executeMode) {
    console.error('[Desktop Render Layer] \u672A\u5904\u7406\u5F02\u5E38: ' + throwable.message + ', reason: ' + errorReason.toString() + ', mode: ' + executeMode.toString());
    printStackTrace(throwable);
  };
  protoOf(DesktopRenderViewDelegator).sm = function (kuiklyRenderExport) {
    console.log('[Desktop Render Layer] \u2705 registerExternalRenderView \u88AB\u8C03\u7528');
    console.log('[Desktop Render Layer] \uD83D\uDCCB h5 \u7684 KuiklyRenderViewDelegator \u5DF2\u7ECF\u6CE8\u518C\u4E86\u6240\u6709\u5185\u7F6E\u89C6\u56FE');
    console.log('[Desktop Render Layer] \uD83D\uDCCB \u5982\u679C\u9700\u8981\u81EA\u5B9A\u4E49\u89C6\u56FE\uFF0C\u5728\u8FD9\u91CC\u6CE8\u518C');
  };
  function main() {
    console.log('##### Desktop Render Layer #####');
    initGlobalObject();
    var api = new DesktopRenderLayerAPI();
    // Inline function 'kotlin.js.asDynamic' call
    window.DesktopRenderLayer = api;
    // Inline function 'kotlin.js.asDynamic' call
    window.createRenderViewDelegator = main$lambda(api);
    // Inline function 'kotlin.js.asDynamic' call
    window.getKuiklyRenderViewClass = main$lambda_0(api);
    // Inline function 'kotlin.js.asDynamic' call
    window.getKuiklyRenderCoreExecuteModeClass = main$lambda_1(api);
    console.log('DesktopRenderLayer API \u5DF2\u5BFC\u51FA');
    console.log('createRenderViewDelegator \u65B9\u6CD5\u7C7B\u578B:', typeof window.createRenderViewDelegator);
  }
  function initGlobalObject() {
    // Inline function 'kotlin.js.asDynamic' call
    window.kuiklyWindow = window;
    // Inline function 'kotlin.js.asDynamic' call
    window.kuiklyDocument = document;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$2 = window;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_elvis_lhs = window.com;
    tmp$ret$2.com = tmp0_elvis_lhs == null ? {} : tmp0_elvis_lhs;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$4 = window;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp1_elvis_lhs = window.com.tencent;
    tmp$ret$4.com.tencent = tmp1_elvis_lhs == null ? {} : tmp1_elvis_lhs;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$6 = window;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp2_elvis_lhs = window.com.tencent.kuikly;
    tmp$ret$6.com.tencent.kuikly = tmp2_elvis_lhs == null ? {} : tmp2_elvis_lhs;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$8 = window;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp3_elvis_lhs = window.com.tencent.kuikly.core;
    tmp$ret$8.com.tencent.kuikly.core = tmp3_elvis_lhs == null ? {} : tmp3_elvis_lhs;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$10 = window;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp4_elvis_lhs = window.com.tencent.kuikly.core.nvi;
    tmp$ret$10.com.tencent.kuikly.core.nvi = tmp4_elvis_lhs == null ? {} : tmp4_elvis_lhs;
    // Inline function 'kotlin.js.asDynamic' call
    window.callKotlinMethod = initGlobalObject$lambda;
    // Inline function 'kotlin.js.asDynamic' call
    window.callNative = initGlobalObject$lambda_0;
    // Inline function 'kotlin.js.asDynamic' call
    window.com.tencent.kuikly.core.nvi.registerCallNative = initGlobalObject$lambda_1;
    console.log('[Desktop Render Layer] \u5168\u5C40\u5BF9\u8C61\u521D\u59CB\u5316\u5B8C\u6210');
  }
  function initGlobalObject$isSyncMethodCall(methodId, arg5) {
    if (methodId === 8) {
      var tmp;
      if (!(arg5 == null)) {
        var tmp_0;
        try {
          tmp_0 = toInt(toString(arg5));
        } catch ($p) {
          var tmp_1;
          if ($p instanceof Exception) {
            var e = $p;
            tmp_1 = 0;
          } else {
            throw $p;
          }
          tmp_0 = tmp_1;
        }
        tmp = tmp_0;
      } else {
        tmp = 0;
      }
      var fifthArg = tmp;
      return fifthArg === 1;
    }
    switch (methodId) {
      case 6:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        return true;
      default:
        return methodId === 14;
    }
  }
  function main$lambda($api) {
    return function () {
      return $api.createRenderViewDelegator();
    };
  }
  function main$lambda_0($api) {
    return function () {
      return $api.getKuiklyRenderViewClass();
    };
  }
  function main$lambda_1($api) {
    return function () {
      return $api.getKuiklyRenderCoreExecuteModeClass();
    };
  }
  function initGlobalObject$lambda(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
    // Inline function 'kotlin.js.asDynamic' call
    if (window.cefQuery) {
      var requestObj = {};
      requestObj.asDynamic().type = 'callKotlinMethod';
      requestObj.asDynamic().methodId = methodId;
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$3 = [arg0, arg1, arg2, arg3, arg4, arg5];
      requestObj.asDynamic().args = tmp$ret$3;
      var request = JSON.stringify(requestObj);
      var cefQueryObj = {};
      cefQueryObj.asDynamic().request = request;
      cefQueryObj.asDynamic().onSuccess = initGlobalObject$lambda$lambda;
      cefQueryObj.asDynamic().onFailure = initGlobalObject$lambda$lambda_0;
      // Inline function 'kotlin.js.asDynamic' call
      window.cefQuery(cefQueryObj);
    } else {
      console.warn('[Desktop Render Layer] cefQuery \u4E0D\u53EF\u7528');
    }
    return 'OK';
  }
  function initGlobalObject$lambda$lambda(response) {
    console.log('[Desktop Render Layer] callKotlinMethod \u6210\u529F: ' + toString_0(response));
    return Unit_instance;
  }
  function initGlobalObject$lambda$lambda_0(errorCode, errorMessage) {
    console.error('[Desktop Render Layer] callKotlinMethod \u5931\u8D25: ' + errorMessage);
    return Unit_instance;
  }
  function initGlobalObject$lambda_0(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
    var methodName;
    switch (methodId) {
      case 1:
        methodName = 'CREATE_RENDER_VIEW';
        break;
      case 2:
        methodName = 'REMOVE_RENDER_VIEW';
        break;
      case 3:
        methodName = 'INSERT_SUB_RENDER_VIEW';
        break;
      case 4:
        methodName = 'SET_VIEW_PROP';
        break;
      case 5:
        methodName = 'SET_RENDER_VIEW_FRAME';
        break;
      case 6:
        methodName = 'CALCULATE_RENDER_VIEW_SIZE';
        break;
      case 7:
        methodName = 'CALL_VIEW_METHOD';
        break;
      case 8:
        methodName = 'CALL_MODULE_METHOD';
        break;
      case 9:
        methodName = 'CREATE_SHADOW';
        break;
      case 10:
        methodName = 'REMOVE_SHADOW';
        break;
      case 11:
        methodName = 'SET_SHADOW_PROP';
        break;
      case 12:
        methodName = 'SET_SHADOW_FOR_VIEW';
        break;
      case 13:
        methodName = 'SET_TIMEOUT';
        break;
      case 14:
        methodName = 'CALL_SHADOW_METHOD';
        break;
      case 15:
        methodName = 'FIRE_FATAL_EXCEPTION';
        break;
      case 16:
        methodName = 'SYNC_FLUSH_UI';
        break;
      case 17:
        methodName = 'CALL_TDF_MODULE_METHOD';
        break;
      default:
        methodName = 'UNKNOWN_METHOD_' + methodId;
        break;
    }
    var isSyncCall = initGlobalObject$isSyncMethodCall(methodId, arg5);
    var tmp;
    try {
      // Inline function 'kotlin.js.asDynamic' call
      var renderView = window.desktopRenderView;
      var tmp_0;
      if (renderView && renderView.asDynamic().delegator) {
        var delegator = renderView.asDynamic().delegator;
        var tmp_1;
        if (delegator.asDynamic().callNative) {
          var result = delegator.asDynamic().callNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5);
          var tmp_2;
          if (isSyncCall) {
            tmp_2 = result == null ? '' : result;
          } else {
            tmp_2 = null;
          }
          tmp_1 = tmp_2;
        } else {
          console.warn('[Desktop Render Layer] delegator.callNative \u65B9\u6CD5\u4E0D\u5B58\u5728');
          tmp_1 = isSyncCall ? '' : null;
        }
        tmp_0 = tmp_1;
      } else {
        console.warn('[Desktop Render Layer] \u672A\u627E\u5230\u6D3B\u8DC3\u7684 renderView \u6216 delegator');
        tmp_0 = isSyncCall ? '' : null;
      }
      tmp = tmp_0;
    } catch ($p) {
      var tmp_3;
      if ($p instanceof Exception) {
        var e = $p;
        console.error('[Desktop Render Layer] callNative \u8C03\u7528\u5931\u8D25: ' + e.message);
        tmp_3 = isSyncCall ? '' : null;
      } else {
        throw $p;
      }
      tmp = tmp_3;
    }
    return tmp;
  }
  function initGlobalObject$lambda_1(pagerId, callback) {
    console.log('[Desktop Render Layer] \u6CE8\u518C callNative \u56DE\u8C03: pagerId=' + pagerId);
    return Unit_instance;
  }
  function mainWrapper() {
    main();
  }
  //region block: post-declaration
  protoOf(DesktopRenderViewDelegator).dn = onPageLoadComplete$default;
  protoOf(DesktopRenderViewDelegator).tm = registerExternalModule;
  protoOf(DesktopRenderViewDelegator).um = registerViewExternalPropHandler;
  protoOf(DesktopRenderViewDelegator).vm = coreExecuteMode;
  protoOf(DesktopRenderViewDelegator).wm = performanceMonitorTypes;
  protoOf(DesktopRenderViewDelegator).zm = syncRenderingWhenPageAppear;
  protoOf(DesktopRenderViewDelegator).an = onGetLaunchData;
  protoOf(DesktopRenderViewDelegator).bn = onGetPerformanceData;
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    _.initDesktopRenderLayer = initDesktopRenderLayer;
    _.createRenderViewDelegator = createRenderViewDelegator;
    _.getKuiklyRenderViewClass = getKuiklyRenderViewClass;
    _.getKuiklyRenderCoreExecuteModeClass = getKuiklyRenderCoreExecuteModeClass;
    _.DesktopRenderLayerAPI = DesktopRenderLayerAPI;
    _.DesktopRenderViewDelegator = DesktopRenderViewDelegator;
  }
  $jsExportAll$(_);
  kotlin_kotlin.$jsExportAll$(_);
  kotlin_com_tencent_kuikly_open_core.$jsExportAll$(_);
  //endregion
  mainWrapper();
  return _;
}));



/***/ }),

/***/ "./kotlin/kotlin-kotlin-stdlib.js":
/*!****************************************!*\
  !*** ./kotlin/kotlin-kotlin-stdlib.js ***!
  \****************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//region block: polyfills
(function () {
  if (typeof globalThis === 'object')
    return;
  Object.defineProperty(Object.prototype, '__magic__', {get: function () {
    return this;
  }, configurable: true});
  __magic__.globalThis = __magic__;
  delete Object.prototype.__magic__;
}());
if (typeof Math.imul === 'undefined') {
  Math.imul = function imul(a, b) {
    return (a & 4.29490176E9) * (b & 65535) + (a & 65535) * (b | 0) | 0;
  };
}
if (typeof ArrayBuffer.isView === 'undefined') {
  ArrayBuffer.isView = function (a) {
    return a != null && a.__proto__ != null && a.__proto__.__proto__ === Int8Array.prototype.__proto__;
  };
}
if (typeof Array.prototype.fill === 'undefined') {
  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
  Object.defineProperty(Array.prototype, 'fill', {value: function (value) {
    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this); // Steps 3-5.
    var len = O.length >>> 0; // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0; // Step 8.
    var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len); // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0; // Step 11.
    var finalValue = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len); // Step 12.
    while (k < finalValue) {
      O[k] = value;
      k++;
    }
    ; // Step 13.
    return O;
  }});
}
[Int8Array, Int16Array, Uint16Array, Int32Array, Float32Array, Float64Array].forEach(function (TypedArray) {
  if (typeof TypedArray.prototype.fill === 'undefined') {
    Object.defineProperty(TypedArray.prototype, 'fill', {value: Array.prototype.fill});
  }
});
if (typeof Math.clz32 === 'undefined') {
  Math.clz32 = function (log, LN2) {
    return function (x) {
      var asUint = x >>> 0;
      if (asUint === 0) {
        return 32;
      }
      return 31 - (log(asUint) / LN2 | 0) | 0; // the "| 0" acts like math.floor
    };
  }(Math.log, Math.LN2);
}
if (typeof String.prototype.startsWith === 'undefined') {
  Object.defineProperty(String.prototype, 'startsWith', {value: function (searchString, position) {
    position = position || 0;
    return this.lastIndexOf(searchString, position) === position;
  }});
}
if (typeof String.prototype.endsWith === 'undefined') {
  Object.defineProperty(String.prototype, 'endsWith', {value: function (searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }});
}
//endregion
(function (factory) {
  if (true)
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  else {}
}(function (_) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var isView = ArrayBuffer.isView;
  var clz32 = Math.clz32;
  //endregion
  //region block: pre-declaration
  initMetadataForInterface(CharSequence, 'CharSequence');
  initMetadataForClass(Number_0, 'Number');
  initMetadataForClass(asSequence$$inlined$Sequence$1);
  initMetadataForInterface(Iterable, 'Iterable');
  initMetadataForClass(asIterable$$inlined$Iterable$1, VOID, VOID, VOID, [Iterable]);
  initMetadataForClass(Char, 'Char');
  initMetadataForInterface(Collection, 'Collection', VOID, VOID, [Iterable]);
  initMetadataForInterface(KtList, 'List', VOID, VOID, [Collection]);
  initMetadataForInterface(Entry, 'Entry');
  initMetadataForCompanion(Companion);
  function asJsReadonlyMapView() {
    return createJsReadonlyMapViewFrom(this);
  }
  initMetadataForInterface(KtMap, 'Map');
  initMetadataForInterface(KtSet, 'Set', VOID, VOID, [Collection]);
  initMetadataForCompanion(Companion_0);
  initMetadataForClass(Enum, 'Enum');
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(Long, 'Long', VOID, Number_0);
  initMetadataForClass(arrayIterator$1);
  initMetadataForClass(JsMapView, 'JsMapView', JsMapView, Map);
  initMetadataForObject(Digit, 'Digit');
  initMetadataForObject(Unit, 'Unit');
  initMetadataForClass(AbstractCollection, 'AbstractCollection', VOID, VOID, [Collection]);
  initMetadataForClass(AbstractMutableCollection, 'AbstractMutableCollection', VOID, AbstractCollection, [AbstractCollection, Iterable, Collection]);
  initMetadataForClass(IteratorImpl, 'IteratorImpl');
  initMetadataForClass(ListIteratorImpl, 'ListIteratorImpl', VOID, IteratorImpl);
  initMetadataForClass(AbstractMutableList, 'AbstractMutableList', VOID, AbstractMutableCollection, [AbstractMutableCollection, Collection, KtList, Iterable]);
  initMetadataForClass(AbstractMap, 'AbstractMap', VOID, VOID, [KtMap]);
  initMetadataForClass(AbstractMutableMap, 'AbstractMutableMap', VOID, AbstractMap, [AbstractMap, KtMap]);
  initMetadataForClass(AbstractMutableSet, 'AbstractMutableSet', VOID, AbstractMutableCollection, [AbstractMutableCollection, Collection, KtSet, Iterable]);
  initMetadataForCompanion(Companion_2);
  initMetadataForClass(ArrayList, 'ArrayList', ArrayList_init_$Create$, AbstractMutableList, [AbstractMutableList, Collection, KtList, Iterable]);
  initMetadataForClass(HashMap, 'HashMap', HashMap_init_$Create$, AbstractMutableMap, [AbstractMutableMap, KtMap]);
  initMetadataForClass(HashMapKeys, 'HashMapKeys', VOID, AbstractMutableSet, [Collection, KtSet, Iterable, AbstractMutableSet]);
  initMetadataForClass(HashMapValues, 'HashMapValues', VOID, AbstractMutableCollection, [Iterable, Collection, AbstractMutableCollection]);
  initMetadataForClass(HashMapEntrySetBase, 'HashMapEntrySetBase', VOID, AbstractMutableSet, [Collection, KtSet, Iterable, AbstractMutableSet]);
  initMetadataForClass(HashMapEntrySet, 'HashMapEntrySet', VOID, HashMapEntrySetBase);
  initMetadataForClass(HashMapKeysDefault$iterator$1);
  initMetadataForClass(HashMapKeysDefault, 'HashMapKeysDefault', VOID, AbstractMutableSet);
  initMetadataForClass(HashMapValuesDefault$iterator$1);
  initMetadataForClass(HashMapValuesDefault, 'HashMapValuesDefault', VOID, AbstractMutableCollection);
  initMetadataForClass(HashSet, 'HashSet', HashSet_init_$Create$, AbstractMutableSet, [AbstractMutableSet, Collection, KtSet, Iterable]);
  initMetadataForCompanion(Companion_3);
  initMetadataForClass(Itr, 'Itr');
  initMetadataForClass(KeysItr, 'KeysItr', VOID, Itr);
  initMetadataForClass(ValuesItr, 'ValuesItr', VOID, Itr);
  initMetadataForClass(EntriesItr, 'EntriesItr', VOID, Itr);
  initMetadataForClass(EntryRef, 'EntryRef', VOID, VOID, [Entry]);
  function containsAllEntries(m) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(m, Collection)) {
        tmp = m.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var _iterator__ex2g4s = m.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var entry = element;
        var tmp_0;
        if (!(entry == null) ? isInterface(entry, Entry) : false) {
          tmp_0 = this.s6(entry);
        } else {
          tmp_0 = false;
        }
        if (!tmp_0) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  }
  initMetadataForInterface(InternalMap, 'InternalMap');
  initMetadataForClass(InternalHashMap, 'InternalHashMap', InternalHashMap_init_$Create$, VOID, [InternalMap]);
  initMetadataForObject(EmptyHolder, 'EmptyHolder');
  initMetadataForClass(LinkedHashMap, 'LinkedHashMap', LinkedHashMap_init_$Create$, HashMap, [HashMap, KtMap]);
  initMetadataForClass(LinkedHashSet, 'LinkedHashSet', LinkedHashSet_init_$Create$, HashSet, [HashSet, Collection, KtSet, Iterable]);
  initMetadataForClass(Exception, 'Exception', Exception_init_$Create$, Error);
  initMetadataForClass(RuntimeException, 'RuntimeException', RuntimeException_init_$Create$, Exception);
  initMetadataForClass(IllegalArgumentException, 'IllegalArgumentException', IllegalArgumentException_init_$Create$, RuntimeException);
  initMetadataForClass(IllegalStateException, 'IllegalStateException', IllegalStateException_init_$Create$, RuntimeException);
  initMetadataForClass(UnsupportedOperationException, 'UnsupportedOperationException', UnsupportedOperationException_init_$Create$, RuntimeException);
  initMetadataForClass(NoSuchElementException, 'NoSuchElementException', NoSuchElementException_init_$Create$, RuntimeException);
  initMetadataForClass(Error_0, 'Error', Error_init_$Create$, Error);
  initMetadataForClass(IndexOutOfBoundsException, 'IndexOutOfBoundsException', IndexOutOfBoundsException_init_$Create$, RuntimeException);
  initMetadataForClass(NumberFormatException, 'NumberFormatException', NumberFormatException_init_$Create$, IllegalArgumentException);
  initMetadataForClass(ConcurrentModificationException, 'ConcurrentModificationException', ConcurrentModificationException_init_$Create$, RuntimeException);
  initMetadataForClass(ArithmeticException, 'ArithmeticException', ArithmeticException_init_$Create$, RuntimeException);
  initMetadataForClass(NullPointerException, 'NullPointerException', NullPointerException_init_$Create$, RuntimeException);
  initMetadataForClass(NoWhenBranchMatchedException, 'NoWhenBranchMatchedException', NoWhenBranchMatchedException_init_$Create$, RuntimeException);
  initMetadataForClass(ClassCastException, 'ClassCastException', ClassCastException_init_$Create$, RuntimeException);
  initMetadataForClass(UninitializedPropertyAccessException, 'UninitializedPropertyAccessException', UninitializedPropertyAccessException_init_$Create$, RuntimeException);
  initMetadataForInterface(KClass, 'KClass');
  initMetadataForClass(KClassImpl, 'KClassImpl', VOID, VOID, [KClass]);
  initMetadataForObject(NothingKClassImpl, 'NothingKClassImpl', VOID, KClassImpl);
  initMetadataForClass(ErrorKClass, 'ErrorKClass', ErrorKClass, VOID, [KClass]);
  initMetadataForClass(PrimitiveKClassImpl, 'PrimitiveKClassImpl', VOID, KClassImpl);
  initMetadataForClass(SimpleKClassImpl, 'SimpleKClassImpl', VOID, KClassImpl);
  initMetadataForInterface(KProperty1, 'KProperty1');
  initMetadataForObject(PrimitiveClasses, 'PrimitiveClasses');
  initMetadataForClass(StringBuilder, 'StringBuilder', StringBuilder_init_$Create$_0, VOID, [CharSequence]);
  initMetadataForCompanion(Companion_4);
  initMetadataForClass(Regex, 'Regex');
  initMetadataForClass(MatchGroup, 'MatchGroup');
  initMetadataForClass(findNext$1$groups$1, VOID, VOID, AbstractCollection, [Collection, AbstractCollection]);
  initMetadataForClass(AbstractList, 'AbstractList', VOID, AbstractCollection, [AbstractCollection, KtList]);
  initMetadataForClass(findNext$1$groupValues$1, VOID, VOID, AbstractList);
  function get_destructured() {
    return new Destructured(this);
  }
  initMetadataForInterface(MatchResult, 'MatchResult');
  initMetadataForClass(findNext$1, VOID, VOID, VOID, [MatchResult]);
  initMetadataForClass(ExceptionTraceBuilder, 'ExceptionTraceBuilder', ExceptionTraceBuilder);
  initMetadataForClass(IteratorImpl_0, 'IteratorImpl');
  initMetadataForCompanion(Companion_5);
  initMetadataForClass(AbstractMap$keys$1$iterator$1);
  initMetadataForClass(AbstractMap$values$1$iterator$1);
  initMetadataForCompanion(Companion_6);
  initMetadataForClass(AbstractSet, 'AbstractSet', VOID, AbstractCollection, [AbstractCollection, KtSet]);
  initMetadataForClass(AbstractMap$keys$1, VOID, VOID, AbstractSet);
  initMetadataForClass(AbstractMap$values$1, VOID, VOID, AbstractCollection);
  initMetadataForCompanion(Companion_7);
  initMetadataForObject(EmptyList, 'EmptyList', VOID, VOID, [KtList]);
  initMetadataForObject(EmptyIterator, 'EmptyIterator');
  initMetadataForClass(ArrayAsCollection, 'ArrayAsCollection', VOID, VOID, [Collection]);
  initMetadataForObject(EmptyMap, 'EmptyMap', VOID, VOID, [KtMap]);
  initMetadataForClass(IntIterator, 'IntIterator');
  initMetadataForInterface(DropTakeSequence, 'DropTakeSequence');
  initMetadataForClass(TakeSequence$iterator$1);
  initMetadataForClass(TakeSequence, 'TakeSequence', VOID, VOID, [DropTakeSequence]);
  initMetadataForClass(TransformingSequence$iterator$1);
  initMetadataForClass(TransformingSequence, 'TransformingSequence');
  initMetadataForClass(GeneratorSequence$iterator$1);
  initMetadataForClass(GeneratorSequence, 'GeneratorSequence');
  initMetadataForObject(EmptySequence, 'EmptySequence', VOID, VOID, [DropTakeSequence]);
  initMetadataForObject(EmptySet, 'EmptySet', VOID, VOID, [KtSet]);
  initMetadataForClass(Random, 'Random');
  initMetadataForObject(Default, 'Default', VOID, Random);
  initMetadataForCompanion(Companion_8);
  initMetadataForClass(XorWowRandom, 'XorWowRandom', VOID, Random);
  initMetadataForCompanion(Companion_9);
  initMetadataForClass(IntProgression, 'IntProgression', VOID, VOID, [Iterable]);
  initMetadataForClass(IntRange, 'IntRange', VOID, IntProgression);
  initMetadataForClass(IntProgressionIterator, 'IntProgressionIterator', VOID, IntIterator);
  initMetadataForCompanion(Companion_10);
  initMetadataForClass(DelimitedRangesSequence$iterator$1);
  initMetadataForClass(DelimitedRangesSequence, 'DelimitedRangesSequence');
  initMetadataForObject(State, 'State');
  initMetadataForClass(LinesIterator, 'LinesIterator');
  initMetadataForClass(lineSequence$$inlined$Sequence$1);
  initMetadataForClass(Destructured, 'Destructured');
  initMetadataForClass(UnsafeLazyImpl, 'UnsafeLazyImpl');
  initMetadataForObject(UNINITIALIZED_VALUE, 'UNINITIALIZED_VALUE');
  initMetadataForClass(Pair, 'Pair');
  //endregion
  function CharSequence() {
  }
  function Number_0() {
  }
  function toHashSet(_this__u8e3s4) {
    return toCollection(_this__u8e3s4, HashSet_init_$Create$_0(mapCapacity(_this__u8e3s4.length)));
  }
  function toMutableList(_this__u8e3s4) {
    return ArrayList_init_$Create$_1(asCollection(_this__u8e3s4));
  }
  function contains(_this__u8e3s4, element) {
    return indexOf(_this__u8e3s4, element) >= 0;
  }
  function single(_this__u8e3s4) {
    var tmp;
    switch (_this__u8e3s4.length) {
      case 0:
        throw NoSuchElementException_init_$Create$_0('Array is empty.');
      case 1:
        tmp = _this__u8e3s4[0];
        break;
      default:
        throw IllegalArgumentException_init_$Create$_0('Array has more than one element.');
    }
    return tmp;
  }
  function toCollection(_this__u8e3s4, destination) {
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    while (inductionVariable < last) {
      var item = _this__u8e3s4[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      destination.d(item);
    }
    return destination;
  }
  function indexOf(_this__u8e3s4, element) {
    if (element == null) {
      var inductionVariable = 0;
      var last = _this__u8e3s4.length - 1 | 0;
      if (inductionVariable <= last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (_this__u8e3s4[index] == null) {
            return index;
          }
        }
         while (inductionVariable <= last);
    } else {
      var inductionVariable_0 = 0;
      var last_0 = _this__u8e3s4.length - 1 | 0;
      if (inductionVariable_0 <= last_0)
        do {
          var index_0 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          if (equals(element, _this__u8e3s4[index_0])) {
            return index_0;
          }
        }
         while (inductionVariable_0 <= last_0);
    }
    return -1;
  }
  function toSet(_this__u8e3s4) {
    switch (_this__u8e3s4.length) {
      case 0:
        return emptySet();
      case 1:
        return setOf(_this__u8e3s4[0]);
      default:
        return toCollection(_this__u8e3s4, LinkedHashSet_init_$Create$_0(mapCapacity(_this__u8e3s4.length)));
    }
  }
  function joinToString(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    return joinTo(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
  }
  function joinTo(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    buffer.e(prefix);
    var count = 0;
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    $l$loop: while (inductionVariable < last) {
      var element = _this__u8e3s4[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      count = count + 1 | 0;
      if (count > 1) {
        buffer.e(separator);
      }
      if (limit < 0 || count <= limit) {
        appendElement(buffer, element, transform);
      } else
        break $l$loop;
    }
    if (limit >= 0 && count > limit) {
      buffer.e(truncated);
    }
    buffer.e(postfix);
    return buffer;
  }
  function joinToString_0(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    return joinTo_0(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
  }
  function joinTo_0(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    buffer.e(prefix);
    var count = 0;
    var _iterator__ex2g4s = _this__u8e3s4.f();
    $l$loop: while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      count = count + 1 | 0;
      if (count > 1) {
        buffer.e(separator);
      }
      if (limit < 0 || count <= limit) {
        appendElement(buffer, element, transform);
      } else
        break $l$loop;
    }
    if (limit >= 0 && count > limit) {
      buffer.e(truncated);
    }
    buffer.e(postfix);
    return buffer;
  }
  function toHashSet_0(_this__u8e3s4) {
    return toCollection_0(_this__u8e3s4, HashSet_init_$Create$_0(mapCapacity(collectionSizeOrDefault(_this__u8e3s4, 12))));
  }
  function toSet_0(_this__u8e3s4) {
    if (isInterface(_this__u8e3s4, Collection)) {
      var tmp;
      switch (_this__u8e3s4.i()) {
        case 0:
          tmp = emptySet();
          break;
        case 1:
          var tmp_0;
          if (isInterface(_this__u8e3s4, KtList)) {
            tmp_0 = _this__u8e3s4.j(0);
          } else {
            tmp_0 = _this__u8e3s4.f().h();
          }

          tmp = setOf(tmp_0);
          break;
        default:
          tmp = toCollection_0(_this__u8e3s4, LinkedHashSet_init_$Create$_0(mapCapacity(_this__u8e3s4.i())));
          break;
      }
      return tmp;
    }
    return optimizeReadOnlySet(toCollection_0(_this__u8e3s4, LinkedHashSet_init_$Create$()));
  }
  function first(_this__u8e3s4) {
    if (isInterface(_this__u8e3s4, KtList))
      return first_0(_this__u8e3s4);
    else {
      var iterator = _this__u8e3s4.f();
      if (!iterator.g())
        throw NoSuchElementException_init_$Create$_0('Collection is empty.');
      return iterator.h();
    }
  }
  function first_0(_this__u8e3s4) {
    if (_this__u8e3s4.k())
      throw NoSuchElementException_init_$Create$_0('List is empty.');
    return _this__u8e3s4.j(0);
  }
  function single_0(_this__u8e3s4) {
    if (isInterface(_this__u8e3s4, KtList))
      return single_1(_this__u8e3s4);
    else {
      var iterator = _this__u8e3s4.f();
      if (!iterator.g())
        throw NoSuchElementException_init_$Create$_0('Collection is empty.');
      var single = iterator.h();
      if (iterator.g())
        throw IllegalArgumentException_init_$Create$_0('Collection has more than one element.');
      return single;
    }
  }
  function toCollection_0(_this__u8e3s4, destination) {
    var _iterator__ex2g4s = _this__u8e3s4.f();
    while (_iterator__ex2g4s.g()) {
      var item = _iterator__ex2g4s.h();
      destination.d(item);
    }
    return destination;
  }
  function single_1(_this__u8e3s4) {
    var tmp;
    switch (_this__u8e3s4.i()) {
      case 0:
        throw NoSuchElementException_init_$Create$_0('List is empty.');
      case 1:
        tmp = _this__u8e3s4.j(0);
        break;
      default:
        throw IllegalArgumentException_init_$Create$_0('List has more than one element.');
    }
    return tmp;
  }
  function asSequence(_this__u8e3s4) {
    // Inline function 'kotlin.sequences.Sequence' call
    return new asSequence$$inlined$Sequence$1(_this__u8e3s4);
  }
  function average(_this__u8e3s4) {
    var sum = 0.0;
    var count = 0;
    var _iterator__ex2g4s = _this__u8e3s4.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      sum = sum + element.n();
      count = count + 1 | 0;
      checkCountOverflow(count);
    }
    return count === 0 ? NaN : sum / count;
  }
  function minOrNull(_this__u8e3s4) {
    var iterator = _this__u8e3s4.f();
    if (!iterator.g())
      return null;
    var min = iterator.h();
    while (iterator.g()) {
      var e = iterator.h();
      if (compareTo(min, e) > 0)
        min = e;
    }
    return min;
  }
  function asSequence$$inlined$Sequence$1($this_asSequence) {
    this.o_1 = $this_asSequence;
  }
  protoOf(asSequence$$inlined$Sequence$1).f = function () {
    return this.o_1.f();
  };
  function until(_this__u8e3s4, to) {
    if (to <= -2147483648)
      return Companion_getInstance_9().p_1;
    return numberRangeToNumber(_this__u8e3s4, to - 1 | 0);
  }
  function downTo(_this__u8e3s4, to) {
    return Companion_instance_10.q(_this__u8e3s4, to, -1);
  }
  function coerceAtMost(_this__u8e3s4, maximumValue) {
    return _this__u8e3s4 > maximumValue ? maximumValue : _this__u8e3s4;
  }
  function coerceAtLeast(_this__u8e3s4, minimumValue) {
    return _this__u8e3s4 < minimumValue ? minimumValue : _this__u8e3s4;
  }
  function coerceIn(_this__u8e3s4, minimumValue, maximumValue) {
    if (minimumValue > maximumValue)
      throw IllegalArgumentException_init_$Create$_0('Cannot coerce value to an empty range: maximum ' + maximumValue + ' is less than minimum ' + minimumValue + '.');
    if (_this__u8e3s4 < minimumValue)
      return minimumValue;
    if (_this__u8e3s4 > maximumValue)
      return maximumValue;
    return _this__u8e3s4;
  }
  function asIterable(_this__u8e3s4) {
    // Inline function 'kotlin.collections.Iterable' call
    return new asIterable$$inlined$Iterable$1(_this__u8e3s4);
  }
  function take(_this__u8e3s4, n) {
    // Inline function 'kotlin.require' call
    if (!(n >= 0)) {
      var message = 'Requested element count ' + n + ' is less than zero.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    var tmp;
    if (n === 0) {
      tmp = emptySequence();
    } else {
      if (isInterface(_this__u8e3s4, DropTakeSequence)) {
        tmp = _this__u8e3s4.r(n);
      } else {
        tmp = new TakeSequence(_this__u8e3s4, n);
      }
    }
    return tmp;
  }
  function map(_this__u8e3s4, transform) {
    return new TransformingSequence(_this__u8e3s4, transform);
  }
  function toList(_this__u8e3s4) {
    var it = _this__u8e3s4.f();
    if (!it.g())
      return emptyList();
    var element = it.h();
    if (!it.g())
      return listOf(element);
    var dst = ArrayList_init_$Create$();
    dst.d(element);
    while (it.g()) {
      dst.d(it.h());
    }
    return dst;
  }
  function asIterable$$inlined$Iterable$1($this_asIterable) {
    this.v_1 = $this_asIterable;
  }
  protoOf(asIterable$$inlined$Iterable$1).f = function () {
    return this.v_1.f();
  };
  function dropLast(_this__u8e3s4, n) {
    // Inline function 'kotlin.require' call
    if (!(n >= 0)) {
      var message = 'Requested character count ' + n + ' is less than zero.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return take_0(_this__u8e3s4, coerceAtLeast(_this__u8e3s4.length - n | 0, 0));
  }
  function take_0(_this__u8e3s4, n) {
    // Inline function 'kotlin.require' call
    if (!(n >= 0)) {
      var message = 'Requested character count ' + n + ' is less than zero.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.text.substring' call
    var endIndex = coerceAtMost(n, _this__u8e3s4.length);
    // Inline function 'kotlin.js.asDynamic' call
    return _this__u8e3s4.substring(0, endIndex);
  }
  function drop(_this__u8e3s4, n) {
    // Inline function 'kotlin.require' call
    if (!(n >= 0)) {
      var message = 'Requested character count ' + n + ' is less than zero.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.text.substring' call
    var startIndex = coerceAtMost(n, _this__u8e3s4.length);
    // Inline function 'kotlin.js.asDynamic' call
    return _this__u8e3s4.substring(startIndex);
  }
  function _Char___init__impl__6a9atx(value) {
    return value;
  }
  function _get_value__a43j40($this) {
    return $this;
  }
  function _Char___init__impl__6a9atx_0(code) {
    // Inline function 'kotlin.UShort.toInt' call
    var tmp$ret$0 = _UShort___get_data__impl__g0245(code) & 65535;
    return _Char___init__impl__6a9atx(tmp$ret$0);
  }
  function Char__compareTo_impl_ypi4mb($this, other) {
    return _get_value__a43j40($this) - _get_value__a43j40(other) | 0;
  }
  function Char__minus_impl_a2frrh($this, other) {
    return _get_value__a43j40($this) - _get_value__a43j40(other) | 0;
  }
  function Char__toInt_impl_vasixd($this) {
    return _get_value__a43j40($this);
  }
  function toString($this) {
    // Inline function 'kotlin.js.unsafeCast' call
    return String.fromCharCode(_get_value__a43j40($this));
  }
  function Char() {
  }
  function KtList() {
  }
  function Iterable() {
  }
  function Collection() {
  }
  function Entry() {
  }
  protoOf(Companion).fromJsMap = function (map) {
    return createMapFrom(map);
  };
  function Companion() {
  }
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  function KtMap() {
  }
  function KtSet() {
  }
  function Companion_0() {
  }
  var Companion_instance_0;
  function Companion_getInstance_0() {
    return Companion_instance_0;
  }
  function Enum(name, ordinal) {
    this.h1_1 = name;
    this.i1_1 = ordinal;
  }
  protoOf(Enum).j1 = function (other) {
    return compareTo(this.i1_1, other.i1_1);
  };
  protoOf(Enum).k1 = function (other) {
    return this.j1(other instanceof Enum ? other : THROW_CCE());
  };
  protoOf(Enum).equals = function (other) {
    return this === other;
  };
  protoOf(Enum).hashCode = function () {
    return identityHashCode(this);
  };
  protoOf(Enum).toString = function () {
    return this.h1_1;
  };
  function toString_0(_this__u8e3s4) {
    var tmp1_elvis_lhs = _this__u8e3s4 == null ? null : toString_1(_this__u8e3s4);
    return tmp1_elvis_lhs == null ? 'null' : tmp1_elvis_lhs;
  }
  function Companion_1() {
    Companion_instance_1 = this;
    this.l1_1 = new Long(0, -2147483648);
    this.m1_1 = new Long(-1, 2147483647);
    this.n1_1 = 8;
    this.o1_1 = 64;
  }
  var Companion_instance_1;
  function Companion_getInstance_1() {
    if (Companion_instance_1 == null)
      new Companion_1();
    return Companion_instance_1;
  }
  function Long(low, high) {
    Companion_getInstance_1();
    Number_0.call(this);
    this.l_1 = low;
    this.m_1 = high;
  }
  protoOf(Long).p1 = function (other) {
    return compare(this, other);
  };
  protoOf(Long).k1 = function (other) {
    return this.p1(other instanceof Long ? other : THROW_CCE());
  };
  protoOf(Long).q1 = function (other) {
    return add(this, other);
  };
  protoOf(Long).r1 = function (other) {
    return subtract(this, other);
  };
  protoOf(Long).s1 = function (other) {
    return multiply(this, other);
  };
  protoOf(Long).t1 = function (other) {
    return divide(this, other);
  };
  protoOf(Long).u1 = function () {
    return this.q1(new Long(1, 0));
  };
  protoOf(Long).v1 = function () {
    return this.w1().q1(new Long(1, 0));
  };
  protoOf(Long).x1 = function (bitCount) {
    return shiftRight(this, bitCount);
  };
  protoOf(Long).y1 = function (other) {
    return new Long(this.l_1 & other.l_1, this.m_1 & other.m_1);
  };
  protoOf(Long).w1 = function () {
    return new Long(~this.l_1, ~this.m_1);
  };
  protoOf(Long).z1 = function () {
    return this.l_1;
  };
  protoOf(Long).a2 = function () {
    return this.n();
  };
  protoOf(Long).n = function () {
    return toNumber(this);
  };
  protoOf(Long).toString = function () {
    return toStringImpl(this, 10);
  };
  protoOf(Long).equals = function (other) {
    var tmp;
    if (other instanceof Long) {
      tmp = equalsLong(this, other);
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(Long).hashCode = function () {
    return hashCode_0(this);
  };
  protoOf(Long).valueOf = function () {
    return this.n();
  };
  function implement(interfaces) {
    var maxSize = 1;
    var masks = [];
    var inductionVariable = 0;
    var last = interfaces.length;
    while (inductionVariable < last) {
      var i = interfaces[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var currentSize = maxSize;
      var tmp0_elvis_lhs = i.prototype.$imask$;
      var imask = tmp0_elvis_lhs == null ? i.$imask$ : tmp0_elvis_lhs;
      if (!(imask == null)) {
        masks.push(imask);
        currentSize = imask.length;
      }
      var iid = i.$metadata$.iid;
      var tmp;
      if (iid == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.let' call
        tmp = bitMaskWith(iid);
      }
      var iidImask = tmp;
      if (!(iidImask == null)) {
        masks.push(iidImask);
        currentSize = Math.max(currentSize, iidImask.length);
      }
      if (currentSize > maxSize) {
        maxSize = currentSize;
      }
    }
    return compositeBitMask(maxSize, masks);
  }
  function bitMaskWith(activeBit) {
    var numberIndex = activeBit >> 5;
    var intArray = new Int32Array(numberIndex + 1 | 0);
    var positionInNumber = activeBit & 31;
    var numberWithSettledBit = 1 << positionInNumber;
    intArray[numberIndex] = intArray[numberIndex] | numberWithSettledBit;
    return intArray;
  }
  function compositeBitMask(capacity, masks) {
    var tmp = 0;
    var tmp_0 = new Int32Array(capacity);
    while (tmp < capacity) {
      var tmp_1 = tmp;
      var result = 0;
      var inductionVariable = 0;
      var last = masks.length;
      while (inductionVariable < last) {
        var mask = masks[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (tmp_1 < mask.length) {
          result = result | mask[tmp_1];
        }
      }
      tmp_0[tmp_1] = result;
      tmp = tmp + 1 | 0;
    }
    return tmp_0;
  }
  function isBitSet(_this__u8e3s4, possibleActiveBit) {
    var numberIndex = possibleActiveBit >> 5;
    if (numberIndex > _this__u8e3s4.length)
      return false;
    var positionInNumber = possibleActiveBit & 31;
    var numberWithSettledBit = 1 << positionInNumber;
    return !((_this__u8e3s4[numberIndex] & numberWithSettledBit) === 0);
  }
  function arrayIterator(array) {
    return new arrayIterator$1(array);
  }
  function charArrayOf(arr) {
    var tmp0 = 'CharArray';
    // Inline function 'withType' call
    var array = new Uint16Array(arr);
    array.$type$ = tmp0;
    // Inline function 'kotlin.js.unsafeCast' call
    return array;
  }
  function arrayIterator$1($array) {
    this.c2_1 = $array;
    this.b2_1 = 0;
  }
  protoOf(arrayIterator$1).g = function () {
    return !(this.b2_1 === this.c2_1.length);
  };
  protoOf(arrayIterator$1).h = function () {
    var tmp;
    if (!(this.b2_1 === this.c2_1.length)) {
      var _unary__edvuaz = this.b2_1;
      this.b2_1 = _unary__edvuaz + 1 | 0;
      tmp = this.c2_1[_unary__edvuaz];
    } else {
      throw NoSuchElementException_init_$Create$_0('' + this.b2_1);
    }
    return tmp;
  };
  function get_buf() {
    _init_properties_bitUtils_kt__nfcg4k();
    return buf;
  }
  var buf;
  function get_bufFloat64() {
    _init_properties_bitUtils_kt__nfcg4k();
    return bufFloat64;
  }
  var bufFloat64;
  var bufFloat32;
  function get_bufInt32() {
    _init_properties_bitUtils_kt__nfcg4k();
    return bufInt32;
  }
  var bufInt32;
  function get_lowIndex() {
    _init_properties_bitUtils_kt__nfcg4k();
    return lowIndex;
  }
  var lowIndex;
  function get_highIndex() {
    _init_properties_bitUtils_kt__nfcg4k();
    return highIndex;
  }
  var highIndex;
  function getNumberHashCode(obj) {
    _init_properties_bitUtils_kt__nfcg4k();
    // Inline function 'kotlin.js.jsBitwiseOr' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    if ((obj | 0) === obj) {
      return numberToInt(obj);
    }
    get_bufFloat64()[0] = obj;
    return imul(get_bufInt32()[get_highIndex()], 31) + get_bufInt32()[get_lowIndex()] | 0;
  }
  var properties_initialized_bitUtils_kt_i2bo3e;
  function _init_properties_bitUtils_kt__nfcg4k() {
    if (!properties_initialized_bitUtils_kt_i2bo3e) {
      properties_initialized_bitUtils_kt_i2bo3e = true;
      buf = new ArrayBuffer(8);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufFloat64 = new Float64Array(get_buf());
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufFloat32 = new Float32Array(get_buf());
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufInt32 = new Int32Array(get_buf());
      // Inline function 'kotlin.run' call
      get_bufFloat64()[0] = -1.0;
      lowIndex = !(get_bufInt32()[0] === 0) ? 1 : 0;
      highIndex = 1 - get_lowIndex() | 0;
    }
  }
  function charSequenceGet(a, index) {
    var tmp;
    if (isString(a)) {
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$1 = a.charCodeAt(index);
      tmp = numberToChar(tmp$ret$1);
    } else {
      tmp = a.b(index);
    }
    return tmp;
  }
  function isString(a) {
    return typeof a === 'string';
  }
  function charSequenceLength(a) {
    var tmp;
    if (isString(a)) {
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = a.length;
    } else {
      tmp = a.a();
    }
    return tmp;
  }
  function charSequenceSubSequence(a, startIndex, endIndex) {
    var tmp;
    if (isString(a)) {
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = a.substring(startIndex, endIndex);
    } else {
      tmp = a.c(startIndex, endIndex);
    }
    return tmp;
  }
  function arrayToString(array) {
    return joinToString(array, ', ', '[', ']', VOID, VOID, arrayToString$lambda);
  }
  function arrayToString$lambda(it) {
    return toString_1(it);
  }
  function UNSUPPORTED_OPERATION() {
    throw UnsupportedOperationException_init_$Create$();
  }
  function createJsReadonlyMapViewFrom(map) {
    var tmp = createJsReadonlyMapViewFrom$lambda(map);
    var tmp_0 = createJsReadonlyMapViewFrom$lambda_0(map);
    var tmp_1 = createJsReadonlyMapViewFrom$lambda_1(map);
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_2 = UNSUPPORTED_OPERATION$ref();
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_3 = UNSUPPORTED_OPERATION$ref_0();
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_4 = UNSUPPORTED_OPERATION$ref_1();
    var tmp_5 = createJsReadonlyMapViewFrom$lambda_2(map);
    var tmp_6 = createJsReadonlyMapViewFrom$lambda_3(map);
    var tmp_7 = createJsReadonlyMapViewFrom$lambda_4(map);
    return createJsMapViewWith(tmp, tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, createJsReadonlyMapViewFrom$lambda_5);
  }
  function createJsMapViewWith(mapSize, mapGet, mapContains, mapPut, mapRemove, mapClear, keysIterator, valuesIterator, entriesIterator, forEach) {
    // Inline function 'kotlin.also' call
    var this_0 = objectCreate(protoOf(JsMapView));
    this_0[Symbol.iterator] = entriesIterator;
    defineProp(this_0, 'size', mapSize, VOID);
    var mapView = this_0;
    return Object.assign(mapView, {get: mapGet, set: function (key, value) {
      mapPut(key, value);
      return this;
    }, 'delete': mapRemove, clear: mapClear, has: mapContains, keys: keysIterator, values: valuesIterator, entries: entriesIterator, forEach: function (cb, thisArg) {
      forEach(cb, mapView, thisArg);
    }});
  }
  function createJsIteratorFrom(iterator, transform) {
    var tmp;
    if (transform === VOID) {
      tmp = createJsIteratorFrom$lambda;
    } else {
      tmp = transform;
    }
    transform = tmp;
    var iteratorNext = createJsIteratorFrom$lambda_0(iterator);
    var iteratorHasNext = createJsIteratorFrom$lambda_1(iterator);
    var jsIterator = {next: function () {
      var result = {done: !iteratorHasNext()};
      if (!result.done)
        result.value = transform(iteratorNext());
      return result;
    }};
    jsIterator[Symbol.iterator] = function () {
      return this;
    };
    return jsIterator;
  }
  function forEach(cb, collection, thisArg) {
    thisArg = thisArg === VOID ? undefined : thisArg;
    var iterator = collection.entries();
    var result = iterator.next();
    while (!result.done) {
      var value = result.value;
      // Inline function 'kotlin.js.asDynamic' call
      cb.call(thisArg, value[1], value[0], collection);
      result = iterator.next();
    }
  }
  function JsMapView() {
    Map.call(this);
  }
  function createMapFrom(map) {
    // Inline function 'kotlin.collections.buildMapInternal' call
    // Inline function 'kotlin.apply' call
    var this_0 = LinkedHashMap_init_$Create$();
    forEach(createMapFrom$lambda(this_0), map);
    return this_0.j2();
  }
  function createJsReadonlyMapViewFrom$lambda($map) {
    return function () {
      return $map.i();
    };
  }
  function createJsReadonlyMapViewFrom$lambda_0($map) {
    return function (k) {
      return $map.d1(k);
    };
  }
  function createJsReadonlyMapViewFrom$lambda_1($map) {
    return function (k) {
      return $map.b1(k);
    };
  }
  function UNSUPPORTED_OPERATION$ref() {
    var l = function () {
      UNSUPPORTED_OPERATION();
      return Unit_instance;
    };
    l.callableName = 'UNSUPPORTED_OPERATION';
    return l;
  }
  function UNSUPPORTED_OPERATION$ref_0() {
    var l = function () {
      UNSUPPORTED_OPERATION();
      return Unit_instance;
    };
    l.callableName = 'UNSUPPORTED_OPERATION';
    return l;
  }
  function UNSUPPORTED_OPERATION$ref_1() {
    var l = function () {
      UNSUPPORTED_OPERATION();
      return Unit_instance;
    };
    l.callableName = 'UNSUPPORTED_OPERATION';
    return l;
  }
  function createJsReadonlyMapViewFrom$lambda_2($map) {
    return function () {
      return createJsIteratorFrom($map.e1().f());
    };
  }
  function createJsReadonlyMapViewFrom$lambda_3($map) {
    return function () {
      return createJsIteratorFrom($map.f1().f());
    };
  }
  function createJsReadonlyMapViewFrom$lambda$lambda(it) {
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [it.z(), it.a1()];
  }
  function createJsReadonlyMapViewFrom$lambda_4($map) {
    return function () {
      var tmp = $map.g1().f();
      return createJsIteratorFrom(tmp, createJsReadonlyMapViewFrom$lambda$lambda);
    };
  }
  function createJsReadonlyMapViewFrom$lambda_5(callback, map, thisArg) {
    forEach(callback, map, thisArg);
    return Unit_instance;
  }
  function createJsIteratorFrom$lambda(it) {
    return it;
  }
  function createJsIteratorFrom$lambda_0($iterator) {
    return function () {
      return $iterator.h();
    };
  }
  function createJsIteratorFrom$lambda_1($iterator) {
    return function () {
      return $iterator.g();
    };
  }
  function createMapFrom$lambda($$this$buildMapInternal) {
    return function (value, key, _unused_var__etf5q3) {
      $$this$buildMapInternal.k2(key, value);
      return Unit_instance;
    };
  }
  function compareTo(a, b) {
    var tmp;
    switch (typeof a) {
      case 'number':
        var tmp_0;
        if (typeof b === 'number') {
          tmp_0 = doubleCompareTo(a, b);
        } else {
          if (b instanceof Long) {
            tmp_0 = doubleCompareTo(a, b.n());
          } else {
            tmp_0 = primitiveCompareTo(a, b);
          }
        }

        tmp = tmp_0;
        break;
      case 'string':
      case 'boolean':
        tmp = primitiveCompareTo(a, b);
        break;
      default:
        tmp = compareToDoNotIntrinsicify(a, b);
        break;
    }
    return tmp;
  }
  function doubleCompareTo(a, b) {
    var tmp;
    if (a < b) {
      tmp = -1;
    } else if (a > b) {
      tmp = 1;
    } else if (a === b) {
      var tmp_0;
      if (a !== 0) {
        tmp_0 = 0;
      } else {
        // Inline function 'kotlin.js.asDynamic' call
        var ia = 1 / a;
        var tmp_1;
        // Inline function 'kotlin.js.asDynamic' call
        if (ia === 1 / b) {
          tmp_1 = 0;
        } else {
          if (ia < 0) {
            tmp_1 = -1;
          } else {
            tmp_1 = 1;
          }
        }
        tmp_0 = tmp_1;
      }
      tmp = tmp_0;
    } else if (a !== a) {
      tmp = b !== b ? 0 : 1;
    } else {
      tmp = -1;
    }
    return tmp;
  }
  function primitiveCompareTo(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function compareToDoNotIntrinsicify(a, b) {
    return a.k1(b);
  }
  function identityHashCode(obj) {
    return getObjectHashCode(obj);
  }
  function getObjectHashCode(obj) {
    // Inline function 'kotlin.js.jsIn' call
    if (!('kotlinHashCodeValue$' in obj)) {
      var hash = calculateRandomHash();
      var descriptor = new Object();
      descriptor.value = hash;
      descriptor.enumerable = false;
      Object.defineProperty(obj, 'kotlinHashCodeValue$', descriptor);
    }
    // Inline function 'kotlin.js.unsafeCast' call
    return obj['kotlinHashCodeValue$'];
  }
  function calculateRandomHash() {
    // Inline function 'kotlin.js.jsBitwiseOr' call
    return Math.random() * 4.294967296E9 | 0;
  }
  function defineProp(obj, name, getter, setter) {
    return Object.defineProperty(obj, name, {configurable: true, get: getter, set: setter});
  }
  function objectCreate(proto) {
    proto = proto === VOID ? null : proto;
    return Object.create(proto);
  }
  function toString_1(o) {
    var tmp;
    if (o == null) {
      tmp = 'null';
    } else if (isArrayish(o)) {
      tmp = '[...]';
    } else if (!(typeof o.toString === 'function')) {
      tmp = anyToString(o);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = o.toString();
    }
    return tmp;
  }
  function equals(obj1, obj2) {
    if (obj1 == null) {
      return obj2 == null;
    }
    if (obj2 == null) {
      return false;
    }
    if (typeof obj1 === 'object' && typeof obj1.equals === 'function') {
      return obj1.equals(obj2);
    }
    if (obj1 !== obj1) {
      return obj2 !== obj2;
    }
    if (typeof obj1 === 'number' && typeof obj2 === 'number') {
      var tmp;
      if (obj1 === obj2) {
        var tmp_0;
        if (obj1 !== 0) {
          tmp_0 = true;
        } else {
          // Inline function 'kotlin.js.asDynamic' call
          var tmp_1 = 1 / obj1;
          // Inline function 'kotlin.js.asDynamic' call
          tmp_0 = tmp_1 === 1 / obj2;
        }
        tmp = tmp_0;
      } else {
        tmp = false;
      }
      return tmp;
    }
    return obj1 === obj2;
  }
  function hashCode(obj) {
    if (obj == null)
      return 0;
    var typeOf = typeof obj;
    var tmp;
    switch (typeOf) {
      case 'object':
        tmp = 'function' === typeof obj.hashCode ? obj.hashCode() : getObjectHashCode(obj);
        break;
      case 'function':
        tmp = getObjectHashCode(obj);
        break;
      case 'number':
        tmp = getNumberHashCode(obj);
        break;
      case 'boolean':
        // Inline function 'kotlin.js.unsafeCast' call

        tmp = getBooleanHashCode(obj);
        break;
      case 'string':
        tmp = getStringHashCode(String(obj));
        break;
      case 'bigint':
        tmp = getBigIntHashCode(obj);
        break;
      case 'symbol':
        tmp = getSymbolHashCode(obj);
        break;
      default:
        tmp = function () {
          throw new Error('Unexpected typeof `' + typeOf + '`');
        }();
        break;
    }
    return tmp;
  }
  function anyToString(o) {
    return Object.prototype.toString.call(o);
  }
  function getBooleanHashCode(value) {
    return value ? 1231 : 1237;
  }
  function getStringHashCode(str) {
    var hash = 0;
    var length = str.length;
    var inductionVariable = 0;
    var last = length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.js.asDynamic' call
        var code = str.charCodeAt(i);
        hash = imul(hash, 31) + code | 0;
      }
       while (!(i === last));
    return hash;
  }
  function getBigIntHashCode(value) {
    var shiftNumber = BigInt(32);
    var MASK = BigInt(4.294967295E9);
    var bigNumber = value < 0 ? -value : value;
    var hashCode = 0;
    var signum = value < 0 ? -1 : 1;
    while (bigNumber != 0) {
      // Inline function 'kotlin.js.unsafeCast' call
      var chunk = Number(bigNumber & MASK);
      hashCode = imul(31, hashCode) + chunk | 0;
      bigNumber = bigNumber >> shiftNumber;
    }
    return imul(hashCode, signum);
  }
  function getSymbolHashCode(value) {
    var hashCodeMap = symbolIsSharable(value) ? getSymbolMap() : getSymbolWeakMap();
    var cachedHashCode = hashCodeMap.get(value);
    if (cachedHashCode !== VOID)
      return cachedHashCode;
    var hash = calculateRandomHash();
    hashCodeMap.set(value, hash);
    return hash;
  }
  function symbolIsSharable(symbol) {
    return Symbol.keyFor(symbol) != VOID;
  }
  function getSymbolMap() {
    if (symbolMap === VOID) {
      symbolMap = new Map();
    }
    return symbolMap;
  }
  function getSymbolWeakMap() {
    if (symbolWeakMap === VOID) {
      symbolWeakMap = new WeakMap();
    }
    return symbolWeakMap;
  }
  var symbolMap;
  var symbolWeakMap;
  function unboxIntrinsic(x) {
    var message = 'Should be lowered';
    throw IllegalStateException_init_$Create$_0(toString_1(message));
  }
  function captureStack(instance, constructorFunction) {
    if (Error.captureStackTrace != null) {
      Error.captureStackTrace(instance, constructorFunction);
    } else {
      // Inline function 'kotlin.js.asDynamic' call
      instance.stack = (new Error()).stack;
    }
  }
  function protoOf(constructor) {
    return constructor.prototype;
  }
  function extendThrowable(this_, message, cause) {
    Error.call(this_);
    setPropertiesToThrowableInstance(this_, message, cause);
  }
  function setPropertiesToThrowableInstance(this_, message, cause) {
    var errorInfo = calculateErrorInfo(Object.getPrototypeOf(this_));
    if ((errorInfo & 1) === 0) {
      var tmp;
      if (message == null) {
        var tmp_0;
        if (!(message === null)) {
          var tmp1_elvis_lhs = cause == null ? null : cause.toString();
          tmp_0 = tmp1_elvis_lhs == null ? VOID : tmp1_elvis_lhs;
        } else {
          tmp_0 = VOID;
        }
        tmp = tmp_0;
      } else {
        tmp = message;
      }
      this_.message = tmp;
    }
    if ((errorInfo & 2) === 0) {
      this_.cause = cause;
    }
    this_.name = Object.getPrototypeOf(this_).constructor.name;
  }
  function ensureNotNull(v) {
    var tmp;
    if (v == null) {
      THROW_NPE();
    } else {
      tmp = v;
    }
    return tmp;
  }
  function THROW_NPE() {
    throw NullPointerException_init_$Create$();
  }
  function noWhenBranchMatchedException() {
    throw NoWhenBranchMatchedException_init_$Create$();
  }
  function THROW_CCE() {
    throw ClassCastException_init_$Create$();
  }
  function throwUninitializedPropertyAccessException(name) {
    throw UninitializedPropertyAccessException_init_$Create$_0('lateinit property ' + name + ' has not been initialized');
  }
  function THROW_IAE(msg) {
    throw IllegalArgumentException_init_$Create$_0(msg);
  }
  function get_ZERO() {
    _init_properties_longJs_kt__elc2w5();
    return ZERO;
  }
  var ZERO;
  function get_ONE() {
    _init_properties_longJs_kt__elc2w5();
    return ONE;
  }
  var ONE;
  function get_NEG_ONE() {
    _init_properties_longJs_kt__elc2w5();
    return NEG_ONE;
  }
  var NEG_ONE;
  function get_MAX_VALUE() {
    _init_properties_longJs_kt__elc2w5();
    return MAX_VALUE;
  }
  var MAX_VALUE;
  function get_MIN_VALUE() {
    _init_properties_longJs_kt__elc2w5();
    return MIN_VALUE;
  }
  var MIN_VALUE;
  function get_TWO_PWR_24_() {
    _init_properties_longJs_kt__elc2w5();
    return TWO_PWR_24_;
  }
  var TWO_PWR_24_;
  function compare(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    if (equalsLong(_this__u8e3s4, other)) {
      return 0;
    }
    var thisNeg = isNegative(_this__u8e3s4);
    var otherNeg = isNegative(other);
    return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : isNegative(subtract(_this__u8e3s4, other)) ? -1 : 1;
  }
  function add(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    var a48 = _this__u8e3s4.m_1 >>> 16 | 0;
    var a32 = _this__u8e3s4.m_1 & 65535;
    var a16 = _this__u8e3s4.l_1 >>> 16 | 0;
    var a00 = _this__u8e3s4.l_1 & 65535;
    var b48 = other.m_1 >>> 16 | 0;
    var b32 = other.m_1 & 65535;
    var b16 = other.l_1 >>> 16 | 0;
    var b00 = other.l_1 & 65535;
    var c48 = 0;
    var c32 = 0;
    var c16 = 0;
    var c00 = 0;
    c00 = c00 + (a00 + b00 | 0) | 0;
    c16 = c16 + (c00 >>> 16 | 0) | 0;
    c00 = c00 & 65535;
    c16 = c16 + (a16 + b16 | 0) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c32 = c32 + (a32 + b32 | 0) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c48 = c48 + (a48 + b48 | 0) | 0;
    c48 = c48 & 65535;
    return new Long(c16 << 16 | c00, c48 << 16 | c32);
  }
  function subtract(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return add(_this__u8e3s4, other.v1());
  }
  function multiply(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    if (isZero(_this__u8e3s4)) {
      return get_ZERO();
    } else if (isZero(other)) {
      return get_ZERO();
    }
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      return isOdd(other) ? get_MIN_VALUE() : get_ZERO();
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return isOdd(_this__u8e3s4) ? get_MIN_VALUE() : get_ZERO();
    }
    if (isNegative(_this__u8e3s4)) {
      var tmp;
      if (isNegative(other)) {
        tmp = multiply(negate(_this__u8e3s4), negate(other));
      } else {
        tmp = negate(multiply(negate(_this__u8e3s4), other));
      }
      return tmp;
    } else if (isNegative(other)) {
      return negate(multiply(_this__u8e3s4, negate(other)));
    }
    if (lessThan(_this__u8e3s4, get_TWO_PWR_24_()) && lessThan(other, get_TWO_PWR_24_())) {
      return fromNumber(toNumber(_this__u8e3s4) * toNumber(other));
    }
    var a48 = _this__u8e3s4.m_1 >>> 16 | 0;
    var a32 = _this__u8e3s4.m_1 & 65535;
    var a16 = _this__u8e3s4.l_1 >>> 16 | 0;
    var a00 = _this__u8e3s4.l_1 & 65535;
    var b48 = other.m_1 >>> 16 | 0;
    var b32 = other.m_1 & 65535;
    var b16 = other.l_1 >>> 16 | 0;
    var b00 = other.l_1 & 65535;
    var c48 = 0;
    var c32 = 0;
    var c16 = 0;
    var c00 = 0;
    c00 = c00 + imul(a00, b00) | 0;
    c16 = c16 + (c00 >>> 16 | 0) | 0;
    c00 = c00 & 65535;
    c16 = c16 + imul(a16, b00) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c16 = c16 + imul(a00, b16) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c32 = c32 + imul(a32, b00) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c32 = c32 + imul(a16, b16) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c32 = c32 + imul(a00, b32) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c48 = c48 + (((imul(a48, b00) + imul(a32, b16) | 0) + imul(a16, b32) | 0) + imul(a00, b48) | 0) | 0;
    c48 = c48 & 65535;
    return new Long(c16 << 16 | c00, c48 << 16 | c32);
  }
  function divide(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    if (isZero(other)) {
      throw Exception_init_$Create$_0('division by zero');
    } else if (isZero(_this__u8e3s4)) {
      return get_ZERO();
    }
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      if (equalsLong(other, get_ONE()) || equalsLong(other, get_NEG_ONE())) {
        return get_MIN_VALUE();
      } else if (equalsLong(other, get_MIN_VALUE())) {
        return get_ONE();
      } else {
        var halfThis = shiftRight(_this__u8e3s4, 1);
        var approx = shiftLeft(halfThis.t1(other), 1);
        if (equalsLong(approx, get_ZERO())) {
          return isNegative(other) ? get_ONE() : get_NEG_ONE();
        } else {
          var rem = subtract(_this__u8e3s4, multiply(other, approx));
          return add(approx, rem.t1(other));
        }
      }
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return get_ZERO();
    }
    if (isNegative(_this__u8e3s4)) {
      var tmp;
      if (isNegative(other)) {
        tmp = negate(_this__u8e3s4).t1(negate(other));
      } else {
        tmp = negate(negate(_this__u8e3s4).t1(other));
      }
      return tmp;
    } else if (isNegative(other)) {
      return negate(_this__u8e3s4.t1(negate(other)));
    }
    var res = get_ZERO();
    var rem_0 = _this__u8e3s4;
    while (greaterThanOrEqual(rem_0, other)) {
      var approxDouble = toNumber(rem_0) / toNumber(other);
      var approx2 = Math.max(1.0, Math.floor(approxDouble));
      var log2 = Math.ceil(Math.log(approx2) / Math.LN2);
      var delta = log2 <= 48 ? 1.0 : Math.pow(2.0, log2 - 48);
      var approxRes = fromNumber(approx2);
      var approxRem = multiply(approxRes, other);
      while (isNegative(approxRem) || greaterThan(approxRem, rem_0)) {
        approx2 = approx2 - delta;
        approxRes = fromNumber(approx2);
        approxRem = multiply(approxRes, other);
      }
      if (isZero(approxRes)) {
        approxRes = get_ONE();
      }
      res = add(res, approxRes);
      rem_0 = subtract(rem_0, approxRem);
    }
    return res;
  }
  function shiftLeft(_this__u8e3s4, numBits) {
    _init_properties_longJs_kt__elc2w5();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.l_1 << numBits_0, _this__u8e3s4.m_1 << numBits_0 | (_this__u8e3s4.l_1 >>> (32 - numBits_0 | 0) | 0));
      } else {
        return new Long(0, _this__u8e3s4.l_1 << (numBits_0 - 32 | 0));
      }
    }
  }
  function shiftRight(_this__u8e3s4, numBits) {
    _init_properties_longJs_kt__elc2w5();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.l_1 >>> numBits_0 | 0 | _this__u8e3s4.m_1 << (32 - numBits_0 | 0), _this__u8e3s4.m_1 >> numBits_0);
      } else {
        return new Long(_this__u8e3s4.m_1 >> (numBits_0 - 32 | 0), _this__u8e3s4.m_1 >= 0 ? 0 : -1);
      }
    }
  }
  function toNumber(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.m_1 * 4.294967296E9 + getLowBitsUnsigned(_this__u8e3s4);
  }
  function toStringImpl(_this__u8e3s4, radix) {
    _init_properties_longJs_kt__elc2w5();
    if (radix < 2 || 36 < radix) {
      throw Exception_init_$Create$_0('radix out of range: ' + radix);
    }
    if (isZero(_this__u8e3s4)) {
      return '0';
    }
    if (isNegative(_this__u8e3s4)) {
      if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
        var radixLong = fromInt(radix);
        var div = _this__u8e3s4.t1(radixLong);
        var rem = subtract(multiply(div, radixLong), _this__u8e3s4).z1();
        var tmp = toStringImpl(div, radix);
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'kotlin.js.unsafeCast' call
        return tmp + rem.toString(radix);
      } else {
        return '-' + toStringImpl(negate(_this__u8e3s4), radix);
      }
    }
    var digitsPerTime = radix === 2 ? 31 : radix <= 10 ? 9 : radix <= 21 ? 7 : radix <= 35 ? 6 : 5;
    var radixToPower = fromNumber(Math.pow(radix, digitsPerTime));
    var rem_0 = _this__u8e3s4;
    var result = '';
    while (true) {
      var remDiv = rem_0.t1(radixToPower);
      var intval = subtract(rem_0, multiply(remDiv, radixToPower)).z1();
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var digits = intval.toString(radix);
      rem_0 = remDiv;
      if (isZero(rem_0)) {
        return digits + result;
      } else {
        while (digits.length < digitsPerTime) {
          digits = '0' + digits;
        }
        result = digits + result;
      }
    }
  }
  function equalsLong(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.m_1 === other.m_1 && _this__u8e3s4.l_1 === other.l_1;
  }
  function hashCode_0(l) {
    _init_properties_longJs_kt__elc2w5();
    return l.l_1 ^ l.m_1;
  }
  function fromInt(value) {
    _init_properties_longJs_kt__elc2w5();
    return new Long(value, value < 0 ? -1 : 0);
  }
  function isNegative(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.m_1 < 0;
  }
  function isZero(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.m_1 === 0 && _this__u8e3s4.l_1 === 0;
  }
  function isOdd(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return (_this__u8e3s4.l_1 & 1) === 1;
  }
  function negate(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.v1();
  }
  function lessThan(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return compare(_this__u8e3s4, other) < 0;
  }
  function fromNumber(value) {
    _init_properties_longJs_kt__elc2w5();
    if (isNaN_0(value)) {
      return get_ZERO();
    } else if (value <= -9.223372036854776E18) {
      return get_MIN_VALUE();
    } else if (value + 1 >= 9.223372036854776E18) {
      return get_MAX_VALUE();
    } else if (value < 0) {
      return negate(fromNumber(-value));
    } else {
      var twoPwr32 = 4.294967296E9;
      // Inline function 'kotlin.js.jsBitwiseOr' call
      var tmp = value % twoPwr32 | 0;
      // Inline function 'kotlin.js.jsBitwiseOr' call
      var tmp$ret$1 = value / twoPwr32 | 0;
      return new Long(tmp, tmp$ret$1);
    }
  }
  function greaterThan(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return compare(_this__u8e3s4, other) > 0;
  }
  function greaterThanOrEqual(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return compare(_this__u8e3s4, other) >= 0;
  }
  function getLowBitsUnsigned(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.l_1 >= 0 ? _this__u8e3s4.l_1 : 4.294967296E9 + _this__u8e3s4.l_1;
  }
  var properties_initialized_longJs_kt_4syf89;
  function _init_properties_longJs_kt__elc2w5() {
    if (!properties_initialized_longJs_kt_4syf89) {
      properties_initialized_longJs_kt_4syf89 = true;
      ZERO = fromInt(0);
      ONE = fromInt(1);
      NEG_ONE = fromInt(-1);
      MAX_VALUE = new Long(-1, 2147483647);
      MIN_VALUE = new Long(0, -2147483648);
      TWO_PWR_24_ = fromInt(16777216);
    }
  }
  function createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    var undef = VOID;
    var iid = kind === 'interface' ? generateInterfaceId() : VOID;
    return {kind: kind, simpleName: name, associatedObjectKey: associatedObjectKey, associatedObjects: associatedObjects, suspendArity: suspendArity, $kClass$: undef, defaultConstructor: defaultConstructor, iid: iid};
  }
  function generateInterfaceId() {
    if (globalInterfaceId === VOID) {
      globalInterfaceId = 0;
    }
    // Inline function 'kotlin.js.unsafeCast' call
    globalInterfaceId = globalInterfaceId + 1 | 0;
    // Inline function 'kotlin.js.unsafeCast' call
    return globalInterfaceId;
  }
  var globalInterfaceId;
  function initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    if (!(parent == null)) {
      ctor.prototype = Object.create(parent.prototype);
      ctor.prototype.constructor = ctor;
    }
    var metadata = createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity);
    ctor.$metadata$ = metadata;
    if (!(interfaces == null)) {
      var receiver = !equals(metadata.iid, VOID) ? ctor : ctor.prototype;
      receiver.$imask$ = implement(interfaces);
    }
  }
  function initMetadataForClass(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    var kind = 'class';
    initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
  }
  function initMetadataForObject(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    var kind = 'object';
    initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
  }
  function initMetadataForInterface(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    var kind = 'interface';
    initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
  }
  function initMetadataForLambda(ctor, parent, interfaces, suspendArity) {
    initMetadataForClass(ctor, 'Lambda', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function initMetadataForCoroutine(ctor, parent, interfaces, suspendArity) {
    initMetadataForClass(ctor, 'Coroutine', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function initMetadataForFunctionReference(ctor, parent, interfaces, suspendArity) {
    initMetadataForClass(ctor, 'FunctionReference', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function initMetadataForCompanion(ctor, parent, interfaces, suspendArity) {
    initMetadataForObject(ctor, 'Companion', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function numberToInt(a) {
    var tmp;
    if (a instanceof Long) {
      tmp = a.z1();
    } else {
      tmp = doubleToInt(a);
    }
    return tmp;
  }
  function doubleToInt(a) {
    var tmp;
    if (a > 2147483647) {
      tmp = 2147483647;
    } else if (a < -2147483648) {
      tmp = -2147483648;
    } else {
      // Inline function 'kotlin.js.jsBitwiseOr' call
      tmp = a | 0;
    }
    return tmp;
  }
  function numberToDouble(a) {
    // Inline function 'kotlin.js.unsafeCast' call
    return +a;
  }
  function toShort(a) {
    // Inline function 'kotlin.js.unsafeCast' call
    return a << 16 >> 16;
  }
  function numberToLong(a) {
    var tmp;
    if (a instanceof Long) {
      tmp = a;
    } else {
      tmp = fromNumber(a);
    }
    return tmp;
  }
  function numberToChar(a) {
    // Inline function 'kotlin.toUShort' call
    var this_0 = numberToInt(a);
    var tmp$ret$0 = _UShort___init__impl__jigrne(toShort(this_0));
    return _Char___init__impl__6a9atx_0(tmp$ret$0);
  }
  function toLong(a) {
    return fromInt(a);
  }
  function numberRangeToNumber(start, endInclusive) {
    return new IntRange(start, endInclusive);
  }
  function get_propertyRefClassMetadataCache() {
    _init_properties_reflectRuntime_kt__5r4uu3();
    return propertyRefClassMetadataCache;
  }
  var propertyRefClassMetadataCache;
  function metadataObject() {
    _init_properties_reflectRuntime_kt__5r4uu3();
    return createMetadata('class', VOID, VOID, VOID, VOID, VOID);
  }
  function getPropertyCallableRef(name, paramCount, superType, getter, setter) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    getter.get = getter;
    getter.set = setter;
    getter.callableName = name;
    // Inline function 'kotlin.js.unsafeCast' call
    return getPropertyRefClass(getter, getKPropMetadata(paramCount, setter), getInterfaceMaskFor(getter, superType));
  }
  function getPropertyRefClass(obj, metadata, imask) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    obj.$metadata$ = metadata;
    obj.constructor = obj;
    obj.$imask$ = imask;
    return obj;
  }
  function getKPropMetadata(paramCount, setter) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    return get_propertyRefClassMetadataCache()[paramCount][setter == null ? 0 : 1];
  }
  function getInterfaceMaskFor(obj, superType) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    var tmp0_elvis_lhs = obj.$imask$;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$2 = [superType];
      tmp = implement(tmp$ret$2);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  var properties_initialized_reflectRuntime_kt_inkhwd;
  function _init_properties_reflectRuntime_kt__5r4uu3() {
    if (!properties_initialized_reflectRuntime_kt_inkhwd) {
      properties_initialized_reflectRuntime_kt_inkhwd = true;
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp = [metadataObject(), metadataObject()];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = [metadataObject(), metadataObject()];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      propertyRefClassMetadataCache = [tmp, tmp_0, [metadataObject(), metadataObject()]];
    }
  }
  function isArrayish(o) {
    return isJsArray(o) || isView(o);
  }
  function isJsArray(obj) {
    // Inline function 'kotlin.js.unsafeCast' call
    return Array.isArray(obj);
  }
  function isInterface(obj, iface) {
    return isInterfaceImpl(obj, iface.$metadata$.iid);
  }
  function isInterfaceImpl(obj, iface) {
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp0_elvis_lhs = obj.$imask$;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var mask = tmp;
    return isBitSet(mask, iface);
  }
  function isArray(obj) {
    var tmp;
    if (isJsArray(obj)) {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = !obj.$type$;
    } else {
      tmp = false;
    }
    return tmp;
  }
  function isNumber(a) {
    var tmp;
    if (typeof a === 'number') {
      tmp = true;
    } else {
      tmp = a instanceof Long;
    }
    return tmp;
  }
  function isCharSequence(value) {
    return typeof value === 'string' || isInterface(value, CharSequence);
  }
  function isBooleanArray(a) {
    return isJsArray(a) && a.$type$ === 'BooleanArray';
  }
  function isByteArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Int8Array;
  }
  function isShortArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Int16Array;
  }
  function isCharArray(a) {
    var tmp;
    // Inline function 'kotlin.js.jsInstanceOf' call
    if (a instanceof Uint16Array) {
      tmp = a.$type$ === 'CharArray';
    } else {
      tmp = false;
    }
    return tmp;
  }
  function isIntArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Int32Array;
  }
  function isFloatArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Float32Array;
  }
  function isLongArray(a) {
    return isJsArray(a) && a.$type$ === 'LongArray';
  }
  function isDoubleArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Float64Array;
  }
  function calculateErrorInfo(proto) {
    var tmp0_safe_receiver = proto.constructor;
    var metadata = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.$metadata$;
    var tmp2_safe_receiver = metadata == null ? null : metadata.errorInfo;
    if (tmp2_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return tmp2_safe_receiver;
    }
    var result = 0;
    if (hasProp(proto, 'message'))
      result = result | 1;
    if (hasProp(proto, 'cause'))
      result = result | 2;
    if (!(result === 3)) {
      var parentProto = getPrototypeOf(proto);
      if (parentProto != Error.prototype) {
        result = result | calculateErrorInfo(parentProto);
      }
    }
    if (!(metadata == null)) {
      metadata.errorInfo = result;
    }
    return result;
  }
  function hasProp(proto, propName) {
    return proto.hasOwnProperty(propName);
  }
  function getPrototypeOf(obj) {
    return Object.getPrototypeOf(obj);
  }
  function get_VOID() {
    _init_properties_void_kt__3zg9as();
    return VOID;
  }
  var VOID;
  var properties_initialized_void_kt_e4ret2;
  function _init_properties_void_kt__3zg9as() {
    if (!properties_initialized_void_kt_e4ret2) {
      properties_initialized_void_kt_e4ret2 = true;
      VOID = void 0;
    }
  }
  function asList(_this__u8e3s4) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return new ArrayList(_this__u8e3s4);
  }
  function copyOf(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.require' call
    if (!(newSize >= 0)) {
      var message = 'Invalid new array size: ' + newSize + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return fillFrom(_this__u8e3s4, new Int32Array(newSize));
  }
  function copyOf_0(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.require' call
    if (!(newSize >= 0)) {
      var message = 'Invalid new array size: ' + newSize + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return arrayCopyResize(_this__u8e3s4, newSize, null);
  }
  function digitToIntImpl(_this__u8e3s4) {
    // Inline function 'kotlin.code' call
    var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
    var index = binarySearchRange(Digit_getInstance().l2_1, ch);
    var diff = ch - Digit_getInstance().l2_1[index] | 0;
    return diff < 10 ? diff : -1;
  }
  function binarySearchRange(array, needle) {
    var bottom = 0;
    var top = array.length - 1 | 0;
    var middle = -1;
    var value = 0;
    while (bottom <= top) {
      middle = (bottom + top | 0) / 2 | 0;
      value = array[middle];
      if (needle > value)
        bottom = middle + 1 | 0;
      else if (needle === value)
        return middle;
      else
        top = middle - 1 | 0;
    }
    return middle - (needle < value ? 1 : 0) | 0;
  }
  function Digit() {
    Digit_instance = this;
    var tmp = this;
    // Inline function 'kotlin.intArrayOf' call
    tmp.l2_1 = new Int32Array([48, 1632, 1776, 1984, 2406, 2534, 2662, 2790, 2918, 3046, 3174, 3302, 3430, 3558, 3664, 3792, 3872, 4160, 4240, 6112, 6160, 6470, 6608, 6784, 6800, 6992, 7088, 7232, 7248, 42528, 43216, 43264, 43472, 43504, 43600, 44016, 65296]);
  }
  var Digit_instance;
  function Digit_getInstance() {
    if (Digit_instance == null)
      new Digit();
    return Digit_instance;
  }
  function isWhitespaceImpl(_this__u8e3s4) {
    // Inline function 'kotlin.code' call
    var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
    return (9 <= ch ? ch <= 13 : false) || (28 <= ch ? ch <= 32 : false) || ch === 160 || (ch > 4096 && (ch === 5760 || (8192 <= ch ? ch <= 8202 : false) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288));
  }
  function isNaN_0(_this__u8e3s4) {
    return !(_this__u8e3s4 === _this__u8e3s4);
  }
  function isNaN_1(_this__u8e3s4) {
    return !(_this__u8e3s4 === _this__u8e3s4);
  }
  function takeHighestOneBit(_this__u8e3s4) {
    var tmp;
    if (_this__u8e3s4 === 0) {
      tmp = 0;
    } else {
      // Inline function 'kotlin.countLeadingZeroBits' call
      tmp = 1 << (31 - clz32(_this__u8e3s4) | 0);
    }
    return tmp;
  }
  function Unit() {
  }
  protoOf(Unit).toString = function () {
    return 'kotlin.Unit';
  };
  var Unit_instance;
  function Unit_getInstance() {
    return Unit_instance;
  }
  function collectionToArray(collection) {
    return collectionToArrayCommonImpl(collection);
  }
  function listOf(element) {
    return arrayListOf([element]);
  }
  function mapCapacity(expectedSize) {
    return expectedSize;
  }
  function setOf(element) {
    return hashSetOf([element]);
  }
  function checkIndexOverflow(index) {
    if (index < 0) {
      throwIndexOverflow();
    }
    return index;
  }
  function copyToArray(collection) {
    var tmp;
    // Inline function 'kotlin.js.asDynamic' call
    if (collection.toArray !== undefined) {
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = collection.toArray();
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = collectionToArray(collection);
    }
    return tmp;
  }
  function mapOf(pair) {
    return hashMapOf([pair]);
  }
  function checkCountOverflow(count) {
    if (count < 0) {
      throwCountOverflow();
    }
    return count;
  }
  function AbstractMutableCollection() {
    AbstractCollection.call(this);
  }
  protoOf(AbstractMutableCollection).m2 = function (element) {
    this.n2();
    var iterator = this.f();
    while (iterator.g()) {
      if (equals(iterator.h(), element)) {
        iterator.o2();
        return true;
      }
    }
    return false;
  };
  protoOf(AbstractMutableCollection).toJSON = function () {
    return this.toArray();
  };
  protoOf(AbstractMutableCollection).n2 = function () {
  };
  function IteratorImpl($outer) {
    this.r2_1 = $outer;
    this.p2_1 = 0;
    this.q2_1 = -1;
  }
  protoOf(IteratorImpl).g = function () {
    return this.p2_1 < this.r2_1.i();
  };
  protoOf(IteratorImpl).h = function () {
    if (!this.g())
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var _unary__edvuaz = this.p2_1;
    this.p2_1 = _unary__edvuaz + 1 | 0;
    tmp.q2_1 = _unary__edvuaz;
    return this.r2_1.j(this.q2_1);
  };
  protoOf(IteratorImpl).o2 = function () {
    // Inline function 'kotlin.check' call
    if (!!(this.q2_1 === -1)) {
      var message = 'Call next() or previous() before removing element from the iterator.';
      throw IllegalStateException_init_$Create$_0(toString_1(message));
    }
    this.r2_1.t2(this.q2_1);
    this.p2_1 = this.q2_1;
    this.q2_1 = -1;
  };
  function ListIteratorImpl($outer, index) {
    this.x2_1 = $outer;
    IteratorImpl.call(this, $outer);
    Companion_instance_5.z2(index, this.x2_1.i());
    this.p2_1 = index;
  }
  function AbstractMutableList() {
    AbstractMutableCollection.call(this);
    this.s2_1 = 0;
  }
  protoOf(AbstractMutableList).d = function (element) {
    this.n2();
    this.a3(this.i(), element);
    return true;
  };
  protoOf(AbstractMutableList).b3 = function () {
    this.n2();
    this.c3(0, this.i());
  };
  protoOf(AbstractMutableList).f = function () {
    return new IteratorImpl(this);
  };
  protoOf(AbstractMutableList).w = function (element) {
    return this.x(element) >= 0;
  };
  protoOf(AbstractMutableList).x = function (element) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.indexOfFirst' call
      var index = 0;
      var _iterator__ex2g4s = this.f();
      while (_iterator__ex2g4s.g()) {
        var item = _iterator__ex2g4s.h();
        if (equals(item, element)) {
          tmp$ret$1 = index;
          break $l$block;
        }
        index = index + 1 | 0;
      }
      tmp$ret$1 = -1;
    }
    return tmp$ret$1;
  };
  protoOf(AbstractMutableList).d3 = function (index) {
    return new ListIteratorImpl(this, index);
  };
  protoOf(AbstractMutableList).c3 = function (fromIndex, toIndex) {
    var iterator = this.d3(fromIndex);
    // Inline function 'kotlin.repeat' call
    var times = toIndex - fromIndex | 0;
    var inductionVariable = 0;
    if (inductionVariable < times)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        iterator.h();
        iterator.o2();
      }
       while (inductionVariable < times);
  };
  protoOf(AbstractMutableList).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtList) : false))
      return false;
    return Companion_instance_5.e3(this, other);
  };
  protoOf(AbstractMutableList).hashCode = function () {
    return Companion_instance_5.f3(this);
  };
  function AbstractMutableMap() {
    AbstractMap.call(this);
    this.i3_1 = null;
    this.j3_1 = null;
  }
  protoOf(AbstractMutableMap).k3 = function () {
    return new HashMapKeysDefault(this);
  };
  protoOf(AbstractMutableMap).l3 = function () {
    return new HashMapValuesDefault(this);
  };
  protoOf(AbstractMutableMap).e1 = function () {
    var tmp0_elvis_lhs = this.i3_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.also' call
      var this_0 = this.k3();
      this.i3_1 = this_0;
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(AbstractMutableMap).f1 = function () {
    var tmp0_elvis_lhs = this.j3_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.also' call
      var this_0 = this.l3();
      this.j3_1 = this_0;
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(AbstractMutableMap).m3 = function (key) {
    this.n2();
    var iter = this.g1().f();
    while (iter.g()) {
      var entry = iter.h();
      var k = entry.z();
      if (equals(key, k)) {
        var value = entry.a1();
        iter.o2();
        return value;
      }
    }
    return null;
  };
  protoOf(AbstractMutableMap).n2 = function () {
  };
  function AbstractMutableSet() {
    AbstractMutableCollection.call(this);
  }
  protoOf(AbstractMutableSet).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtSet) : false))
      return false;
    return Companion_instance_7.q3(this, other);
  };
  protoOf(AbstractMutableSet).hashCode = function () {
    return Companion_instance_7.r3(this);
  };
  function arrayOfUninitializedElements(capacity) {
    // Inline function 'kotlin.require' call
    if (!(capacity >= 0)) {
      var message = 'capacity must be non-negative.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.arrayOfNulls' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return Array(capacity);
  }
  function resetRange(_this__u8e3s4, fromIndex, toIndex) {
    // Inline function 'kotlin.js.nativeFill' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.fill(null, fromIndex, toIndex);
  }
  function copyOfUninitializedElements(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return copyOf_0(_this__u8e3s4, newSize);
  }
  function resetAt(_this__u8e3s4, index) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4[index] = null;
  }
  function Companion_2() {
    Companion_instance_2 = this;
    var tmp = this;
    // Inline function 'kotlin.also' call
    var this_0 = ArrayList_init_$Create$_0(0);
    this_0.u_1 = true;
    tmp.s3_1 = this_0;
  }
  var Companion_instance_2;
  function Companion_getInstance_2() {
    if (Companion_instance_2 == null)
      new Companion_2();
    return Companion_instance_2;
  }
  function ArrayList_init_$Init$($this) {
    // Inline function 'kotlin.emptyArray' call
    var tmp$ret$0 = [];
    ArrayList.call($this, tmp$ret$0);
    return $this;
  }
  function ArrayList_init_$Create$() {
    return ArrayList_init_$Init$(objectCreate(protoOf(ArrayList)));
  }
  function ArrayList_init_$Init$_0(initialCapacity, $this) {
    // Inline function 'kotlin.emptyArray' call
    var tmp$ret$0 = [];
    ArrayList.call($this, tmp$ret$0);
    // Inline function 'kotlin.require' call
    if (!(initialCapacity >= 0)) {
      var message = 'Negative initial capacity: ' + initialCapacity;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return $this;
  }
  function ArrayList_init_$Create$_0(initialCapacity) {
    return ArrayList_init_$Init$_0(initialCapacity, objectCreate(protoOf(ArrayList)));
  }
  function ArrayList_init_$Init$_1(elements, $this) {
    // Inline function 'kotlin.collections.toTypedArray' call
    var tmp$ret$0 = copyToArray(elements);
    ArrayList.call($this, tmp$ret$0);
    return $this;
  }
  function ArrayList_init_$Create$_1(elements) {
    return ArrayList_init_$Init$_1(elements, objectCreate(protoOf(ArrayList)));
  }
  function rangeCheck($this, index) {
    // Inline function 'kotlin.apply' call
    Companion_instance_5.t3(index, $this.i());
    return index;
  }
  function insertionRangeCheck($this, index) {
    // Inline function 'kotlin.apply' call
    Companion_instance_5.z2(index, $this.i());
    return index;
  }
  function ArrayList(array) {
    Companion_getInstance_2();
    AbstractMutableList.call(this);
    this.t_1 = array;
    this.u_1 = false;
  }
  protoOf(ArrayList).i = function () {
    return this.t_1.length;
  };
  protoOf(ArrayList).j = function (index) {
    var tmp = this.t_1[rangeCheck(this, index)];
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayList).u3 = function (index, element) {
    this.n2();
    rangeCheck(this, index);
    // Inline function 'kotlin.apply' call
    var this_0 = this.t_1[index];
    this.t_1[index] = element;
    var tmp = this_0;
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayList).d = function (element) {
    this.n2();
    // Inline function 'kotlin.js.asDynamic' call
    this.t_1.push(element);
    this.s2_1 = this.s2_1 + 1 | 0;
    return true;
  };
  protoOf(ArrayList).a3 = function (index, element) {
    this.n2();
    // Inline function 'kotlin.js.asDynamic' call
    this.t_1.splice(insertionRangeCheck(this, index), 0, element);
    this.s2_1 = this.s2_1 + 1 | 0;
  };
  protoOf(ArrayList).t2 = function (index) {
    this.n2();
    rangeCheck(this, index);
    this.s2_1 = this.s2_1 + 1 | 0;
    var tmp;
    if (index === get_lastIndex(this)) {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = this.t_1.pop();
    } else {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = this.t_1.splice(index, 1)[0];
    }
    return tmp;
  };
  protoOf(ArrayList).c3 = function (fromIndex, toIndex) {
    this.n2();
    this.s2_1 = this.s2_1 + 1 | 0;
    // Inline function 'kotlin.js.asDynamic' call
    this.t_1.splice(fromIndex, toIndex - fromIndex | 0);
  };
  protoOf(ArrayList).b3 = function () {
    this.n2();
    var tmp = this;
    // Inline function 'kotlin.emptyArray' call
    tmp.t_1 = [];
    this.s2_1 = this.s2_1 + 1 | 0;
  };
  protoOf(ArrayList).x = function (element) {
    return indexOf(this.t_1, element);
  };
  protoOf(ArrayList).toString = function () {
    return arrayToString(this.t_1);
  };
  protoOf(ArrayList).v3 = function () {
    return [].slice.call(this.t_1);
  };
  protoOf(ArrayList).toArray = function () {
    return this.v3();
  };
  protoOf(ArrayList).n2 = function () {
    if (this.u_1)
      throw UnsupportedOperationException_init_$Create$();
  };
  function HashMap_init_$Init$(internalMap, $this) {
    AbstractMutableMap.call($this);
    HashMap.call($this);
    $this.a4_1 = internalMap;
    return $this;
  }
  function HashMap_init_$Init$_0($this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$(), $this);
    return $this;
  }
  function HashMap_init_$Create$() {
    return HashMap_init_$Init$_0(objectCreate(protoOf(HashMap)));
  }
  function HashMap_init_$Init$_1(initialCapacity, loadFactor, $this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$_2(initialCapacity, loadFactor), $this);
    return $this;
  }
  function HashMap_init_$Init$_2(initialCapacity, $this) {
    HashMap_init_$Init$_1(initialCapacity, 1.0, $this);
    return $this;
  }
  function HashMap_init_$Create$_0(initialCapacity) {
    return HashMap_init_$Init$_2(initialCapacity, objectCreate(protoOf(HashMap)));
  }
  function HashMap_init_$Init$_3(original, $this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$_1(original), $this);
    return $this;
  }
  protoOf(HashMap).b1 = function (key) {
    return this.a4_1.c4(key);
  };
  protoOf(HashMap).c1 = function (value) {
    return this.a4_1.c1(value);
  };
  protoOf(HashMap).k3 = function () {
    return new HashMapKeys(this.a4_1);
  };
  protoOf(HashMap).l3 = function () {
    return new HashMapValues(this.a4_1);
  };
  protoOf(HashMap).g1 = function () {
    var tmp0_elvis_lhs = this.b4_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.also' call
      var this_0 = new HashMapEntrySet(this.a4_1);
      this.b4_1 = this_0;
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(HashMap).d1 = function (key) {
    return this.a4_1.d1(key);
  };
  protoOf(HashMap).k2 = function (key, value) {
    return this.a4_1.k2(key, value);
  };
  protoOf(HashMap).m3 = function (key) {
    return this.a4_1.m3(key);
  };
  protoOf(HashMap).i = function () {
    return this.a4_1.i();
  };
  function HashMap() {
    this.b4_1 = null;
  }
  function HashMapKeys(backing) {
    AbstractMutableSet.call(this);
    this.d4_1 = backing;
  }
  protoOf(HashMapKeys).i = function () {
    return this.d4_1.i();
  };
  protoOf(HashMapKeys).k = function () {
    return this.d4_1.i() === 0;
  };
  protoOf(HashMapKeys).w = function (element) {
    return this.d4_1.c4(element);
  };
  protoOf(HashMapKeys).d = function (element) {
    throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(HashMapKeys).m2 = function (element) {
    return this.d4_1.e4(element);
  };
  protoOf(HashMapKeys).f = function () {
    return this.d4_1.f4();
  };
  protoOf(HashMapKeys).n2 = function () {
    return this.d4_1.g4();
  };
  function HashMapValues(backing) {
    AbstractMutableCollection.call(this);
    this.h4_1 = backing;
  }
  protoOf(HashMapValues).i = function () {
    return this.h4_1.i();
  };
  protoOf(HashMapValues).k = function () {
    return this.h4_1.i() === 0;
  };
  protoOf(HashMapValues).i4 = function (element) {
    return this.h4_1.c1(element);
  };
  protoOf(HashMapValues).w = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.i4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapValues).j4 = function (element) {
    throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(HashMapValues).d = function (element) {
    return this.j4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapValues).f = function () {
    return this.h4_1.k4();
  };
  protoOf(HashMapValues).n2 = function () {
    return this.h4_1.g4();
  };
  function HashMapEntrySet(backing) {
    HashMapEntrySetBase.call(this, backing);
  }
  protoOf(HashMapEntrySet).f = function () {
    return this.m4_1.n4();
  };
  function HashMapEntrySetBase(backing) {
    AbstractMutableSet.call(this);
    this.m4_1 = backing;
  }
  protoOf(HashMapEntrySetBase).i = function () {
    return this.m4_1.i();
  };
  protoOf(HashMapEntrySetBase).k = function () {
    return this.m4_1.i() === 0;
  };
  protoOf(HashMapEntrySetBase).o4 = function (element) {
    return this.m4_1.r4(element);
  };
  protoOf(HashMapEntrySetBase).w = function (element) {
    if (!(!(element == null) ? isInterface(element, Entry) : false))
      return false;
    return this.o4((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
  };
  protoOf(HashMapEntrySetBase).p4 = function (element) {
    throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(HashMapEntrySetBase).d = function (element) {
    return this.p4((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
  };
  protoOf(HashMapEntrySetBase).q4 = function (element) {
    return this.m4_1.s4(element);
  };
  protoOf(HashMapEntrySetBase).m2 = function (element) {
    if (!(!(element == null) ? isInterface(element, Entry) : false))
      return false;
    return this.q4((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
  };
  protoOf(HashMapEntrySetBase).y = function (elements) {
    return this.m4_1.t4(elements);
  };
  protoOf(HashMapEntrySetBase).n2 = function () {
    return this.m4_1.g4();
  };
  function HashMapKeysDefault$iterator$1($entryIterator) {
    this.u4_1 = $entryIterator;
  }
  protoOf(HashMapKeysDefault$iterator$1).g = function () {
    return this.u4_1.g();
  };
  protoOf(HashMapKeysDefault$iterator$1).h = function () {
    return this.u4_1.h().z();
  };
  protoOf(HashMapKeysDefault$iterator$1).o2 = function () {
    return this.u4_1.o2();
  };
  function HashMapKeysDefault(backingMap) {
    AbstractMutableSet.call(this);
    this.v4_1 = backingMap;
  }
  protoOf(HashMapKeysDefault).w4 = function (element) {
    throw UnsupportedOperationException_init_$Create$_0('Add is not supported on keys');
  };
  protoOf(HashMapKeysDefault).d = function (element) {
    return this.w4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapKeysDefault).c4 = function (element) {
    return this.v4_1.b1(element);
  };
  protoOf(HashMapKeysDefault).w = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.c4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapKeysDefault).f = function () {
    var entryIterator = this.v4_1.g1().f();
    return new HashMapKeysDefault$iterator$1(entryIterator);
  };
  protoOf(HashMapKeysDefault).m3 = function (element) {
    this.n2();
    if (this.v4_1.b1(element)) {
      this.v4_1.m3(element);
      return true;
    }
    return false;
  };
  protoOf(HashMapKeysDefault).m2 = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.m3((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapKeysDefault).i = function () {
    return this.v4_1.i();
  };
  protoOf(HashMapKeysDefault).n2 = function () {
    return this.v4_1.n2();
  };
  function HashMapValuesDefault$iterator$1($entryIterator) {
    this.x4_1 = $entryIterator;
  }
  protoOf(HashMapValuesDefault$iterator$1).g = function () {
    return this.x4_1.g();
  };
  protoOf(HashMapValuesDefault$iterator$1).h = function () {
    return this.x4_1.h().a1();
  };
  protoOf(HashMapValuesDefault$iterator$1).o2 = function () {
    return this.x4_1.o2();
  };
  function HashMapValuesDefault(backingMap) {
    AbstractMutableCollection.call(this);
    this.y4_1 = backingMap;
  }
  protoOf(HashMapValuesDefault).j4 = function (element) {
    throw UnsupportedOperationException_init_$Create$_0('Add is not supported on values');
  };
  protoOf(HashMapValuesDefault).d = function (element) {
    return this.j4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapValuesDefault).i4 = function (element) {
    return this.y4_1.c1(element);
  };
  protoOf(HashMapValuesDefault).w = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.i4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapValuesDefault).f = function () {
    var entryIterator = this.y4_1.g1().f();
    return new HashMapValuesDefault$iterator$1(entryIterator);
  };
  protoOf(HashMapValuesDefault).i = function () {
    return this.y4_1.i();
  };
  protoOf(HashMapValuesDefault).n2 = function () {
    return this.y4_1.n2();
  };
  function HashSet_init_$Init$(map, $this) {
    AbstractMutableSet.call($this);
    HashSet.call($this);
    $this.z4_1 = map;
    return $this;
  }
  function HashSet_init_$Init$_0($this) {
    HashSet_init_$Init$(InternalHashMap_init_$Create$(), $this);
    return $this;
  }
  function HashSet_init_$Create$() {
    return HashSet_init_$Init$_0(objectCreate(protoOf(HashSet)));
  }
  function HashSet_init_$Init$_1(initialCapacity, loadFactor, $this) {
    HashSet_init_$Init$(InternalHashMap_init_$Create$_2(initialCapacity, loadFactor), $this);
    return $this;
  }
  function HashSet_init_$Init$_2(initialCapacity, $this) {
    HashSet_init_$Init$_1(initialCapacity, 1.0, $this);
    return $this;
  }
  function HashSet_init_$Create$_0(initialCapacity) {
    return HashSet_init_$Init$_2(initialCapacity, objectCreate(protoOf(HashSet)));
  }
  protoOf(HashSet).d = function (element) {
    return this.z4_1.k2(element, true) == null;
  };
  protoOf(HashSet).w = function (element) {
    return this.z4_1.c4(element);
  };
  protoOf(HashSet).k = function () {
    return this.z4_1.i() === 0;
  };
  protoOf(HashSet).f = function () {
    return this.z4_1.f4();
  };
  protoOf(HashSet).m2 = function (element) {
    return !(this.z4_1.m3(element) == null);
  };
  protoOf(HashSet).i = function () {
    return this.z4_1.i();
  };
  function HashSet() {
  }
  function computeHashSize($this, capacity) {
    return takeHighestOneBit(imul(coerceAtLeast(capacity, 1), 3));
  }
  function computeShift($this, hashSize) {
    // Inline function 'kotlin.countLeadingZeroBits' call
    return clz32(hashSize) + 1 | 0;
  }
  function checkForComodification($this) {
    if (!($this.k5_1.h5_1 === $this.m5_1))
      throw ConcurrentModificationException_init_$Create$_0('The backing map has been modified after this entry was obtained.');
  }
  function InternalHashMap_init_$Init$($this) {
    InternalHashMap_init_$Init$_0(8, $this);
    return $this;
  }
  function InternalHashMap_init_$Create$() {
    return InternalHashMap_init_$Init$(objectCreate(protoOf(InternalHashMap)));
  }
  function InternalHashMap_init_$Init$_0(initialCapacity, $this) {
    InternalHashMap.call($this, arrayOfUninitializedElements(initialCapacity), null, new Int32Array(initialCapacity), new Int32Array(computeHashSize(Companion_instance_3, initialCapacity)), 2, 0);
    return $this;
  }
  function InternalHashMap_init_$Create$_0(initialCapacity) {
    return InternalHashMap_init_$Init$_0(initialCapacity, objectCreate(protoOf(InternalHashMap)));
  }
  function InternalHashMap_init_$Init$_1(original, $this) {
    InternalHashMap_init_$Init$_0(original.i(), $this);
    $this.n5(original);
    return $this;
  }
  function InternalHashMap_init_$Create$_1(original) {
    return InternalHashMap_init_$Init$_1(original, objectCreate(protoOf(InternalHashMap)));
  }
  function InternalHashMap_init_$Init$_2(initialCapacity, loadFactor, $this) {
    InternalHashMap_init_$Init$_0(initialCapacity, $this);
    // Inline function 'kotlin.require' call
    if (!(loadFactor > 0)) {
      var message = 'Non-positive load factor: ' + loadFactor;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return $this;
  }
  function InternalHashMap_init_$Create$_2(initialCapacity, loadFactor) {
    return InternalHashMap_init_$Init$_2(initialCapacity, loadFactor, objectCreate(protoOf(InternalHashMap)));
  }
  function _get_capacity__a9k9f3($this) {
    return $this.a5_1.length;
  }
  function _get_hashSize__tftcho($this) {
    return $this.d5_1.length;
  }
  function registerModification($this) {
    $this.h5_1 = $this.h5_1 + 1 | 0;
  }
  function ensureExtraCapacity($this, n) {
    if (shouldCompact($this, n)) {
      compact($this, true);
    } else {
      ensureCapacity($this, $this.f5_1 + n | 0);
    }
  }
  function shouldCompact($this, extraCapacity) {
    var spareCapacity = _get_capacity__a9k9f3($this) - $this.f5_1 | 0;
    var gaps = $this.f5_1 - $this.i() | 0;
    return spareCapacity < extraCapacity && (gaps + spareCapacity | 0) >= extraCapacity && gaps >= (_get_capacity__a9k9f3($this) / 4 | 0);
  }
  function ensureCapacity($this, minCapacity) {
    if (minCapacity < 0)
      throw RuntimeException_init_$Create$_0('too many elements');
    if (minCapacity > _get_capacity__a9k9f3($this)) {
      var newSize = Companion_instance_5.o5(_get_capacity__a9k9f3($this), minCapacity);
      $this.a5_1 = copyOfUninitializedElements($this.a5_1, newSize);
      var tmp = $this;
      var tmp0_safe_receiver = $this.b5_1;
      tmp.b5_1 = tmp0_safe_receiver == null ? null : copyOfUninitializedElements(tmp0_safe_receiver, newSize);
      $this.c5_1 = copyOf($this.c5_1, newSize);
      var newHashSize = computeHashSize(Companion_instance_3, newSize);
      if (newHashSize > _get_hashSize__tftcho($this)) {
        rehash($this, newHashSize);
      }
    }
  }
  function allocateValuesArray($this) {
    var curValuesArray = $this.b5_1;
    if (!(curValuesArray == null))
      return curValuesArray;
    var newValuesArray = arrayOfUninitializedElements(_get_capacity__a9k9f3($this));
    $this.b5_1 = newValuesArray;
    return newValuesArray;
  }
  function hash($this, key) {
    return key == null ? 0 : imul(hashCode(key), -1640531527) >>> $this.g5_1 | 0;
  }
  function compact($this, updateHashArray) {
    var i = 0;
    var j = 0;
    var valuesArray = $this.b5_1;
    while (i < $this.f5_1) {
      var hash = $this.c5_1[i];
      if (hash >= 0) {
        $this.a5_1[j] = $this.a5_1[i];
        if (!(valuesArray == null)) {
          valuesArray[j] = valuesArray[i];
        }
        if (updateHashArray) {
          $this.c5_1[j] = hash;
          $this.d5_1[hash] = j + 1 | 0;
        }
        j = j + 1 | 0;
      }
      i = i + 1 | 0;
    }
    resetRange($this.a5_1, j, $this.f5_1);
    if (valuesArray == null)
      null;
    else {
      resetRange(valuesArray, j, $this.f5_1);
    }
    $this.f5_1 = j;
  }
  function rehash($this, newHashSize) {
    registerModification($this);
    if ($this.f5_1 > $this.i5_1) {
      compact($this, false);
    }
    $this.d5_1 = new Int32Array(newHashSize);
    $this.g5_1 = computeShift(Companion_instance_3, newHashSize);
    var i = 0;
    while (i < $this.f5_1) {
      var _unary__edvuaz = i;
      i = _unary__edvuaz + 1 | 0;
      if (!putRehash($this, _unary__edvuaz)) {
        throw IllegalStateException_init_$Create$_0('This cannot happen with fixed magic multiplier and grow-only hash array. Have object hashCodes changed?');
      }
    }
  }
  function putRehash($this, i) {
    var hash_0 = hash($this, $this.a5_1[i]);
    var probesLeft = $this.e5_1;
    while (true) {
      var index = $this.d5_1[hash_0];
      if (index === 0) {
        $this.d5_1[hash_0] = i + 1 | 0;
        $this.c5_1[i] = hash_0;
        return true;
      }
      probesLeft = probesLeft - 1 | 0;
      if (probesLeft < 0)
        return false;
      var _unary__edvuaz = hash_0;
      hash_0 = _unary__edvuaz - 1 | 0;
      if (_unary__edvuaz === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
    }
  }
  function findKey($this, key) {
    var hash_0 = hash($this, key);
    var probesLeft = $this.e5_1;
    while (true) {
      var index = $this.d5_1[hash_0];
      if (index === 0)
        return -1;
      if (index > 0 && equals($this.a5_1[index - 1 | 0], key))
        return index - 1 | 0;
      probesLeft = probesLeft - 1 | 0;
      if (probesLeft < 0)
        return -1;
      var _unary__edvuaz = hash_0;
      hash_0 = _unary__edvuaz - 1 | 0;
      if (_unary__edvuaz === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
    }
  }
  function findValue($this, value) {
    var i = $this.f5_1;
    $l$loop: while (true) {
      i = i - 1 | 0;
      if (!(i >= 0)) {
        break $l$loop;
      }
      if ($this.c5_1[i] >= 0 && equals(ensureNotNull($this.b5_1)[i], value))
        return i;
    }
    return -1;
  }
  function addKey($this, key) {
    $this.g4();
    retry: while (true) {
      var hash_0 = hash($this, key);
      var tentativeMaxProbeDistance = coerceAtMost(imul($this.e5_1, 2), _get_hashSize__tftcho($this) / 2 | 0);
      var probeDistance = 0;
      while (true) {
        var index = $this.d5_1[hash_0];
        if (index <= 0) {
          if ($this.f5_1 >= _get_capacity__a9k9f3($this)) {
            ensureExtraCapacity($this, 1);
            continue retry;
          }
          var _unary__edvuaz = $this.f5_1;
          $this.f5_1 = _unary__edvuaz + 1 | 0;
          var putIndex = _unary__edvuaz;
          $this.a5_1[putIndex] = key;
          $this.c5_1[putIndex] = hash_0;
          $this.d5_1[hash_0] = putIndex + 1 | 0;
          $this.i5_1 = $this.i5_1 + 1 | 0;
          registerModification($this);
          if (probeDistance > $this.e5_1)
            $this.e5_1 = probeDistance;
          return putIndex;
        }
        if (equals($this.a5_1[index - 1 | 0], key)) {
          return -index | 0;
        }
        probeDistance = probeDistance + 1 | 0;
        if (probeDistance > tentativeMaxProbeDistance) {
          rehash($this, imul(_get_hashSize__tftcho($this), 2));
          continue retry;
        }
        var _unary__edvuaz_0 = hash_0;
        hash_0 = _unary__edvuaz_0 - 1 | 0;
        if (_unary__edvuaz_0 === 0)
          hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
      }
    }
  }
  function removeEntryAt($this, index) {
    resetAt($this.a5_1, index);
    var tmp0_safe_receiver = $this.b5_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      resetAt(tmp0_safe_receiver, index);
    }
    removeHashAt($this, $this.c5_1[index]);
    $this.c5_1[index] = -1;
    $this.i5_1 = $this.i5_1 - 1 | 0;
    registerModification($this);
  }
  function removeHashAt($this, removedHash) {
    var hash_0 = removedHash;
    var hole = removedHash;
    var probeDistance = 0;
    var patchAttemptsLeft = coerceAtMost(imul($this.e5_1, 2), _get_hashSize__tftcho($this) / 2 | 0);
    while (true) {
      var _unary__edvuaz = hash_0;
      hash_0 = _unary__edvuaz - 1 | 0;
      if (_unary__edvuaz === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
      probeDistance = probeDistance + 1 | 0;
      if (probeDistance > $this.e5_1) {
        $this.d5_1[hole] = 0;
        return Unit_instance;
      }
      var index = $this.d5_1[hash_0];
      if (index === 0) {
        $this.d5_1[hole] = 0;
        return Unit_instance;
      }
      if (index < 0) {
        $this.d5_1[hole] = -1;
        hole = hash_0;
        probeDistance = 0;
      } else {
        var otherHash = hash($this, $this.a5_1[index - 1 | 0]);
        if (((otherHash - hash_0 | 0) & (_get_hashSize__tftcho($this) - 1 | 0)) >= probeDistance) {
          $this.d5_1[hole] = index;
          $this.c5_1[index - 1 | 0] = hole;
          hole = hash_0;
          probeDistance = 0;
        }
      }
      patchAttemptsLeft = patchAttemptsLeft - 1 | 0;
      if (patchAttemptsLeft < 0) {
        $this.d5_1[hole] = -1;
        return Unit_instance;
      }
    }
  }
  function contentEquals($this, other) {
    return $this.i5_1 === other.i() && $this.t4(other.g1());
  }
  function putEntry($this, entry) {
    var index = addKey($this, entry.z());
    var valuesArray = allocateValuesArray($this);
    if (index >= 0) {
      valuesArray[index] = entry.a1();
      return true;
    }
    var oldValue = valuesArray[(-index | 0) - 1 | 0];
    if (!equals(entry.a1(), oldValue)) {
      valuesArray[(-index | 0) - 1 | 0] = entry.a1();
      return true;
    }
    return false;
  }
  function putAllEntries($this, from) {
    if (from.k())
      return false;
    ensureExtraCapacity($this, from.i());
    var it = from.f();
    var updated = false;
    while (it.g()) {
      if (putEntry($this, it.h()))
        updated = true;
    }
    return updated;
  }
  function Companion_3() {
    this.p5_1 = -1640531527;
    this.q5_1 = 8;
    this.r5_1 = 2;
    this.s5_1 = -1;
  }
  var Companion_instance_3;
  function Companion_getInstance_3() {
    return Companion_instance_3;
  }
  function Itr(map) {
    this.t5_1 = map;
    this.u5_1 = 0;
    this.v5_1 = -1;
    this.w5_1 = this.t5_1.h5_1;
    this.x5();
  }
  protoOf(Itr).x5 = function () {
    while (this.u5_1 < this.t5_1.f5_1 && this.t5_1.c5_1[this.u5_1] < 0) {
      this.u5_1 = this.u5_1 + 1 | 0;
    }
  };
  protoOf(Itr).g = function () {
    return this.u5_1 < this.t5_1.f5_1;
  };
  protoOf(Itr).o2 = function () {
    this.y5();
    // Inline function 'kotlin.check' call
    if (!!(this.v5_1 === -1)) {
      var message = 'Call next() before removing element from the iterator.';
      throw IllegalStateException_init_$Create$_0(toString_1(message));
    }
    this.t5_1.g4();
    removeEntryAt(this.t5_1, this.v5_1);
    this.v5_1 = -1;
    this.w5_1 = this.t5_1.h5_1;
  };
  protoOf(Itr).y5 = function () {
    if (!(this.t5_1.h5_1 === this.w5_1))
      throw ConcurrentModificationException_init_$Create$();
  };
  function KeysItr(map) {
    Itr.call(this, map);
  }
  protoOf(KeysItr).h = function () {
    this.y5();
    if (this.u5_1 >= this.t5_1.f5_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var _unary__edvuaz = this.u5_1;
    this.u5_1 = _unary__edvuaz + 1 | 0;
    tmp.v5_1 = _unary__edvuaz;
    var result = this.t5_1.a5_1[this.v5_1];
    this.x5();
    return result;
  };
  function ValuesItr(map) {
    Itr.call(this, map);
  }
  protoOf(ValuesItr).h = function () {
    this.y5();
    if (this.u5_1 >= this.t5_1.f5_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var _unary__edvuaz = this.u5_1;
    this.u5_1 = _unary__edvuaz + 1 | 0;
    tmp.v5_1 = _unary__edvuaz;
    var result = ensureNotNull(this.t5_1.b5_1)[this.v5_1];
    this.x5();
    return result;
  };
  function EntriesItr(map) {
    Itr.call(this, map);
  }
  protoOf(EntriesItr).h = function () {
    this.y5();
    if (this.u5_1 >= this.t5_1.f5_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var _unary__edvuaz = this.u5_1;
    this.u5_1 = _unary__edvuaz + 1 | 0;
    tmp.v5_1 = _unary__edvuaz;
    var result = new EntryRef(this.t5_1, this.v5_1);
    this.x5();
    return result;
  };
  protoOf(EntriesItr).l6 = function () {
    if (this.u5_1 >= this.t5_1.f5_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var _unary__edvuaz = this.u5_1;
    this.u5_1 = _unary__edvuaz + 1 | 0;
    tmp.v5_1 = _unary__edvuaz;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver = this.t5_1.a5_1[this.v5_1];
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
    var tmp_0 = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver_0 = ensureNotNull(this.t5_1.b5_1)[this.v5_1];
    var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
    var result = tmp_0 ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
    this.x5();
    return result;
  };
  protoOf(EntriesItr).m6 = function (sb) {
    if (this.u5_1 >= this.t5_1.f5_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var _unary__edvuaz = this.u5_1;
    this.u5_1 = _unary__edvuaz + 1 | 0;
    tmp.v5_1 = _unary__edvuaz;
    var key = this.t5_1.a5_1[this.v5_1];
    if (equals(key, this.t5_1))
      sb.p6('(this Map)');
    else
      sb.o6(key);
    sb.q6(_Char___init__impl__6a9atx(61));
    var value = ensureNotNull(this.t5_1.b5_1)[this.v5_1];
    if (equals(value, this.t5_1))
      sb.p6('(this Map)');
    else
      sb.o6(value);
    this.x5();
  };
  function EntryRef(map, index) {
    this.k5_1 = map;
    this.l5_1 = index;
    this.m5_1 = this.k5_1.h5_1;
  }
  protoOf(EntryRef).z = function () {
    checkForComodification(this);
    return this.k5_1.a5_1[this.l5_1];
  };
  protoOf(EntryRef).a1 = function () {
    checkForComodification(this);
    return ensureNotNull(this.k5_1.b5_1)[this.l5_1];
  };
  protoOf(EntryRef).equals = function (other) {
    var tmp;
    var tmp_0;
    if (!(other == null) ? isInterface(other, Entry) : false) {
      tmp_0 = equals(other.z(), this.z());
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      tmp = equals(other.a1(), this.a1());
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EntryRef).hashCode = function () {
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver = this.z();
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
    var tmp = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver_0 = this.a1();
    var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
    return tmp ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
  };
  protoOf(EntryRef).toString = function () {
    return toString_0(this.z()) + '=' + toString_0(this.a1());
  };
  function InternalHashMap(keysArray, valuesArray, presenceArray, hashArray, maxProbeDistance, length) {
    this.a5_1 = keysArray;
    this.b5_1 = valuesArray;
    this.c5_1 = presenceArray;
    this.d5_1 = hashArray;
    this.e5_1 = maxProbeDistance;
    this.f5_1 = length;
    this.g5_1 = computeShift(Companion_instance_3, _get_hashSize__tftcho(this));
    this.h5_1 = 0;
    this.i5_1 = 0;
    this.j5_1 = false;
  }
  protoOf(InternalHashMap).i = function () {
    return this.i5_1;
  };
  protoOf(InternalHashMap).r6 = function () {
    this.g4();
    this.j5_1 = true;
  };
  protoOf(InternalHashMap).c1 = function (value) {
    return findValue(this, value) >= 0;
  };
  protoOf(InternalHashMap).d1 = function (key) {
    var index = findKey(this, key);
    if (index < 0)
      return null;
    return ensureNotNull(this.b5_1)[index];
  };
  protoOf(InternalHashMap).c4 = function (key) {
    return findKey(this, key) >= 0;
  };
  protoOf(InternalHashMap).k2 = function (key, value) {
    var index = addKey(this, key);
    var valuesArray = allocateValuesArray(this);
    if (index < 0) {
      var oldValue = valuesArray[(-index | 0) - 1 | 0];
      valuesArray[(-index | 0) - 1 | 0] = value;
      return oldValue;
    } else {
      valuesArray[index] = value;
      return null;
    }
  };
  protoOf(InternalHashMap).n5 = function (from) {
    this.g4();
    putAllEntries(this, from.g1());
  };
  protoOf(InternalHashMap).m3 = function (key) {
    this.g4();
    var index = findKey(this, key);
    if (index < 0)
      return null;
    var oldValue = ensureNotNull(this.b5_1)[index];
    removeEntryAt(this, index);
    return oldValue;
  };
  protoOf(InternalHashMap).equals = function (other) {
    var tmp;
    if (other === this) {
      tmp = true;
    } else {
      var tmp_0;
      if (!(other == null) ? isInterface(other, KtMap) : false) {
        tmp_0 = contentEquals(this, other);
      } else {
        tmp_0 = false;
      }
      tmp = tmp_0;
    }
    return tmp;
  };
  protoOf(InternalHashMap).hashCode = function () {
    var result = 0;
    var it = this.n4();
    while (it.g()) {
      result = result + it.l6() | 0;
    }
    return result;
  };
  protoOf(InternalHashMap).toString = function () {
    var sb = StringBuilder_init_$Create$(2 + imul(this.i5_1, 3) | 0);
    sb.p6('{');
    var i = 0;
    var it = this.n4();
    while (it.g()) {
      if (i > 0) {
        sb.p6(', ');
      }
      it.m6(sb);
      i = i + 1 | 0;
    }
    sb.p6('}');
    return sb.toString();
  };
  protoOf(InternalHashMap).g4 = function () {
    if (this.j5_1)
      throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(InternalHashMap).e4 = function (key) {
    this.g4();
    var index = findKey(this, key);
    if (index < 0)
      return false;
    removeEntryAt(this, index);
    return true;
  };
  protoOf(InternalHashMap).r4 = function (entry) {
    var index = findKey(this, entry.z());
    if (index < 0)
      return false;
    return equals(ensureNotNull(this.b5_1)[index], entry.a1());
  };
  protoOf(InternalHashMap).s6 = function (entry) {
    return this.r4(isInterface(entry, Entry) ? entry : THROW_CCE());
  };
  protoOf(InternalHashMap).s4 = function (entry) {
    this.g4();
    var index = findKey(this, entry.z());
    if (index < 0)
      return false;
    if (!equals(ensureNotNull(this.b5_1)[index], entry.a1()))
      return false;
    removeEntryAt(this, index);
    return true;
  };
  protoOf(InternalHashMap).f4 = function () {
    return new KeysItr(this);
  };
  protoOf(InternalHashMap).k4 = function () {
    return new ValuesItr(this);
  };
  protoOf(InternalHashMap).n4 = function () {
    return new EntriesItr(this);
  };
  function InternalMap() {
  }
  function LinkedHashMap_init_$Init$($this) {
    HashMap_init_$Init$_0($this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$() {
    return LinkedHashMap_init_$Init$(objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap_init_$Init$_0(initialCapacity, $this) {
    HashMap_init_$Init$_2(initialCapacity, $this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$_0(initialCapacity) {
    return LinkedHashMap_init_$Init$_0(initialCapacity, objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap_init_$Init$_1(original, $this) {
    HashMap_init_$Init$_3(original, $this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$_1(original) {
    return LinkedHashMap_init_$Init$_1(original, objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap_init_$Init$_2(internalMap, $this) {
    HashMap_init_$Init$(internalMap, $this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$_2(internalMap) {
    return LinkedHashMap_init_$Init$_2(internalMap, objectCreate(protoOf(LinkedHashMap)));
  }
  function EmptyHolder() {
    EmptyHolder_instance = this;
    var tmp = this;
    // Inline function 'kotlin.also' call
    var this_0 = InternalHashMap_init_$Create$_0(0);
    this_0.r6();
    tmp.t6_1 = LinkedHashMap_init_$Create$_2(this_0);
  }
  var EmptyHolder_instance;
  function EmptyHolder_getInstance() {
    if (EmptyHolder_instance == null)
      new EmptyHolder();
    return EmptyHolder_instance;
  }
  protoOf(LinkedHashMap).j2 = function () {
    this.a4_1.r6();
    var tmp;
    if (this.i() > 0) {
      tmp = this;
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = EmptyHolder_getInstance().t6_1;
    }
    return tmp;
  };
  protoOf(LinkedHashMap).n2 = function () {
    return this.a4_1.g4();
  };
  function LinkedHashMap() {
  }
  function LinkedHashSet_init_$Init$($this) {
    HashSet_init_$Init$_0($this);
    LinkedHashSet.call($this);
    return $this;
  }
  function LinkedHashSet_init_$Create$() {
    return LinkedHashSet_init_$Init$(objectCreate(protoOf(LinkedHashSet)));
  }
  function LinkedHashSet_init_$Init$_0(initialCapacity, loadFactor, $this) {
    HashSet_init_$Init$_1(initialCapacity, loadFactor, $this);
    LinkedHashSet.call($this);
    return $this;
  }
  function LinkedHashSet_init_$Init$_1(initialCapacity, $this) {
    LinkedHashSet_init_$Init$_0(initialCapacity, 1.0, $this);
    return $this;
  }
  function LinkedHashSet_init_$Create$_0(initialCapacity) {
    return LinkedHashSet_init_$Init$_1(initialCapacity, objectCreate(protoOf(LinkedHashSet)));
  }
  protoOf(LinkedHashSet).n2 = function () {
    return this.z4_1.g4();
  };
  function LinkedHashSet() {
  }
  function iterator(_this__u8e3s4) {
    var r = _this__u8e3s4;
    var tmp;
    if (_this__u8e3s4['iterator'] != null) {
      tmp = _this__u8e3s4['iterator']();
    } else if (isArrayish(r)) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = arrayIterator(r);
    } else {
      tmp = ((!(r == null) ? isInterface(r, Iterable) : false) ? r : THROW_CCE()).f();
    }
    return tmp;
  }
  function Exception_init_$Init$($this) {
    extendThrowable($this);
    Exception.call($this);
    return $this;
  }
  function Exception_init_$Create$() {
    var tmp = Exception_init_$Init$(objectCreate(protoOf(Exception)));
    captureStack(tmp, Exception_init_$Create$);
    return tmp;
  }
  function Exception_init_$Init$_0(message, $this) {
    extendThrowable($this, message);
    Exception.call($this);
    return $this;
  }
  function Exception_init_$Create$_0(message) {
    var tmp = Exception_init_$Init$_0(message, objectCreate(protoOf(Exception)));
    captureStack(tmp, Exception_init_$Create$_0);
    return tmp;
  }
  function Exception() {
    captureStack(this, Exception);
  }
  function IllegalArgumentException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IllegalArgumentException.call($this);
    return $this;
  }
  function IllegalArgumentException_init_$Create$() {
    var tmp = IllegalArgumentException_init_$Init$(objectCreate(protoOf(IllegalArgumentException)));
    captureStack(tmp, IllegalArgumentException_init_$Create$);
    return tmp;
  }
  function IllegalArgumentException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IllegalArgumentException.call($this);
    return $this;
  }
  function IllegalArgumentException_init_$Create$_0(message) {
    var tmp = IllegalArgumentException_init_$Init$_0(message, objectCreate(protoOf(IllegalArgumentException)));
    captureStack(tmp, IllegalArgumentException_init_$Create$_0);
    return tmp;
  }
  function IllegalArgumentException() {
    captureStack(this, IllegalArgumentException);
  }
  function IllegalStateException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IllegalStateException.call($this);
    return $this;
  }
  function IllegalStateException_init_$Create$() {
    var tmp = IllegalStateException_init_$Init$(objectCreate(protoOf(IllegalStateException)));
    captureStack(tmp, IllegalStateException_init_$Create$);
    return tmp;
  }
  function IllegalStateException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IllegalStateException.call($this);
    return $this;
  }
  function IllegalStateException_init_$Create$_0(message) {
    var tmp = IllegalStateException_init_$Init$_0(message, objectCreate(protoOf(IllegalStateException)));
    captureStack(tmp, IllegalStateException_init_$Create$_0);
    return tmp;
  }
  function IllegalStateException() {
    captureStack(this, IllegalStateException);
  }
  function UnsupportedOperationException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    UnsupportedOperationException.call($this);
    return $this;
  }
  function UnsupportedOperationException_init_$Create$() {
    var tmp = UnsupportedOperationException_init_$Init$(objectCreate(protoOf(UnsupportedOperationException)));
    captureStack(tmp, UnsupportedOperationException_init_$Create$);
    return tmp;
  }
  function UnsupportedOperationException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    UnsupportedOperationException.call($this);
    return $this;
  }
  function UnsupportedOperationException_init_$Create$_0(message) {
    var tmp = UnsupportedOperationException_init_$Init$_0(message, objectCreate(protoOf(UnsupportedOperationException)));
    captureStack(tmp, UnsupportedOperationException_init_$Create$_0);
    return tmp;
  }
  function UnsupportedOperationException() {
    captureStack(this, UnsupportedOperationException);
  }
  function RuntimeException_init_$Init$($this) {
    Exception_init_$Init$($this);
    RuntimeException.call($this);
    return $this;
  }
  function RuntimeException_init_$Create$() {
    var tmp = RuntimeException_init_$Init$(objectCreate(protoOf(RuntimeException)));
    captureStack(tmp, RuntimeException_init_$Create$);
    return tmp;
  }
  function RuntimeException_init_$Init$_0(message, $this) {
    Exception_init_$Init$_0(message, $this);
    RuntimeException.call($this);
    return $this;
  }
  function RuntimeException_init_$Create$_0(message) {
    var tmp = RuntimeException_init_$Init$_0(message, objectCreate(protoOf(RuntimeException)));
    captureStack(tmp, RuntimeException_init_$Create$_0);
    return tmp;
  }
  function RuntimeException() {
    captureStack(this, RuntimeException);
  }
  function NoSuchElementException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NoSuchElementException.call($this);
    return $this;
  }
  function NoSuchElementException_init_$Create$() {
    var tmp = NoSuchElementException_init_$Init$(objectCreate(protoOf(NoSuchElementException)));
    captureStack(tmp, NoSuchElementException_init_$Create$);
    return tmp;
  }
  function NoSuchElementException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    NoSuchElementException.call($this);
    return $this;
  }
  function NoSuchElementException_init_$Create$_0(message) {
    var tmp = NoSuchElementException_init_$Init$_0(message, objectCreate(protoOf(NoSuchElementException)));
    captureStack(tmp, NoSuchElementException_init_$Create$_0);
    return tmp;
  }
  function NoSuchElementException() {
    captureStack(this, NoSuchElementException);
  }
  function Error_init_$Init$($this) {
    extendThrowable($this);
    Error_0.call($this);
    return $this;
  }
  function Error_init_$Create$() {
    var tmp = Error_init_$Init$(objectCreate(protoOf(Error_0)));
    captureStack(tmp, Error_init_$Create$);
    return tmp;
  }
  function Error_init_$Init$_0(message, $this) {
    extendThrowable($this, message);
    Error_0.call($this);
    return $this;
  }
  function Error_init_$Create$_0(message) {
    var tmp = Error_init_$Init$_0(message, objectCreate(protoOf(Error_0)));
    captureStack(tmp, Error_init_$Create$_0);
    return tmp;
  }
  function Error_0() {
    captureStack(this, Error_0);
  }
  function IndexOutOfBoundsException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IndexOutOfBoundsException.call($this);
    return $this;
  }
  function IndexOutOfBoundsException_init_$Create$() {
    var tmp = IndexOutOfBoundsException_init_$Init$(objectCreate(protoOf(IndexOutOfBoundsException)));
    captureStack(tmp, IndexOutOfBoundsException_init_$Create$);
    return tmp;
  }
  function IndexOutOfBoundsException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IndexOutOfBoundsException.call($this);
    return $this;
  }
  function IndexOutOfBoundsException_init_$Create$_0(message) {
    var tmp = IndexOutOfBoundsException_init_$Init$_0(message, objectCreate(protoOf(IndexOutOfBoundsException)));
    captureStack(tmp, IndexOutOfBoundsException_init_$Create$_0);
    return tmp;
  }
  function IndexOutOfBoundsException() {
    captureStack(this, IndexOutOfBoundsException);
  }
  function NumberFormatException_init_$Init$($this) {
    IllegalArgumentException_init_$Init$($this);
    NumberFormatException.call($this);
    return $this;
  }
  function NumberFormatException_init_$Create$() {
    var tmp = NumberFormatException_init_$Init$(objectCreate(protoOf(NumberFormatException)));
    captureStack(tmp, NumberFormatException_init_$Create$);
    return tmp;
  }
  function NumberFormatException_init_$Init$_0(message, $this) {
    IllegalArgumentException_init_$Init$_0(message, $this);
    NumberFormatException.call($this);
    return $this;
  }
  function NumberFormatException_init_$Create$_0(message) {
    var tmp = NumberFormatException_init_$Init$_0(message, objectCreate(protoOf(NumberFormatException)));
    captureStack(tmp, NumberFormatException_init_$Create$_0);
    return tmp;
  }
  function NumberFormatException() {
    captureStack(this, NumberFormatException);
  }
  function ConcurrentModificationException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ConcurrentModificationException.call($this);
    return $this;
  }
  function ConcurrentModificationException_init_$Create$() {
    var tmp = ConcurrentModificationException_init_$Init$(objectCreate(protoOf(ConcurrentModificationException)));
    captureStack(tmp, ConcurrentModificationException_init_$Create$);
    return tmp;
  }
  function ConcurrentModificationException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    ConcurrentModificationException.call($this);
    return $this;
  }
  function ConcurrentModificationException_init_$Create$_0(message) {
    var tmp = ConcurrentModificationException_init_$Init$_0(message, objectCreate(protoOf(ConcurrentModificationException)));
    captureStack(tmp, ConcurrentModificationException_init_$Create$_0);
    return tmp;
  }
  function ConcurrentModificationException() {
    captureStack(this, ConcurrentModificationException);
  }
  function ArithmeticException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ArithmeticException.call($this);
    return $this;
  }
  function ArithmeticException_init_$Create$() {
    var tmp = ArithmeticException_init_$Init$(objectCreate(protoOf(ArithmeticException)));
    captureStack(tmp, ArithmeticException_init_$Create$);
    return tmp;
  }
  function ArithmeticException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    ArithmeticException.call($this);
    return $this;
  }
  function ArithmeticException_init_$Create$_0(message) {
    var tmp = ArithmeticException_init_$Init$_0(message, objectCreate(protoOf(ArithmeticException)));
    captureStack(tmp, ArithmeticException_init_$Create$_0);
    return tmp;
  }
  function ArithmeticException() {
    captureStack(this, ArithmeticException);
  }
  function NullPointerException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NullPointerException.call($this);
    return $this;
  }
  function NullPointerException_init_$Create$() {
    var tmp = NullPointerException_init_$Init$(objectCreate(protoOf(NullPointerException)));
    captureStack(tmp, NullPointerException_init_$Create$);
    return tmp;
  }
  function NullPointerException() {
    captureStack(this, NullPointerException);
  }
  function NoWhenBranchMatchedException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NoWhenBranchMatchedException.call($this);
    return $this;
  }
  function NoWhenBranchMatchedException_init_$Create$() {
    var tmp = NoWhenBranchMatchedException_init_$Init$(objectCreate(protoOf(NoWhenBranchMatchedException)));
    captureStack(tmp, NoWhenBranchMatchedException_init_$Create$);
    return tmp;
  }
  function NoWhenBranchMatchedException() {
    captureStack(this, NoWhenBranchMatchedException);
  }
  function ClassCastException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ClassCastException.call($this);
    return $this;
  }
  function ClassCastException_init_$Create$() {
    var tmp = ClassCastException_init_$Init$(objectCreate(protoOf(ClassCastException)));
    captureStack(tmp, ClassCastException_init_$Create$);
    return tmp;
  }
  function ClassCastException() {
    captureStack(this, ClassCastException);
  }
  function UninitializedPropertyAccessException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    UninitializedPropertyAccessException.call($this);
    return $this;
  }
  function UninitializedPropertyAccessException_init_$Create$() {
    var tmp = UninitializedPropertyAccessException_init_$Init$(objectCreate(protoOf(UninitializedPropertyAccessException)));
    captureStack(tmp, UninitializedPropertyAccessException_init_$Create$);
    return tmp;
  }
  function UninitializedPropertyAccessException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    UninitializedPropertyAccessException.call($this);
    return $this;
  }
  function UninitializedPropertyAccessException_init_$Create$_0(message) {
    var tmp = UninitializedPropertyAccessException_init_$Init$_0(message, objectCreate(protoOf(UninitializedPropertyAccessException)));
    captureStack(tmp, UninitializedPropertyAccessException_init_$Create$_0);
    return tmp;
  }
  function UninitializedPropertyAccessException() {
    captureStack(this, UninitializedPropertyAccessException);
  }
  function json(pairs) {
    var res = {};
    var inductionVariable = 0;
    var last = pairs.length;
    while (inductionVariable < last) {
      var _destruct__k2r9zo = pairs[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var name = _destruct__k2r9zo.z6();
      var value = _destruct__k2r9zo.a7();
      res[name] = value;
    }
    return res;
  }
  function lazy(initializer) {
    return new UnsafeLazyImpl(initializer);
  }
  function fillFrom(src, dst) {
    var srcLen = src.length;
    var dstLen = dst.length;
    var index = 0;
    // Inline function 'kotlin.js.unsafeCast' call
    var arr = dst;
    while (index < srcLen && index < dstLen) {
      var tmp = index;
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      arr[tmp] = src[_unary__edvuaz];
    }
    return dst;
  }
  function arrayCopyResize(source, newSize, defaultValue) {
    // Inline function 'kotlin.js.unsafeCast' call
    var result = source.slice(0, newSize);
    // Inline function 'kotlin.copyArrayType' call
    if (source.$type$ !== undefined) {
      result.$type$ = source.$type$;
    }
    var index = source.length;
    if (newSize > index) {
      // Inline function 'kotlin.js.asDynamic' call
      result.length = newSize;
      while (index < newSize) {
        var _unary__edvuaz = index;
        index = _unary__edvuaz + 1 | 0;
        result[_unary__edvuaz] = defaultValue;
      }
    }
    return result;
  }
  function abs(n) {
    return n < 0 ? -n | 0 | 0 : n;
  }
  function round(x) {
    if (!(x % 0.5 === 0.0)) {
      return Math.round(x);
    }
    // Inline function 'kotlin.math.floor' call
    var floor = Math.floor(x);
    var tmp;
    if (floor % 2 === 0.0) {
      tmp = floor;
    } else {
      // Inline function 'kotlin.math.ceil' call
      tmp = Math.ceil(x);
    }
    return tmp;
  }
  var INV_2_26;
  var INV_2_53;
  function defaultPlatformRandom() {
    _init_properties_PlatformRandom_kt__6kjv62();
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$0 = Math.random() * Math.pow(2, 32) | 0;
    return Random_0(tmp$ret$0);
  }
  var properties_initialized_PlatformRandom_kt_uibhw8;
  function _init_properties_PlatformRandom_kt__6kjv62() {
    if (!properties_initialized_PlatformRandom_kt_uibhw8) {
      properties_initialized_PlatformRandom_kt_uibhw8 = true;
      // Inline function 'kotlin.math.pow' call
      INV_2_26 = Math.pow(2.0, -26);
      // Inline function 'kotlin.math.pow' call
      INV_2_53 = Math.pow(2.0, -53);
    }
  }
  function KClass() {
  }
  function KClassImpl(jClass) {
    this.c7_1 = jClass;
  }
  protoOf(KClassImpl).d7 = function () {
    return this.c7_1;
  };
  protoOf(KClassImpl).equals = function (other) {
    var tmp;
    if (other instanceof NothingKClassImpl) {
      tmp = false;
    } else {
      if (other instanceof ErrorKClass) {
        tmp = false;
      } else {
        if (other instanceof KClassImpl) {
          tmp = equals(this.d7(), other.d7());
        } else {
          tmp = false;
        }
      }
    }
    return tmp;
  };
  protoOf(KClassImpl).hashCode = function () {
    var tmp0_safe_receiver = this.b7();
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : getStringHashCode(tmp0_safe_receiver);
    return tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
  };
  protoOf(KClassImpl).toString = function () {
    return 'class ' + this.b7();
  };
  function NothingKClassImpl() {
    NothingKClassImpl_instance = this;
    KClassImpl.call(this, Object);
    this.f7_1 = 'Nothing';
  }
  protoOf(NothingKClassImpl).b7 = function () {
    return this.f7_1;
  };
  protoOf(NothingKClassImpl).d7 = function () {
    throw UnsupportedOperationException_init_$Create$_0("There's no native JS class for Nothing type");
  };
  protoOf(NothingKClassImpl).equals = function (other) {
    return other === this;
  };
  protoOf(NothingKClassImpl).hashCode = function () {
    return 0;
  };
  var NothingKClassImpl_instance;
  function NothingKClassImpl_getInstance() {
    if (NothingKClassImpl_instance == null)
      new NothingKClassImpl();
    return NothingKClassImpl_instance;
  }
  function ErrorKClass() {
  }
  protoOf(ErrorKClass).b7 = function () {
    var message = 'Unknown simpleName for ErrorKClass';
    throw IllegalStateException_init_$Create$_0(toString_1(message));
  };
  protoOf(ErrorKClass).equals = function (other) {
    return other === this;
  };
  protoOf(ErrorKClass).hashCode = function () {
    return 0;
  };
  function PrimitiveKClassImpl(jClass, givenSimpleName, isInstanceFunction) {
    KClassImpl.call(this, jClass);
    this.h7_1 = givenSimpleName;
    this.i7_1 = isInstanceFunction;
  }
  protoOf(PrimitiveKClassImpl).equals = function (other) {
    if (!(other instanceof PrimitiveKClassImpl))
      return false;
    return protoOf(KClassImpl).equals.call(this, other) && this.h7_1 === other.h7_1;
  };
  protoOf(PrimitiveKClassImpl).b7 = function () {
    return this.h7_1;
  };
  function SimpleKClassImpl(jClass) {
    KClassImpl.call(this, jClass);
    var tmp = this;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_safe_receiver = jClass.$metadata$;
    // Inline function 'kotlin.js.unsafeCast' call
    tmp.k7_1 = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.simpleName;
  }
  protoOf(SimpleKClassImpl).b7 = function () {
    return this.k7_1;
  };
  function KProperty1() {
  }
  function get_functionClasses() {
    _init_properties_primitives_kt__3fums4();
    return functionClasses;
  }
  var functionClasses;
  function PrimitiveClasses$anyClass$lambda(it) {
    return !(it == null);
  }
  function PrimitiveClasses$numberClass$lambda(it) {
    return isNumber(it);
  }
  function PrimitiveClasses$booleanClass$lambda(it) {
    return !(it == null) ? typeof it === 'boolean' : false;
  }
  function PrimitiveClasses$byteClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$shortClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$intClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$floatClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$doubleClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$arrayClass$lambda(it) {
    return !(it == null) ? isArray(it) : false;
  }
  function PrimitiveClasses$stringClass$lambda(it) {
    return !(it == null) ? typeof it === 'string' : false;
  }
  function PrimitiveClasses$throwableClass$lambda(it) {
    return it instanceof Error;
  }
  function PrimitiveClasses$booleanArrayClass$lambda(it) {
    return !(it == null) ? isBooleanArray(it) : false;
  }
  function PrimitiveClasses$charArrayClass$lambda(it) {
    return !(it == null) ? isCharArray(it) : false;
  }
  function PrimitiveClasses$byteArrayClass$lambda(it) {
    return !(it == null) ? isByteArray(it) : false;
  }
  function PrimitiveClasses$shortArrayClass$lambda(it) {
    return !(it == null) ? isShortArray(it) : false;
  }
  function PrimitiveClasses$intArrayClass$lambda(it) {
    return !(it == null) ? isIntArray(it) : false;
  }
  function PrimitiveClasses$longArrayClass$lambda(it) {
    return !(it == null) ? isLongArray(it) : false;
  }
  function PrimitiveClasses$floatArrayClass$lambda(it) {
    return !(it == null) ? isFloatArray(it) : false;
  }
  function PrimitiveClasses$doubleArrayClass$lambda(it) {
    return !(it == null) ? isDoubleArray(it) : false;
  }
  function PrimitiveClasses$functionClass$lambda($arity) {
    return function (it) {
      var tmp;
      if (typeof it === 'function') {
        // Inline function 'kotlin.js.asDynamic' call
        tmp = it.length === $arity;
      } else {
        tmp = false;
      }
      return tmp;
    };
  }
  function PrimitiveClasses() {
    PrimitiveClasses_instance = this;
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_0 = Object;
    tmp.anyClass = new PrimitiveKClassImpl(tmp_0, 'Any', PrimitiveClasses$anyClass$lambda);
    var tmp_1 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_2 = Number;
    tmp_1.numberClass = new PrimitiveKClassImpl(tmp_2, 'Number', PrimitiveClasses$numberClass$lambda);
    this.nothingClass = NothingKClassImpl_getInstance();
    var tmp_3 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_4 = Boolean;
    tmp_3.booleanClass = new PrimitiveKClassImpl(tmp_4, 'Boolean', PrimitiveClasses$booleanClass$lambda);
    var tmp_5 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_6 = Number;
    tmp_5.byteClass = new PrimitiveKClassImpl(tmp_6, 'Byte', PrimitiveClasses$byteClass$lambda);
    var tmp_7 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_8 = Number;
    tmp_7.shortClass = new PrimitiveKClassImpl(tmp_8, 'Short', PrimitiveClasses$shortClass$lambda);
    var tmp_9 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_10 = Number;
    tmp_9.intClass = new PrimitiveKClassImpl(tmp_10, 'Int', PrimitiveClasses$intClass$lambda);
    var tmp_11 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_12 = Number;
    tmp_11.floatClass = new PrimitiveKClassImpl(tmp_12, 'Float', PrimitiveClasses$floatClass$lambda);
    var tmp_13 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_14 = Number;
    tmp_13.doubleClass = new PrimitiveKClassImpl(tmp_14, 'Double', PrimitiveClasses$doubleClass$lambda);
    var tmp_15 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_16 = Array;
    tmp_15.arrayClass = new PrimitiveKClassImpl(tmp_16, 'Array', PrimitiveClasses$arrayClass$lambda);
    var tmp_17 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_18 = String;
    tmp_17.stringClass = new PrimitiveKClassImpl(tmp_18, 'String', PrimitiveClasses$stringClass$lambda);
    var tmp_19 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_20 = Error;
    tmp_19.throwableClass = new PrimitiveKClassImpl(tmp_20, 'Throwable', PrimitiveClasses$throwableClass$lambda);
    var tmp_21 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_22 = Array;
    tmp_21.booleanArrayClass = new PrimitiveKClassImpl(tmp_22, 'BooleanArray', PrimitiveClasses$booleanArrayClass$lambda);
    var tmp_23 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_24 = Uint16Array;
    tmp_23.charArrayClass = new PrimitiveKClassImpl(tmp_24, 'CharArray', PrimitiveClasses$charArrayClass$lambda);
    var tmp_25 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_26 = Int8Array;
    tmp_25.byteArrayClass = new PrimitiveKClassImpl(tmp_26, 'ByteArray', PrimitiveClasses$byteArrayClass$lambda);
    var tmp_27 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_28 = Int16Array;
    tmp_27.shortArrayClass = new PrimitiveKClassImpl(tmp_28, 'ShortArray', PrimitiveClasses$shortArrayClass$lambda);
    var tmp_29 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_30 = Int32Array;
    tmp_29.intArrayClass = new PrimitiveKClassImpl(tmp_30, 'IntArray', PrimitiveClasses$intArrayClass$lambda);
    var tmp_31 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_32 = Array;
    tmp_31.longArrayClass = new PrimitiveKClassImpl(tmp_32, 'LongArray', PrimitiveClasses$longArrayClass$lambda);
    var tmp_33 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_34 = Float32Array;
    tmp_33.floatArrayClass = new PrimitiveKClassImpl(tmp_34, 'FloatArray', PrimitiveClasses$floatArrayClass$lambda);
    var tmp_35 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_36 = Float64Array;
    tmp_35.doubleArrayClass = new PrimitiveKClassImpl(tmp_36, 'DoubleArray', PrimitiveClasses$doubleArrayClass$lambda);
  }
  protoOf(PrimitiveClasses).l7 = function () {
    return this.anyClass;
  };
  protoOf(PrimitiveClasses).m7 = function () {
    return this.numberClass;
  };
  protoOf(PrimitiveClasses).n7 = function () {
    return this.nothingClass;
  };
  protoOf(PrimitiveClasses).o7 = function () {
    return this.booleanClass;
  };
  protoOf(PrimitiveClasses).p7 = function () {
    return this.byteClass;
  };
  protoOf(PrimitiveClasses).q7 = function () {
    return this.shortClass;
  };
  protoOf(PrimitiveClasses).r7 = function () {
    return this.intClass;
  };
  protoOf(PrimitiveClasses).s7 = function () {
    return this.floatClass;
  };
  protoOf(PrimitiveClasses).t7 = function () {
    return this.doubleClass;
  };
  protoOf(PrimitiveClasses).u7 = function () {
    return this.arrayClass;
  };
  protoOf(PrimitiveClasses).v7 = function () {
    return this.stringClass;
  };
  protoOf(PrimitiveClasses).w7 = function () {
    return this.throwableClass;
  };
  protoOf(PrimitiveClasses).x7 = function () {
    return this.booleanArrayClass;
  };
  protoOf(PrimitiveClasses).y7 = function () {
    return this.charArrayClass;
  };
  protoOf(PrimitiveClasses).z7 = function () {
    return this.byteArrayClass;
  };
  protoOf(PrimitiveClasses).a8 = function () {
    return this.shortArrayClass;
  };
  protoOf(PrimitiveClasses).b8 = function () {
    return this.intArrayClass;
  };
  protoOf(PrimitiveClasses).c8 = function () {
    return this.longArrayClass;
  };
  protoOf(PrimitiveClasses).d8 = function () {
    return this.floatArrayClass;
  };
  protoOf(PrimitiveClasses).e8 = function () {
    return this.doubleArrayClass;
  };
  protoOf(PrimitiveClasses).functionClass = function (arity) {
    var tmp0_elvis_lhs = get_functionClasses()[arity];
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.run' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp_0 = Function;
      var tmp_1 = 'Function' + arity;
      var result = new PrimitiveKClassImpl(tmp_0, tmp_1, PrimitiveClasses$functionClass$lambda(arity));
      // Inline function 'kotlin.js.asDynamic' call
      get_functionClasses()[arity] = result;
      tmp = result;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  var PrimitiveClasses_instance;
  function PrimitiveClasses_getInstance() {
    if (PrimitiveClasses_instance == null)
      new PrimitiveClasses();
    return PrimitiveClasses_instance;
  }
  var properties_initialized_primitives_kt_jle18u;
  function _init_properties_primitives_kt__3fums4() {
    if (!properties_initialized_primitives_kt_jle18u) {
      properties_initialized_primitives_kt_jle18u = true;
      // Inline function 'kotlin.arrayOfNulls' call
      functionClasses = Array(0);
    }
  }
  function getKClass(jClass) {
    var tmp;
    if (Array.isArray(jClass)) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = getKClassM(jClass);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = getKClass1(jClass);
    }
    return tmp;
  }
  function getKClassM(jClasses) {
    var tmp;
    switch (jClasses.length) {
      case 1:
        tmp = getKClass1(jClasses[0]);
        break;
      case 0:
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp = NothingKClassImpl_getInstance();
        break;
      default:
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp = new ErrorKClass();
        break;
    }
    return tmp;
  }
  function getKClass1(jClass) {
    if (jClass === String) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      return PrimitiveClasses_getInstance().stringClass;
    }
    // Inline function 'kotlin.js.asDynamic' call
    var metadata = jClass.$metadata$;
    var tmp;
    if (metadata != null) {
      var tmp_0;
      if (metadata.$kClass$ == null) {
        var kClass = new SimpleKClassImpl(jClass);
        metadata.$kClass$ = kClass;
        tmp_0 = kClass;
      } else {
        tmp_0 = metadata.$kClass$;
      }
      tmp = tmp_0;
    } else {
      tmp = new SimpleKClassImpl(jClass);
    }
    return tmp;
  }
  function getKClassFromExpression(e) {
    var tmp;
    switch (typeof e) {
      case 'string':
        tmp = PrimitiveClasses_getInstance().stringClass;
        break;
      case 'number':
        var tmp_0;
        // Inline function 'kotlin.js.jsBitwiseOr' call

        // Inline function 'kotlin.js.asDynamic' call

        if ((e | 0) === e) {
          tmp_0 = PrimitiveClasses_getInstance().intClass;
        } else {
          tmp_0 = PrimitiveClasses_getInstance().doubleClass;
        }

        tmp = tmp_0;
        break;
      case 'boolean':
        tmp = PrimitiveClasses_getInstance().booleanClass;
        break;
      case 'function':
        var tmp_1 = PrimitiveClasses_getInstance();
        // Inline function 'kotlin.js.asDynamic' call

        tmp = tmp_1.functionClass(e.length);
        break;
      default:
        var tmp_2;
        if (isBooleanArray(e)) {
          tmp_2 = PrimitiveClasses_getInstance().booleanArrayClass;
        } else {
          if (isCharArray(e)) {
            tmp_2 = PrimitiveClasses_getInstance().charArrayClass;
          } else {
            if (isByteArray(e)) {
              tmp_2 = PrimitiveClasses_getInstance().byteArrayClass;
            } else {
              if (isShortArray(e)) {
                tmp_2 = PrimitiveClasses_getInstance().shortArrayClass;
              } else {
                if (isIntArray(e)) {
                  tmp_2 = PrimitiveClasses_getInstance().intArrayClass;
                } else {
                  if (isLongArray(e)) {
                    tmp_2 = PrimitiveClasses_getInstance().longArrayClass;
                  } else {
                    if (isFloatArray(e)) {
                      tmp_2 = PrimitiveClasses_getInstance().floatArrayClass;
                    } else {
                      if (isDoubleArray(e)) {
                        tmp_2 = PrimitiveClasses_getInstance().doubleArrayClass;
                      } else {
                        if (isInterface(e, KClass)) {
                          tmp_2 = getKClass(KClass);
                        } else {
                          if (isArray(e)) {
                            tmp_2 = PrimitiveClasses_getInstance().arrayClass;
                          } else {
                            var constructor = Object.getPrototypeOf(e).constructor;
                            var tmp_3;
                            if (constructor === Object) {
                              tmp_3 = PrimitiveClasses_getInstance().anyClass;
                            } else if (constructor === Error) {
                              tmp_3 = PrimitiveClasses_getInstance().throwableClass;
                            } else {
                              var jsClass = constructor;
                              tmp_3 = getKClass1(jsClass);
                            }
                            tmp_2 = tmp_3;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        tmp = tmp_2;
        break;
    }
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return tmp;
  }
  function StringBuilder_init_$Init$(capacity, $this) {
    StringBuilder_init_$Init$_0($this);
    return $this;
  }
  function StringBuilder_init_$Create$(capacity) {
    return StringBuilder_init_$Init$(capacity, objectCreate(protoOf(StringBuilder)));
  }
  function StringBuilder_init_$Init$_0($this) {
    StringBuilder.call($this, '');
    return $this;
  }
  function StringBuilder_init_$Create$_0() {
    return StringBuilder_init_$Init$_0(objectCreate(protoOf(StringBuilder)));
  }
  function StringBuilder(content) {
    this.n6_1 = content;
  }
  protoOf(StringBuilder).a = function () {
    // Inline function 'kotlin.js.asDynamic' call
    return this.n6_1.length;
  };
  protoOf(StringBuilder).b = function (index) {
    // Inline function 'kotlin.text.getOrElse' call
    var this_0 = this.n6_1;
    var tmp;
    if (0 <= index ? index <= (charSequenceLength(this_0) - 1 | 0) : false) {
      tmp = charSequenceGet(this_0, index);
    } else {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', length: ' + this.a() + '}');
    }
    return tmp;
  };
  protoOf(StringBuilder).c = function (startIndex, endIndex) {
    // Inline function 'kotlin.text.substring' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.n6_1.substring(startIndex, endIndex);
  };
  protoOf(StringBuilder).q6 = function (value) {
    this.n6_1 = this.n6_1 + toString(value);
    return this;
  };
  protoOf(StringBuilder).e = function (value) {
    this.n6_1 = this.n6_1 + toString_0(value);
    return this;
  };
  protoOf(StringBuilder).f8 = function (value, startIndex, endIndex) {
    return this.g8(value == null ? 'null' : value, startIndex, endIndex);
  };
  protoOf(StringBuilder).o6 = function (value) {
    this.n6_1 = this.n6_1 + toString_0(value);
    return this;
  };
  protoOf(StringBuilder).h8 = function (value) {
    this.n6_1 = this.n6_1 + value;
    return this;
  };
  protoOf(StringBuilder).p6 = function (value) {
    var tmp = this;
    var tmp_0 = this.n6_1;
    tmp.n6_1 = tmp_0 + (value == null ? 'null' : value);
    return this;
  };
  protoOf(StringBuilder).toString = function () {
    return this.n6_1;
  };
  protoOf(StringBuilder).i8 = function () {
    this.n6_1 = '';
    return this;
  };
  protoOf(StringBuilder).g8 = function (value, startIndex, endIndex) {
    var stringCsq = toString_1(value);
    Companion_instance_5.j8(startIndex, endIndex, stringCsq.length);
    var tmp = this;
    var tmp_0 = this.n6_1;
    // Inline function 'kotlin.text.substring' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.n6_1 = tmp_0 + stringCsq.substring(startIndex, endIndex);
    return this;
  };
  function uppercaseChar(_this__u8e3s4) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var uppercase = toString(_this__u8e3s4).toUpperCase();
    return uppercase.length > 1 ? _this__u8e3s4 : charSequenceGet(uppercase, 0);
  }
  function isWhitespace(_this__u8e3s4) {
    return isWhitespaceImpl(_this__u8e3s4);
  }
  function checkRadix(radix) {
    if (!(2 <= radix ? radix <= 36 : false)) {
      throw IllegalArgumentException_init_$Create$_0('radix ' + radix + ' was not in valid range 2..36');
    }
    return radix;
  }
  function toInt(_this__u8e3s4) {
    var tmp0_elvis_lhs = toIntOrNull(_this__u8e3s4);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      numberFormatError(_this__u8e3s4);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function toString_2(_this__u8e3s4, radix) {
    // Inline function 'kotlin.js.asDynamic' call
    return _this__u8e3s4.toString(checkRadix(radix));
  }
  function toDouble(_this__u8e3s4) {
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.also' call
    var this_0 = +_this__u8e3s4;
    if (isNaN_0(this_0) && !isNaN_2(_this__u8e3s4) || (this_0 === 0.0 && isBlank(_this__u8e3s4))) {
      numberFormatError(_this__u8e3s4);
    }
    return this_0;
  }
  function toLong_0(_this__u8e3s4) {
    var tmp0_elvis_lhs = toLongOrNull(_this__u8e3s4);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      numberFormatError(_this__u8e3s4);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function toInt_0(_this__u8e3s4, radix) {
    var tmp0_elvis_lhs = toIntOrNull_0(_this__u8e3s4, radix);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      numberFormatError(_this__u8e3s4);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function toLong_1(_this__u8e3s4, radix) {
    var tmp0_elvis_lhs = toLongOrNull_0(_this__u8e3s4, radix);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      numberFormatError(_this__u8e3s4);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function isNaN_2(_this__u8e3s4) {
    // Inline function 'kotlin.text.lowercase' call
    // Inline function 'kotlin.js.asDynamic' call
    switch (_this__u8e3s4.toLowerCase()) {
      case 'nan':
      case '+nan':
      case '-nan':
        return true;
      default:
        return false;
    }
  }
  function digitOf(char, radix) {
    // Inline function 'kotlin.let' call
    var it = Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(48)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(57)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(48)) : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(90)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(97)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(122)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(97)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(128)) < 0 ? -1 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65313)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65338)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65313)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65345)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65370)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65345)) + 10 | 0 : digitToIntImpl(char);
    return it >= radix ? -1 : it;
  }
  function Regex_init_$Init$(pattern, $this) {
    Regex.call($this, pattern, emptySet());
    return $this;
  }
  function Regex_init_$Create$(pattern) {
    return Regex_init_$Init$(pattern, objectCreate(protoOf(Regex)));
  }
  function Companion_4() {
    Companion_instance_4 = this;
    this.k8_1 = new RegExp('[\\\\^$*+?.()|[\\]{}]', 'g');
    this.l8_1 = new RegExp('[\\\\$]', 'g');
    this.m8_1 = new RegExp('\\$', 'g');
  }
  protoOf(Companion_4).n8 = function (literal) {
    // Inline function 'kotlin.text.nativeReplace' call
    var pattern = this.k8_1;
    // Inline function 'kotlin.js.asDynamic' call
    return literal.replace(pattern, '\\$&');
  };
  protoOf(Companion_4).o8 = function (literal) {
    // Inline function 'kotlin.text.nativeReplace' call
    var pattern = this.m8_1;
    // Inline function 'kotlin.js.asDynamic' call
    return literal.replace(pattern, '$$$$');
  };
  var Companion_instance_4;
  function Companion_getInstance_4() {
    if (Companion_instance_4 == null)
      new Companion_4();
    return Companion_instance_4;
  }
  function Regex$findAll$lambda(this$0, $input, $startIndex) {
    return function () {
      return this$0.u8($input, $startIndex);
    };
  }
  function Regex$findAll$lambda_0(match) {
    return match.h();
  }
  function Regex(pattern, options) {
    Companion_getInstance_4();
    this.p8_1 = pattern;
    this.q8_1 = toSet_0(options);
    this.r8_1 = new RegExp(pattern, toFlags(options, 'gu'));
    this.s8_1 = null;
    this.t8_1 = null;
  }
  protoOf(Regex).u8 = function (input, startIndex) {
    if (startIndex < 0 || startIndex > charSequenceLength(input)) {
      throw IndexOutOfBoundsException_init_$Create$_0('Start index out of bounds: ' + startIndex + ', input length: ' + charSequenceLength(input));
    }
    return findNext(this.r8_1, toString_1(input), startIndex, this.r8_1);
  };
  protoOf(Regex).v8 = function (input, startIndex, $super) {
    startIndex = startIndex === VOID ? 0 : startIndex;
    return $super === VOID ? this.u8(input, startIndex) : $super.u8.call(this, input, startIndex);
  };
  protoOf(Regex).w8 = function (input, startIndex) {
    if (startIndex < 0 || startIndex > charSequenceLength(input)) {
      throw IndexOutOfBoundsException_init_$Create$_0('Start index out of bounds: ' + startIndex + ', input length: ' + charSequenceLength(input));
    }
    var tmp = Regex$findAll$lambda(this, input, startIndex);
    return generateSequence(tmp, Regex$findAll$lambda_0);
  };
  protoOf(Regex).x8 = function (input, startIndex, $super) {
    startIndex = startIndex === VOID ? 0 : startIndex;
    return $super === VOID ? this.w8(input, startIndex) : $super.w8.call(this, input, startIndex);
  };
  protoOf(Regex).y8 = function (input, limit) {
    requireNonNegativeLimit(limit);
    // Inline function 'kotlin.let' call
    var it = this.x8(input);
    var matches = limit === 0 ? it : take(it, limit - 1 | 0);
    // Inline function 'kotlin.collections.mutableListOf' call
    var result = ArrayList_init_$Create$();
    var lastStart = 0;
    var _iterator__ex2g4s = matches.f();
    while (_iterator__ex2g4s.g()) {
      var match = _iterator__ex2g4s.h();
      result.d(toString_1(charSequenceSubSequence(input, lastStart, match.z8().d9())));
      lastStart = match.z8().e9() + 1 | 0;
    }
    result.d(toString_1(charSequenceSubSequence(input, lastStart, charSequenceLength(input))));
    return result;
  };
  protoOf(Regex).toString = function () {
    return this.r8_1.toString();
  };
  function toFlags(_this__u8e3s4, prepend) {
    return joinToString_0(_this__u8e3s4, '', prepend, VOID, VOID, VOID, toFlags$lambda);
  }
  function findNext(_this__u8e3s4, input, from, nextPattern) {
    _this__u8e3s4.lastIndex = from;
    var match = _this__u8e3s4.exec(input);
    if (match == null)
      return null;
    var range = numberRangeToNumber(match.index, _this__u8e3s4.lastIndex - 1 | 0);
    return new findNext$1(range, match, nextPattern, input);
  }
  function MatchGroup(value) {
    this.f9_1 = value;
  }
  protoOf(MatchGroup).toString = function () {
    return 'MatchGroup(value=' + this.f9_1 + ')';
  };
  protoOf(MatchGroup).hashCode = function () {
    return getStringHashCode(this.f9_1);
  };
  protoOf(MatchGroup).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MatchGroup))
      return false;
    var tmp0_other_with_cast = other instanceof MatchGroup ? other : THROW_CCE();
    if (!(this.f9_1 === tmp0_other_with_cast.f9_1))
      return false;
    return true;
  };
  function toFlags$lambda(it) {
    return it.i9_1;
  }
  function findNext$o$groups$o$iterator$lambda(this$0) {
    return function (it) {
      return this$0.j(it);
    };
  }
  function advanceToNextCharacter($this, index) {
    if (index < get_lastIndex_0($this.r9_1)) {
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var code1 = $this.r9_1.charCodeAt(index);
      if (55296 <= code1 ? code1 <= 56319 : false) {
        // Inline function 'kotlin.js.asDynamic' call
        // Inline function 'kotlin.js.unsafeCast' call
        var code2 = $this.r9_1.charCodeAt(index + 1 | 0);
        if (56320 <= code2 ? code2 <= 57343 : false) {
          return index + 2 | 0;
        }
      }
    }
    return index + 1 | 0;
  }
  function findNext$1$groups$1($match, this$0) {
    this.j9_1 = $match;
    this.k9_1 = this$0;
    AbstractCollection.call(this);
  }
  protoOf(findNext$1$groups$1).i = function () {
    return this.j9_1.length;
  };
  protoOf(findNext$1$groups$1).f = function () {
    var tmp = asSequence(get_indices(this));
    return map(tmp, findNext$o$groups$o$iterator$lambda(this)).f();
  };
  protoOf(findNext$1$groups$1).j = function (index) {
    // Inline function 'kotlin.js.get' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_safe_receiver = this.j9_1[index];
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      tmp = new MatchGroup(tmp0_safe_receiver);
    }
    return tmp;
  };
  function findNext$1$groupValues$1($match) {
    this.s9_1 = $match;
    AbstractList.call(this);
  }
  protoOf(findNext$1$groupValues$1).i = function () {
    return this.s9_1.length;
  };
  protoOf(findNext$1$groupValues$1).j = function (index) {
    // Inline function 'kotlin.js.get' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_elvis_lhs = this.s9_1[index];
    return tmp0_elvis_lhs == null ? '' : tmp0_elvis_lhs;
  };
  function findNext$1($range, $match, $nextPattern, $input) {
    this.o9_1 = $range;
    this.p9_1 = $match;
    this.q9_1 = $nextPattern;
    this.r9_1 = $input;
    this.l9_1 = $range;
    var tmp = this;
    tmp.m9_1 = new findNext$1$groups$1($match, this);
    this.n9_1 = null;
  }
  protoOf(findNext$1).z8 = function () {
    return this.l9_1;
  };
  protoOf(findNext$1).t9 = function () {
    if (this.n9_1 == null) {
      var tmp = this;
      tmp.n9_1 = new findNext$1$groupValues$1(this.p9_1);
    }
    return ensureNotNull(this.n9_1);
  };
  protoOf(findNext$1).h = function () {
    return findNext(this.q9_1, this.r9_1, this.o9_1.k() ? advanceToNextCharacter(this, this.o9_1.d9()) : this.o9_1.e9() + 1 | 0, this.q9_1);
  };
  function startsWith(_this__u8e3s4, prefix, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    if (!ignoreCase) {
      // Inline function 'kotlin.text.nativeStartsWith' call
      // Inline function 'kotlin.js.asDynamic' call
      return _this__u8e3s4.startsWith(prefix, 0);
    } else
      return regionMatches(_this__u8e3s4, 0, prefix, 0, prefix.length, ignoreCase);
  }
  function endsWith(_this__u8e3s4, suffix, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    if (!ignoreCase) {
      // Inline function 'kotlin.text.nativeEndsWith' call
      // Inline function 'kotlin.js.asDynamic' call
      return _this__u8e3s4.endsWith(suffix);
    } else
      return regionMatches(_this__u8e3s4, _this__u8e3s4.length - suffix.length | 0, suffix, 0, suffix.length, ignoreCase);
  }
  function replace(_this__u8e3s4, oldValue, newValue, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp1 = new RegExp(Companion_getInstance_4().n8(oldValue), ignoreCase ? 'gui' : 'gu');
    // Inline function 'kotlin.text.nativeReplace' call
    var replacement = Companion_getInstance_4().o8(newValue);
    // Inline function 'kotlin.js.asDynamic' call
    return _this__u8e3s4.replace(tmp1, replacement);
  }
  function regionMatches(_this__u8e3s4, thisOffset, other, otherOffset, length, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    return regionMatchesImpl(_this__u8e3s4, thisOffset, other, otherOffset, length, ignoreCase);
  }
  function printStackTrace(_this__u8e3s4) {
    console.error(stackTraceToString(_this__u8e3s4));
  }
  function stackTraceToString(_this__u8e3s4) {
    return (new ExceptionTraceBuilder()).z9(_this__u8e3s4);
  }
  function hasSeen($this, exception) {
    var tmp0 = $this.w9_1;
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.any' call
      var inductionVariable = 0;
      var last = tmp0.length;
      while (inductionVariable < last) {
        var element = tmp0[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (element === exception) {
          tmp$ret$1 = true;
          break $l$block;
        }
      }
      tmp$ret$1 = false;
    }
    return tmp$ret$1;
  }
  function dumpFullTrace($this, _this__u8e3s4, indent, qualifier) {
    if (dumpSelfTrace($this, _this__u8e3s4, indent, qualifier))
      true;
    else
      return Unit_instance;
    var cause = _this__u8e3s4.cause;
    while (!(cause == null)) {
      if (dumpSelfTrace($this, cause, indent, 'Caused by: '))
        true;
      else
        return Unit_instance;
      cause = cause.cause;
    }
  }
  function dumpSelfTrace($this, _this__u8e3s4, indent, qualifier) {
    $this.v9_1.p6(indent).p6(qualifier);
    var shortInfo = _this__u8e3s4.toString();
    if (hasSeen($this, _this__u8e3s4)) {
      $this.v9_1.p6('[CIRCULAR REFERENCE, SEE ABOVE: ').p6(shortInfo).p6(']\n');
      return false;
    }
    // Inline function 'kotlin.js.asDynamic' call
    $this.w9_1.push(_this__u8e3s4);
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = _this__u8e3s4.stack;
    var stack = (tmp == null ? true : typeof tmp === 'string') ? tmp : THROW_CCE();
    if (!(stack == null)) {
      // Inline function 'kotlin.let' call
      var it = indexOf_0(stack, shortInfo);
      var stackStart = it < 0 ? 0 : it + shortInfo.length | 0;
      if (stackStart === 0) {
        $this.v9_1.p6(shortInfo).p6('\n');
      }
      // Inline function 'kotlin.text.isEmpty' call
      var this_0 = $this.x9_1;
      if (charSequenceLength(this_0) === 0) {
        $this.x9_1 = stack;
        $this.y9_1 = stackStart;
      } else {
        stack = dropCommonFrames($this, stack, stackStart);
      }
      // Inline function 'kotlin.text.isNotEmpty' call
      if (charSequenceLength(indent) > 0) {
        var tmp_0;
        if (stackStart === 0) {
          tmp_0 = 0;
        } else {
          // Inline function 'kotlin.text.count' call
          var count = 0;
          var inductionVariable = 0;
          while (inductionVariable < charSequenceLength(shortInfo)) {
            var element = charSequenceGet(shortInfo, inductionVariable);
            inductionVariable = inductionVariable + 1 | 0;
            if (element === _Char___init__impl__6a9atx(10)) {
              count = count + 1 | 0;
            }
          }
          tmp_0 = 1 + count | 0;
        }
        var messageLines = tmp_0;
        // Inline function 'kotlin.sequences.forEachIndexed' call
        var index = 0;
        var _iterator__ex2g4s = lineSequence(stack).f();
        while (_iterator__ex2g4s.g()) {
          var item = _iterator__ex2g4s.h();
          var _unary__edvuaz = index;
          index = _unary__edvuaz + 1 | 0;
          if (checkIndexOverflow(_unary__edvuaz) >= messageLines) {
            $this.v9_1.p6(indent);
          }
          $this.v9_1.p6(item).p6('\n');
        }
      } else {
        $this.v9_1.p6(stack).p6('\n');
      }
    } else {
      $this.v9_1.p6(shortInfo).p6('\n');
    }
    var suppressed = get_suppressedExceptions(_this__u8e3s4);
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!suppressed.k()) {
      var suppressedIndent = indent + '    ';
      var _iterator__ex2g4s_0 = suppressed.f();
      while (_iterator__ex2g4s_0.g()) {
        var s = _iterator__ex2g4s_0.h();
        dumpFullTrace($this, s, suppressedIndent, 'Suppressed: ');
      }
    }
    return true;
  }
  function dropCommonFrames($this, stack, stackStart) {
    var commonFrames = 0;
    var lastBreak = 0;
    var preLastBreak = 0;
    var inductionVariable = 0;
    var tmp0 = $this.x9_1.length - $this.y9_1 | 0;
    // Inline function 'kotlin.comparisons.minOf' call
    var b = stack.length - stackStart | 0;
    var last = Math.min(tmp0, b);
    if (inductionVariable < last)
      $l$loop: do {
        var pos = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var c = charSequenceGet(stack, get_lastIndex_0(stack) - pos | 0);
        if (!(c === charSequenceGet($this.x9_1, get_lastIndex_0($this.x9_1) - pos | 0)))
          break $l$loop;
        if (c === _Char___init__impl__6a9atx(10)) {
          commonFrames = commonFrames + 1 | 0;
          preLastBreak = lastBreak;
          lastBreak = pos;
        }
      }
       while (inductionVariable < last);
    if (commonFrames <= 1)
      return stack;
    while (preLastBreak > 0 && charSequenceGet(stack, get_lastIndex_0(stack) - (preLastBreak - 1 | 0) | 0) === _Char___init__impl__6a9atx(32))
      preLastBreak = preLastBreak - 1 | 0;
    return dropLast(stack, preLastBreak) + ('... and ' + (commonFrames - 1 | 0) + ' more common stack frames skipped');
  }
  function ExceptionTraceBuilder() {
    this.v9_1 = StringBuilder_init_$Create$_0();
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.w9_1 = [];
    this.x9_1 = '';
    this.y9_1 = 0;
  }
  protoOf(ExceptionTraceBuilder).z9 = function (exception) {
    dumpFullTrace(this, exception, '', '');
    return this.v9_1.toString();
  };
  function get_suppressedExceptions(_this__u8e3s4) {
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_safe_receiver = _this__u8e3s4._suppressed;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = tmp0_safe_receiver;
    }
    var tmp1_elvis_lhs = tmp;
    return tmp1_elvis_lhs == null ? emptyList() : tmp1_elvis_lhs;
  }
  function AbstractCollection$toString$lambda(this$0) {
    return function (it) {
      return it === this$0 ? '(this Collection)' : toString_0(it);
    };
  }
  function AbstractCollection() {
  }
  protoOf(AbstractCollection).w = function (element) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.any' call
      var tmp;
      if (isInterface(this, Collection)) {
        tmp = this.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = false;
        break $l$block_0;
      }
      var _iterator__ex2g4s = this.f();
      while (_iterator__ex2g4s.g()) {
        var element_0 = _iterator__ex2g4s.h();
        if (equals(element_0, element)) {
          tmp$ret$0 = true;
          break $l$block_0;
        }
      }
      tmp$ret$0 = false;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractCollection).y = function (elements) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(elements, Collection)) {
        tmp = elements.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var _iterator__ex2g4s = elements.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (!this.w(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractCollection).k = function () {
    return this.i() === 0;
  };
  protoOf(AbstractCollection).toString = function () {
    return joinToString_0(this, ', ', '[', ']', VOID, VOID, AbstractCollection$toString$lambda(this));
  };
  protoOf(AbstractCollection).toArray = function () {
    return collectionToArray(this);
  };
  function IteratorImpl_0($outer) {
    this.ba_1 = $outer;
    this.aa_1 = 0;
  }
  protoOf(IteratorImpl_0).g = function () {
    return this.aa_1 < this.ba_1.i();
  };
  protoOf(IteratorImpl_0).h = function () {
    if (!this.g())
      throw NoSuchElementException_init_$Create$();
    var _unary__edvuaz = this.aa_1;
    this.aa_1 = _unary__edvuaz + 1 | 0;
    return this.ba_1.j(_unary__edvuaz);
  };
  function Companion_5() {
    this.y2_1 = 2147483639;
  }
  protoOf(Companion_5).t3 = function (index, size) {
    if (index < 0 || index >= size) {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
    }
  };
  protoOf(Companion_5).z2 = function (index, size) {
    if (index < 0 || index > size) {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
    }
  };
  protoOf(Companion_5).j8 = function (startIndex, endIndex, size) {
    if (startIndex < 0 || endIndex > size) {
      throw IndexOutOfBoundsException_init_$Create$_0('startIndex: ' + startIndex + ', endIndex: ' + endIndex + ', size: ' + size);
    }
    if (startIndex > endIndex) {
      throw IllegalArgumentException_init_$Create$_0('startIndex: ' + startIndex + ' > endIndex: ' + endIndex);
    }
  };
  protoOf(Companion_5).o5 = function (oldCapacity, minCapacity) {
    var newCapacity = oldCapacity + (oldCapacity >> 1) | 0;
    if ((newCapacity - minCapacity | 0) < 0)
      newCapacity = minCapacity;
    if ((newCapacity - 2147483639 | 0) > 0)
      newCapacity = minCapacity > 2147483639 ? 2147483647 : 2147483639;
    return newCapacity;
  };
  protoOf(Companion_5).f3 = function (c) {
    var hashCode_0 = 1;
    var _iterator__ex2g4s = c.f();
    while (_iterator__ex2g4s.g()) {
      var e = _iterator__ex2g4s.h();
      var tmp = imul(31, hashCode_0);
      var tmp1_elvis_lhs = e == null ? null : hashCode(e);
      hashCode_0 = tmp + (tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs) | 0;
    }
    return hashCode_0;
  };
  protoOf(Companion_5).e3 = function (c, other) {
    if (!(c.i() === other.i()))
      return false;
    var otherIterator = other.f();
    var _iterator__ex2g4s = c.f();
    while (_iterator__ex2g4s.g()) {
      var elem = _iterator__ex2g4s.h();
      var elemOther = otherIterator.h();
      if (!equals(elem, elemOther)) {
        return false;
      }
    }
    return true;
  };
  var Companion_instance_5;
  function Companion_getInstance_5() {
    return Companion_instance_5;
  }
  function AbstractList() {
    AbstractCollection.call(this);
  }
  protoOf(AbstractList).f = function () {
    return new IteratorImpl_0(this);
  };
  protoOf(AbstractList).x = function (element) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.indexOfFirst' call
      var index = 0;
      var _iterator__ex2g4s = this.f();
      while (_iterator__ex2g4s.g()) {
        var item = _iterator__ex2g4s.h();
        if (equals(item, element)) {
          tmp$ret$1 = index;
          break $l$block;
        }
        index = index + 1 | 0;
      }
      tmp$ret$1 = -1;
    }
    return tmp$ret$1;
  };
  protoOf(AbstractList).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtList) : false))
      return false;
    return Companion_instance_5.e3(this, other);
  };
  protoOf(AbstractList).hashCode = function () {
    return Companion_instance_5.f3(this);
  };
  function AbstractMap$keys$1$iterator$1($entryIterator) {
    this.ca_1 = $entryIterator;
  }
  protoOf(AbstractMap$keys$1$iterator$1).g = function () {
    return this.ca_1.g();
  };
  protoOf(AbstractMap$keys$1$iterator$1).h = function () {
    return this.ca_1.h().z();
  };
  function AbstractMap$values$1$iterator$1($entryIterator) {
    this.da_1 = $entryIterator;
  }
  protoOf(AbstractMap$values$1$iterator$1).g = function () {
    return this.da_1.g();
  };
  protoOf(AbstractMap$values$1$iterator$1).h = function () {
    return this.da_1.h().a1();
  };
  function toString_3($this, entry) {
    return toString_4($this, entry.z()) + '=' + toString_4($this, entry.a1());
  }
  function toString_4($this, o) {
    return o === $this ? '(this Map)' : toString_0(o);
  }
  function implFindEntry($this, key) {
    var tmp0 = $this.g1();
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var _iterator__ex2g4s = tmp0.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (equals(element.z(), key)) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    return tmp$ret$1;
  }
  function Companion_6() {
  }
  var Companion_instance_6;
  function Companion_getInstance_6() {
    return Companion_instance_6;
  }
  function AbstractMap$keys$1(this$0) {
    this.ea_1 = this$0;
    AbstractSet.call(this);
  }
  protoOf(AbstractMap$keys$1).c4 = function (element) {
    return this.ea_1.b1(element);
  };
  protoOf(AbstractMap$keys$1).w = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.c4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(AbstractMap$keys$1).f = function () {
    var entryIterator = this.ea_1.g1().f();
    return new AbstractMap$keys$1$iterator$1(entryIterator);
  };
  protoOf(AbstractMap$keys$1).i = function () {
    return this.ea_1.i();
  };
  function AbstractMap$toString$lambda(this$0) {
    return function (it) {
      return toString_3(this$0, it);
    };
  }
  function AbstractMap$values$1(this$0) {
    this.fa_1 = this$0;
    AbstractCollection.call(this);
  }
  protoOf(AbstractMap$values$1).i4 = function (element) {
    return this.fa_1.c1(element);
  };
  protoOf(AbstractMap$values$1).w = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.i4((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(AbstractMap$values$1).f = function () {
    var entryIterator = this.fa_1.g1().f();
    return new AbstractMap$values$1$iterator$1(entryIterator);
  };
  protoOf(AbstractMap$values$1).i = function () {
    return this.fa_1.i();
  };
  function AbstractMap() {
    this.n3_1 = null;
    this.o3_1 = null;
  }
  protoOf(AbstractMap).b1 = function (key) {
    return !(implFindEntry(this, key) == null);
  };
  protoOf(AbstractMap).c1 = function (value) {
    var tmp0 = this.g1();
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.any' call
      var tmp;
      if (isInterface(tmp0, Collection)) {
        tmp = tmp0.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = false;
        break $l$block_0;
      }
      var _iterator__ex2g4s = tmp0.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (equals(element.a1(), value)) {
          tmp$ret$0 = true;
          break $l$block_0;
        }
      }
      tmp$ret$0 = false;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractMap).p3 = function (entry) {
    if (!(!(entry == null) ? isInterface(entry, Entry) : false))
      return false;
    var key = entry.z();
    var value = entry.a1();
    // Inline function 'kotlin.collections.get' call
    var ourValue = (isInterface(this, KtMap) ? this : THROW_CCE()).d1(key);
    if (!equals(value, ourValue)) {
      return false;
    }
    var tmp;
    if (ourValue == null) {
      // Inline function 'kotlin.collections.containsKey' call
      tmp = !(isInterface(this, KtMap) ? this : THROW_CCE()).b1(key);
    } else {
      tmp = false;
    }
    if (tmp) {
      return false;
    }
    return true;
  };
  protoOf(AbstractMap).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtMap) : false))
      return false;
    if (!(this.i() === other.i()))
      return false;
    var tmp0 = other.g1();
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(tmp0, Collection)) {
        tmp = tmp0.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var _iterator__ex2g4s = tmp0.f();
      while (_iterator__ex2g4s.g()) {
        var element = _iterator__ex2g4s.h();
        if (!this.p3(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractMap).d1 = function (key) {
    var tmp0_safe_receiver = implFindEntry(this, key);
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.a1();
  };
  protoOf(AbstractMap).hashCode = function () {
    return hashCode(this.g1());
  };
  protoOf(AbstractMap).k = function () {
    return this.i() === 0;
  };
  protoOf(AbstractMap).i = function () {
    return this.g1().i();
  };
  protoOf(AbstractMap).e1 = function () {
    if (this.n3_1 == null) {
      var tmp = this;
      tmp.n3_1 = new AbstractMap$keys$1(this);
    }
    return ensureNotNull(this.n3_1);
  };
  protoOf(AbstractMap).toString = function () {
    var tmp = this.g1();
    return joinToString_0(tmp, ', ', '{', '}', VOID, VOID, AbstractMap$toString$lambda(this));
  };
  protoOf(AbstractMap).f1 = function () {
    if (this.o3_1 == null) {
      var tmp = this;
      tmp.o3_1 = new AbstractMap$values$1(this);
    }
    return ensureNotNull(this.o3_1);
  };
  function Companion_7() {
  }
  protoOf(Companion_7).r3 = function (c) {
    var hashCode_0 = 0;
    var _iterator__ex2g4s = c.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      var tmp = hashCode_0;
      var tmp1_elvis_lhs = element == null ? null : hashCode(element);
      hashCode_0 = tmp + (tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs) | 0;
    }
    return hashCode_0;
  };
  protoOf(Companion_7).q3 = function (c, other) {
    if (!(c.i() === other.i()))
      return false;
    return c.y(other);
  };
  var Companion_instance_7;
  function Companion_getInstance_7() {
    return Companion_instance_7;
  }
  function AbstractSet() {
    AbstractCollection.call(this);
  }
  protoOf(AbstractSet).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtSet) : false))
      return false;
    return Companion_instance_7.q3(this, other);
  };
  protoOf(AbstractSet).hashCode = function () {
    return Companion_instance_7.r3(this);
  };
  function collectionToArrayCommonImpl(collection) {
    if (collection.k()) {
      // Inline function 'kotlin.emptyArray' call
      return [];
    }
    // Inline function 'kotlin.arrayOfNulls' call
    var size = collection.i();
    var destination = Array(size);
    var iterator = collection.f();
    var index = 0;
    while (iterator.g()) {
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      destination[_unary__edvuaz] = iterator.h();
    }
    return destination;
  }
  function listOf_0(elements) {
    return elements.length > 0 ? asList(elements) : emptyList();
  }
  function EmptyList() {
    EmptyList_instance = this;
    this.ga_1 = new Long(-1478467534, -1720727600);
  }
  protoOf(EmptyList).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, KtList) : false) {
      tmp = other.k();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptyList).hashCode = function () {
    return 1;
  };
  protoOf(EmptyList).toString = function () {
    return '[]';
  };
  protoOf(EmptyList).i = function () {
    return 0;
  };
  protoOf(EmptyList).k = function () {
    return true;
  };
  protoOf(EmptyList).ha = function (element) {
    return false;
  };
  protoOf(EmptyList).w = function (element) {
    if (true)
      return false;
    var tmp;
    if (false) {} else {
      tmp = THROW_CCE();
    }
    return this.ha(tmp);
  };
  protoOf(EmptyList).j = function (index) {
    throw IndexOutOfBoundsException_init_$Create$_0("Empty list doesn't contain element at index " + index + '.');
  };
  protoOf(EmptyList).ia = function (element) {
    return -1;
  };
  protoOf(EmptyList).x = function (element) {
    if (true)
      return -1;
    var tmp;
    if (false) {} else {
      tmp = THROW_CCE();
    }
    return this.ia(tmp);
  };
  protoOf(EmptyList).f = function () {
    return EmptyIterator_instance;
  };
  var EmptyList_instance;
  function EmptyList_getInstance() {
    if (EmptyList_instance == null)
      new EmptyList();
    return EmptyList_instance;
  }
  function emptyList() {
    return EmptyList_getInstance();
  }
  function get_lastIndex(_this__u8e3s4) {
    return _this__u8e3s4.i() - 1 | 0;
  }
  function EmptyIterator() {
  }
  protoOf(EmptyIterator).g = function () {
    return false;
  };
  protoOf(EmptyIterator).h = function () {
    throw NoSuchElementException_init_$Create$();
  };
  var EmptyIterator_instance;
  function EmptyIterator_getInstance() {
    return EmptyIterator_instance;
  }
  function asCollection(_this__u8e3s4) {
    return new ArrayAsCollection(_this__u8e3s4, false);
  }
  function arrayListOf(elements) {
    return elements.length === 0 ? ArrayList_init_$Create$() : ArrayList_init_$Create$_1(new ArrayAsCollection(elements, true));
  }
  function throwIndexOverflow() {
    throw ArithmeticException_init_$Create$_0('Index overflow has happened.');
  }
  function get_indices(_this__u8e3s4) {
    return numberRangeToNumber(0, _this__u8e3s4.i() - 1 | 0);
  }
  function ArrayAsCollection(values, isVarargs) {
    this.ja_1 = values;
    this.ka_1 = isVarargs;
  }
  protoOf(ArrayAsCollection).i = function () {
    return this.ja_1.length;
  };
  protoOf(ArrayAsCollection).k = function () {
    // Inline function 'kotlin.collections.isEmpty' call
    return this.ja_1.length === 0;
  };
  protoOf(ArrayAsCollection).f = function () {
    return arrayIterator(this.ja_1);
  };
  function throwCountOverflow() {
    throw ArithmeticException_init_$Create$_0('Count overflow has happened.');
  }
  function collectionSizeOrDefault(_this__u8e3s4, default_0) {
    var tmp;
    if (isInterface(_this__u8e3s4, Collection)) {
      tmp = _this__u8e3s4.i();
    } else {
      tmp = default_0;
    }
    return tmp;
  }
  function mapOf_0(pairs) {
    return pairs.length > 0 ? toMap(pairs, LinkedHashMap_init_$Create$_0(mapCapacity(pairs.length))) : emptyMap();
  }
  function emptyMap() {
    var tmp = EmptyMap_getInstance();
    return isInterface(tmp, KtMap) ? tmp : THROW_CCE();
  }
  function toMap(_this__u8e3s4, destination) {
    // Inline function 'kotlin.apply' call
    putAll(destination, _this__u8e3s4);
    return destination;
  }
  function EmptyMap() {
    EmptyMap_instance = this;
    this.la_1 = new Long(-888910638, 1920087921);
  }
  protoOf(EmptyMap).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, KtMap) : false) {
      tmp = other.k();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptyMap).hashCode = function () {
    return 0;
  };
  protoOf(EmptyMap).toString = function () {
    return '{}';
  };
  protoOf(EmptyMap).i = function () {
    return 0;
  };
  protoOf(EmptyMap).k = function () {
    return true;
  };
  protoOf(EmptyMap).ma = function (key) {
    return false;
  };
  protoOf(EmptyMap).b1 = function (key) {
    if (!(key == null ? true : !(key == null)))
      return false;
    return this.ma((key == null ? true : !(key == null)) ? key : THROW_CCE());
  };
  protoOf(EmptyMap).na = function (value) {
    return false;
  };
  protoOf(EmptyMap).c1 = function (value) {
    if (true)
      return false;
    var tmp;
    if (false) {} else {
      tmp = THROW_CCE();
    }
    return this.na(tmp);
  };
  protoOf(EmptyMap).oa = function (key) {
    return null;
  };
  protoOf(EmptyMap).d1 = function (key) {
    if (!(key == null ? true : !(key == null)))
      return null;
    return this.oa((key == null ? true : !(key == null)) ? key : THROW_CCE());
  };
  protoOf(EmptyMap).g1 = function () {
    return EmptySet_getInstance();
  };
  protoOf(EmptyMap).e1 = function () {
    return EmptySet_getInstance();
  };
  protoOf(EmptyMap).f1 = function () {
    return EmptyList_getInstance();
  };
  var EmptyMap_instance;
  function EmptyMap_getInstance() {
    if (EmptyMap_instance == null)
      new EmptyMap();
    return EmptyMap_instance;
  }
  function putAll(_this__u8e3s4, pairs) {
    var inductionVariable = 0;
    var last = pairs.length;
    while (inductionVariable < last) {
      var _destruct__k2r9zo = pairs[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var key = _destruct__k2r9zo.z6();
      var value = _destruct__k2r9zo.a7();
      _this__u8e3s4.k2(key, value);
    }
  }
  function hashMapOf(pairs) {
    // Inline function 'kotlin.apply' call
    var this_0 = HashMap_init_$Create$_0(mapCapacity(pairs.length));
    putAll(this_0, pairs);
    return this_0;
  }
  function IntIterator() {
  }
  protoOf(IntIterator).h = function () {
    return this.pa();
  };
  function generateSequence(seedFunction, nextFunction) {
    return new GeneratorSequence(seedFunction, nextFunction);
  }
  function emptySequence() {
    return EmptySequence_instance;
  }
  function DropTakeSequence() {
  }
  function TakeSequence$iterator$1(this$0) {
    this.qa_1 = this$0.ta_1;
    this.ra_1 = this$0.sa_1.f();
  }
  protoOf(TakeSequence$iterator$1).h = function () {
    if (this.qa_1 === 0)
      throw NoSuchElementException_init_$Create$();
    this.qa_1 = this.qa_1 - 1 | 0;
    return this.ra_1.h();
  };
  protoOf(TakeSequence$iterator$1).g = function () {
    return this.qa_1 > 0 && this.ra_1.g();
  };
  function TakeSequence(sequence, count) {
    this.sa_1 = sequence;
    this.ta_1 = count;
    // Inline function 'kotlin.require' call
    if (!(this.ta_1 >= 0)) {
      var message = 'count must be non-negative, but was ' + this.ta_1 + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
  }
  protoOf(TakeSequence).r = function (n) {
    return n >= this.ta_1 ? this : new TakeSequence(this.sa_1, n);
  };
  protoOf(TakeSequence).f = function () {
    return new TakeSequence$iterator$1(this);
  };
  function TransformingSequence$iterator$1(this$0) {
    this.va_1 = this$0;
    this.ua_1 = this$0.wa_1.f();
  }
  protoOf(TransformingSequence$iterator$1).h = function () {
    return this.va_1.xa_1(this.ua_1.h());
  };
  protoOf(TransformingSequence$iterator$1).g = function () {
    return this.ua_1.g();
  };
  function TransformingSequence(sequence, transformer) {
    this.wa_1 = sequence;
    this.xa_1 = transformer;
  }
  protoOf(TransformingSequence).f = function () {
    return new TransformingSequence$iterator$1(this);
  };
  function calcNext($this) {
    $this.ya_1 = $this.za_1 === -2 ? $this.ab_1.bb_1() : $this.ab_1.cb_1(ensureNotNull($this.ya_1));
    $this.za_1 = $this.ya_1 == null ? 0 : 1;
  }
  function GeneratorSequence$iterator$1(this$0) {
    this.ab_1 = this$0;
    this.ya_1 = null;
    this.za_1 = -2;
  }
  protoOf(GeneratorSequence$iterator$1).h = function () {
    if (this.za_1 < 0) {
      calcNext(this);
    }
    if (this.za_1 === 0)
      throw NoSuchElementException_init_$Create$();
    var tmp = this.ya_1;
    var result = !(tmp == null) ? tmp : THROW_CCE();
    this.za_1 = -1;
    return result;
  };
  protoOf(GeneratorSequence$iterator$1).g = function () {
    if (this.za_1 < 0) {
      calcNext(this);
    }
    return this.za_1 === 1;
  };
  function GeneratorSequence(getInitialValue, getNextValue) {
    this.bb_1 = getInitialValue;
    this.cb_1 = getNextValue;
  }
  protoOf(GeneratorSequence).f = function () {
    return new GeneratorSequence$iterator$1(this);
  };
  function EmptySequence() {
  }
  protoOf(EmptySequence).f = function () {
    return EmptyIterator_instance;
  };
  protoOf(EmptySequence).r = function (n) {
    return EmptySequence_instance;
  };
  var EmptySequence_instance;
  function EmptySequence_getInstance() {
    return EmptySequence_instance;
  }
  function setOf_0(elements) {
    return toSet(elements);
  }
  function EmptySet() {
    EmptySet_instance = this;
    this.db_1 = new Long(1993859828, 793161749);
  }
  protoOf(EmptySet).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, KtSet) : false) {
      tmp = other.k();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptySet).hashCode = function () {
    return 0;
  };
  protoOf(EmptySet).toString = function () {
    return '[]';
  };
  protoOf(EmptySet).i = function () {
    return 0;
  };
  protoOf(EmptySet).k = function () {
    return true;
  };
  protoOf(EmptySet).ha = function (element) {
    return false;
  };
  protoOf(EmptySet).w = function (element) {
    if (true)
      return false;
    var tmp;
    if (false) {} else {
      tmp = THROW_CCE();
    }
    return this.ha(tmp);
  };
  protoOf(EmptySet).eb = function (elements) {
    return elements.k();
  };
  protoOf(EmptySet).y = function (elements) {
    return this.eb(elements);
  };
  protoOf(EmptySet).f = function () {
    return EmptyIterator_instance;
  };
  var EmptySet_instance;
  function EmptySet_getInstance() {
    if (EmptySet_instance == null)
      new EmptySet();
    return EmptySet_instance;
  }
  function emptySet() {
    return EmptySet_getInstance();
  }
  function optimizeReadOnlySet(_this__u8e3s4) {
    switch (_this__u8e3s4.i()) {
      case 0:
        return emptySet();
      case 1:
        return setOf(_this__u8e3s4.f().h());
      default:
        return _this__u8e3s4;
    }
  }
  function hashSetOf(elements) {
    return toCollection(elements, HashSet_init_$Create$_0(mapCapacity(elements.length)));
  }
  function getProgressionLastElement(start, end, step) {
    var tmp;
    if (step > 0) {
      tmp = start >= end ? end : end - differenceModulo(end, start, step) | 0;
    } else if (step < 0) {
      tmp = start <= end ? end : end + differenceModulo(start, end, -step | 0) | 0;
    } else {
      throw IllegalArgumentException_init_$Create$_0('Step is zero.');
    }
    return tmp;
  }
  function differenceModulo(a, b, c) {
    return mod(mod(a, c) - mod(b, c) | 0, c);
  }
  function mod(a, b) {
    var mod = a % b | 0;
    return mod >= 0 ? mod : mod + b | 0;
  }
  function Default() {
    Default_instance = this;
    Random.call(this);
    this.fb_1 = defaultPlatformRandom();
  }
  protoOf(Default).gb = function (bitCount) {
    return this.fb_1.gb(bitCount);
  };
  protoOf(Default).pa = function () {
    return this.fb_1.pa();
  };
  protoOf(Default).hb = function (until) {
    return this.fb_1.hb(until);
  };
  protoOf(Default).ib = function (from, until) {
    return this.fb_1.ib(from, until);
  };
  var Default_instance;
  function Default_getInstance() {
    if (Default_instance == null)
      new Default();
    return Default_instance;
  }
  function Random() {
    Default_getInstance();
  }
  protoOf(Random).pa = function () {
    return this.gb(32);
  };
  protoOf(Random).hb = function (until) {
    return this.ib(0, until);
  };
  protoOf(Random).ib = function (from, until) {
    checkRangeBounds(from, until);
    var n = until - from | 0;
    if (n > 0 || n === -2147483648) {
      var tmp;
      if ((n & (-n | 0)) === n) {
        var bitCount = fastLog2(n);
        tmp = this.gb(bitCount);
      } else {
        var v;
        do {
          var bits = this.pa() >>> 1 | 0;
          v = bits % n | 0;
        }
         while (((bits - v | 0) + (n - 1 | 0) | 0) < 0);
        tmp = v;
      }
      var rnd = tmp;
      return from + rnd | 0;
    } else {
      while (true) {
        var rnd_0 = this.pa();
        if (from <= rnd_0 ? rnd_0 < until : false)
          return rnd_0;
      }
    }
  };
  function checkRangeBounds(from, until) {
    // Inline function 'kotlin.require' call
    if (!(until > from)) {
      var message = boundsErrorMessage(from, until);
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return Unit_instance;
  }
  function fastLog2(value) {
    // Inline function 'kotlin.countLeadingZeroBits' call
    return 31 - clz32(value) | 0;
  }
  function boundsErrorMessage(from, until) {
    return 'Random range is empty: [' + toString_1(from) + ', ' + toString_1(until) + ').';
  }
  function Random_0(seed) {
    return XorWowRandom_init_$Create$(seed, seed >> 31);
  }
  function takeUpperBits(_this__u8e3s4, bitCount) {
    return (_this__u8e3s4 >>> (32 - bitCount | 0) | 0) & (-bitCount | 0) >> 31;
  }
  function XorWowRandom_init_$Init$(seed1, seed2, $this) {
    XorWowRandom.call($this, seed1, seed2, 0, 0, ~seed1, seed1 << 10 ^ (seed2 >>> 4 | 0));
    return $this;
  }
  function XorWowRandom_init_$Create$(seed1, seed2) {
    return XorWowRandom_init_$Init$(seed1, seed2, objectCreate(protoOf(XorWowRandom)));
  }
  function Companion_8() {
    Companion_instance_8 = this;
    this.jb_1 = new Long(0, 0);
  }
  var Companion_instance_8;
  function Companion_getInstance_8() {
    if (Companion_instance_8 == null)
      new Companion_8();
    return Companion_instance_8;
  }
  function XorWowRandom(x, y, z, w, v, addend) {
    Companion_getInstance_8();
    Random.call(this);
    this.kb_1 = x;
    this.lb_1 = y;
    this.mb_1 = z;
    this.nb_1 = w;
    this.ob_1 = v;
    this.pb_1 = addend;
    // Inline function 'kotlin.require' call
    if (!!((this.kb_1 | this.lb_1 | this.mb_1 | this.nb_1 | this.ob_1) === 0)) {
      var message = 'Initial state must have at least one non-zero element.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.repeat' call
    var inductionVariable = 0;
    if (inductionVariable < 64)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        this.pa();
      }
       while (inductionVariable < 64);
  }
  protoOf(XorWowRandom).pa = function () {
    var t = this.kb_1;
    t = t ^ (t >>> 2 | 0);
    this.kb_1 = this.lb_1;
    this.lb_1 = this.mb_1;
    this.mb_1 = this.nb_1;
    var v0 = this.ob_1;
    this.nb_1 = v0;
    t = t ^ t << 1 ^ v0 ^ v0 << 4;
    this.ob_1 = t;
    this.pb_1 = this.pb_1 + 362437 | 0;
    return t + this.pb_1 | 0;
  };
  protoOf(XorWowRandom).gb = function (bitCount) {
    return takeUpperBits(this.pa(), bitCount);
  };
  function Companion_9() {
    Companion_instance_9 = this;
    this.p_1 = new IntRange(1, 0);
  }
  var Companion_instance_9;
  function Companion_getInstance_9() {
    if (Companion_instance_9 == null)
      new Companion_9();
    return Companion_instance_9;
  }
  function IntRange(start, endInclusive) {
    Companion_getInstance_9();
    IntProgression.call(this, start, endInclusive, 1);
  }
  protoOf(IntRange).d9 = function () {
    return this.qb_1;
  };
  protoOf(IntRange).e9 = function () {
    return this.rb_1;
  };
  protoOf(IntRange).k = function () {
    return this.qb_1 > this.rb_1;
  };
  protoOf(IntRange).equals = function (other) {
    var tmp;
    if (other instanceof IntRange) {
      tmp = this.k() && other.k() || (this.qb_1 === other.qb_1 && this.rb_1 === other.rb_1);
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(IntRange).hashCode = function () {
    return this.k() ? -1 : imul(31, this.qb_1) + this.rb_1 | 0;
  };
  protoOf(IntRange).toString = function () {
    return '' + this.qb_1 + '..' + this.rb_1;
  };
  function IntProgressionIterator(first, last, step) {
    IntIterator.call(this);
    this.tb_1 = step;
    this.ub_1 = last;
    this.vb_1 = this.tb_1 > 0 ? first <= last : first >= last;
    this.wb_1 = this.vb_1 ? first : this.ub_1;
  }
  protoOf(IntProgressionIterator).g = function () {
    return this.vb_1;
  };
  protoOf(IntProgressionIterator).pa = function () {
    var value = this.wb_1;
    if (value === this.ub_1) {
      if (!this.vb_1)
        throw NoSuchElementException_init_$Create$();
      this.vb_1 = false;
    } else {
      this.wb_1 = this.wb_1 + this.tb_1 | 0;
    }
    return value;
  };
  function Companion_10() {
  }
  protoOf(Companion_10).q = function (rangeStart, rangeEnd, step) {
    return new IntProgression(rangeStart, rangeEnd, step);
  };
  var Companion_instance_10;
  function Companion_getInstance_10() {
    return Companion_instance_10;
  }
  function IntProgression(start, endInclusive, step) {
    if (step === 0)
      throw IllegalArgumentException_init_$Create$_0('Step must be non-zero.');
    if (step === -2147483648)
      throw IllegalArgumentException_init_$Create$_0('Step must be greater than Int.MIN_VALUE to avoid overflow on negation.');
    this.qb_1 = start;
    this.rb_1 = getProgressionLastElement(start, endInclusive, step);
    this.sb_1 = step;
  }
  protoOf(IntProgression).f = function () {
    return new IntProgressionIterator(this.qb_1, this.rb_1, this.sb_1);
  };
  protoOf(IntProgression).k = function () {
    return this.sb_1 > 0 ? this.qb_1 > this.rb_1 : this.qb_1 < this.rb_1;
  };
  protoOf(IntProgression).equals = function (other) {
    var tmp;
    if (other instanceof IntProgression) {
      tmp = this.k() && other.k() || (this.qb_1 === other.qb_1 && this.rb_1 === other.rb_1 && this.sb_1 === other.sb_1);
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(IntProgression).hashCode = function () {
    return this.k() ? -1 : imul(31, imul(31, this.qb_1) + this.rb_1 | 0) + this.sb_1 | 0;
  };
  protoOf(IntProgression).toString = function () {
    return this.sb_1 > 0 ? '' + this.qb_1 + '..' + this.rb_1 + ' step ' + this.sb_1 : '' + this.qb_1 + ' downTo ' + this.rb_1 + ' step ' + (-this.sb_1 | 0);
  };
  function appendElement(_this__u8e3s4, element, transform) {
    if (!(transform == null))
      _this__u8e3s4.e(transform(element));
    else {
      if (element == null ? true : isCharSequence(element))
        _this__u8e3s4.e(element);
      else {
        if (element instanceof Char)
          _this__u8e3s4.q6(element.xb_1);
        else {
          _this__u8e3s4.e(toString_1(element));
        }
      }
    }
  }
  function equals_0(_this__u8e3s4, other, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    if (_this__u8e3s4 === other)
      return true;
    if (!ignoreCase)
      return false;
    var thisUpper = uppercaseChar(_this__u8e3s4);
    var otherUpper = uppercaseChar(other);
    var tmp;
    if (thisUpper === otherUpper) {
      tmp = true;
    } else {
      // Inline function 'kotlin.text.lowercaseChar' call
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$2 = toString(thisUpper).toLowerCase();
      var tmp_0 = charSequenceGet(tmp$ret$2, 0);
      // Inline function 'kotlin.text.lowercaseChar' call
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$6 = toString(otherUpper).toLowerCase();
      tmp = tmp_0 === charSequenceGet(tmp$ret$6, 0);
    }
    return tmp;
  }
  function trimIndent(_this__u8e3s4) {
    return replaceIndent(_this__u8e3s4, '');
  }
  function replaceIndent(_this__u8e3s4, newIndent) {
    newIndent = newIndent === VOID ? '' : newIndent;
    var lines_0 = lines(_this__u8e3s4);
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var destination = ArrayList_init_$Create$();
    var _iterator__ex2g4s = lines_0.f();
    while (_iterator__ex2g4s.g()) {
      var element = _iterator__ex2g4s.h();
      // Inline function 'kotlin.text.isNotBlank' call
      if (!isBlank(element)) {
        destination.d(element);
      }
    }
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(destination, 10));
    var _iterator__ex2g4s_0 = destination.f();
    while (_iterator__ex2g4s_0.g()) {
      var item = _iterator__ex2g4s_0.h();
      var tmp$ret$4 = indentWidth(item);
      destination_0.d(tmp$ret$4);
    }
    var tmp0_elvis_lhs = minOrNull(destination_0);
    var minCommonIndent = tmp0_elvis_lhs == null ? 0 : tmp0_elvis_lhs;
    var tmp1 = _this__u8e3s4.length + imul(newIndent.length, lines_0.i()) | 0;
    // Inline function 'kotlin.text.reindent' call
    var indentAddFunction = getIndentFunction(newIndent);
    var lastIndex = get_lastIndex(lines_0);
    // Inline function 'kotlin.collections.mapIndexedNotNull' call
    // Inline function 'kotlin.collections.mapIndexedNotNullTo' call
    var destination_1 = ArrayList_init_$Create$();
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index = 0;
    var _iterator__ex2g4s_1 = lines_0.f();
    while (_iterator__ex2g4s_1.g()) {
      var item_0 = _iterator__ex2g4s_1.h();
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      var index_0 = checkIndexOverflow(_unary__edvuaz);
      var tmp;
      if ((index_0 === 0 || index_0 === lastIndex) && isBlank(item_0)) {
        tmp = null;
      } else {
        var tmp0_safe_receiver = drop(item_0, minCommonIndent);
        var tmp_0;
        if (tmp0_safe_receiver == null) {
          tmp_0 = null;
        } else {
          // Inline function 'kotlin.let' call
          tmp_0 = indentAddFunction(tmp0_safe_receiver);
        }
        var tmp1_elvis_lhs = tmp_0;
        tmp = tmp1_elvis_lhs == null ? item_0 : tmp1_elvis_lhs;
      }
      var tmp0_safe_receiver_0 = tmp;
      if (tmp0_safe_receiver_0 == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        destination_1.d(tmp0_safe_receiver_0);
      }
    }
    return joinTo_0(destination_1, StringBuilder_init_$Create$(tmp1), '\n').toString();
  }
  function indentWidth(_this__u8e3s4) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.text.indexOfFirst' call
      var inductionVariable = 0;
      var last = charSequenceLength(_this__u8e3s4) - 1 | 0;
      if (inductionVariable <= last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          var it = charSequenceGet(_this__u8e3s4, index);
          if (!isWhitespace(it)) {
            tmp$ret$1 = index;
            break $l$block;
          }
        }
         while (inductionVariable <= last);
      tmp$ret$1 = -1;
    }
    // Inline function 'kotlin.let' call
    var it_0 = tmp$ret$1;
    return it_0 === -1 ? _this__u8e3s4.length : it_0;
  }
  function getIndentFunction(indent) {
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(indent) === 0) {
      tmp = getIndentFunction$lambda;
    } else {
      tmp = getIndentFunction$lambda_0(indent);
    }
    return tmp;
  }
  function getIndentFunction$lambda(line) {
    return line;
  }
  function getIndentFunction$lambda_0($indent) {
    return function (line) {
      return $indent + line;
    };
  }
  function toLongOrNull(_this__u8e3s4) {
    return toLongOrNull_0(_this__u8e3s4, 10);
  }
  function toIntOrNull(_this__u8e3s4) {
    return toIntOrNull_0(_this__u8e3s4, 10);
  }
  function numberFormatError(input) {
    throw NumberFormatException_init_$Create$_0("Invalid number format: '" + input + "'");
  }
  function toIntOrNull_0(_this__u8e3s4, radix) {
    checkRadix(radix);
    var length = _this__u8e3s4.length;
    if (length === 0)
      return null;
    var start;
    var isNegative;
    var limit;
    var firstChar = charSequenceGet(_this__u8e3s4, 0);
    if (Char__compareTo_impl_ypi4mb(firstChar, _Char___init__impl__6a9atx(48)) < 0) {
      if (length === 1)
        return null;
      start = 1;
      if (firstChar === _Char___init__impl__6a9atx(45)) {
        isNegative = true;
        limit = -2147483648;
      } else if (firstChar === _Char___init__impl__6a9atx(43)) {
        isNegative = false;
        limit = -2147483647;
      } else
        return null;
    } else {
      start = 0;
      isNegative = false;
      limit = -2147483647;
    }
    var limitForMaxRadix = -59652323;
    var limitBeforeMul = limitForMaxRadix;
    var result = 0;
    var inductionVariable = start;
    if (inductionVariable < length)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var digit = digitOf(charSequenceGet(_this__u8e3s4, i), radix);
        if (digit < 0)
          return null;
        if (result < limitBeforeMul) {
          if (limitBeforeMul === limitForMaxRadix) {
            limitBeforeMul = limit / radix | 0;
            if (result < limitBeforeMul) {
              return null;
            }
          } else {
            return null;
          }
        }
        result = imul(result, radix);
        if (result < (limit + digit | 0))
          return null;
        result = result - digit | 0;
      }
       while (inductionVariable < length);
    return isNegative ? result : -result | 0;
  }
  function toLongOrNull_0(_this__u8e3s4, radix) {
    checkRadix(radix);
    var length = _this__u8e3s4.length;
    if (length === 0)
      return null;
    var start;
    var isNegative;
    var limit;
    var firstChar = charSequenceGet(_this__u8e3s4, 0);
    if (Char__compareTo_impl_ypi4mb(firstChar, _Char___init__impl__6a9atx(48)) < 0) {
      if (length === 1)
        return null;
      start = 1;
      if (firstChar === _Char___init__impl__6a9atx(45)) {
        isNegative = true;
        limit = new Long(0, -2147483648);
      } else if (firstChar === _Char___init__impl__6a9atx(43)) {
        isNegative = false;
        limit = new Long(1, -2147483648);
      } else
        return null;
    } else {
      start = 0;
      isNegative = false;
      limit = new Long(1, -2147483648);
    }
    // Inline function 'kotlin.Long.div' call
    var limitForMaxRadix = (new Long(1, -2147483648)).t1(toLong(36));
    var limitBeforeMul = limitForMaxRadix;
    var result = new Long(0, 0);
    var inductionVariable = start;
    if (inductionVariable < length)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var digit = digitOf(charSequenceGet(_this__u8e3s4, i), radix);
        if (digit < 0)
          return null;
        if (result.p1(limitBeforeMul) < 0) {
          if (limitBeforeMul.equals(limitForMaxRadix)) {
            // Inline function 'kotlin.Long.div' call
            limitBeforeMul = limit.t1(toLong(radix));
            if (result.p1(limitBeforeMul) < 0) {
              return null;
            }
          } else {
            return null;
          }
        }
        // Inline function 'kotlin.Long.times' call
        result = result.s1(toLong(radix));
        var tmp = result;
        // Inline function 'kotlin.Long.plus' call
        var tmp$ret$3 = limit.q1(toLong(digit));
        if (tmp.p1(tmp$ret$3) < 0)
          return null;
        // Inline function 'kotlin.Long.minus' call
        result = result.r1(toLong(digit));
      }
       while (inductionVariable < length);
    return isNegative ? result : result.v1();
  }
  function contains_0(_this__u8e3s4, other, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp;
    if (typeof other === 'string') {
      tmp = indexOf_0(_this__u8e3s4, other, VOID, ignoreCase) >= 0;
    } else {
      tmp = indexOf_2(_this__u8e3s4, other, 0, charSequenceLength(_this__u8e3s4), ignoreCase) >= 0;
    }
    return tmp;
  }
  function split(_this__u8e3s4, delimiters, ignoreCase, limit) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    limit = limit === VOID ? 0 : limit;
    if (delimiters.length === 1) {
      var delimiter = delimiters[0];
      // Inline function 'kotlin.text.isEmpty' call
      if (!(charSequenceLength(delimiter) === 0)) {
        return split_0(_this__u8e3s4, delimiter, ignoreCase, limit);
      }
    }
    // Inline function 'kotlin.collections.map' call
    var this_0 = asIterable(rangesDelimitedBy(_this__u8e3s4, delimiters, VOID, ignoreCase, limit));
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s = this_0.f();
    while (_iterator__ex2g4s.g()) {
      var item = _iterator__ex2g4s.h();
      var tmp$ret$1 = substring(_this__u8e3s4, item);
      destination.d(tmp$ret$1);
    }
    return destination;
  }
  function padStart(_this__u8e3s4, length, padChar) {
    padChar = padChar === VOID ? _Char___init__impl__6a9atx(32) : padChar;
    return toString_1(padStart_0(isCharSequence(_this__u8e3s4) ? _this__u8e3s4 : THROW_CCE(), length, padChar));
  }
  function indexOf_0(_this__u8e3s4, string, startIndex, ignoreCase) {
    startIndex = startIndex === VOID ? 0 : startIndex;
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp;
    var tmp_0;
    if (ignoreCase) {
      tmp_0 = true;
    } else {
      tmp_0 = !(typeof _this__u8e3s4 === 'string');
    }
    if (tmp_0) {
      tmp = indexOf_2(_this__u8e3s4, string, startIndex, charSequenceLength(_this__u8e3s4), ignoreCase);
    } else {
      // Inline function 'kotlin.text.nativeIndexOf' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = _this__u8e3s4.indexOf(string, startIndex);
    }
    return tmp;
  }
  function indexOf_1(_this__u8e3s4, char, startIndex, ignoreCase) {
    startIndex = startIndex === VOID ? 0 : startIndex;
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp;
    var tmp_0;
    if (ignoreCase) {
      tmp_0 = true;
    } else {
      tmp_0 = !(typeof _this__u8e3s4 === 'string');
    }
    if (tmp_0) {
      // Inline function 'kotlin.charArrayOf' call
      var tmp$ret$0 = charArrayOf([char]);
      tmp = indexOfAny(_this__u8e3s4, tmp$ret$0, startIndex, ignoreCase);
    } else {
      // Inline function 'kotlin.text.nativeIndexOf' call
      // Inline function 'kotlin.text.nativeIndexOf' call
      var str = toString(char);
      // Inline function 'kotlin.js.asDynamic' call
      tmp = _this__u8e3s4.indexOf(str, startIndex);
    }
    return tmp;
  }
  function removeSuffix(_this__u8e3s4, suffix) {
    if (endsWith_0(_this__u8e3s4, suffix)) {
      // Inline function 'kotlin.text.substring' call
      var endIndex = _this__u8e3s4.length - charSequenceLength(suffix) | 0;
      // Inline function 'kotlin.js.asDynamic' call
      return _this__u8e3s4.substring(0, endIndex);
    }
    return _this__u8e3s4;
  }
  function indexOf_2(_this__u8e3s4, other, startIndex, endIndex, ignoreCase, last) {
    last = last === VOID ? false : last;
    var indices = !last ? numberRangeToNumber(coerceAtLeast(startIndex, 0), coerceAtMost(endIndex, charSequenceLength(_this__u8e3s4))) : downTo(coerceAtMost(startIndex, get_lastIndex_0(_this__u8e3s4)), coerceAtLeast(endIndex, 0));
    var tmp;
    if (typeof _this__u8e3s4 === 'string') {
      tmp = typeof other === 'string';
    } else {
      tmp = false;
    }
    if (tmp) {
      var inductionVariable = indices.qb_1;
      var last_0 = indices.rb_1;
      var step = indices.sb_1;
      if (step > 0 && inductionVariable <= last_0 || (step < 0 && last_0 <= inductionVariable))
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + step | 0;
          if (regionMatches(other, 0, _this__u8e3s4, index, other.length, ignoreCase))
            return index;
        }
         while (!(index === last_0));
    } else {
      var inductionVariable_0 = indices.qb_1;
      var last_1 = indices.rb_1;
      var step_0 = indices.sb_1;
      if (step_0 > 0 && inductionVariable_0 <= last_1 || (step_0 < 0 && last_1 <= inductionVariable_0))
        do {
          var index_0 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + step_0 | 0;
          if (regionMatchesImpl(other, 0, _this__u8e3s4, index_0, charSequenceLength(other), ignoreCase))
            return index_0;
        }
         while (!(index_0 === last_1));
    }
    return -1;
  }
  function split_0(_this__u8e3s4, delimiter, ignoreCase, limit) {
    requireNonNegativeLimit(limit);
    var currentOffset = 0;
    var nextIndex = indexOf_0(_this__u8e3s4, delimiter, currentOffset, ignoreCase);
    if (nextIndex === -1 || limit === 1) {
      return listOf(toString_1(_this__u8e3s4));
    }
    var isLimited = limit > 0;
    var result = ArrayList_init_$Create$_0(isLimited ? coerceAtMost(limit, 10) : 10);
    $l$loop: do {
      var tmp1 = currentOffset;
      // Inline function 'kotlin.text.substring' call
      var endIndex = nextIndex;
      var tmp$ret$0 = toString_1(charSequenceSubSequence(_this__u8e3s4, tmp1, endIndex));
      result.d(tmp$ret$0);
      currentOffset = nextIndex + delimiter.length | 0;
      if (isLimited && result.i() === (limit - 1 | 0))
        break $l$loop;
      nextIndex = indexOf_0(_this__u8e3s4, delimiter, currentOffset, ignoreCase);
    }
     while (!(nextIndex === -1));
    var tmp4 = currentOffset;
    // Inline function 'kotlin.text.substring' call
    var endIndex_0 = charSequenceLength(_this__u8e3s4);
    var tmp$ret$1 = toString_1(charSequenceSubSequence(_this__u8e3s4, tmp4, endIndex_0));
    result.d(tmp$ret$1);
    return result;
  }
  function substring(_this__u8e3s4, range) {
    return toString_1(charSequenceSubSequence(_this__u8e3s4, range.d9(), range.e9() + 1 | 0));
  }
  function rangesDelimitedBy(_this__u8e3s4, delimiters, startIndex, ignoreCase, limit) {
    startIndex = startIndex === VOID ? 0 : startIndex;
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    limit = limit === VOID ? 0 : limit;
    requireNonNegativeLimit(limit);
    var delimitersList = asList(delimiters);
    return new DelimitedRangesSequence(_this__u8e3s4, startIndex, limit, rangesDelimitedBy$lambda(delimitersList, ignoreCase));
  }
  function padStart_0(_this__u8e3s4, length, padChar) {
    padChar = padChar === VOID ? _Char___init__impl__6a9atx(32) : padChar;
    if (length < 0)
      throw IllegalArgumentException_init_$Create$_0('Desired length ' + length + ' is less than zero.');
    if (length <= charSequenceLength(_this__u8e3s4))
      return charSequenceSubSequence(_this__u8e3s4, 0, charSequenceLength(_this__u8e3s4));
    var sb = StringBuilder_init_$Create$(length);
    var inductionVariable = 1;
    var last = length - charSequenceLength(_this__u8e3s4) | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        sb.q6(padChar);
      }
       while (!(i === last));
    sb.e(_this__u8e3s4);
    return sb;
  }
  function indexOfAny(_this__u8e3s4, chars, startIndex, ignoreCase) {
    startIndex = startIndex === VOID ? 0 : startIndex;
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp;
    if (!ignoreCase && chars.length === 1) {
      tmp = typeof _this__u8e3s4 === 'string';
    } else {
      tmp = false;
    }
    if (tmp) {
      var char = single(chars);
      // Inline function 'kotlin.text.nativeIndexOf' call
      // Inline function 'kotlin.text.nativeIndexOf' call
      var str = toString(char);
      // Inline function 'kotlin.js.asDynamic' call
      return _this__u8e3s4.indexOf(str, startIndex);
    }
    var inductionVariable = coerceAtLeast(startIndex, 0);
    var last = get_lastIndex_0(_this__u8e3s4);
    if (inductionVariable <= last)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var charAtIndex = charSequenceGet(_this__u8e3s4, index);
        var tmp$ret$4;
        $l$block: {
          // Inline function 'kotlin.collections.any' call
          var inductionVariable_0 = 0;
          var last_0 = chars.length;
          while (inductionVariable_0 < last_0) {
            var element = chars[inductionVariable_0];
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            if (equals_0(element, charAtIndex, ignoreCase)) {
              tmp$ret$4 = true;
              break $l$block;
            }
          }
          tmp$ret$4 = false;
        }
        if (tmp$ret$4)
          return index;
      }
       while (!(index === last));
    return -1;
  }
  function endsWith_0(_this__u8e3s4, suffix, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp;
    var tmp_0;
    if (!ignoreCase) {
      tmp_0 = typeof _this__u8e3s4 === 'string';
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      tmp = typeof suffix === 'string';
    } else {
      tmp = false;
    }
    if (tmp)
      return endsWith(_this__u8e3s4, suffix);
    else {
      return regionMatchesImpl(_this__u8e3s4, charSequenceLength(_this__u8e3s4) - charSequenceLength(suffix) | 0, suffix, 0, charSequenceLength(suffix), ignoreCase);
    }
  }
  function get_lastIndex_0(_this__u8e3s4) {
    return charSequenceLength(_this__u8e3s4) - 1 | 0;
  }
  function regionMatchesImpl(_this__u8e3s4, thisOffset, other, otherOffset, length, ignoreCase) {
    if (otherOffset < 0 || thisOffset < 0 || thisOffset > (charSequenceLength(_this__u8e3s4) - length | 0) || otherOffset > (charSequenceLength(other) - length | 0)) {
      return false;
    }
    var inductionVariable = 0;
    if (inductionVariable < length)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (!equals_0(charSequenceGet(_this__u8e3s4, thisOffset + index | 0), charSequenceGet(other, otherOffset + index | 0), ignoreCase))
          return false;
      }
       while (inductionVariable < length);
    return true;
  }
  function requireNonNegativeLimit(limit) {
    // Inline function 'kotlin.require' call
    if (!(limit >= 0)) {
      var message = 'Limit must be non-negative, but was ' + limit;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return Unit_instance;
  }
  function calcNext_0($this) {
    if ($this.ac_1 < 0) {
      $this.yb_1 = 0;
      $this.bc_1 = null;
    } else {
      var tmp;
      var tmp_0;
      if ($this.dc_1.gc_1 > 0) {
        $this.cc_1 = $this.cc_1 + 1 | 0;
        tmp_0 = $this.cc_1 >= $this.dc_1.gc_1;
      } else {
        tmp_0 = false;
      }
      if (tmp_0) {
        tmp = true;
      } else {
        tmp = $this.ac_1 > charSequenceLength($this.dc_1.ec_1);
      }
      if (tmp) {
        $this.bc_1 = numberRangeToNumber($this.zb_1, get_lastIndex_0($this.dc_1.ec_1));
        $this.ac_1 = -1;
      } else {
        var match = $this.dc_1.hc_1($this.dc_1.ec_1, $this.ac_1);
        if (match == null) {
          $this.bc_1 = numberRangeToNumber($this.zb_1, get_lastIndex_0($this.dc_1.ec_1));
          $this.ac_1 = -1;
        } else {
          var index = match.z6();
          var length = match.a7();
          $this.bc_1 = until($this.zb_1, index);
          $this.zb_1 = index + length | 0;
          $this.ac_1 = $this.zb_1 + (length === 0 ? 1 : 0) | 0;
        }
      }
      $this.yb_1 = 1;
    }
  }
  function DelimitedRangesSequence$iterator$1(this$0) {
    this.dc_1 = this$0;
    this.yb_1 = -1;
    this.zb_1 = coerceIn(this$0.fc_1, 0, charSequenceLength(this$0.ec_1));
    this.ac_1 = this.zb_1;
    this.bc_1 = null;
    this.cc_1 = 0;
  }
  protoOf(DelimitedRangesSequence$iterator$1).h = function () {
    if (this.yb_1 === -1) {
      calcNext_0(this);
    }
    if (this.yb_1 === 0)
      throw NoSuchElementException_init_$Create$();
    var tmp = this.bc_1;
    var result = tmp instanceof IntRange ? tmp : THROW_CCE();
    this.bc_1 = null;
    this.yb_1 = -1;
    return result;
  };
  protoOf(DelimitedRangesSequence$iterator$1).g = function () {
    if (this.yb_1 === -1) {
      calcNext_0(this);
    }
    return this.yb_1 === 1;
  };
  function DelimitedRangesSequence(input, startIndex, limit, getNextMatch) {
    this.ec_1 = input;
    this.fc_1 = startIndex;
    this.gc_1 = limit;
    this.hc_1 = getNextMatch;
  }
  protoOf(DelimitedRangesSequence).f = function () {
    return new DelimitedRangesSequence$iterator$1(this);
  };
  function findAnyOf(_this__u8e3s4, strings, startIndex, ignoreCase, last) {
    if (!ignoreCase && strings.i() === 1) {
      var string = single_0(strings);
      var index = !last ? indexOf_0(_this__u8e3s4, string, startIndex) : lastIndexOf(_this__u8e3s4, string, startIndex);
      return index < 0 ? null : to(index, string);
    }
    var indices = !last ? numberRangeToNumber(coerceAtLeast(startIndex, 0), charSequenceLength(_this__u8e3s4)) : downTo(coerceAtMost(startIndex, get_lastIndex_0(_this__u8e3s4)), 0);
    if (typeof _this__u8e3s4 === 'string') {
      var inductionVariable = indices.qb_1;
      var last_0 = indices.rb_1;
      var step = indices.sb_1;
      if (step > 0 && inductionVariable <= last_0 || (step < 0 && last_0 <= inductionVariable))
        do {
          var index_0 = inductionVariable;
          inductionVariable = inductionVariable + step | 0;
          var tmp$ret$1;
          $l$block: {
            // Inline function 'kotlin.collections.firstOrNull' call
            var _iterator__ex2g4s = strings.f();
            while (_iterator__ex2g4s.g()) {
              var element = _iterator__ex2g4s.h();
              if (regionMatches(element, 0, _this__u8e3s4, index_0, element.length, ignoreCase)) {
                tmp$ret$1 = element;
                break $l$block;
              }
            }
            tmp$ret$1 = null;
          }
          var matchingString = tmp$ret$1;
          if (!(matchingString == null))
            return to(index_0, matchingString);
        }
         while (!(index_0 === last_0));
    } else {
      var inductionVariable_0 = indices.qb_1;
      var last_1 = indices.rb_1;
      var step_0 = indices.sb_1;
      if (step_0 > 0 && inductionVariable_0 <= last_1 || (step_0 < 0 && last_1 <= inductionVariable_0))
        do {
          var index_1 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + step_0 | 0;
          var tmp$ret$3;
          $l$block_0: {
            // Inline function 'kotlin.collections.firstOrNull' call
            var _iterator__ex2g4s_0 = strings.f();
            while (_iterator__ex2g4s_0.g()) {
              var element_0 = _iterator__ex2g4s_0.h();
              if (regionMatchesImpl(element_0, 0, _this__u8e3s4, index_1, element_0.length, ignoreCase)) {
                tmp$ret$3 = element_0;
                break $l$block_0;
              }
            }
            tmp$ret$3 = null;
          }
          var matchingString_0 = tmp$ret$3;
          if (!(matchingString_0 == null))
            return to(index_1, matchingString_0);
        }
         while (!(index_1 === last_1));
    }
    return null;
  }
  function lastIndexOf(_this__u8e3s4, string, startIndex, ignoreCase) {
    startIndex = startIndex === VOID ? get_lastIndex_0(_this__u8e3s4) : startIndex;
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    var tmp;
    var tmp_0;
    if (ignoreCase) {
      tmp_0 = true;
    } else {
      tmp_0 = !(typeof _this__u8e3s4 === 'string');
    }
    if (tmp_0) {
      tmp = indexOf_2(_this__u8e3s4, string, startIndex, 0, ignoreCase, true);
    } else {
      // Inline function 'kotlin.text.nativeLastIndexOf' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = _this__u8e3s4.lastIndexOf(string, startIndex);
    }
    return tmp;
  }
  function isBlank(_this__u8e3s4) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.text.all' call
      var inductionVariable = 0;
      while (inductionVariable < charSequenceLength(_this__u8e3s4)) {
        var element = charSequenceGet(_this__u8e3s4, inductionVariable);
        inductionVariable = inductionVariable + 1 | 0;
        if (!isWhitespace(element)) {
          tmp$ret$1 = false;
          break $l$block;
        }
      }
      tmp$ret$1 = true;
    }
    return tmp$ret$1;
  }
  function lineSequence(_this__u8e3s4) {
    // Inline function 'kotlin.sequences.Sequence' call
    return new lineSequence$$inlined$Sequence$1(_this__u8e3s4);
  }
  function State() {
    this.ic_1 = 0;
    this.jc_1 = 1;
    this.kc_1 = 2;
  }
  var State_instance;
  function State_getInstance() {
    return State_instance;
  }
  function LinesIterator(string) {
    this.lc_1 = string;
    this.mc_1 = 0;
    this.nc_1 = 0;
    this.oc_1 = 0;
    this.pc_1 = 0;
  }
  protoOf(LinesIterator).g = function () {
    if (!(this.mc_1 === 0)) {
      return this.mc_1 === 1;
    }
    if (this.pc_1 < 0) {
      this.mc_1 = 2;
      return false;
    }
    var _delimiterLength = -1;
    var _delimiterStartIndex = charSequenceLength(this.lc_1);
    var inductionVariable = this.nc_1;
    var last = charSequenceLength(this.lc_1);
    if (inductionVariable < last)
      $l$loop: do {
        var idx = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var c = charSequenceGet(this.lc_1, idx);
        if (c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13)) {
          _delimiterLength = c === _Char___init__impl__6a9atx(13) && (idx + 1 | 0) < charSequenceLength(this.lc_1) && charSequenceGet(this.lc_1, idx + 1 | 0) === _Char___init__impl__6a9atx(10) ? 2 : 1;
          _delimiterStartIndex = idx;
          break $l$loop;
        }
      }
       while (inductionVariable < last);
    this.mc_1 = 1;
    this.pc_1 = _delimiterLength;
    this.oc_1 = _delimiterStartIndex;
    return true;
  };
  protoOf(LinesIterator).h = function () {
    if (!this.g()) {
      throw NoSuchElementException_init_$Create$();
    }
    this.mc_1 = 0;
    var lastIndex = this.oc_1;
    var firstIndex = this.nc_1;
    this.nc_1 = this.oc_1 + this.pc_1 | 0;
    // Inline function 'kotlin.text.substring' call
    var this_0 = this.lc_1;
    return toString_1(charSequenceSubSequence(this_0, firstIndex, lastIndex));
  };
  function trim(_this__u8e3s4) {
    // Inline function 'kotlin.text.trim' call
    var startIndex = 0;
    var endIndex = charSequenceLength(_this__u8e3s4) - 1 | 0;
    var startFound = false;
    $l$loop: while (startIndex <= endIndex) {
      var index = !startFound ? startIndex : endIndex;
      var p0 = charSequenceGet(_this__u8e3s4, index);
      var match = isWhitespace(p0);
      if (!startFound) {
        if (!match)
          startFound = true;
        else
          startIndex = startIndex + 1 | 0;
      } else {
        if (!match)
          break $l$loop;
        else
          endIndex = endIndex - 1 | 0;
      }
    }
    return charSequenceSubSequence(_this__u8e3s4, startIndex, endIndex + 1 | 0);
  }
  function lines(_this__u8e3s4) {
    return toList(lineSequence(_this__u8e3s4));
  }
  function rangesDelimitedBy$lambda($delimitersList, $ignoreCase) {
    return function ($this$DelimitedRangesSequence, currentIndex) {
      var tmp0_safe_receiver = findAnyOf($this$DelimitedRangesSequence, $delimitersList, currentIndex, $ignoreCase, false);
      var tmp;
      if (tmp0_safe_receiver == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.let' call
        tmp = to(tmp0_safe_receiver.x6_1, tmp0_safe_receiver.y6_1.length);
      }
      return tmp;
    };
  }
  function lineSequence$$inlined$Sequence$1($this_lineSequence) {
    this.qc_1 = $this_lineSequence;
  }
  protoOf(lineSequence$$inlined$Sequence$1).f = function () {
    return new LinesIterator(this.qc_1);
  };
  function Destructured(match) {
    this.rc_1 = match;
  }
  function MatchResult() {
  }
  function UnsafeLazyImpl(initializer) {
    this.sc_1 = initializer;
    this.tc_1 = UNINITIALIZED_VALUE_instance;
  }
  protoOf(UnsafeLazyImpl).a1 = function () {
    if (this.tc_1 === UNINITIALIZED_VALUE_instance) {
      this.tc_1 = ensureNotNull(this.sc_1)();
      this.sc_1 = null;
    }
    var tmp = this.tc_1;
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(UnsafeLazyImpl).uc = function () {
    return !(this.tc_1 === UNINITIALIZED_VALUE_instance);
  };
  protoOf(UnsafeLazyImpl).toString = function () {
    return this.uc() ? toString_0(this.a1()) : 'Lazy value not initialized yet.';
  };
  function UNINITIALIZED_VALUE() {
  }
  var UNINITIALIZED_VALUE_instance;
  function UNINITIALIZED_VALUE_getInstance() {
    return UNINITIALIZED_VALUE_instance;
  }
  function Pair(first, second) {
    this.x6_1 = first;
    this.y6_1 = second;
  }
  protoOf(Pair).toString = function () {
    return '(' + toString_0(this.x6_1) + ', ' + toString_0(this.y6_1) + ')';
  };
  protoOf(Pair).z6 = function () {
    return this.x6_1;
  };
  protoOf(Pair).a7 = function () {
    return this.y6_1;
  };
  protoOf(Pair).hashCode = function () {
    var result = this.x6_1 == null ? 0 : hashCode(this.x6_1);
    result = imul(result, 31) + (this.y6_1 == null ? 0 : hashCode(this.y6_1)) | 0;
    return result;
  };
  protoOf(Pair).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Pair))
      return false;
    var tmp0_other_with_cast = other instanceof Pair ? other : THROW_CCE();
    if (!equals(this.x6_1, tmp0_other_with_cast.x6_1))
      return false;
    if (!equals(this.y6_1, tmp0_other_with_cast.y6_1))
      return false;
    return true;
  };
  function to(_this__u8e3s4, that) {
    return new Pair(_this__u8e3s4, that);
  }
  function _UShort___init__impl__jigrne(data) {
    return data;
  }
  function _UShort___get_data__impl__g0245($this) {
    return $this;
  }
  //region block: post-declaration
  protoOf(AbstractMap).asJsReadonlyMapView = asJsReadonlyMapView;
  protoOf(InternalHashMap).t4 = containsAllEntries;
  protoOf(findNext$1).u9 = get_destructured;
  protoOf(EmptyMap).asJsReadonlyMapView = asJsReadonlyMapView;
  //endregion
  //region block: init
  Companion_instance = new Companion();
  Companion_instance_0 = new Companion_0();
  Unit_instance = new Unit();
  Companion_instance_3 = new Companion_3();
  Companion_instance_5 = new Companion_5();
  Companion_instance_6 = new Companion_6();
  Companion_instance_7 = new Companion_7();
  EmptyIterator_instance = new EmptyIterator();
  EmptySequence_instance = new EmptySequence();
  Companion_instance_10 = new Companion_10();
  State_instance = new State();
  UNINITIALIZED_VALUE_instance = new UNINITIALIZED_VALUE();
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $kotlin = _.kotlin || (_.kotlin = {});
    var $kotlin$collections = $kotlin.collections || ($kotlin.collections = {});
    defineProp($kotlin$collections, 'KtMap', Companion_getInstance);
  }
  $jsExportAll$(_);
  _.$jsExportAll$ = $jsExportAll$;
  _.$_$ = _.$_$ || {};
  _.$_$.a = getKClassFromExpression;
  _.$_$.b = VOID;
  _.$_$.c = ArrayList_init_$Create$_0;
  _.$_$.d = ArrayList_init_$Create$;
  _.$_$.e = HashMap_init_$Create$;
  _.$_$.f = LinkedHashMap_init_$Create$;
  _.$_$.g = LinkedHashMap_init_$Create$_1;
  _.$_$.h = LinkedHashSet_init_$Create$;
  _.$_$.i = Regex_init_$Create$;
  _.$_$.j = StringBuilder_init_$Create$_0;
  _.$_$.k = Error_init_$Create$_0;
  _.$_$.l = Exception_init_$Init$_0;
  _.$_$.m = IllegalArgumentException_init_$Create$_0;
  _.$_$.n = IllegalStateException_init_$Create$;
  _.$_$.o = IllegalStateException_init_$Create$_0;
  _.$_$.p = NoSuchElementException_init_$Create$;
  _.$_$.q = _Char___init__impl__6a9atx;
  _.$_$.r = Char__toInt_impl_vasixd;
  _.$_$.s = toString;
  _.$_$.t = Default_getInstance;
  _.$_$.u = Unit_instance;
  _.$_$.v = Collection;
  _.$_$.w = Iterable;
  _.$_$.x = KtList;
  _.$_$.y = Entry;
  _.$_$.z = asJsReadonlyMapView;
  _.$_$.a1 = KtMap;
  _.$_$.b1 = KtSet;
  _.$_$.c1 = average;
  _.$_$.d1 = collectionSizeOrDefault;
  _.$_$.e1 = contains;
  _.$_$.f1 = emptyMap;
  _.$_$.g1 = first;
  _.$_$.h1 = joinToString_0;
  _.$_$.i1 = listOf;
  _.$_$.j1 = listOf_0;
  _.$_$.k1 = mapOf;
  _.$_$.l1 = mapOf_0;
  _.$_$.m1 = setOf_0;
  _.$_$.n1 = toHashSet;
  _.$_$.o1 = toHashSet_0;
  _.$_$.p1 = toMutableList;
  _.$_$.q1 = captureStack;
  _.$_$.r1 = charSequenceGet;
  _.$_$.s1 = charSequenceLength;
  _.$_$.t1 = compareTo;
  _.$_$.u1 = equals;
  _.$_$.v1 = getBooleanHashCode;
  _.$_$.w1 = getPropertyCallableRef;
  _.$_$.x1 = getStringHashCode;
  _.$_$.y1 = hashCode;
  _.$_$.z1 = initMetadataForClass;
  _.$_$.a2 = initMetadataForCompanion;
  _.$_$.b2 = initMetadataForInterface;
  _.$_$.c2 = initMetadataForObject;
  _.$_$.d2 = isArray;
  _.$_$.e2 = isCharSequence;
  _.$_$.f2 = isInterface;
  _.$_$.g2 = isNumber;
  _.$_$.h2 = iterator;
  _.$_$.i2 = json;
  _.$_$.j2 = numberToChar;
  _.$_$.k2 = numberToDouble;
  _.$_$.l2 = numberToInt;
  _.$_$.m2 = numberToLong;
  _.$_$.n2 = objectCreate;
  _.$_$.o2 = protoOf;
  _.$_$.p2 = toString_1;
  _.$_$.q2 = abs;
  _.$_$.r2 = round;
  _.$_$.s2 = KProperty1;
  _.$_$.t2 = contains_0;
  _.$_$.u2 = endsWith;
  _.$_$.v2 = indexOf_0;
  _.$_$.w2 = indexOf_1;
  _.$_$.x2 = padStart;
  _.$_$.y2 = removeSuffix;
  _.$_$.z2 = replace;
  _.$_$.a3 = split;
  _.$_$.b3 = startsWith;
  _.$_$.c3 = toDouble;
  _.$_$.d3 = toIntOrNull;
  _.$_$.e3 = toInt;
  _.$_$.f3 = toInt_0;
  _.$_$.g3 = toLongOrNull;
  _.$_$.h3 = toLong_0;
  _.$_$.i3 = toLong_1;
  _.$_$.j3 = toString_2;
  _.$_$.k3 = trimIndent;
  _.$_$.l3 = trim;
  _.$_$.m3 = uppercaseChar;
  _.$_$.n3 = Enum;
  _.$_$.o3 = Exception;
  _.$_$.p3 = Long;
  _.$_$.q3 = NumberFormatException;
  _.$_$.r3 = Pair;
  _.$_$.s3 = THROW_CCE;
  _.$_$.t3 = THROW_IAE;
  _.$_$.u3 = ensureNotNull;
  _.$_$.v3 = isNaN_1;
  _.$_$.w3 = lazy;
  _.$_$.x3 = noWhenBranchMatchedException;
  _.$_$.y3 = printStackTrace;
  _.$_$.z3 = throwUninitializedPropertyAccessException;
  _.$_$.a4 = toString_0;
  _.$_$.b4 = to;
  //endregion
  return _;
}));



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./kotlin/KuiklyUISecond-desktop-render-layer.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=desktopRenderLayer.js.map