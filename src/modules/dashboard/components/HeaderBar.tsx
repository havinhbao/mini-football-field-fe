import { Header } from '@/uiComponents';
import { FC } from 'react';

type HeaderBarProps = {
  onSidebarToggle?: () => void;
};

const HeaderBar: FC<HeaderBarProps> = ({ onSidebarToggle }) => {
  return <Header onSidebarToggle={onSidebarToggle} />;
};

export default HeaderBar;
