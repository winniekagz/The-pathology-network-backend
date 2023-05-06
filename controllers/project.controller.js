import {
    create,
    fetchOne,
    fetchAll,
    update,
    deleteProject,
} from '../services/project.service.js';

import { addToProject, createNotification } from '../services/user.service.js'

import { response } from '../helpers/index.js';

import { Project } from '../models/project.js';

/****
* @Type function {createProject}
* @Params req
* @Params res
****/
export const createProject = async(req, res) => {
    try {
        const project = await create(req.body);
        return response(res, 200, project);

    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


/****
* @Type function {updateProject}
* @Params req
* @Params res
****/
export const updateProject = async(req, res) => {
    try {
        const {id, ...rest} = req.body;
        const project = await update(id, rest);
        return response(res, 200, project);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}

/****
* @Type function {fetchProject}
* @Params req
* @Params res
****/
export const fetchProject = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await fetchOne(id);
        return response(res, 200, project);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


/****
* @Type function {fetchProjects}
* @Params req
* @Params res
****/
export const fetchProjects = async(req, res) => {
    try {
        const projects = await fetchAll();
        return response(res, 200, projects);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


/****
* @Type function {deleteProject}
* @Params req
* @Params res
****/
export const _deleteProject = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await deleteProject(id);
        return response(res, 200, project);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}

/****
* @Type function {_addMember}
* @Params req
* @Params res
****/
export const addMember = async(req, res) => {
    try {
        const { user_id, project_id } = req.body;
        
        const user = await addToProject(user_id, project_id);
        const project = await fetchOne(project_id);
        
        await createNotification(user_id, `You have been added to projet ${project?.name}`, "Project Updates")
        
        return response(res, 200, user);
    }  catch(e) {
        console.log(e);
        return response(res, 400);
    }
}