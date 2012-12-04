"use strict";
function aNum(digits, integers, base){ // Returns it _zeroed
    if( !(this instanceof aNum) ) return new aNum(digits, integers, base);

    if(typeof digits   === 'undefined')   digits = 1;                         // Decimal Length
    if(typeof integers === 'undefined') integers = 1;                           // Integer Length
    if(typeof base     === 'undefined')     base = 10;                            // Base of mathmatics

    if( digits < 1 || integers < 1 || base < 2 ||
        digits != Math.floor(digits) || integers != Math.floor(integers) || base != Math.floor(base)){
            throw "Invalid data given to aNum constructor! Digits: "+digits+" Integers: "+integers+" Base: "+base;
    }

    this.core = [];                      // Where the data is stored as an array of numbers
    this.sign = 1;                       // Sign, either 1 for positive or -1 for negative
    this.decimal_length = digits;
    this.integer_length = integers;
    this.total_length   = digits+integers;
    this.base           = base;
    this._zero();                       // Will initialize the "core" array to proper length of zeroes

    return this;
}

///////////////////////////////////////
// General Private Methods
///////////////////////////////////////
aNum.prototype._flip_sign = function(){
    this.sign = this.sign === 1 ? -1 : 1;
};
aNum.prototype._zero = function(){
    for( var i = 0; i <= this.total_length - 1; i++){
        this.core[i] = 0;
    }
};
aNum.prototype._copy_array = function(){
    var a = new Array();
    for (var i = 0; i < this.total_length; i++){
        a[i] = this.core[i];
    }
    return a;
};
aNum.prototype._has_leading_zeroes = function(place){
    if(!arguments)   throw "No arguments passed to _any_leading_zeroes.";
    if(arguments[1]) throw "Too many arguments passed to _has_leading_zeroes";
    for(var i = place; i >= 0; i--){
        if( this.core[i] !== 0 ){
            return false;
        }
    }
    return true;
};
aNum.prototype._trim_trailing_zeroes = function(){
    while( this.core[this.total_length-1] === 0 ){
        this.core.pop();
        this.total_length   -= 1;
        this.decimal_length -= 1;
    }
    return true;
};
aNum.prototype._trim_leading_zeroes = function(){
    while( this.core[0] === 0 ){
        this.core.unshift();
        this.total_length   -= 1;
        this.integer_length -= 1;
    }
    return true;
};
aNum.prototype._increase_decimal_counter = function(x){     // Adds x _zeros to decimals side of array
    if(!x) x=1;
    this.decimal_length += x; 
    this.total_length   += x;
};
aNum.prototype._increase_integer_counter = function(x){     // Adds x _zeros to decimals side of array
    if(!x) x=1;
    this.integer_length += x; 
    this.total_length   += x;
};
aNum.prototype._more_decimal_places = function(x){     // Adds x _zeros to decimals side of array
    if(!x) x=1;
    if(x < 1) throw "Can not add less than 1 decimal place.";
    for(var n = 0; n < x; n++) {
        this.core.push(0);
    }
    this._increase_decimal_counter(x);
};
aNum.prototype._more_integer_places = function(x){     // Adds x _zeros to integers side of array
    if(!x) x=1;
    if(x < 1) throw "Can not add less than 1 integer place.";
    for(var n = 0; n < x; n++) {
        this.core.unshift(0);
    }
    this._increase_integer_counter(x);
};
aNum.prototype._trim = function(){
    this._trim_trailing_zeroes();
    this._trim_leading_zeroes();
    return true;
};
// makes this.core the same size as other.core
aNum.prototype._even = function(other){
    var iDiff = other.integer_length - this.integer_length;
    var dDiff = other.decimal_length - this.decimal_length;
    if(iDiff > 0) this._moreIntegerPlaces(iDiff);
    if(dDiff > 0) this._moreDecimalPlaces(dDiff);
};

///////////////////////////////////////
// General Public Methods
///////////////////////////////////////
aNum.prototype.copy = function(){
    var result = new aNum(this.integer_length, this.decimal_length, this.base);
    result.core = _copy_array();

    return result;
};

