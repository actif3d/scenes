var THREE = { REVISION: "71" };

"object" === typeof module && (module.exports = THREE);
void 0 === Math.sign &&
(Math.sign = function (a) {
    return 0 > a ? -1 : 0 < a ? 1 : +a;
});
THREE.log = function () {
    console.log.apply(console, arguments);
};
THREE.warn = function () {
    console.warn.apply(console, arguments);
};
THREE.error = function () {
    console.error.apply(console, arguments);
};
THREE.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };
THREE.CullFaceNone = 0;
THREE.CullFaceBack = 1;
THREE.CullFaceFront = 2;
THREE.CullFaceFrontBack = 3;
THREE.FrontFaceDirectionCW = 0;
THREE.FrontFaceDirectionCCW = 1;
THREE.BasicShadowMap = 0;
THREE.PCFShadowMap = 1;
THREE.PCFSoftShadowMap = 2;
THREE.FrontSide = 0;
THREE.BackSide = 1;
THREE.DoubleSide = 2;
THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;
THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;
THREE.NoBlending = 0;
THREE.NormalBlending = 1;
THREE.AdditiveBlending = 2;
THREE.SubtractiveBlending = 3;
THREE.MultiplyBlending = 4;
THREE.CustomBlending = 5;
THREE.AddEquation = 100;
THREE.SubtractEquation = 101;
THREE.ReverseSubtractEquation = 102;
THREE.MinEquation = 103;
THREE.MaxEquation = 104;
THREE.ZeroFactor = 200;
THREE.OneFactor = 201;
THREE.SrcColorFactor = 202;
THREE.OneMinusSrcColorFactor = 203;
THREE.SrcAlphaFactor = 204;
THREE.OneMinusSrcAlphaFactor = 205;
THREE.DstAlphaFactor = 206;
THREE.OneMinusDstAlphaFactor = 207;
THREE.DstColorFactor = 208;
THREE.OneMinusDstColorFactor = 209;
THREE.SrcAlphaSaturateFactor = 210;
THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;
THREE.AddOperation = 2;
THREE.UVMapping = 300;
THREE.CubeReflectionMapping = 301;
THREE.CubeRefractionMapping = 302;
THREE.EquirectangularReflectionMapping = 303;
THREE.EquirectangularRefractionMapping = 304;
THREE.SphericalReflectionMapping = 305;
THREE.Color = function (a) {
    return 3 === arguments.length ? this.setRGB(arguments[0], arguments[1], arguments[2]) : this.set(a);
};
THREE.Color.prototype = {
    constructor: THREE.Color,
    r: 1,
    g: 1,
    b: 1,
    set: function (a) {
        a instanceof THREE.Color ? this.copy(a) : "number" === typeof a ? this.setHex(a) : "string" === typeof a && this.setStyle(a);
        return this;
    },
    setHex: function (a) {
        a = Math.floor(a);
        this.r = ((a >> 16) & 255) / 255;
        this.g = ((a >> 8) & 255) / 255;
        this.b = (a & 255) / 255;
        return this;
    },
    setRGB: function (a, b, c) {
        this.r = a;
        this.g = b;
        this.b = c;
        return this;
    },
    setHSL: function (a, b, c) {
        if (0 === b) this.r = this.g = this.b = c;
        else {
            var d = function (a, b, c) {
                0 > c && (c += 1);
                1 < c && --c;
                return c < 1 / 6 ? a + 6 * (b - a) * c : 0.5 > c ? b : c < 2 / 3 ? a + 6 * (b - a) * (2 / 3 - c) : a;
            };
            b = 0.5 >= c ? c * (1 + b) : c + b - c * b;
            c = 2 * c - b;
            this.r = d(c, b, a + 1 / 3);
            this.g = d(c, b, a);
            this.b = d(c, b, a - 1 / 3);
        }
        return this;
    },
    setStyle: function (a) {
        if (/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(a))
            return (a = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(a)), (this.r = Math.min(255, parseInt(a[1], 10)) / 255), (this.g = Math.min(255, parseInt(a[2], 10)) / 255), (this.b = Math.min(255, parseInt(a[3], 10)) / 255), this;
        if (/^rgb\((\d+)%, ?(\d+)%, ?(\d+)%\)$/i.test(a))
            return (a = /^rgb\((\d+)%, ?(\d+)%, ?(\d+)%\)$/i.exec(a)), (this.r = Math.min(100, parseInt(a[1], 10)) / 100), (this.g = Math.min(100, parseInt(a[2], 10)) / 100), (this.b = Math.min(100, parseInt(a[3], 10)) / 100), this;
        if (/^#([0-9a-f]{6})$/i.test(a)) return (a = /^#([0-9a-f]{6})$/i.exec(a)), this.setHex(parseInt(a[1], 16)), this;
        if (/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(a)) return (a = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(a)), this.setHex(parseInt(a[1] + a[1] + a[2] + a[2] + a[3] + a[3], 16)), this;
        if (/^(\w+)$/i.test(a)) return this.setHex(THREE.ColorKeywords[a]), this;
    },
    copy: function (a) {
        this.r = a.r;
        this.g = a.g;
        this.b = a.b;
        return this;
    },
    copyGammaToLinear: function (a, b) {
        void 0 === b && (b = 2);
        this.r = Math.pow(a.r, b);
        this.g = Math.pow(a.g, b);
        this.b = Math.pow(a.b, b);
        return this;
    },
    copyLinearToGamma: function (a, b) {
        void 0 === b && (b = 2);
        b = 0 < b ? 1 / b : 1;
        this.r = Math.pow(a.r, b);
        this.g = Math.pow(a.g, b);
        this.b = Math.pow(a.b, b);
        return this;
    },
    convertGammaToLinear: function () {
        var a = this.r,
            b = this.g,
            c = this.b;
        this.r = a * a;
        this.g = b * b;
        this.b = c * c;
        return this;
    },
    convertLinearToGamma: function () {
        this.r = Math.sqrt(this.r);
        this.g = Math.sqrt(this.g);
        this.b = Math.sqrt(this.b);
        return this;
    },
    getHex: function () {
        return ((255 * this.r) << 16) ^ ((255 * this.g) << 8) ^ ((255 * this.b) << 0);
    },
    getHexString: function () {
        return ("000000" + this.getHex().toString(16)).slice(-6);
    },
    getHSL: function (a) {
        a = a || { h: 0, s: 0, l: 0 };
        var b = this.r,
            c = this.g,
            d = this.b,
            e = Math.max(b, c, d),
            f = Math.min(b, c, d),
            g,
            h = (f + e) / 2;
        if (f === e) f = g = 0;
        else {
            var l = e - f;
            f = 0.5 >= h ? l / (e + f) : l / (2 - e - f);
            switch (e) {
                case b:
                    g = (c - d) / l + (c < d ? 6 : 0);
                    break;
                case c:
                    g = (d - b) / l + 2;
                    break;
                case d:
                    g = (b - c) / l + 4;
            }
            g /= 6;
        }
        a.h = g;
        a.s = f;
        a.l = h;
        return a;
    },
    getStyle: function () {
        return "rgb(" + ((255 * this.r) | 0) + "," + ((255 * this.g) | 0) + "," + ((255 * this.b) | 0) + ")";
    },
    offsetHSL: function (a, b, c) {
        var d = this.getHSL();
        d.h += a;
        d.s += b;
        d.l += c;
        this.setHSL(d.h, d.s, d.l);
        return this;
    },
    add: function (a) {
        this.r += a.r;
        this.g += a.g;
        this.b += a.b;
        return this;
    },
    addColors: function (a, b) {
        this.r = a.r + b.r;
        this.g = a.g + b.g;
        this.b = a.b + b.b;
        return this;
    },
    addScalar: function (a) {
        this.r += a;
        this.g += a;
        this.b += a;
        return this;
    },
    multiply: function (a) {
        this.r *= a.r;
        this.g *= a.g;
        this.b *= a.b;
        return this;
    },
    multiplyScalar: function (a) {
        this.r *= a;
        this.g *= a;
        this.b *= a;
        return this;
    },
    lerp: function (a, b) {
        this.r += (a.r - this.r) * b;
        this.g += (a.g - this.g) * b;
        this.b += (a.b - this.b) * b;
        return this;
    },
    equals: function (a) {
        return a.r === this.r && a.g === this.g && a.b === this.b;
    },
    fromArray: function (a) {
        this.r = a[0];
        this.g = a[1];
        this.b = a[2];
        return this;
    },
    toArray: function (a, b) {
        void 0 === a && (a = []);
        void 0 === b && (b = 0);
        a[b] = this.r;
        a[b + 1] = this.g;
        a[b + 2] = this.b;
        return a;
    },
    clone: function () {
        return new THREE.Color().setRGB(this.r, this.g, this.b);
    },
};
THREE.ColorKeywords = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
};
THREE.Quaternion = function (a, b, c, d) {
    this._x = a || 0;
    this._y = b || 0;
    this._z = c || 0;
    this._w = void 0 !== d ? d : 1;
};
THREE.Quaternion.prototype = {
    constructor: THREE.Quaternion,
    _x: 0,
    _y: 0,
    _z: 0,
    _w: 0,
    get x() {
        return this._x;
    },
    set x(a) {
        this._x = a;
        this.onChangeCallback();
    },
    get y() {
        return this._y;
    },
    set y(a) {
        this._y = a;
        this.onChangeCallback();
    },
    get z() {
        return this._z;
    },
    set z(a) {
        this._z = a;
        this.onChangeCallback();
    },
    get w() {
        return this._w;
    },
    set w(a) {
        this._w = a;
        this.onChangeCallback();
    },
    set: function (a, b, c, d) {
        this._x = a;
        this._y = b;
        this._z = c;
        this._w = d;
        this.onChangeCallback();
        return this;
    },
    copy: function (a) {
        this._x = a.x;
        this._y = a.y;
        this._z = a.z;
        this._w = a.w;
        this.onChangeCallback();
        return this;
    },
    setFromEuler: function (a, b) {
        if (!1 === a instanceof THREE.Euler) throw Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
        var c = Math.cos(a._x / 2),
            d = Math.cos(a._y / 2),
            e = Math.cos(a._z / 2),
            f = Math.sin(a._x / 2),
            g = Math.sin(a._y / 2),
            h = Math.sin(a._z / 2);
        "XYZ" === a.order
            ? ((this._x = f * d * e + c * g * h), (this._y = c * g * e - f * d * h), (this._z = c * d * h + f * g * e), (this._w = c * d * e - f * g * h))
            : "YXZ" === a.order
                ? ((this._x = f * d * e + c * g * h), (this._y = c * g * e - f * d * h), (this._z = c * d * h - f * g * e), (this._w = c * d * e + f * g * h))
                : "ZXY" === a.order
                    ? ((this._x = f * d * e - c * g * h), (this._y = c * g * e + f * d * h), (this._z = c * d * h + f * g * e), (this._w = c * d * e - f * g * h))
                    : "ZYX" === a.order
                        ? ((this._x = f * d * e - c * g * h), (this._y = c * g * e + f * d * h), (this._z = c * d * h - f * g * e), (this._w = c * d * e + f * g * h))
                        : "YZX" === a.order
                            ? ((this._x = f * d * e + c * g * h), (this._y = c * g * e + f * d * h), (this._z = c * d * h - f * g * e), (this._w = c * d * e - f * g * h))
                            : "XZY" === a.order && ((this._x = f * d * e - c * g * h), (this._y = c * g * e - f * d * h), (this._z = c * d * h + f * g * e), (this._w = c * d * e + f * g * h));
        if (!1 !== b) this.onChangeCallback();
        return this;
    },
    setFromAxisAngle: function (a, b) {
        b /= 2;
        var c = Math.sin(b);
        this._x = a.x * c;
        this._y = a.y * c;
        this._z = a.z * c;
        this._w = Math.cos(b);
        this.onChangeCallback();
        return this;
    },
    setFromRotationMatrix: function (a) {
        var b = a.elements,
            c = b[0];
        a = b[4];
        var d = b[8],
            e = b[1],
            f = b[5],
            g = b[9],
            h = b[2],
            l = b[6];
        b = b[10];
        var m = c + f + b;
        0 < m
            ? ((c = 0.5 / Math.sqrt(m + 1)), (this._w = 0.25 / c), (this._x = (l - g) * c), (this._y = (d - h) * c), (this._z = (e - a) * c))
            : c > f && c > b
                ? ((c = 2 * Math.sqrt(1 + c - f - b)), (this._w = (l - g) / c), (this._x = 0.25 * c), (this._y = (a + e) / c), (this._z = (d + h) / c))
                : f > b
                    ? ((c = 2 * Math.sqrt(1 + f - c - b)), (this._w = (d - h) / c), (this._x = (a + e) / c), (this._y = 0.25 * c), (this._z = (g + l) / c))
                    : ((c = 2 * Math.sqrt(1 + b - c - f)), (this._w = (e - a) / c), (this._x = (d + h) / c), (this._y = (g + l) / c), (this._z = 0.25 * c));
        this.onChangeCallback();
        return this;
    },
    setFromUnitVectors: (function () {
        var a, b;
        return function (c, d) {
            void 0 === a && (a = new THREE.Vector3());
            b = c.dot(d) + 1;
            1e-6 > b ? ((b = 0), Math.abs(c.x) > Math.abs(c.z) ? a.set(-c.y, c.x, 0) : a.set(0, -c.z, c.y)) : a.crossVectors(c, d);
            this._x = a.x;
            this._y = a.y;
            this._z = a.z;
            this._w = b;
            this.normalize();
            return this;
        };
    })(),
    inverse: function () {
        this.conjugate().normalize();
        return this;
    },
    conjugate: function () {
        this._x *= -1;
        this._y *= -1;
        this._z *= -1;
        this.onChangeCallback();
        return this;
    },
    dot: function (a) {
        return this._x * a._x + this._y * a._y + this._z * a._z + this._w * a._w;
    },
    lengthSq: function () {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    },
    length: function () {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    },
    normalize: function () {
        var a = this.length();
        0 === a ? ((this._z = this._y = this._x = 0), (this._w = 1)) : ((a = 1 / a), (this._x *= a), (this._y *= a), (this._z *= a), (this._w *= a));
        this.onChangeCallback();
        return this;
    },
    multiply: function (a, b) {
        return void 0 !== b ? (THREE.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."), this.multiplyQuaternions(a, b)) : this.multiplyQuaternions(this, a);
    },
    multiplyQuaternions: function (a, b) {
        var c = a._x,
            d = a._y,
            e = a._z;
        a = a._w;
        var f = b._x,
            g = b._y,
            h = b._z;
        b = b._w;
        this._x = c * b + a * f + d * h - e * g;
        this._y = d * b + a * g + e * f - c * h;
        this._z = e * b + a * h + c * g - d * f;
        this._w = a * b - c * f - d * g - e * h;
        this.onChangeCallback();
        return this;
    },
    multiplyVector3: function (a) {
        THREE.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.");
        return a.applyQuaternion(this);
    },
    slerp: function (a, b) {
        if (0 === b) return this;
        if (1 === b) return this.copy(a);
        var c = this._x,
            d = this._y,
            e = this._z,
            f = this._w,
            g = f * a._w + c * a._x + d * a._y + e * a._z;
        0 > g ? ((this._w = -a._w), (this._x = -a._x), (this._y = -a._y), (this._z = -a._z), (g = -g)) : this.copy(a);
        if (1 <= g) return (this._w = f), (this._x = c), (this._y = d), (this._z = e), this;
        a = Math.acos(g);
        var h = Math.sqrt(1 - g * g);
        if (0.001 > Math.abs(h)) return (this._w = 0.5 * (f + this._w)), (this._x = 0.5 * (c + this._x)), (this._y = 0.5 * (d + this._y)), (this._z = 0.5 * (e + this._z)), this;
        g = Math.sin((1 - b) * a) / h;
        b = Math.sin(b * a) / h;
        this._w = f * g + this._w * b;
        this._x = c * g + this._x * b;
        this._y = d * g + this._y * b;
        this._z = e * g + this._z * b;
        this.onChangeCallback();
        return this;
    },
    equals: function (a) {
        return a._x === this._x && a._y === this._y && a._z === this._z && a._w === this._w;
    },
    fromArray: function (a, b) {
        void 0 === b && (b = 0);
        this._x = a[b];
        this._y = a[b + 1];
        this._z = a[b + 2];
        this._w = a[b + 3];
        this.onChangeCallback();
        return this;
    },
    toArray: function (a, b) {
        void 0 === a && (a = []);
        void 0 === b && (b = 0);
        a[b] = this._x;
        a[b + 1] = this._y;
        a[b + 2] = this._z;
        a[b + 3] = this._w;
        return a;
    },
    onChange: function (a) {
        this.onChangeCallback = a;
        return this;
    },
    onChangeCallback: function () {},
    clone: function () {
        return new THREE.Quaternion(this._x, this._y, this._z, this._w);
    },
};
THREE.Quaternion.slerp = function (a, b, c, d) {
    return c.copy(a).slerp(b, d);
};
THREE.Vector2 = function (a, b) {
    this.x = a || 0;
    this.y = b || 0;
};
THREE.Vector2.prototype = {
    constructor: THREE.Vector2,
    set: function (a, b) {
        this.x = a;
        this.y = b;
        return this;
    },
    setX: function (a) {
        this.x = a;
        return this;
    },
    setY: function (a) {
        this.y = a;
        return this;
    },
    setComponent: function (a, b) {
        switch (a) {
            case 0:
                this.x = b;
                break;
            case 1:
                this.y = b;
                break;
            default:
                throw Error("index is out of range: " + a);
        }
    },
    getComponent: function (a) {
        switch (a) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            default:
                throw Error("index is out of range: " + a);
        }
    },
    copy: function (a) {
        this.x = a.x;
        this.y = a.y;
        return this;
    },
    add: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), this.addVectors(a, b);
        this.x += a.x;
        this.y += a.y;
        return this;
    },
    addScalar: function (a) {
        this.x += a;
        this.y += a;
        return this;
    },
    addVectors: function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    },
    sub: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), this.subVectors(a, b);
        this.x -= a.x;
        this.y -= a.y;
        return this;
    },
    subScalar: function (a) {
        this.x -= a;
        this.y -= a;
        return this;
    },
    subVectors: function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    },
    multiply: function (a) {
        this.x *= a.x;
        this.y *= a.y;
        return this;
    },
    multiplyScalar: function (a) {
        this.x *= a;
        this.y *= a;
        return this;
    },
    divide: function (a) {
        this.x /= a.x;
        this.y /= a.y;
        return this;
    },
    divideScalar: function (a) {
        0 !== a ? ((a = 1 / a), (this.x *= a), (this.y *= a)) : (this.y = this.x = 0);
        return this;
    },
    min: function (a) {
        this.x > a.x && (this.x = a.x);
        this.y > a.y && (this.y = a.y);
        return this;
    },
    max: function (a) {
        this.x < a.x && (this.x = a.x);
        this.y < a.y && (this.y = a.y);
        return this;
    },
    clamp: function (a, b) {
        this.x < a.x ? (this.x = a.x) : this.x > b.x && (this.x = b.x);
        this.y < a.y ? (this.y = a.y) : this.y > b.y && (this.y = b.y);
        return this;
    },
    clampScalar: (function () {
        var a, b;
        return function (c, d) {
            void 0 === a && ((a = new THREE.Vector2()), (b = new THREE.Vector2()));
            a.set(c, c);
            b.set(d, d);
            return this.clamp(a, b);
        };
    })(),
    floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    },
    ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    },
    round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    },
    roundToZero: function () {
        this.x = 0 > this.x ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = 0 > this.y ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
    },
    negate: function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    dot: function (a) {
        return this.x * a.x + this.y * a.y;
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function () {
        return this.divideScalar(this.length());
    },
    distanceTo: function (a) {
        return Math.sqrt(this.distanceToSquared(a));
    },
    distanceToSquared: function (a) {
        var b = this.x - a.x;
        a = this.y - a.y;
        return b * b + a * a;
    },
    setLength: function (a) {
        var b = this.length();
        0 !== b && a !== b && this.multiplyScalar(a / b);
        return this;
    },
    lerp: function (a, b) {
        this.x += (a.x - this.x) * b;
        this.y += (a.y - this.y) * b;
        return this;
    },
    lerpVectors: function (a, b, c) {
        this.subVectors(b, a).multiplyScalar(c).add(a);
        return this;
    },
    equals: function (a) {
        return a.x === this.x && a.y === this.y;
    },
    fromArray: function (a, b) {
        void 0 === b && (b = 0);
        this.x = a[b];
        this.y = a[b + 1];
        return this;
    },
    toArray: function (a, b) {
        void 0 === a && (a = []);
        void 0 === b && (b = 0);
        a[b] = this.x;
        a[b + 1] = this.y;
        return a;
    },
    fromAttribute: function (a, b, c) {
        void 0 === c && (c = 0);
        b = b * a.itemSize + c;
        this.x = a.array[b];
        this.y = a.array[b + 1];
        return this;
    },
    clone: function () {
        return new THREE.Vector2(this.x, this.y);
    },
};
THREE.Vector3 = function (a, b, c) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0;
};
THREE.Vector3.prototype = {
    constructor: THREE.Vector3,
    set: function (a, b, c) {
        this.x = a;
        this.y = b;
        this.z = c;
        return this;
    },
    setX: function (a) {
        this.x = a;
        return this;
    },
    setY: function (a) {
        this.y = a;
        return this;
    },
    setZ: function (a) {
        this.z = a;
        return this;
    },
    setComponent: function (a, b) {
        switch (a) {
            case 0:
                this.x = b;
                break;
            case 1:
                this.y = b;
                break;
            case 2:
                this.z = b;
                break;
            default:
                throw Error("index is out of range: " + a);
        }
    },
    getComponent: function (a) {
        switch (a) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw Error("index is out of range: " + a);
        }
    },
    copy: function (a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        return this;
    },
    add: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), this.addVectors(a, b);
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    },
    addScalar: function (a) {
        this.x += a;
        this.y += a;
        this.z += a;
        return this;
    },
    addVectors: function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    },
    sub: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), this.subVectors(a, b);
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    },
    subScalar: function (a) {
        this.x -= a;
        this.y -= a;
        this.z -= a;
        return this;
    },
    subVectors: function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    },
    multiply: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."), this.multiplyVectors(a, b);
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
        return this;
    },
    multiplyScalar: function (a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        return this;
    },
    multiplyVectors: function (a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    },
    applyEuler: (function () {
        var a;
        return function (b) {
            !1 === b instanceof THREE.Euler && THREE.error("THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.");
            void 0 === a && (a = new THREE.Quaternion());
            this.applyQuaternion(a.setFromEuler(b));
            return this;
        };
    })(),
    applyAxisAngle: (function () {
        var a;
        return function (b, c) {
            void 0 === a && (a = new THREE.Quaternion());
            this.applyQuaternion(a.setFromAxisAngle(b, c));
            return this;
        };
    })(),
    applyMatrix3: function (a) {
        var b = this.x,
            c = this.y,
            d = this.z;
        a = a.elements;
        this.x = a[0] * b + a[3] * c + a[6] * d;
        this.y = a[1] * b + a[4] * c + a[7] * d;
        this.z = a[2] * b + a[5] * c + a[8] * d;
        return this;
    },
    applyMatrix4: function (a) {
        var b = this.x,
            c = this.y,
            d = this.z;
        a = a.elements;
        this.x = a[0] * b + a[4] * c + a[8] * d + a[12];
        this.y = a[1] * b + a[5] * c + a[9] * d + a[13];
        this.z = a[2] * b + a[6] * c + a[10] * d + a[14];
        return this;
    },
    applyProjection: function (a) {
        var b = this.x,
            c = this.y,
            d = this.z;
        a = a.elements;
        var e = 1 / (a[3] * b + a[7] * c + a[11] * d + a[15]);
        this.x = (a[0] * b + a[4] * c + a[8] * d + a[12]) * e;
        this.y = (a[1] * b + a[5] * c + a[9] * d + a[13]) * e;
        this.z = (a[2] * b + a[6] * c + a[10] * d + a[14]) * e;
        return this;
    },
    applyQuaternion: function (a) {
        var b = this.x,
            c = this.y,
            d = this.z,
            e = a.x,
            f = a.y,
            g = a.z;
        a = a.w;
        var h = a * b + f * d - g * c,
            l = a * c + g * b - e * d,
            m = a * d + e * c - f * b;
        b = -e * b - f * c - g * d;
        this.x = h * a + b * -e + l * -g - m * -f;
        this.y = l * a + b * -f + m * -e - h * -g;
        this.z = m * a + b * -g + h * -f - l * -e;
        return this;
    },
    project: (function () {
        var a;
        return function (b) {
            void 0 === a && (a = new THREE.Matrix4());
            a.multiplyMatrices(b.projectionMatrix, a.getInverse(b.matrixWorld));
            return this.applyProjection(a);
        };
    })(),
    unproject: (function () {
        var a;
        return function (b) {
            void 0 === a && (a = new THREE.Matrix4());
            a.multiplyMatrices(b.matrixWorld, a.getInverse(b.projectionMatrix));
            return this.applyProjection(a);
        };
    })(),
    transformDirection: function (a) {
        var b = this.x,
            c = this.y,
            d = this.z;
        a = a.elements;
        this.x = a[0] * b + a[4] * c + a[8] * d;
        this.y = a[1] * b + a[5] * c + a[9] * d;
        this.z = a[2] * b + a[6] * c + a[10] * d;
        this.normalize();
        return this;
    },
    divide: function (a) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
        return this;
    },
    divideScalar: function (a) {
        0 !== a ? ((a = 1 / a), (this.x *= a), (this.y *= a), (this.z *= a)) : (this.z = this.y = this.x = 0);
        return this;
    },
    min: function (a) {
        this.x > a.x && (this.x = a.x);
        this.y > a.y && (this.y = a.y);
        this.z > a.z && (this.z = a.z);
        return this;
    },
    max: function (a) {
        this.x < a.x && (this.x = a.x);
        this.y < a.y && (this.y = a.y);
        this.z < a.z && (this.z = a.z);
        return this;
    },
    clamp: function (a, b) {
        this.x < a.x ? (this.x = a.x) : this.x > b.x && (this.x = b.x);
        this.y < a.y ? (this.y = a.y) : this.y > b.y && (this.y = b.y);
        this.z < a.z ? (this.z = a.z) : this.z > b.z && (this.z = b.z);
        return this;
    },
    clampScalar: (function () {
        var a, b;
        return function (c, d) {
            void 0 === a && ((a = new THREE.Vector3()), (b = new THREE.Vector3()));
            a.set(c, c, c);
            b.set(d, d, d);
            return this.clamp(a, b);
        };
    })(),
    floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    },
    ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    },
    round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    },
    roundToZero: function () {
        this.x = 0 > this.x ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = 0 > this.y ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = 0 > this.z ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    },
    negate: function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    },
    dot: function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthManhattan: function () {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    },
    normalize: function () {
        return this.divideScalar(this.length());
    },
    setLength: function (a) {
        var b = this.length();
        0 !== b && a !== b && this.multiplyScalar(a / b);
        return this;
    },
    lerp: function (a, b) {
        this.x += (a.x - this.x) * b;
        this.y += (a.y - this.y) * b;
        this.z += (a.z - this.z) * b;
        return this;
    },
    lerpVectors: function (a, b, c) {
        this.subVectors(b, a).multiplyScalar(c).add(a);
        return this;
    },
    cross: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."), this.crossVectors(a, b);
        b = this.x;
        var c = this.y,
            d = this.z;
        this.x = c * a.z - d * a.y;
        this.y = d * a.x - b * a.z;
        this.z = b * a.y - c * a.x;
        return this;
    },
    crossVectors: function (a, b) {
        var c = a.x,
            d = a.y;
        a = a.z;
        var e = b.x,
            f = b.y;
        b = b.z;
        this.x = d * b - a * f;
        this.y = a * e - c * b;
        this.z = c * f - d * e;
        return this;
    },
    projectOnVector: (function () {
        var a, b;
        return function (c) {
            void 0 === a && (a = new THREE.Vector3());
            a.copy(c).normalize();
            b = this.dot(a);
            return this.copy(a).multiplyScalar(b);
        };
    })(),
    projectOnPlane: (function () {
        var a;
        return function (b) {
            void 0 === a && (a = new THREE.Vector3());
            a.copy(this).projectOnVector(b);
            return this.sub(a);
        };
    })(),
    reflect: (function () {
        var a;
        return function (b) {
            void 0 === a && (a = new THREE.Vector3());
            return this.sub(a.copy(b).multiplyScalar(2 * this.dot(b)));
        };
    })(),
    angleTo: function (a) {
        a = this.dot(a) / (this.length() * a.length());
        return Math.acos(THREE.Math.clamp(a, -1, 1));
    },
    distanceTo: function (a) {
        return Math.sqrt(this.distanceToSquared(a));
    },
    distanceToSquared: function (a) {
        var b = this.x - a.x,
            c = this.y - a.y;
        a = this.z - a.z;
        return b * b + c * c + a * a;
    },
    setEulerFromRotationMatrix: function () {
        THREE.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.");
    },
    setEulerFromQuaternion: function () {
        THREE.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.");
    },
    getPositionFromMatrix: function (a) {
        THREE.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().");
        return this.setFromMatrixPosition(a);
    },
    getScaleFromMatrix: function (a) {
        THREE.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().");
        return this.setFromMatrixScale(a);
    },
    getColumnFromMatrix: function (a, b) {
        THREE.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().");
        return this.setFromMatrixColumn(a, b);
    },
    setFromMatrixPosition: function (a) {
        this.x = a.elements[12];
        this.y = a.elements[13];
        this.z = a.elements[14];
        return this;
    },
    setFromMatrixScale: function (a) {
        var b = this.set(a.elements[0], a.elements[1], a.elements[2]).length(),
            c = this.set(a.elements[4], a.elements[5], a.elements[6]).length();
        a = this.set(a.elements[8], a.elements[9], a.elements[10]).length();
        this.x = b;
        this.y = c;
        this.z = a;
        return this;
    },
    setFromMatrixColumn: function (a, b) {
        a *= 4;
        b = b.elements;
        this.x = b[a];
        this.y = b[a + 1];
        this.z = b[a + 2];
        return this;
    },
    equals: function (a) {
        return a.x === this.x && a.y === this.y && a.z === this.z;
    },
    fromArray: function (a, b) {
        void 0 === b && (b = 0);
        this.x = a[b];
        this.y = a[b + 1];
        this.z = a[b + 2];
        return this;
    },
    toArray: function (a, b) {
        void 0 === a && (a = []);
        void 0 === b && (b = 0);
        a[b] = this.x;
        a[b + 1] = this.y;
        a[b + 2] = this.z;
        return a;
    },
    fromAttribute: function (a, b, c) {
        void 0 === c && (c = 0);
        b = b * a.itemSize + c;
        this.x = a.array[b];
        this.y = a.array[b + 1];
        this.z = a.array[b + 2];
        return this;
    },
    clone: function () {
        return new THREE.Vector3(this.x, this.y, this.z);
    },
};
THREE.Vector4 = function (a, b, c, d) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0;
    this.w = void 0 !== d ? d : 1;
};
THREE.Vector4.prototype = {
    constructor: THREE.Vector4,
    set: function (a, b, c, d) {
        this.x = a;
        this.y = b;
        this.z = c;
        this.w = d;
        return this;
    },
    setX: function (a) {
        this.x = a;
        return this;
    },
    setY: function (a) {
        this.y = a;
        return this;
    },
    setZ: function (a) {
        this.z = a;
        return this;
    },
    setW: function (a) {
        this.w = a;
        return this;
    },
    setComponent: function (a, b) {
        switch (a) {
            case 0:
                this.x = b;
                break;
            case 1:
                this.y = b;
                break;
            case 2:
                this.z = b;
                break;
            case 3:
                this.w = b;
                break;
            default:
                throw Error("index is out of range: " + a);
        }
    },
    getComponent: function (a) {
        switch (a) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            case 3:
                return this.w;
            default:
                throw Error("index is out of range: " + a);
        }
    },
    copy: function (a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        this.w = void 0 !== a.w ? a.w : 1;
        return this;
    },
    add: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), this.addVectors(a, b);
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        this.w += a.w;
        return this;
    },
    addScalar: function (a) {
        this.x += a;
        this.y += a;
        this.z += a;
        this.w += a;
        return this;
    },
    addVectors: function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    },
    sub: function (a, b) {
        if (void 0 !== b) return THREE.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), this.subVectors(a, b);
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        this.w -= a.w;
        return this;
    },
    subScalar: function (a) {
        this.x -= a;
        this.y -= a;
        this.z -= a;
        this.w -= a;
        return this;
    },
    subVectors: function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    },
    multiplyScalar: function (a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        this.w *= a;
        return this;
    },
    applyMatrix4: function (a) {
        var b = this.x,
            c = this.y,
            d = this.z,
            e = this.w;
        a = a.elements;
        this.x = a[0] * b + a[4] * c + a[8] * d + a[12] * e;
        this.y = a[1] * b + a[5] * c + a[9] * d + a[13] * e;
        this.z = a[2] * b + a[6] * c + a[10] * d + a[14] * e;
        this.w = a[3] * b + a[7] * c + a[11] * d + a[15] * e;
        return this;
    },
    divideScalar: function (a) {
        0 !== a ? ((a = 1 / a), (this.x *= a), (this.y *= a), (this.z *= a), (this.w *= a)) : ((this.z = this.y = this.x = 0), (this.w = 1));
        return this;
    },
    setAxisAngleFromQuaternion: function (a) {
        this.w = 2 * Math.acos(a.w);
        var b = Math.sqrt(1 - a.w * a.w);
        1e-4 > b ? ((this.x = 1), (this.z = this.y = 0)) : ((this.x = a.x / b), (this.y = a.y / b), (this.z = a.z / b));
        return this;
    },
    setAxisAngleFromRotationMatrix: function (a) {
        a = a.elements;
        var b = a[0];
        var c = a[4];
        var d = a[8],
            e = a[1],
            f = a[5],
            g = a[9];
        var h = a[2];
        var l = a[6];
        var m = a[10];
        if (0.01 > Math.abs(c - e) && 0.01 > Math.abs(d - h) && 0.01 > Math.abs(g - l)) {
            if (0.1 > Math.abs(c + e) && 0.1 > Math.abs(d + h) && 0.1 > Math.abs(g + l) && 0.1 > Math.abs(b + f + m - 3)) return this.set(1, 0, 0, 0), this;
            a = Math.PI;
            b = (b + 1) / 2;
            f = (f + 1) / 2;
            m = (m + 1) / 2;
            c = (c + e) / 4;
            d = (d + h) / 4;
            g = (g + l) / 4;
            b > f && b > m
                ? 0.01 > b
                    ? ((l = 0), (c = h = 0.707106781))
                    : ((l = Math.sqrt(b)), (h = c / l), (c = d / l))
                : f > m
                    ? 0.01 > f
                        ? ((l = 0.707106781), (h = 0), (c = 0.707106781))
                        : ((h = Math.sqrt(f)), (l = c / h), (c = g / h))
                    : 0.01 > m
                        ? ((h = l = 0.707106781), (c = 0))
                        : ((c = Math.sqrt(m)), (l = d / c), (h = g / c));
            this.set(l, h, c, a);
            return this;
        }
        a = Math.sqrt((l - g) * (l - g) + (d - h) * (d - h) + (e - c) * (e - c));
        0.001 > Math.abs(a) && (a = 1);
        this.x = (l - g) / a;
        this.y = (d - h) / a;
        this.z = (e - c) / a;
        this.w = Math.acos((b + f + m - 1) / 2);
        return this;
    },
    min: function (a) {
        this.x > a.x && (this.x = a.x);
        this.y > a.y && (this.y = a.y);
        this.z > a.z && (this.z = a.z);
        this.w > a.w && (this.w = a.w);
        return this;
    },
    max: function (a) {
        this.x < a.x && (this.x = a.x);
        this.y < a.y && (this.y = a.y);
        this.z < a.z && (this.z = a.z);
        this.w < a.w && (this.w = a.w);
        return this;
    },
    clamp: function (a, b) {
        this.x < a.x ? (this.x = a.x) : this.x > b.x && (this.x = b.x);
        this.y < a.y ? (this.y = a.y) : this.y > b.y && (this.y = b.y);
        this.z < a.z ? (this.z = a.z) : this.z > b.z && (this.z = b.z);
        this.w < a.w ? (this.w = a.w) : this.w > b.w && (this.w = b.w);
        return this;
    },
    clampScalar: (function () {
        var a, b;
        return function (c, d) {
            void 0 === a && ((a = new THREE.Vector4()), (b = new THREE.Vector4()));
            a.set(c, c, c, c);
            b.set(d, d, d, d);
            return this.clamp(a, b);
        };
    })(),
    floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
    },
    ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
    },
    round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
    },
    roundToZero: function () {
        this.x = 0 > this.x ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = 0 > this.y ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = 0 > this.z ? Math.ceil(this.z) : Math.floor(this.z);
        this.w = 0 > this.w ? Math.ceil(this.w) : Math.floor(this.w);
        return this;
    },
    negate: function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    },
    dot: function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z + this.w * a.w;
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },
    lengthManhattan: function () {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    },
    normalize: function () {
        return this.divideScalar(this.length());
    },
    setLength: function (a) {
        var b = this.length();
        0 !== b && a !== b && this.multiplyScalar(a / b);
        return this;
    },
    lerp: function (a, b) {
        this.x += (a.x - this.x) * b;
        this.y += (a.y - this.y) * b;
        this.z += (a.z - this.z) * b;
        this.w += (a.w - this.w) * b;
        return this;
    },
    lerpVectors: function (a, b, c) {
        this.subVectors(b, a).multiplyScalar(c).add(a);
        return this;
    },
    equals: function (a) {
        return a.x === this.x && a.y === this.y && a.z === this.z && a.w === this.w;
    },
    fromArray: function (a, b) {
        void 0 === b && (b = 0);
        this.x = a[b];
        this.y = a[b + 1];
        this.z = a[b + 2];
        this.w = a[b + 3];
        return this;
    },
    toArray: function (a, b) {
        void 0 === a && (a = []);
        void 0 === b && (b = 0);
        a[b] = this.x;
        a[b + 1] = this.y;
        a[b + 2] = this.z;
        a[b + 3] = this.w;
        return a;
    },
    fromAttribute: function (a, b, c) {
        void 0 === c && (c = 0);
        b = b * a.itemSize + c;
        this.x = a.array[b];
        this.y = a.array[b + 1];
        this.z = a.array[b + 2];
        this.w = a.array[b + 3];
        return this;
    },
    clone: function () {
        return new THREE.Vector4(this.x, this.y, this.z, this.w);
    },
};
THREE.Euler = function (a, b, c, d) {
    this._x = a || 0;
    this._y = b || 0;
    this._z = c || 0;
    this._order = d || THREE.Euler.DefaultOrder;
};
THREE.Euler.RotationOrders = "XYZ YZX ZXY XZY YXZ ZYX".split(" ");
THREE.Euler.DefaultOrder = "XYZ";
THREE.Euler.prototype = {
    constructor: THREE.Euler,
    _x: 0,
    _y: 0,
    _z: 0,
    _order: THREE.Euler.DefaultOrder,
    get x() {
        return this._x;
    },
    set x(a) {
        this._x = a;
        this.onChangeCallback();
    },
    get y() {
        return this._y;
    },
    set y(a) {
        this._y = a;
        this.onChangeCallback();
    },
    get z() {
        return this._z;
    },
    set z(a) {
        this._z = a;
        this.onChangeCallback();
    },
    get order() {
        return this._order;
    },
    set order(a) {
        this._order = a;
        this.onChangeCallback();
    },
    set: function (a, b, c, d) {
        this._x = a;
        this._y = b;
        this._z = c;
        this._order = d || this._order;
        this.onChangeCallback();
        return this;
    },
    copy: function (a) {
        this._x = a._x;
        this._y = a._y;
        this._z = a._z;
        this._order = a._order;
        this.onChangeCallback();
        return this;
    },
    setFromRotationMatrix: function (a, b, c) {
        var d = THREE.Math.clamp,
            e = a.elements;
        a = e[0];
        var f = e[4],
            g = e[8],
            h = e[1],
            l = e[5],
            m = e[9],
            n = e[2],
            p = e[6];
        e = e[10];
        b = b || this._order;
        "XYZ" === b
            ? ((this._y = Math.asin(d(g, -1, 1))), 0.99999 > Math.abs(g) ? ((this._x = Math.atan2(-m, e)), (this._z = Math.atan2(-f, a))) : ((this._x = Math.atan2(p, l)), (this._z = 0)))
            : "YXZ" === b
                ? ((this._x = Math.asin(-d(m, -1, 1))), 0.99999 > Math.abs(m) ? ((this._y = Math.atan2(g, e)), (this._z = Math.atan2(h, l))) : ((this._y = Math.atan2(-n, a)), (this._z = 0)))
                : "ZXY" === b
                    ? ((this._x = Math.asin(d(p, -1, 1))), 0.99999 > Math.abs(p) ? ((this._y = Math.atan2(-n, e)), (this._z = Math.atan2(-f, l))) : ((this._y = 0), (this._z = Math.atan2(h, a))))
                    : "ZYX" === b
                        ? ((this._y = Math.asin(-d(n, -1, 1))), 0.99999 > Math.abs(n) ? ((this._x = Math.atan2(p, e)), (this._z = Math.atan2(h, a))) : ((this._x = 0), (this._z = Math.atan2(-f, l))))
                        : "YZX" === b
                            ? ((this._z = Math.asin(d(h, -1, 1))), 0.99999 > Math.abs(h) ? ((this._x = Math.atan2(-m, l)), (this._y = Math.atan2(-n, a))) : ((this._x = 0), (this._y = Math.atan2(g, e))))
                            : "XZY" === b
                                ? ((this._z = Math.asin(-d(f, -1, 1))), 0.99999 > Math.abs(f) ? ((this._x = Math.atan2(p, l)), (this._y = Math.atan2(g, a))) : ((this._x = Math.atan2(-m, e)), (this._y = 0)))
                                : THREE.warn("THREE.Euler: .setFromRotationMatrix() given unsupported order: " + b);
        this._order = b;
        if (!1 !== c) this.onChangeCallback();
        return this;
    },
    setFromQuaternion: (function () {
        var a;
        return function (b, c, d) {
            void 0 === a && (a = new THREE.Matrix4());
            a.makeRotationFromQuaternion(b);
            this.setFromRotationMatrix(a, c, d);
            return this;
        };
    })(),
    setFromVector3: function (a, b) {
        return this.set(a.x, a.y, a.z, b || this._order);
    },
    reorder: (function () {
        var a = new THREE.Quaternion();
        return function (b) {
            a.setFromEuler(this);
            this.setFromQuaternion(a, b);
        };
    })(),
    equals: function (a) {
        return a._x === this._x && a._y === this._y && a._z === this._z && a._order === this._order;
    },
    fromArray: function (a) {
        this._x = a[0];
        this._y = a[1];
        this._z = a[2];
        void 0 !== a[3] && (this._order = a[3]);
        this.onChangeCallback();
        return this;
    },
    toArray: function (a, b) {
        void 0 === a && (a = []);
        void 0 === b && (b = 0);
        a[b] = this._x;
        a[b + 1] = this._y;
        a[b + 2] = this._z;
        a[b + 3] = this._order;
        return a;
    },
    toVector3: function (a) {
        return a ? a.set(this._x, this._y, this._z) : new THREE.Vector3(this._x, this._y, this._z);
    },
    onChange: function (a) {
        this.onChangeCallback = a;
        return this;
    },
    onChangeCallback: function () {},
    clone: function () {
        return new THREE.Euler(this._x, this._y, this._z, this._order);
    },
};
THREE.Line3 = function (a, b) {
    this.start = void 0 !== a ? a : new THREE.Vector3();
    this.end = void 0 !== b ? b : new THREE.Vector3();
};
THREE.Line3.prototype = {
    constructor: THREE.Line3,
    set: function (a, b) {
        this.start.copy(a);
        this.end.copy(b);
        return this;
    },
    copy: function (a) {
        this.start.copy(a.start);
        this.end.copy(a.end);
        return this;
    },
    center: function (a) {
        return (a || new THREE.Vector3()).addVectors(this.start, this.end).multiplyScalar(0.5);
    },
    delta: function (a) {
        return (a || new THREE.Vector3()).subVectors(this.end, this.start);
    },
    distanceSq: function () {
        return this.start.distanceToSquared(this.end);
    },
    distance: function () {
        return this.start.distanceTo(this.end);
    },
    at: function (a, b) {
        b = b || new THREE.Vector3();
        return this.delta(b).multiplyScalar(a).add(this.start);
    },
    closestPointToPointParameter: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3();
        return function (c, d) {
            a.subVectors(c, this.start);
            b.subVectors(this.end, this.start);
            c = b.dot(b);
            c = b.dot(a) / c;
            d && (c = THREE.Math.clamp(c, 0, 1));
            return c;
        };
    })(),
    closestPointToPoint: function (a, b, c) {
        a = this.closestPointToPointParameter(a, b);
        c = c || new THREE.Vector3();
        return this.delta(c).multiplyScalar(a).add(this.start);
    },
    applyMatrix4: function (a) {
        this.start.applyMatrix4(a);
        this.end.applyMatrix4(a);
        return this;
    },
    equals: function (a) {
        return a.start.equals(this.start) && a.end.equals(this.end);
    },
    clone: function () {
        return new THREE.Line3().copy(this);
    },
};
THREE.Box2 = function (a, b) {
    this.min = void 0 !== a ? a : new THREE.Vector2(Infinity, Infinity);
    this.max = void 0 !== b ? b : new THREE.Vector2(-Infinity, -Infinity);
};
THREE.Box2.prototype = {
    constructor: THREE.Box2,
    set: function (a, b) {
        this.min.copy(a);
        this.max.copy(b);
        return this;
    },
    setFromPoints: function (a) {
        this.makeEmpty();
        for (var b = 0, c = a.length; b < c; b++) this.expandByPoint(a[b]);
        return this;
    },
    copy: function (a) {
        this.min.copy(a.min);
        this.max.copy(a.max);
        return this;
    },
    makeEmpty: function () {
        this.min.x = this.min.y = Infinity;
        this.max.x = this.max.y = -Infinity;
        return this;
    },
    empty: function () {
        return this.max.x < this.min.x || this.max.y < this.min.y;
    },
    center: function (a) {
        return (a || new THREE.Vector2()).addVectors(this.min, this.max).multiplyScalar(0.5);
    },
    size: function (a) {
        return (a || new THREE.Vector2()).subVectors(this.max, this.min);
    },
    expandByPoint: function (a) {
        this.min.min(a);
        this.max.max(a);
        return this;
    },
    expandByVector: function (a) {
        this.min.sub(a);
        this.max.add(a);
        return this;
    },
    expandByScalar: function (a) {
        this.min.addScalar(-a);
        this.max.addScalar(a);
        return this;
    },
    containsPoint: function (a) {
        return a.x < this.min.x || a.x > this.max.x || a.y < this.min.y || a.y > this.max.y ? !1 : !0;
    },
    containsBox: function (a) {
        return this.min.x <= a.min.x && a.max.x <= this.max.x && this.min.y <= a.min.y && a.max.y <= this.max.y ? !0 : !1;
    },
    getParameter: function (a, b) {
        return (b || new THREE.Vector2()).set((a.x - this.min.x) / (this.max.x - this.min.x), (a.y - this.min.y) / (this.max.y - this.min.y));
    },
    isIntersectionBox: function (a) {
        return a.max.x < this.min.x || a.min.x > this.max.x || a.max.y < this.min.y || a.min.y > this.max.y ? !1 : !0;
    },
    clampPoint: function (a, b) {
        return (b || new THREE.Vector2()).copy(a).clamp(this.min, this.max);
    },
    distanceToPoint: (function () {
        var a = new THREE.Vector2();
        return function (b) {
            return a.copy(b).clamp(this.min, this.max).sub(b).length();
        };
    })(),
    intersect: function (a) {
        this.min.max(a.min);
        this.max.min(a.max);
        return this;
    },
    union: function (a) {
        this.min.min(a.min);
        this.max.max(a.max);
        return this;
    },
    translate: function (a) {
        this.min.add(a);
        this.max.add(a);
        return this;
    },
    equals: function (a) {
        return a.min.equals(this.min) && a.max.equals(this.max);
    },
    clone: function () {
        return new THREE.Box2().copy(this);
    },
};
THREE.Box3 = function (a, b) {
    this.min = void 0 !== a ? a : new THREE.Vector3(Infinity, Infinity, Infinity);
    this.max = void 0 !== b ? b : new THREE.Vector3(-Infinity, -Infinity, -Infinity);
};
THREE.Box3.prototype = {
    constructor: THREE.Box3,
    set: function (a, b) {
        this.min.copy(a);
        this.max.copy(b);
        return this;
    },
    setFromPoints: function (a) {
        this.makeEmpty();
        for (var b = 0, c = a.length; b < c; b++) this.expandByPoint(a[b]);
        return this;
    },
    copy: function (a) {
        this.min.copy(a.min);
        this.max.copy(a.max);
        return this;
    },
    makeEmpty: function () {
        this.min.x = this.min.y = this.min.z = Infinity;
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
    },
    empty: function () {
        return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    },
    center: function (a) {
        return (a || new THREE.Vector3()).addVectors(this.min, this.max).multiplyScalar(0.5);
    },
    size: function (a) {
        return (a || new THREE.Vector3()).subVectors(this.max, this.min);
    },
    expandByPoint: function (a) {
        this.min.min(a);
        this.max.max(a);
        return this;
    },
    expandByVector: function (a) {
        this.min.sub(a);
        this.max.add(a);
        return this;
    },
    expandByScalar: function (a) {
        this.min.addScalar(-a);
        this.max.addScalar(a);
        return this;
    },
    containsPoint: function (a) {
        return a.x < this.min.x || a.x > this.max.x || a.y < this.min.y || a.y > this.max.y || a.z < this.min.z || a.z > this.max.z ? !1 : !0;
    },
    containsBox: function (a) {
        return this.min.x <= a.min.x && a.max.x <= this.max.x && this.min.y <= a.min.y && a.max.y <= this.max.y && this.min.z <= a.min.z && a.max.z <= this.max.z ? !0 : !1;
    },
    getParameter: function (a, b) {
        return (b || new THREE.Vector3()).set((a.x - this.min.x) / (this.max.x - this.min.x), (a.y - this.min.y) / (this.max.y - this.min.y), (a.z - this.min.z) / (this.max.z - this.min.z));
    },
    isIntersectionBox: function (a) {
        return a.max.x < this.min.x || a.min.x > this.max.x || a.max.y < this.min.y || a.min.y > this.max.y || a.max.z < this.min.z || a.min.z > this.max.z ? !1 : !0;
    },
    clampPoint: function (a, b) {
        return (b || new THREE.Vector3()).copy(a).clamp(this.min, this.max);
    },
    distanceToPoint: (function () {
        var a = new THREE.Vector3();
        return function (b) {
            return a.copy(b).clamp(this.min, this.max).sub(b).length();
        };
    })(),
    getBoundingSphere: (function () {
        var a = new THREE.Vector3();
        return function (b) {
            b = b || new THREE.Sphere();
            b.center = this.center();
            b.radius = 0.5 * this.size(a).length();
            return b;
        };
    })(),
    intersect: function (a) {
        this.min.max(a.min);
        this.max.min(a.max);
        return this;
    },
    union: function (a) {
        this.min.min(a.min);
        this.max.max(a.max);
        return this;
    },
    applyMatrix4: (function () {
        var a = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        return function (b) {
            a[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(b);
            a[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(b);
            a[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(b);
            a[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(b);
            a[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(b);
            a[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(b);
            a[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(b);
            a[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(b);
            this.makeEmpty();
            this.setFromPoints(a);
            return this;
        };
    })(),
    translate: function (a) {
        this.min.add(a);
        this.max.add(a);
        return this;
    },
    equals: function (a) {
        return a.min.equals(this.min) && a.max.equals(this.max);
    },
    clone: function () {
        return new THREE.Box3().copy(this);
    },
};
THREE.Matrix3 = function () {
    this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    0 < arguments.length && THREE.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.");
};
THREE.Matrix3.prototype = {
    constructor: THREE.Matrix3,
    set: function (a, b, c, d, e, f, g, h, l) {
        var m = this.elements;
        m[0] = a;
        m[3] = b;
        m[6] = c;
        m[1] = d;
        m[4] = e;
        m[7] = f;
        m[2] = g;
        m[5] = h;
        m[8] = l;
        return this;
    },
    identity: function () {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
    },
    copy: function (a) {
        a = a.elements;
        this.set(a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]);
        return this;
    },
    multiplyVector3: function (a) {
        THREE.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.");
        return a.applyMatrix3(this);
    },
    multiplyVector3Array: function (a) {
        THREE.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");
        return this.applyToVector3Array(a);
    },
    applyToVector3Array: (function () {
        var a = new THREE.Vector3();
        return function (b, c, d) {
            void 0 === c && (c = 0);
            void 0 === d && (d = b.length);
            for (var e = 0; e < d; e += 3, c += 3) (a.x = b[c]), (a.y = b[c + 1]), (a.z = b[c + 2]), a.applyMatrix3(this), (b[c] = a.x), (b[c + 1] = a.y), (b[c + 2] = a.z);
            return b;
        };
    })(),
    multiplyScalar: function (a) {
        var b = this.elements;
        b[0] *= a;
        b[3] *= a;
        b[6] *= a;
        b[1] *= a;
        b[4] *= a;
        b[7] *= a;
        b[2] *= a;
        b[5] *= a;
        b[8] *= a;
        return this;
    },
    determinant: function () {
        var a = this.elements,
            b = a[0],
            c = a[1],
            d = a[2],
            e = a[3],
            f = a[4],
            g = a[5],
            h = a[6],
            l = a[7];
        a = a[8];
        return b * f * a - b * g * l - c * e * a + c * g * h + d * e * l - d * f * h;
    },
    getInverse: function (a, b) {
        a = a.elements;
        var c = this.elements;
        c[0] = a[10] * a[5] - a[6] * a[9];
        c[1] = -a[10] * a[1] + a[2] * a[9];
        c[2] = a[6] * a[1] - a[2] * a[5];
        c[3] = -a[10] * a[4] + a[6] * a[8];
        c[4] = a[10] * a[0] - a[2] * a[8];
        c[5] = -a[6] * a[0] + a[2] * a[4];
        c[6] = a[9] * a[4] - a[5] * a[8];
        c[7] = -a[9] * a[0] + a[1] * a[8];
        c[8] = a[5] * a[0] - a[1] * a[4];
        a = a[0] * c[0] + a[1] * c[3] + a[2] * c[6];
        if (0 === a) {
            if (b) throw Error("Matrix3.getInverse(): can't invert matrix, determinant is 0");
            THREE.warn("Matrix3.getInverse(): can't invert matrix, determinant is 0");
            this.identity();
            return this;
        }
        this.multiplyScalar(1 / a);
        return this;
    },
    transpose: function () {
        var a = this.elements;
        var b = a[1];
        a[1] = a[3];
        a[3] = b;
        b = a[2];
        a[2] = a[6];
        a[6] = b;
        b = a[5];
        a[5] = a[7];
        a[7] = b;
        return this;
    },
    flattenToArrayOffset: function (a, b) {
        var c = this.elements;
        a[b] = c[0];
        a[b + 1] = c[1];
        a[b + 2] = c[2];
        a[b + 3] = c[3];
        a[b + 4] = c[4];
        a[b + 5] = c[5];
        a[b + 6] = c[6];
        a[b + 7] = c[7];
        a[b + 8] = c[8];
        return a;
    },
    getNormalMatrix: function (a) {
        this.getInverse(a).transpose();
        return this;
    },
    transposeIntoArray: function (a) {
        var b = this.elements;
        a[0] = b[0];
        a[1] = b[3];
        a[2] = b[6];
        a[3] = b[1];
        a[4] = b[4];
        a[5] = b[7];
        a[6] = b[2];
        a[7] = b[5];
        a[8] = b[8];
        return this;
    },
    fromArray: function (a) {
        this.elements.set(a);
        return this;
    },
    toArray: function () {
        var a = this.elements;
        return [a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]];
    },
    clone: function () {
        return new THREE.Matrix3().fromArray(this.elements);
    },
};
THREE.Matrix4 = function () {
    this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    0 < arguments.length && THREE.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.");
};
THREE.Matrix4.prototype = {
    constructor: THREE.Matrix4,
    set: function (a, b, c, d, e, f, g, h, l, m, n, p, r, q, u, v) {
        var w = this.elements;
        w[0] = a;
        w[4] = b;
        w[8] = c;
        w[12] = d;
        w[1] = e;
        w[5] = f;
        w[9] = g;
        w[13] = h;
        w[2] = l;
        w[6] = m;
        w[10] = n;
        w[14] = p;
        w[3] = r;
        w[7] = q;
        w[11] = u;
        w[15] = v;
        return this;
    },
    identity: function () {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    },
    copy: function (a) {
        this.elements.set(a.elements);
        return this;
    },
    extractPosition: function (a) {
        THREE.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().");
        return this.copyPosition(a);
    },
    copyPosition: function (a) {
        var b = this.elements;
        a = a.elements;
        b[12] = a[12];
        b[13] = a[13];
        b[14] = a[14];
        return this;
    },
    extractBasis: function (a, b, c) {
        var d = this.elements;
        a.set(d[0], d[1], d[2]);
        b.set(d[4], d[5], d[6]);
        c.set(d[8], d[9], d[10]);
        return this;
    },
    makeBasis: function (a, b, c) {
        this.set(a.x, b.x, c.x, 0, a.y, b.y, c.y, 0, a.z, b.z, c.z, 0, 0, 0, 0, 1);
        return this;
    },
    extractRotation: (function () {
        var a = new THREE.Vector3();
        return function (b) {
            var c = this.elements;
            b = b.elements;
            var d = 1 / a.set(b[0], b[1], b[2]).length(),
                e = 1 / a.set(b[4], b[5], b[6]).length(),
                f = 1 / a.set(b[8], b[9], b[10]).length();
            c[0] = b[0] * d;
            c[1] = b[1] * d;
            c[2] = b[2] * d;
            c[4] = b[4] * e;
            c[5] = b[5] * e;
            c[6] = b[6] * e;
            c[8] = b[8] * f;
            c[9] = b[9] * f;
            c[10] = b[10] * f;
            return this;
        };
    })(),
    makeRotationFromEuler: function (a) {
        !1 === a instanceof THREE.Euler && THREE.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
        var b = this.elements,
            c = a.x,
            d = a.y,
            e = a.z,
            f = Math.cos(c);
        c = Math.sin(c);
        var g = Math.cos(d);
        d = Math.sin(d);
        var h = Math.cos(e);
        e = Math.sin(e);
        if ("XYZ" === a.order) {
            a = f * h;
            var l = f * e,
                m = c * h,
                n = c * e;
            b[0] = g * h;
            b[4] = -g * e;
            b[8] = d;
            b[1] = l + m * d;
            b[5] = a - n * d;
            b[9] = -c * g;
            b[2] = n - a * d;
            b[6] = m + l * d;
            b[10] = f * g;
        } else
            "YXZ" === a.order
                ? ((a = g * h), (l = g * e), (m = d * h), (n = d * e), (b[0] = a + n * c), (b[4] = m * c - l), (b[8] = f * d), (b[1] = f * e), (b[5] = f * h), (b[9] = -c), (b[2] = l * c - m), (b[6] = n + a * c), (b[10] = f * g))
                : "ZXY" === a.order
                    ? ((a = g * h), (l = g * e), (m = d * h), (n = d * e), (b[0] = a - n * c), (b[4] = -f * e), (b[8] = m + l * c), (b[1] = l + m * c), (b[5] = f * h), (b[9] = n - a * c), (b[2] = -f * d), (b[6] = c), (b[10] = f * g))
                    : "ZYX" === a.order
                        ? ((a = f * h), (l = f * e), (m = c * h), (n = c * e), (b[0] = g * h), (b[4] = m * d - l), (b[8] = a * d + n), (b[1] = g * e), (b[5] = n * d + a), (b[9] = l * d - m), (b[2] = -d), (b[6] = c * g), (b[10] = f * g))
                        : "YZX" === a.order
                            ? ((a = f * g), (l = f * d), (m = c * g), (n = c * d), (b[0] = g * h), (b[4] = n - a * e), (b[8] = m * e + l), (b[1] = e), (b[5] = f * h), (b[9] = -c * h), (b[2] = -d * h), (b[6] = l * e + m), (b[10] = a - n * e))
                            : "XZY" === a.order &&
                            ((a = f * g), (l = f * d), (m = c * g), (n = c * d), (b[0] = g * h), (b[4] = -e), (b[8] = d * h), (b[1] = a * e + n), (b[5] = f * h), (b[9] = l * e - m), (b[2] = m * e - l), (b[6] = c * h), (b[10] = n * e + a));
        b[3] = 0;
        b[7] = 0;
        b[11] = 0;
        b[12] = 0;
        b[13] = 0;
        b[14] = 0;
        b[15] = 1;
        return this;
    },
    setRotationFromQuaternion: function (a) {
        THREE.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().");
        return this.makeRotationFromQuaternion(a);
    },
    makeRotationFromQuaternion: function (a) {
        var b = this.elements,
            c = a.x,
            d = a.y,
            e = a.z,
            f = a.w,
            g = c + c,
            h = d + d,
            l = e + e;
        a = c * g;
        var m = c * h;
        c *= l;
        var n = d * h;
        d *= l;
        e *= l;
        g *= f;
        h *= f;
        f *= l;
        b[0] = 1 - (n + e);
        b[4] = m - f;
        b[8] = c + h;
        b[1] = m + f;
        b[5] = 1 - (a + e);
        b[9] = d - g;
        b[2] = c - h;
        b[6] = d + g;
        b[10] = 1 - (a + n);
        b[3] = 0;
        b[7] = 0;
        b[11] = 0;
        b[12] = 0;
        b[13] = 0;
        b[14] = 0;
        b[15] = 1;
        return this;
    },
    lookAt: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3(),
            c = new THREE.Vector3();
        return function (d, e, f) {
            var g = this.elements;
            c.subVectors(d, e).normalize();
            0 === c.length() && (c.z = 1);
            a.crossVectors(f, c).normalize();
            0 === a.length() && ((c.x += 1e-4), a.crossVectors(f, c).normalize());
            b.crossVectors(c, a);
            g[0] = a.x;
            g[4] = b.x;
            g[8] = c.x;
            g[1] = a.y;
            g[5] = b.y;
            g[9] = c.y;
            g[2] = a.z;
            g[6] = b.z;
            g[10] = c.z;
            return this;
        };
    })(),
    multiply: function (a, b) {
        return void 0 !== b ? (THREE.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."), this.multiplyMatrices(a, b)) : this.multiplyMatrices(this, a);
    },
    multiplyMatrices: function (a, b) {
        var c = a.elements,
            d = b.elements;
        b = this.elements;
        a = c[0];
        var e = c[4],
            f = c[8],
            g = c[12],
            h = c[1],
            l = c[5],
            m = c[9],
            n = c[13],
            p = c[2],
            r = c[6],
            q = c[10],
            u = c[14],
            v = c[3],
            w = c[7],
            y = c[11];
        c = c[15];
        var z = d[0],
            x = d[4],
            A = d[8],
            B = d[12],
            L = d[1],
            C = d[5],
            J = d[9],
            F = d[13],
            I = d[2],
            H = d[6],
            M = d[10],
            N = d[14],
            G = d[3],
            D = d[7],
            E = d[11];
        d = d[15];
        b[0] = a * z + e * L + f * I + g * G;
        b[4] = a * x + e * C + f * H + g * D;
        b[8] = a * A + e * J + f * M + g * E;
        b[12] = a * B + e * F + f * N + g * d;
        b[1] = h * z + l * L + m * I + n * G;
        b[5] = h * x + l * C + m * H + n * D;
        b[9] = h * A + l * J + m * M + n * E;
        b[13] = h * B + l * F + m * N + n * d;
        b[2] = p * z + r * L + q * I + u * G;
        b[6] = p * x + r * C + q * H + u * D;
        b[10] = p * A + r * J + q * M + u * E;
        b[14] = p * B + r * F + q * N + u * d;
        b[3] = v * z + w * L + y * I + c * G;
        b[7] = v * x + w * C + y * H + c * D;
        b[11] = v * A + w * J + y * M + c * E;
        b[15] = v * B + w * F + y * N + c * d;
        return this;
    },
    multiplyToArray: function (a, b, c) {
        var d = this.elements;
        this.multiplyMatrices(a, b);
        c[0] = d[0];
        c[1] = d[1];
        c[2] = d[2];
        c[3] = d[3];
        c[4] = d[4];
        c[5] = d[5];
        c[6] = d[6];
        c[7] = d[7];
        c[8] = d[8];
        c[9] = d[9];
        c[10] = d[10];
        c[11] = d[11];
        c[12] = d[12];
        c[13] = d[13];
        c[14] = d[14];
        c[15] = d[15];
        return this;
    },
    multiplyScalar: function (a) {
        var b = this.elements;
        b[0] *= a;
        b[4] *= a;
        b[8] *= a;
        b[12] *= a;
        b[1] *= a;
        b[5] *= a;
        b[9] *= a;
        b[13] *= a;
        b[2] *= a;
        b[6] *= a;
        b[10] *= a;
        b[14] *= a;
        b[3] *= a;
        b[7] *= a;
        b[11] *= a;
        b[15] *= a;
        return this;
    },
    multiplyVector3: function (a) {
        THREE.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.");
        return a.applyProjection(this);
    },
    multiplyVector4: function (a) {
        THREE.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.");
        return a.applyMatrix4(this);
    },
    multiplyVector3Array: function (a) {
        THREE.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");
        return this.applyToVector3Array(a);
    },
    applyToVector3Array: (function () {
        var a = new THREE.Vector3();
        return function (b, c, d) {
            void 0 === c && (c = 0);
            void 0 === d && (d = b.length);
            for (var e = 0; e < d; e += 3, c += 3) (a.x = b[c]), (a.y = b[c + 1]), (a.z = b[c + 2]), a.applyMatrix4(this), (b[c] = a.x), (b[c + 1] = a.y), (b[c + 2] = a.z);
            return b;
        };
    })(),
    rotateAxis: function (a) {
        THREE.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.");
        a.transformDirection(this);
    },
    crossVector: function (a) {
        THREE.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.");
        return a.applyMatrix4(this);
    },
    determinant: function () {
        var a = this.elements,
            b = a[0],
            c = a[4],
            d = a[8],
            e = a[12],
            f = a[1],
            g = a[5],
            h = a[9],
            l = a[13],
            m = a[2],
            n = a[6],
            p = a[10],
            r = a[14];
        return (
            a[3] * (+e * h * n - d * l * n - e * g * p + c * l * p + d * g * r - c * h * r) +
            a[7] * (+b * h * r - b * l * p + e * f * p - d * f * r + d * l * m - e * h * m) +
            a[11] * (+b * l * n - b * g * r - e * f * n + c * f * r + e * g * m - c * l * m) +
            a[15] * (-d * g * m - b * h * n + b * g * p + d * f * n - c * f * p + c * h * m)
        );
    },
    transpose: function () {
        var a = this.elements;
        var b = a[1];
        a[1] = a[4];
        a[4] = b;
        b = a[2];
        a[2] = a[8];
        a[8] = b;
        b = a[6];
        a[6] = a[9];
        a[9] = b;
        b = a[3];
        a[3] = a[12];
        a[12] = b;
        b = a[7];
        a[7] = a[13];
        a[13] = b;
        b = a[11];
        a[11] = a[14];
        a[14] = b;
        return this;
    },
    flattenToArrayOffset: function (a, b) {
        var c = this.elements;
        a[b] = c[0];
        a[b + 1] = c[1];
        a[b + 2] = c[2];
        a[b + 3] = c[3];
        a[b + 4] = c[4];
        a[b + 5] = c[5];
        a[b + 6] = c[6];
        a[b + 7] = c[7];
        a[b + 8] = c[8];
        a[b + 9] = c[9];
        a[b + 10] = c[10];
        a[b + 11] = c[11];
        a[b + 12] = c[12];
        a[b + 13] = c[13];
        a[b + 14] = c[14];
        a[b + 15] = c[15];
        return a;
    },
    getPosition: (function () {
        var a = new THREE.Vector3();
        return function () {
            THREE.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");
            var b = this.elements;
            return a.set(b[12], b[13], b[14]);
        };
    })(),
    setPosition: function (a) {
        var b = this.elements;
        b[12] = a.x;
        b[13] = a.y;
        b[14] = a.z;
        return this;
    },
    getInverse: function (a, b) {
        var c = this.elements,
            d = a.elements;
        a = d[0];
        var e = d[4],
            f = d[8],
            g = d[12],
            h = d[1],
            l = d[5],
            m = d[9],
            n = d[13],
            p = d[2],
            r = d[6],
            q = d[10],
            u = d[14],
            v = d[3],
            w = d[7],
            y = d[11];
        d = d[15];
        c[0] = m * u * w - n * q * w + n * r * y - l * u * y - m * r * d + l * q * d;
        c[4] = g * q * w - f * u * w - g * r * y + e * u * y + f * r * d - e * q * d;
        c[8] = f * n * w - g * m * w + g * l * y - e * n * y - f * l * d + e * m * d;
        c[12] = g * m * r - f * n * r - g * l * q + e * n * q + f * l * u - e * m * u;
        c[1] = n * q * v - m * u * v - n * p * y + h * u * y + m * p * d - h * q * d;
        c[5] = f * u * v - g * q * v + g * p * y - a * u * y - f * p * d + a * q * d;
        c[9] = g * m * v - f * n * v - g * h * y + a * n * y + f * h * d - a * m * d;
        c[13] = f * n * p - g * m * p + g * h * q - a * n * q - f * h * u + a * m * u;
        c[2] = l * u * v - n * r * v + n * p * w - h * u * w - l * p * d + h * r * d;
        c[6] = g * r * v - e * u * v - g * p * w + a * u * w + e * p * d - a * r * d;
        c[10] = e * n * v - g * l * v + g * h * w - a * n * w - e * h * d + a * l * d;
        c[14] = g * l * p - e * n * p - g * h * r + a * n * r + e * h * u - a * l * u;
        c[3] = m * r * v - l * q * v - m * p * w + h * q * w + l * p * y - h * r * y;
        c[7] = e * q * v - f * r * v + f * p * w - a * q * w - e * p * y + a * r * y;
        c[11] = f * l * v - e * m * v - f * h * w + a * m * w + e * h * y - a * l * y;
        c[15] = e * m * p - f * l * p + f * h * r - a * m * r - e * h * q + a * l * q;
        c = a * c[0] + h * c[4] + p * c[8] + v * c[12];
        if (0 == c) {
            if (b) throw Error("THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0");
            THREE.warn("THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0");
            this.identity();
            return this;
        }
        this.multiplyScalar(1 / c);
        return this;
    },
    translate: function () {
        THREE.error("THREE.Matrix4: .translate() has been removed.");
    },
    rotateX: function () {
        THREE.error("THREE.Matrix4: .rotateX() has been removed.");
    },
    rotateY: function () {
        THREE.error("THREE.Matrix4: .rotateY() has been removed.");
    },
    rotateZ: function () {
        THREE.error("THREE.Matrix4: .rotateZ() has been removed.");
    },
    rotateByAxis: function () {
        THREE.error("THREE.Matrix4: .rotateByAxis() has been removed.");
    },
    scale: function (a) {
        var b = this.elements,
            c = a.x,
            d = a.y;
        a = a.z;
        b[0] *= c;
        b[4] *= d;
        b[8] *= a;
        b[1] *= c;
        b[5] *= d;
        b[9] *= a;
        b[2] *= c;
        b[6] *= d;
        b[10] *= a;
        b[3] *= c;
        b[7] *= d;
        b[11] *= a;
        return this;
    },
    getMaxScaleOnAxis: function () {
        var a = this.elements;
        return Math.sqrt(Math.max(a[0] * a[0] + a[1] * a[1] + a[2] * a[2], Math.max(a[4] * a[4] + a[5] * a[5] + a[6] * a[6], a[8] * a[8] + a[9] * a[9] + a[10] * a[10])));
    },
    makeTranslation: function (a, b, c) {
        this.set(1, 0, 0, a, 0, 1, 0, b, 0, 0, 1, c, 0, 0, 0, 1);
        return this;
    },
    makeRotationX: function (a) {
        var b = Math.cos(a);
        a = Math.sin(a);
        this.set(1, 0, 0, 0, 0, b, -a, 0, 0, a, b, 0, 0, 0, 0, 1);
        return this;
    },
    makeRotationY: function (a) {
        var b = Math.cos(a);
        a = Math.sin(a);
        this.set(b, 0, a, 0, 0, 1, 0, 0, -a, 0, b, 0, 0, 0, 0, 1);
        return this;
    },
    makeRotationZ: function (a) {
        var b = Math.cos(a);
        a = Math.sin(a);
        this.set(b, -a, 0, 0, a, b, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    },
    makeRotationAxis: function (a, b) {
        var c = Math.cos(b);
        b = Math.sin(b);
        var d = 1 - c,
            e = a.x,
            f = a.y;
        a = a.z;
        var g = d * e,
            h = d * f;
        this.set(g * e + c, g * f - b * a, g * a + b * f, 0, g * f + b * a, h * f + c, h * a - b * e, 0, g * a - b * f, h * a + b * e, d * a * a + c, 0, 0, 0, 0, 1);
        return this;
    },
    makeScale: function (a, b, c) {
        this.set(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, 0, 0, 0, 1);
        return this;
    },
    compose: function (a, b, c) {
        this.makeRotationFromQuaternion(b);
        this.scale(c);
        this.setPosition(a);
        return this;
    },
    decompose: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Matrix4();
        return function (c, d, e) {
            var f = this.elements,
                g = a.set(f[0], f[1], f[2]).length(),
                h = a.set(f[4], f[5], f[6]).length(),
                l = a.set(f[8], f[9], f[10]).length();
            0 > this.determinant() && (g = -g);
            c.x = f[12];
            c.y = f[13];
            c.z = f[14];
            b.elements.set(this.elements);
            c = 1 / g;
            f = 1 / h;
            var m = 1 / l;
            b.elements[0] *= c;
            b.elements[1] *= c;
            b.elements[2] *= c;
            b.elements[4] *= f;
            b.elements[5] *= f;
            b.elements[6] *= f;
            b.elements[8] *= m;
            b.elements[9] *= m;
            b.elements[10] *= m;
            d.setFromRotationMatrix(b);
            e.x = g;
            e.y = h;
            e.z = l;
            return this;
        };
    })(),
    makeFrustum: function (a, b, c, d, e, f) {
        var g = this.elements;
        g[0] = (2 * e) / (b - a);
        g[4] = 0;
        g[8] = (b + a) / (b - a);
        g[12] = 0;
        g[1] = 0;
        g[5] = (2 * e) / (d - c);
        g[9] = (d + c) / (d - c);
        g[13] = 0;
        g[2] = 0;
        g[6] = 0;
        g[10] = -(f + e) / (f - e);
        g[14] = (-2 * f * e) / (f - e);
        g[3] = 0;
        g[7] = 0;
        g[11] = -1;
        g[15] = 0;
        return this;
    },
    makePerspective: function (a, b, c, d) {
        a = c * Math.tan(THREE.Math.degToRad(0.5 * a));
        var e = -a;
        return this.makeFrustum(e * b, a * b, e, a, c, d);
    },
    makeOrthographic: function (a, b, c, d, e, f) {
        var g = this.elements,
            h = b - a,
            l = c - d,
            m = f - e;
        g[0] = 2 / h;
        g[4] = 0;
        g[8] = 0;
        g[12] = -((b + a) / h);
        g[1] = 0;
        g[5] = 2 / l;
        g[9] = 0;
        g[13] = -((c + d) / l);
        g[2] = 0;
        g[6] = 0;
        g[10] = -2 / m;
        g[14] = -((f + e) / m);
        g[3] = 0;
        g[7] = 0;
        g[11] = 0;
        g[15] = 1;
        return this;
    },
    fromArray: function (a) {
        this.elements.set(a);
        return this;
    },
    toArray: function () {
        var a = this.elements;
        return [a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]];
    },
    clone: function () {
        return new THREE.Matrix4().fromArray(this.elements);
    },
};
THREE.Triangle = function (a, b, c) {
    this.a = void 0 !== a ? a : new THREE.Vector3();
    this.b = void 0 !== b ? b : new THREE.Vector3();
    this.c = void 0 !== c ? c : new THREE.Vector3();
};
THREE.Triangle.normal = (function () {
    var a = new THREE.Vector3();
    return function (b, c, d, e) {
        e = e || new THREE.Vector3();
        e.subVectors(d, c);
        a.subVectors(b, c);
        e.cross(a);
        b = e.lengthSq();
        return 0 < b ? e.multiplyScalar(1 / Math.sqrt(b)) : e.set(0, 0, 0);
    };
})();
THREE.Triangle.barycoordFromPoint = (function () {
    var a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();
    return function (d, e, f, g, h) {
        a.subVectors(g, e);
        b.subVectors(f, e);
        c.subVectors(d, e);
        d = a.dot(a);
        e = a.dot(b);
        f = a.dot(c);
        var l = b.dot(b);
        g = b.dot(c);
        var m = d * l - e * e;
        h = h || new THREE.Vector3();
        if (0 == m) return h.set(-2, -1, -1);
        m = 1 / m;
        l = (l * f - e * g) * m;
        d = (d * g - e * f) * m;
        return h.set(1 - l - d, d, l);
    };
})();
THREE.Triangle.containsPoint = (function () {
    var a = new THREE.Vector3();
    return function (b, c, d, e) {
        b = THREE.Triangle.barycoordFromPoint(b, c, d, e, a);
        return 0 <= b.x && 0 <= b.y && 1 >= b.x + b.y;
    };
})();
THREE.Triangle.prototype = {
    constructor: THREE.Triangle,
    set: function (a, b, c) {
        this.a.copy(a);
        this.b.copy(b);
        this.c.copy(c);
        return this;
    },
    setFromPointsAndIndices: function (a, b, c, d) {
        this.a.copy(a[b]);
        this.b.copy(a[c]);
        this.c.copy(a[d]);
        return this;
    },
    copy: function (a) {
        this.a.copy(a.a);
        this.b.copy(a.b);
        this.c.copy(a.c);
        return this;
    },
    area: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3();
        return function () {
            a.subVectors(this.c, this.b);
            b.subVectors(this.a, this.b);
            return 0.5 * a.cross(b).length();
        };
    })(),
    midpoint: function (a) {
        return (a || new THREE.Vector3())
            .addVectors(this.a, this.b)
            .add(this.c)
            .multiplyScalar(1 / 3);
    },
    normal: function (a) {
        return THREE.Triangle.normal(this.a, this.b, this.c, a);
    },
    plane: function (a) {
        return (a || new THREE.Plane()).setFromCoplanarPoints(this.a, this.b, this.c);
    },
    barycoordFromPoint: function (a, b) {
        return THREE.Triangle.barycoordFromPoint(a, this.a, this.b, this.c, b);
    },
    containsPoint: function (a) {
        return THREE.Triangle.containsPoint(a, this.a, this.b, this.c);
    },
    equals: function (a) {
        return a.a.equals(this.a) && a.b.equals(this.b) && a.c.equals(this.c);
    },
    clone: function () {
        return new THREE.Triangle().copy(this);
    },
};
THREE.Ray = function (a, b) {
    this.origin = void 0 !== a ? a : new THREE.Vector3();
    this.direction = void 0 !== b ? b : new THREE.Vector3();
};
THREE.Ray.prototype = {
    constructor: THREE.Ray,
    set: function (a, b) {
        this.origin.copy(a);
        this.direction.copy(b);
        return this;
    },
    copy: function (a) {
        this.origin.copy(a.origin);
        this.direction.copy(a.direction);
        return this;
    },
    at: function (a, b) {
        return (b || new THREE.Vector3()).copy(this.direction).multiplyScalar(a).add(this.origin);
    },
    recast: (function () {
        var a = new THREE.Vector3();
        return function (b) {
            this.origin.copy(this.at(b, a));
            return this;
        };
    })(),
    closestPointToPoint: function (a, b) {
        b = b || new THREE.Vector3();
        b.subVectors(a, this.origin);
        a = b.dot(this.direction);
        return 0 > a ? b.copy(this.origin) : b.copy(this.direction).multiplyScalar(a).add(this.origin);
    },
    distanceToPoint: (function () {
        var a = new THREE.Vector3();
        return function (b) {
            var c = a.subVectors(b, this.origin).dot(this.direction);
            if (0 > c) return this.origin.distanceTo(b);
            a.copy(this.direction).multiplyScalar(c).add(this.origin);
            return a.distanceTo(b);
        };
    })(),
    distanceSqToSegment: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3(),
            c = new THREE.Vector3();
        return function (d, e, f, g) {
            a.copy(d).add(e).multiplyScalar(0.5);
            b.copy(e).sub(d).normalize();
            c.copy(this.origin).sub(a);
            var h = 0.5 * d.distanceTo(e),
                l = -this.direction.dot(b),
                m = c.dot(this.direction),
                n = -c.dot(b),
                p = c.lengthSq(),
                r = Math.abs(1 - l * l);
            if (0 < r) {
                d = l * n - m;
                e = l * m - n;
                var q = h * r;
                0 <= d
                    ? e >= -q
                        ? e <= q
                            ? ((h = 1 / r), (d *= h), (e *= h), (l = d * (d + l * e + 2 * m) + e * (l * d + e + 2 * n) + p))
                            : ((e = h), (d = Math.max(0, -(l * e + m))), (l = -d * d + e * (e + 2 * n) + p))
                        : ((e = -h), (d = Math.max(0, -(l * e + m))), (l = -d * d + e * (e + 2 * n) + p))
                    : e <= -q
                        ? ((d = Math.max(0, -(-l * h + m))), (e = 0 < d ? -h : Math.min(Math.max(-h, -n), h)), (l = -d * d + e * (e + 2 * n) + p))
                        : e <= q
                            ? ((d = 0), (e = Math.min(Math.max(-h, -n), h)), (l = e * (e + 2 * n) + p))
                            : ((d = Math.max(0, -(l * h + m))), (e = 0 < d ? h : Math.min(Math.max(-h, -n), h)), (l = -d * d + e * (e + 2 * n) + p));
            } else (e = 0 < l ? -h : h), (d = Math.max(0, -(l * e + m))), (l = -d * d + e * (e + 2 * n) + p);
            f && f.copy(this.direction).multiplyScalar(d).add(this.origin);
            g && g.copy(b).multiplyScalar(e).add(a);
            return l;
        };
    })(),
    isIntersectionSphere: function (a) {
        return this.distanceToPoint(a.center) <= a.radius;
    },
    intersectSphere: (function () {
        var a = new THREE.Vector3();
        return function (b, c) {
            a.subVectors(b.center, this.origin);
            var d = a.dot(this.direction),
                e = a.dot(a) - d * d;
            b = b.radius * b.radius;
            if (e > b) return null;
            b = Math.sqrt(b - e);
            e = d - b;
            d += b;
            return 0 > e && 0 > d ? null : 0 > e ? this.at(d, c) : this.at(e, c);
        };
    })(),
    isIntersectionPlane: function (a) {
        var b = a.distanceToPoint(this.origin);
        return 0 === b || 0 > a.normal.dot(this.direction) * b ? !0 : !1;
    },
    distanceToPlane: function (a) {
        var b = a.normal.dot(this.direction);
        if (0 == b) return 0 == a.distanceToPoint(this.origin) ? 0 : null;
        a = -(this.origin.dot(a.normal) + a.constant) / b;
        return 0 <= a ? a : null;
    },
    intersectPlane: function (a, b) {
        a = this.distanceToPlane(a);
        return null === a ? null : this.at(a, b);
    },
    isIntersectionBox: (function () {
        var a = new THREE.Vector3();
        return function (b) {
            return null !== this.intersectBox(b, a);
        };
    })(),
    intersectBox: function (a, b) {
        var c = 1 / this.direction.x;
        var d = 1 / this.direction.y;
        var e = 1 / this.direction.z,
            f = this.origin;
        if (0 <= c) {
            var g = (a.min.x - f.x) * c;
            c *= a.max.x - f.x;
        } else (g = (a.max.x - f.x) * c), (c *= a.min.x - f.x);
        if (0 <= d) {
            var h = (a.min.y - f.y) * d;
            d *= a.max.y - f.y;
        } else (h = (a.max.y - f.y) * d), (d *= a.min.y - f.y);
        if (g > d || h > c) return null;
        if (h > g || g !== g) g = h;
        if (d < c || c !== c) c = d;
        0 <= e ? ((h = (a.min.z - f.z) * e), (a = (a.max.z - f.z) * e)) : ((h = (a.max.z - f.z) * e), (a = (a.min.z - f.z) * e));
        if (g > a || h > c) return null;
        if (h > g || g !== g) g = h;
        if (a < c || c !== c) c = a;
        return 0 > c ? null : this.at(0 <= g ? g : c, b);
    },
    intersectTriangle: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3(),
            c = new THREE.Vector3(),
            d = new THREE.Vector3();
        return function (e, f, g, h, l) {
            b.subVectors(f, e);
            c.subVectors(g, e);
            d.crossVectors(b, c);
            f = this.direction.dot(d);
            if (0 < f) {
                if (h) return null;
                h = 1;
            } else if (0 > f) (h = -1), (f = -f);
            else return null;
            a.subVectors(this.origin, e);
            e = h * this.direction.dot(c.crossVectors(a, c));
            if (0 > e) return null;
            g = h * this.direction.dot(b.cross(a));
            if (0 > g || e + g > f) return null;
            e = -h * a.dot(d);
            return 0 > e ? null : this.at(e / f, l);
        };
    })(),
    applyMatrix4: function (a) {
        this.direction.add(this.origin).applyMatrix4(a);
        this.origin.applyMatrix4(a);
        this.direction.sub(this.origin);
        this.direction.normalize();
        return this;
    },
    equals: function (a) {
        return a.origin.equals(this.origin) && a.direction.equals(this.direction);
    },
    clone: function () {
        return new THREE.Ray().copy(this);
    },
};
THREE.Sphere = function (a, b) {
    this.center = void 0 !== a ? a : new THREE.Vector3();
    this.radius = void 0 !== b ? b : 0;
};
THREE.Sphere.prototype = {
    constructor: THREE.Sphere,
    set: function (a, b) {
        this.center.copy(a);
        this.radius = b;
        return this;
    },
    setFromPoints: (function () {
        var a = new THREE.Box3();
        return function (b, c) {
            var d = this.center;
            void 0 !== c ? d.copy(c) : a.setFromPoints(b).center(d);
            for (var e = (c = 0), f = b.length; e < f; e++) c = Math.max(c, d.distanceToSquared(b[e]));
            this.radius = Math.sqrt(c);
            return this;
        };
    })(),
    copy: function (a) {
        this.center.copy(a.center);
        this.radius = a.radius;
        return this;
    },
    empty: function () {
        return 0 >= this.radius;
    },
    containsPoint: function (a) {
        return a.distanceToSquared(this.center) <= this.radius * this.radius;
    },
    distanceToPoint: function (a) {
        return a.distanceTo(this.center) - this.radius;
    },
    intersectsSphere: function (a) {
        var b = this.radius + a.radius;
        return a.center.distanceToSquared(this.center) <= b * b;
    },
    clampPoint: function (a, b) {
        var c = this.center.distanceToSquared(a);
        b = b || new THREE.Vector3();
        b.copy(a);
        c > this.radius * this.radius && (b.sub(this.center).normalize(), b.multiplyScalar(this.radius).add(this.center));
        return b;
    },
    getBoundingBox: function (a) {
        a = a || new THREE.Box3();
        a.set(this.center, this.center);
        a.expandByScalar(this.radius);
        return a;
    },
    applyMatrix4: function (a) {
        this.center.applyMatrix4(a);
        this.radius *= a.getMaxScaleOnAxis();
        return this;
    },
    translate: function (a) {
        this.center.add(a);
        return this;
    },
    equals: function (a) {
        return a.center.equals(this.center) && a.radius === this.radius;
    },
    clone: function () {
        return new THREE.Sphere().copy(this);
    },
};
THREE.Plane = function (a, b) {
    this.normal = void 0 !== a ? a : new THREE.Vector3(1, 0, 0);
    this.constant = void 0 !== b ? b : 0;
};
THREE.Plane.prototype = {
    constructor: THREE.Plane,
    set: function (a, b) {
        this.normal.copy(a);
        this.constant = b;
        return this;
    },
    setComponents: function (a, b, c, d) {
        this.normal.set(a, b, c);
        this.constant = d;
        return this;
    },
    setFromNormalAndCoplanarPoint: function (a, b) {
        this.normal.copy(a);
        this.constant = -b.dot(this.normal);
        return this;
    },
    setFromCoplanarPoints: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3();
        return function (c, d, e) {
            d = a.subVectors(e, d).cross(b.subVectors(c, d)).normalize();
            this.setFromNormalAndCoplanarPoint(d, c);
            return this;
        };
    })(),
    copy: function (a) {
        this.normal.copy(a.normal);
        this.constant = a.constant;
        return this;
    },
    normalize: function () {
        var a = 1 / this.normal.length();
        this.normal.multiplyScalar(a);
        this.constant *= a;
        return this;
    },
    negate: function () {
        this.constant *= -1;
        this.normal.negate();
        return this;
    },
    distanceToPoint: function (a) {
        return this.normal.dot(a) + this.constant;
    },
    distanceToSphere: function (a) {
        return this.distanceToPoint(a.center) - a.radius;
    },
    projectPoint: function (a, b) {
        return this.orthoPoint(a, b).sub(a).negate();
    },
    orthoPoint: function (a, b) {
        a = this.distanceToPoint(a);
        return (b || new THREE.Vector3()).copy(this.normal).multiplyScalar(a);
    },
    isIntersectionLine: function (a) {
        var b = this.distanceToPoint(a.start);
        a = this.distanceToPoint(a.end);
        return (0 > b && 0 < a) || (0 > a && 0 < b);
    },
    intersectLine: (function () {
        var a = new THREE.Vector3();
        return function (b, c) {
            c = c || new THREE.Vector3();
            var d = b.delta(a),
                e = this.normal.dot(d);
            if (0 == e) {
                if (0 == this.distanceToPoint(b.start)) return c.copy(b.start);
            } else if (((e = -(b.start.dot(this.normal) + this.constant) / e), !(0 > e || 1 < e))) return c.copy(d).multiplyScalar(e).add(b.start);
        };
    })(),
    coplanarPoint: function (a) {
        return (a || new THREE.Vector3()).copy(this.normal).multiplyScalar(-this.constant);
    },
    applyMatrix4: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3(),
            c = new THREE.Matrix3();
        return function (d, e) {
            e = e || c.getNormalMatrix(d);
            e = a.copy(this.normal).applyMatrix3(e);
            var f = this.coplanarPoint(b);
            f.applyMatrix4(d);
            this.setFromNormalAndCoplanarPoint(e, f);
            return this;
        };
    })(),
    translate: function (a) {
        this.constant -= a.dot(this.normal);
        return this;
    },
    equals: function (a) {
        return a.normal.equals(this.normal) && a.constant == this.constant;
    },
    clone: function () {
        return new THREE.Plane().copy(this);
    },
};
THREE.Math = {
    generateUUID: (function () {
        var a = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
            b = Array(36),
            c = 0,
            d;
        return function () {
            for (var e = 0; 36 > e; e++)
                8 == e || 13 == e || 18 == e || 23 == e ? (b[e] = "-") : 14 == e ? (b[e] = "4") : (2 >= c && (c = (33554432 + 16777216 * Math.random()) | 0), (d = c & 15), (c >>= 4), (b[e] = a[19 == e ? (d & 3) | 8 : d]));
            return b.join("");
        };
    })(),
    clamp: function (a, b, c) {
        return a < b ? b : a > c ? c : a;
    },
    clampBottom: function (a, b) {
        return a < b ? b : a;
    },
    mapLinear: function (a, b, c, d, e) {
        return d + ((a - b) * (e - d)) / (c - b);
    },
    smoothstep: function (a, b, c) {
        if (a <= b) return 0;
        if (a >= c) return 1;
        a = (a - b) / (c - b);
        return a * a * (3 - 2 * a);
    },
    smootherstep: function (a, b, c) {
        if (a <= b) return 0;
        if (a >= c) return 1;
        a = (a - b) / (c - b);
        return a * a * a * (a * (6 * a - 15) + 10);
    },
    random16: function () {
        return (65280 * Math.random() + 255 * Math.random()) / 65535;
    },
    randInt: function (a, b) {
        return Math.floor(this.randFloat(a, b));
    },
    randFloat: function (a, b) {
        return a + Math.random() * (b - a);
    },
    randFloatSpread: function (a) {
        return a * (0.5 - Math.random());
    },
    degToRad: (function () {
        var a = Math.PI / 180;
        return function (b) {
            return b * a;
        };
    })(),
    radToDeg: (function () {
        var a = 180 / Math.PI;
        return function (b) {
            return b * a;
        };
    })(),
    isPowerOfTwo: function (a) {
        return 0 === (a & (a - 1)) && 0 !== a;
    },
    nextPowerOfTwo: function (a) {
        a--;
        a |= a >> 1;
        a |= a >> 2;
        a |= a >> 4;
        a |= a >> 8;
        a |= a >> 16;
        a++;
        return a;
    },
};
THREE.Clock = function (a) {
    this.autoStart = void 0 !== a ? a : !0;
    this.elapsedTime = this.oldTime = this.startTime = 0;
    this.running = !1;
};
THREE.Clock.prototype = {
    constructor: THREE.Clock,
    start: function () {
        this.oldTime = this.startTime = void 0 !== self.performance && void 0 !== self.performance.now ? self.performance.now() : Date.now();
        this.running = !0;
    },
    stop: function () {
        this.getElapsedTime();
        this.running = !1;
    },
    getElapsedTime: function () {
        this.getDelta();
        return this.elapsedTime;
    },
    getDelta: function () {
        var a = 0;
        this.autoStart && !this.running && this.start();
        if (this.running) {
            var b = void 0 !== self.performance && void 0 !== self.performance.now ? self.performance.now() : Date.now();
            a = 0.001 * (b - this.oldTime);
            this.oldTime = b;
            this.elapsedTime += a;
        }
        return a;
    },
};
THREE.EventDispatcher = function () {};
THREE.EventDispatcher.prototype = {
    constructor: THREE.EventDispatcher,
    apply: function (a) {
        a.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
        a.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
        a.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
        a.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;
    },
    addEventListener: function (a, b) {
        void 0 === this._listeners && (this._listeners = {});
        var c = this._listeners;
        void 0 === c[a] && (c[a] = []);
        -1 === c[a].indexOf(b) && c[a].push(b);
    },
    hasEventListener: function (a, b) {
        if (void 0 === this._listeners) return !1;
        var c = this._listeners;
        return void 0 !== c[a] && -1 !== c[a].indexOf(b) ? !0 : !1;
    },
    removeEventListener: function (a, b) {
        void 0 !== this._listeners && ((a = this._listeners[a]), void 0 !== a && ((b = a.indexOf(b)), -1 !== b && a.splice(b, 1)));
    },
    dispatchEvent: function (a) {
        if (void 0 !== this._listeners) {
            var b = this._listeners[a.type];
            if (void 0 !== b) {
                a.target = this;
                for (var c = [], d = b.length, e = 0; e < d; e++) c[e] = b[e];
                for (e = 0; e < d; e++) c[e].call(this, a);
            }
        }
    },
};
THREE.Object3D = function () {
    Object.defineProperty(this, "id", { value: THREE.Object3DIdCount++ });
    this.name = "";
    this.parent = void 0;
    this.children = [];
    this.up = THREE.Object3D.DefaultUp.clone();
    var a = new THREE.Vector3(),
        b = new THREE.Euler(),
        c = new THREE.Quaternion(),
        d = new THREE.Vector3(1, 1, 1);
    b.onChange(function () {
        c.setFromEuler(b, !1);
    });
    c.onChange(function () {
        b.setFromQuaternion(c, void 0, !1);
    });
    Object.defineProperties(this, { position: { enumerable: !0, value: a }, rotation: { enumerable: !0, value: b }, quaternion: { enumerable: !0, value: c }, scale: { enumerable: !0, value: d } });
    this.rotationAutoUpdate = !0;
    this.matrix = new THREE.Matrix4();
    this.matrixWorld = new THREE.Matrix4();
    this.matrixAutoUpdate = !0;
    this.matrixWorldNeedsUpdate = !1;
    this.visible = !0;
    this.receiveShadow = this.castShadow = !1;
    this.frustumCulled = !0;
    this.userData = {};
};
THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0);
THREE.Object3D.prototype = {
    constructor: THREE.Object3D,
    applyMatrix: function (a) {
        this.matrix.multiplyMatrices(a, this.matrix);
        this.matrix.decompose(this.position, this.quaternion, this.scale);
    },
    setRotationFromAxisAngle: function (a, b) {
        this.quaternion.setFromAxisAngle(a, b);
    },
    setRotationFromEuler: function (a) {
        this.quaternion.setFromEuler(a, !0);
    },
    setRotationFromMatrix: function (a) {
        this.quaternion.setFromRotationMatrix(a);
    },
    setRotationFromQuaternion: function (a) {
        this.quaternion.copy(a);
    },
    rotateOnAxis: (function () {
        var a = new THREE.Quaternion();
        return function (b, c) {
            a.setFromAxisAngle(b, c);
            this.quaternion.multiply(a);
            return this;
        };
    })(),
    rotateX: (function () {
        var a = new THREE.Vector3(1, 0, 0);
        return function (b) {
            return this.rotateOnAxis(a, b);
        };
    })(),
    rotateY: (function () {
        var a = new THREE.Vector3(0, 1, 0);
        return function (b) {
            return this.rotateOnAxis(a, b);
        };
    })(),
    rotateZ: (function () {
        var a = new THREE.Vector3(0, 0, 1);
        return function (b) {
            return this.rotateOnAxis(a, b);
        };
    })(),
    translateOnAxis: (function () {
        var a = new THREE.Vector3();
        return function (b, c) {
            a.copy(b).applyQuaternion(this.quaternion);
            this.position.add(a.multiplyScalar(c));
            return this;
        };
    })(),
    translate: function (a, b) {
        THREE.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.");
        return this.translateOnAxis(b, a);
    },
    translateX: (function () {
        var a = new THREE.Vector3(1, 0, 0);
        return function (b) {
            return this.translateOnAxis(a, b);
        };
    })(),
    translateY: (function () {
        var a = new THREE.Vector3(0, 1, 0);
        return function (b) {
            return this.translateOnAxis(a, b);
        };
    })(),
    translateZ: (function () {
        var a = new THREE.Vector3(0, 0, 1);
        return function (b) {
            return this.translateOnAxis(a, b);
        };
    })(),
    localToWorld: function (a) {
        return a.applyMatrix4(this.matrixWorld);
    },
    worldToLocal: (function () {
        var a = new THREE.Matrix4();
        return function (b) {
            return b.applyMatrix4(a.getInverse(this.matrixWorld));
        };
    })(),
    lookAt: (function () {
        var a = new THREE.Matrix4();
        return function (b) {
            a.lookAt(b, this.position, this.up);
            this.quaternion.setFromRotationMatrix(a);
        };
    })(),
    add: function (a) {
        if (1 < arguments.length) {
            for (var b = 0; b < arguments.length; b++) this.add(arguments[b]);
            return this;
        }
        if (a === this) return THREE.error("THREE.Object3D.add: object can't be added as a child of itself.", a), this;
        a instanceof THREE.Object3D ? (void 0 !== a.parent && a.parent.remove(a), (a.parent = this), a.dispatchEvent({ type: "added" }), this.children.push(a)) : THREE.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", a);
        return this;
    },
    remove: function (a) {
        if (1 < arguments.length) for (var b = 0; b < arguments.length; b++) this.remove(arguments[b]);
        b = this.children.indexOf(a);
        -1 !== b && ((a.parent = void 0), a.dispatchEvent({ type: "removed" }), this.children.splice(b, 1));
    },
    getChildByName: function (a) {
        THREE.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().");
        return this.getObjectByName(a);
    },
    getObjectById: function (a) {
        return this.getObjectByProperty("id", a);
    },
    getObjectByName: function (a) {
        return this.getObjectByProperty("name", a);
    },
    getObjectByProperty: function (a, b) {
        if (this[a] === b) return this;
        for (var c = 0, d = this.children.length; c < d; c++) {
            var e = this.children[c].getObjectByProperty(a, b);
            if (void 0 !== e) return e;
        }
    },
    getWorldPosition: function (a) {
        a = a || new THREE.Vector3();
        this.updateMatrixWorld(!0);
        return a.setFromMatrixPosition(this.matrixWorld);
    },
    getWorldQuaternion: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Vector3();
        return function (c) {
            c = c || new THREE.Quaternion();
            this.updateMatrixWorld(!0);
            this.matrixWorld.decompose(a, c, b);
            return c;
        };
    })(),
    getWorldRotation: (function () {
        var a = new THREE.Quaternion();
        return function (b) {
            b = b || new THREE.Euler();
            this.getWorldQuaternion(a);
            return b.setFromQuaternion(a, this.rotation.order, !1);
        };
    })(),
    getWorldScale: (function () {
        var a = new THREE.Vector3(),
            b = new THREE.Quaternion();
        return function (c) {
            c = c || new THREE.Vector3();
            this.updateMatrixWorld(!0);
            this.matrixWorld.decompose(a, b, c);
            return c;
        };
    })(),
    getWorldDirection: (function () {
        var a = new THREE.Quaternion();
        return function (b) {
            b = b || new THREE.Vector3();
            this.getWorldQuaternion(a);
            return b.set(0, 0, 1).applyQuaternion(a);
        };
    })(),
    raycast: function () {},
    traverse: function (a) {
        a(this);
        for (var b = 0, c = this.children.length; b < c; b++) this.children[b].traverse(a);
    },
    traverseVisible: function (a) {
        if (!1 !== this.visible) {
            a(this);
            for (var b = 0, c = this.children.length; b < c; b++) this.children[b].traverseVisible(a);
        }
    },
    traverseAncestors: function (a) {
        this.parent && (a(this.parent), this.parent.traverseAncestors(a));
    },
    updateMatrix: function () {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        this.matrixWorldNeedsUpdate = !0;
    },
    updateMatrixWorld: function (a) {
        !0 === this.matrixAutoUpdate && this.updateMatrix();
        if (!0 === this.matrixWorldNeedsUpdate || !0 === a)
            void 0 === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), (this.matrixWorldNeedsUpdate = !1), (a = !0);
        for (var b = 0, c = this.children.length; b < c; b++) this.children[b].updateMatrixWorld(a);
    },
    clone: function (a, b) {
        void 0 === a && (a = new THREE.Object3D());
        void 0 === b && (b = !0);
        a.name = this.name;
        a.up.copy(this.up);
        a.position.copy(this.position);
        a.quaternion.copy(this.quaternion);
        a.scale.copy(this.scale);
        a.rotationAutoUpdate = this.rotationAutoUpdate;
        a.matrix.copy(this.matrix);
        a.matrixWorld.copy(this.matrixWorld);
        a.matrixAutoUpdate = this.matrixAutoUpdate;
        a.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;
        a.visible = this.visible;
        a.castShadow = this.castShadow;
        a.receiveShadow = this.receiveShadow;
        a.frustumCulled = this.frustumCulled;
        a.userData = JSON.parse(JSON.stringify(this.userData));
        if (!0 === b) for (b = 0; b < this.children.length; b++) a.add(this.children[b].clone());
        return a;
    },
};
THREE.EventDispatcher.prototype.apply(THREE.Object3D.prototype);
THREE.Object3DIdCount = 0;
THREE.Face3 = function (a, b, c, d, e, f) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal = d instanceof THREE.Vector3 ? d : new THREE.Vector3();
    this.vertexNormals = d instanceof Array ? d : [];
    this.color = e instanceof THREE.Color ? e : new THREE.Color();
    this.vertexColors = e instanceof Array ? e : [];
    this.vertexTangents = [];
    this.materialIndex = void 0 !== f ? f : 0;
};
THREE.Face3.prototype = {
    constructor: THREE.Face3,
    clone: function () {
        var a = new THREE.Face3(this.a, this.b, this.c);
        a.normal.copy(this.normal);
        a.color.copy(this.color);
        a.materialIndex = this.materialIndex;
        for (var b = 0, c = this.vertexNormals.length; b < c; b++) a.vertexNormals[b] = this.vertexNormals[b].clone();
        b = 0;
        for (c = this.vertexColors.length; b < c; b++) a.vertexColors[b] = this.vertexColors[b].clone();
        b = 0;
        for (c = this.vertexTangents.length; b < c; b++) a.vertexTangents[b] = this.vertexTangents[b].clone();
        return a;
    },
};
THREE.BufferAttribute = function (a, b) {
    this.array = a;
    this.itemSize = b;
    this.needsUpdate = !1;
};
THREE.BufferAttribute.prototype = {
    constructor: THREE.BufferAttribute,
    get length() {
        return this.array.length;
    },
    copyAt: function (a, b, c) {
        a *= this.itemSize;
        c *= b.itemSize;
        for (var d = 0, e = this.itemSize; d < e; d++) this.array[a + d] = b.array[c + d];
        return this;
    },
    set: function (a, b) {
        void 0 === b && (b = 0);
        this.array.set(a, b);
        return this;
    },
    setX: function (a, b) {
        this.array[a * this.itemSize] = b;
        return this;
    },
    setY: function (a, b) {
        this.array[a * this.itemSize + 1] = b;
        return this;
    },
    setZ: function (a, b) {
        this.array[a * this.itemSize + 2] = b;
        return this;
    },
    setXY: function (a, b, c) {
        a *= this.itemSize;
        this.array[a] = b;
        this.array[a + 1] = c;
        return this;
    },
    setXYZ: function (a, b, c, d) {
        a *= this.itemSize;
        this.array[a] = b;
        this.array[a + 1] = c;
        this.array[a + 2] = d;
        return this;
    },
    setXYZW: function (a, b, c, d, e) {
        a *= this.itemSize;
        this.array[a] = b;
        this.array[a + 1] = c;
        this.array[a + 2] = d;
        this.array[a + 3] = e;
        return this;
    },
    clone: function () {
        return new THREE.BufferAttribute(new this.array.constructor(this.array), this.itemSize);
    },
};
THREE.BufferGeometry = function () {
    Object.defineProperty(this, "id", { value: THREE.GeometryIdCount++ });
    this.name = "";
    this.attributes = {};
    this.attributesKeys = [];
    this.offsets = this.drawcalls = [];
    this.boundingSphere = this.boundingBox = null;
};
THREE.BufferGeometry.prototype = {
    constructor: THREE.BufferGeometry,
    addAttribute: function (a, b) {
        this.attributes[a] = b;
        this.attributesKeys = Object.keys(this.attributes);
    },
    getAttribute: function (a) {
        return this.attributes[a];
    },
    addDrawCall: function (a, b, c) {
        this.drawcalls.push({ start: a, count: b, index: void 0 !== c ? c : 0 });
    },
    applyMatrix: function (a) {
        var b = this.attributes.position;
        void 0 !== b && (a.applyToVector3Array(b.array), (b.needsUpdate = !0));
        b = this.attributes.normal;
        void 0 !== b && (new THREE.Matrix3().getNormalMatrix(a).applyToVector3Array(b.array), (b.needsUpdate = !0));
        null !== this.boundingBox && this.computeBoundingBox();
        null !== this.boundingSphere && this.computeBoundingSphere();
    },
    center: function () {
        this.computeBoundingBox();
        var a = this.boundingBox.center().negate();
        this.applyMatrix(new THREE.Matrix4().setPosition(a));
        return a;
    },
    computeBoundingBox: (function () {
        var a = new THREE.Vector3();
        return function () {
            null === this.boundingBox && (this.boundingBox = new THREE.Box3());
            var b = this.attributes.position.array;
            if (b) {
                var c = this.boundingBox;
                c.makeEmpty();
                for (var d = 0, e = b.length; d < e; d += 3) a.set(b[d], b[d + 1], b[d + 2]), c.expandByPoint(a);
            }
            if (void 0 === b || 0 === b.length) this.boundingBox.min.set(0, 0, 0), this.boundingBox.max.set(0, 0, 0);
            (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) &&
            THREE.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.');
        };
    })(),
    computeBoundingSphere: (function () {
        var a = new THREE.Box3(),
            b = new THREE.Vector3();
        return function () {
            null === this.boundingSphere && (this.boundingSphere = new THREE.Sphere());
            var c = this.attributes.position.array;
            if (c) {
                a.makeEmpty();
                for (var d = this.boundingSphere.center, e = 0, f = c.length; e < f; e += 3) b.set(c[e], c[e + 1], c[e + 2]), a.expandByPoint(b);
                a.center(d);
                var g = 0;
                e = 0;
                for (f = c.length; e < f; e += 3) b.set(c[e], c[e + 1], c[e + 2]), (g = Math.max(g, d.distanceToSquared(b)));
                this.boundingSphere.radius = Math.sqrt(g);
                isNaN(this.boundingSphere.radius) && THREE.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.');
            }
        };
    })(),
    computeVertexNormals: function () {
        var a = this.attributes;
        if (a.position) {
            var b = a.position.array;
            if (void 0 === a.normal) this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(b.length), 3));
            else for (var c = a.normal.array, d = 0, e = c.length; d < e; d++) c[d] = 0;
            c = a.normal.array;
            var f = new THREE.Vector3(),
                g = new THREE.Vector3(),
                h = new THREE.Vector3(),
                l = new THREE.Vector3(),
                m = new THREE.Vector3();
            if (a.index)
                for (var n = a.index.array, p = 0 < this.offsets.length ? this.offsets : [{ start: 0, count: n.length, index: 0 }], r = 0, q = p.length; r < q; ++r) {
                    e = p[r].start;
                    var u = p[r].count;
                    var v = p[r].index;
                    d = e;
                    for (e += u; d < e; d += 3) {
                        u = 3 * (v + n[d]);
                        var w = 3 * (v + n[d + 1]);
                        var y = 3 * (v + n[d + 2]);
                        f.fromArray(b, u);
                        g.fromArray(b, w);
                        h.fromArray(b, y);
                        l.subVectors(h, g);
                        m.subVectors(f, g);
                        l.cross(m);
                        c[u] += l.x;
                        c[u + 1] += l.y;
                        c[u + 2] += l.z;
                        c[w] += l.x;
                        c[w + 1] += l.y;
                        c[w + 2] += l.z;
                        c[y] += l.x;
                        c[y + 1] += l.y;
                        c[y + 2] += l.z;
                    }
                }
            else
                for (d = 0, e = b.length; d < e; d += 9)
                    f.fromArray(b, d),
                        g.fromArray(b, d + 3),
                        h.fromArray(b, d + 6),
                        l.subVectors(h, g),
                        m.subVectors(f, g),
                        l.cross(m),
                        (c[d] = l.x),
                        (c[d + 1] = l.y),
                        (c[d + 2] = l.z),
                        (c[d + 3] = l.x),
                        (c[d + 4] = l.y),
                        (c[d + 5] = l.z),
                        (c[d + 6] = l.x),
                        (c[d + 7] = l.y),
                        (c[d + 8] = l.z);
            this.normalizeNormals();
            a.normal.needsUpdate = !0;
        }
    },
    computeTangents: function () {
        function a(a, b, c) {
            p.fromArray(d, 3 * a);
            r.fromArray(d, 3 * b);
            q.fromArray(d, 3 * c);
            u.fromArray(f, 2 * a);
            v.fromArray(f, 2 * b);
            w.fromArray(f, 2 * c);
            y = r.x - p.x;
            z = q.x - p.x;
            x = r.y - p.y;
            A = q.y - p.y;
            B = r.z - p.z;
            L = q.z - p.z;
            C = v.x - u.x;
            J = w.x - u.x;
            F = v.y - u.y;
            I = w.y - u.y;
            H = 1 / (C * I - J * F);
            M.set((I * y - F * z) * H, (I * x - F * A) * H, (I * B - F * L) * H);
            N.set((C * z - J * y) * H, (C * A - J * x) * H, (C * L - J * B) * H);
            l[a].add(M);
            l[b].add(M);
            l[c].add(M);
            m[a].add(N);
            m[b].add(N);
            m[c].add(N);
        }
        function b(a) {
            Y.fromArray(e, 3 * a);
            O.copy(Y);
            aa = l[a];
            ha.copy(aa);
            ha.sub(Y.multiplyScalar(Y.dot(aa))).normalize();
            fa.crossVectors(O, aa);
            V = fa.dot(m[a]);
            U = 0 > V ? -1 : 1;
            h[4 * a] = ha.x;
            h[4 * a + 1] = ha.y;
            h[4 * a + 2] = ha.z;
            h[4 * a + 3] = U;
        }
        if (void 0 === this.attributes.index || void 0 === this.attributes.position || void 0 === this.attributes.normal || void 0 === this.attributes.uv)
            THREE.warn("THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");
        else {
            var c = this.attributes.index.array,
                d = this.attributes.position.array,
                e = this.attributes.normal.array,
                f = this.attributes.uv.array,
                g = d.length / 3;
            void 0 === this.attributes.tangent && this.addAttribute("tangent", new THREE.BufferAttribute(new Float32Array(4 * g), 4));
            for (var h = this.attributes.tangent.array, l = [], m = [], n = 0; n < g; n++) (l[n] = new THREE.Vector3()), (m[n] = new THREE.Vector3());
            var p = new THREE.Vector3(),
                r = new THREE.Vector3(),
                q = new THREE.Vector3(),
                u = new THREE.Vector2(),
                v = new THREE.Vector2(),
                w = new THREE.Vector2(),
                y,
                z,
                x,
                A,
                B,
                L,
                C,
                J,
                F,
                I,
                H,
                M = new THREE.Vector3(),
                N = new THREE.Vector3(),
                G;
            0 === this.drawcalls.length && this.addDrawCall(0, c.length, 0);
            var D = this.drawcalls;
            n = 0;
            for (G = D.length; n < G; ++n) {
                var E = D[n].start;
                var S = D[n].count;
                var Z = D[n].index;
                g = E;
                for (E += S; g < E; g += 3) {
                    S = Z + c[g];
                    var Q = Z + c[g + 1];
                    var ca = Z + c[g + 2];
                    a(S, Q, ca);
                }
            }
            var ha = new THREE.Vector3(),
                fa = new THREE.Vector3(),
                Y = new THREE.Vector3(),
                O = new THREE.Vector3(),
                U,
                aa,
                V;
            n = 0;
            for (G = D.length; n < G; ++n) for (E = D[n].start, S = D[n].count, Z = D[n].index, g = E, E += S; g < E; g += 3) (S = Z + c[g]), (Q = Z + c[g + 1]), (ca = Z + c[g + 2]), b(S), b(Q), b(ca);
        }
    },
    normalizeNormals: function () {
        for (var a = this.attributes.normal.array, b, c, d, e = 0, f = a.length; e < f; e += 3) (b = a[e]), (c = a[e + 1]), (d = a[e + 2]), (b = 1 / Math.sqrt(b * b + c * c + d * d)), (a[e] *= b), (a[e + 1] *= b), (a[e + 2] *= b);
    },
    clone: function () {
        var a = new THREE.BufferGeometry();
        for (b in this.attributes) a.addAttribute(b, this.attributes[b].clone());
        var b = 0;
        for (var c = this.offsets.length; b < c; b++) {
            var d = this.offsets[b];
            a.offsets.push({ start: d.start, index: d.index, count: d.count });
        }
        return a;
    },
    dispose: function () {
        this.dispatchEvent({ type: "dispose" });
    },
};
THREE.EventDispatcher.prototype.apply(THREE.BufferGeometry.prototype);
THREE.Camera = function () {
    THREE.Object3D.call(this);
    this.matrixWorldInverse = new THREE.Matrix4();
    this.projectionMatrix = new THREE.Matrix4();
};
THREE.Camera.prototype = Object.create(THREE.Object3D.prototype);
THREE.Camera.prototype.constructor = THREE.Camera;
THREE.Camera.prototype.getWorldDirection = (function () {
    var a = new THREE.Quaternion();
    return function (b) {
        b = b || new THREE.Vector3();
        this.getWorldQuaternion(a);
        return b.set(0, 0, -1).applyQuaternion(a);
    };
})();
THREE.Camera.prototype.lookAt = (function () {
    var a = new THREE.Matrix4();
    return function (b) {
        a.lookAt(this.position, b, this.up);
        this.quaternion.setFromRotationMatrix(a);
    };
})();
THREE.Camera.prototype.clone = function (a) {
    void 0 === a && (a = new THREE.Camera());
    THREE.Object3D.prototype.clone.call(this, a);
    a.matrixWorldInverse.copy(this.matrixWorldInverse);
    a.projectionMatrix.copy(this.projectionMatrix);
    return a;
};
THREE.PerspectiveCamera = function (a, b, c, d) {
    THREE.Camera.call(this);
    this.zoom = 1;
    this.fov = void 0 !== a ? a : 50;
    this.aspect = void 0 !== b ? b : 1;
    this.near = void 0 !== c ? c : 0.1;
    this.far = void 0 !== d ? d : 2e3;
    this.updateProjectionMatrix();
};
THREE.PerspectiveCamera.prototype = Object.create(THREE.Camera.prototype);
THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;
THREE.PerspectiveCamera.prototype.setLens = function (a, b) {
    void 0 === b && (b = 24);
    this.fov = 2 * THREE.Math.radToDeg(Math.atan(b / (2 * a)));
    this.updateProjectionMatrix();
};
THREE.PerspectiveCamera.prototype.setViewOffset = function (a, b, c, d, e, f) {
    this.fullWidth = a;
    this.fullHeight = b;
    this.x = c;
    this.y = d;
    this.width = e;
    this.height = f;
    this.updateProjectionMatrix();
};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {
    var a = THREE.Math.radToDeg(2 * Math.atan(Math.tan(0.5 * THREE.Math.degToRad(this.fov)) / this.zoom));
    if (this.fullWidth) {
        var b = this.fullWidth / this.fullHeight;
        a = Math.tan(THREE.Math.degToRad(0.5 * a)) * this.near;
        var c = -a,
            d = b * c;
        b = Math.abs(b * a - d);
        c = Math.abs(a - c);
        this.projectionMatrix.makeFrustum(d + (this.x * b) / this.fullWidth, d + ((this.x + this.width) * b) / this.fullWidth, a - ((this.y + this.height) * c) / this.fullHeight, a - (this.y * c) / this.fullHeight, this.near, this.far);
    } else this.projectionMatrix.makePerspective(a, this.aspect, this.near, this.far);
};
THREE.PerspectiveCamera.prototype.clone = function () {
    var a = new THREE.PerspectiveCamera();
    THREE.Camera.prototype.clone.call(this, a);
    a.zoom = this.zoom;
    a.fov = this.fov;
    a.aspect = this.aspect;
    a.near = this.near;
    a.far = this.far;
    a.projectionMatrix.copy(this.projectionMatrix);
    return a;
};
THREE.OrthographicCamera = function (a, b, c, d, e, f) {
    THREE.Camera.call(this);
    this.zoom = 1;
    this.left = a;
    this.right = b;
    this.top = c;
    this.bottom = d;
    this.near = void 0 !== e ? e : 0.1;
    this.far = void 0 !== f ? f : 2e3;
    this.updateProjectionMatrix();
};
THREE.OrthographicCamera.prototype = Object.create(THREE.Camera.prototype);
THREE.OrthographicCamera.prototype.constructor = THREE.OrthographicCamera;
THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {
    var a = (this.right - this.left) / (2 * this.zoom),
        b = (this.top - this.bottom) / (2 * this.zoom),
        c = (this.right + this.left) / 2,
        d = (this.top + this.bottom) / 2;
    this.projectionMatrix.makeOrthographic(c - a, c + a, d + b, d - b, this.near, this.far);
};
THREE.OrthographicCamera.prototype.clone = function () {
    var a = new THREE.OrthographicCamera();
    THREE.Camera.prototype.clone.call(this, a);
    a.zoom = this.zoom;
    a.left = this.left;
    a.right = this.right;
    a.top = this.top;
    a.bottom = this.bottom;
    a.near = this.near;
    a.far = this.far;
    a.projectionMatrix.copy(this.projectionMatrix);
    return a;
};
THREE.Mesh = function (a, b) {
    THREE.Object3D.call(this);
    this.geometry = void 0 !== a ? a : new THREE.Geometry();
    this.material = void 0 !== b ? b : new THREE.MeshBasicMaterial({ color: 16777215 * Math.random() });
    this.updateMorphTargets();
};
THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype);
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.updateMorphTargets = function () {
    if (void 0 !== this.geometry.morphTargets && 0 < this.geometry.morphTargets.length) {
        this.morphTargetBase = -1;
        this.morphTargetForcedOrder = [];
        this.morphTargetInfluences = [];
        this.morphTargetDictionary = {};
        for (var a = 0, b = this.geometry.morphTargets.length; a < b; a++) this.morphTargetInfluences.push(0), (this.morphTargetDictionary[this.geometry.morphTargets[a].name] = a);
    }
};
THREE.Mesh.prototype.getMorphTargetIndexByName = function (a) {
    if (void 0 !== this.morphTargetDictionary[a]) return this.morphTargetDictionary[a];
    THREE.warn("THREE.Mesh.getMorphTargetIndexByName: morph target " + a + " does not exist. Returning 0.");
    return 0;
};
THREE.Mesh.prototype.clone = function (a, b) {
    void 0 === a && (a = new THREE.Mesh(this.geometry, this.material));
    THREE.Object3D.prototype.clone.call(this, a, b);
    return a;
};
THREE.Scene = function () {
    THREE.Object3D.call(this);
    this.overrideMaterial = null;
    this.autoUpdate = !0;
};
THREE.Scene.prototype = Object.create(THREE.Object3D.prototype);
THREE.Scene.prototype.constructor = THREE.Scene;
THREE.Scene.prototype.clone = function (a) {
    void 0 === a && (a = new THREE.Scene());
    THREE.Object3D.prototype.clone.call(this, a);
    null !== this.overrideMaterial && (a.overrideMaterial = this.overrideMaterial.clone());
    a.autoUpdate = this.autoUpdate;
    a.matrixAutoUpdate = this.matrixAutoUpdate;
    return a;
};
THREE.UniformsUtils = {
    merge: function (a) {
        for (var b = {}, c = 0; c < a.length; c++) {
            var d = this.clone(a[c]),
                e;
            for (e in d) b[e] = d[e];
        }
        return b;
    },
    clone: function (a) {
        var b = {},
            c;
        for (c in a) {
            b[c] = {};
            for (var d in a[c]) {
                var e = a[c][d];
                b[c][d] = e && void 0 !== e.clone ? e.clone() : e instanceof Array ? e.slice() : e;
            }
        }
        return b;
    },
};

