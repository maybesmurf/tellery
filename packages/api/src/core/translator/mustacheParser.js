/* eslint-disable */ 
/*
==========================
Simple Tellery SQL prammar
==========================
generated on https://pegjs.org/online
==========================
Accepts expressions 
start
blockId(start=start,end='2021-22')
blockId(start=start,end=end)
blockId(name=name) as $alias
==========================
Start
  = Expression

Expression
  = _ name:Word _ params:Params? _ alias:("as" _ alias:Word)? _ {
      return {
        name: name,
        params: params,
        alias: alias?.[2]
      };
    }

Params
  = "(" _ pairs:(Param _ ","? _ )+ _ ")" { 
      return pairs.reduce((acc,c) => {
        const param = c[0]
        acc[param.key] = param.value
        return acc
      },{}); 
    }

Param
  = _ left:Word _ "=" _ right:String _ { return {key: left, value: right};}
  /  _ left:Word _ "=" _ right:Word _ { return {key: left, value: right};}

String "string"
  = "\"" sentence:([^\"]+) "\"" { return "\"" + sentence.join('') + "\"";}
  / "\'" sentence:([^\']+) "\'" { return "\"" + sentence.join('') + "\"";}

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

Word "word"
  = _ expr:([a-z|A-Z|0-9|]+) { return expr.join(""); }

_ "whitespace"
  = [ \t\n\r]*

*/

function peg$subclass(child, parent) {
  function ctor() {
    this.constructor = child
  }
  ctor.prototype = parent.prototype
  child.prototype = new ctor()
}

function peg$SyntaxError(message, expected, found, location) {
  this.message = message
  this.expected = expected
  this.found = found
  this.location = location
  this.name = 'SyntaxError'

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, peg$SyntaxError)
  }
}

peg$subclass(peg$SyntaxError, Error)

peg$SyntaxError.buildMessage = function (expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function (expectation) {
      return '"' + literalEscape(expectation.text) + '"'
    },

    class: function (expectation) {
      var escapedParts = '',
        i

      for (i = 0; i < expectation.parts.length; i++) {
        escapedParts +=
          expectation.parts[i] instanceof Array
            ? classEscape(expectation.parts[i][0]) + '-' + classEscape(expectation.parts[i][1])
            : classEscape(expectation.parts[i])
      }

      return '[' + (expectation.inverted ? '^' : '') + escapedParts + ']'
    },

    any: function (expectation) {
      return 'any character'
    },

    end: function (expectation) {
      return 'end of input'
    },

    other: function (expectation) {
      return expectation.description
    },
  }

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase()
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, function (ch) {
        return '\\x0' + hex(ch)
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
        return '\\x' + hex(ch)
      })
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g, '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, function (ch) {
        return '\\x0' + hex(ch)
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
        return '\\x' + hex(ch)
      })
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation)
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
      i,
      j

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i])
    }

    descriptions.sort()

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i]
          j++
        }
      }
      descriptions.length = j
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0]

      case 2:
        return descriptions[0] + ' or ' + descriptions[1]

      default:
        return (
          descriptions.slice(0, -1).join(', ') + ', or ' + descriptions[descriptions.length - 1]
        )
    }
  }

  function describeFound(found) {
    return found ? '"' + literalEscape(found) + '"' : 'end of input'
  }

  return 'Expected ' + describeExpected(expected) + ' but ' + describeFound(found) + ' found.'
}

