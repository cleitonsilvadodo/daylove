"use client";

import React, { useState, useRef, useEffect } from "react";
import { FormData } from "@/types/form";

interface MusicPlayerProps {
  music: FormData["music"];
  autoPlay?: boolean;
}

// Função para extrair ID do YouTube
const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^"&?\/\s]{11})/);
  return match ? match[1] : url;
};

// Função para extrair ID do Spotify
const getSpotifyId = (url: string) => {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : url;
};

export default function MusicPlayer({ music, autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Inicializar API do YouTube
  useEffect(() => {
    if (music.type === "youtube") {
      // Carregar API do YouTube
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Configurar player quando API estiver pronta
      (window as any).onYouTubeIframeAPIReady = () => {
        const player = new (window as any).YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              setYoutubePlayer(event.target);
              if (autoPlay && isFirstLoad) {
                event.target.playVideo();
                setIsFirstLoad(false);
              }
            },
            onStateChange: (event: any) => {
              setIsPlaying(event.data === (window as any).YT.PlayerState.PLAYING);
            },
          },
        });
      };
    }
  }, [music.type, autoPlay, isFirstLoad]);

  // Autoplay para áudio
  useEffect(() => {
    if (autoPlay && isFirstLoad && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsFirstLoad(false);
          })
          .catch(error => {
            console.log("Autoplay prevented:", error);
          });
      }
    }
  }, [autoPlay, isFirstLoad]);

  // Controle de volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (youtubePlayer?.setVolume) {
      youtubePlayer.setVolume(volume);
    }
  }, [volume, youtubePlayer]);

  const togglePlay = () => {
    if (music.type === "file" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (music.type === "youtube" && youtubePlayer) {
      if (isPlaying) {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    } else if (music.type === "spotify" && iframeRef.current) {
      // O Spotify tem seu próprio controle de reprodução
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  const renderPlayer = () => {
    switch (music.type) {
      case "youtube":
        const youtubeId = getYouTubeId(music.url);
        return (
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&version=3&playerapiid=ytplayer&origin=${window.location.origin}&autoplay=${autoPlay ? '1' : '0'}`}
            title="YouTube music player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
        );
      case "spotify":
        const spotifyId = getSpotifyId(music.url);
        return (
          <iframe
            ref={iframeRef}
            src={`https://open.spotify.com/embed/track/${spotifyId}?autoplay=${autoPlay ? '1' : '0'}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
        );
      case "file":
        return (
          <audio
            ref={audioRef}
            src={music.url}
            autoPlay={autoPlay}
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
    <div className="bg-[#1A1A1A] rounded-lg shadow-lg border border-[#333333] p-3">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pausar música" : "Tocar música"}
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
            {music.title || "Música"}
          </div>
          <div className="text-xs text-gray-500">
            via {music.type === "file" ? "Upload" : music.type}
          </div>
          {/* Controle de Volume */}
          <div className="mt-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Controle de volume"
            />
          </div>
        </div>
      </div>

      {renderPlayer()}
    </div>
  );
}
