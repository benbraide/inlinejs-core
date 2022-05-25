let getPackageVersion = require('@jsbits/get-package-version');
import { AddMagicHandler, CreateMagicHandlerCallback, CreateInplaceProxy, BuildGetterProxyOptions } from "@benbraide/inlinejs";
const FrameworkProps = {
    version: () => getPackageVersion('../../'),
};
const FrameworkProxy = CreateInplaceProxy(BuildGetterProxyOptions({
    getter: (prop) => ((prop && FrameworkProps.hasOwnProperty(prop)) ? FrameworkProps[prop]() : undefined),
    lookup: Object.keys(FrameworkProps),
}));
export const FrameworkMagicHandler = CreateMagicHandlerCallback('framework', () => FrameworkProxy);
export function FrameworkMagicHandlerCompact() {
    AddMagicHandler(FrameworkMagicHandler);
}
