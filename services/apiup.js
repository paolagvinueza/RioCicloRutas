import axios from "axios";

// Pode ser algum servidor executando localmente: 
// http://localhost:3000

const apiup = axios.create({
  baseURL: "https://riobambaciclorutas.com/",
});


export default apiup;