
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
        'map':          '<label>&nbsp;</label><input type="text" /><span>:</span><input type="text" /><button class="remove">Remove</button>',
        'deps':         '<label>&nbsp;</label><input type="text" /><button class="remove">Remove</button>',
        'files':        '<label>&nbsp;</label><input type="text" /><button class="remove">Remove</button>',
        'ignore':       '<label>&nbsp;</label><input type="text" /><button class="remove">Remove</button>',
        'dependencies': '<label>&nbsp;</label><input type="text" /><span>:</span><input type="text" /><button class="remove">Remove</button>'
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
        var v = $(li).children('input').val();
        if (v) ary.push(v);
    });
    console.log(ary);
    return ary;
}

/**
 * Get the names and version numbers of dependencies
 * @param (DOM) $ul element
 **/
function getObjectList($ul) {
    obj = {};
    $ul.children().each(function(i, li) {
        var n = $(li).children('input').eq(0).val()
          , v = $(li).children('input').eq(1).val();
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
            renderRegistry();
            renderDirectory();
            break;
        case 'url':
            setRegistry();
            renderRegistry();
            renderDirectory();
            break;
        case 'version':
            renderRegistry();
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
        out = syntaxHighlight(out)
        $override_out.html(out);
    } else {
        $override_out.html('');
    }

}

function renderRegistry() {
    var registry = $registry.val()
      , url = $url.val()
      , out = '...\n';
    switch (registry) {
        case 'github':
            out += 'github:' + getGithubUsername(url) + '/' + getGithubRepository(url);
            break;
        case 'npm':
            out += 'npm:' + getNpmName(url);
            break;
    }
    out += '\n...';
    out = syntaxHighlight(out);
    $registry_out.html(out);
}
//
// https://github.com/dir/repo -> dir
function getGithubUsername(url) {
    return url.split('.')[1].split('/')[1];
}

// https://github.com/dir/repo -> repo
function getGithubRepository(url) {
    return url.split('.')[1].split('/')[2];
}

// https://www.npmjs.org/package/name -> name
function getNpmName(url) {
    return url.split('.')[2].split('/')[2];
}

function renderDirectory() {
    var reg = $registry.val()
      , url = $url.val()
      , ver = $version.val()
      , out = 'jspm/registry/' + reg + '/';

    switch (reg) {
        case 'github':
            var dir = getGithubRepository(url)
              , repo = getGithubRepository(url);
            out += dir + '/' + repo;
            break;
        case 'npm':
            var repo = getNpmName(url);
            out += repo;
    }
    out += '@' + ver + '.json';
    out = syntaxHighlight(out);
    $directory_out.html(out);
}

function setRegistry() {
    var u = $url.val()
      , reg;
    if (u.indexOf('github') != -1) reg = 'github';
    else if (u.indexOf('npm') != -1) reg = 'npm';
    $registry.val(reg).prop('checked', true).trigger('change');

}

// thanks Pumbaa80 http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function setResultColumnFixed() {
    var $fixed = $('.fixed')
      , $input = $('#input')
      , left = $input.offset().left + $input.outerWidth()
      , height = $(window).height();
    $fixed.css('left', left);
    $fixed.css('height', height);
}
setResultColumnFixed();

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
$rows.on('change', 'select', function() { document.dispatchEvent(renderOverrideEvent) });
$rows.on('click', 'button.add', addFieldRow);
$rows.on('click', 'button.add', function() { document.dispatchEvent(renderOverrideEvent) });
$rows.on('click', 'button.remove', remFieldRow);
$rows.on('click', 'button.remove', function() { document.dispatchEvent(renderOverrideEvent) });

