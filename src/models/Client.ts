import mongoose from 'mongoose';
import {BaseSchema} from "@/lib/BaseSchema";

const ClientSchema = new BaseSchema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    name: {type: String},
    phone: {type: String, required: true, unique: true},
    comment: {type: String},
    visitAt: {type: Date, default: null},
});


export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
