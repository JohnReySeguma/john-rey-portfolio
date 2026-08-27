// The three major projects, in display order. `id` is the React key and the
// stable slug. Iteration 03: the compact tier-2 grid was removed from the page,
// so the `tier` flag and the unused `preview` field went with it — this file is
// now exactly what the Work section renders.
const projects = [
  {
    id: "resilientlink",
    name: "ResilientLink: PDRRMO Disaster Management Platform",
    description:
      "A multi-platform system with a web app for disaster coordination, a citizen app for receiving advisories and finding drop-off points, and a staff app for managing and distributing relief goods.",
    stack: ["Flutter", "Firebase", "Paymongo", "Google Maps API", "OpenWeather API"],
    sourceCode: "https://github.com/JohnReySeguma/ResilientlinkWeb.git",
    img: "projects/ResilientLink.png",
    imgWidth: 1600,
    imgHeight: 774,
  },
  {
    id: "smart-online-parking-system",
    name: "Smart Online Parking System",
    description:
      "A web-based platform allowing users to find, reserve, and manage parking slots in real-time, reducing traffic congestion, saving time, and improving parking space utilization with an efficient, user-friendly system.",
    stack: ["React.js", "Django", "Tailwind CSS", "Paymongo"],
    sourceCode: "https://github.com/JohnReySeguma/Smart-Parking-App.git",
    img: "projects/parking-system.png",
    imgWidth: 1919,
    imgHeight: 967,
  },
  {
    id: "hotel-management-system",
    name: "Hotel Management System",
    description:
      "A web-based application designed to streamline and automate hotel operations, including room bookings, customer management, payment tracking, and other front desk and administrative tasks, enhancing efficiency, guest experience, and daily management.",
    stack: ["React.js", "Node.js", "Paymongo"],
    sourceCode: "https://github.com/JohnReySeguma/Hotel-Reservation-System.git",
    img: "projects/hotel-system.jpg",
    imgWidth: 1600,
    imgHeight: 900,
  },
];

export default projects;
