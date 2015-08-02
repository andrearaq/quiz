//controlador
var models = require('../models/models.js');
var QS = require('querystring');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
	  where: { id: Number(quizId) },
      include: [{ model: models.Comment }]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)) }
    }
  ).catch(function(error) { next(error) });
};

// GET /quizes
exports.index = function(req, res) {
  var search = "%"+req.query.buscar+"%";
  search = search.replace(" ","%");
	  models.Quiz.findAll({where:["pregunta LIKE ?", search], order:"pregunta"}).then(
		function(quizes) {
		  res.render('quizes/index.ejs', { quizes: quizes, errors:[] });
		}
	  ).catch(function(error) { next(error) });
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors:[] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[] });
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
  );
  res.render('quizes/new', {quiz: quiz, errors:[] });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz.validate().then(
	function(err){
		if(err){
			res.render('quizes/new', { quiz: quiz, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta, respuesta y tema de quiz
			if (quiz.pregunta != "Pregunta" && quiz.respuesta != "Respuesta"){ //evita que se guarde una pregunta con el texto "Pregunta"
				console.log("Nueva pregunta guardada");
				quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
					res.redirect('/quizes')});   // res.redirect: Redirección HTTP a lista de preguntas
			} else {
				res.redirect('/quizes');
			}
		}
	});
};

// GET /quizes/edit
exports.edit = function (req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:quizId/update
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: []});
			} else {
				req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
					res.redirect('/quizes')});
			}
		});
};

// DELETE /quizes/:id
exports.destroy = function (req, res) {
	req.quiz.destroy().then (function() {
		res.redirect('/quizes');
	}).catch(function(error) { next(error)});
};