import api from '../api'
import Coord from '../sqlite/Coord';

const coord = api.get("coord.json")
      .then((response) => { 
        //console.log(response.data.usuarios);
        for(var i in response.data.routescoordinates) {
        //console.log('aqui:',response.data.routescoordinates);
        Coord.create({
        
        route_id: response.data.routescoordinates[i].route_id,
        lat: response.data.routescoordinates[i].lat,
        lgt: response.data.routescoordinates[i].lgt,
        created: response.data.routescoordinates[i].created
      
        }) 
        .then( id => id )
        .catch( err => {err})
        }}  
        ).catch((err) => {console.error(err);});

        


export default coord;


