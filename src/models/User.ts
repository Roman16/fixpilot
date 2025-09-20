import mongoose from 'mongoose';
import {BaseSchema} from "@/lib/BaseSchema";

const UserSchema = new BaseSchema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    company: {type: String, required: true},
    companyLogo: {type: String, required: false, default: ""},
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
