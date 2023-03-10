import { useEffect, useState } from 'react'
import { Configuration, OpenAIApi } from 'openai';
import OPENAI_API_KEY from './private/secret-key.json'
import './normal.css';
import './App.css';
import ChatMessage from './components/ChatMessage';

function App() {

  const configuration = new Configuration({
    organization: 'org-WzkZiwlPar8ufmx2Za26m9pi',
    apiKey: OPENAI_API_KEY.value,
  });
  const openai = new OpenAIApi(configuration);

  // ******** Urls for firebase function ********
  // const URLs = {
  //   dev: "http://localhost:5000/chatgpt-clone-f112f/us-central1/app",
  //   dev2: "http://127.0.0.1:5001/chatgpt-clone-f112f/us-central1/app",
  //   prod: "https://us-central1-chatgpt-clone-f112f.cloudfunctions.net/app",
  // }

  const initialChatLog = [
    {user: "gpt", message: "Hi, I'm GPT-3, welcome to my demo!"},
  ]

  const [tokens, setTokens] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState(initialChatLog);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newMessage = {user: "Me", message: `${input}`};
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);

    const messages = updatedChatLog.map(obj => obj.message).join(" ");

    console.log(messages)

    // Clear the input field after submit
    setInput('');
    setLoading(true);

    // OpenAi create completion request
    await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${messages}-`,
      max_tokens: 200,
      temperature: 0.7,
      }).then((response) => {
          const message = response.data.choices[0].text
          console.log("message", message)
          console.log("tokens",tokens)
          setChatLog([...updatedChatLog, { user: "gpt", message: message }])
          setTokens(response.data.usage.total_tokens + tokens)
          setLoading(false)
      })
      .catch(err => {
        console.log(err)
        alert("Something went wrong. Please try again later.")
        setLoading(false)
      })

    // fetch request to port firebase function

    // await fetch(URLs.prod, {
    //   method: "POST",
    //   mode: "cors",
    //   body: JSON.stringify({message:messages})
    // })
    // .then(res => (res.json()
    //   .then(data => {
    //     console.log(data)
    //     let message = data.message
    //     let totalTokens = data.tokens + tokens
    //     setTokens(totalTokens)
    //     if (message.length > 0) {
    //       // Update the chat log with the response from server
    //       setChatLog([...updatedChatLog, { user: "gpt", message: message }]);
    //     }
    //     setLoading(false)
    // })))
    // .catch(err => {
    //   console.log(err)
    //   alert("Something went wrong. Please try again later.")
    //   setLoading(false)
    // })
  }

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    if (loading) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [loading])

  useEffect(() => {
    if (tokens > 200) {
      setDisabled(true)
      setChatLog(prev => ([...prev, { user: "gpt", message: "Token limit for the session reached. Thank you for trying my demo!" }]));
    }
  }, [tokens])

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-btn" onClick={(e) => setChatLog(initialChatLog)}>+ New Chat</div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {
            chatLog.map((obj, i) => (
              <ChatMessage key={i} message={obj} />
            ))
          }
        </div>
        <div className="chat-input-container">
          <form
          onSubmit={(e) => handleSubmit(e)} >
            <input className="chat-input-textarea"
            disabled={disabled}
            placeholder={loading ? "Loading..." : tokens > 200? "Thank you for trying my demo!" : "Type your message here"}
            value={input}
            onChange={(e) => handleChange(e)}/>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
