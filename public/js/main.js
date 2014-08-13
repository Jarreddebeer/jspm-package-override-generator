
// Package details

var registry = $('input[name="registry"]')
  , main = $('#main')
  , rows = $('.row');

// templates

var dependencies_tpl = '<input type="text" />: <input type="text" /><button class="remove">Remove</button>';

// helpers

/**
 * $elements with 'name' attributes are not generated dynamically and considered 'Stable'
 * @param (DOM) $el
 * @return (boolean)
 **/
function isStable($el) {
    return typeof $el.attr('name') != 'undefined';
}

/**
 * Find the name of the Stable field from which
 * the (dynamically generated) Unstable field is associated
 * @param (DOM) Unstable field $element
 * @return (String) name attribute
 **/
function getName($el) {
    return $el.closest('.row').find('input[type="checkbox"]').attr('name').split('-')[0];
}

function setActivateField($el, v) {
    var $chkbx = getActivateField($el);
    $chkbx.prop('checked', v);
}

function getActivateField($el) {
    return $el.closest('.row').find('> input[type="checkbox"].toggle');
}

/**
 * Get the accompanying $ul list of Unstable fields
 * @param (DOM) el
 * @return ($DOM) $ul
 **/
function getUl(el) {
    return $(el).closest('.row').find('> ul');
}


// global variables

var files = [];
var dependencies = {};

// private

/**
 * Get the names of files from the dynamic 'files' fields
 **/
function getFiles() {
    files = [];
    $('#files').children().each(function(i, li) {
        var v = $(li).children(0).val();
        if (v) files.push(v);
    });
}

/**
 * Get the names and version numbers of dependencies
 **/
function getDependencies() {
    dependencies = {};
    $('#dependencies').children().each(function(i, li) {
        var n = $(li).children().eq(0).val()
          , v = $(li).children().eq(1).val();
        dependencies[n] = v;
    });
}

var parse = {
    'files': getFiles,
    'dependencies': getDependencies
}

// public

/**
 * Parse text fields, activating Stable fields if value is non-empty
 * or run the appropriate method on Unstable fields.
 **/
function parseTextField() {
    var $el = $(this);
    if (isStable($el)) {
        var active = (($el.val().length > 0) ? true : false);
        setActivateField($el, active);
    }
    else parse[getName($el)]();
}

/**
 * Toggle the display of the Unstable fields related to the property
 **/
function toggleSubfields() {
    $ul = getUl(this);
    $ul.toggleClass('visible');
}

/**
 * Add a row of Unstable fields to the $ul
 **/
function addFieldRow() {
    $ul = getUl(this);
    $ul.append('<li>' + dependencies_tpl + '</li>');
    if (!$ul.children().length == 0) {
        setActivateField($(this), true);
        $ul.addClass('visible');
    }
}

/**
 * Remove a row of Unstable fields from the $ul
 **/
function remFieldRow() {
    var btn = this
      , $ul = getUl(btn);
    $(btn).parent().remove();
    if ($ul.children().length == 0) {
        setActivateField($ul, false);
        $ul.removeClass('visible');
    }
}

rows.on('keyup', 'input[type="text"]', parseTextField);
rows.on('change', 'input[type="checkbox"].toggle', toggleSubfields);
rows.on('click', 'button.add', addFieldRow);
rows.on('click', 'button.remove', remFieldRow);


/*




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
    setVersion: function(e) { }

var override_model = Backbone.Model.extend({
    defaults: {
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
    }
});

var override_view = Backbone.View.extend({

    el: '#override',

    events: {
        'keyup input[type="text"]': 'entryKeyup',
        'change input[type="checkbox"]': 'toggleSubList',
        'change input[type="text"]': 'plainTextChange',
        //
        'keyup input[name="main"]': 'setModelField',
        'keyup input[name="browser"]': 'setModelField',
        'change input[type="radio"]': 'setModelField',
        'keyup input[name="dependencies"]': 'setModelField',
        //
        'change select[name="format"]': 'setModelField',
        'keyup input[name="lib"]': 'parseDirectories',
        'keyup input[name="dist"]': 'parseDirectories',
        'keyup input[name="deps"]': 'parseShim',
        'keyup input[name="exports"]': 'parseShim',
        'keyup input[name="minify"]': 'parseBuildConfig',
        'keyup input[name="transpile"]': 'parseBuildConfig',
        //
        'click button.add': 'addLi',
        'click button.remove': 'removeLi',
    },

    initialize: function() {
        this.model.on('change', this.generateOverride, this);
    },

    entryKeyup: function(e) {
        this.activateEntry(e);
        this.plainTextChange(e);
        this.generateOverride();
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
                case 'dependencies':
                    this.parseDependencies();
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

    parseDependencies: function() {
        console.log('parsing dependencies');
        var hash = {};
        this.$('#dependencies').children().each(function(i, li) {
            var inputs = $(li).find('input');
            if (inputs[0].value.length > 0 && inputs[1].value.length > 0) {
                hash[inputs[0].value] = inputs[1].value;
            }
        });
        this.model.set('dependencies', hash);
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
        json = this.model.toJSON();
        out_obj = {};
        _.each(Object.keys(json), function(key) {
            if (typeof json[key] != undefined && json[key] != null && json[key] != '') {
                out_obj[key] = json[key];
            }
        });
        var out;
        if (Object.keys(out_obj).length > 0) {
            out = JSON.stringify(out_obj, null, 2);
        } else {
            out = '';
        }
        $('#output').val(out);
    }

});

var pm = new package_model()
  , pv = new package_view({model: pm});
  , om = new override_model();
  , ov = new override_view({model: om});

*/