/**
 * get ip location
 */
export default async function () { 
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
  var pc = new myPeerConnection({iceServers: []})
  var noop = function() {}
  var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
 
  pc.createDataChannel(""); 
  const sdp = await pc.createOffer()
  pc.setLocalDescription(sdp, noop, noop);
  return pc.onicecandidate = async function(ice) { 
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    var ips = ice.candidate.candidate.match(ipRegex)
    
  };
}