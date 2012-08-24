(function ($) {

    'use strict';

    var opts, render, validate, rules = {}, fields = [], trigger, watch, init,
        setKeys, saveFormRules, cache = {}, createKey;

    // creates unique keys for hash table lookups
    createKey = function () {
        var s4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4());
    };

    init = function ($form, opts) {
        setKeys(saveFormRules($form, opts));
        watch($form);
    };

    // save rules to shared cache and add key to form data
    saveFormRules = function ($form, opts) {
        var key = createKey();
        $.data($form, 'meanie-pepperland', key);
        cache[key] = opts;
        return key;
    };

    setKeys = function (formkey) {
        var p, key, $el;

        for (p in cache[formkey].rules) { // loop through rules and create keys to map rules to form elements
            key = createKey();
            p.key = key;
            $el = $(p.qrysel);
            $.data($el, 'meanie', key);
            $.data($el, 'meanie-pepperland', formkey);
        }
    };

    watch = function ($form opts) {
        if (opts.inline) {
            $form.on('change.meanie-glove', function (e) { // TODO: bind all necessary event listeners
                var $target = $(e.target), key = $.data($target, 'meanie'),
                    formkey = $.data($target, 'meanie-pepperland');

                if (!key || !formkey) return;
                validate({ key: key, formkey: formkey, $el: $target });
            });
        } else {
            $form.on('submit.meanie-chief'. function (e) {
                return;
            });
        }
    };

    // trigger an event to which developers can bind
    trigger = function (verdicts) {
        // verdicts = {
        //     $field: $(),
        //     rule: '',
        //     valid: true
        // };

        $({}).trigger('meanie.validate', verdicts);
    };

    // rules
    rules.required = function () {

    };

    render = function () {

    };

    validate = function (args) {
        var opts = cache[args.formkey];
        if (!opts) return;
    };


    $.fn.meanie = function (o) {

        opts = $.extend({
            render: render,
            inline: true
        }, o);

        return this.each(function () {
            // TODO: add switch for plugin methods
            init(this, opts);
        });

    };

})(jQuery);