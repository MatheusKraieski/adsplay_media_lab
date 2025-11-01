import React from 'react';
import { Page } from '../types';
import ProjectCard from '../components/ProjectCard';
import { PlayIcon } from '../components/icons/PlayIcon';
import { SliderIcon } from '../components/icons/SliderIcon';
import { SoccerIcon } from '../components/icons/SoccerIcon';
import { CarouselIcon } from '../components/icons/CarouselIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface HomePageProps {
  onSelectProject: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectProject }) => {
  const { t } = useLanguage();

  const projects = [
    {
      page: Page.VideoAd,
      icon: <PlayIcon />,
      title: t('project.video.title'),
      description: t('project.video.description'),
    },
    {
      page: Page.SliderAd,
      icon: <SliderIcon />,
      title: t('project.slider.title'),
      description: t('project.slider.description'),
    },
    {
      page: Page.VideoDisplayAd,
      icon: <SoccerIcon />,
      title: t('project.soccer.title'),
      description: t('project.soccer.description'),
    },
    {
      page: Page.CarouselAd,
      icon: <CarouselIcon />,
      title: t('project.carousel.title'),
      description: t('project.carousel.description'),
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
        {t('home.title.part1')}{' '}
        <span className="text-purple-500">{t('home.title.part2')}</span>
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-gray-400">
        {t('home.subtitle')}
      </p>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {projects.map((project) => (
          <ProjectCard
            key={project.page}
            icon={project.icon}
            title={project.title}
            description={project.description}
            onClick={() => onSelectProject(project.page)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;