function peg$parse(input, options) {
  options = options !== void 0 ? options : {}

  var peg$FAILED = {},
    peg$startRuleFunctions = { Start: peg$parseStart },
    peg$startRuleFunction = peg$parseStart,
    peg$c0 = 'as',
    peg$c1 = peg$literalExpectation('as', false),
    peg$c2 = function (name, params, alias) {
      return {
        name: name,
        params: params,
        alias: alias?.[2],
      }
    },
    peg$c3 = '(',
    peg$c4 = peg$literalExpectation('(', false),
    peg$c5 = ',',
    peg$c6 = peg$literalExpectation(',', false),
    peg$c7 = ')',
    peg$c8 = peg$literalExpectation(')', false),
    peg$c9 = function (pairs) {
      return pairs.reduce((acc, c) => {
        const param = c[0]
        acc[param.key] = param.value
        return acc
      }, {})
    },
    peg$c10 = '=',
    peg$c11 = peg$literalExpectation('=', false),
    peg$c12 = function (left, right) {
      return { key: left, value: right }
    },
    peg$c13 = peg$otherExpectation('string'),
    peg$c14 = '"',
    peg$c15 = peg$literalExpectation('"', false),
    peg$c16 = /^[^"]/,
    peg$c17 = peg$classExpectation(['"'], true, false),
    peg$c18 = function (sentence) {
      return '"' + sentence.join('') + '"'
    },
    peg$c19 = "'",
    peg$c20 = peg$literalExpectation("'", false),
    peg$c21 = /^[^']/,
    peg$c22 = peg$classExpectation(["'"], true, false),
    peg$c23 = peg$otherExpectation('integer'),
    peg$c24 = /^[0-9]/,
    peg$c25 = peg$classExpectation([['0', '9']], false, false),
    peg$c26 = function () {
      return parseInt(text(), 10)
    },
    peg$c27 = peg$otherExpectation('word'),
    peg$c28 = /^[a-z|A-Z|0-9|]/,
    peg$c29 = peg$classExpectation(
      [['a', 'z'], '|', ['A', 'Z'], '|', ['0', '9'], '|'],
      false,
      false,
    ),
    peg$c30 = function (expr) {
      return expr.join('')
    },
    peg$c31 = peg$otherExpectation('whitespace'),
    peg$c32 = /^[ \t\n\r]/,
    peg$c33 = peg$classExpectation([' ', '\t', '\n', '\r'], false, false),
    peg$currPos = 0,
    peg$savedPos = 0,
    peg$posDetailsCache = [{ line: 1, column: 1 }],
    peg$maxFailPos = 0,
    peg$maxFailExpected = [],
    peg$silentFails = 0,
    peg$result

  if ('startRule' in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error('Can\'t start parsing from rule "' + options.startRule + '".')
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule]
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos)
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos)
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location,
    )
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location)
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: 'literal', text: text, ignoreCase: ignoreCase }
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: 'class', parts: parts, inverted: inverted, ignoreCase: ignoreCase }
  }

  function peg$anyExpectation() {
    return { type: 'any' }
  }

  function peg$endExpectation() {
    return { type: 'end' }
  }

  function peg$otherExpectation(description) {
    return { type: 'other', description: description }
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos],
      p

    if (details) {
      return details
    } else {
      p = pos - 1
      while (!peg$posDetailsCache[p]) {
        p--
      }

      details = peg$posDetailsCache[p]
      details = {
        line: details.line,
        column: details.column,
      }

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++
          details.column = 1
        } else {
          details.column++
        }

        p++
      }

      peg$posDetailsCache[pos] = details
      return details
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
      endPosDetails = peg$computePosDetails(endPos)

    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column,
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column,
      },
    }
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return
    }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos
      peg$maxFailExpected = []
    }

    peg$maxFailExpected.push(expected)
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location)
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location,
    )
  }

  function peg$parseStart() {
    var s0

    s0 = peg$parseExpression()

    return s0
  }

  function peg$parseExpression() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9

    s0 = peg$currPos
    s1 = peg$parse_()
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWord()
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_()
        if (s3 !== peg$FAILED) {
          s4 = peg$parseParams()
          if (s4 === peg$FAILED) {
            s4 = null
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_()
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos
              if (input.substr(peg$currPos, 2) === peg$c0) {
                s7 = peg$c0
                peg$currPos += 2
              } else {
                s7 = peg$FAILED
                if (peg$silentFails === 0) {
                  peg$fail(peg$c1)
                }
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parse_()
                if (s8 !== peg$FAILED) {
                  s9 = peg$parseWord()
                  if (s9 !== peg$FAILED) {
                    s7 = [s7, s8, s9]
                    s6 = s7
                  } else {
                    peg$currPos = s6
                    s6 = peg$FAILED
                  }
                } else {
                  peg$currPos = s6
                  s6 = peg$FAILED
                }
              } else {
                peg$currPos = s6
                s6 = peg$FAILED
              }
              if (s6 === peg$FAILED) {
                s6 = null
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_()
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0
                  s1 = peg$c2(s2, s4, s6)
                  s0 = s1
                } else {
                  peg$currPos = s0
                  s0 = peg$FAILED
                }
              } else {
                peg$currPos = s0
                s0 = peg$FAILED
              }
            } else {
              peg$currPos = s0
              s0 = peg$FAILED
            }
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    } else {
      peg$currPos = s0
      s0 = peg$FAILED
    }

    return s0
  }

  function peg$parseParams() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8

    s0 = peg$currPos
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c3
      peg$currPos++
    } else {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c4)
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_()
      if (s2 !== peg$FAILED) {
        s3 = []
        s4 = peg$currPos
        s5 = peg$parseParam()
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_()
          if (s6 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s7 = peg$c5
              peg$currPos++
            } else {
              s7 = peg$FAILED
              if (peg$silentFails === 0) {
                peg$fail(peg$c6)
              }
            }
            if (s7 === peg$FAILED) {
              s7 = null
            }
            if (s7 !== peg$FAILED) {
              s8 = peg$parse_()
              if (s8 !== peg$FAILED) {
                s5 = [s5, s6, s7, s8]
                s4 = s5
              } else {
                peg$currPos = s4
                s4 = peg$FAILED
              }
            } else {
              peg$currPos = s4
              s4 = peg$FAILED
            }
          } else {
            peg$currPos = s4
            s4 = peg$FAILED
          }
        } else {
          peg$currPos = s4
          s4 = peg$FAILED
        }
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4)
            s4 = peg$currPos
            s5 = peg$parseParam()
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_()
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s7 = peg$c5
                  peg$currPos++
                } else {
                  s7 = peg$FAILED
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c6)
                  }
                }
                if (s7 === peg$FAILED) {
                  s7 = null
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_()
                  if (s8 !== peg$FAILED) {
                    s5 = [s5, s6, s7, s8]
                    s4 = s5
                  } else {
                    peg$currPos = s4
                    s4 = peg$FAILED
                  }
                } else {
                  peg$currPos = s4
                  s4 = peg$FAILED
                }
              } else {
                peg$currPos = s4
                s4 = peg$FAILED
              }
            } else {
              peg$currPos = s4
              s4 = peg$FAILED
            }
          }
        } else {
          s3 = peg$FAILED
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_()
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s5 = peg$c7
              peg$currPos++
            } else {
              s5 = peg$FAILED
              if (peg$silentFails === 0) {
                peg$fail(peg$c8)
              }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0
              s1 = peg$c9(s3)
              s0 = s1
            } else {
              peg$currPos = s0
              s0 = peg$FAILED
            }
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    } else {
      peg$currPos = s0
      s0 = peg$FAILED
    }

    return s0
  }

  function peg$parseParam() {
    var s0, s1, s2, s3, s4, s5, s6, s7

    s0 = peg$currPos
    s1 = peg$parse_()
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWord()
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_()
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s4 = peg$c10
            peg$currPos++
          } else {
            s4 = peg$FAILED
            if (peg$silentFails === 0) {
              peg$fail(peg$c11)
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_()
            if (s5 !== peg$FAILED) {
              s6 = peg$parseString()
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_()
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0
                  s1 = peg$c12(s2, s6)
                  s0 = s1
                } else {
                  peg$currPos = s0
                  s0 = peg$FAILED
                }
              } else {
                peg$currPos = s0
                s0 = peg$FAILED
              }
            } else {
              peg$currPos = s0
              s0 = peg$FAILED
            }
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    } else {
      peg$currPos = s0
      s0 = peg$FAILED
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos
      s1 = peg$parse_()
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWord()
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_()
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s4 = peg$c10
              peg$currPos++
            } else {
              s4 = peg$FAILED
              if (peg$silentFails === 0) {
                peg$fail(peg$c11)
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_()
              if (s5 !== peg$FAILED) {
                s6 = peg$parseWord()
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_()
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0
                    s1 = peg$c12(s2, s6)
                    s0 = s1
                  } else {
                    peg$currPos = s0
                    s0 = peg$FAILED
                  }
                } else {
                  peg$currPos = s0
                  s0 = peg$FAILED
                }
              } else {
                peg$currPos = s0
                s0 = peg$FAILED
              }
            } else {
              peg$currPos = s0
              s0 = peg$FAILED
            }
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    }

    return s0
  }

  function peg$parseString() {
    var s0, s1, s2, s3

    peg$silentFails++
    s0 = peg$currPos
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c14
      peg$currPos++
    } else {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c15)
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = []
      if (peg$c16.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos)
        peg$currPos++
      } else {
        s3 = peg$FAILED
        if (peg$silentFails === 0) {
          peg$fail(peg$c17)
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3)
          if (peg$c16.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos)
            peg$currPos++
          } else {
            s3 = peg$FAILED
            if (peg$silentFails === 0) {
              peg$fail(peg$c17)
            }
          }
        }
      } else {
        s2 = peg$FAILED
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s3 = peg$c14
          peg$currPos++
        } else {
          s3 = peg$FAILED
          if (peg$silentFails === 0) {
            peg$fail(peg$c15)
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0
          s1 = peg$c18(s2)
          s0 = s1
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    } else {
      peg$currPos = s0
      s0 = peg$FAILED
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c19
        peg$currPos++
      } else {
        s1 = peg$FAILED
        if (peg$silentFails === 0) {
          peg$fail(peg$c20)
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = []
        if (peg$c21.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos)
          peg$currPos++
        } else {
          s3 = peg$FAILED
          if (peg$silentFails === 0) {
            peg$fail(peg$c22)
          }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3)
            if (peg$c21.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos)
              peg$currPos++
            } else {
              s3 = peg$FAILED
              if (peg$silentFails === 0) {
                peg$fail(peg$c22)
              }
            }
          }
        } else {
          s2 = peg$FAILED
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c19
            peg$currPos++
          } else {
            s3 = peg$FAILED
            if (peg$silentFails === 0) {
              peg$fail(peg$c20)
            }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0
            s1 = peg$c18(s2)
            s0 = s1
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    }
    peg$silentFails--
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c13)
      }
    }

    return s0
  }

  function peg$parseInteger() {
    var s0, s1, s2, s3

    peg$silentFails++
    s0 = peg$currPos
    s1 = peg$parse_()
    if (s1 !== peg$FAILED) {
      s2 = []
      if (peg$c24.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos)
        peg$currPos++
      } else {
        s3 = peg$FAILED
        if (peg$silentFails === 0) {
          peg$fail(peg$c25)
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3)
          if (peg$c24.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos)
            peg$currPos++
          } else {
            s3 = peg$FAILED
            if (peg$silentFails === 0) {
              peg$fail(peg$c25)
            }
          }
        }
      } else {
        s2 = peg$FAILED
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0
        s1 = peg$c26()
        s0 = s1
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    } else {
      peg$currPos = s0
      s0 = peg$FAILED
    }
    peg$silentFails--
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c23)
      }
    }

    return s0
  }

  function peg$parseWord() {
    var s0, s1, s2, s3

    peg$silentFails++
    s0 = peg$currPos
    s1 = peg$parse_()
    if (s1 !== peg$FAILED) {
      s2 = []
      if (peg$c28.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos)
        peg$currPos++
      } else {
        s3 = peg$FAILED
        if (peg$silentFails === 0) {
          peg$fail(peg$c29)
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3)
          if (peg$c28.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos)
            peg$currPos++
          } else {
            s3 = peg$FAILED
            if (peg$silentFails === 0) {
              peg$fail(peg$c29)
            }
          }
        }
      } else {
        s2 = peg$FAILED
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0
        s1 = peg$c30(s2)
        s0 = s1
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
    } else {
      peg$currPos = s0
      s0 = peg$FAILED
    }
    peg$silentFails--
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c27)
      }
    }

    return s0
  }

  function peg$parse_() {
    var s0, s1

    peg$silentFails++
    s0 = []
    if (peg$c32.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos)
      peg$currPos++
    } else {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c33)
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1)
      if (peg$c32.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos)
        peg$currPos++
      } else {
        s1 = peg$FAILED
        if (peg$silentFails === 0) {
          peg$fail(peg$c33)
        }
      }
    }
    peg$silentFails--
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED
      if (peg$silentFails === 0) {
        peg$fail(peg$c31)
      }
    }

    return s0
  }

  peg$result = peg$startRuleFunction()

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation())
    }

    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos),
    )
  }
}

export default {
  SyntaxError: peg$SyntaxError,
  parse: peg$parse,
}
