Ext.onReady(function() {
    resizeWindowFn();

    // Resize the main window and tree on resize
    window.onresize = function() {
        if (!resizeWindows) {
            resizeWindows = setTimeout(resizeWindowFn, 100);
        }
    };

    if (req.standAloneMode) {
        if (window.location.href.match(/api/)) {
            req.baseDocURL = '../';
        } else if (window.location.href.match(/guide/)) {
            req.baseDocURL = '../';
        }
    }

    // History manager for compliant browsers
    if (window.history && window.history.pushState && !req.standAloneMode) {
        var ignoreInitialHistory = true;

        window.addEventListener('popstate', function(e) {
            e.preventDefault();

            if (ignoreInitialHistory) {
                ignoreInitialHistory = false;
                return false;
            }

            if (e.state && e.state.docClass) {
                getDocClass(e.state.docClass, true);
            }
            return false;
        }, false);
    }

    var classPackagesStore = new Ext.data.Store({
        model: 'Docs.ClassTreeModel',
        proxy: {
            type: 'ajax',
            url : req.baseDocURL + '/classes.json',
            reader: {
                type: 'json',
                root: 'rows'
            }
        },
        autoLoad: true,
        listeners: {
            load: function() {
                var nodes = convert(this.data)[0];
                nodes.expanded = true;
                Ext.create('Docs.ClassTree', {
                    root: nodes
                });
            }
        }
    });
});
