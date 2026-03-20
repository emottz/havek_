import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import './VideoSection.css';

const VideoSection = ({ url, title, description, reverse = false }) => {
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPlaying(entry.isIntersecting);
      },
      { threshold: 0.3 } // Start playing when 30% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getYoutubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeID(url);
  // Only add autoplay=1 if in view, and MUST be muted for autoplay to work in most browsers
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&mute=1&modestbranding=1&rel=0&controls=1`
    : url;

  return (
    <div className={`video-section-container ${reverse ? 'reverse' : ''}`} ref={sectionRef}>
      <div className="video-content-text">
        <h2 className="video-title">{title}</h2>
        <div className="title-underline left"></div>
        <p className="video-description">{description}</p>
      </div>
      <div className="video-player-wrapper">
        <div className="video-player-aspect">
          {videoId ? (
            <iframe
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            ></iframe>
          ) : (
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              className="video-player-inner"
              playing={playing}
              muted={true}
              controls={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default VideoSection;
