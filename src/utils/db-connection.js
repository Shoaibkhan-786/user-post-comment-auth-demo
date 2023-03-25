const {set , connect, connection} = require('mongoose');

function connectDatabase(){
    set('strictQuery',true);
    return connect("mongodb://localhost:27017/LoginSignup_EJS");
}


connection.on( 'connected' , () => {
 console.log("database connected");
})


module.exports = connectDatabase;