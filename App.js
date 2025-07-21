// Aris V Music Player – Final Enhanced Version with AI, Monetization, Admin, and Overlay

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Music,
  Heart,
  HeartOff,
  Shuffle,
  Repeat,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Share2,
  ListMusic
} from 'lucide-react';

const sampleSongs = [
  {
    title: "Ocean Drive",
    album: "Summer Vibes",
    artist: "Duke Dumont",
    url: "/music/ocean-drive.mp3",
    image: "/images/duke.jpg",
    lyrics: "We're riding on the ocean drive..."
  },
  {
    title: "Levitating",
    album: "Future Nostalgia",
    artist: "Dua Lipa",
    url: "/music/levitating.mp3",
    image: "/images/dua.jpg",
    lyrics: "If you wanna run away with me..."
  }
];

export default function ArisVPlayer() {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [repeatMode, setRepeatMode] = useState("order");
  const [shuffle, setShuffle] = useState(false);
  const [coinBalance, setCoinBalance] = useState(100);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [tips, setTips] = useState(0);
  const [adminAccess, setAdminAccess] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const ADMIN_SECRET_CODE = "ARISV-ACCESS-2025";

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  const playNext = () => {
    setCurrentTrack(prev => (prev + 1) % sampleSongs.length);
  };

  const playPrev = () => {
    setCurrentTrack(prev => (prev - 1 + sampleSongs.length) % sampleSongs.length);
  };

  const handleEnded = () => {
    if (repeatMode === "repeat-one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  const toggleFavorite = () => {
    const current = sampleSongs[currentTrack];
    setFavorites(prev =>
      prev.find(f => f.title === current.title)
        ? prev.filter(f => f.title !== current.title)
        : [...prev, current]
    );
  };

  const handleSendChat = () => {
    if (chatMessage.trim() === "") return;
    setChatLog([...chatLog, { text: chatMessage, time: new Date().toLocaleTimeString() }]);
    setChatMessage("");
    setCoinBalance(coinBalance - 1);
  };

  const handleTip = (amount) => {
    setTips(tips + amount);
    alert(`Thanks for tipping ₦${amount}`);
  };

  const handleAdminLogin = () => {
    if (authCode === ADMIN_SECRET_CODE) {
      setAdminAccess(true);
    } else {
      alert("Invalid code. Access denied.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-white bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-xl shadow-2xl overflow-y-auto">
      <Card>
        <CardContent>
          <div className="text-center">
            <img src="/logo/arisv-avatar.png" alt="Aris V Logo" className="w-16 h-16 rounded-full mx-auto mb-2" />
            <h1 className="text-xl font-semibold mb-4">🎧 Aris V Player</h1>
            <img src={sampleSongs[currentTrack].image} alt="cover" className="rounded-full w-40 h-40 mx-auto shadow-lg" />
            <h2 className="text-2xl font-bold mt-4">{sampleSongs[currentTrack].title}</h2>
            <p className="text-sm text-gray-300">{sampleSongs[currentTrack].artist} - {sampleSongs[currentTrack].album}</p>

            <audio
              ref={audioRef}
              src={sampleSongs[currentTrack].url}
              onEnded={handleEnded}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              controls
              className="w-full mt-4"
            />

            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={playPrev}><ChevronLeft /></Button>
              <Button onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</Button>
              <Button onClick={playNext}><ChevronRight /></Button>
            </div>

            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              <Button onClick={() => setRepeatMode("order")}>Order</Button>
              <Button onClick={() => setRepeatMode("repeat-list")}>Repeat List</Button>
              <Button onClick={() => setRepeatMode("repeat-one")}>Repeat One</Button>
              <Button onClick={() => setShuffle(!shuffle)}>Shuffle</Button>
              <Button onClick={toggleFavorite}>{favorites.find(f => f.title === sampleSongs[currentTrack].title) ? <Heart className="text-red-500" /> : <HeartOff />}</Button>
              <Button onClick={() => setShowLyrics(!showLyrics)}>Lyrics</Button>
            </div>

            {showLyrics && (
              <div className="mt-4 p-2 bg-gray-900 text-sm rounded">
                <p>{sampleSongs[currentTrack].lyrics}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Chat & Gift</h3>
              <div className="flex items-center gap-2">
                <Input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Say something..." className="flex-grow" />
                <Button onClick={handleSendChat}>Send</Button>
              </div>
              <ul className="text-sm mt-2 max-h-32 overflow-y-auto text-left">
                {chatLog.map((msg, i) => <li key={i}>🗨 {msg.text} <span className="text-xs text-gray-400">({msg.time})</span></li>)}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Support Aris V</h3>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => handleTip(200)}>₦200</Button>
                <Button onClick={() => handleTip(500)}>₦500</Button>
                <Button onClick={() => handleTip(1000)}>₦1000</Button>
              </div>
              <div className="mt-2 text-sm text-gray-400">Coins: {coinBalance} | Tips: ₦{tips}</div>
            </div>

            {/* Hidden Admin Login */}
            {!adminAccess && (
              <div className="mt-6">
                <Input type="password" value={authCode} onChange={(e) => setAuthCode(e.target.value)} placeholder="Enter Admin Access Code" />
                <Button onClick={handleAdminLogin} className="mt-2">Access Admin</Button>
              </div>
            )}

            {/* Admin Dashboard */}
            {adminAccess && (
              <div className="mt-8 bg-black bg-opacity-60 p-4 rounded shadow">
                <h3 className="text-lg font-semibold">🔒 Aris V Admin Dashboard</h3>
                <p>📈 Tips Collected: ₦{tips}</p>
                <p>🪙 Current Coins: {coinBalance}</p>
                <p>🎧 Favorites: {favorites.length} songs</p>
                <p>💬 Total Chats: {chatLog.length}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
