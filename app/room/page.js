"use client";

import { useContext, useEffect } from "react";
import { PeerContext } from "../Context";

const page = () => {
    const {
        localStreamRef,
        remoteStreamRef,
        localStreamState,
        remoteStreamState,
    } = useContext(PeerContext);

    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.srcObject = localStreamState;
            localStreamRef.current.play();
        }

        if (remoteStreamRef.current) {
            remoteStreamRef.current.srcObject = remoteStreamState;
            remoteStreamRef.current.play();
        }
    }, [localStreamRef, remoteStreamRef, localStreamState, remoteStreamState]);

    useEffect(() => {
        // if (remoteStreamRef.current) {
        //     remoteStreamRef.current.srcObject = remoteStreamState;
        //     remoteStreamRef.current.play();
        //     console.log("play!");
        // }
    }, [remoteStreamState]);

    const handlePlay = () => {
        remoteStreamRef.current.srtObject = remoteStreamState;
        remoteStreamRef.current.play();
    };

    return (
        <div className="w-full h-full bg-[#111] text-white">
            page
            <button onClick={() => handlePlay()}>play</button>
            <video ref={localStreamRef} />
            <video ref={remoteStreamRef} controls id="remote" />
        </div>
    );
};

export default page;
