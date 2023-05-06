import { User } from '../models/user.js';

/***
* @Type function {create}
* @params { Body} 
*
***/
export const create = async (body) => {
    try {
        return await User.create(body);
    } catch (e) {
        console.error(e);
        return e
    }
}

/***
* @Type function {fetchOne}
* @params _id 
*
***/
export const fetchOne = async(_id) => {
    try {
        return await User.findOne(_id);
    } catch (e) {
        console.error(e);
        return e
    }
}


/***
* @Type function {fetchAll}
*  
*
***/
export const fetchAll = async() => {
    try {
        return await User.find();
    } catch (e) {
        console.error(e);
        return e
    }
}

/***
* @Type function {update}
* @params _id
* @params _fields
***/
export const update = async(_id, _fields) => {
    try {
        return await User.findOneAndUpdate(
            _id,
            _fields,
            {
                new: true
            }
        );
    } catch (e) {
        console.error(e);
        return e
    }
}

/***
* @Type function {deleteUser}
* @params _id 
*
***/
export const deleteUser = async(_id) => {
    try {
        return await User.findOneAndDelete(_id);
    } catch (e) {
        console.error(e);
        return e
    }
}

/***
* @Type function {addToProject}
* @params _id 
* @params project_id
***/
export const addToProject = async(_id, project_id) => {
    try {
        let user = await User.findById(_id);
        
        if(user) {
            user.projects = [
                ...(user?.projects || []),
                project_id
            ];
            
            await user.save();

            return user;
        }
        
        return;
    } catch (e) {
        console.error(e);
        return e
    }
}


/***
* @Type function {addToProject}
* @params _id 
* @params project_id
***/
export const createNotification = async(user_id, body, title) => {
    try {


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
            return notification
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
            return  notification;
        }

    } catch(e) {
        console.log(e);
        return e;
    }
}