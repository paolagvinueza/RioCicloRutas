import api from '../api'
import Routes from '../sqlite/Routes';

const routes = api.get("routes.json")
      .then((response) => { 
        console.log(response.data.routes);
        for(var i in response.data.routes) {
         Routes.create({
           timestamp :   response.data.routes[i].timestamp,
           title :       response.data.routes[i].title,
           image :       response.data.routes[i].image,
           audio :       response.data.routes[i].audio,
           obs :         response.data.routes[i].obs,
           country :     response.data.routes[i].country,
           state :       response.data.routes[i].state,
           city :        response.data.routes[i].city,
           lat :         response.data.routes[i].lat,
           log :         response.data.routes[i].log,
           codapp :      response.data.routes[i].codapp,
           user_id :     response.data.routes[i].user_id,
           created :     response.data.routes[i].created
    
         }) 
         .then( id => console.log('puxando rotas: '+ id ) )
         .catch( err => {err})
         }}  
         ).catch((err) => {console.error(err);});

export default routes;


            
            