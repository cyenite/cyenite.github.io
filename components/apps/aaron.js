import React, { Component } from 'react';
import ReactGA from 'react-ga4';
import Script from 'next/script';

export class AboutCyenite extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: () => { },
            active_screen: "about", // by default 'about' screen is active
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <>
                <About />
                <br />
                <div
                    onClick={this.showNavBar}
                    className={
                        (!this.state.navbar ? " visible " : " invisible ") +
                        "w-max py-0.5 px-1.5 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md"
                    }
                >
                    Show More
                </div>
                <br />
            </>,
            "skills": <Skills />,
            "education": <Education />,
            "projects": <Projects />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (lastVisitedScreen === null || lastVisitedScreen === undefined) {
            lastVisitedScreen = "about";
        }

        // focus last visited screen
        this.changeScreen(document.getElementById(lastVisitedScreen));
    }

    changeScreen = (e) => {
        const screen = e.id || e.target.id;

        // store this state
        localStorage.setItem("about-section", screen);

        // google analytics
        //ReactGA.pageview(`/${screen}`);
        ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: screen + " Page" });

        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = () => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = () => {
        return (
            <>
                <div id="about" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="about cyenite" src="./themes/Yaru/status/about.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">About Me</span>
                </div>

                <div id="skills" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "skills" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="cyenite' skills" src="./themes/Yaru/status/skills.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Skills</span>
                </div>
                <div id="education" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "education" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="cyenite' education" src="./themes/Yaru/status/education.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Education</span>
                </div>
                <div id="projects" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "projects" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="cyenite' projects" src="./themes/Yaru/status/projects.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Projects</span>
                </div>
                <div id="resume" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "resume" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="cyenite's resume" src="./themes/Yaru/status/download.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
                </div>
                {/* <div className='my-0.5 w-28 md:w-full h-8 px-2 md:px-2.5 flex' >
                    <iframe src="https://github.com/sponsors/cyenite/button" title="Sponsor cyenite" width={"100%"} height={"100%"} ></iframe>
                </div> */}
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutCyenite;

export const displayAboutCyenite = () => {
    return <AboutCyenite />;
}


function About() {
    return (
        <>
            <div className="w-20 md:w-28 my-4 bg-white rounded-full">
                <img className="w-full" src="./images/logos/bitmoji.png" alt="Aaron's Profile" />
            </div>
            <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
                <div>Howdy! My name is <span className="font-bold">Aaron Kipkoech</span> ,</div>
                <div className="font-normal ml-1">I'm a <span className="text-pink-600 font-bold">Software Engineer!</span></div>
            </div>
            <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
            </div>
            <ul className=" mt-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
                <li className=" list-pc">Currently working at <u className=' cursor-pointer '><a href="https:/fleetsimplify.com" target={"_blank"}>Fleetsimplify</a></u> as a <span className=" font-medium">Mobile Engineer</span>.</li>
                <li className=" mt-3 list-building"> I enjoy building awesome software that solve practical problems.</li>
                <li className=" mt-3 list-time"> When I am not coding my next project, I like to spend my time listening to audiobooks, playing guitar or gaming.</li>
                <li className=" mt-3 list-star"> And I also have interest in Stock Markets, Automotive Technology, IOT and Computer Vision!</li>
            </ul>
        </>
    )
}
function Education() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Education & Certifications
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Dedan Kimathi University of Technology
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2018 - 2022</div>
                    <div className=" text-sm md:text-base">Bsc. Geomatics and Geospatial Information Systems</div>
                </li>

                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Microsoft Learn
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2018 - 2019</div>
                    <div className=" text-sm md:text-base">Stack: Mobile & Web Development</div>
                    <div className=" text-sm md:text-base">Languages: C#, C++</div>
                </li>

                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Andela Learning Community
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2018</div>
                    <div className=" text-sm md:text-base">Stack: Android Development</div>
                    <div className=" text-sm md:text-base">Languages: Java, Kotlin</div>
                </li>

                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Kabianga High School
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2014 - 2017</div>
                    <div className=" text-sm md:text-base">Majors: Mathematics, Sciences & Geography</div>
                    <div className=" text-sm md:text-base">Technicals: Drawing and Design</div>
                </li>

                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Canaan School
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">2005 - 2013</div>
                    <div className=" text-sm md:text-base">8-4-4 Primary basics</div>
                </li>
            </ul>
        </>
    )
}
function Skills() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Technical Skills
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    I've worked with a wide variety of programming languages & frameworks.
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div> My areas of expertise are <strong className="text-ubt-gedit-orange"> front-end development with Dart, HTML, Javascript and backend development with C#, Python & PHP laravel</strong></div>
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div>Here are my most frequently used</div>
                </li>
            </ul>
            <div className="w-full md:w-10/12 flex mt-4">
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Languages & Tools</div>
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Frameworks & Libraries</div>
            </div>
            <div className="w-full md:w-10/12 flex justify-center items-start font-bold text-center">
                <div className="px-2 w-1/2">
                    <div className="flex flex-wrap justify-center items-start w-full mt-2">
                        <img className="m-1" src="https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=c-sharp&logoColor=white" alt="cyenite c#" />
                        <img className="m-1" src="https://img.shields.io/badge/C%2B%2B-00599C?style=flat&logo=c%2B%2B&logoColor=white" alt="cyenite c++" />
                        <img className="m-1" src="http://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=ffffff" alt="cyenite python" />
                        <img className="m-1" src="https://img.shields.io/badge/Dart-0175C2?style=flat&logo=dart&logoColor=white" alt="cyenite dart" />
                        <img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white" alt="cyenite PHP" className="m-1" />
                        <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="cyenite javascript" className="m-1" />
                        <img src="https://img.shields.io/badge/-Git-%23F05032?style=flat&logo=git&logoColor=%23ffffff" alt="cyenite git" className="m-1" />
                        <img src="https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=ffffff" alt="cyenite firebase" className="m-1" />
                        <img src="https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white" alt="cyenite openAI" className="m-1" />
                        <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="cyenite mongo" className="m-1" />
                        <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="cyenite postgress" className="m-1" />
                        <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="cyenite mysql" className="m-1" />
                    </div>
                </div>
                <div className="px-2 flex flex-wrap items-start w-1/2">
                    <div className="flex flex-wrap justify-center items-start w-full mt-2">
                        <img className="m-1" src="https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white" alt="cyenite flutter" />
                        <img src="https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white" alt="cyenite laravel" className="m-1" />
                        <img src="https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white" alt="cyenite .net" className="m-1" />
                        <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="cyenite fastAPI" className="m-1" />
                        <img src="https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white" alt="cyenite arduino" className="m-1" />
                        <img src="https://img.shields.io/badge/Xamarin-3199DC?style=for-the-badge&logo=xamarin&logoColor=white" alt="cyenite xamarin" className="m-1" />
                        <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="cyenite nodejs" className="m-1" />
                    </div>
                </div>
            </div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list mt-4">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <span> And of course,</span> <img className=" inline ml-1" src="http://img.shields.io/badge/-Linux-0078D6?style=plastic&logo=linux&logoColor=ffffff" alt="cyenite linux" /> <span>!</span>
                </li>
            </ul>
        </>
    )
}

