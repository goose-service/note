/**
 * ajax interface
 * @param {string} url
 * @param {string} method
 * @param {object} params
 * @param {object} headers
 */
export default function (url= '', method='get', params= null, headers= null)
{
  return new Promise(function(resolve, reject) {
    // check url
    if (!url) reject('not found url');
    // set xhr instance object
    let xhr = new XMLHttpRequest();
    // xhr event
    xhr.onreadystatechange = function()
    {
      if (!(this.readyState === 4 && this.status === 200)) return;
      try
      {
        resolve(JSON.parse(this.responseText));
      }
      catch(e)
      {
        reject('parse error');
      }
    };
    // open xhr
    xhr.open(method.toUpperCase(), url, true);
    // set headers
    if (headers)
    {
      const keys = Object.keys(headers);
      for (let i=0; i<keys.length; i++)
      {
        xhr.setRequestHeader(keys[i], headers[keys[i]]);
      }
    }
    // send xhr
    xhr.send();
  })
};
