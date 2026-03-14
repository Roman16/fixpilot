import mongoose, {Schema, Document} from 'mongoose';

export interface IServiceTemplateDocument extends Document {
    userId: mongoose.Types.ObjectId;
    works: { name: string; price?: number }[];
    materials: { name: string; price?: number }[];
    packages: {
        name: string;
        works: { name: string; price?: number }[];
        materials: { name: string; count?: number; price?: number }[];
    }[];
}

const ServiceTemplateSchema = new Schema<IServiceTemplateDocument>(
    {
        userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
        works: {
            type: [{name: String, price: Number}],
            default: [],
        },
        materials: {
            type: [{name: String, price: Number}],
            default: [],
        },
        packages: {
            type: [
                {
                    name: String,
                    works: [{name: String, price: Number}],
                    materials: [{name: String, count: Number, price: Number}],
                },
            ],
            default: [],
        },
    },
    {timestamps: true}
);

export default mongoose.models.ServiceTemplate ||
mongoose.model<IServiceTemplateDocument>('ServiceTemplate', ServiceTemplateSchema);