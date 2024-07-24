# Knowledge Article Editor

Allows you to preview Help Center articles locally using VSCode and Live Server. You can write your articles in HTML and place them in the `articles` folder, and see live updates in the browser.

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```sh
git clone <repository-url>
cd local-editor
```

### 2. Install Live Server Extension in VSCode

To see live updates of your HTML files, install the Live Server extension in VSCode:

1. Open VSCode.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X` (`Cmd+Shift+X` on Mac).
3. Search for `Live Server` and click Install.

### 3. Add Your Article

1. Place your HTML article file in the `articles` folder.
2. Update the `script.js` file to reference your article. Modify the `articlePath` variable in `script.js` to point to your HTML file:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const articlePath = 'articles/your-article.html'; // Change this path to your article
    fetch(articlePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            initializePlugins(); // Initialize your plugins after loading the content
        })
        .catch(error => console.error('Error loading article:', error));
});
```

### 4. Start Live Server

1. Open the project folder in VSCode.
2. Right-click on `index.html` and select "Open with Live Server".
3. Your default browser will open with a live preview of your HTML file. As you edit the    article in the `articles` folder and save your changes, the browser will automatically refresh to show the updates.
