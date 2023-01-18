"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSCore = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const code_1 = require("./concept/code");
const data_1 = require("./directive/data/data");
const component_1 = require("./directive/data/component");
const locals_1 = require("./directive/data/locals");
const ref_1 = require("./directive/data/ref");
const post_1 = require("./directive/lifecycle/post");
const uninit_1 = require("./directive/lifecycle/uninit");
const static_1 = require("./directive/reactive/static");
const effect_1 = require("./directive/reactive/effect");
const cloak_1 = require("./directive/cloak");
const bind_1 = require("./directive/attr/bind");
const class_1 = require("./directive/attr/class");
const style_1 = require("./directive/attr/style");
const text_1 = require("./directive/flow/text");
const html_1 = require("./directive/flow/html");
const on_1 = require("./directive/flow/on");
const model_1 = require("./directive/flow/model");
const show_1 = require("./directive/show");
const code_2 = require("./directive/code");
const if_1 = require("./directive/control/if");
const else_1 = require("./directive/control/else");
const each_1 = require("./directive/control/each");
const component_2 = require("./magic/data/component");
const locals_2 = require("./magic/data/locals");
const refs_1 = require("./magic/data/refs");
const scope_1 = require("./magic/data/scope");
const proxy_1 = require("./magic/data/proxy");
const native_1 = require("./magic/data/native");
const static_2 = require("./magic/reactive/static");
const unoptimized_1 = require("./magic/reactive/unoptimized");
const watch_1 = require("./magic/reactive/watch");
const arithmetic_1 = require("./magic/operations/arithmetic");
const relational_1 = require("./magic/operations/relational");
const logical_1 = require("./magic/operations/logical");
const nexttick_1 = require("./magic/nexttick");
const pick_1 = require("./magic/pick");
const class_2 = require("./magic/class");
const evaluate_1 = require("./magic/evaluate");
const dom_1 = require("./magic/dom");
const code_3 = require("./magic/code");
const inline_1 = require("./magic/inline");
function InlineJSCore() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, inlinejs_1.GetGlobal)().SetConcept('code', new code_1.CodeConcept);
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, locals_1.LocalsDirectiveHandlerCompact)();
        (0, ref_1.RefDirectiveHandlerCompact)();
        (0, post_1.PostDirectiveHandlerCompact)();
        (0, uninit_1.UninitDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, effect_1.EffectDirectiveHandlerCompact)();
        (0, cloak_1.CloakDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, class_1.ClassDirectiveHandlerCompact)();
        (0, style_1.StyleDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, html_1.HtmlDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, show_1.ShowDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, else_1.ElseDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, code_2.CodeDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, locals_2.LocalsMagicHandlerCompact)();
        (0, refs_1.RefsMagicHandlerCompact)();
        (0, scope_1.ScopeMagicHandlerCompact)();
        (0, proxy_1.ProxyMagicHandlerCompact)();
        (0, native_1.NativeMagicHandlerCompact)();
        (0, static_2.StaticMagicHandlerCompact)();
        (0, unoptimized_1.UnoptimizedMagicHandlerCompact)();
        (0, watch_1.WatchMagicHandlerCompact)();
        (0, arithmetic_1.ArithmeticMagicHandlerCompact)();
        (0, relational_1.RelationalMagicHandlerCompact)();
        (0, logical_1.LogicalMagicHandlerCompact)();
        (0, nexttick_1.NextTickMagicHandlerCompact)();
        (0, pick_1.PickMagicHandlerCompact)();
        (0, class_2.ClassMagicHandlerCompact)();
        (0, evaluate_1.EvaluateMagicHandlerCompact)();
        (0, dom_1.DomMagicHandlerCompact)();
        (0, code_3.CodeMagicHandlerCompact)();
        (0, inline_1.InlineJSMagicHandlerCompact)();
    });
}
exports.InlineJSCore = InlineJSCore;