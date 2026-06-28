import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [threadId] = useState(() => {
    try {
      const stored = sessionStorage.getItem("threadId");
      if (stored) return stored;
      const id = Date.now().toString(36);
      sessionStorage.setItem("threadID", id);
      return id;
    } catch {
      return Date.now().toString(36);
    }
  });
  const [chat, setChat] = useState(() => {
    try {
      const stored = sessionStorage.getItem("chat");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

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
    sessionStorage.setItem("chat", JSON.stringify(chat));
  }, [chat]);

  const sendMessage = async (data) => {
    try {
      setLoading(true);
      const api = await axios.post("/api/chat", {
        message: data.message,
        threadId,
      });

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
          role: "error",
          content: `Please try again after 10 min`,
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
                ? "bg-blue-900/40 text-blue-200  ml-auto"
                : msg.role === "error"
                  ? "bg-red-900/40 text-red-200 mr-auto text-sm italic"
                  : "bg-green-900/40 text-green-200 italic mr-auto"
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center mr-auto gap-2">
            <div className="w-3 h-3 border-4 border-violet border-t-transparent rounded-full animate-spin" />
            <h1 className="animate-pulse">Thinking..</h1>
          </div>
        )}

        {/*Bottom text area goes here  */}

        <div className="fixed inset-x-0 bottom-0 pb-7 bg-neutral-900 ">
          <div className="bg-neutral-800 bot p-2 rounded-3xl max-w-3xl w-full flex justify-center items-end  mx-auto  ">
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
                disabled={loading}
                className={`px-4 py-1 rounded-full transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-white hover:bg-gray-700 text-black cursor-pointer"
                }`}
              >
                {loading ? "Loading..." : "Ask"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
