import "reflect-metadata";
import { MetadataKeys } from "./MetadataKey";

import { RouteHandlerDescriptor } from "./RouteHandlerDescriptor";

export function asyncWrapper(value: boolean) {
    return function (target: any, key: string, desc: RouteHandlerDescriptor) {
        Reflect.defineMetadata(MetadataKeys.asyncWrapper, true, target, key);
    };
}
