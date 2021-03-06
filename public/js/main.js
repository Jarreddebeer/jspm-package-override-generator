
// DOM elements

var $package = $('input[name="package"]')
  , $version = $('input[name="version"]')
  , $rows = $('.row')

  , $main = $('input[name="main"]')
  , $format = $('#format')
  , $lib = $('input[name="lib"]')
  , $shim_file = $('input[name="shim-file"]')
  , $exports = $('#exports')

  , $main_tgl = $('input[name="main-toggle"]')
  , $dependencies_tgl = $('input[name="dependencies-toggle"]')
  , $lib_tgl = $('input[name="lib-toggle"]')
  , $format_tgl = $('input[name="format-toggle"]')
  , $directories_tgl = $('input[name="directories-toggle"]')
  , $files_tgl = $('input[name="files-toggle"]')
  , $ignore_tpl = $('input[name="ignore-toggle"]')
  , $map_tgl = $('input[name="map-toggle"]')
  , $shim_tgl = $('input[name="shim-toggle"]')
  , $shim_file_tgl = $('input[name="shim-file-toggle"]')
  , $deps_tgl = $('input[name="deps-toggle"]')
  , $exports_tgl = $('input[name="exports-toggle"]')

  , $registry_out = $('#registry-output')
  , $directory_out = $('#directory-output')
  , $override_out = $('#override-output')
  , $cli_out = $('#cli-output');


// helpers

// Get HTML template for the type of row of Unstable fields to be added
// @param (String) name
// @return (String) html
function getTemplate(name) {
    var templates = {
        'map':          '<label>&nbsp;</label><input type="text" /><span>:</span><input type="text" /><button class="remove btn btn-danger">X</button>',
        'deps':         '<label>&nbsp;</label><input type="text" /><button class="remove btn btn-danger">X</button>',
        'files':        '<label>&nbsp;</label><input type="text" /><button class="remove btn btn-danger">X</button>',
        'ignore':       '<label>&nbsp;</label><input type="text" /><button class="remove btn btn-danger">X</button>',
        'dependencies': '<label>&nbsp;</label><input type="text" /><span>:</span><input type="text" /><button class="remove btn btn-danger">X</button>'
    }
    return '<li>' + templates[name] + '</li>';
}

// $elements with 'name' attributes have not been generated dynamically and considered 'Stable'
// @param (DOM) $el
// @return (boolean)
function isStable($el) {
    return typeof $el.attr('name') != 'undefined';
}

// Get the name attribute of the Stable field, parent of the Unstable field
// @param (DOM) Unstable field
// @return (String) name attribute
function getName($el) {
    return $el.closest('.row').find('input[type="checkbox"]').attr('name').split('-')[0];
}

// Sets the toggle checkbox field, activating/deactivating the property
// @param (DOM) $el
// @param (Boolean)
function setToggleField($el, v) {
    var $chkbx = getToggleField($el);
    $chkbx.prop('checked', v);
}

// Selects the toggle field from the provided input $el
// @param (DOM) sibling element
// @return (DOM)
function getToggleField($el) {
    return $el.parent().find('> input[type="checkbox"].toggle');
}

// Get the accompanying $ul list of Unstable fields,
// either at 1 or 2 levels of depth from the main .row
// @param (DOM) el
// @return (DOM) ul
function getUl(el, level) {
    var $row = $(el).closest('.row')
      , nest_level = arguments[1] || $row.data('ul-level');
    if (nest_level == 2) return $row.find('> ul ul');
    return $row.find('> ul');
}

// Stable override variables

var dependencies = {};
var files = [];
var ignore = [];
var map = {};
var deps = [];

// Stable field helpers

// Get the names of files from the dynamic 'files' fields list
// @param (DOM) $ul
// @return (Array)
function getArrayList($ul) {
    var ary = [];
    $ul.children().each(function(i, li) {
        var v = $(li).children('input').val();
        if (v) ary.push(v);
    });
    return ary;
}

