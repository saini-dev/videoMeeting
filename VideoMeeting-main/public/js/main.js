const socket = io('/')
const videoGrid = document.getElementById('videoGrid')
const myVideo = document.createElement('video');
const chatToggle = document.querySelector(".vc-chat");
const chatbox = document.querySelector("#chatbox")

myVideo.muted = true

var peer = new Peer()

const myPeer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: '5000',
})

const peers = {}
let myVideoStream
navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		myVideoStream = stream
		addVideoStream(myVideo, stream)

		socket.on('user-connected', (userId) => {
			connectToNewUser(userId, stream)
			alert('Somebody connected', userId)
		})

		peer.on('call', (call) => {
			call.answer(stream)
			const video = document.createElement('video')
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream)
			})
		})

		let text = $('input')

		$('html').keydown(function (e) {
			if (e.which == 13 && text.val().length !== 0) {
				socket.emit('message', text.val())
				text.val('')
			}
		})
		// <span>
		// 								From 
		// 								<span class="messageSender">Someone</span> 
		// 								to 
		// 								<span class="messageReceiver">Everyone:</span>
		// 							</span>

		socket.on('createMessage', (message, userId) => {
			$('ul').append(`<li >
								<span class="messageHeader">
									

									${new Date().toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>

								<span class="message">${message}</span>
							
							</li>`)
			scrollToBottom()
		})
	})

socket.on('user-disconnected', (userId) => {
	if (peers[userId]) peers[userId].close()
})

peer.on('open', (id) => {
	socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream)
	})
	call.on('close', () => {
		video.remove()
	})

	peers[userId] = call
}

const addVideoStream = (video, stream) => {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video)
}

const scrollToBottom = () => {
	var d = $('.mainChatWindow')
	d.scrollTop(d.prop('scrollHeight'))
}

const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false
		setUnmuteButton()
	} else {
		setMuteButton()
		myVideoStream.getAudioTracks()[0].enabled = true
	}
}
//   <i class="fas fa-microphone"></i>
const setMuteButton = () => {
	const html = `
	<i class="fas fa-microphone"></i>
	  <span>Mute</span>
	`
	document.querySelector('.mainMuteButton').innerHTML = html
}
	//   <i class="unmute fas fa-microphone-slash"></i>

const setUnmuteButton = () => {
	const html = `
	<i class="unmute fas fa-microphone-slash"></i>
	  <span>Unmute</span>
	`
	document.querySelector('.mainMuteButton').innerHTML = html
}

const playStop = () => {
	console.log('playStop')
	let enabled = myVideoStream.getVideoTracks()[0].enabled
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false
		setPlayVideo()
	} else {
		setStopVideo()
		myVideoStream.getVideoTracks()[0].enabled = true
	}
}
{/* <i class="fas fa-video"></i> */}
const setStopVideo = () => {
	const html = `
	<i class="fas fa-video"></i>
	  <span>Stop Video</span>
	`
	document.querySelector('.mainVideoButton').innerHTML = html
}

{/* <i class="stop fas fa-video-slash"></i> */}
const setPlayVideo = () => {
	const html = `
	<i class="stop fas fa-video-slash"></i>
	  <span>Play Video</span>
	`
	document.querySelector('.mainVideoButton').innerHTML = html
}
 const disconnectCall = () => {
  console.log("END IS PRESS")
  window.open('https://coaching.mastersunion.org/meetingList?userId=24ddf443-adb7-439e-87c5-907dd828gba7&studentId=b09026d8-7e59-4aed-902a-293efd5f730d','_self');
  };

chatToggle.addEventListener("click", () => {
	if(chatbox.style.display === "flex") chatbox.style.display = "none";
	else chatbox.style.display = "flex";
})

//   const shareScreen = ()=>{
//     console.log("share screen button prees");
// 	// captureVideo();
//     // shareScreen()
//   }



//   let captureVideo = async function() {
//     try {
//         let getScreenData = await navigator.mediaDevices.getDisplayMedia({
//             video: true,
//             audio: true
//         });
//         videoElement.srcObject = getScreenData;
//     } catch (e) {
//         console.log(e);
//     }

// }


// function shareScreen() {
// 	navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
// 		const screenTrack = stream.getTracks()[0];
// 		senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
// 		screenTrack.onended = function() {
// 			senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
// 		}
// 	})
// }