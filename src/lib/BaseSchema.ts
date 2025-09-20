import { Schema, SchemaOptions, Document } from 'mongoose';

export class BaseSchema extends Schema {
    constructor(definition: any, options: SchemaOptions = {}) {
        super(definition, {
            ...options,
            timestamps: true,
            toJSON: {
                // @ts-ignore
                transform: (_doc: Document, ret: Record<string, any>) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                    return ret;
                },
                ...options.toJSON,
            },
        });
    }
}
