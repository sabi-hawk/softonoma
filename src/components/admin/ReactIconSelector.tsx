"use client";

import { useState, createElement } from "react";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

interface ReactIconSelectorProps {
  readonly value: string;
  readonly onChange: (iconName: string) => void;
  readonly label?: string;
}

// Popular and good-looking icons for stats
const popularIcons = [
  // Projects/Work related
  { name: "FaBriefcase", component: FaIcons.FaBriefcase, category: "Projects" },
  { name: "FaProjectDiagram", component: FaIcons.FaProjectDiagram, category: "Projects" },
  { name: "FaTasks", component: FaIcons.FaTasks, category: "Projects" },
  { name: "FaFolderOpen", component: FaIcons.FaFolderOpen, category: "Projects" },
  { name: "HiBriefcase", component: HiIcons.HiBriefcase, category: "Projects" },
  
  // Rating/Quality
  { name: "FaStar", component: FaIcons.FaStar, category: "Rating" },
  { name: "FaAward", component: FaIcons.FaAward, category: "Rating" },
  { name: "FaTrophy", component: FaIcons.FaTrophy, category: "Rating" },
  { name: "FaMedal", component: FaIcons.FaMedal, category: "Rating" },
  { name: "FaGem", component: FaIcons.FaGem, category: "Rating" },
  { name: "FaCrown", component: FaIcons.FaCrown, category: "Rating" },
  { name: "HiStar", component: HiIcons.HiStar, category: "Rating" },
  { name: "MdStar", component: MdIcons.MdStar, category: "Rating" },
  { name: "MdGrade", component: MdIcons.MdGrade, category: "Rating" },
  
  // Users/Clients
  { name: "FaUsers", component: FaIcons.FaUsers, category: "Users" },
  { name: "FaUserFriends", component: FaIcons.FaUserFriends, category: "Users" },
  { name: "FaHandshake", component: FaIcons.FaHandshake, category: "Users" },
  { name: "HiUserGroup", component: HiIcons.HiUserGroup, category: "Users" },
  { name: "MdPeople", component: MdIcons.MdPeople, category: "Users" },
  
  // Charts/Analytics
  { name: "FaChartLine", component: FaIcons.FaChartLine, category: "Analytics" },
  { name: "FaChartBar", component: FaIcons.FaChartBar, category: "Analytics" },
  { name: "FaChartPie", component: FaIcons.FaChartPie, category: "Analytics" },
  { name: "HiChartBar", component: HiIcons.HiChartBar, category: "Analytics" },
  { name: "MdBarChart", component: MdIcons.MdBarChart, category: "Analytics" },
  
  // Client Satisfaction
  { name: "FaCheckCircle", component: FaIcons.FaCheckCircle, category: "Satisfaction" },
  { name: "FaSmile", component: FaIcons.FaSmile, category: "Satisfaction" },
  { name: "FaThumbsUp", component: FaIcons.FaThumbsUp, category: "Satisfaction" },
  { name: "FaHeart", component: FaIcons.FaHeart, category: "Satisfaction" },
  { name: "FaGrinBeam", component: FaIcons.FaGrinBeam, category: "Satisfaction" },
  { name: "FaGrinHearts", component: FaIcons.FaGrinHearts, category: "Satisfaction" },
  { name: "FaGrinAlt", component: FaIcons.FaGrinAlt, category: "Satisfaction" },
  { name: "FaGrinWink", component: FaIcons.FaGrinWink, category: "Satisfaction" },
  { name: "FaHandPeace", component: FaIcons.FaHandPeace, category: "Satisfaction" },
  { name: "HiCheckCircle", component: HiIcons.HiCheckCircle, category: "Satisfaction" },
  { name: "HiThumbUp", component: HiIcons.HiThumbUp, category: "Satisfaction" },
  { name: "MdCheckCircle", component: MdIcons.MdCheckCircle, category: "Satisfaction" },
  { name: "MdSentimentSatisfied", component: MdIcons.MdSentimentSatisfied, category: "Satisfaction" },
  { name: "MdThumbUp", component: MdIcons.MdThumbUp, category: "Satisfaction" },
  { name: "MdFavorite", component: MdIcons.MdFavorite, category: "Satisfaction" },
  { name: "AiFillLike", component: AiIcons.AiFillLike, category: "Satisfaction" },
  { name: "AiFillHeart", component: AiIcons.AiFillHeart, category: "Satisfaction" },
  
  // Growth/Progress
  { name: "FaRocket", component: FaIcons.FaRocket, category: "Growth" },
  { name: "FaArrowUp", component: FaIcons.FaArrowUp, category: "Growth" },
  { name: "FaArrowCircleUp", component: FaIcons.FaArrowCircleUp, category: "Growth" },
  { name: "HiTrendingUp", component: HiIcons.HiTrendingUp, category: "Growth" },
  { name: "MdTrendingUp", component: MdIcons.MdTrendingUp, category: "Growth" },
  
  // Time/Experience
  { name: "FaClock", component: FaIcons.FaClock, category: "Experience" },
  { name: "FaCalendarAlt", component: FaIcons.FaCalendarAlt, category: "Experience" },
  { name: "FaHistory", component: FaIcons.FaHistory, category: "Experience" },
  { name: "FaHourglassHalf", component: FaIcons.FaHourglassHalf, category: "Experience" },
  { name: "FaCalendarCheck", component: FaIcons.FaCalendarCheck, category: "Experience" },
  { name: "FaGraduationCap", component: FaIcons.FaGraduationCap, category: "Experience" },
  { name: "FaCertificate", component: FaIcons.FaCertificate, category: "Experience" },
  { name: "FaUniversity", component: FaIcons.FaUniversity, category: "Experience" },
  { name: "FaBook", component: FaIcons.FaBook, category: "Experience" },
  { name: "FaBookOpen", component: FaIcons.FaBookOpen, category: "Experience" },
  { name: "HiClock", component: HiIcons.HiClock, category: "Experience" },
  { name: "HiCalendar", component: HiIcons.HiCalendar, category: "Experience" },
  { name: "MdAccessTime", component: MdIcons.MdAccessTime, category: "Experience" },
  { name: "MdHistory", component: MdIcons.MdHistory, category: "Experience" },
  { name: "MdEvent", component: MdIcons.MdEvent, category: "Experience" },
  { name: "MdSchool", component: MdIcons.MdSchool, category: "Experience" },
  { name: "MdWork", component: MdIcons.MdWork, category: "Experience" },
];

