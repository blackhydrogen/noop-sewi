// common QUnit module declaration
module("A test module", {
    setup: function() {
    // before each test, ensure the application is ready to run.
    },

    teardown: function() {
    // reset the application state between each test
    }
});

// QUnit test case
test("/", function(assert) {
    expect(0); // No assert statements
});
