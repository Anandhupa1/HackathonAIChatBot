"use client"
import { AiOutlineSend } from "react-icons/ai"; 
import Image from "next/image";
import { useRef, useState } from "react";
import io from "socket.io-client";
const nodeServer = "http://localhost:4000"; 
const socket = io(nodeServer);

export default function Home() {
  const [stream,setStream]=useState("chat data here")
  let query = useRef()
  
  const processToken = (token) => {
    return token.replace(/\\n/g, "\n").replace(/\"/g, "");
  };

  function submitQuery(){
    setStream("")
    socket.emit("query",{query:query.current.value})
    }
  socket.on("token",(token)=>{
      if(token){
        console.log(token)
      setStream(stream+processToken(token))
      
                }
    })




  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>chat bot </h1> 
      <div>
        {stream}
      </div>
      {/* ____________________________________________________________ */}
        {/* <!-- chat text area  --> */}
        <div className="chat__comment">
                        <div className="container">
                            <div className="fn__chat_comment">
                                <div className="new__chat">
                                    <p>Ask it questions, engage in discussions, or simply enjoy a friendly chat.</p>
                                </div>
                                <textarea rows="1" className="fn__hidden_textarea" tabindex="-1"></textarea>
                                <textarea ref={query} rows="1" placeholder="Send a message..." id="fn__chat_textarea"></textarea>
                                <button onClick={()=>{submitQuery()}}>
                                    <AiOutlineSend />
                                </button>
                            </div>
                        </div>
                    </div>
      {/* ____________________________________________________________ */}
    </main>
  )
}
