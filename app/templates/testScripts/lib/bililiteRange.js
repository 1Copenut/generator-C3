// Cross-broswer implementation of text ranges and selections
// documentation: http://bililite.com/blog/2011/01/17/cross-browser-text-ranges-and-selections/
// Version: 1.1
// Copyright (c) 2010 Daniel Wachsstock
// MIT license:
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

(function(){
	
let bililiteRange;

bililiteRange = function(el, debug){
	let ret;
	if (debug){
		ret = new NothingRange(); // Easier to force it to use the no-selection type than to try to find an old browser
	}else if (document.selection){
		// Internet Explorer
		ret = new IERange();
	}else if (window.getSelection && el.setSelectionRange){
		// Standards. Element is an input or textarea 
		ret = new InputRange();
	}else if (window.getSelection){
		// Standards, with any other kind of element
		ret = new W3CRange();
	}else{
		// doesn't support selection
		ret = new NothingRange();
	}
	ret._el = el;
	ret._textProp = textProp(el);
	ret._bounds = [0, ret.length()];
	return ret;
};

function textProp(el){
	// returns the property that contains the text of the element
	if (typeof el.value != 'undefined') return 'value';
	if (typeof el.text != 'undefined') return 'text';
	if (typeof el.textContent != 'undefined') return 'textContent';
	return 'innerText';
}

// base class
function Range(){}
Range.prototype = {
	length: function() {
		return this._el[this._textProp].replace(/\r/g, '').length; // need to correct for IE's CrLf weirdness
	},
	bounds: function(s){
		if (s === 'all'){
			this._bounds = [0, this.length()];
		}else if (s === 'start'){
			this._bounds = [0, 0];
		}else if (s === 'end'){
			this._bounds = [this.length(), this.length()];
		}else if (s === 'selection'){
			this.bounds ('all'); // first select the whole thing for constraining
			this._bounds = this._nativeSelection();
		}else if (s){
			this._bounds = s; // don't error check now; the element may change at any moment, so constrain it when we need it.
		}else{
			let b = [
				Math.max(0, Math.min (this.length(), this._bounds[0])),
				Math.max(0, Math.min (this.length(), this._bounds[1]))
			];
			return b; // need to constrain it to fit
		}
		return this; // allow for chaining
	},
	select: function(){
		this._nativeSelect(this._nativeRange(this.bounds()));
		return this; // allow for chaining
	},
	text: function(text, select){
		if (arguments.length){
			this._nativeSetText(text, this._nativeRange(this.bounds()));
			if (select == 'start'){
				this.bounds ([this._bounds[0], this._bounds[0]]);
				this.select();
			}else if (select == 'end'){
				this.bounds ([this._bounds[0]+text.length, this._bounds[0]+text.length]);
				this.select();
			}else if (select == 'all'){
				this.bounds ([this._bounds[0], this._bounds[0]+text.length]);
				this.select();
			}
			return this; // allow for chaining
		}else{
			return this._nativeGetText(this._nativeRange(this.bounds()));
		}
	},
	insertEOL: function (){
		this._nativeEOL();
		this._bounds = [this._bounds[0]+1, this._bounds[0]+1]; // move past the EOL marker
		return this;
	}
};


function IERange(){}
IERange.prototype = new Range();
IERange.prototype._nativeRange = function (bounds){
	let rng;
	if (this._el.tagName == 'INPUT'){
		// IE 8 is very inconsistent; textareas have createTextRange but it doesn't work
		rng = this._el.createTextRange();
	}else{
		rng = document.body.createTextRange ();
		rng.moveToElementText(this._el);
	}
	if (bounds){
		if (bounds[1] < 0) bounds[1] = 0; // IE tends to run elements out of bounds
		if (bounds[0] > this.length()) bounds[0] = this.length();
		if (bounds[1] < rng.text.replace(/\r/g, '').length){ // correct for IE's CrLf wierdness
			// block-display elements have an invisible, uncounted end of element marker, so we move an extra one and use the current length of the range
			rng.moveEnd ('character', -1);
			rng.moveEnd ('character', bounds[1]-rng.text.replace(/\r/g, '').length);
		}
		if (bounds[0] > 0) rng.moveStart('character', bounds[0]);
	}
	return rng;					
};
IERange.prototype._nativeSelect = function (rng){
	rng.select();
};
IERange.prototype._nativeSelection = function (){
	// returns [start, end] for the selection constrained to be in element
	let rng = this._nativeRange(); // range of the element to constrain to
	let len = this.length();
	if (document.selection.type != 'Text') return [len, len]; // append to the end
	let sel = document.selection.createRange();
	try{
		return [
			iestart(sel, rng),
			ieend (sel, rng)
		];
	}catch (e){
		// IE gets upset sometimes about comparing text to input elements, but the selections cannot overlap, so make a best guess
		return (sel.parentElement().sourceIndex < this._el.sourceIndex) ? [0,0] : [len, len];
	}
};
IERange.prototype._nativeGetText = function (rng){
	return rng.text.replace(/\r/g, ''); // correct for IE's CrLf weirdness
};
IERange.prototype._nativeSetText = function (text, rng){
	rng.text = text;
};
IERange.prototype._nativeEOL = function(){
	if (typeof this._el.value != 'undefined'){
		this.text('\n'); // for input and textarea, insert it straight
	}else{
		this._nativeRange(this.bounds()).pasteHTML('<br/>');
	}
};
// IE internals
function iestart(rng, constraint){
	// returns the position (in character) of the start of rng within constraint. If it's not in constraint, returns 0 if it's before, length if it's after
	let len = constraint.text.replace(/\r/g, '').length; // correct for IE's CrLf wierdness
	if (rng.compareEndPoints ('StartToStart', constraint) <= 0) return 0; // at or before the beginning
	if (rng.compareEndPoints ('StartToEnd', constraint) >= 0) return len;
	for (let i = 0; rng.compareEndPoints ('StartToStart', constraint) > 0; ++i, rng.moveStart('character', -1));
	return i;
}
function ieend (rng, constraint){
	// returns the position (in character) of the end of rng within constraint. If it's not in constraint, returns 0 if it's before, length if it's after
	let len = constraint.text.replace(/\r/g, '').length; // correct for IE's CrLf wierdness
	if (rng.compareEndPoints ('EndToEnd', constraint) >= 0) return len; // at or after the end
	if (rng.compareEndPoints ('EndToStart', constraint) <= 0) return 0;
	for (let i = 0; rng.compareEndPoints ('EndToStart', constraint) > 0; ++i, rng.moveEnd('character', -1));
	return i;
}

// an input element in a standards document. "Native Range" is just the bounds array
function InputRange(){}
InputRange.prototype = new Range();
InputRange.prototype._nativeRange = function(bounds) {
	return bounds || [0, this.length()];
};
InputRange.prototype._nativeSelect = function (rng){
	this._el.setSelectionRange(rng[0], rng[1]);
};
InputRange.prototype._nativeSelection = function(){
	return [this._el.selectionStart, this._el.selectionEnd];
};
InputRange.prototype._nativeGetText = function(rng){
	return this._el.value.substring(rng[0], rng[1]);
};
InputRange.prototype._nativeSetText = function(text, rng){
	let val = this._el.value;
	this._el.value = val.substring(0, rng[0]) + text + val.substring(rng[1]);
};
InputRange.prototype._nativeEOL = function(){
	this.text('\n');
};

function W3CRange(){}
W3CRange.prototype = new Range();
W3CRange.prototype._nativeRange = function (bounds){
	let rng = document.createRange();
	rng.selectNodeContents(this._el);
	if (bounds){
		w3cmoveBoundary (rng, bounds[0], true, this._el);
		rng.collapse (true);
		w3cmoveBoundary (rng, bounds[1]-bounds[0], false, this._el);
	}
	return rng;					
};
W3CRange.prototype._nativeSelect = function (rng){
	window.getSelection().removeAllRanges();
	window.getSelection().addRange (rng);
};
W3CRange.prototype._nativeSelection = function (){
		// returns [start, end] for the selection constrained to be in element
		let rng = this._nativeRange(); // range of the element to constrain to
		if (window.getSelection().rangeCount == 0) return [this.length(), this.length()]; // append to the end
		let sel = window.getSelection().getRangeAt(0);
		return [
			w3cstart(sel, rng),
			w3cend (sel, rng)
		];
	};
W3CRange.prototype._nativeGetText = function (rng){
	return rng.toString();
};
W3CRange.prototype._nativeSetText = function (text, rng){
	rng.deleteContents();
	rng.insertNode (document.createTextNode(text));
	this._el.normalize(); // merge the text with the surrounding text
};
W3CRange.prototype._nativeEOL = function(){
	let rng = this._nativeRange(this.bounds());
	rng.deleteContents();
	let br = document.createElement('br');
	br.setAttribute ('_moz_dirty', ''); // for Firefox
	rng.insertNode (br);
	rng.insertNode (document.createTextNode('\n'));
	rng.collapse (false);
};
// W3C internals
function nextnode (node, root){
	//  in-order traversal
	// we've already visited node, so get kids then siblings
	if (node.firstChild) return node.firstChild;
	if (node.nextSibling) return node.nextSibling;
	if (node===root) return null;
	while (node.parentNode){
		// get uncles
		node = node.parentNode;
		if (node == root) return null;
		if (node.nextSibling) return node.nextSibling;
	}
	return null;
}
function w3cmoveBoundary (rng, n, bStart, el){
	// move the boundary (bStart == true ? start : end) n characters forward, up to the end of element el. Forward only!
	// if the start is moved after the end, then an exception is raised
	if (n <= 0) return;
	let node = rng[bStart ? 'startContainer' : 'endContainer'];
	if (node.nodeType == 3){
	  // we may be starting somewhere into the text
	  n += rng[bStart ? 'startOffset' : 'endOffset'];
	}
	while (node){
		if (node.nodeType == 3){
			if (n <= node.nodeValue.length){
				rng[bStart ? 'setStart' : 'setEnd'](node, n);
				// special case: if we end next to a <br>, include that node.
				if (n == node.nodeValue.length){
					// skip past zero-length text nodes
					for (let next = nextnode (node, el); next && next.nodeType==3 && next.nodeValue.length == 0; next = nextnode(next, el)){
						rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
					}
					if (next && next.nodeType == 1 && next.nodeName == "BR") rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
				}
				return;
			}else{
				rng[bStart ? 'setStartAfter' : 'setEndAfter'](node); // skip past this one
				n -= node.nodeValue.length; // and eat these characters
			}
		}
		node = nextnode (node, el);
	}
}
let     START_TO_START                 = 0; // from the w3c definitions
let     START_TO_END                   = 1;
let     END_TO_END                     = 2;
let     END_TO_START                   = 3;
// from the Mozilla documentation, for range.compareBoundaryPoints(how, sourceRange)
// -1, 0, or 1, indicating whether the corresponding boundary-point of range is respectively before, equal to, or after the corresponding boundary-point of sourceRange. 
    // * Range.END_TO_END compares the end boundary-point of sourceRange to the end boundary-point of range.
    // * Range.END_TO_START compares the end boundary-point of sourceRange to the start boundary-point of range.
    // * Range.START_TO_END compares the start boundary-point of sourceRange to the end boundary-point of range.
    // * Range.START_TO_START compares the start boundary-point of sourceRange to the start boundary-point of range. 
function w3cstart(rng, constraint){
	if (rng.compareBoundaryPoints (START_TO_START, constraint) <= 0) return 0; // at or before the beginning
	if (rng.compareBoundaryPoints (END_TO_START, constraint) >= 0) return constraint.toString().length;
	rng = rng.cloneRange(); // don't change the original
	rng.setEnd (constraint.endContainer, constraint.endOffset); // they now end at the same place
	return constraint.toString().length - rng.toString().length;
}
function w3cend (rng, constraint){
	if (rng.compareBoundaryPoints (END_TO_END, constraint) >= 0) return constraint.toString().length; // at or after the end
	if (rng.compareBoundaryPoints (START_TO_END, constraint) <= 0) return 0;
	rng = rng.cloneRange(); // don't change the original
	rng.setStart (constraint.startContainer, constraint.startOffset); // they now start at the same place
	return rng.toString().length;
}

function NothingRange(){}
NothingRange.prototype = new Range();
NothingRange.prototype._nativeRange = function(bounds) {
	return bounds || [0,this.length()];
};
NothingRange.prototype._nativeSelect = function (rng){ // do nothing
};
NothingRange.prototype._nativeSelection = function(){
	return [0,0];
};
NothingRange.prototype._nativeGetText = function (rng){
	return this._el[this._textProp].substring(rng[0], rng[1]);
};
NothingRange.prototype._nativeSetText = function (text, rng){
	let val = this._el[this._textProp];
	this._el[this._textProp] = val.substring(0, rng[0]) + text + val.substring(rng[1]);
};
NothingRange.prototype._nativeEOL = function(){
	this.text('\n');
};

})();