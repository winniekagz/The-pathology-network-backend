export const response = (res, status, data, message) => {
    switch(status) {
        case 200:
            return res.status(status).json({data, success: true, message});
            break;
        case 201:
            return res.status(status).json({data,  success: true, message});
             break;
        case 400:
            return res.status(status).json({data,  success: false, message: "Server error!"});
             break;
        default:
            return res.status(500).json(
                {
                    success: false,
                    "message": "Server error"
                }
            )
    }
}

export const hasValues = (data, res) => {
    let text = ""
    if(!data?.name) {
        text = "Name is required";
        return response(res, 400, {message: text});
    }
    
    if(!data?.email) {
        text = "Email is required";
        return response(res, 400, {message: text});
    }
    
    if(!data?.password) {
        text = "Password is required";
        return response(res, 400, {message: text});
    }
    
    return true;
}