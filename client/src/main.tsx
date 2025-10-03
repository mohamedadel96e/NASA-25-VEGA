import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import MainMenu from './screens/MainMenu';
import './index.css';
import BackgroundMusic from './sdk/BackgroundMusic';
import Logo from './components/Logo';
import PlayGround from './screens/PlayGround';


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
		<BackgroundMusic />
		<Logo />
    	<Routes>
      		<Route path="/" element={<MainMenu />} />
			<Route path="/play" element={<PlayGround />} />
    	</Routes>
	</BrowserRouter>
)
