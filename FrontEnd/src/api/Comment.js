// import axios from 'axios'
// import {BASE_URL, HEADERS} from './Base.js'


// const apiClient = axios.create({
//     baseURL: BASE_URL + '/api',
//     withCredentials: false,
//     headers: HEADERS,
// })
import { api } from "./axios.js";
export default {
    createComment(payload) {
        return api.post('/comment', payload)
    }, 
    updateComment(id, payload) {
        return api.put('/comment/' + id, payload)
    }, 
    getListComment() {
        return api.get('/comment')
    }, 
    getCommentById(id) {
        return api.get('/commentById/' + id)
    }, 
    deleteComment(id) {
        return api.delete('/comment/' + id)
    }, 
}