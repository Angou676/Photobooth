import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [hasPhoto, setHasPhoto] = useState(false);
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const streamRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then(stream => {
        streamRef.current = stream;
        let video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch(err => console.error("Error playing video", err));
        };
      })
      .catch(err => {
        console.error("Error accessing the camera", err);
      });
  };

  const takePhoto = () => {
    const width = 1280;
    const height = 720;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const retakePhoto = () => {
    setHasPhoto(false);
  };

  const savePhoto = () => {
    const photo = photoRef.current;
    const dataURL = photo.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'photo.png';
    link.click();
  };

  useEffect(() => {
    getVideo();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="app">
      <div className="camera">
        <video ref={videoRef} className={`video ${hasPhoto ? 'hidden' : ''}`}></video>
        <canvas ref={photoRef} className={`photo ${hasPhoto ? '' : 'hidden'}`}></canvas>
        <img src="/images/frame.png" className="frame" alt="frame" />
      </div>
      <div className="controls">
        {!hasPhoto ? (
          <button onClick={takePhoto}>Capture</button>
        ) : (
          <>
            <button onClick={retakePhoto}>Retake</button>
            <button onClick={savePhoto}>Save</button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
