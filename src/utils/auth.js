import axios from 'axios'

export const createOrUpdateUser = async (authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/create-or-update-user`, {}, {
        headers: {
            authtoken
        }
    })
}
//Get current user
export const currentUser = async (authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/current-user`, {}, {
        headers: {
            authtoken
        }
    })
}

//Check if admin allow access to this route
export const currentAdmin = async (authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/current-admin`, {}, {
        headers: {
            authtoken
        }
    })
}
