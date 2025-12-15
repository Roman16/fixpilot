import { Schema, SchemaOptions, Document } from 'mongoose';

export class BaseSchema extends Schema {
    constructor(definition: any, options: SchemaOptions = {}) {
        // @ts-ignore
        super(definition, {
            ...options,
            timestamps: true,
            toJSON: {
                ...(options.toJSON || {}),
                transform: (doc: Document, ret: Record<string, any>, opt) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;

                    if (options.toJSON?.transform) {
                        // @ts-ignore
                        return options.toJSON.transform(doc, ret, opt);
                    }

                    return ret;
                },
            },
        });
    }
}