THREE.PlaneBufferGeometry = function (a, b, c, d) {
    THREE.BufferGeometry.call(this);
    this.type = "PlaneBufferGeometry";
    this.parameters = { width: a, height: b, widthSegments: c, heightSegments: d };
    var e = a / 2,
        f = b / 2;
    c = c || 1;
    d = d || 1;
    var g = c + 1,
        h = d + 1,
        l = a / c,
        m = b / d;
    b = new Float32Array(g * h * 3);
    a = new Float32Array(g * h * 3);
    for (var n = new Float32Array(g * h * 2), p = 0, r = 0, q = 0; q < h; q++) for (var u = q * m - f, v = 0; v < g; v++) (b[p] = v * l - e), (b[p + 1] = -u), (a[p + 2] = 1), (n[r] = v / c), (n[r + 1] = 1 - q / d), (p += 3), (r += 2);
    p = 0;
    e = new (65535 < b.length / 3 ? Uint32Array : Uint16Array)(c * d * 6);
    for (q = 0; q < d; q++) for (v = 0; v < c; v++) (f = v + g * (q + 1)), (h = v + 1 + g * (q + 1)), (l = v + 1 + g * q), (e[p] = v + g * q), (e[p + 1] = f), (e[p + 2] = l), (e[p + 3] = f), (e[p + 4] = h), (e[p + 5] = l), (p += 6);
    this.addAttribute("index", new THREE.BufferAttribute(e, 1));
    this.addAttribute("position", new THREE.BufferAttribute(b, 3));
    this.addAttribute("normal", new THREE.BufferAttribute(a, 3));
    this.addAttribute("uv", new THREE.BufferAttribute(n, 2));
};
THREE.PlaneBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry;