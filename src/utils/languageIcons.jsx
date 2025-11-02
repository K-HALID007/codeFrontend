import {
  FaReact,
  FaPython,
  FaCss3Alt,
  FaJs,
  FaHtml5,
  FaNodeJs,
  FaDatabase,
  FaMicrosoft, // fallback for C#
} from "react-icons/fa";
import { SiTypescript, SiCplusplus, SiRust, SiGo } from "react-icons/si";
import { BsTerminal } from "react-icons/bs";

export const getLanguageIcon = (language) => {
  const lowerLang = language.toLowerCase();

  if (lowerLang.includes("react") || lowerLang.includes("jsx")) {
    return <FaReact className="text-cyan-400" />;
  } else if (lowerLang.includes("python")) {
    return <FaPython className="text-yellow-400" />;
  } else if (lowerLang.includes("javascript") || lowerLang.includes("js")) {
    return <FaJs className="text-yellow-300" />;
  } else if (lowerLang.includes("typescript") || lowerLang.includes("ts")) {
    return <SiTypescript className="text-blue-500" />;
  } else if (lowerLang.includes("css")) {
    return <FaCss3Alt className="text-blue-400" />;
  } else if (lowerLang.includes("html")) {
    return <FaHtml5 className="text-orange-500" />;
  } else if (lowerLang.includes("node")) {
    return <FaNodeJs className="text-green-500" />;
  } else if (lowerLang.includes("bash") || lowerLang.includes("shell")) {
    return <BsTerminal className="text-gray-400" />;
  } else if (lowerLang.includes("sql") || lowerLang.includes("mongo")) {
    return <FaDatabase className="text-green-400" />;
  } else if (lowerLang.includes("c++") || lowerLang.includes("cpp")) {
    return <SiCplusplus className="text-blue-600" />;
  } else if (lowerLang.includes("c#") || lowerLang.includes("csharp")) {
    return <FaMicrosoft className="text-purple-500" />; // ✅ fallback icon
  } else if (lowerLang.includes("rust")) {
    return <SiRust className="text-orange-600" />;
  } else if (lowerLang.includes("go") || lowerLang.includes("golang")) {
    return <SiGo className="text-cyan-500" />;
  }

  return <FaReact className="text-gray-400" />; // default fallback
};

export const getLanguageColor = (language) => {
  const lowerLang = language.toLowerCase();

  if (lowerLang.includes("javascript")) return "bg-yellow-500";
  if (lowerLang.includes("typescript")) return "bg-blue-500";
  if (lowerLang.includes("python")) return "bg-yellow-600";
  if (lowerLang.includes("react")) return "bg-cyan-500";
  if (lowerLang.includes("css")) return "bg-blue-400";
  if (lowerLang.includes("html")) return "bg-orange-500";

  return "bg-gray-500";
};
