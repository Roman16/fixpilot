import mongoose from 'mongoose';
import {BaseSchema} from "@/lib/BaseSchema";

const PayoutsSchema = new BaseSchema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    employeeId: {type: mongoose.Types.ObjectId, ref: 'Employee', required: true},
    totalAmount: {type: Number, required: true},
    totalCommission: {type: Number, required: true},
    commission: {type: Number, required: true},

    orders: [{
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        required: true
    }]
});


export default mongoose.models.Payouts || mongoose.model('Payouts', PayoutsSchema);
