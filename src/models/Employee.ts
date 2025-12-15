import mongoose from 'mongoose';
import {BaseSchema} from "@/lib/BaseSchema";

const EmployeeSchema = new BaseSchema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    name: {type: String},
    phone: {type: String, unique: true},
    role: {type: String},
    commission: {type: Number},
});


export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
