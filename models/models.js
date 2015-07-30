// construcción base datos sqlite
var path = require('path');
var Sequelize = require('sequelize');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;
/*
// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
	{dialect: "sqlite", storage: "quiz.sqlite"	});  */
	
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);	
// importar archivo quiz.js con definicion de bd	
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;

sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.bulkCreate( 
        [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', tema: 'humanidades' },
          {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'humanidades' },
		  {pregunta: 'Mejor jugador de futbol', respuesta: 'Messi', tema: 'ocio'}
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});
