import axios from "axios";

export default {
  get(url) {
    return axios.get(url)
  },

  create(url, data) {
    return axios.post(url, data)
  },

  update(url, data) {
    return axios.put(url, data)
  },

  delete(url) {
    return axios.delete(url)
  }
}