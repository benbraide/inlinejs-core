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
const ref_1 = require("../directive/data/ref");
const refs_1 = require("../magic/data/refs");
const nexttick_1 = require("../magic/nexttick");
const each_1 = require("../directive/control/each");
(0, mocha_1.describe)('$nextTick global magic property', () => {
    (0, mocha_1.it)('should execute attached callback', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-ref="span" hx-text="foo"></span>
                <button hx-on:click="foo = 'baz'; $nextTick(() => { $refs.span.textContent = 'bob' })"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, ref_1.RefDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, refs_1.RefsMagicHandlerCompact)();
        (0, nexttick_1.NextTickMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => (0, chai_1.expect)(document.querySelector('span').textContent).equal('bob'));
    }));
    (0, mocha_1.it)('should wait for hx-each directive to finish rendering', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ list: ['one', 'two'], check: 2 }">
                <template hx-each="list">
                    <span hx-text="$each.value"></span>
                </template>
                <p hx-text="check"></p>
                <button hx-on:click="list = ['one', 'two', 'three']; $nextTick(() => { check = document.querySelectorAll('span').length })"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)({
            useGlobalWindow: true,
        });
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, nexttick_1.NextTickMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('p').textContent).equal('2');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('p').textContent).equal('3'); });
    }));
});