function Projects() {
    const project_list = [
        {
            name: "DeChat",
            date: "Sep 2018",
            link: "https://github.com/cyenite/Dekut-Chat",
            description: [
                "A social media application for Dedan Kimathi University of Technology students to connect and share ideas.",
            ],
            domains: ["java", "kotlin", "laravel", "php", "android", "firebase"]
        },
        {
            name: "KVA Player",
            date: "Jan 2019",
            link: "",
            description: [
                "A music player application for android devices, with custom equalizer and bass booster.",
            ],
            domains: ["java", "android", "kotlin"]
        },
        {
            name: "TELSMS",
            date: "Jun 2019",
            link: "https://github.com/cyenite/TELSMS",
            description: [
                "An SMS app replacement for android devices, with custom themes and features.",
            ],
            domains: ["java", "android", "kotlin"]
        },
        {
            name: "Plant Signal",
            date: "Jul 2019",
            link: "https://github.com/cyenite/Plant-Signal-Flutter",
            description: [
                "A plant disease detection application for android and ios devices, using machine learning.",
            ],
            domains: ["python", "tensorflow", "keras", "android", "ios", "flutter"]
        },
        {
            name: "DVORAK Keyboard",
            date: "Aug 2019",
            link: "https://github.com/cyenite/Dvorak-keyboard",
            description: [
                "A custom keyboard for android devices, with DVORAK layout.",
            ],
            domains: ["java", "android", "kotlin"]
        },
        {
            name: "Kazilink App",
            date: "Feb 2020",
            link: "https://github.com/cyenite/Kazilink-Server",
            description: [
                "A platform that connects casual job seekers to employers.",
            ],
            domains: ["java", "android", "kotlin", "laravel", "php", "firebase"]
        },
        {
            name: "Bookify App",
            date: "May 2020",
            link: "https://github.com/cyenite/Bookify",
            description: [
                "An android platform for buying and renting e-books.",
            ],
            domains: ["java", "android", "kotlin", "laravel", "php", "firebase"]
        },
        {
            name: "Clipboard Manager",
            date: "May 2020",
            link: "https://github.com/cyenite/Clipboard-Manager",
            description: [
                "An android application to manage clipboard history.",
            ],
            domains: ["kotlin", "android"]
        },
        {
            name: "Whatsapp DM",
            date: "Jul 2020",
            link: "https://github.com/cyenite/Whatsapp-DM",
            description: [
                "An android application to send whatsapp messages to unsaved contacts.",
            ],
            domains: ["kotlin", "android"]
        },
        {
            name: "E-Waste Manager",
            date: "Sep 2020",
            link: "https://github.com/cyenite/Ewaste-Mobile",
            description: [
                "An android application for e-waste collection and management.",
            ],
            domains: ["java", "android", "kotlin", "laravel", "php", "firebase"]
        },
        {
            name: "Piano",
            date: "Sep 2020",
            link: "https://github.com/cyenite/Piano",
            description: [
                "A minimalistic piano application for android and IOS devices.",
            ],
            domains: ["dart", "flutter", "android", "ios", "midi"]
        },
        {
            name: "Ficar Delivery App",
            date: "Dec 2020",
            link: "https://github.com/cyenite/Ficar-final-Mobile-app",
            description: [
                "A delivery application for Ficar Kenya.",
            ],
            domains: ["dart", "flutter", "android", "ios", "laravel", "php", "firebase"]
        },
        {
            name: "EV Station Finder",
            date: "May 2021",
            link: "https://github.com/cyenite/EV-Stations",
            description: [
                "UI for a proposed mobile application to find electric vehicle charging stations.",
            ],
            domains: ["dart", "flutter", "android", "ios"]
        },
        {
            name: "Tea Collection and Logistics Portal",
            date: "Jun 2021",
            link: "https://github.com/cyenite/Tea-Collection-Management",
            description: [
                "A web application leveraging GIS for tea collection and logistics management.",
            ],
            domains: ["flutter", "dart", "laravel", "php", "gis", "leaflet"]
        },
        {
            name: "Gas Monitor App",
            date: "Aug 2021",
            link: "https://github.com/cyenite/Gas-Monitoring",
            description: [
                "A mobile application to monitor gas levels in a gas cylinder.",
            ],
            domains: ["stm32", "c++", "flutter", "dart", "android", "ios", "firebase"]
        },
        {
            name: "Forest Inventory Management",
            date: "Jul 2022",
            link: "https://github.com/cyenite/Forest-Inventory-Desktop",
            description: [
                "A desktop application for forest inventory management, using GIS and remote sensing techniques.",
            ],
            domains: ["flutter", "dart", "firebase", "gis", "leaflet", "python", "tensorflow", "keras", "opencv", "c++", "qt"]
        },
        {
            name: "Dekut CU App",
            date: "Feb 2022",
            link: "https://github.com/cyenite/dekut_cu",
            description: [
                "A mobile application for Dedan Kimathi University Christian Union for managing fellowships, bible studies, events, announcements and offering.",
            ],
            domains: ["flutter", "dart", "firebase", "javascript"]
        },
        {
            name: "Bid Parlour",
            date: "Jun 2022",
            link: "https://github.com/cyenite/Bid-Parlour",
            description: [
                "A mobile application for online bidding and auctioning of monetary investments.",
            ],
            domains: ["flutter", "dart", "firebase", "javascript", "c++"]
        },
        {
            name: "Royale Gaming App",
            date: "Aug 2022",
            link: "https://github.com/cyenite/Royale-Gaming-User",
            description: [
                "A mobile application for battle royale gaming tournaments.",
            ],
            domains: ["flutter", "dart", "firebase"]
        },
        {
            name: "Flutter Test Utils",
            date: "Mar 2023",
            link: "https://github.com/cyenite/flutter_test_utils",
            description: [
                "A flutter library for testing widgets and blocs.",
            ],
            domains: ["flutter", "dart"]
        },
        {
            name: "GetX Test",
            date: "Apr 2023",
            link: "https://github.com/cyenite/getx_test",
            description: [
                "A flutter library that provides testing utilities for GetX, a powerful state management library for Flutter.",
            ],
            domains: ["flutter", "dart"]
        },
        {
            name: "Codescribe",
            date: "Jul 2023",
            link: "https://github.com/cyenite/codescribe",
            description: [
                "An Intellij documentation plugin that uses AI to make coding swifter and save on technical documentation time.",
            ],
            domains: ["kotlin", "OpenAI", "Intellij", "python"]
        },
    ];

    const tag_colors = {
        "java": "yellow-300",
        "kotlin": "red-600",
        "laravel": "red-500",
        "php": "red-400",
        "android": "green-500",
        "ios": "pink-400",
        "python": "pink-400",
        "tensorflow": "yellow-400",
        "keras": "yellow-500",
        "flutter": "blue-400",
        "dart": "yellow-300",
        "midi": "gray-400",
        "gis": "pink-500",
        "leaflet": "green-600",
        "stm32": "gray-300",
        "c++": "purple-600",
        "qt": "yellow-400",
        "opencv": "orange-500",
        "javascript": "yellow-300",
        "OpenAI": "red-500",
        "Intellij": "gray-500"
    }

    project_list.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
            {/* <div className="container">
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-MD8QD02FWZ" />
                <Script id="google-analytics">
                    {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-MD8QD02FWZ');
        `}
                </Script>
            </div> */}
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            {/* <iframe src="https://github.com/sponsors/cyenite/card" title="Sponsor cyenite" className='my-4 w-5/6 md:w-3/4' ></iframe> */}

            {
                project_list.map((project, index) => {
                    const projectNameFromLink = project.link.split('/')
                    const projectName = projectNameFromLink[projectNameFromLink.length - 1]
                    return (
                        <a key={index} href={project.link} target="_blank" rel="noreferrer" className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2">{project.name.toLowerCase()}</div>
                                        {/* <iframe src={`https://ghbtns.com/github-btn.html?user=cyenite&repo=${projectName}&type=star&count=true`} frameBorder="0" scrolling="0" width="150" height="20" title={project.name.toLowerCase() + "-star"}></iframe> */}
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.date}</div>
                                </div>
                                <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                                    {
                                        project.description.map((desc, index) => {
                                            return <li key={index} className="list-disc mt-1 text-gray-100">{desc}</li>;
                                        })
                                    }
                                </ul>
                                <div className="flex flex-wrap items-start justify-start text-xs py-2">
                                    {
                                        (project.domains ?
                                            project.domains.map((domain, index) => {
                                                const borderColorClass = `border-${tag_colors[domain]}`
                                                const textColorClass = `text-${tag_colors[domain]}`

                                                return <span key={index} className={`px-1.5 py-0.5 w-max border ${borderColorClass} ${textColorClass} m-1 rounded-full`}>{domain}</span>
                                            })

                                            : null)
                                    }
                                </div>
                            </div>
                        </a>
                    )
                })
            }
        </>
    )
}
function Resume() {
    return (
        <iframe className="h-full w-full" src="./files/cyenite-resume.pdf" title="cyenite resume" frameBorder="0"></iframe>
    )
}