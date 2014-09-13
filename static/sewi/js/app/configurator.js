var sewi = sewi || {};
sewi.Configurator = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.Configurator))
        return new sewi.Configurator(options);

    var selfRef = this;
    var defaults = {
        animated: true,
        isBasicInfoHidden: false,
        isResourceViewerHidden: false
    };

    options = options || {};
    _.assign(selfRef, defaults, options);

    validateArguments();
    initBasicInfo();
    initResViewer();
    initResExplorer();

    return this;

    function validateArguments() {
        selfRef.basicInfoView = $(selfRef.basicInfoView);
        selfRef.resViewerView = $(selfRef.resViewerView);
        selfRef.resExplorerView = $(selfRef.resExplorerView);

        if (selfRef.basicInfoView.length != 1) {
            throw new Error('options: One beiView selector/element must be provided.')
        }
        if (selfRef.resViewerView.length != 1) {
            throw new Error('options: One mainView selector/element must be provided.')
        }
        if (selfRef.resExplorerView.length != 1) {
            throw new Error('options: One resView selector/element must be provided.')
        }
    }

    function initBasicInfo() {
        // TODO
    }

    function initResViewer() {
        selfRef.tabContainer = new sewi.TabContainer();
        var element = selfRef.tabContainer.getDOM();
        element.on("NoTabs", function() {
            // TODO: Resize elements.
        });
        selfRef.resViewerView.append(element);
    }

    function initResExplorer() {
        // TODO
    }

    function openResource(resourceId) {
        // TODO: Open resource in tabContainer
        // TODO: Pass entire resouce to tabContainer
    }

}
