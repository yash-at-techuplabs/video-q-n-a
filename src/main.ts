import './style.css'
import { VideoQAApp } from './VideoQAApp'
import { createAppHTML } from './template'

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.querySelector<HTMLDivElement>('#app')!;
  appContainer.innerHTML = createAppHTML();
  
  const app = new VideoQAApp();
  app.initialize();
});

