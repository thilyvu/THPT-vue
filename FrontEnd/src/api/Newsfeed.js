// import axios from 'axios'
// import {BASE_URL, HEADERS} from './Base.js'


// const apiClient = axios.create({
//     baseURL: BASE_URL + '/api',
//     withCredentials: false,
//     headers: HEADERS,
// })
import { api } from "./axios.js";
export default {
    createNewsfeed(payload) {
        return api.post('/newFeed', payload)
    }, 
    updateNewsfeed(id, payload) {
        return api.put('/newFeed/' + id, payload)
    },
    getNewsfeedById(id) {
        return api.get('/newFeedById/' + id)
    },
    getListNewsfeeds() {
        return api.get('/newFeed')
    },
    deleteNewsfeed(id) {
        return api.delete('/newFeed/' + id)
    },
    likeNewFeed(id) {
        return api.post('/like/' + id)
    },
    unLikeNewFeed(id) {
        return api.post('/unLike/' + id)
    },
    pinNewFeed(id) {
        return api.post('/pin/' + id)
    },
    unPinNewFeed(id) {
        return api.post('/unPin/' + id)
    },
}