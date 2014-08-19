
// Package details

var $registry = $('input[name="registry"]')
  , $url = $('input[name="url"]')
  , $version = $('input[name="version"]')
  , $main = $('#main')
  , $rows = $('.row')

  , $browser = $('input[name="browser"]')
  , $format = $('#format')
  , $lib = $('input[name="lib"]')
  , $dist = $('input[name="dist"]')
  , $exports = $('#exports')
  , $minify = $('#minify')
  , $transpile = $('#transpile')

  , $main_tgl = $('input[name="main-toggle"]')
  , $browser_tgl = $('input[name="browser-toggle"]')
  , $dependencies_tgl = $('input[name="dependencies-toggle"]')
  , $lib_tgl = $('input[name="lib-toggle"]')
  , $dist_tgl = $('input[name="dist-toggle"]')
  , $format_tgl = $('input[name="format-toggle"]')
  , $directories_tgl = $('input[name="directories-toggle"]')
  , $files_tgl = $('input[name="files-toggle"]')
  , $ignore_tpl = $('input[name="ignore-toggle"]')
  , $map_tgl = $('input[name="map-toggle"]')
  , $shim_tgl = $('input[name="shim-toggle"]')
  , $deps_tgl = $('input[name="deps-toggle"]')
  , $exports_tgl = $('input[name="exports-toggle"]')
  , $buildConfig_tgl = $('input[name="buildconfig-toggle"]')

  , $registry_out = $('#registry-output')
  , $directory_out = $('#directory-output')
  , $override_out = $('#override-output');

// templates

function getTemplate(name) {
    var templates = {
        'map':          '<input type="text" />: <input type="text" /><button class="remove">Remove</button>',
        'deps':         '<input type="text" /><button class="remove">Remove</button>',
        'files':        '<input type="text" /><button class="remove">Remove</button>',
        'ignore':       '<input type="text" /><button class="remove">Remove</button>',
        'dependencies': '<input type="text" />: <input type="text" /><button class="remove">Remove</button>'
    }
    return '<li>' + templates[name] + '</li>';
}

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

function setToggleField($el, v) {
    var $chkbx = getToggleField($el);
    $chkbx.prop('checked', v);
}

function getToggleField($el) {
    return $el.parent().find('> input[type="checkbox"].toggle');
}

/**
 * Get the accompanying $ul list of Unstable fields
 * @param (DOM) el
 * @return ($DOM) $ul
 **/
function getUl(el, level) {
    var $row = $(el).closest('.row')
      , nest_level = arguments[1] || $row.data('ul-level');
    if (nest_level == 2) return $row.find('> ul ul');
    return $row.find('> ul');
}

// global variables

var dependencies = {};
var files = [];
var ignore = [];
var map = {};
var deps = [];

// private

/**
 * Get the names of files from the dynamic 'files' fields
 * @param (DOM) $ul element
 **/
function getArrayList($ul) {
    var ary = [];
    $ul.children().each(function(i, li) {
        var v = $(li).children(0).val();
        if (v) ary.push(v);
    });
    return ary;
}

/**
 * Get the names and version numbers of dependencies
 * @param (DOM) $ul element
 **/
function getObjectList($ul) {
    obj = {};
    $ul.children().each(function(i, li) {
        var n = $(li).children().eq(0).val()
          , v = $(li).children().eq(1).val();
        if (n && v)
            obj[n] = v;
    });
    return obj;
}

var parse = {
    'files': function() {
        files = getArrayList($('#files'));
    },
    'dependencies': function() {
        dependencies = getObjectList($('#dependencies'));
    },
    'ignore': function() {
        ignore = getArrayList($('#ignore'));
    },
    'map': function() {
        map = getObjectList($('#map'));
    },
    'deps': function() {
        deps = getArrayList($('#deps'));
    }
}

// public

/**
 * Parse text fields, activating Stable fields if value is non-empty
 * or run the appropriate method on Unstable fields.
 **/
function parseField(e) {
    e.stopPropagation();
    var $el = $(this);
    if (isStable($el)) {
        var active;
        if ($el.is('input'))
            active = $el.val().length > 0;
        else if ($el.is('select'))
            active = $el.val() != '';
        else { /* TODO: throw error */ }
        setToggleField($el, active);
    }
    else parse[getName($el)]();
}

/**
 * Toggle the display of the Unstable fields related to the property
 **/
function toggleSubfields(e) {
    e.stopPropagation();
    $ul = getUl(this, 1);
    $ul.toggleClass('visible');
}

/**
 * Add a row of Unstable fields to the $ul
 **/
