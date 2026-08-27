// Tech events, competitions and research recognitions in final display order
// (major -> minor). Array index IS the display order. `category` is null when
// the record has none. `images` are filenames in `public/awards/` (PRD §I2.4)
// and are resolved against BASE_URL by the component, never here.
// `video` is null on every record except kabataan-inyovator-2019 (ADR-0011).
// `embed` is false from observation (task 22): the FB plugin iframe renders
// "Video Unavailable" for this share short-link, so the poster + link stand alone.
const achievements = [
  {
    id: "best-student-research",
    award: "Best Student Research",
    category: null,
    event: "18th Araw ng Parangal",
    images: [
      "araw_ng_parangal.jpg",
      "araw_ng_parangal_2.jpg",
      "araw_ng_parangal_3.jpg",
    ],
    video: null,
  },
  {
    id: "psits-capstone-champion",
    award: "Champion",
    category: "Research Capstone Presentation",
    event: "18th PSITS Regional Convention 2025",
    images: ["psits_research.jpg"],
    video: null,
  },
  {
    id: "kabataan-inyovator-2019",
    award: "Champion",
    category: "Mission Harvest Robotics Competition",
    event: "Kabataan Inyovator 2019",
    images: ["kabataan_inyovator.jpg"],
    video: {
      url: "https://www.facebook.com/share/v/19N5bPPYJk/",
      poster: "kabataan_inyovator.jpg",
      label: "Watch on Facebook",
      embed: false,
    },
  },
  {
    id: "ceac-best-paper",
    award: "Best Paper",
    category: "Information and Computer Technologies Category",
    event: "CEAC Research Forum 2025",
    images: ["ceac_research.jpg"],
    video: null,
  },
  {
    id: "ndmu-hackathon-2nd",
    award: "2nd Place",
    category: "Demo Pitching",
    event: "NDMU Startup Hackathon 2024",
    images: ["demo_pitching.jpg"],
    video: null,
  },
  {
    id: "hackforgov-6th",
    award: "6th Place",
    category: "HACKFORGOV",
    event: "Capture-the-flag Competition 2023",
    images: ["hackforgov.jpg"],
    video: null,
  },
  {
    id: "national-robotics-2020",
    award: "Champion",
    category: "Mission Harvest Robotics Competition",
    event: "National Robotics Competition 2020",
    images: [
      "national_robotics_competition.jpg",
      "national_robotics_competition_2.jpg",
    ],
    video: null,
  },
  {
    id: "psits-programming-3rd",
    award: "3rd Place",
    category: "Programming Competition",
    event: "15th PSITS Regional Competition",
    images: ["programming_contest.jpg"],
    video: null,
  },
  {
    id: "robo-fest-2019",
    award: "Champion",
    category: "Line Tracing Competition",
    event: "Robo Fest 2019",
    images: ["robo_fest.jpg", "robo_fest_2.jpg"],
    video: null,
  },
];

export default achievements;
