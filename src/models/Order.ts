import mongoose from 'mongoose';
import {BaseSchema} from "@/lib/BaseSchema";

const WorkSchema = new mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    employeeId: {type: mongoose.Types.ObjectId, ref: 'Employee'},
    payoutId: {type: mongoose.Types.ObjectId, ref: 'Payout', default: null}
});

const OrderSchema = new BaseSchema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    clientId: {type: mongoose.Types.ObjectId, ref: 'Client', required: true},
    vehicleId: {type: mongoose.Types.ObjectId, ref: 'Vehicle', required: true},
    mileage: {type: Number},
    orderNumber: {type: Number},
    status: {type: String, required: true},
    works: [WorkSchema],
    materials: {type: Array},
    closedAt: {type: String, default: null},
});


export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
