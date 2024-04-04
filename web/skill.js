/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */



document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const videoResults = document.getElementById('videoResults');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query.trim() === '') {
            videoResults.innerHTML = 'Please enter a search query';
            return;
        }

        videoResults.innerHTML = 'Loading...';

        searchVideos(query)
                .then(displayVideoResults)
                .catch(error => {
                    videoResults.innerHTML = `An error occurred: ${error.message}`;
                });
    });

    async function searchVideos(query) {
        const apiKey = 'AIzaSyDTPOHC72vMhcO_z3YomlKuP9R5RAk9pE0';

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=10&q=${query}`);
            const data = await response.json();

            if (response.ok) {
                return data.items || [];
            } else {
                throw new Error(data.error?.message || 'Unknown error');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    function displayVideoResults(videos) {
        let html = '';
        if (videos.length > 0) {
            html = videos.map(video => {
                return `
          <div class="video">
             <br><br><br>
             
            <h3>${video.snippet.title}</h3>
            <p>${video.snippet.channelTitle}</p>
            <p>${video.snippet.description}</p>
            <br>
            <iframe width="560" height="315" float="center" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
           <br><br><br>
           </div>
        `;
            }).join('');
        } else {
            html = 'No videos found';
        }
        videoResults.innerHTML = html;
    }
});