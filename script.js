document.addEventListener('DOMContentLoaded', function() {
    const articlePath = 'articles/formattingGuidelines.html';
    fetch(articlePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            initializePlugins();
        })
        .catch(error => console.error('Error loading article:', error));
});

function initializePlugins() {
    initializeAccordion('.accordion--default', { activeIndex: -1 });
    initializeAccordion('.accordion--colored', { activeIndex: -1 });
    initializeTabs('.tabs', { activeIndex: 0 });
}
