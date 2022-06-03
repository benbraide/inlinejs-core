import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy, IMagicHandlerParams } from "@benbraide/inlinejs";

const props = {
    root: ({ componentId }: IMagicHandlerParams) => FindComponentById(componentId)?.GetRoot(),
    form: ({ componentId, contextElement }: IMagicHandlerParams) => FindComponentById(componentId)?.FindElement(contextElement, el => (el instanceof HTMLFormElement)),
    ancestor: ({ componentId, contextElement }: IMagicHandlerParams) => (index?: number) => FindComponentById(componentId)?.FindAncestor(contextElement, (index || 0)),
    parent: ({ componentId, contextElement }: IMagicHandlerParams) => FindComponentById(componentId)?.FindAncestor(contextElement, 0),
};

let proxy: object | null = null;

export const DomMagicHandler = CreateMagicHandlerCallback('dom', (params) => {
    return (proxy || (proxy = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)){
                return props[prop](params);
            }
        },
        lookup: Object.keys(props),
    }))));
});

export function DomMagicHandlerCompact(){
    AddMagicHandler(DomMagicHandler);
}
