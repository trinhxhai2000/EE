import { RequestHandler, Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { AppRouter } from "../../AppRouter";
import { MetadataKeys } from "./MetadataKey";
import { Methods } from "./Methods";

export function controller(prefix: string) {
    return function (target: Function) {
        const router = AppRouter.getInstance();

        for (let key in target.prototype) {
            const path = Reflect.getMetadata(
                MetadataKeys.path,
                target.prototype,
                key
            );

            if (path) {
                const method: Methods = Reflect.getMetadata(
                    MetadataKeys.method,
                    target.prototype,
                    key
                );

                const isAsyncWrapper = Reflect.getMetadata(
                    MetadataKeys.asyncWrapper,
                    target.prototype,
                    key
                );

                const middlewares =
                    Reflect.getMetadata(
                        MetadataKeys.middleware,
                        target.prototype,
                        key
                    ) || [];

                let route = target.prototype[key];

                if (isAsyncWrapper) {
                    router[method](
                        `${prefix}${path}`,
                        ...middlewares,
                        asyncRouteWrapper(route)
                    );
                } else {
                    router[method](`${prefix}${path}`, ...middlewares, route);
                }
            }
        }
    };
}

const asyncRouteWrapper = function (requestHandler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            requestHandler(req, res, next);
        } catch (err) { }
    };
};
