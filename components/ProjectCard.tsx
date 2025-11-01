
import React from 'react';

interface ProjectCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 flex flex-col items-start space-y-4 cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition-all duration-300 group"
    >
      <div className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default ProjectCard;
