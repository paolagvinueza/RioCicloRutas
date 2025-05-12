import api from '../api'
import Users from '../sqlite/Users';

const usuarios = api.get("userlist.json")
      .then((response) => { 
        //console.log(response.data.usuarios);
        for(var i in response.data.users) {
        //console.log('aqui:',response.data.users);
        Users.create({
        id: response.data.users[i].id,
        profile_id: response.data.users[i].profile_id,
        title: response.data.users[i].title,
        email: response.data.users[i].email,
        phone: response.data.users[i].phone,
        image: response.data.users[i].image,
        created: response.data.users[i].created
        }) 
        .then( id => console.log('puxando usuario: '+ id ) )
        .catch( err => {err})
        }}  
        ).catch((err) => {console.error(err);});


        


export default usuarios;


