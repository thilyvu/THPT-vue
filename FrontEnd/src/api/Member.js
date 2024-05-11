// import axios from 'axios'
// import {BASE_URL, HEADERS} from './Base.js'


// const apiClient = axios.create({
//     baseURL: BASE_URL + '/api',
//     withCredentials: false,
//     headers: HEADERS,
// })
import { api } from "./axios.js";
export default {
    approveToClass(payload) {
        return api.post('/aproveToClass', payload)
    }, 
    addStudentToClass(payload) {
        return api.post('/addStudentToClass', payload)
    }, 
    deleteStudentFromClass(payload) {
        return api.post('/deleteStudentFromClass', payload)
    }, 
    joinClass(id) {
        return api.post('/joinClass/'+id)
    }, 
    leaveClass(id) {
        return api.post('/leaveClass/'+id)
    }, 
}