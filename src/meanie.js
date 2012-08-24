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
        watch($form, opts);
    };

    // save rules to shared cache and add key to form data
    saveFormRules = function ($form, opts) {
        var key = createKey();

        $.data($form[0], 'meanie-pepperland', key);
        cache[key] = opts;
        return key;
    };

    setKeys = function (formkey) {
        if (!cache[formkey].rules) return;
        var i = 0, rules = cache[formkey].rules, len = rules.length, $el, key;

        for (i; i<len; i++) {
            key = createKey();
            rules[i].key = key;
            $el = $(rules[i].qrysel);
            if ($el.length) {
                $.data($el[0], 'meanie', key);
                $.data($el[0], 'meanie-pepperland', formkey);
            }
        }
    };

    watch = function ($form, opts) {
        if (opts.inline) {
            $form.on('keyup.meanie-glove', function (e) { // TODO: bind all necessary event listeners
                var key = $.data(e.target, 'meanie'), formkey = $.data(e.target, 'meanie-pepperland');

                if (!key || !formkey) return;
                validate({ key: key, formkey: formkey, target: e.target });
            });
        } else {
            $form.on('submit.meanie-chief', function (e) {
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
        console.log(args);

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
            init($(this), opts);
        });

    };

})(jQuery);