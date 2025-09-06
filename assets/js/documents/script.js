document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.buttons');
  const contents = document.querySelectorAll('.content');
  const leftbar = document.querySelector('.leftbar');
  const toggleButton = document.querySelector('#toggleButton');

  const MOBILE_WIDTH = 500;

  const updateSidebarState = () => {
    const isMobile = window.innerWidth <= MOBILE_WIDTH;
    const hasHash = !!location.hash;

    leftbar.classList.toggle('active', !isMobile || !hasHash);
    leftbar.classList.toggle('hidden', isMobile && hasHash);
  };

  const updateContentFromHash = () => {
    const hash = location.hash.slice(1);

    buttons.forEach(btn => {
      const target = btn.dataset.target;
      const isActive = target === hash;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : '');
    });

    contents.forEach(content => {
      content.classList.toggle('active', content.id === hash);
    });
  };

  const handleRouteChange = () => {
    updateContentFromHash();
    updateSidebarState();
  };

  const toggleSidebar = () => {
    leftbar.classList.toggle('active');
    leftbar.classList.toggle('hidden');
  };

  // Инициализация
  handleRouteChange();

  // Слушатели
  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('resize', handleRouteChange);

  toggleButton?.addEventListener('click', toggleSidebar);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      location.hash = target;

      if (window.innerWidth <= MOBILE_WIDTH) {
        leftbar.classList.remove('active');
        leftbar.classList.add('hidden');
      }
    });
  });
});