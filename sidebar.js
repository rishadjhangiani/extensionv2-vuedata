document.getElementById('closeButton').addEventListener('click', function() {
    let sidebar = document.getElementById('mySidebar');
    if (sidebar) {
      //closes sidebar if there
      sidebar.remove();
      document.body.style.marginRight = '0';  
    }
  });
  
  
  