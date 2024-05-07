import { Request, Response, NextFunction } from 'express';

export const requestLoggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const method = request.method;
    const url = request.originalUrl;
    const headers = request.headers;
    const body = request.body;

    console.log(`\n--- New Request ---`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
    console.log(`Body: ${JSON.stringify(body, null, 2)}`);

    next();
};
