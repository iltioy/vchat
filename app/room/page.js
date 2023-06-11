"use client";

import { useContext, useEffect, useState } from "react";
import { PeerContext } from "../Context";
import { TbSend } from "react-icons/tb";
import "./room.css";

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
        scrollRef,
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
            {/* grid grid-cols-1 md:grid-cols-2  */}
            <div className="w-full h-full bg-[#222] text-white flex flex-col md:flex-row">
                <div className="max-h-full md:h-full items-center flex flex-col mt-[50px] mb-[20px] md:mb-0 flex-1">
                    <video
                        className="w-full max-w-[80%] max-h-[40%] md:h-[400px] md:max-h-[35%] mb-[50px] "
                        ref={localStreamRef}
                    />
                    <video
                        className="w-full max-w-[80%] max-h-[40%]  md:h-[400px] md:max-h-[35%]"
                        ref={remoteStreamRef}
                        id="remote"
                    />
                </div>
                <div className="w-full flex flex-col max-h-full bg-[#222] pl-[20px] pr-[10px] relative leftBorder flex-1">
                    <div className="h-[400px] md:absolute md:h-[calc(100%-55px)] overflow-auto w-[calc(100%-30px)] right-[5px] flex flex-col">
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

                        {/* <br /> */}
                    </div>

                    <form className="mt-auto flex flex-row mb-[5px] md:absolute md:h-[50px] md:bottom-0 w-[calc(100%-30px)] right-[5px]">
                        <textarea
                            className="w-full bg-[#222] outline-none p-[5px] rounded-[5px]"
                            style={{
                                border: "1px solid #ccc",
                                boxShadow: "0 0 5px #ccc",
                            }}
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
