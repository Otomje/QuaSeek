   document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.buttons');
  const contents = document.querySelectorAll('.content');
  const leftbar = document.querySelector('.leftbar');
  const toggleButton = document.querySelector('#toggleButton');

  function updateSidebarState() {
    if (window.innerWidth <= 500 && location.hash) {
      leftbar.classList.remove('active');
      leftbar.classList.add('hidden');
    } else {
      leftbar.classList.add('active');
      leftbar.classList.remove('hidden');
    }
  }

  function updateContentFromHash() {
    const hash = location.hash.slice(1) || 'about';

    buttons.forEach(btn => {
      const target = btn.getAttribute('data-target');
      btn.classList.toggle('active', target === hash);
      btn.setAttribute('aria-current', target === hash ? 'page' : null);
    });

    contents.forEach(content => {
      content.classList.toggle('active', content.id === hash);
    });
  }

  function handleRouteChange() {
    updateContentFromHash();
    updateSidebarState();
  }

  function toggleSidebar() {
    leftbar.classList.toggle('active');
    leftbar.classList.toggle('hidden');
  }

  handleRouteChange();

  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('resize', handleRouteChange);

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleSidebar);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      location.hash = target;

      if (window.innerWidth <= 500) {
        leftbar.classList.remove('active');
        leftbar.classList.add('hidden');
      }
    });
  });
});