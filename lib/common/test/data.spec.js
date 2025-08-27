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
const on_1 = require("../directive/flow/on");
(0, mocha_1.describe)('hx-data directive', () => {
    (0, mocha_1.it)('should be reactive when manipulated on component object', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = (0, inlinejs_1.RandomString)(18);
        document.body.innerHTML = `
            <div hx-data="{ $config: { name: '${key}' }, foo: 'bar' }">
                <span hx-text="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        (0, inlinejs_1.GetGlobal)().FindComponentByName(key).GetRootProxy().GetNative()['foo'] = 'baz';
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should have an optional attribute value', () => {
        document.body.innerHTML = `
            <div hx-data>
                <span hx-text="'foo'"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo');
    });
    (0, mocha_1.it)('can use \'this\'', () => {
        document.body.innerHTML = `
            <div hx-data="{ text: this.dataset.text }" data-text="test">
              <span hx-text="text"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('test');
    });
    (0, mocha_1.it)('should contain reactive functions', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar', getFoo() {return this.foo}}">
                <span hx-text="getFoo()"></span>
                <button hx-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('can be nested as scopes', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
              <span hx-text="foo"></span>
              <span hx-text="$scope.foo"></span>
              <div hx-data="{ foo: 'baz', other: 'value' }">
                <span hx-text="foo"></span>
                <span hx-text="$scope.foo"></span>
                <span hx-text="$scope.other"></span>
                <span hx-text="$parent.foo"></span>
              </div>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz');
        (0, chai_1.expect)(document.querySelectorAll('span')[4].textContent).equal('value');
        (0, chai_1.expect)(document.querySelectorAll('span')[5].textContent).equal('bar');
    });
    (0, mocha_1.it)('should contain reactive scopes', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-text="foo"></span>
                <div hx-data="{ foo: 'baz' }">
                    <span hx-text="foo"></span>
                    <span hx-text="$scope.foo"></span>
                    <button hx-on:click="$scope.foo = 'changed'"></button>
                </div>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('changed');
        });
    }));
    (0, mocha_1.it)('should not nest and duplicate proxies when manipulating an array', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ list: [ {name: 'foo'}, {name: 'bar'} ] }">
                <span hx-text="list[0].name"></span>
                <button hx-on:click="list.sort((a, b) => (a.name > b.name) ? 1 : -1)"></button>
                <h1 hx-on:click="list.sort((a, b) => (a.name < b.name) ? 1 : -1)"></h1>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
    }));
    (0, mocha_1.it)('should refresh one time per update whatever the number of mutations in the update', () => __awaiter(void 0, void 0, void 0, function* () {
        globalThis['refreshCount'] = 0;
        document.body.innerHTML = `
            <div hx-data="{ items: ['foo', 'bar'], qux: 'quux', test() {this.items; this.qux; return ++globalThis.refreshCount} }">
                <span hx-text="test()"></span>
                <button hx-on:click="(() => { items.push('baz'); qux = 'corge'; })()"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)({
            useGlobalWindow: true,
        });
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(globalThis['refreshCount']).equal(1);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(globalThis['refreshCount']).equal(2); });
    }));
});
