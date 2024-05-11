import { api } from "./axios.js";
export default {
    createClass(payload) {
        return api.post('/class', payload)
    }, 
    joinClass(id) {
        return api.post('/joinClass/' + id)
    },
    leaveClass(id) {
        return api.post('/leaveClass/' + id)
    },

    getListClass(payload) {
        return api.get('/class', { params: payload })
    },
    getClassById(id) {
        return api.get('/classById/'+id)
    },
    getClassByClassCode(payload) {
        return api.get('/classByClassCode', payload)
    },
    getListPersonalClass(token) {
        return api.get('/classByUserId')
    },
    
    updateClass(id, payload) {
        return api.put('/class/' + id, payload)
    },

    deleteClass(id) {
        return api.delete('/class/' + id)
    },
}