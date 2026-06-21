import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";


const App = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(() => {
  try {
    const stored = localStorage.getItem("chat");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);



 
useEffect(() => {
  const el = textareaRef.current;
  if (el) {
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 200); 
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > 200 ? "auto" : "hidden";
  }
}, [input]);


useEffect(() => {
  localStorage.setItem("chat", JSON.stringify(chat));
}, [chat]);


  const sendMessage = async (data) => {
    const api = await axios.post("/api/chat", data);
    try {
      setLoading(true);
      
      
        setChat((prev) => [
      ...prev,
      {
        role: api.data.role,
        content: api.data.message,
      },
    ]);
    
    } catch (error) {
      console.log("Error in sending message", error.message);
      setChat((prev) => [
        ...prev,
        {
        role: api.data.role,
        content: api.data.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = () => {
    if (!input?.trim()) return;
    const msg = input;
    setInput("");
    //setting the user message
    setChat((prev) => [
      ...prev,
      {
        role: "user",
        content: msg,
      },
    ]);
    //sending the user message to backend
    sendMessage({ message: msg });
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white overflow-x-hidden">
      <div className="container mx-auto flex flex-col items-center gap-4 mt-6 max-w-5xl pb-45 px-4">
        <h1 className="text-5xl ">ChatBot</h1>

        {/* Chat section goes here */}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`my-3 p-3 rounded-xl w-fit max-w-2xl ${
              msg.role === "user"
                ? "bg-neutral-800 ml-auto"
                : "bg-neutral-900 mr-auto border border-2 border-dotted"
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div className="my-3 p-3 rounded-xl w-fit max-w-2xl bg-neutral-500 mr-auto">
            <p>Loading...</p>
          </div>
        )}

        {/*Bottom text area goes here  */}

        <div className="fixed inset-x-0 bottom-0 pb-7 bg-neutral-900 ">
          <div className="bg-neutral-800 bot p-2 rounded-3xl max-w-3xl w-full flex justify-center items-end  mx-auto items-center ">
            <textarea
            ref={textareaRef}
              name=""
              id="input"
              className="w-full outline-none p-2 resize-none overflow-auto scrollbar-none "
              value={input}
              placeholder="Ask anything"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            ></textarea>
            <div className="flex justify-end items-center">
              <button
                onClick={handleSubmit}
                // onClick={getResponse}
                className="bg-white px-4 py-1 rounded-full cursor-pointer hover:bg-gray-700 transition-colors text-black"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
