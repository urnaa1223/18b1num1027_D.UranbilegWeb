var Promise = require("Promise");

function fetchModel(url) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) {
        return;
      }
      if (this.status != 200) {
        reject({ status: xhr.status, statusText: xhr.statusText });
      } else {
        resolve({ data: JSON.parse(this.responseText) });
      }
    };
  });
}

export default fetchModel;
