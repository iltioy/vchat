"use client";

import { createContext } from "react";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const PeerContext = createContext();

const ContextProvider = ({ children }) => {
    const socket = io("http://localhost:5000");

    let peerConnection;
    let localStream;
    let remoteStream;

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

    const localStreamRef = useRef();
    const remoteStreamRef = useRef();

    const [localStreamState, setLocalStreamStaete] = useState(null);
    const [remoteStreamState, setRemoteStreamState] = useState(null);

    useEffect(() => {
        handleCreateStream();
    }, []);

    const handleCreateStream = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        localStream = stream;
        setLocalStreamStaete(stream);
    };

    const createPeerConnection = () => {
        peerConnection = new RTCPeerConnection(servers);
        remoteStream = new MediaStream();

        // if (remoteStreamRef.current && remoteStream) {
        //     remoteStreamRef.current.srcObject = remoteStream;
        //     remoteStreamRef.current.play();
        // }
        localStreamState.getTracks().forEach((track) => {
            console.log("nana");
            peerConnection.addTrack(track, localStreamState);
        });

        peerConnection.ontrack = async (event) => {
            event.streams[0].getTracks().forEach((track) => {
                console.log("asdasdasdasdasdasduasjidajshdkjsajkd");
                remoteStream.addTrack(track);
            });
            console.log(remoteStream);
            // setRemoteStreamState(remoteStream);
            console.log("streamChanged");
        };

        setRemoteStreamState(remoteStream);
    };

    const createOffer = async ({ remoteId, myId }) => {
        createPeerConnection();

        peerConnection.onicecandidate = async (event) => {
            //Event that fires off when a new offer ICE candidate is created
            // if (event.candidate) {
            //     console.log(peerConnection.localDescription);
            //     socket.emit("offer_created", {
            //         offer: peerConnection.localDescription,
            //         remoteId,
            //         senderId: myId,
            //         ice: true,
            //     });
            // }
        };

        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await sleep(1000);

        socket.emit("offer_created", {
            offer: peerConnection.localDescription,
            remoteId,
            senderId: myId,
        });
    };

    const sleep = (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    };

    const createAnswer = async ({ remoteId, myId, offer }) => {
        createPeerConnection();

        peerConnection.onicecandidate = async (event) => {
            //Event that fires off when a new answer ICE candidate is created
            // if (event.candidate) {
            //     console.log("Adding answer candidate...:", event.candidate);
            //     socket.emit("answer_created", {
            //         answer: peerConnection.localDescription,
            //         remoteId,
            //         answeringId: myId,
            //     });
            // }
        };

        await peerConnection.setRemoteDescription(offer);

        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        await sleep(1000);

        socket.emit("answer_created", {
            answer: peerConnection.localDescription,
            remoteId,
            answeringId: myId,
        });
    };

    const addAnswer = async ({ answer }) => {
        await peerConnection.setRemoteDescription(answer);

        // remoteStreamRef.current.play();
    };

    return (
        <PeerContext.Provider
            value={{
                peerConnection,
                localStream,
                remoteStream,
                localStreamRef,
                remoteStreamRef,
                socket,
                createPeerConnection,
                createOffer,
                createAnswer,
                addAnswer,
                localStreamState,
                remoteStreamState,
            }}
        >
            {children}
        </PeerContext.Provider>
    );
};

export { PeerContext, ContextProvider };
