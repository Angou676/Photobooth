import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import frameImage from './assets/frame.png';
import rightImg from './assets/right-img.png';
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
    let video = videoRef.current;
    let photo = photoRef.current;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const width = 940;
    const height = (videoHeight / videoWidth) * width;

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
    html2canvas(photoRef.current).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'photo.png';
      link.click();
    });
  };

  useEffect(() => {
    getVideo();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  const photoHandler = (getType) => {
    switch (getType) {
      case "CAPTURE": {
        takePhoto()
        break
      }
      case "RETAKE": {
        retakePhoto()
        break
      }
      case "SAVE": {
        savePhoto()
        break
      }
      default: {
        return
      }
    }
  }
  const screenHeight = window.innerHeight

  return (
    <div className={`app xxs:block xmd:flex justify-between h-screen `} >
      <div className="xxs:w-full mdm:w-3/4 flex justify-end">

        <section className='xxs:my-16 xmd:my-20  md:my-32  h-[60vh] xxs:w-full xmd:w-11/12 xl:w-5/6  xxs:-mr-0 mdm:-mr-20 relative' >

          <div className={`xmd:absolute top-0 xmd:left-52  md:left-64 mdm:left-60 lg:left-72 xl:left-80 xxs:w-[360px] xxs:h-[480px] xmd:w-[140px] xmd:h-[180px]  md:w-[200px] md:h-[300px]  mdm:w-[280px] mdm:h-[380px] lg:w-[300px] lg:h-[400px] xxs:m-auto  `}>
            <h3 className='text-end  mb-2 text-white text-sm'>Home</h3>
            <div className='relative h-full w-full'>
              <video ref={videoRef} className={` w-full h-full object-cover ${hasPhoto ? 'hidden' : ''}`}></video>
              <canvas ref={photoRef} className={` w-full h-full object-cover  ${hasPhoto ? '' : 'hidden'}`}></canvas>
              <img src={frameImage} className=" absolute top-0 left-0 w-full h-full pointer-events-none" alt="frame" />
            </div>
          </div>

          <div className='grid xxs:grid-cols-4 xxs:mt-10 xmd:mt-1 md:mt-16 mdm:mt-24 gap -2 xxs:p-5 mdm:p-0 '>
            {
              ["CAPTURE", "RETAKE", "POST", "SAVE"].map((val, i) => {
                return <div key={i} className="border-b-2 border-white   xmd:mb-4 text-start xxs:col-span-2 xmd:col-span-4 xxs:text-center xmd:text-start">
                  <button className='bg-white py-1 xmd:px-3 mdm:px-7 xxs:w-auto xmd:w-1/4 mdm:w-48 xmd:rounded-tl-xl xmd:rounded-br-xl  mdm:rounded-tl-3xl mdm:rounded-br-3xl text-primary xmd:text-xs mdm:text-3xl font-black border-none'
                    onClick={() => photoHandler(val)}
                    disabled={val === "SAVE" && !hasPhoto}
                  >{val}</button>
                </div>
              })
            }
          </div>

        </section>
      </div>
      <div className="xxs:w-full xmd:w-1/4  text-right z-10">
        <img src={rightImg} alt="rightImg" className=" w-full h-full" />
      </div>
    </div>
  );
};

export default App;
