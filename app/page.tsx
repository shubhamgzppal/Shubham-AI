'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatHeader from './components/ChatHeader'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import Sidebar from './components/Sidebar'
import BottomSheet from './components/BottomSheet'
import TypingDots from './components/TypingDots'
import { Message } from './types/chat'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedModel, setSelectedModel] = useState({ label: 'Chat Model', value: 'models/gemini-2.5-flash-lite' })

  const modelOptions = [
    { label: 'Chat Model', value: 'models/gemini-2.5-flash-lite' },
    { label: 'Image Model', value: 'models/gemini-2.0-flash-preview-image-generation' },
  ]


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSelectChat(id: string) {
    console.log('Chat selected:', id)
    setMessages([])
  }

  const handleUserChange = (user: { name: string; email?: string } | null) => {
    console.log("User changed in Sidebar:", user)
  }

  const sendMessage = async (content: string, apiUrl = '/api/chat', bodyData?: BodyInit) => {
    setLoading(true)
    setMessages(prev => [...prev, { id: uuidv4(), content, role: 'user', timestamp: new Date().toISOString() }])
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: apiUrl === '/api/chat' ? { 'Content-Type': 'application/json' } : undefined,
        body: bodyData ?? JSON.stringify({ message: content, model: selectedModel.value }),
      })
      if (!res.ok) throw await res.json()
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: uuidv4(),
        content: data.text || "Here's your generated image:",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        imageUrl: data.imageUrl,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        content: apiUrl === '/api/chat' ? 'Sorry, there was an error processing your request.' : 'Sorry, there was an error generating the image.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (content: string) => sendMessage(content)

  const handleGenerateImage = (prompt: string, imageFile?: File) => {
    const formData = new FormData()
    formData.append('prompt', prompt)
    if (imageFile) formData.append('image', imageFile)
    sendMessage(imageFile ? `Modify image: ${prompt}` : `Generate image: ${prompt}`, '/api/generate-image', formData)
  }

  const handleNewChat = () => setMessages([])

  return (
    <main className="d-flex flex-column vh-100 bg-black text-white">
      <ChatHeader onMenuClick={() => setShowSidebar(true)} onNewChat={handleNewChat} />
      <Sidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={null}
        onLogin={() => console.log('Login clicked')}
        onLogout={() => console.log('Logout clicked')}
        onSignup={() => console.log('Signup clicked')}
        chats={[]}
        onUserChange={handleUserChange}
        onSelectChat={handleSelectChat}
        models={modelOptions}
        selectedModel={selectedModel}
        onModelChange={(model) => {setSelectedModel(model)}}
      />

      <div className="flex-grow-1 overflow-auto d-flex flex-column px-3 py-2">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            onSendMessage={handleSendMessage}
          />
        ))}
        {loading && <TypingDots />}
        <div ref={scrollRef} />
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        onGenerateImage={handleGenerateImage}
        onAttachClick={() => setShowBottomSheet(true)}
        selectedModel={selectedModel}
        onModelChange={(model) => {setSelectedModel(model)}}
      />
      <BottomSheet show={showBottomSheet} onClose={() => setShowBottomSheet(false)} />
    </main>
  )
}