$(function() {

var override_model = Backbone.Model.extend({
    defaults: {
        main: null,
        format: null,
        directories: null,
        map: null,
        shim: null,
        buildConfig: null
    }
});

var override_view = Backbone.View.extend({
    el: '#form',

    events: {
        'keyup input[type="text"]': 'activateEntry',
        'change input[type="text"]': 'updateModel',
        'change input[type="checkbox"]': 'toggleSubList',
        'click button.add': 'addLi',
        'click button.remove': 'removeLi'
    },

    activateEntry: function(e) {
        var v = e.target.value;
        var checked = v.length > 0;
        $(e.target).prev().prop('checked', checked);
    },

    updateModel: function(e) {
        var field = e.target.attributes.name.value;
        var value = e.target.value;
        switch (field) {
            case 'main':
                this.setModelField(field, value);
            case 'format':
                this.setModelField(field, value);
            case 'lib':
                this.parseDirectories();
            case 'dist':
                this.parseDirectories();

        }
    },

    setModelField: function(field, value) {
        this.model.set(field, value)
        console.log(this.model.attributes);
    },

    parseDirectories: function() {
        var lib_set  = $('input[name="lib-toggle"]').is(':checked');
        var dist_set = $('input[name="dist-toggle"]').is(':checked');
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
        console.log(this.model);
    },

    toggleSubList: function(e) {
        console.log(e);
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
        //
        var name = $e.attr('name').split('-')[0];
        this.model.set(name, null);
        console.log('cleared.');
        console.log(this.model);
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

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});

var om = new override_model();
var ov = new override_view({ model: om });

});
