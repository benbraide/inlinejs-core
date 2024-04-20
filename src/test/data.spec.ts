import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach, GetGlobal, RandomString } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { UnoptimizedMagicHandlerCompact } from '../magic/reactive/unoptimized';

describe('hx-data directive', () => {
    it('should be reactive when manipulated on component object', async () => {
        let key = RandomString(18);
        document.body.innerHTML = `
            <div hx-data="{ $config: { name: '${key}' }, foo: 'bar' }">
                <span hx-text="foo"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();

        expect(document.querySelector('span')!.textContent).equal('bar');

        GetGlobal().FindComponentByName(key)!.GetRootProxy().GetNative()['foo'] = 'baz';

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should have an optional attribute value', () => {
        document.body.innerHTML = `
            <div hx-data>
                <span hx-text="'foo'"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
        
        expect(document.querySelector('span')!.textContent).equal('foo');
    });

    it('can use \'this\'', () => {
        document.body.innerHTML = `
            <div hx-data="{ text: this.dataset.text }" data-text="test">
              <span hx-text="text"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
        
        expect(document.querySelector('span')!.textContent).equal('test');
    });

    it('should contain reactive functions', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar', getFoo() {return this.foo}}">
                <span hx-text="getFoo()"></span>
                <button hx-on:click="foo = 'baz'"></button>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();

        expect(document.querySelector('span')!.textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('can be nested as scopes', () => {
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
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');
        expect(document.querySelectorAll('span')[2].textContent).equal('bar');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz');
        expect(document.querySelectorAll('span')[4].textContent).equal('value');
        expect(document.querySelectorAll('span')[5].textContent).equal('bar');
    });

    it('should contain reactive scopes', async () => {
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

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();

        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('bar');
            expect(document.querySelectorAll('span')[1].textContent).equal('bar');
            expect(document.querySelectorAll('span')[2].textContent).equal('changed');
        });
    });

    it('should not nest and duplicate proxies when manipulating an array', async () => {
        document.body.innerHTML = `
            <div hx-data="{ list: [ {name: 'foo'}, {name: 'bar'} ] }">
                <span hx-text="$unoptimized(list[0].name)"></span>
                <button hx-on:click="list.sort((a, b) => (a.name > b.name) ? 1 : -1)"></button>
                <h1 hx-on:click="list.sort((a, b) => (a.name < b.name) ? 1 : -1)"></h1>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        UnoptimizedMagicHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });

        userEvent.click(document.querySelector('h1')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });

        userEvent.click(document.querySelector('h1')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });

        userEvent.click(document.querySelector('h1')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });

        userEvent.click(document.querySelector('h1')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });

        userEvent.click(document.querySelector('h1')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });

        userEvent.click(document.querySelector('h1')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    });

    it('should refresh one time per update whatever the number of mutations in the update', async () => {
        globalThis['refreshCount'] = 0;
    
        document.body.innerHTML = `
            <div hx-data="{ items: ['foo', 'bar'], qux: 'quux', test() {this.items; this.qux; return ++globalThis.refreshCount} }">
                <span hx-text="test()"></span>
                <button hx-on:click="(() => { items.push('baz'); qux = 'corge'; })()"></button>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(globalThis['refreshCount']).equal(1);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(globalThis['refreshCount']).equal(2) });
    });
});
