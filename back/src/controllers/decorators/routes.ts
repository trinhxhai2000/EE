import 'reflect-metadata';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKey';
import { RequestHandler } from 'express';
import { RouteHandlerDescriptor } from './RouteHandlerDescriptor';

function RouteBinder(method: string) {
  return function (path: string) {
    return function (target: any, key: string, desc: RouteHandlerDescriptor) {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
}

export const get = RouteBinder(Methods.get);
export const post = RouteBinder(Methods.post);
export const put = RouteBinder(Methods.put);
export const del = RouteBinder(Methods.delete);
export const patch = RouteBinder(Methods.patch);
