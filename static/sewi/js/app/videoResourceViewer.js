var sewi = sewi || {};

sewi.VideoResourceViewer = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.VideoResourceViewer))
        return new sewi.VideoResourceViewer(options);

    sewi.ConfiguratorElement.call(this);

    var selfRef = this;
    var defaults = {

    };

    options = options || {};
    _.defaults(options, defaults);
    _.assign(selfRef, _.pick(options, [
        'id',
    ]));

    selfRef.isLoaded = false;

    validateArguments();

    return selfRef;

    function validateArguments() {
        if (!_.isString(selfRef.id)) {
            throw new Error('options: Valid resource id must be provided.');
        }
    }
}

sewi.inherits(sewi.VideoResourceViewer, sewi.ConfiguratorElement);
