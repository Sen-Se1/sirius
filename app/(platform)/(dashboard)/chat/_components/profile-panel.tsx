"use client"

import { User, Users, X, Search, ImageIcon, FileText, Video } from "lucide-react"
import { useState } from "react"
import type { Chat } from "@/types/chat"
import Image from "next/image"

interface ProfilePanelProps {
  selectedChatData: Chat
  setShowProfile: (show: boolean) => void
}

export default function ProfilePanel({ selectedChatData, setShowProfile }: ProfilePanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="w-full md:w-80 bg-white border-l">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{selectedChatData.isGroup ? "Groupe" : "Profil"}</h2>
          <button onClick={() => setShowProfile(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mb-4">
            {selectedChatData.avatar ? (
              <Image
                width={96}
                height={96}
                src={selectedChatData.avatar || "/placeholder.svg"}
                alt={selectedChatData.name}
                className="w-full h-full object-cover"
              />
            ) : selectedChatData.isGroup ? (
              <Users size={40} className="text-gray-600" />
            ) : (
              <User size={40} className="text-gray-600" />
            )}
          </div>
          <h3 className="text-xl font-medium">{selectedChatData.name}</h3>
          <p className="text-gray-500">
            {selectedChatData.isGroup ? `${selectedChatData.members?.length} membres` : "En ligne"}
          </p>
        </div>
      </div>

      {selectedChatData.isGroup && selectedChatData.members && (
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Membres du groupe</h3>
          <div className="space-y-3">
            {selectedChatData.members.map((member, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <span className="ml-3 text-sm">{member}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">Rechercher dans la discussion</h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher des messages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium mb-4">Fichiers partagés</h3>
        <div className="space-y-4">
          {selectedChatData.media.map((item) => (
            <div key={item.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              {item.type === "image" && <ImageIcon size={20} className="text-blue-500" />}
              {item.type === "file" && <FileText size={20} className="text-green-500" />}
              {item.type === "video" && <Video size={20} className="text-red-500" />}
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
