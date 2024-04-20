import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';

import { CodeConcept } from './concepts/code';
import { ResourceConcept } from './concepts/resource';

import { DataDirectiveHandlerCompact } from './directive/data/data';
import { ComponentDirectiveHandlerCompact } from './directive/data/component';
import { LocalsDirectiveHandlerCompact } from './directive/data/locals';
import { RefDirectiveHandlerCompact } from './directive/data/ref';

import { InitDirectiveHandlerCompact } from './directive/lifecycle/init';
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

import { CodeDirectiveHandlerCompact } from './directive/code';

import { CooldownDirectiveHandlerCompact } from './directive/cooldown';

import { LogDirectiveHandlerCompact } from './directive/log';

import { IfDirectiveHandlerCompact } from './directive/control/if';
import { ElseDirectiveHandlerCompact } from './directive/control/else';
import { EachDirectiveHandlerCompact } from './directive/control/each';

import { ComponentMagicHandlerCompact } from './magic/data/component';
import { LocalsMagicHandlerCompact } from './magic/data/locals';
import { RefsMagicHandlerCompact } from './magic/data/refs';
import { ScopeMagicHandlerCompact } from './magic/data/scope';
import { ProxyMagicHandlerCompact } from './magic/data/proxy';
import { NativeMagicHandlerCompact } from './magic/data/native';
import { StoreMagicHandlerCompact } from './magic/data/store';
import { ResourceMagicHandlerCompact } from './magic/data/resource';

import { StaticMagicHandlerCompact } from './magic/reactive/static';
import { UnoptimizedMagicHandlerCompact } from './magic/reactive/unoptimized';
import { WatchMagicHandlerCompact } from './magic/reactive/watch';

import { ArithmeticMagicHandlerCompact } from './magic/operations/arithmetic';
import { RelationalMagicHandlerCompact } from './magic/operations/relational';
import { LogicalMagicHandlerCompact } from './magic/operations/logical';

import { NextTickMagicHandlerCompact } from './magic/nexttick';
import { PickMagicHandlerCompact } from './magic/pick';

import { AttributeMagicHandlerCompact } from './magic/attribute';
import { ClassMagicHandlerCompact } from './magic/class';
import { StyleMagicHandlerCompact } from './magic/style';

import { EvaluateMagicHandlerCompact } from './magic/evaluate';
import { DomMagicHandlerCompact } from './magic/dom';

import { CodeMagicHandlerCompact } from './magic/code';
import { InlineJSMagicHandlerCompact } from './magic/inline';
import { WaitingMagicHandlerCompact } from './magic/waiting';

export function InlineJSCore(){
    WaitForGlobal().then(() => {
        GetGlobal().SetConcept('code', new CodeConcept);
        GetGlobal().SetConcept('resource', new ResourceConcept());
        
        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        LocalsDirectiveHandlerCompact();
        RefDirectiveHandlerCompact();

        InitDirectiveHandlerCompact();
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

        CodeDirectiveHandlerCompact();

        CooldownDirectiveHandlerCompact();

        LogDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();
        LocalsMagicHandlerCompact();
        RefsMagicHandlerCompact();
        ScopeMagicHandlerCompact();
        ProxyMagicHandlerCompact();
        NativeMagicHandlerCompact();
        StoreMagicHandlerCompact();
        ResourceMagicHandlerCompact();

        StaticMagicHandlerCompact();
        UnoptimizedMagicHandlerCompact();
        WatchMagicHandlerCompact();

        ArithmeticMagicHandlerCompact();
        RelationalMagicHandlerCompact();
        LogicalMagicHandlerCompact();

        NextTickMagicHandlerCompact();
        PickMagicHandlerCompact();

        AttributeMagicHandlerCompact();
        ClassMagicHandlerCompact();
        StyleMagicHandlerCompact();
        
        EvaluateMagicHandlerCompact();
        DomMagicHandlerCompact();
        
        CodeMagicHandlerCompact();
        InlineJSMagicHandlerCompact();
        WaitingMagicHandlerCompact();
    });
}