// Get the names and version numbers of dependencies
// @param (DOM) $ul
// @return (Object)
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

// map of methods for setting the Stable override variables based on the
// Unstable fields which have been dynamically added/removed/edited
function refreshStableVar(name) {
    switch (name) {
        case 'files':
            files = getArrayList($('#files'));
            break;
        case 'dependencies':
            dependencies = getObjectList($('#dependencies'));
            break;
        case 'ignore':
            ignore = getArrayList($('#ignore'));
            break;
        case 'map':
            map = getObjectList($('#map'));
            break;
        case 'deps':
            deps = getArrayList($('#deps'));
            break;
    }
}

// Empties the Stable variable
// @param (DOM)
function emptyStableVar($ul) {
    var name = getName($ul);
    switch (name) {
        case 'dependencies':
            dependencies = {};
            break;
        case 'files':
            files = [];
            break;
        case 'map':
            map = {};
            break;
        case 'deps':
            deps = [];
            break;
    }
}

//

// Parse text field on blur, activating Stable fields if value is non-empty
// or run appropriate method parsing on Unstable fields.
// @param (Event)
function parseField(e) {
    e.stopPropagation();
    var $el = $(this);
    if (isStable($el)) {
        var active;
        if ($el.is('input'))
            active = $el.val().length > 0;
        else if ($el.is('select'))
            active = $el.val() != '';
        else { /* TODO: throw error, unhandled field */ }
        setToggleField($el, active);
    }
    else refreshStableVar(getName($el));
    render();
}

// Toggle the display of the Unstable fields related to the Stable property
// @param (Event)
function toggleSubfields(e) {
    e.stopPropagation();
    $ul = getUl(this, 1);
    $ul.toggleClass('visible');
}

// Focus on the first non-empty input field in a list
function focusInput($ul) {
    var children = $ul.children();
    // console.log(children);
    var inp;
    for (var i = 0; i < children.length; i++) {
        inp = $( $(children[i]).find('input[type="text"]')[0] );
        if (!inp.val())
            break;
    }
    // console.log($(children[i]).val());
    setTimeout(function() {
        inp.focus();
    }, 10);
}

// Add a row of Unstable fields to the $ul, these can either be for a list (Array),
// or key-value (Object). The appropriate html template is retrieved based on this.
// @event (Button) click
// @param (Event)
function addFieldRow(e) {
    e.stopPropagation();
    var $ul  = getUl(this)
      , id   = $ul.attr('id')
      , $tgl = getToggleField($ul);
    $ul.append(getTemplate(id));
    focusInput($ul);
    if (!isChecked($tgl)) {
        setToggleField($(this), true);
        $ul.addClass('visible');
    }
    render();
}

// Remove a row of Unstable fields from the $ul
// @event (Button) click
function remFieldRow(e) {
    e.stopPropagation();
    var btn = this
      , $ul = getUl(btn);
    $(btn).parent().remove();
    if ($ul.children().length == 0) {
        setToggleField($ul, false);
        $ul.removeClass('visible');
        emptyStableVar($ul);
    } else {
        refreshStableVar(getName($ul));
    }
    render();
}

// Checks if a $checkbox is checked or not
// @param (DOM) $checkbox
// @return (Boolean)
function isChecked($chkbx) {
    return $chkbx.is(':checked');
}

// Mediator for rendering the appropriate json code block
// Called by change/add/remove to fields from 'parseField', 'addFieldRow', 'remFieldRow'
function render() {
    renderRegistry();
    renderDirectory();
    renderOverride();
}

