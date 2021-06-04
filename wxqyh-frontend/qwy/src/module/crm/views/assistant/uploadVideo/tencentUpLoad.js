
export function loadJS(url, success) {
  let domScript = document.createElement('script');
  domScript.src = url;
  success = success || function() {};
  domScript.onload = domScript.onreadystatechange = function() {
    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
      success();
      this.onload = this.onreadystatechange = null;
    }
  }
  document.getElementsByTagName('head')[0].appendChild(domScript);
}

export function getFileType(name) {
  if (name != '' && name != null) {
    var nameArr = name.split('.');
    return nameArr[nameArr.length - 1].toLowerCase();
  }
}

export function convert_fileSize(filesize) {
  var strUnit = 'Bytes';
  var intDivisor = 1;
  if (filesize >= 1073741824) {
    strUnit = 'G';
    intDivisor = 1073741824;
  } else if (filesize >= 1048576) {
    strUnit = 'M';
    intDivisor = 1048576;
  } else if (filesize >= 1024) {
    strUnit = 'K';
    intDivisor = 1024;
  }
  if (intDivisor == 1) return parseInt(filesize) + ' ' + strUnit;
  return (filesize / intDivisor).toFixed(2) + ' ' + strUnit;
}

export function getFileNameNotExt(name) {
  var lastIndex = name.lastIndexOf('.');
  return name.substring(0, lastIndex);
}

export function uuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}

