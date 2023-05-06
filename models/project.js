import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    start_date: {
        type: Date,
        default: Date.now()
    },
    end_date: {
        type: Date
    },
    is_active: {
        type: Boolean,
        default: true,
    }
});

export const Project = mongoose.model('Project', projectSchema);

