import mongoose from "mongoose";
import {generateShareToken} from "@/lib/shareToken";
import {BaseSchema} from "@/lib/BaseSchema";

const VehicleSchema = new BaseSchema({
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    clientId: {type: mongoose.Types.ObjectId, ref: "Client", required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: String},
    mileage: {type: Number},
    plate: {type: String},
    vin: {type: String},
    shareToken: {type: String, unique: true, sparse: true, default: generateShareToken},
});

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
