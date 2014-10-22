var sewi = sewi || {};

(function() {
    sewi.Configurator = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.Configurator))
            return new sewi.Configurator(options);

        var selfRef = this;
        var defaults = {
            animated: true,
            isBasicInfoMinimized: false,
            isResourceViewerHidden: true,
            title: 'Loading',
            subtitle: 'Please wait'
        };

        options = options || {};
        _.defaults(options, defaults);
        _.assign(selfRef, _.pick(options, [
            'animated',
            'isBasicInfoMinimized',
            'isResourceViewerHidden',
            'titleView',
            'basicInfoView',
            'resViewerView',
            'resGalleryView'
        ]));

        validateArguments.call(selfRef);
        initTitle.call(selfRef, options);
        initBasicInfo.call(selfRef);
        initResViewer.call(selfRef);
        initResGallery.call(selfRef);

        return this;
    }

    // Configurator private methods
    function validateArguments() {
        var selfRef = this;

        selfRef.titleView = $(selfRef.titleView);
        selfRef.basicInfoView = $(selfRef.basicInfoView);
        selfRef.resViewerView = $(selfRef.resViewerView);
        selfRef.resGalleryView = $(selfRef.resGalleryView);

        if (selfRef.titleView.length != 1) {
            throw new Error('options: One titleView selector/element must be provided.')
        }
        if (selfRef.basicInfoView.length != 1) {
            throw new Error('options: One basicInfoView selector/element must be provided.')
        }
        if (selfRef.resViewerView.length != 1) {
            throw new Error('options: One resViewerView selector/element must be provided.')
        }
        if (selfRef.resGalleryView.length != 1) {
            throw new Error('options: One resGalleryView selector/element must be provided.')
        }
    }

    function initTitle(options) {
        var selfRef = this;

        selfRef.titleDOM = $('<h1>');
        selfRef.subtitleDOM = $('<small>');
        selfRef.titleView.append(selfRef.titleDOM);

        selfRef.setTitle(options.title, options.subtitle);
    }

    function initBasicInfo() {
        var selfRef = this;

        if (_.isFunction(sewi.BasicEncounterInfoViewer)) {
            selfRef.basicInfo = new sewi.BasicEncounterInfoViewer();
            var element = selfRef.basicInfo.getDOM();

            element.on('Error', basicInfoCrashed.bind(selfRef));

            selfRef.basicInfoView.append(element);
        }

        var minimizeElement = $('<div class="minimize-button">&lt;&lt;</div>');
        selfRef.basicInfoView.append(minimizeElement);
        minimizeElement.click(minimizeToggled.bind(selfRef));
    }

    function initResViewer() {
        var selfRef = this;

        if (_.isFunction(sewi.TabContainer)) {
            selfRef.tabs = new sewi.TabContainer();
            var element = selfRef.tabs.getDOM();
            element.on("NoTabs", allTabsClosed.bind(selfRef));
            element.on('Error', resViewerCrashed.bind(selfRef));
            selfRef.resViewerView.append(element);
        }
    }

    function initResGallery() {
        var selfRef = this;

        if (_.isFunction(sewi.ResourceGallery)) {
            selfRef.resGallery = new sewi.ResourceGallery();
            var element = selfRef.resGallery.getDOM();
            element.on('Error', resGalleryCrashed.bind(selfRef));

            selfRef.resGalleryView.append(element);
        }
    }

    function openResource(galleryElement) {
        var selfRef = this;

        selfRef.tabs.addObjectToNewTab(galleryElement);
    }

    function updateViewSizes() {
        var selfRef = this;

        var totalWidth = 12;
        var basicInfoWidth = 3;
        var minBasicInfoWidth = 1;
        var resGalleryWidth = 1;
        var resViewerWidth = 8;

        selfRef.basicInfoView
            .add(selfRef.resViewerView)
            .add(selfRef.resGalleryView)
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
            resGalleryWidth += resViewerWidth;
            resViewerWidth = 0;
        }
        selfRef.resViewerView
               .addClass('col-sm-' + resViewerWidth);
        selfRef.resGalleryView
               .addClass('col-sm-' + resGalleryWidth);
    }

    function setEncounterTitle(id, name) {
        var selfRef = this;

        var title = name;
        var subtitle = "Encounter #" + id;
        selfRef.setTitle(title, subtitle);
    }

    function createErrorScreen(errorMessage, reloadCallback) {
        var selfRef = this;

        var centralElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_RETRY_DOM);
        var messageElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_MESSAGE_DOM).text(errorMessage);
        var buttonElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_BUTTON_DOM);
        var backdropElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_BACKDROP_DOM).addClass(sewi.constants.ERROR_SCREEN_CLASS);

        backdropElement.append(centralElement);
        centralElement.append(messageElement).append(buttonElement);

        buttonElement.click({
            element: backdropElement,
            callback: reloadCallback
        }, refreshClicked.bind(selfRef));

        return backdropElement;
    }

    function basicInfoLoaded(event, encounter) {
        var selfRef = this;

        setEncounterTitle.call(selfRef, encounter.id, encounter.title);
    }

    function basicInfoCrashed() {
        var selfRef = this;
        // Destructive removal (including all events)
        selfRef.basicInfoView.children().remove();

        selfRef.basicInfoView.append(createErrorScreen('Basic Info has crashed!', initBasicInfo.bind(selfRef)));
    }

    function resViewerCrashed() {
        var selfRef = this;
        // Destructive removal (including all events)
        selfRef.resViewerView.children().remove();

        selfRef.resViewerView.append(createErrorScreen('Resource viewer has crashed!', initResViewer.bind(selfRef)));
    }

    function resGalleryCrashed() {
        var selfRef = this;
        // Destructive removal (including all events)
        selfRef.resGalleryView.children().remove();

        selfRef.resGalleryView.append(createErrorScreen('Resource gallery has crashed!', initResGallery.bind(selfRef)));
    }

    function refreshClicked(event) {
        var selfRef = this;

        var element = event.data.element;
        var callback = event.data.callback;

        element.remove();
        callback.call(selfRef);
    }

    function minimizeToggled() {
        var selfRef = this;

        selfRef.isBasicInfoMinimized = !selfRef.isBasicInfoMinimized;
        updateViewSizes.call(selfRef);
    }

    function allTabsClosed() {
        var selfRef = this;

        selfRef.isResourceViewerHidden = true;
        updateViewSizes.call(selfRef);
    }

    // Configurator public methods
    sewi.Configurator.prototype.setTitle = function(title, subtitle) {
        var selfRef = this;

        selfRef.subtitleDOM.text(subtitle);
        selfRef.titleDOM.text(title + ' ')
                        .append(selfRef.subtitleDOM);
    }
})();
