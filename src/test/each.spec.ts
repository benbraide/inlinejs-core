import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { EachDirectiveHandlerCompact } from '../directive/control/each';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { StaticDirectiveHandlerCompact } from '../directive/reactive/static';

describe('hx-each directive', () => {
    it('should work on arrays', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="['foo', 'bar']">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
    });

    it('alternative syntax should work on arrays', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-for="['foo', 'bar']">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
    });

    it('should support the \'as <name>\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="['foo', 'bar'] as item">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
    });

    it('alternative syntax should support the \'<name> of\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-for="item of ['foo', 'bar']">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
    });

    it('should support the \'as <key> => <name>\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="['foo', 'bar'] as key => item">
                    <p hx-text="\`\${$each.index}.\${key}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.foo.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.bar.bar.2');
    });

    it('alternative syntax should support the \'(<key>, <name>) of\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-for="(key, item) of ['foo', 'bar']">
                    <p hx-text="\`\${$each.index}.\${key}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.foo.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.bar.bar.2');
    });

    it('should work on arrays of objects', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="[{ name: 'Anon', age: 27 }, { name: 'Legion', age: 99 }] as item">
                    <p hx-text="\`\${item.name}.\${item.age}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('Anon.27');
        expect(document.querySelectorAll('p')[1].textContent).equal('Legion.99');
    });

    it('should be reactive when array is replaced', async () => {
        document.body.innerHTML = `
            <div hx-data="{ list: ['foo'] }">
                <template hx-each="list">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button hx-on:click="list = ['foo', 'bar']"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
    });

    it('should be reactive when array is manipulated', async () => {
        document.body.innerHTML = `
            <div hx-data="{ list: ['foo'] }">
                <template hx-each="list">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button hx-on:click="list.push('bar')"></button>
                <button hx-on:click="list.unshift('first')"></button>
                <button hx-on:click="list.splice(1, 1)"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        
        userEvent.click(document.querySelectorAll('button')[0]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });

        userEvent.click(document.querySelectorAll('button')[1]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(3);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.first.3');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.foo.3');
            expect(document.querySelectorAll('p')[2].textContent).equal('2.bar.3');
        });

        userEvent.click(document.querySelectorAll('button')[2]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.first.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
    });

    it('should support the \'as <name>\' syntax and be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ list: ['foo'] }">
                <template hx-each="list as item">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
                <button hx-on:click="list = ['foo', 'bar']"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.1');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
        });
    });

    it('should remove all elements when array is empty', async () => {
        document.body.innerHTML = `
            <div hx-data="{ list: ['foo'] }">
                <template hx-each="list">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button hx-on:click="list = []"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => { expect(document.querySelectorAll('p').length).equal(0) });
    });

    it('should optimize the creation of new nodes when coupled with a key', async () => {
        globalThis['keyedPs'] = [];
        globalThis['unkeyedPs'] = [];
        
        document.body.innerHTML = `
            <div hx-data="{ list: ['foo'], uninitCount: 0 }">
                <template hx-each="list as index => item" :key="index">
                    <p hx-text="item + '.' + $each.count" hx-static="!globalThis.keyedPs.includes(this) && globalThis.keyedPs.push(this)"></p>
                </template>
                <template hx-each="list as item">
                    <p hx-text="item" hx-static="!globalThis.unkeyedPs.includes(this) && globalThis.unkeyedPs.push(this)"></p>
                </template>
                <button hx-on:click="list = ['foo', 'bar']"></button>
                <span hx-text="uninitCount"></span>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();
        StaticDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('foo.1');
        expect(document.querySelectorAll('p')[1].textContent).equal('foo');

        expect(globalThis.keyedPs.length).equal(1);
        expect(globalThis.unkeyedPs.length).equal(1);
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(4);
            expect(document.querySelectorAll('p')[0].textContent).equal('foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('bar.2');
            expect(document.querySelectorAll('p')[2].textContent).equal('foo');
            expect(document.querySelectorAll('p')[3].textContent).equal('bar');

            expect(globalThis.keyedPs.length).equal(2);
            expect(globalThis.unkeyedPs.length).equal(3);
        });
    });

    it('should work on positive integer ranges', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="3">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.2.3');
    });

    it('should work on positive integer ranges and be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ value: 3 }">
                <template hx-each="value">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button hx-on:click="value = 5"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.2.3');

        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(5);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.0.5');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.1.5');
            expect(document.querySelectorAll('p')[2].textContent).equal('2.2.5');
            expect(document.querySelectorAll('p')[3].textContent).equal('3.3.5');
            expect(document.querySelectorAll('p')[4].textContent).equal('4.4.5');
        });
    });

    it('should work on negative integer ranges', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="-3">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.-1.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.-2.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.-3.3');
    });

    it('should work on negative integer ranges and be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ value: -3 }">
                <template hx-each="value">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button hx-on:click="value = -5"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.-1.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.-2.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.-3.3');

        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(5);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.-1.5');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.-2.5');
            expect(document.querySelectorAll('p')[2].textContent).equal('2.-3.5');
            expect(document.querySelectorAll('p')[3].textContent).equal('3.-4.5');
            expect(document.querySelectorAll('p')[4].textContent).equal('4.-5.5');
        });
    });

    it('should work on key-value pairs', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="{ name: 'John Doe', age: 36, gender: 'MALE' }">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('name.John Doe.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('age.36.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('gender.MALE.3');
    });

    it('should support the \'as <name>\' syntax on key-value pairs', () => {
        document.body.innerHTML = `
            <div hx-data>
                <template hx-each="{ name: 'John Doe', age: 36, gender: 'MALE' } as item">
                    <p hx-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('name.John Doe.John Doe.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('age.36.36.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('gender.MALE.MALE.3');
    });

    it('should contain reactive elements', async () => {
        document.body.innerHTML = `
            <div hx-data="{ items: ['first'], foo: 'bar' }">
                <button hx-on:click="foo = 'baz'"></button>
                <template hx-each="items">
                    <section>
                        <h1 hx-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></h1>
                        <h2 hx-text="foo"></h2>
                    </section>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('section').length).equal(1);
        expect(document.querySelector('h1')!.textContent).equal('0.first.1');
        expect(document.querySelector('h2')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => {
            expect(document.querySelector('h1')!.textContent).equal('0.first.1');
            expect(document.querySelector('h2')!.textContent).equal('baz');
        });
    });

    it('can be nested', async () => {
        document.body.innerHTML = `
            <div hx-data="{ $enableOptimizedBinds: false, foos: [ { bars: ['bob', 'lob'] } ] }">
                <button hx-on:click="foos = [ { bars: ['bob', 'lob'] }, { bars: ['law'] } ]"></button>
                <template hx-each="foos">
                    <template hx-each="$each.value.bars">
                        <span hx-text="$each.value"></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(2) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('lob');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(3) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('lob');
        expect(document.querySelectorAll('span')[2].textContent).equal('law');
    });

    it('should be able to access parent data when nested', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
                <template hx-each="foos">
                    <template hx-each="$each.value.bars">
                        <span hx-text="$each.parent.value.name+': '+$each.value"></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab');
    });

    it('should support the \'as <name>\' syntax and be able to access parent data when nested', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
                <template hx-each="foos as foo">
                    <template hx-each="foo.bars as bar">
                        <span hx-text="foo.name+': '+bar"></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab');
    });

    it('should be able to handle nested event listeners', async () => {
        document['_alerts'] = [];
    
        document.body.innerHTML = `
            <div hx-data="{ foos: [
                {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
                {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
            ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; }, onClick: function(foo, bar){ bar.count += 1; document._alerts.push(this.fnText(foo, bar)) } }">
                <template hx-each="foos">
                    <template hx-each="$each.value.bars">
                        <span hx-text="fnText($each.parent.value, $each.value)" hx-on:click="onClick($each.parent.value, $each.value)" ></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 0');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
        expect(document['_alerts'].length).equal(0);
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(1);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
        });
    
        userEvent.click(document.querySelectorAll('span')[2]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(2);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
            expect(document['_alerts'][1]).equal('baz: bab = 1');
        });
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 2');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(3);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
            expect(document['_alerts'][1]).equal('baz: bab = 1');
            expect(document['_alerts'][2]).equal('foo: bob = 2');
        });
    });

    it('should support the \'as <name>\' syntax and be able to handle nested event listeners', async () => {
        document['_alerts'] = [];
    
        document.body.innerHTML = `
            <div hx-data="{ foos: [
                {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
                {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
            ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; }, onClick: function(foo, bar){ bar.count += 1; document._alerts.push(this.fnText(foo, bar)) } }">
                <template hx-each="foos as foo">
                    <template hx-each="foo.bars as bar">
                        <span hx-text="fnText(foo, bar)" hx-on:click="onClick(foo, bar)" ></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 0');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
        expect(document['_alerts'].length).equal(0);
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(1);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
        });
    
        userEvent.click(document.querySelectorAll('span')[2]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(2)
            expect(document['_alerts'][0]).equal('foo: bob = 1')
            expect(document['_alerts'][1]).equal('baz: bab = 1')
        });
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 2');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(3);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
            expect(document['_alerts'][1]).equal('baz: bab = 1');
            expect(document['_alerts'][2]).equal('foo: bob = 2');
        });
    });
});
