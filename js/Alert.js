export default class Alert {
  async initialize() {
    try {
      const response = await fetch('./public/json/alerts.json');
      const data = await response.json();
      
      if (data.length > 0) {
        const alertSection = document.createElement('section');
        alertSection.className = 'alert-list';

        data.forEach(alert => {
          const { message, background, color } = alert;
          const alertParagraph = document.createElement('p');
          alertParagraph.textContent = message;
          alertParagraph.style.backgroundColor = background;
          alertParagraph.style.color = color;
          alertSection.appendChild(alertParagraph);
        });

        const mainElement = document.querySelector('main');
        mainElement.prepend(alertSection);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  }
}