// Begin test if "test" is in the query string
if (window.location.search.indexOf("?test") !== -1 || window.location.search.indexOf("&test") !== -1) {
  document.write(
    '<div id="qunit"></div>' +
    '<div id="qunit-fixture"></div>' +
    '<link rel="stylesheet" href="tests/vendor/qunit-1.12.0.css">' +
    '<script src="tests/vendor/qunit-1.12.0.js"></script>' +
    '<script src="tests/tests.js"></script>'
  )
}
