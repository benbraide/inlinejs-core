"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const dom_1 = require("@testing-library/dom");
const user_event_1 = require("@testing-library/user-event");
const inlinejs_1 = require("@benbraide/inlinejs");
const data_1 = require("../directive/data/data");
const text_1 = require("../directive/flow/text");
const component_1 = require("../directive/data/component");
const component_2 = require("../magic/data/component");
const on_1 = require("../directive/flow/on");
const unoptimized_1 = require("../magic/reactive/unoptimized");
(0, mocha_1.describe)('component', () => {
    (0, mocha_1.it)('can be initialized with the \'hx-component\' directive', () => {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data hx-component="${key}">
                <span hx-text="$name"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal(key);
    });
    (0, mocha_1.it)('can be initialized with the \'$config.name\' key during data initialization', () => {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ $config: { name: '${key}' } }">
                <span hx-text="$name"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal(key);
    });
    (0, mocha_1.it)('can retrieve the current component name via the \'$name\' global magic property', () => {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ $config: { name: '${key}' } }">
                <span hx-text="$name"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal(key);
    });
    (0, mocha_1.it)('can retrieve another component via the $component global magic property', () => {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }" hx-component="${key}"></div>
            <div hx-data>
                <span hx-text="$component('${key}').foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
    });
    (0, mocha_1.it)('should ensure data retrieved from other components are reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }" hx-component="${key}">
                <span hx-text="foo"></span>
                <button hx-on:click="foo = 'changed in ${key}'"></button>
            </div>
            <div hx-data="{ foo: 'baz' }">
                <span hx-text="foo"></span>
                <span hx-text="$component('${key}').foo"></span>
                <button hx-on:click="foo = 'unnamed changed'"></button>
                <button hx-on:click="$component('${key}').foo = 'changed in unnamed'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('baz');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('bar');
        user_event_1.default.click(document.querySelectorAll('button')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal(`changed in ${key}`);
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('baz');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal(`changed in ${key}`);
        });
        user_event_1.default.click(document.querySelectorAll('button')[1]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal(`changed in ${key}`);
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unnamed changed');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal(`changed in ${key}`);
        });
        user_event_1.default.click(document.querySelectorAll('button')[2]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('changed in unnamed');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unnamed changed');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('changed in unnamed');
        });
    }));
    (0, mocha_1.it)('should obey per region optimized setting when accessing data from other components', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ nested: {foo: 'bar'} }" hx-component="${key}">
                <span hx-text="nested.foo"></span>
                <button hx-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div hx-data="{ $config: { reactiveState: 'unoptimized' } }">
                <span hx-text="$component('${key}').nested.foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unoptimized'); });
    }));
    (0, mocha_1.it)('should obey \'$unoptimized\' global magic property when accessing data from other components', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ nested: {foo: 'bar'} }" hx-component="${key}">
                <span hx-text="nested.foo"></span>
                <button hx-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div hx-data>
                <span hx-text="$unoptimized($component('${key}').nested.foo)"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, unoptimized_1.UnoptimizedMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unoptimized'); });
    }));
    (0, mocha_1.it)('should not be affected by optimized settings in other components', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ nested: {foo: 'bar'} }" hx-component="${key}">
                <span hx-text="nested.foo"></span>
                <button hx-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div hx-data="{ $config: { reactiveState: 'optimized' } }">
                <span hx-text="$component('${key}').nested.foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('unoptimized'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar'); });
    }));
});
