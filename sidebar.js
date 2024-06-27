document.getElementById('closeButton').addEventListener('click', function() {
    let sidebar = document.getElementById('mySidebar');
    if (sidebar) {
      sidebar.remove();
      document.body.style.marginRight = '0';  // Reset the margin
    }
  });
  
  // You can add other JavaScript code here to interact with the sidebar
  console.log('Sidebar loaded');
  