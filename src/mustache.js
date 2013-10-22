// Generated by CoffeeScript 1.6.3
(function() {
  var Writer, attrs, expand, indentation, pattern, render, short, single_tags,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  single_tags = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

  pattern = function(name) {
    if (name.match(/^\w/)) {
      return "element";
    } else if (name.match(/^\:/)) {
      return "attribute";
    } else if (name.match(/^\#/)) {
      return "section";
    } else if (name.match(/^\^/)) {
      return "inverted";
    } else if (name.match(/^\!/)) {
      return "comment";
    } else if (name.match(/^\=/)) {
      return "content";
    } else if (name.match(/^\>/)) {
      return "partial";
    }
  };

  short = function(name) {
    return name.slice(1);
  };

  expand = function(head, tag) {
    var classes, ids, name;
    name = head.match(/^[\w-]+/);
    classes = head.match(/\.[\w-]+/g);
    ids = head.match(/\#[\w-]+/g);
    tag.name = name[0];
    if (classes != null) {
      tag.attribute["class"].push(classes.map(short));
    }
    if (ids != null) {
      return tag.attribute.id.push(ids.map(short));
    }
  };

  attrs = function(tag) {
    var buffer, key, value, _ref;
    buffer = [];
    _ref = tag.attribute;
    for (key in _ref) {
      value = _ref[key];
      if (value.length > 0) {
        if ((typeof value) === "string") {
          buffer.push("" + key + "=\"" + value + "\"");
        } else {
          buffer.push("" + key + "=\"" + (value.join(" ")) + "\"");
        }
      }
    }
    buffer = buffer.join(" ").trim();
    if (buffer.length > 0) {
      buffer = " " + buffer;
    }
    return buffer;
  };

  indentation = function(indent) {
    var buffer;
    buffer = "";
    while (indent > 0) {
      indent -= 1;
      buffer += "  ";
    }
    return buffer;
  };

  Writer = (function() {
    function Writer() {
      this.buffer = "";
    }

    Writer.prototype.line = function(indent, text) {
      return this.buffer += "\n" + (indentation(indent)) + text;
    };

    Writer.prototype.renderTag = function(indent, exps) {
      var body, tag, _ref,
        _this = this;
      tag = {
        attribute: {
          id: [],
          "class": []
        }
      };
      expand(exps[0], tag);
      body = [];
      exps.slice(1).map(function(line) {
        var target;
        if ((pattern(line[0])) === "attribute") {
          target = tag.attribute[short(line[0])];
          if (target != null) {
            return target.push.apply(target, line.slice(1));
          } else {
            return tag.attribute[short(line[0])] = line.slice(1);
          }
        } else {
          return body.push(line);
        }
      });
      if (_ref = tag.name, __indexOf.call(single_tags, _ref) >= 0) {
        return this.line(indent, "<" + tag.name + (attrs(tag)) + " />");
      } else {
        this.line(indent, "<" + tag.name + (attrs(tag)) + ">");
        this.renderBlock(indent, body);
        return this.line(indent, "</" + tag.name + ">");
      }
    };

    Writer.prototype.renderBlock = function(indent, exps) {
      var _this = this;
      return exps.map(function(line) {
        var head;
        if ((typeof line) === "string") {
          return _this.line(indent + 1, line);
        } else {
          head = line[0];
          switch (pattern(head)) {
            case "element":
              return _this.renderTag(indent + 1, line);
            case "section":
              return _this.renderSection(indent + 1, line);
            case "inverted":
              return _this.renderInverted(indent + 1, line);
            case "content":
              return _this.renderContent(indent + 1, line);
            case "partial":
              return _this.renderPartial(indent + 1, line);
          }
        }
      });
    };

    Writer.prototype.renderSection = function(indent, section) {
      var head;
      head = section[0];
      this.line(indent, "{{#" + (short(head)) + "}}");
      this.renderBlock(indent, section.slice(1));
      return this.line(indent, "{{/" + (short(head)) + "}}");
    };

    Writer.prototype.renderInverted = function(indent, section) {
      var head;
      head = section[0];
      this.line(indent, "{{^" + (short(head)) + "}}");
      this.renderBlock(indent, section.slice(1));
      return this.line(indent, "{{/" + (short(head)) + "}}");
    };

    Writer.prototype.renderPartial = function(indent, line) {
      var head;
      head = line[0];
      return this.line(indent, "{{> " + (short(head)) + "}}");
    };

    Writer.prototype.renderContent = function(indent, line) {
      var words;
      words = line.slice(1).join(" ");
      return this.line(indent, words);
    };

    Writer.prototype.render = function(exps) {
      this.renderBlock(-1, exps);
      return this.buffer;
    };

    return Writer;

  })();

  render = function(tree) {
    return (new Writer).render(tree);
  };

  if (typeof define !== "undefined" && define !== null) {
    define({
      render: render
    });
  } else if (typeof exports !== "undefined" && exports !== null) {
    exports.render = render;
  }

}).call(this);

/*
//@ sourceMappingURL=mustache.map
*/
