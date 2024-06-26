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
const class_1 = require("../directive/attr/class");
const on_1 = require("../directive/flow/on");
(0, mocha_1.describe)('hx-class directive', () => {
    (0, mocha_1.it)('should remove class when attribute value is falsy', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: false }">
                <span class="foo" hx-class:foo="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(false);
    });
    (0, mocha_1.it)('should add class when attribute value is truthy', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: true }">
                <span hx-class:foo="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
    });
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: true }">
                <span hx-class:foo="foo"></span>
                <button hx-on:click="foo = false"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(false); });
    }));
    (0, mocha_1.it)('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div hx-data="{ map: { foo: true, zoo: false } }">
                <span hx-class="map"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('zoo')).equal(false);
    });
    (0, mocha_1.it)('should have reactive key-value map', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ map: { foo: true, zoo: false } }">
                <span hx-class="map"></span>
                <button hx-on:click="map.foo = !(map.zoo = true)"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('zoo')).equal(false);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(false); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').classList.contains('zoo')).equal(true); });
    }));
    (0, mocha_1.it)('should accept the short form and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: true }">
                <span .foo="foo"></span>
                <button hx-on:click="foo = false"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(false); });
    }));
    (0, mocha_1.it)('should be merged by string syntax', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ isOn: false }">
                <span class="foo" hx-class="isOn ? 'bar': ''"></span>
                <button hx-on:click="isOn = ! isOn"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(false);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
            (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
        });
        document.querySelector('button').click();
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
            (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(false);
        });
    }));
    (0, mocha_1.it)('should be merged by array syntax', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ isOn: false }">
                <span class="foo" hx-class="isOn ? ['bar', 'baz'] : ['bar']"></span>
                <button hx-on:click="isOn = ! isOn"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('baz')).equal(false);
        document.querySelector('button').click();
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
            (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
            (0, chai_1.expect)(document.querySelector('span').classList.contains('baz')).equal(true);
        });
        document.querySelector('button').click();
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
            (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
            (0, chai_1.expect)(document.querySelector('span').classList.contains('baz')).equal(false);
        });
    }));
    (0, mocha_1.it)('should remove multiple classes by object syntax', () => {
        document.body.innerHTML = `
            <div hx-data="{ isOn: false }">
                <span class="foo bar" hx-class="{ 'foo bar': isOn }"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(false);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(false);
    });
    (0, mocha_1.it)('should add multiple classes by object syntax', () => {
        document.body.innerHTML = `
            <div hx-data="{ isOn: true }">
                <span hx-class="{ 'foo bar': isOn }"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
    });
    (0, mocha_1.it)('should be added by array syntax', () => {
        document.body.innerHTML = `
            <div hx-data>
                <span class="" hx-class="['foo', 'bar']"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
    });
    (0, mocha_1.it)('should be synced by string syntax', () => {
        document.body.innerHTML = `
            <div hx-data="{foo: 'bar baz'}">
                <span class="" hx-class="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('baz')).equal(true);
    });
    (0, mocha_1.it)('should ignore extra whitespace in object syntax', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data>
                <span hx-class="{ '  foo  bar  ': true }"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
    }));
    (0, mocha_1.it)('should ignore extra whitespace in string syntax', () => {
        document.body.innerHTML = `
            <div hx-data>
                <span hx-class="'  foo  bar  '"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').classList.contains('foo')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').classList.contains('bar')).equal(true);
    });
});
