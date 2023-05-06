import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    notifications: {
        type: [
            {
                _id: {
                    type: String,
                    default: uuidv4()
                },
                title: {
                    type: String,
                    required: true,
                },
                
                body: {
                    type: String,
                    required: true,
                },
                opened: {
                    type: Boolean,
                    default: false
                },
                timestamp: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
    }
});

export const Notifiction = mongoose.model('Notifiction', notificationSchema);