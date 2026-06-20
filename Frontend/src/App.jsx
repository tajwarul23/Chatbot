import { useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const handleSubmit = () => {
    if (!message?.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("")
  
    
  };



  return (
    <div className="bg-neutral-900 min-h-screen text-white overflow-x-hidden">
      <div className="container mx-auto flex flex-col items-center gap-4 mt-6 max-w-5xl pb-45">
        <h1 className="text-5xl ">Chatbot</h1>
        {/*Assistant Messages goes here */}
        {responses.length > 0 &&
          responses.map((m, i) =>( 
            <div key={i} className="my-6 bg-neutral-500 p-3 rounded-xl mr-auto">
              <h1>{m}</h1>
            </div>)
          )}
        {/* User message goes here */}

        {messages.length > 0 &&
          messages.map((m, i) => (
            <div
              key={i}
              className="my-6 bg-neutral-800 p-3 rounded-xl flex justify-between ml-auto w-fit"
            >
              <h1>{m}</h1>
            </div>
          ))}

        {/*Bottom text area goes here  */}

        <div className="fixed inset-x-0 bottom-4 bg-neutral-900">
          <div className="bg-neutral-800 p-2 rounded-3xl max-w-3xl w-full flex justify-center  mx-auto items-center ">
          <textarea
            name=""
            id=""
            className="w-full resize-none outline-none p-2"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
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
