import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach, RandomString } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { ComponentDirectiveHandlerCompact } from '../directive/data/component';
import { ComponentMagicHandlerCompact } from '../magic/data/component';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { UnoptimizedMagicHandlerCompact } from '../magic/reactive/unoptimized';

describe('component', () => {
    it('can be initialized with the \'x-component\' directive', () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data x-component="${key}">
                <span x-text="$name"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal(key);
    });

    it('can be initialized with the \'$config.name\' key during data initialization', () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' } }">
                <span x-text="$name"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal(key);
    });

    it('can retrieve the current component name via the \'$name\' global magic property', () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' } }">
                <span x-text="$name"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal(key);
    });

    it('can retrieve another component via the $component global magic property', () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-component="${key}"></div>
            <div x-data>
                <span x-text="$component('${key}').foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    });

    it('should ensure data retrieved from other components are reactive', async () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-component="${key}">
                <span x-text="foo"></span>
                <button x-on:click="foo = 'changed in ${key}'"></button>
            </div>
            <div x-data="{ foo: 'baz' }">
                <span x-text="foo"></span>
                <span x-text="$component('${key}').foo"></span>
                <button x-on:click="foo = 'unnamed changed'"></button>
                <button x-on:click="$component('${key}').foo = 'changed in unnamed'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('baz');
        expect(document.querySelectorAll('span')[2].textContent).equal('bar');

        userEvent.click(document.querySelectorAll('button')[0]);

        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal(`changed in ${key}`);
            expect(document.querySelectorAll('span')[1].textContent).equal('baz');
            expect(document.querySelectorAll('span')[2].textContent).equal(`changed in ${key}`);
        });

        userEvent.click(document.querySelectorAll('button')[1]);

        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal(`changed in ${key}`);
            expect(document.querySelectorAll('span')[1].textContent).equal('unnamed changed');
            expect(document.querySelectorAll('span')[2].textContent).equal(`changed in ${key}`);
        });

        userEvent.click(document.querySelectorAll('button')[2]);

        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('changed in unnamed');
            expect(document.querySelectorAll('span')[1].textContent).equal('unnamed changed');
            expect(document.querySelectorAll('span')[2].textContent).equal('changed in unnamed');
        });
    });

    it('should obey per region optimized setting when accessing data from other components', async () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }" x-component="${key}">
                <span x-text="nested.foo"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div x-data="{ $config: { reactiveState: 'unoptimized' } }">
                <span x-text="$component('${key}').nested.foo"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('unoptimized') });
    });

    it('should obey \'$unoptimized\' global magic property when accessing data from other components', async () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }" x-component="${key}">
                <span x-text="nested.foo"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div x-data>
                <span x-text="$unoptimized($component('${key}').nested.foo)"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();
        UnoptimizedMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('unoptimized') });
    });

    it('should not be affected by optimized settings in other components', async () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }" x-component="${key}">
                <span x-text="nested.foo"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div x-data="{ $config: { reactiveState: 'optimized' } }">
                <span x-text="$component('${key}').nested.foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ComponentDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        ComponentMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('unoptimized') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('bar') });
    });
});
