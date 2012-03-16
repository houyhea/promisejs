function success(name){
    console.log("Success: ", name);
}
function failure(name){
    console.log("Error: ", name);
}

function assert(bool, name) {
    if (bool)
        success(name);
    else
        failure(name);
}


function sync_return(value) {
    var p = new promise.Promise();
    p.done(value, null);
    return p;
};

function async_return(value) {
    var p = new promise.Promise();
    setTimeout(function(){
        p.done(value, null);
    });
    return p;
};

function late(n) { 
    var p = new promise.Promise();
    setTimeout(function() {
        p.done(n);
    }, n);
    return p; 
}


function test() {
    sync_return(123).then(function(result, error) {
        assert(result === 123, 'simple synchronous test');
    });

    async_return(123).then(function(result, error) {
        assert(result === 123, 'simple asynchronous test');
    });
    
    var d = new Date();

    promise.join([
            function() {
                return late(400);
            },
            function(){
                return late(800);
            }
        ]).then(
            function(values) {
                assert(values[0] === 400 && values[1] === 800,
                       "join() result");
                var delay = new Date() - d;
                assert(700 < delay && delay < 900,
                       "joining functions");
            }
        );

    promise.chain([
        function() {
            return late(100);
        },
        function(n) {
            return late(n + 200);
        },
        function(n) {
            return late(n + 300);
        },
        function(n) { 
            return late(n + 400);
        }
    ]).then(
        function(n) {
            assert(n === 1000, "chain() result");
            var delay = new Date() - d;
            assert(1900 < delay && delay < 2400,
                   "chaining functions() " + delay);
        }
    );
}