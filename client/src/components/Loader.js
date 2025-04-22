import React, { useEffect, useState } from 'react';
import '../Styles/Loader.css'; 

const SplashScreen = ({ setShowNavBar }) => { 
    const [showSplash, setShowSplash] = useState(true);
  
    useEffect(() => {
        document.body.style.overflow = 'hidden';
      
        const timer = setTimeout(() => {
            setShowSplash(false);
            setShowNavBar(true);
            document.body.style.overflow = 'auto';
        }, 2500); 
        
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'auto';
        };
    }, [setShowNavBar]);
  
    if (!showSplash) {
        return null;
    }

    return (
        <div className="splash-screen d-flex align-items-center">
            <svg className="truck" viewBox="0 0 48 20" width="48px" height="30px">
                <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" transform="scale(-1, 1) translate(-48, 0)">
                    <g className="truck__body">
                        <g strokeDasharray="105 105">
                            <polyline className="truck__outside1" points="2 17,1 17,1 11,5 9,7 1,39 1,39 6" />
                            <polyline className="truck__outside2" points="39 12,39 17,31.5 17" />
                            <polyline className="truck__outside3" points="22.5 17,11 17" />
                            <polyline className="truck__window1" points="6.5 4,8 4,8 9,5 9" />
                            <polygon className="truck__window2" points="10 4,10 9,14 9,14 4" />
                        </g>
                        <polyline className="truck__line" points="43 8,31 8" strokeDasharray="10 2 10 2 10 2 10 2 10 2 10 26" />
                        <polyline className="truck__line" points="47 10,31 10" strokeDasharray="14 2 14 2 14 2 14 2 14 18" />
                    </g>
                    <g strokeDasharray="15.71 15.71">
                        <g className="truck__wheel">
                            <circle className="truck__wheel-spin" r="2.5" cx="6.5" cy="17" />
                        </g>
                        <g className="truck__wheel">
                            <circle className="truck__wheel-spin" r="2.5" cx="27" cy="17" />
                        </g>
                    </g>
                </g>
            </svg>
            <div className="text-container">
                <div className="splash-text">
                    {Array.from("ТД СПАРКИ").map((letter, index) => (
                        <span key={index} className={`letter letter-${index}`}>
                            {letter === " " ? "\u00A0" : letter}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
