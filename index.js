let window_width = window.innerWidth;
let window_height = document.documentElement.clientHeight;
let window_shape = detect_shape(window_width, window_height)
let embed_ids = [];
let embed_window_row = 1;
let player_array = [];
let frame;

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function detect_shape(width, height) {
    let result;
    if (height > width) {
      result = 'vertical';
    } else {
      result = 'horizontal';
    }
    return result;
  }

function unique_array(array) {
  const knownElements = new Set();
  for (const elem of array) {
    knownElements.add(elem);
  }
  return Array.from(knownElements);
}


let youtube_input_form = document.getElementById('input-youtube-url');
youtube_input_form.addEventListener('keypress', onKeyPress);

function onKeyPress(e) {
  if ( e.keyCode !== 13 || ( e.keyCode === 13 && (e.shiftKey === true || e.ctrlKey === true || e.altKey === true) )) { // Enterキー除外
    return false;
  } else {
    M.toast({html: 'add movies.'})
    add_movies();
  }
}

document.getElementById("send-youtube-url").onclick = function () {
  M.toast({html: 'add movies.'})
  add_movies();
}

document.getElementById('clear-input-text').onclick = function() {
  M.toast({html: 'clear text.'})
  let textForm = document.getElementById("input-youtube-url");
  textForm.value = '';
}

function add_movies() {
  let youtube_urls = document.getElementById("input-youtube-url").value.split(',');
  let youtube_id = '';
  youtube_urls.forEach(element => {
      if (element.match(/www.youtube.com/)){
          youtube_id = element.replace("https://www.youtube.com/watch?v=", '').replace(" ", "");
      }   
      if (element.match(/youtu.be/)){
          youtube_id = element.replace("https://youtu.be/", '').replace(" ", "");
      }
      if (youtube_id.length === 11) {
        embed_ids.push(youtube_id)
      }         
  });
  let textForm = document.getElementById("input-youtube-url");
  textForm.value = '';
  embed_movie_window();
};

window.addEventListener('DOMContentLoaded', function(){
  window.addEventListener('resize', function(){
    if (embed_ids.length !== 0) {
      embed_movie_window();
    }
  });
});

function embed_movie_window() {
  let {movie_window_width, movie_window_height} = calculate_frame_size();
  let {embed_htmls, frame_ids} = make_array_for_embed_movie(movie_window_width, movie_window_height);
  document.getElementById("youtube-window").innerHTML = embed_htmls.join('\n');
  player_array = play_all_movie(frame_ids);
}

function make_array_for_embed_movie(movie_window_width, movie_window_height) {
  let embed_htmls = [];
  let frame_ids = [];
  embed_ids = unique_array(embed_ids);
  embed_ids.forEach((element, index)=> {
    let embed_hmtl = '<iframe id="player'+index+'" width="'+movie_window_width+
    '" height="'+movie_window_height+'" src="https://www.youtube.com/embed/'+
    element+'?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; \
    clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    embed_htmls.push(embed_hmtl);
    frame_ids.push("player"+index);
  });
  return {embed_htmls, frame_ids};
}

function calculate_frame_size() {
  let indiv_width = parseInt(window.innerWidth / embed_window_row, 10) - 10;
  let movie_window_width = indiv_width;
  let movie_window_height = parseInt(indiv_width * 0.5625, 10);   
  return {movie_window_width, movie_window_height};
}

function play_all_movie(frame_ids) {
  let player_array = [];
  let player;
  frame_ids.forEach(element => {
    function onYouTubeIframeAPIReady() {
      player = new YT.Player(element, {events: {'onReady': onPlayerReady}});
      return player;
    }
    function onPlayerReady(event) {
      event.target.playVideo();
    }
    player = onYouTubeIframeAPIReady(element)
    player_array.push(player);
  });
  return player_array;
}

function ctrl_play_movie() {
  player_array.forEach(element => {
    element.playVideo();
  });
}

function ctrl_pause_movie() {
  player_array.forEach(element => {
    element.pauseVideo();
  });
}


document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.fixed-action-btn');
  let instances = M.FloatingActionButton.init(elems, {
    direction: 'up'
  });
});

document.getElementById('Change-layout-upper').onclick = function() {
  if (embed_window_row < embed_ids.length) {
    embed_window_row = ++embed_window_row;
    embed_movie_window();
  }  
}

document.getElementById('Chage-layout-downer').onclick = function() {
  if (embed_window_row > 1) {
    embed_window_row = --embed_window_row;
    embed_movie_window();
  } 
}

document.getElementById('play_movie').onclick = function() {
  ctrl_play_movie();
}

document.getElementById('pause_movie').onclick = function() {
  ctrl_pause_movie();
}


