import { Project } from '../models/project.js';

/***
* @Type function {create}
* @params { Body} 
*
***/
export const create = async (body) => {
    try {
        return await Project.create(body);
    } catch (e) {
        console.error(e);
        return e
    }
}

/***
* @Type function {fetchOne}
* @params { Body} 
*
***/
export const fetchOne = async(_id) => {
    try {
        return await Project.findById(_id);
    } catch (e) {
        console.error(e);
        return e
    }
}


/***
* @Type function {fetchAll}
* @params { Body} 
*
***/
export const fetchAll = async() => {
    try {
        return await Project.find();
    } catch (e) {
        console.error(e);
        return e
    }
}

/***
* @Type function {update}
* @params { Body} 
*
***/
export const update = async(_id, _fields) => {
    try {
        return await Project.findOneAndUpdate(
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
* @Type function {deleteProject}
* @params { Body} 
*
***/
export const deleteProject = async(_id) => {
    try {
        return await Project.findOneAndDelete(_id);
    } catch (e) {
        console.error(e);
        return e
    }
}