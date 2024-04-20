import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { RefDirectiveHandlerCompact } from '../directive/data/ref';
import { RefsMagicHandlerCompact } from '../magic/data/refs';
import { NextTickMagicHandlerCompact } from '../magic/nexttick';
import { EachDirectiveHandlerCompact } from '../directive/control/each';

describe('$nextTick global magic property', () => {
    it('should execute attached callback', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-ref="span" hx-text="foo"></span>
                <button hx-on:click="foo = 'baz'; $nextTick(() => { $refs.span.textContent = 'bob' })"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        RefDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        RefsMagicHandlerCompact();
        NextTickMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => expect(document.querySelector('span')!.textContent).equal('bob'));
    });

    it('should wait for hx-each directive to finish rendering', async () => {
        document.body.innerHTML = `
            <div hx-data="{ list: ['one', 'two'], check: 2 }">
                <template hx-each="list">
                    <span hx-text="$each.value"></span>
                </template>
                <p hx-text="check"></p>
                <button hx-on:click="list = ['one', 'two', 'three']; $nextTick(() => { check = document.querySelectorAll('span').length })"></button>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        NextTickMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('p')!.textContent).equal('2');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('p')!.textContent).equal('3') });
    });
});