///////////////////////////////////////
// Casting Methods Public
///////////////////////////////////////
aNum.prototype.to_string = function(){
    var string = '';
    if (this.sign == -1){ string = '-'; }
    this._trim_leading_zeroes();
    
    for( var i = 0; i <= this.total_length-1; i++){
        // Add decimal place
        if(i === this.integer_length){
            string += '.';
        }
        string += this.core[i].toString();
    };

    return string;
};
// Takes a aNum and returns it as a number, in base 10
aNum.prototype.to_number = function(){
    // some error handling for numbers to big
    var place = -this.decimal_length;
    var result = 0;
    for (var i = this.total_length-1; i >= 0; i--){
        if( this.core[i] === 0 ) continue;
        result += this.core[i] * Math.pow(this.base, place);
        ++place;
    }
    return result;
};
// Returns an aNum equal to it in a new base
aNum.prototype.to_base = function(n_base){
    if( n_base < 2 ) throw "Base must be greater than 2."

// TBD 

    return this;
};

///////////////////////////////////////
// Math Private Methods
///////////////////////////////////////

// Addition
aNum.prototype._add_aNum = function(input){
    var x = input.copy();
    this._even(x);

    if(x.sign == -1){
        x.invertSign();
        return this._sub_aNum(x);
    }

    for (var i = this.total_length-1; i >= 0; i--){
        this.core[i] += x.core[i];
        if (this.core[i] >= this.base) {
            if(i===0) {
                this._moreIntegerPlaces();
                i++;
            }
            this.core[i] -= this.base; 
            this.core[i-1]++;
        }
    }
    
    this._trim();
    return this;
};
/* called by _add_num */
aNum.prototype._add_to_element = function(i, x, base, power){
    this.core[i]    += Math.floor( x / Math.pow(base,power) );
    x               -= ( this.core[i] )*Math.pow(base,power);
    if(this.core[i] >= base){
        if( this._has_leading_zeroes(i) ){
            this._more_integer_places();
            i++;
        }
        i = 1 + this._add_to_element(i-1, x, base, power+1);
    }
    return i;
};
aNum.prototype._add_number = function(x){
    if(x < 0){
        x *= -1;
        return this._sub_number(x);
    }

    // Get how many intiger places it takes
    for(var iPlaces = 1; x >= this.base; iPlaces++){
        x = x/this.base;
    }
    // Add Integer places if needed
    if(iPlaces > this.integer_length){
        this._more_integer_places(iPlaces - this.integer_length);
    }

    var power = iPlaces;
    // The algorithm
    for( var i = this.integer_length - iPlaces; x != 0 && i <= this.total_length-1; i++){
        if(x <= 0) throw "Error: in _add_num. Algorithm line 1.";
        if(!this.core[i]) this._more_decimal_places();
        i = this._add_to_element(i, x, this.base, power);
        power--;
    }
    this._trim();
    return this;
};

/*
// Reads in a string
aNum.prototype._add_str(target source){
    
}

*/

///////////////////////////////////////
// Math Public Methods
///////////////////////////////////////

// Takes another aNum, number, or string
// passing aNum will overwrite old precision and base
// passing number or string assumes that the number or string are written in it's current base
//      string will understand bases 2-10 and 16
//      if a string is written in any other base even if it comes from this programs to_string
//      it will not understand it.
aNum.prototype.set_value = function(x){
    if(!x) throw "Set_value must receive a Number, String, or aNum object.";
    this._zero();

    if( x instanceof aNum ){
        this.core = x.copy();
    }
    else if( ('number' == typeof x) || x instanceof Number ){
        this._add_num(x);
    }
    /*else if(x instanceof String || x == typeof string ){
        this.set_value( this._add_str(x) );
    }*/
    else{
        throw "Argument" + x.toString() + "is not aNum, number, or string in aNum.setValue.";
    }
    this._trim();
    return this;
};

// Takes another aNum, number, or string
// Passing number assumes external number is base 10
// Passing string assumes that the string are written in it's current base
//    - String will understand bases 2-10 and 16
//    - If a string is written in any other base even if it comes from this programs to_string
//      function it will not understand it.
aNum.prototype.add = function(x){
    if( !x )       { throw ".Add() must be passed numbers"; }
    if( arguments[1] ){ throw "To many arguments to .add()"; }

    if( x instanceof aNum   ){
        this._add_aNum( x );
    }
    else if( x instanceof Number || x == typeof number ){
        this._add_number( x );
    }
    /*else if(x instanceof String || x == typeof string ){
        result = this._add_str(x)
    }*/
    else{
        throw "Argument"+ x.toString() +"is not aNum, number, or string in aNum.add()";
    }

    this._trim();
    return this;
};