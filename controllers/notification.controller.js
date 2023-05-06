import { Notifiction } from '../models/notification.js';
import { response } from '../helpers/index.js';


/****
* @Type function {create}
* @Params req
* @Params res
****/
export const create = async(req, res) => {
    try {
        const { user_id, body, title } = req.body;
        
        let notification = await Notifiction.findOne({ user_id });
        
        if(notification) {
            notification.notifications = [
                ...(notification?.notifications || []),
                {
                    title,
                    body
                }
            ]
            

            await notification.save();
            return response(res, 201, notification);
        } else {
            notification = await Notifiction.create({
                user_id,
                notifications: [
                    {
                        title,
                        body
                    }
                ]
            });
            return response(res, 201, notification);
        }
        
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}

/****
* @Type function { fetch }
* @Params req
* @Params res
****/
export const fetch = async(req, res) => {
    try {
        const notifications = await Notifiction.find({ user_id: req?.params?.id });
        return response(res, 201, notifications);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


/****
* @Type function { update }
* @Params req
* @Params res
****/
export const update = async(req, res) => {
    try {
        let notifications = await Notifiction.find({ user_id: req?.params?.id });
        
        if(!notifications) {
            return response(res, 400, { success: false})
            
        }
        
        notifications = {
            ...(notifications),
            notifications: [
                ...(notifications?.notifications || []).filter(x => !x?._id.equals(req.body?.notification_id) || []),
                {
                    ...(notifications?.notifications || []).filter(x => !x?._id.equals(req.body?.notification_id) || {}),
                    opened: true
                }
            ]
        }
        return response(res, 201, notifications);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}

