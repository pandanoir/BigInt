// Generated by CoffeeScript 1.9.1
(function() {
  var BigInt, CHUNK_SIZE, EQ, GT, LT, MINUS, PLUS, VERSION;

  VERSION = 6;

  PLUS = 0;

  MINUS = 1;

  GT = 1;

  EQ = 0;

  LT = -1;

  CHUNK_SIZE = 10000;

  console.log('[ver]' + VERSION);

  BigInt = (function() {
    function BigInt(n) {
      var m;
      if (n instanceof BigInt) {
        this.sign = n.sign;
        this.chunks = n.chunks.concat();
        return;
      }
      if (typeof n !== 'number') {
        this.chunks = n.concat();
        this.sign = PLUS;
        return;
      }
      this.chunks = [];
      this.sign = PLUS;
      m = n;
      if (n < 0) {
        this.sign = MINUS;
        m *= -1;
      }
      if (m === 0) {
        this.chunks = [0];
      } else {
        while (m > 0) {
          this.chunks.push(m % CHUNK_SIZE);
          m = 0 | (m / CHUNK_SIZE);
          this.chunks.reverse();
        }
      }
    }

    BigInt.prototype.toString = function() {
      if (this.chunks.length === 1) {
        return (this.sign === MINUS ? '-' : '') + this.chunks[0];
      }
      return (this.sign === MINUS ? '-' : '') + this.chunks[0] + this.chunks.slice(1).map(function(s) {
        return ('0000' + s).slice(-4);
      }).join('');
    };

    BigInt.prototype.abs = function() {
      var res;
      res = new BigInt(this);
      res.sign = PLUS;
      return res;
    };

    BigInt.prototype.add = function(_a) {
      var _res, a, b, carry, i, res;
      if (_a.abs().compare(this.abs()) === LT) {
        a = new BigInt(this);
        b = new BigInt(_a);
      } else {
        a = new BigInt(_a);
        b = new BigInt(this);
      }
      res = [];
      carry = 0;
      while (a.chunks.length > 0) {
        _res = a.chunks.pop();
        _res += carry;
        carry = 0;
        if (b.chunks.length !== 0) {
          if (a.sign !== b.sign) {
            _res -= b.chunks.pop();
          } else {
            _res += b.chunks.pop();
          }
        }
        res.push((_res < 0 ? CHUNK_SIZE + _res : _res) % CHUNK_SIZE);
        if (_res >= CHUNK_SIZE) {
          carry = 1;
        } else if (_res < 0) {
          carry = -1;
        }
      }
      if (carry !== 0) {
        res.push(carry);
      }
      res.reverse();
      i = 0;
      while (res[i] === 0) {
        i++;
      }
      if (i === res.length) {
        i -= 1;
      }
      res = res.slice(i);
      res = new BigInt(res);
      res.sign = a.sign;
      if (res.abs().compare(new BigInt(0)) === EQ) {
        res.sign = PLUS;
      }
      return res;
    };

    BigInt.prototype.compare = function(_a) {
      var _, a, b, i, k, len, ref;
      a = _a;
      b = this;
      if (a.sign !== b.sign) {
        if (b.sign === PLUS) {
          return GT;
        } else {
          return LT;
        }
      }
      if (a.chunks.length !== b.chunks.length) {
        if (b.chunks.length > a.chunks.length) {
          return GT;
        } else {
          return LT;
        }
      }
      ref = a.chunks;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        _ = ref[i];
        if (b.chunks[i] > a.chunks[i]) {
          return GT;
        }
        if (b.chunks[i] < a.chunks[i]) {
          return LT;
        }
      }
      return EQ;
    };

    BigInt.prototype.minus = function(_a) {
      var a;
      a = new BigInt(_a);
      return this.add(a.mult(-1));
    };

    BigInt.prototype.mult = function(_a) {
      var _, a, a_chunk, b, b_chunk, carry, i, j, k, l, len, len1, len2, o, p, ref, ref1, res, res_chunk, res_chunks;
      a = new BigInt(_a);
      b = new BigInt(this);
      carry = 0;
      res_chunks = new Array(a.chunks.length + b.chunks.length - 1);
      for (i = k = 0, len = res_chunks.length; k < len; i = ++k) {
        _ = res_chunks[i];
        res_chunks[i] = 0;
      }
      if (a.abs().compare(b.abs()) === LT) {
        a = new BigInt(this);
        b = new BigInt(_a);
      }
      ref = a.chunks;
      for (i = l = 0, len1 = ref.length; l < len1; i = ++l) {
        a_chunk = ref[i];
        ref1 = b.chunks;
        for (j = o = 0, len2 = ref1.length; o < len2; j = ++o) {
          b_chunk = ref1[j];
          if (!res_chunks[i + j + 1]) {
            res_chunks[i + j + 1] = 0;
          }
          res_chunks[i + j + 1] += a_chunk * b_chunk;
        }
      }
      for (i = p = res_chunks.length - 1; p >= 0; i = p += -1) {
        res_chunk = res_chunks[i];
        if (res_chunk >= CHUNK_SIZE) {
          res_chunks[i] = res_chunk % CHUNK_SIZE;
          res_chunks[i - 1] += 0 | res_chunk / CHUNK_SIZE;
        }
      }
      if (!res_chunks[0]) {
        res_chunks.shift();
      }
      res = new BigInt(res_chunks);
      if (a.sign !== b.sign) {
        res.sign = MINUS;
      }
      return res;
    };

    BigInt.prototype.pow = function(n) {
      if (n === 0) {
        return new BigInt(1);
      }
      if (n === 1) {
        return this;
      }
      if (n % 2 === 0) {
        return this.mult(this).pow(n / 2);
      } else {
        return this.mult(this).pow((n - 1) / 2).mult(this);
      }
    };

    return BigInt;

  })();

  module.exports = {
    BigInt: BigInt,
    VERSION: VERSION,
    PLUS: PLUS,
    MINUS: MINUS,
    GT: GT,
    EQ: EQ,
    LT: LT,
    CHUNK_SIZE: CHUNK_SIZE
  };

}).call(this);
