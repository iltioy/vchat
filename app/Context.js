"use client";

import { data } from "autoprefixer";
import { createContext } from "react";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const PeerContext = createContext();

let peerConnection;
let localStream;
let remoteStream;
let dataChannel;
const socket = io("http://localhost:5000");

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

const ContextProvider = ({ children }) => {
    const localStreamRef = useRef();
    const remoteStreamRef = useRef();
    const scrollRef = useRef();

    const [localStreamState, setLocalStreamStaete] = useState(null);
    const [remoteStreamState, setRemoteStreamState] = useState(null);
    const [messages, setMessages] = useState([]);

    const [isError, setIsError] = useState(false);

    useEffect(() => {
        handleCreateStream();
    }, []);

    const handleError = (error) => {
        setIsError(true);
    };

    const handleCreateStream = async () => {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            localStream = stream;

            setLocalStreamStaete(stream);
        } catch (error) {
            handleError(error);
        }
    };

    const createPeerConnection = () => {
        try {
            peerConnection = new RTCPeerConnection(servers);
            remoteStream = new MediaStream();

            dataChannel = peerConnection.createDataChannel("messages");

            peerConnection.ondatachannel = (e) => {
                peerConnection.dc = e.channel;
                peerConnection.dc.onmessage = (e) => {
                    setMessages((prevState) => [
                        ...prevState,
                        { message: e.data, mine: false },
                    ]);

                    if (scrollRef.current) {
                        scrollRef.current.scrollIntoView();
                    }
                };
                peerConnection.dc.onopen = (e) => console.log("opened!");
            };

            localStreamState.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStreamState);
            });

            peerConnection.ontrack = async (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };

            setRemoteStreamState(remoteStream);
        } catch (error) {
            handleError(error);
        }
    };

    const sendMessage = async ({ message }) => {
        try {
            setMessages((prevState) => [...prevState, { message, mine: true }]);
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView();
            }
            await dataChannel.send(message);
        } catch (error) {
            handleError(error);
        }
    };

    const createOffer = async ({ remoteId, myId }) => {
        try {
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
        } catch (error) {
            handleError(error);
        }
    };

    const sleep = (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    };

    const createAnswer = async ({ remoteId, myId, offer }) => {
        try {
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
        } catch (error) {
            handleError(error);
        }
    };

    const addAnswer = async ({ answer }) => {
        try {
            await peerConnection.setRemoteDescription(answer);
        } catch (error) {
            handleError(error);
        }
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
                sendMessage,
                messages,
                isError,
                setIsError,
                scrollRef,
            }}
        >
            {children}
        </PeerContext.Provider>
    );
};

export { PeerContext, ContextProvider };
