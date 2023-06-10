"use client";

import { useContext, useEffect, useState } from "react";
import { PeerContext } from "../Context";
import { TbSend } from "react-icons/tb";

const page = () => {
    const {
        localStreamRef,
        remoteStreamRef,
        localStreamState,
        remoteStreamState,
        sendMessage,
        remoteStream,
        localStream,
        messages,
    } = useContext(PeerContext);

    const [textValue, setTextValue] = useState("");

    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.srcObject = localStreamState;
            localStreamRef.current.play();
        }

        if (remoteStreamRef.current) {
            remoteStreamRef.current.srcObject = remoteStreamState;
            remoteStreamRef.current.play();
        }
    }, [
        localStreamRef,
        remoteStreamRef,
        localStreamState,
        remoteStreamState,
        localStream,
        remoteStream,
    ]);

    return (
        <>
            <div className="w-full h-full bg-[#222] text-white grid grid-cols-1 md:grid-cols-2 ">
                <div className="max-h-full items-center flex flex-col mt-[50px]">
                    <video
                        className="w-full max-w-[80%]  md:h-[300px] max-h-[35%] mb-[50px]"
                        ref={localStreamRef}
                    />
                    <video
                        className="w-full max-w-[80%]  md:h-[300px] max-h-[35%]"
                        ref={remoteStreamRef}
                        id="remote"
                    />
                </div>
                <div
                    className="w-full md:h-full  flex flex-col bg-[#222] pl-[10px]"
                    style={{ borderLeft: "1px solid #ccc" }}
                >
                    <div className="h-full">
                        {messages.map((m, index) => {
                            return (
                                <div key={index}>
                                    <h5 className="text-[20px]">
                                        {m.mine ? "Me" : "Remote"}
                                    </h5>
                                    <p className="text-[16px]">{m.message}</p>
                                </div>
                            );
                        })}
                    </div>
                    <form className="mt-auto flex flex-row mb-[5px]">
                        <textarea
                            className="w-full bg-[#222] outline-none p-[5px] "
                            style={{ border: "1px solid #ccc" }}
                            onChange={(e) => setTextValue(e.target.value)}
                            value={textValue}
                        />
                        <div
                            className="p-[7px] flex items-center justify-center cursor-pointer"
                            onClick={() => {
                                sendMessage({ message: textValue });
                                setTextValue("");
                            }}
                        >
                            send
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default page;