// Helper to get icon component by name
const getIconComponent = (iconName: string) => {
  const icon = popularIcons.find((i) => i.name === iconName);
  return icon ? icon.component : null;
};

export default function ReactIconSelector({
  value,
  onChange,
  label = "Select Icon",
}: ReactIconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = popularIcons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIcon = value ? getIconComponent(value) : null;

  return (
    <div className="mb-2">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      
      {/* Selected Icon Preview */}
      {selectedIcon && (
        <div className="mb-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          {selectedIcon && createElement(selectedIcon, { style: { color: "#A7B1BE", fontSize: "24px" } })}
          <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-auto text-xs text-red-600 hover:text-red-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Icon Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        {selectedIcon ? "Change Icon" : "Select Icon"}
      </button>

      {/* Icon Picker Modal */}
      {isOpen && (
        <div className="mt-2 border rounded-md bg-white dark:bg-gray-800 p-4 max-h-96 overflow-y-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
          />

          {/* Icons Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {filteredIcons.map((icon) => {
              const IconComponent = icon.component;
              const isSelected = value === icon.name;
              return (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => {
                    onChange(icon.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`p-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  title={icon.name}
                >
                  <IconComponent
                    style={{ color: "#A7B1BE", fontSize: "24px" }}
                    className="mx-auto"
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {icon.name.replace(/^[A-Z][a-z]/, "")}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No icons found matching &quot;{searchTerm}&quot;
            </p>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
            className="mt-3 w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
