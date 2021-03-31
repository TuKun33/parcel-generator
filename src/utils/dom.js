
export const ele = elAttr => {
   return document.querySelector(elAttr)
}

/* istanbul ignore next */
export const on = (function () {
   if (document.addEventListener) {
      return function (element, event, handler) {
         if (element && event && handler) {
            element.addEventListener(event, handler, false);
         }
      };
   } else {
      return function (element, event, handler) {
         if (element && event && handler) {
            element.attachEvent('on' + event, handler);
         }
      };
   }
})();

/* istanbul ignore next */
export const off = (function () {
   if (document.removeEventListener) {
      return function (element, event, handler) {
         if (element && event) {
            element.removeEventListener(event, handler, false);
         }
      };
   } else {
      return function (element, event, handler) {
         if (element && event) {
            element.detachEvent('on' + event, handler);
         }
      };
   }
})();

/* istanbul ignore next */
export const once = function (el, event, fn) {
   var listener = function () {
      if (fn) {
         fn.apply(this, arguments);
      }
      off(el, event, listener);
   };
   on(el, event, listener);
};


/* istanbul ignore next */
export function hasClass(el, cls) {
   if (!el || !cls) return false;
   if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
   if (el.classList) {
      return el.classList.contains(cls);
   } else {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
   }
};

/* istanbul ignore next */
export function addClass(el, cls) {
   if (!el) return;
   var curClass = el.className;
   var classes = (cls || '').split(' ');

   for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
         el.classList.add(clsName);
      } else {
         if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
         }
      }
   }
   if (!el.classList) {
      el.className = curClass;
   }
};

/* istanbul ignore next */
export function removeClass(el, cls) {
   if (!el || !cls) return;
   var classes = cls.split(' ');
   var curClass = ' ' + el.className + ' ';

   for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
         el.classList.remove(clsName);
      } else {
         if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
         }
      }
   }
   if (!el.classList) {
      el.className = trim(curClass);
   }
};

// get rect
export function getRect (element) {
  var rect = element.getBoundingClientRect();
  var top = document.documentElement.clientTop || 0;
  var left= document.documentElement.clientLeft || 0
  return {
    top    :   rect.top - top,
    bottom :   rect.bottom - top,
    left   :   rect.left - left,
    right  :   rect.right - left
  }
}

// in viewport
export function inViewport(element) {
  var rect = getRect(element)
  var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= winHeight &&
    rect.right <= winWidth
  );
}

/**
 * prepend polyfill
 */
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('prepend')) {
      return;
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.insertBefore(docFrag, this.firstChild);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);