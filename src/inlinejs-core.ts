import { WaitForGlobal } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from './directive/data/data';
import { ComponentDirectiveHandlerCompact } from './directive/data/component';
import { LocalsDirectiveHandlerCompact } from './directive/data/locals';
import { RefDirectiveHandlerCompact } from './directive/data/ref';

import { PostDirectiveHandlerCompact } from './directive/lifecycle/post';
import { UninitDirectiveHandlerCompact } from './directive/lifecycle/uninit';

import { StaticDirectiveHandlerCompact } from './directive/reactive/static';
import { EffectDirectiveHandlerCompact } from './directive/reactive/effect';

import { CloakDirectiveHandlerCompact } from './directive/cloak';

import { BindDirectiveHandlerCompact } from './directive/attr/bind';
import { ClassDirectiveHandlerCompact } from './directive/attr/class';
import { StyleDirectiveHandlerCompact } from './directive/attr/style';

import { TextDirectiveHandlerCompact } from './directive/flow/text';
import { HtmlDirectiveHandlerCompact } from './directive/flow/html';
import { OnDirectiveHandlerCompact } from './directive/flow/on';
import { ModelDirectiveHandlerCompact } from './directive/flow/model';

import { ShowDirectiveHandlerCompact } from './directive/show';

import { IfDirectiveHandlerCompact } from './directive/control/if';
import { ElseDirectiveHandlerCompact } from './directive/control/else';
import { EachDirectiveHandlerCompact } from './directive/control/each';

import { ComponentMagicHandlerCompact } from './magic/data/component';
import { LocalsMagicHandlerCompact } from './magic/data/locals';
import { RefsMagicHandlerCompact } from './magic/data/refs';
import { ScopeMagicHandlerCompact } from './magic/data/scope';
import { ProxyMagicHandlerCompact } from './magic/data/proxy';
import { NativeMagicHandlerCompact } from './magic/data/native';

import { StaticMagicHandlerCompact } from './magic/reactive/static';
import { UnoptimizedMagicHandlerCompact } from './magic/reactive/unoptimized';
import { WatchMagicHandlerCompact } from './magic/reactive/watch';

import { ArithmeticMagicHandlerCompact } from './magic/operations/arithmetic';
import { RelationalMagicHandlerCompact } from './magic/operations/relational';
import { LogicalMagicHandlerCompact } from './magic/operations/logical';

import { NextTickMagicHandlerCompact } from './magic/nexttick';
import { PickMagicHandlerCompact } from './magic/pick';
import { ClassMagicHandlerCompact } from './magic/class';
import { EvaluateMagicHandlerCompact } from './magic/evaluate';
import { DomMagicHandlerCompact } from './magic/dom';

WaitForGlobal().then(() => {
    DataDirectiveHandlerCompact();
    ComponentDirectiveHandlerCompact();
    LocalsDirectiveHandlerCompact();
    RefDirectiveHandlerCompact();

    PostDirectiveHandlerCompact();
    UninitDirectiveHandlerCompact();

    StaticDirectiveHandlerCompact();
    EffectDirectiveHandlerCompact();

    CloakDirectiveHandlerCompact();

    BindDirectiveHandlerCompact();
    ClassDirectiveHandlerCompact();
    StyleDirectiveHandlerCompact();

    TextDirectiveHandlerCompact();
    HtmlDirectiveHandlerCompact();
    OnDirectiveHandlerCompact();
    ModelDirectiveHandlerCompact();

    ShowDirectiveHandlerCompact();

    IfDirectiveHandlerCompact();
    ElseDirectiveHandlerCompact();
    EachDirectiveHandlerCompact();

    ComponentMagicHandlerCompact();
    LocalsMagicHandlerCompact();
    RefsMagicHandlerCompact();
    ScopeMagicHandlerCompact();
    ProxyMagicHandlerCompact();
    NativeMagicHandlerCompact();

    StaticMagicHandlerCompact();
    UnoptimizedMagicHandlerCompact();
    WatchMagicHandlerCompact();

    ArithmeticMagicHandlerCompact();
    RelationalMagicHandlerCompact();
    LogicalMagicHandlerCompact();

    NextTickMagicHandlerCompact();
    PickMagicHandlerCompact();
    ClassMagicHandlerCompact();
    EvaluateMagicHandlerCompact();
    DomMagicHandlerCompact();
});
