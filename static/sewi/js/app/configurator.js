var sewi = sewi || {};
sewi.Configurator = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.Configurator))
        return new sewi.Configurator(options);

    var selfRef = this;
    var defaults = {
        animated: true,
        isBasicInfoMinimized: false,
        isResourceViewerHidden: true
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
            selfRef.isResourceViewerHidden = true;
            updateViewSizes();
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

    function updateViewSizes() {
        var totalWidth = 12;
        var basicInfoWidth = 3;
        var minBasicInfoWidth = 1;
        var resExplorerWidth = 1;
        var resViewerWidth = 8;

        selfRef.basicInfoView
            .add(selfRef.resViewerView)
            .add(selfRef.resExplorerView)
            .removeClass(function(index, cssClass) {
                return ( cssClass.match(/(^|\s)col-sm-\S+/g) || [] ).join(' ');
            });

        if (selfRef.isBasicInfoMinimized) {
            resViewerWidth += basicInfoWidth - minBasicInfoWidth;
            selfRef.basicInfoView
                   .addClass('col-sm-' + minBasicInfoWidth);
        } else {
            selfRef.basicInfoView
                   .addClass('col-sm-' + basicInfoWidth);
        }
        if (selfRef.isResourceViewerHidden) {
            resExplorerWidth += resViewerWidth;
            resViewerWidth = 0;
        }
        selfRef.resViewerView
               .addClass('col-sm-' + resViewerWidth);
        selfRef.resExplorerView
               .addClass('col-sm-' + resExplorerWidth);
    }

}
