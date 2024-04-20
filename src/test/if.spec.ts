import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { GetOrCreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { IfDirectiveHandlerCompact } from '../directive/control/if';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { EachDirectiveHandlerCompact } from '../directive/control/each';
import { ElseDirectiveHandlerCompact } from '../directive/control/else';

describe('hx-if directive', () => {
    it('should create element on truthy value', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: true }">
                <template hx-if="show">
                    <p></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
    });

    it('should not create element on falsy value', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: false }">
                <template hx-if="show">
                    <p></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(0);
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: false }">
                <button hx-on:click="show = ! show"></button>
                <template hx-if="show">
                    <p></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(!document.querySelector('p')).equal(true);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(!document.querySelector('p')).equal(false) });
    });

    it('should contain reactive elements', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: false, foo: 'bar' }">
                <h1 hx-on:click="show = ! show"></h1>
                <template hx-if="show">
                    <h2 hx-on:click="foo = 'baz'"></h2>
                </template>
                <span hx-text="foo"></span>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(!document.querySelector('h2')).equal(true);
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('h1')!);
    
        await waitFor(() => { expect(!document.querySelector('h2')).equal(false) });
    
        userEvent.click(document.querySelector('h2')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should attach event listeners once', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <span hx-text="count"></span>
                <template hx-if="true">
                    <button hx-on:click="count += 1">Click me</button>
                </template>
            </div>
        `;
        
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    });

    it('should be complemented by \'hx-else\' directive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: false }">
                <template hx-if="show">
                    <p hx-text="'Shown'"></p>
                </template>
                <template hx-else>
                    <p hx-text="'Hidden'"></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        ElseDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('Hidden');
    });

    it('should be complemented by \'hx-else\' directive and be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: true }">
                <button hx-on:click="show = ! show"></button>
                <template hx-if="show">
                    <p hx-text="'Shown'"></p>
                </template>
                <template hx-else>
                    <p hx-text="'Hidden'"></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        ElseDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('Shown');

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelectorAll('p').length).equal(1) });
        await waitFor(() => { expect(document.querySelectorAll('p')[0].textContent).equal('Hidden') });

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelectorAll('p').length).equal(1) });
        await waitFor(() => { expect(document.querySelectorAll('p')[0].textContent).equal('Shown') });
    });

    it('should be complemented by a chain of \'hx-else\' directives', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <button hx-on:click="count += 1"></button>
                <template hx-if="count == 0">
                    <p hx-text="'Count 0'"></p>
                </template>
                <template hx-else="count == 1">
                    <p hx-text="'Count 1'"></p>
                </template>
                <template hx-else>
                    <p hx-text="'Count *'"></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        ElseDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('Count 0');

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelectorAll('p').length).equal(1) });
        await waitFor(() => { expect(document.querySelectorAll('p')[0].textContent).equal('Count 1') });

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelectorAll('p').length).equal(1) });
        await waitFor(() => { expect(document.querySelectorAll('p')[0].textContent).equal('Count *') });
    });

    it('should work inside a loop', () => {
        document.body.innerHTML = `
            <div hx-data="{ foos: [{bar: 'baz'}, {bar: 'bop'}]}">
                <template hx-each="foos as foo">
                    <template hx-if="foo.bar === 'baz'">
                        <span hx-text="foo.bar"></span>
                    </template>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span').length).equal(1);
        expect(document.querySelector('span')!.textContent).equal('baz');
    });
});
