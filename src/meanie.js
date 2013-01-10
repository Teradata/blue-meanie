// TODO: add option to validated disabled fields
// TODO: add option for settimeout keyup

(function ($) {
    if (!$) throw 'BLUE MEANIE: What are you thinking? Everything requires jQuery and jQuery is everything.'

    'use strict';

    var opts, render, validate, rules = {}, fields = [], trigger, watch, init,
        setKeys, saveFormRules, cache = {}, createKey, timeout, getTargetRules,
        api = {}, msg = {}, vaildateObjFromTarget, submitEvent = 'submit.chief-meanie',
        inlineEvents = 'keyup.glove change.glove paste.glove', validateForm, addInputKey;

    // creates unique keys for hash table lookups
    createKey = function () {
        var s4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4());
    };

    // public api
    api.init = function (o) {

        if ((o.render && o.render === 'bootstrap') || typeof o.render === 'undefined') // default to bootstrap
            o.render = render;
        else if (typeof o.render === 'function') // developer defined render
            render = o.render;
        else // no rendering
            render = false;

        var $form, opts = $.extend({
            inline: true
        }, o);

        return this.each(function () {
            $form = $(this);
            setKeys(saveFormRules($form, opts));
            watch($form, opts);
        });
    };

    api.rules = function () { // return a copy of the rulesets
        var formkey = $.data(this, 'pepperland'), opts = cache[formkey], rulesets = opt ? opt.rulesets : [];
        return rulesets.slice(0);
    };

    api.add = function (ruleset, index) { // add a ruleset
        var formkey = $(this).data('pepperland'), opts = cache[formkey];

        addInputKey(cache[formkey].$form.find(ruleset.qrysel), ruleset, formkey);
        opts.rulesets.splice((typeof index === 'number' ? index : -1), 0, ruleset);
        return true;
    };

    api.remove = function (target) { // remove target
        var $this = $(this), formkey = $.data(this, 'pepperland'),
            opts = cache[formkey], rules, i = 0, len;

        if (!opts) return false;

        rules = opts.rulesets;
        len = rules ? rules.length : 0;
        for (i; i<len; i++) {
            if (qrysel === 'target') {
                rules.splice(i, 1);
                i--;
            }
        }

        return true;
    };

    api.destroy = function () { // TODO: add render clean ability???
        var $this = $(this), $target;

        $this.find(':input').each(function () {
            $target = $(this);
            if ($target.data('pepperlander')) $.removeData(this, 'pepperlander');
            if ($target.data('pepperland')) $.removeData(this, 'pepperland');
        });

        $.removeData(this, 'meanie');
        $.removeData(this, 'pepperland');
        $this.off(inlineEvents + ' ' + submitEvent);
    };

    api.validate = function (target, silent) { // validate target or form
        var verdicts = [];

        if (target.tagName === 'FORM')
            verdicts = validateForm(target, silent);
        else
            $(target).each(function () { verdicts.push(validate(vaildateObjFromTarget(this, silent))); });

        return verdicts;
    };

    api.addRule = function (rule) {
        msg[rule.name] = rule.msg;
        rules[rule.name] = rule.test;
    };

    // save rules to shared cache and add key to form data
    saveFormRules = function ($form, opts) {
        var key = createKey();

        $.data($form[0], 'pepperland', key);
        cache[key] = opts;
        cache[key].$form = $form; // cache a reference to the form
        return key;
    };

    addInputKey = function ($el, rules, formkey) {
        if (!cache[formkey].rulesets) return;

        var key = createKey(), kstack;

        rules.key = key;

        $el.each(function () { // add key to all elements in the selector
            kstack = $.data(this, 'pepperlander') || []; // target can have more than one rules stack assigned to it
            kstack.push(key);
            $.data(this, 'pepperlander', kstack);
            $.data(this, 'pepperland', formkey);
        });
    };

    // add keys to form elements
    setKeys = function (formkey) {
        if (!cache[formkey].rulesets) return;
        var i = 0, rules = cache[formkey].rulesets, len = rules.length, $el, key,
            kstack;

        for (i; i<len; i++)
            addInputKey(cache[formkey].$form.find(rules[i].qrysel), rules[i], formkey);
    };

    vaildateObjFromTarget = function (target, silent) {
        return {
            keys: $.data(target, 'pepperlander'),
            formkey: $.data(target, 'pepperland'),
            target: target,
            silent: silent
        }
    };

    validateForm = function (form, silent) {
        var $form = $(form), verdicts = [];

        $form.find(':input').filter(function () {
            if ($(this).data('pepperlander'))
                verdicts.push(validate(vaildateObjFromTarget(this, silent)));
        });

        return verdicts;
    };

    // add event listeners
    watch = function ($form, opts) {
        if (opts.inline) {
            $form.on(inlineEvents, function (e) {
                var keys = $.data(e.target, 'pepperlander'), formkey = $.data(e.target, 'pepperland'),
                    delay = e.type === 'keyup' ? 400 : 0;
                if (!keys || !formkey) return;

                if (timeout) clearTimeout(timeout);
                if (e.type === 'change' && e.target.type === 'text') return; // do not validate on text input change
                timeout = setTimeout(function () {
                    validate(vaildateObjFromTarget(e.target));
                }, delay);
            });
        } else {
            $form.on(submitEvent, function (e) {
                var verdicts = [], $this = $(this);

                e.preventDefault();
                $this.find(':input').filter(function () {
                    if ($(this).data('pepperlander'))
                        verdicts.push(validate(vaildateObjFromTarget(this)));
                });

                if (verdicts.length)
                    trigger({ verdicts: verdicts, $form: $this });
            });
        }
    };

    // trigger an event to which developers can bind
    trigger = function (args) {
        args.$form.trigger('meanie.validate', [args.verdicts]);
        if (render && typeof render === 'function') render({ verdicts: args.verdicts, $form: args.$form });
    };

    // get the rules for a target
    getTargetRules = function (rulesets, key) {
        var i = 0, len = rulesets.length;

        for (i; i<len; i++) {
            if (rulesets[i].key === key)
                return rulesets[i].rules;
        }

        return [];
    };

    // validate target; validation is trigger by watch()
    validate = function (args) {
        var opts = cache[args.formkey], inputrules, i = 0, len = 0, valid = true, vstack = [], k = 0, klen = 0,
            verdict = { $target: $(args.target), rules: [], msg: undefined, valid: true };
        if (!opts) return;

        klen = args.keys.length;
        for (k; k<klen; k++) { // loop through keys
            inputrules = getTargetRules(opts.rulesets, args.keys[k]);

            len = inputrules.length;
            for (i=0; i<len; i++) { // loop through rules for key
                try {
                    if (!args.target.disabled) {
                        if (inputrules[i].test) // custom rule
                            valid = inputrules[i].test(args.target, (inputrules[i].options || {}));
                        else
                            valid = rules[inputrules[i].name](args.target, (inputrules[i].options || {}));
                    }
                    verdict.rules.push(inputrules[i].name);
                    verdict.valid = valid;
                    if (!valid) {
                        verdict.rules = verdict.rules.slice(verdict.rules.length - 1);
                        verdict.msg = inputrules[i].options && inputrules[i].options.msg ? inputrules[i].options.msg : msg[inputrules[i].name];
                        verdict.options = inputrules[i].options || {};
                        break; // break the inner loop that iterates over the rule stack
                    }
                } catch (e) {
                    console.log(e);
                    throw 'BLUE MEANIE: Rule ' + inputrules.name + ' does not exist in pepperland. Please ask the chief to create the rule.';
                }
            }

            if (!valid) break;
        }

        if (opts.inline && !args.silent) trigger({ verdicts: [verdict], $form: opts.$form });
        return verdict;
    };

    $.fn.meanie = function (o) {
        if (api[o])
            return api[o].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof o === 'object' || !o)
            return api.init.apply(this, arguments);
        else
            throw 'BLUE MEANIE: Initialization failed or the method does not exist in pepperland.';
    };

})(jQuery);