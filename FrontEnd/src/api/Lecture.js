// import axios from 'axios'
// import {BASE_URL, HEADERS} from './Base.js'


// const apiClient = axios.create({
//     baseURL: BASE_URL + '/api',
//     withCredentials: false,
//     headers: HEADERS,
// })
import { api } from "./axios.js";
export default {
    createLecture(payload) {
        return api.post('/lecture', payload)
    }, 
    updateLecture(id, payload) {
        return api.put('/lecture/'+id, payload)
    }, 
    getListLecture() {
        return api.get('/lecture')
    }, 
    getListLectureById(id) {
        return api.get('/lecture/' +id)
    }, 
    deleteLecture(id) {
        return api.delete('/lecture/' +id)
    }, 
}