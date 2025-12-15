import mongoose from 'mongoose';
import {BaseSchema} from "@/lib/BaseSchema";

const UserSchema = new BaseSchema({
    companyName: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, default: ''},
    logo: {type: String, default: ''},
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
