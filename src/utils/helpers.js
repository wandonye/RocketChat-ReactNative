
import {
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

export function checkEmail(emailAddress) {
  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

  var reValidEmail = new RegExp(sValidEmail);

  return reValidEmail.test(emailAddress);
}

export function  getLocalStream(isFront, callback) {
  MediaStreamTrack.getSources(sourceInfos => {
    let videoSourceId;
    console.warn(isFront ? "front" : "back");
    console.log('source list', sourceInfos);
    for (const i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if(sourceInfo.kind == "video" &&
          sourceInfo.facing == isFront ? "front" : "back") {
        videoSourceId = sourceInfo.id;
      }
    }
    getUserMedia({
      audio: true,
      video: {
        facingMode: isFront ? 'user' : 'environment',
        optional: [{sourceId: videoSourceId}],
        mandatory: { minWidth: 800, minHeight: 600 },
        width: { min: 800, ideal: 1280 },
        height: { min: 600, ideal: 1024 }
      }
      // "audio": true,
      // "video": {
      //   optional: [{sourceId: videoSourceId}]
      // }
    }, function (stream) {
      callback(stream);
    }, console.warn);
  });
}

export function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}
