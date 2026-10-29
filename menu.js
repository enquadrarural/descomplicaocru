/* ==========================
   MENU LATERAL
========================== */

function toggleMenu() {

  const sidebar =
    document.querySelector('.sidebar');

  if (!sidebar) return;

  sidebar.classList.toggle('collapsed');

  const menuRecolhido =
    sidebar.classList.contains('collapsed');

  localStorage.setItem(
    'menuRecolhido',
    menuRecolhido
  );
}

document.addEventListener('DOMContentLoaded', () => {

  const sidebar =
    document.querySelector('.sidebar');

  if (!sidebar) return;

  const menuRecolhido =
    localStorage.getItem('menuRecolhido') === 'true';

  if (menuRecolhido) {
    sidebar.classList.add('collapsed');
  }

});