function addFieldRow(e) {
    e.stopPropagation();
    var $ul = getUl(this)
      , id  = $ul.attr('id');
    $ul.append(getTemplate(id));
    if (!$ul.children().length == 0) {
        setToggleField($(this), true);
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
        setToggleField($ul, false);
        $ul.removeClass('visible');
        cleanField($ul);
    } else {
        parse[getName($ul)]();
    }
}

/**
 * Empties the associated variable
 **/
function cleanField($ul) {
    var name = getName($ul);
    // TODO: abstract this
    if (name == 'dependencies')
        dependencies = {};
    else if (name == 'files')
        files = [];
    else if (name == 'map')
        map = {};
    else if (name == 'deps')
        deps = [];
}

function isChecked($el) {
    return $el.is(':checked');
}

function render() {
    var $el = $(this)
      , name = getName($el);
    switch (name) {
        case 'registry':
            renderDirectory();
            break;
        case 'url':
            setRegistry();
            renderDirectory();
            break;
        case 'version':
            renderDirectory();
            break;
        default:
            renderOverride();
            break;
    }
}

function renderOverride() {
    o = {};

    if (isChecked($main_tgl))
        o.main = $main.val();
    if (isChecked($browser_tgl))
        o.browser = $browser.val();
    if (isChecked($dependencies_tgl) && !$.isEmptyObject(dependencies))
        o.dependencies = dependencies;
    if (isChecked($format_tgl))
        o.format = $format.val();

    if (isChecked($directories_tgl)) {
        if (isChecked($lib_tgl) || isChecked($dist_tgl)) {
            o.directories = {}
            if (isChecked($lib_tgl))
                o.directories.lib = $lib.val();
            if (isChecked($dist_tgl))
                o.directories.dist = $dist.val();
        }
    }

    if (isChecked($files_tgl) && files.length > 0)
        o.files = files;
    if (isChecked($ignore_tpl) && ignore.length > 0)
        o.ignore = ignore;
    if (isChecked($map_tgl) && !$.isEmptyObject(map))
        o.map = map;

    if (isChecked($shim_tgl)) {
        if (isChecked($deps_tgl) && deps.length > 0 || isChecked($exports_tgl)) {
            o.shim = {};
            if (isChecked($deps_tgl) && deps.length > 0)
                o.shim.deps = deps;
            if (isChecked($exports_tgl))
                o.shim.exports = $exports.val();
        }
    }

    if (isChecked($buildConfig_tgl)) {
        if (isChecked($minify) || isChecked($transpile)) {
            o.buildConfig = {};
            if (isChecked($minify))
                o.buildConfig.minify = true;
            if (isChecked($transpile))
                o.buildConfig.transpile = true;
        }
    }

    if (!$.isEmptyObject(o)) {
        var out = JSON.stringify(o, null, 2);
        $override_out.val(out);
    } else {
        $override_out.val('');
    }

}

function renderRegistry() {
    $registry_out.val($registry.val());
}

function renderDirectory() {
    var reg = $registry.val()
      , url = $url.val()
      , ver = $version.val()
      , out = 'jspm/registry/' + reg + '/';

    switch (reg) {
        case 'github':
            var dir = url.split('.')[1].split('/')[1]  // https://github.com/dir/repo -> dir
              , repo = url.split('.')[1].split('/')[2] // https://github.com/dir/repo -> repo
            out += dir + '/' + repo;
            break;
        case 'npm':
            var repo = url.split('.')[2].split('/')[2] // https://www.npmjs.org/package/name -> name
            out += repo;
    }
    out += '@' + ver + '.json';
    $directory_out.val(out);
}

function setRegistry() {
    var u = $url.val()
      , reg;
    if (u.indexOf('github') != -1) reg = 'github';
    else if (u.indexOf('npm') != -1) reg = 'npm';
    $registry.val(reg).prop('checked', true).trigger('change');

}


var renderOverrideEvent  = new CustomEvent('render-override');
var renderRegistryEvent  = new CustomEvent('render-registry');
var renderDirectoryEvent = new CustomEvent('render-directory');

document.addEventListener('render-override' , renderOverride);
document.addEventListener('render-registry' , renderRegistry);
document.addEventListener('render-directory', renderDirectory);

$rows.on('keyup', 'input[type="text"]', parseField);
$rows.on('keyup', 'input[type="text"]', render);
$rows.on('change', 'select', parseField);
$rows.on('change', 'input[type="radio"]', parseField);

$rows.on('change', 'input[type="checkbox"].toggle', toggleSubfields);
$rows.on('change', 'input[type="checkbox"]', function() { document.dispatchEvent(renderOverrideEvent) });
$rows.on('click', 'button.add', addFieldRow);
$rows.on('click', 'button.add', function() { document.dispatchEvent(renderOverrideEvent) });
$rows.on('click', 'button.remove', remFieldRow);
$rows.on('click', 'button.remove', function() { document.dispatchEvent(renderOverrideEvent) });


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
