$(function() {

var package_model = Backbone.Model.extend({
    defaults: {
        folder: null,
        filename: null,
        version: null
    }
});

var package_view = Backbone.View.extend({
    el: '#package',

    events: {
        'change input[name="github"]': 'setLocations',
        'change input[name="version"]': 'setVersion'
    },

    setLocations: function(e) {
        var url = e.target.value;
        var a = document.createElement('a');
        a.href = url;
        var paths = a.pathname.split('/');
        if (paths.length == 3) {
            this.model.set('folder', paths[1]);
            this.model.set('filename', paths[2]);
        } else {
            this.$('input[name="github"]').val('');
            this.$('input[name="github"]').attr('placeholder', 'I think the URL was invalid.');
        }
    },

    setVersion: function(e) {

    }
});

var override_model = Backbone.Model.extend({
    defaults: {
        /*
        main: null,
        browser: null,
        registry: null,
        dependencies: null,
        format: null,
        directories: null,
        files: null,
        ignore: null,
        map: null,
        shim: null,
        buildConfig: null
        */
    }
});

var override_view = Backbone.View.extend({
    el: '#override',

    events: {
        'keyup input[type="text"]': 'activateEntry',
        'change input[type="checkbox"]': 'toggleSubList',
        'change input[type="text"]': 'plainTextChange',

        'change input[name="main"]': 'setModelField',
        'change input[name="browser"]': 'setModelField',
        'change select[name="registry"]': 'setModelField',
        'change input[name="dependencies"]': 'setModelField',

        'change select[name="format"]': 'setModelField',
        'change input[name="lib"]': 'parseDirectories',
        'change input[name="dist"]': 'parseDirectories',
        'change input[name="deps"]': 'parseShim',
        'change input[name="exports"]': 'parseShim',
        'change input[name="minify"]': 'parseBuildConfig',
        'change input[name="transpile"]': 'parseBuildConfig',

        'click button.add': 'addLi',
        'click button.remove': 'removeLi'
    },

    initialize: function() {
        this.model.on('change', this.generateOverride, this);
    },

    activateEntry: function(e) {
        // make sure not plain field
        if (typeof e.target.attributes.name != 'unfefined') {
            var v = e.target.value;
            var active = v.length > 0;
            $(e.target).prev().prop('checked', active);
        }
    },

    setModelField: function(e) {
        var field = e.target.attributes.name.value;
        var value = e.target.value;
        this.model.set(field, value)
    },

    plainTextChange: function(e) {
        if (typeof e.target.attributes.name == 'undefined') {
            field = $(e.target).parent().parent().parent()
            .find('input[type="checkbox"]').attr('name').split('-')[0];

            console.log(field);

            switch (field) {
                case 'files':
                    this.parseFiles();
                    break;
                case 'ignore':
                    this.parseIgnore();
                    break;
                case 'deps':
                    this.parseShim();
                    break;
                case 'map':
                    this.parseMap();
                    break;
            }
        }
    },

    parseDirectories: function() {
        var lib_set  = this.$('input[name="lib-toggle"]').is(':checked');
        var dist_set = this.$('input[name="dist-toggle"]').is(':checked');
        var d = {};
        if (lib_set) {
            d.lib  = $('input[name="lib"]').val();
        }
        if (dist_set) {
            d.dist = $('input[name="dist"]').val();
        }
        if (!lib_set && !dist_set) {
            d = null;
        }
        this.model.set('directories', d);
    },

    parseFiles: function() {
        var ary = [];
        this.$('#files').children().each(function(i, li) {
            var val = $(li).children(0).val();
            if (val.length > 0) {
                ary.push(val);
            }
        });
        if (ary.length > 0) {
            this.model.set('files', ary);
        } else {
            this.model.set('files', null);
        }
    },

    parseIgnore: function() {
        var ary = [];
        this.$('#ignore').children().each(function(i, li) {
            var val = $(li).children(0).val();
            if (val.length > 0) {
                ary.push(val);
            }
        });
        if (ary.length > 0) {
            this.model.set('ignore', ary);
        } else {
            this.model.set('ignore', null);
        }
    },

    parseMap: function() {
        console.log('parsing map');
        var hash = {};
        this.$('#map').children().each(function(i, li) {
            var inputs = $(li).find('input');
            if (inputs[0].value.length > 0 && inputs[1].value.length > 0) {
                hash[inputs[0].value] = inputs[1].value;
            }
        });
        this.model.set('map', hash);
    },

    parseShim: function() {
        var dep_set = this.$('input[name="deps-toggle"]').is(':checked');
        var exp_set = this.$('input[name="exports-toggle"]').is(':checked');
        var $dep_ul = this.$('#deps');
        var deps = this.eachInputsVal($dep_ul);
        var obj;
        if (dep_set && !exp_set) {
            obj = deps;
        } else if (dep_set && exp_set) {
            var exp = this.$('input[name="exports"]').val();
            obj = {deps: deps, exports: exp}
        }
        this.model.set('shim', obj);
    },

    parseBuildConfig: function() {
        var ugl_set = this.$('input[name="minify"]').is(':checked');
        var tra_set = this.$('input[name="transpile"]').is(':checked');
        if (!ugl_set && !tra_set) {
            this.model.set('buildConfig', null);
        } else {
            var obj = {};
            if (ugl_set) {
                obj.minify = true;
            }
            if (tra_set) {
                obj.transpile = true;
            }
            this.model.set('buildConfig', obj);
        }
    },

    // returns an array of values from each input in a list
    eachInputsVal: function($ul) {
        var ary = [],
            val;
        $ul.children().each(function(i, li) {
            val = $(li).children(0).val();
            if (val.length > 0) {
                ary.push(val);
            }
        });
        return ary;
    },

    toggleSubList: function(e) {
        $e = $(e.target);
        $p = $e.parent()
        $p.find('> ul').toggleClass('visible');
        if (!$e.is(':checked')) {
            this.clearEntryBlock($e);
        }
    },

    clearEntryBlock: function($e) {
        $ul = $e.parent().find('> ul');
        $ul.find('input[type="text"]').val('');
        $ul.find('input[type="checkbox"]').prop('checked', false);
        var name = $e.attr('name').split('-')[0];
        // clear added entry fields
        switch (name) {
            case 'files':
                $ul.children().each(function(i, li) {
                    if (i != 0) {
                        $(li).remove();
                    }
                });
        }
        //
        this.model.set(name, null);
    },

    addLi: function(e) {
        e.preventDefault();
        $ul = this.getTargetUl(e);
        var i = $ul.children().length;
        var tpl = $ul.children(0).html()
        $ul.append('<li>' + tpl + '</li>');
    },

    removeLi: function(e) {
        e.preventDefault();
        $ul = this.getTargetUl(e);
        if ($ul.children().length > 1) {
            $ul.children().last().remove();
        }
    },

    getTargetUl: function(e) {
        return $(e.target).parent().find('ul');
    },

    generateOverride: function() {
        var package_data  = JSON.stringify( pm.toJSON(), null, 2);
        var override_data = JSON.stringify( om.toJSON(), null, 2);
        $('#output').val(override_data);
    }

    /*
    render: function() {
        this.$el.html();
        return this;
    }
    */
});

var pm = new package_model();
var pv = new package_view({ model: pm });

var om = new override_model();
var ov = new override_view({ model: om });

});
