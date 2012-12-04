module( "aNum Constructor" );
test("Is aNum", function(){
    var a = new aNum();
    ok(a instanceof aNum, "Not an aNum");
});
test("Given no values", function(){
    var a = new aNum();
    strictEqual(a.sign, 1, "sign error");
    strictEqual(a.decimal_length, 1, "decimal length error");
    strictEqual(a.integer_length, 1, "integer length error");
    strictEqual(a.core.length,    2, "array length error");
    strictEqual(a.core[0],        0, "not zeroed properly pt.0");
    strictEqual(a.core[1],        0, "not zeroed properly pt.1");
});
test("Given 1's as values", function(){
    var a = new aNum(1, 1);
    strictEqual(a.sign, 1, "sign error");
    strictEqual(a.decimal_length, 1, "decimal length error");
    strictEqual(a.integer_length, 1, "integer length error");
    strictEqual(a.core.length,    2, "array length error");
    strictEqual(a.core[0],        0, "not zeroed properly pt.0");
    strictEqual(a.core[1],        0, "not zeroed properly pt.1");
});
test("Given incorrect values", function(){
    throws(function(){a = new aNum(0, 1, 10);}, 
        "0 integer didn't throw error"
    );
    throws(function(){a = new aNum(1, 0, 10);}, 
        "0 decimal didn't throw error"
    );
    throws(function(){a = new aNum(-1, 1, 10);}, 
        "-1 integer didn't throw error"
    );
    throws(function(){a = new aNum(1, -1, 10);}, 
        "-1 decimal didn't throw error"
    );
    throws(function(){a = new aNum(1, 1, 1);}, 
        "1 base didn't throw error"
    );
    throws(function(){a = new aNum(1, 1, 0);}, 
        "0 base didn't throw error"
    );
    throws(function(){a = new aNum(1, 1, -1);}, 
        "-1 base didn't throw error"
    );
});

module( "aNum set_value" );
test(" 1 ", function(){
    var a = new aNum();
    a.set_value(1);
    strictEqual(a.core[0], 1, "1 does not equal 1");
});
/*
test(" 0.1 ", function(){
    var a = new aNum();
    a.set_value(0.1);
    strictEqual(a.core[0], 0, "0 of 0.1 does not equal 0");
    strictEqual(a.core[1], 1, "1 of 0.1 does not equal 1");
});
test(" -1 ", function(){
    var a = new aNum();
    a.set_value(-1);
    strictEqual(a.core[0], 1, "1 of -1 does not equal 1");
    strictEqual(a.sign,   -1, "-1 is not negative");
});
test(" -0.1 ", function(){
    var a = new aNum();
    a.set_value(-0.1);
    strictEqual(a.core[0], 0, "0 of 0.1 does not equal 0");
    strictEqual(a.core[1], 1, "1 of 0.1 does not equal 1");
    strictEqual(a.sign,   -1, "-1 is not negative");
});
*/