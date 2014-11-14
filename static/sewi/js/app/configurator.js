var sewi = sewi || {};

(function() {
    /**
     * Configures HTML elements to display portions of the SEWI, and manages
     * the logic that makes up each portion displayed.
     *
     * @class sewi.Configurator
     * @constructor
     * @param {Object} options Configuration options for the Configurator.
     * @param {Boolean} [options.isBasicInfoMinimized=false] If true, the
     * Configurator expects that the basic information view is initially
     * minimized.
     * @param {Boolean} [options.isResourceViewerHidden=true] If true, the
     * Configurator expects that the resource viewer is initially hidden.
     * @param {jQuery|String} options.titleView The jQuery selector that
     * describes the HTML element that will display the title. It is expected to
     * be an empty element.
     * @param {jQuery|String} options.resViewerView The jQuery selector that
     * describes the HTML element that will display the basic encounter
     * information.
     * @param {jQuery|String} options.resGalleryView The jQuery selector that
     * describes the HTML element that will display the resource gallery.
     * @param {jQuery|String} options.alertsView The jQuery selector that
     * describes the HTML element that will display global alert messages.
     * @param {String} options.encounterId The ID of the encounter to be
     * displayed.
     */
    sewi.Configurator = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.Configurator))
            return new sewi.Configurator(options);

        var defaults = {
            isBasicInfoMinimized: false,
            isResourceViewerHidden: true,
            title: sewi.constants.CONFIGURATOR_DEFAULT_TITLE,
            subtitle: sewi.constants.CONFIGURATOR_DEFAULT_SUBTITLE
        };

        options = options || {};
        _.defaults(options, defaults);
        _.assign(this, _.pick(options, [
            'isBasicInfoMinimized',
            'isResourceViewerHidden',
            'titleView',
            'basicInfoView',
            'resViewerView',
            'resGalleryView',
            'alertsView',
            'encounterId'
        ]));

        validateArguments.call(this);
        initTitle.call(this, options);
        initBasicInfo.call(this);
        initResViewer.call(this);
        initResGallery.call(this);
        initResizeTracking.call(this);

        return this;
    };

    // Configurator private methods
    function validateArguments() {

        // rewrap selectors, in case they were passed as strings.
        this.titleView = $(this.titleView);
        this.basicInfoView = $(this.basicInfoView);
        this.resViewerView = $(this.resViewerView);
        this.resGalleryView = $(this.resGalleryView);
        this.alertsView = $(this.alertsView);

        try {
            if (this.titleView.length != 1) {
                throw new Error(sewi.constants.CONFIGURATOR_TITLEVIEW_EXCEPTION_MESSAGE);
            }
            if (this.basicInfoView.length != 1) {
                throw new Error(sewi.constants.CONFIGURATOR_BASICINFOVIEW_EXCEPTION_MESSAGE);
            }
            if (this.resViewerView.length != 1) {
                throw new Error(sewi.constants.CONFIGURATOR_RESVIEWERVIEW_EXCEPTION_MESSAGE);
            }
            if (this.resGalleryView.length != 1) {
                throw new Error(sewi.constants.CONFIGURATOR_RESGALLERYVIEW_EXCEPTION_MESSAGE);
            }
            if (this.alertsView.length != 1) {
                throw new Error(sewi.constants.CONFIGURATOR_ALERTSVIEW_EXCEPTION_MESSAGE);
            }
            if (_.isString(this.encounterId) === false) {
                throw new Error(sewi.constants.CONFIGURATOR_ENCOUNTERID_EXCEPTION_MESSAGE);
            }
        } catch (anyError) {
            reportSeriousError();
            throw anyError;
        }
    }

    function initTitle(options) {

        this.titleDOM = $(sewi.constants.CONFIGURATOR_TITLE_DOM);
        this.subtitleDOM = $(sewi.constants.CONFIGURATOR_SUBTITLE_DOM);
        this.titleView.append(this.titleDOM);

        this.setTitle(options.title, options.subtitle);
    }

    function initBasicInfo() {

        if (_.isFunction(sewi.BasicEncounterInfoViewer)) {
            this.basicInfo = new sewi.BasicEncounterInfoViewer({
                encounterId: this.encounterId
            });
            var element = this.basicInfo.getDOM();

            element.on('BEILoaded', basicInfoLoaded.bind(this));
            element.on(sewi.constants.CONFIGURATOR_COMPONENT_ERROR_EVENT, basicInfoCrashed.bind(this));

            this.basicInfoView.append(element);

            this.basicInfo.load();
        }

        // Initialize a button that minimizes the basic information when clicked
        var minimizeElement = $(sewi.constants.CONFIGURATOR_MINIMIZE_DOM);
        this.basicInfoView.append(minimizeElement);
        minimizeElement.click(minimizeToggled.bind(this));
    }

    function initResViewer() {

        if (_.isFunction(sewi.TabContainer)) {
            this.tabs = new sewi.TabContainer();
            var element = this.tabs.getDOM();

            element.on(sewi.constants.TAB_NO_TAB_EVENT, allTabsClosed.bind(this));
            element.on(sewi.constants.CONFIGURATOR_COMPONENT_ERROR_EVENT, resViewerCrashed.bind(this));

            this.resViewerView.append(element);
        }
    }

    function initResGallery() {

        if (_.isFunction(sewi.ResourceGallery)) {
            this.resGallery = new sewi.ResourceGallery({
                encounterId: this.encounterId
            });
            var element = this.resGallery.getDOM();
            element.on('resourceClick', galleryOpenedResource.bind(this));
            element.on(sewi.constants.CONFIGURATOR_COMPONENT_ERROR_EVENT, resGalleryCrashed.bind(this));

            this.resGalleryView.append(element);

            this.resGallery.load();
        }
    }

    function initResizeTracking() {
        if (_.isFunction(sewi.BasicEncounterInfoViewer)) {
            reportResizeToBasicInfo.call(this);
        }
        if (_.isFunction(sewi.TabContainer)) {
            reportResizeToTabContainer.call(this);
        }
        if (_.isFunction(sewi.ResourceGallery)) {
            reportResizeToGallery.call(this);
        }
    }

    function reportResizeToBasicInfo() {
        var windowElement = $(window);

        windowElement.resize(resizeBasicInfo.bind(this));
    }

    function reportResizeToTabContainer() {
        var windowElement = $(window);

        this.resViewerView.on('transitionend', resizeIfSizeChangedInTransition.bind(this.tabs));
        windowElement.resize(this.tabs.resize.bind(this.tabs));
    }

    function reportResizeToGallery() {
        var windowElement = $(window);

        this.resGalleryView.on('transitionend', resizeGallery.bind(this));
        windowElement.resize(resizeGallery.bind(this));
    }

    function resizeIfSizeChangedInTransition(event) {
        if (event.target == event.currentTarget) {
            var propertyName = event.originalEvent.propertyName;
            if (propertyName == 'width' || propertyName == 'height') {
                this.resize();
            }
        }
    }

    function resizeBasicInfo(event) {
        var options = {
            elementIsMinimized: this.isBasicInfoMinimized
        };
        if (event.type === 'resize' && event.target === window) {
            options.isWindowResizeEvent = true;
        }

        this.basicInfo.resize(options);
    }

    function resizeGallery(event) {
        var isGalleryMinimized = !this.isResourceViewerHidden;
        this.resGallery.resize(isGalleryMinimized);
    }

    function openResource(galleryElement) {

        this.isResourceViewerHidden = false;
        updateViewSizes.call(this);

        this.tabs.addObjectToNewTab($(galleryElement));
    }

    function updateViewSizes() {

        var totalWidth = 12;
        var basicInfoWidth = 3;
        var minBasicInfoWidth = 1;
        var resGalleryWidth = 1;
        var resViewerWidth = 8;

        this.basicInfoView
            .add(this.resViewerView)
            .add(this.resGalleryView)
            .removeClass(getBootstrapColumnClasses);

        if (this.isBasicInfoMinimized) {
            resViewerWidth += basicInfoWidth - minBasicInfoWidth;
            this.basicInfoView
                   .addClass(sewi.constants.CONFIGURATOR_COLUMN_PREFIX_CLASS + minBasicInfoWidth)
                   .addClass(sewi.constants.CONFIGURATOR_MINIMIZED_CLASS);
        } else {
            this.basicInfoView
                   .addClass(sewi.constants.CONFIGURATOR_COLUMN_PREFIX_CLASS + basicInfoWidth)
                   .removeClass(sewi.constants.CONFIGURATOR_MINIMIZED_CLASS);
        }
        if (this.isResourceViewerHidden) {
            resGalleryWidth += resViewerWidth;
            resViewerWidth = 0;
        }
        this.resViewerView
               .addClass(sewi.constants.CONFIGURATOR_COLUMN_PREFIX_CLASS + resViewerWidth);
        this.resGalleryView
               .addClass(sewi.constants.CONFIGURATOR_COLUMN_PREFIX_CLASS + resGalleryWidth);
    }

    // Returns all Bootstrap-specific column classes, e.g. col-xs-1, col-xs-2, etc
    function getBootstrapColumnClasses(index, cssClass) {
        return ( cssClass.match(sewi.constants.CONFIGURATOR_COLUMN_PREFIX_REGEX) || [] ).join(' ');
    }

    function setEncounterTitle(id, name) {

        var title = name;
        var subtitle = sewi.constants.CONFIGURATOR_TITLE_PREFIX + id;
        this.setTitle(title, subtitle);
    }

    function createErrorScreen(errorMessage, reloadCallback) {

        var centralElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_RETRY_DOM);
        var messageElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_MESSAGE_DOM).text(errorMessage);
        var buttonElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_BUTTON_DOM);
        var backdropElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_BACKDROP_DOM).addClass(sewi.constants.ERROR_SCREEN_CLASS);

        backdropElement.append(centralElement);
        centralElement.append(messageElement).append(buttonElement);

        buttonElement.click({
            element: backdropElement,
            callback: reloadCallback
        }, refreshClicked.bind(this));

        return backdropElement;
    }

    function basicInfoLoaded(event, encounter) {

        setEncounterTitle.call(this, encounter.id, encounter.name);
    }

    function basicInfoCrashed() {
                // Destructive removal (including all events)
        this.basicInfoView.children().remove();

        this.basicInfoView.append(createErrorScreen(sewi.constants.CONFIGURATOR_ALERT_RELOAD_COMPONENT_ERROR_MESSAGE, initBasicInfo.bind(this)));
    }

    function resViewerCrashed() {
        // Hide all tooltips
        $('.tooltip').hide();

        // Destructive removal (including all events)
        this.resViewerView.children().remove();

        this.resViewerView.append(createErrorScreen(sewi.constants.CONFIGURATOR_ALERT_RELOAD_COMPONENT_ERROR_MESSAGE, initResViewer.bind(this)));
    }

    function resGalleryCrashed() {
        // Destructive removal (including all events)
        this.resGalleryView.children().remove();

        this.resGalleryView.append(createErrorScreen(sewi.constants.CONFIGURATOR_ALERT_RELOAD_COMPONENT_ERROR_MESSAGE, initResGallery.bind(this)));
    }

    function reportSeriousError() {

        if (this.alertsView.hasClass(sewi.constants.CONFIGURATOR_ACTIVE_ALERT_CLASS)) {
            return;
        }

        var reloadLink = $(sewi.constants.CONFIGURATOR_RELOAD_LINK_DOM);
        reloadLink.click(refreshPage);
        this.alertsView.text(sewi.constants.CONFIGURATOR_ALERT_GENERAL_ERROR_MESSAGE)
                          .append(reloadLink)
                          .addClass(sewi.constants.CONFIGURATOR_ACTIVE_ALERT_CLASS);
    }

    function refreshPage() {
        window.location.reload(true);
    }

    function refreshClicked(event) {

        var element = event.data.element;
        var callback = event.data.callback;

        element.remove();
        callback.call(this);
    }

    function minimizeToggled() {

        this.isBasicInfoMinimized = !this.isBasicInfoMinimized;
        updateViewSizes.call(this);
    }

    function allTabsClosed() {

        this.isResourceViewerHidden = true;
        updateViewSizes.call(this);
    }

    function galleryOpenedResource(event, resourceDOM) {
        openResource.call(this, resourceDOM);
    }

    // Configurator public methods

    /**
     * Changes the displayed title.
     *
     * @param {String} title    The main title text to be displayed.
     * @param {String} subtitle The smaller text to be displayed.
     */
    sewi.Configurator.prototype.setTitle = function(title, subtitle) {

        this.subtitleDOM.text(subtitle);
        this.titleDOM.text(title + ' ')
                        .append(this.subtitleDOM);
    };

    if (sewi.testMode) {
        sewi.Configurator.prototype.privates = {
            openResource: openResource,
        };
    }
})();
