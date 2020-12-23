
function Cs142TemplateProcessor (template) { 
    this.temp = template;
}

Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
    var placeHolder = /\{\{(\w|\d)*\}\}/g; 

    var filledIn = this.temp.replace(placeHolder, (match) => {
        var property = match.slice(2, match.length-2);
        var word = dictionary[property];
        if (word === undefined) {
            return " ";
        } else {
            return word;
        }
    });
    return filledIn;
};