// Render the actual Override json file contents
// A property on the json object will only be rendered if the toggle checkbox is active
function renderOverride() {
    o = {};

    if (isChecked($main_tgl))
        o.main = $main.val();
    if (isChecked($dependencies_tgl) && !$.isEmptyObject(dependencies))
        o.dependencies = dependencies;
    if (isChecked($format_tgl))
        o.format = $format.val();

    if (isChecked($directories_tgl)) {
        if (isChecked($lib_tgl)) {
            o.directories = {}
            if (isChecked($lib_tgl))
                o.directories.lib = $lib.val();
        }
    }

    if (isChecked($files_tgl) && files.length > 0)
        o.files = files;
    if (isChecked($ignore_tpl) && ignore.length > 0)
        o.ignore = ignore;
    if (isChecked($map_tgl) && !$.isEmptyObject(map))
        o.map = map;

    if (isChecked($shim_tgl)) {
        if (isChecked($shim_file_tgl)) {
            $shim_file.parent().siblings().removeClass('hidden');
            o.shim = {};
            var shim_key = $shim_file.val();
            o.shim[shim_key] = {}
            var shim_obj = o.shim[shim_key];
            if (isChecked($deps_tgl) && deps.length > 0 || isChecked($exports_tgl)) {
                if (isChecked($deps_tgl) && deps.length > 0)
                    shim_obj.deps = deps;
                if (isChecked($exports_tgl))
                    shim_obj.exports = $exports.val();
            }
        } else {
            $shim_file.parent().siblings().addClass('hidden');
        }
    }

    if (!$.isEmptyObject(o)) {
        var override_out = JSON.stringify(o, null, 2);
        override_out = syntaxHighlight(override_out)
        $override_out.html(override_out);

        var reg = $('input[name="endpoint"]:checked').val()
          , pkg = $package.val();
        if (reg && pkg) {
            var cli_out = 'jspm install ' + reg + '/' + pkg + ' -o ' + JSON.stringify(o);
            $cli_out.html(cli_out);
        } else {
            $cli_out.html('');
        }
    } else {
        $override_out.html('');
        $cli_out.html('');
    }

}

// Render the entry which needs to go into the  registry.json file,
// over at https://github.com/jspm/registry/blob/master/registry.json
function renderRegistry() {
    var reg = $('input[name="endpoint"]:checked').val()
      , pkg = $package.val()
      , out = reg + ':' + pkg;
    out = syntaxHighlight(out);
    $registry_out.html(out);
}

// Render the path of the Override file which needs to be created,
// A subfolder of https://github.com/jspm/registry/tree/master/package-overrides
function renderDirectory() {
    var reg = $('input[name="endpoint"]:checked').val()
      , pkg = $package.val()
      , ver = $version.val()
      , out = 'jspm/registry/package-overrides/' + reg + '/' + pkg;
    out += '@' + ver + '.json';
    out = syntaxHighlight(out);
    $directory_out.html(out);
}

// Parse text code generated in Override json, wrapping words with spans for highlighting
// Library-less implementation, code posted by Pumbaa80
// http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
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

// events from user input

$rows.on('keyup' , 'input[type="text"]'           , parseField      );
$rows.on('change', 'select'                       , parseField      );
$rows.on('change', 'input[type="radio"]'          , parseField      );
$rows.on('change', 'input[type="checkbox"].toggle', toggleSubfields );
$rows.on('click' , 'button.add'                   , addFieldRow     );
$rows.on('click' , 'button.remove'                , remFieldRow     );
$rows.on('change', 'input[type="checkbox"]'       , render          );

// run on document ready

// Set the column containing the rendered code to be fixed, allowing it to remain
// in view when scrolling through the input fields.
function setRenderColumnFixed() {
    var $code = $('#code')
      , $input = $('#input')
      , left = $input.offset().left + $input.outerWidth()
      , height = $(window).height();
    $code.css('left', left);
    $code.css('height', height);
    $input.css('height', height);
}
setRenderColumnFixed();

// clear the cache if outdated in the browser (using Github pages).
// Thanks to: http://stackoverflow.com/questions/12556593/determining-a-page-is-outdated-on-github-pages

// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);
