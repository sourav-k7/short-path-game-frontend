import axios from "axios";
import { ApiConstants } from "../constants";

const instance = axios.create({
  baseURL: ApiConstants.baseUrl,
});

export default instance;
