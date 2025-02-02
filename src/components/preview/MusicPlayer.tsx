"use client";

import React, { useState, useRef, useEffect } from "react";
import { FormData } from "@/types/form";

interface MusicPlayerProps {
  music: FormData["music"];
}

export default function MusicPlayer({ music }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = () => {
    if (music.type === "file" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (music.type === "youtube" && iframeRef.current) {
      const message = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: message }), '*'
      );
      setIsPlaying(!isPlaying);
    } else if (music.type === "spotify" && iframeRef.current) {
      // O Spotify tem seu próprio controle de reprodução
      setIsPlaying(!isPlaying);
    }
  };

  const renderPlayer = () => {
    switch (music.type) {
      case "youtube":
        return (
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${music.url}?enablejsapi=1&version=3&playerapiid=ytplayer`}
            title="YouTube music player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="hidden"
          />
        );
      case "spotify":
        return (
          <iframe
            ref={iframeRef}
            src={`https://open.spotify.com/embed/track/${music.url}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="encrypted-media"
            className="hidden"
          />
        );
      case "file":
        return (
          <audio
            ref={audioRef}
            src={music.url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm">
      <div className="bg-[#1A1A1A] rounded-lg shadow-lg border border-[#333333] p-3 mx-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors flex-shrink-0"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {music.title}
            </div>
            <div className="text-xs text-gray-500">
              via {music.type === "file" ? "Upload" : music.type}
            </div>
          </div>
        </div>

        {renderPlayer()}
      </div>
    </div>
  );
}
