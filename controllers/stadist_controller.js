var models = require('../models/models.js');
/*
    El número de preguntas  nquizes
    El número de comentarios totales  ncomments
    El número medio de comentarios por pregunta  medComments
    El número de preguntas sin comentarios quizWihCom
    El número de preguntas con comentarios quizWithoutCom
*/
exports.show = function(req,res){
  models.Quiz.count().then(function (nquizes){
	models.Comment.count().then(function (ncomments){

		var medComments= ncomments / nquizes;

		  models.Quiz.findAll({
			include:[{model: models.Comment}]
			}).then(function (quizes){
				var quizWithCom = 0;
				for (i in quizes){
					if (quizes[i].Comments.length)
						quizWithCom++;
				}
			var quizWithoutCom = nquizes - quizWithCom;
			res.render('stadists/show', 
				{quizes: nquizes,
				 comments: ncomments,
				 medComments: medComments,
				 quizWithCom: quizWithCom,
				 quizWithoutCom: quizWithoutCom,
				 errors: []
				});
		  });
		});
	});
};