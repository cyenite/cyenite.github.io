import React from 'react'
import { useEffect } from 'react';


function BootingScreen(props) {

    useEffect(() => {
        const timer = setTimeout(() => {
            props.turnOn();
        }, 500);

        return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
    }, [props.turnOn]); // Only re-run the effect if props.turnOn changes


    return (
        <div style={
            {
                ...(props.visible || props.isShutDown ? { zIndex: "100" } : { zIndex: "-20" }),
                backgroundColor: '#1e262e'
            }
        } className={(props.visible || props.isShutDown ? " visible opacity-100" : " invisible opacity-0 ") + " absolute duration-500 select-none flex flex-col justify-around items-center top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen bg-black"}>
            <div class="holder">

                <svg version="1.1" id="layer-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="300px" height="300px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xmlSpace="preserve">

                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="50%" stop-color="#198f93" />
                            <stop offset="100%" stop-color="#198f93" stop-opacity="0" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="50%" stop-color="#37c9be" />
                            <stop offset="100%" stop-color="#37c9be" stop-opacity="0" />
                        </linearGradient>
                        <linearGradient id="grad3" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset="50%" stop-color="#73f2dd" />
                            <stop offset="100%" stop-color="#73f2dd" stop-opacity="0" />
                        </linearGradient>
                    </defs>

                    <path class="shape-1" fill="url(#grad1)" d="M237.773,56.673c-98.48,0-178.314,79.834-178.314,178.315c0,98.48,79.834,178.314,178.314,178.314
	c98.481,0,178.314-79.834,178.314-178.314C416.088,136.507,336.255,56.673,237.773,56.673z M237.774,384.817
	c-82.749,0-149.829-67.079-149.829-149.829c0-82.75,67.081-149.831,149.829-149.831c82.751,0,149.828,67.082,149.828,149.831
	C387.603,317.738,320.525,384.817,237.774,384.817z"/>
                    <path class="shape-2" fill="url(#grad2)" d="M247.303,76.867c-98.481,0-178.315,79.834-178.315,178.317
	c0,98.479,79.834,178.314,178.315,178.314c98.481,0,178.314-79.836,178.314-178.314C425.617,156.701,345.784,76.867,247.303,76.867z
	 M247.304,405.013c-82.749,0-149.83-67.08-149.83-149.829c0-82.751,67.081-149.833,149.83-149.833s149.828,67.081,149.828,149.833
	C397.132,337.933,330.053,405.013,247.304,405.013z"/>
                    <path class="shape-3" fill="url(#grad3)" d="M262.227,56.672c-98.48,0-178.314,79.834-178.314,178.315
	c0,98.48,79.834,178.315,178.314,178.315c98.481,0,178.314-79.835,178.314-178.315C440.541,136.506,360.708,56.672,262.227,56.672z
	 M262.227,384.817c-82.748,0-149.829-67.079-149.829-149.83c0-82.75,67.081-149.831,149.829-149.831
	c82.752,0,149.829,67.082,149.829,149.831C412.056,317.738,344.979,384.817,262.227,384.817z"/>
                    <path class="shape-4" fill="url(#grad1)" d="M264.227,438.497c98.48,0,178.314-79.834,178.314-178.315c0-98.48-79.834-178.314-178.314-178.314
	c-98.481,0-178.314,79.834-178.314,178.314C85.912,358.663,165.745,438.497,264.227,438.497z M264.226,110.353
	c82.749,0,149.829,67.079,149.829,149.829s-67.08,149.831-149.829,149.831c-82.751,0-149.828-67.082-149.828-149.831
	C114.397,177.432,181.475,110.353,264.226,110.353z"/>
                    <path class="shape-5" fill="url(#grad2)" d="M252.697,421.303c98.48,0,178.314-79.834,178.315-178.316
	c0-98.479-79.834-178.314-178.315-178.314S74.383,144.508,74.383,242.986C74.383,341.469,154.216,421.303,252.697,421.303z
	 M252.696,93.157c82.749,0,149.83,67.08,149.83,149.829c0,82.752-67.081,149.832-149.83,149.832s-149.828-67.081-149.828-149.832
	C102.868,160.237,169.947,93.157,252.696,93.157z"/>
                    <path class="shape-6" fill="url(#grad3)" d="M232.773,438.498c98.48,0,178.314-79.834,178.314-178.315
	c0-98.48-79.834-178.315-178.314-178.315c-98.481,0-178.314,79.835-178.314,178.315C54.459,358.664,134.292,438.498,232.773,438.498
	z M232.773,110.353c82.748,0,149.829,67.079,149.829,149.83c-0.001,82.749-67.081,149.831-149.829,149.831
	c-82.752,0-149.829-67.082-149.829-149.831C82.944,177.432,150.021,110.353,232.773,110.353z"/>
                </svg>

                <h1><span>Cyen</span>OS</h1>

            </div>
            <div className="flex justify-center items-center outline-none cursor-pointer" onClick={props.turnOn} >
                {(props.isShutDown

                    ? <div class="wrapper">
                        <div class="inner">
                            <span></span>
                        </div>

                    </div>
                    : <img width="80px" height="80px" className={" w-10 " + (props.visible ? " animate-spin " : "")} src="./themes/Yaru/status/process-working-symbolic.svg" alt="Booting Process Symbol" />)}
            </div>
            <div onClick={props.turnOn} >
                {(props.isShutDown
                    ? <p class="power-text">Sleeping Mode</p>
                    : <p class="power-text">Booting...</p>)}

            </div>


            {/* <p style="font-family: 'Ubuntu', sans-serif; font-size: 48px; font-weight: bold;">CyenOs</p> */}

            <div className="text-white mb-4">
                <a className="underline" href="https://www.linkedin.com/in/aaronkip/" rel="noreferrer noopener" target="_blank">linkedin</a>
                <span className="font-bold mx-1">|</span>
                <a href="https://github.com/cyenite/" rel="noreferrer noopener" target="_blank" className="underline">github</a>
            </div>
        </div>
    )
}

export default BootingScreen
