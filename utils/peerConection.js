let servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.1.google.com:19302",
                "stun:stun2.1.google.com:19302",
            ],
        },
    ],
};

let init = async () => {
    let localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });

    return localStream;
};

let createPeerConnection = async (localStream) => {
    let peerConnection = new RTCPeerConnection(servers);

    let remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            console.log(peerConnection.localDescription);
        }
    };

    return { peerConnection };
};

let createOffer = async () => {
    const { peerConnection } = createPeerConnection();

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

let createAnswer = async (offer) => {
    const { peerConnection } = createPeerConnection();
    offer = JSON.parse(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

let addAnswer = async (answer) => {
    answer = JSON.parse(answer);

    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
};

export { init, addAnswer, createAnswer, createOffer, createPeerConnection };
