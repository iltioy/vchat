"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { PeerContext } from "./Context";
import { useRouter } from "next/navigation";

export default function Home() {
    const [isCoppied, setIsCoppied] = useState(false);
    const [myId, setMyId] = useState("");
    const [remoteId, setRemoteId] = useState("");
    const [invitaions, setInvitaions] = useState([]);

    const idRef = useRef();

    const router = useRouter();

    const {
        createOffer,
        socket,
        createAnswer,
        addAnswer,
        isError,
        setIsError,
    } = useContext(PeerContext);

    useEffect(() => {
        socket.on("my_id", (data) => {
            setMyId(data);
        });

        socket.on("offer_send", (data) => {
            setInvitaions((prevState) => {
                return [data, ...prevState];
            });
        });

        socket.on("answer_send", (data) => {
            addAnswer({ answer: data.answer });
            setRemoteId(data.senderId);
            router.push("/room");
        });
    }, [socket]);

    return (
        <div className="w-full h-full bg-[#111] flex justify-center">
            {/* <button>start</button>
            <button onClick={createOffer}>create offfer</button>
            <button onClick={createAnswer}>create answer</button>
            <button onClick={addAnswer}>add answer</button>

            <video
                className="w-[480px] h-[270px] pr-[20px]"
                ref={localStreamRef}
                muted
            />
            <video className="w-[480px] h-[270px]" ref={remoteStreamRef} />
 
            <textarea id="offer-sdp" />
            <textarea id="answer-sdp" /> */}
            {isError && (
                <div className="absolute flex w-full h-full items-center flex-col mt-[100px] ">
                    <motion.div
                        className="bg-red-400 p-[20px] z-[11] font-bold"
                        initial={{ y: -75, opacity: 0 }}
                        animate={{ y: 25, opacity: 1 }}
                        transition={{
                            type: "tween",
                            ease: "easeOut",
                            duration: 0.75,
                        }}
                    >
                        <h3>Произошла ошибка</h3>
                        {/* <p className="break-words">
                            asdhkaujsdkjhasgdgjhkasgdjkagsjhdghjasgdgasgdjgjahsjd
                        </p> */}
                        <p>
                            Для решения проблемы попробуйте перезагрузить
                            страницу
                        </p>
                        <br />
                        <button
                            onClick={() => {
                                router.push("/");
                                setIsError(false);
                                window.location.reload();
                            }}
                        >
                            Перезагрузить
                        </button>
                    </motion.div>
                </div>
            )}

            <div className="absolute flex w-full h-full items-center flex-col ">
                {invitaions.map((invite, index) => {
                    return (
                        <motion.div
                            className=" w-[400px] h-[125px] bg-[#222] z-10 mb-[20px] rounded-[5px] text-white font-bold p-[20px] flex flex-col"
                            initial={{ y: -75, opacity: 0 }}
                            animate={{ y: 25, opacity: 1 }}
                            transition={{
                                type: "tween",
                                ease: "easeOut",
                                duration: 0.75,
                            }}
                            exit={{ opacity: 0 }}
                            style={{ border: "1px solid grey" }}
                            key={index}
                        >
                            <h5 className="mb-auto">
                                Новое приглашение от {invite.senderId}!
                            </h5>

                            <div className="flex flex-row mb-[5px]">
                                <button
                                    className="mr-[20px]"
                                    onClick={() => {
                                        createAnswer({
                                            myId,
                                            remoteId: invite.senderId,
                                            offer: invite.offer,
                                        });
                                        router.push("/room");
                                    }}
                                >
                                    Принять
                                </button>
                                <button
                                    onClick={() =>
                                        setInvitaions((prevState) =>
                                            prevState.filter(
                                                (inv) =>
                                                    inv.senderId !==
                                                    invite.senderId
                                            )
                                        )
                                    }
                                >
                                    Отклонить
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div
                className="relative top-[35%] translate-y-[-35%] text-white w-[350px] h-[450px] 
            rounded-3xl border-solid border-[#222] border-[1px] p-8 bg-[#222]
            "
                style={{ boxShadow: "0 0 20px #222" }}
            >
                <h3 className="font-bold text-xl">Ваш ключ:</h3>
                <input
                    readOnly
                    value={myId}
                    className="text-[#111] font-bold select-none outline-none border-none rounded-[10px] p-[7px] text-[15px] w-full mt-[15px] bg-[#f5f5f5] overflow-hidden"
                    ref={idRef}
                />

                <button
                    className="bg-[#222] rounded-[7px] mt-[15px] p-[6px] text-[15px] text-bold"
                    style={{
                        border: "1px solid #ccc",
                        boxShadow: "0 0 5px #ccc",
                    }}
                    onClick={() => {
                        setIsCoppied(true);
                        navigator.clipboard.writeText(myId);
                        setTimeout(() => {
                            setIsCoppied(false);
                        }, 3000);
                    }}
                >
                    {isCoppied ? "Скопировано!" : "Скопировать"}
                </button>

                <h3 className="font-bold text-xl mt-[30px]">Начать звонок</h3>
                <input
                    className="text-[#111] font-bold select-none outline-none border-none rounded-[10px] p-[7px] text-[15px] w-full mt-[15px] bg-[#f5f5f5] overflow-hidden"
                    ref={idRef}
                    placeholder="Ключ друга"
                    value={remoteId}
                    onChange={(e) => setRemoteId(e.target.value)}
                />

                <button
                    className="bg-[#222] rounded-[7px] mt-[15px] p-[6px] text-[15px] text-bold"
                    style={{
                        border: "1px solid #ccc",
                        boxShadow: "0 0 5px #ccc",
                    }}
                    onClick={() => createOffer({ remoteId, myId })}
                >
                    Начать
                </button>
            </div>
        </div>
    );
}
