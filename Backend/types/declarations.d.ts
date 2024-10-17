
declare module 'body-parser';
declare module 'zod';
declare module 'mongodb';

declare module 'zod' {
  export class ZodError extends Error {
    constructor(errors: any);
    errors: any; // You can define this more specifically based on your use case
  }
  
  export const z: any; // Temporarily set this to any; refine later as needed
}
