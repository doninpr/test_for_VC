
var questionSum = _quizData.questions.length
var _currentQuestionID = 0;
var _correctAnswersCounter = 0;
var buttonClasses = {
	"button": "test_button",
	"shadow": "shadow",
	"wrong": "wrong-answer",
	"correct": "correct-answer",
	"transparent": "transparent",
	"share": "share_btn"
};

var icons = {
	"next": "<object type='image/svg+xml' data='images/arrow.svg' width='26' height='20'>" + "<img src='images/arrow.png' width='26' height='20' alt='→' />" + "</object>",
	"restart": "<object type='image/svg+xml' data='images/refresh-arrow.svg' width='21' height='21'>" + "<img src='images/refresh-arrow.png' width='21' height='21' alt='→' />" + "</object>",
	"vk": "<object type='image/svg+xml' data='images/vk-social-logotype.svg' width='28' height='16'><img src='images/vk-social-logotype.png' width='28' height='16' alt='VK' /></object>",
	"fb": "<object type='image/svg+xml' data='images/facebook-logo.svg' width='13' height='24'><img src='images/facebook-logo.png' width='13' height='24' alt='Facebook' /></object>",
	"tw": "<object type='image/svg+xml' data='images/twitter-logo-silhouette.svg' width='26' height='21'><img src='images/twitter-logo-silhouette.png' width='26' height='21' alt='Twitter' /></object>",
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getQuizHTML() {
	return $("<div id='vc_test' class='test_wrap'>" +
		"<div id='background-box'></div>" +
		"<div id='test_inner' class='test_inner'>" +
			"<div id='test_content'></div>" +
			"<div id='test_buttons' class='align-mobile'></div>" +
		"</div></div>");
}

function getButtonHTML(text, classes = '', onclick = '', dataTags = '') {
	return $("<div class='test_button' " + (onclick !== '' ? "onclick='" + onclick + "' " : '') + dataTags + ">" + text + "</div>").addClass( Array.isArray(classes) ? classes.join(' ') : classes );
}

function getTextBoxHTML(text, classes = '') {
	return $("<p class='text-box'>" + text + "</p>").addClass( Array.isArray(classes) ? classes.join(' ') : classes );
}

function getCounterHTML(id) {
	return $(getTextBoxHTML((id + 1) + "/" + questionSum, 's-text'));
}

function getResultCounterHTML() {
	return $(getTextBoxHTML(_correctAnswersCounter + " из " + questionSum + " правильных ответов", 's-text'));
}

function getOptionsHTML(options, classes) {
	var optionsShuffle = shuffle(options);
	var optionsList = optionsShuffle.map(function(option, index) {
		return "<li>" + "<input type='radio' value='" + index + "' name='answer_opt' id='radio"+index+"'/>" +
			"<label for='radio"+index+"'>" + getButtonHTML(option.optionText, classes, "setAnswer(" + JSON.stringify(option).replace(/\'/g,"\\\"") + ", " + option.isCorrest + ")" ).prop('outerHTML') + "</label>" + "</li>"
	}).join('')

	return $("<div id='answer_options'>" +
		"<ul>" + optionsList +
		"</ul>" + "</div>");
}

function getSocialButtonsHTML() {
	return "<div id='social_links'>" +
			getButtonHTML(icons.fb + " Поделиться", [buttonClasses.shadow, buttonClasses.share], 'share("' + 'fb' + '", "' + location.href + '")').prop('outerHTML') + "<div class='clear_both'></div>" +
			getButtonHTML(icons.vk, [buttonClasses.shadow, buttonClasses.share],  'share("' + 'vk' + '", "' + location.href + '")').prop('outerHTML') + "<div class='clear_both'></div>" +
			getButtonHTML(icons.tw, [buttonClasses.shadow, buttonClasses.share],  'share("' + 'tw' + '", "' + location.href + '")').prop('outerHTML') +
		"</div>"
}

function setBackground(bgImgs) {
	var bgHTML = $(bgImgs.map(function(image) {
		  return "<img class='" + image + "' src='images/" + image + ".png' >";
		}).join(''));
	$('#background-box').html(bgHTML);
}

function setButton(button, isMobile = false) {
	$('#test_buttons').html( button );
}

function setContent(html) {
	$('#test_content').html( html );
}

function setCartridge({ buttons =  '', background = [], content = '' }) {
	$("#vc_test").ready(function() {
		setBackground(background);
		setButton(buttons);
		setContent(content);
	});
}

function startQuiz() {
	$("#vc_test").ready(function() {
		_correctAnswersCounter = 0;
		_correctAnswersCounter = 0;

		var contentHTML = $("<div class='heading-box test-label'>" + getTextBoxHTML('Как хорошо вы разбираетесь<br>в новостях бизнеса', 'l-text').prop('outerHTML') + "</div>" +
			"<div>" + getTextBoxHTML('По следам публикаций на vc.ru', 's-text').prop('outerHTML') + "</div>");

		$("#test_inner").removeClass('content-narrow');

		setCartridge({
			buttons: getButtonHTML('Начать', buttonClasses.shadow, "setQuestion(0)"),
			background: _quizData.startImages,
			content: contentHTML
		});
	});
}

function setResult() {
	var resultType = _quizData.results.types[_correctAnswersCounter]
	var contentHTML = $(getResultCounterHTML().prop('outerHTML') + "<div class='heading-box result-heading'>" + getTextBoxHTML(_quizData.results.content[resultType].text, 'l-text').prop('outerHTML') + "</div>" + getSocialButtonsHTML());

	setCartridge({
		buttons: getButtonHTML('Пройти еще раз ' + icons.restart, buttonClasses.transparent, "startQuiz()"),
		background: _quizData.results.content[resultType].images,
		content: contentHTML
	});
}

function setQuestion(id) {
	_currentQuestionID = id
	_currentQuestionID

	if(_currentQuestionID + 1 > questionSum) {
		setResult();
		return null;
	}
	var contentHTML = $(
			"<div>" + getCounterHTML(id).prop('outerHTML') + "</div>" +
			"<div>" + getTextBoxHTML(_quizData.questions[id].questionText).prop('outerHTML') + "</div>" +
			getOptionsHTML(_quizData.questions[id].options).prop('outerHTML')
		);

	$("#test_inner").addClass('content-narrow');
	setCartridge({
		content: contentHTML
	});
}

function setAnswer(option, isCorrect, id) {
	if(isCorrect) _correctAnswersCounter++;
	$('#answer_options').remove();
	$('#test_content').append( getOptionsHTML([ option ], isCorrect ? buttonClasses.correct : buttonClasses.wrong ).prop('outerHTML') + "<div>" + getTextBoxHTML(option.explanation, 's-text').prop('outerHTML') + "</div>");
	setButton( getButtonHTML('Продолжить ' + icons.next, buttonClasses.transparent, "setQuestion(" + (_currentQuestionID + 1) + ")"), true );
}
 
 
/**
* Создание нового окна браузера для репоста в соц.сеть
*
* @param string social - социальная сеть, в которую будет сделан репост
* @param string url_share - url страницы, которая будет опубликована в соц.сети
*/
function share(social, url_share){
    // определяем ссылку для нужной соц.сети
    var url_soc = false;
    switch (social) {
        case "vk":
            url_soc = "https://vk.com/share.php?url="+url_share;
            break;
        case "fb":
            url_soc = "https://www.facebook.com/sharer/sharer.php?u="+url_share;
            break;
        case "ok":
            url_soc = "https://connect.ok.ru/offer?url="+url_share;
            break;
        case "tw":
            url_soc = "https://twitter.com/intent/tweet?url="+url_share;
            break;
        case "gp":
            url_soc = "https://plus.google.com/share?url="+url_share;
            break;
    }
     
    // открытие нового окна для шаринга
    if(url_soc){
        // размеры окна
        var width = 800, height = 500;
        // центруем окно
        var left = (window.screen.width - width) / 2;
        var top = (window.screen.height - height) / 2;
        // открываем окно
        social_window = window.open(url_soc, "share_window", "height=" + height + ",width=" + width + ",top=" + top + ",left=" + left);
        // устанавливаем на окно фокус
        social_window.focus();
    }
}




