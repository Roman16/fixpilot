import mongoose from "mongoose";
import {BaseSchema} from "@/lib/BaseSchema";

const VehicleSchema = new BaseSchema({
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    clientId: {type: mongoose.Types.ObjectId, ref: "Client", required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    mileage: {type: Number},
    plate: {type: String},
    vin: {type: String},
});

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
