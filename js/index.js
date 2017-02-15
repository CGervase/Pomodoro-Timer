var pomodoro = {
  pInterval: null,  //initialization of var for setInterval function
  pause: true,      //true if timer is paused
  pom: true,        //true if pomodoro session, false if break or custom
  count: 1,         //points to which "dot" to fill, corresponding to how many pomodoros have been completed
  
  /** main timer function **/
  startTimer: function(duration) {  //duration in seconds
    if (pomodoro.count > 4) {       //4 pomodoros completed, reset pomodoro count
      while (pomodoro.count > 1) {
        pomodoro.count--;
        $("#c" + pomodoro.count).css("background-color", "#799CAB");
      }
    }
    
    clearInterval(pomodoro.pInterval);  //reset pInterval
    pomodoro.pause = false;             //timer is no longer paused
    duration++;                         //allows timer to start on proper second (25:00√ vs 24:59X)
    var minutes = (duration / 60) | 0;  //format minutes, 0 eliminates decimal
    var seconds = (duration % 60) | 0;  //format seconds, 0 eliminates decimal
    
    //minutes = (minutes.toString().length < 2 && seconds < 10) ? "0" + minutes : minutes;
    seconds = (seconds.toString().length < 2 && seconds < 10) ? "0" + seconds : seconds;  //adds 0 in 10s place if single digit second

    document.title = minutes + ":" + seconds + " | Pomodoro Timer";   //displays timer in browser tab title
    $("#timer").html(minutes + ":" + seconds);                        //update timer display
    
    function timer() {                //runs every second
      if (seconds > 0)                //only subtract second if seconds > 0
        seconds--;
      else if (minutes > 0) {         //only subtract minute if minutes > 0
        seconds = 59;
        minutes--;
      } else {                        //timer is done
        clearInterval(pInterval);     //reset pInterval
        return true;                  //indicates timer is finished
      }
      
      //minutes = (minutes.toString().length < 2 && minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds.toString().length < 2 && seconds < 10) ? "0" + seconds : seconds;  //adds 0 in 10s place if single digit second
      
      $("h2").html(minutes + ":" + seconds);    //update timer display
      
      if (minutes > 0 || seconds > 0)                                     //if timer is not finished,
        document.title = minutes + ":" + seconds + " | Pomodoro Timer";   //display timer in browser tab title;
      else {                                                              //otherwise (timer is finished),
        document.title = "Time's up! | Pomodoro Timer";                   //notify user in browser tab title
        if (pomodoro.pom) {                                             //if timer indicated a pomodoro,
          $("#c" + pomodoro.count).css("background-color", "#395C6B");  //fill in a dot beneath the timer
          if (!$("#toggle").is(":checked"))     //if disciplined mode is active,
            pomodoro.disable(false);            //allow user to start a break
          pomodoro.count++;                     //add to pomodoro count
          pomodoro.pom = false;                 //pomodoro is finished
        } else {                            //timer indicated a break, not a pomodoro
          if (!$("#toggle").is(":checked")) //if disciplined mode is active,
            pomodoro.disable(true);         //disable break buttons
        }
        return;
      }
    };
    
    if (timer())
      return;         //exit function if timer is finished
    pomodoro.pInterval = setInterval(timer, 1000);  //sets interval to 1 second
  },
  
  /** disables & enables buttons **/
  disable: function(dis) {    //dis = true to disable, false to enable
    if (dis) {
      $("#short").attr("disabled", "disabled");
      $("#long").attr("disabled", "disabled");
    } else {
      if (pomodoro.count < 4)
        $("#short").removeAttr("disabled");
      else
        $("#long").removeAttr("disabled");
    }
  },
  
  /** Buttons **/
  pomo: function() {            //pomodoro
    pomodoro.pom = true;
    pomodoro.startTimer(1500);  //25 minutes
  },
  short: function() {           //short break
    pomodoro.pom = false;
    pomodoro.startTimer(300);   //5 minutes
  },
  long: function() {            //long break
    pomodoro.pom = false;
    pomodoro.startTimer(900);   //15 minutes
  },
  custom: function() {          //custom time length
    pomodoro.pom = false;
    var min = $("#input").val();
    if (min === "" || isNaN(min) || min != parseInt(min)) {   //input is not an integer
      alert("Please enter the number of minutes.");
      return false;
    } else if (min > 100 || min < 0) {                        //input is out of range
      alert("Please enter a number between 0 and 100.");
    } else {                          //input is valid
      pomodoro.startTimer(min * 60);  //start timer based on input
    }
  },
  
  startStop: function() {       //starts and pauses the timer
    if (pomodoro.pause) {       //timer is paused, resume
      pomodoro.pause = false;   //timer is not paused
      var timer = $("#timer").text();   //store time left when paused
      var minutes = parseInt(timer.substring(0, timer.length - 3), 10);
      var seconds = parseInt(timer.substring(timer.length - 2), 10);
      pomodoro.startTimer((minutes * 60) + seconds);  //resume timer with stored time length
    } else {                    //timer is not paused, pause it
      pomodoro.pause = true;
      clearInterval(pomodoro.pInterval);  //reset pInterval
    }
  },
  
  reset: function() {           //resets timer to 25 minutes
    pomodoro.pause = true;      //pauses timer
    clearInterval(pomodoro.pInterval);  //reset pInterval
    pomodoro.count = 1;         //resets pomodoro count
    pomodoro.pom = true;        //indicates pomodoro is next, only for disciplined mode
    $("#timer").html("25:00");  //sets timer display to 25:00
    document.title = "Pomodoro Timer";  //resets browser tab title
  },
  
  toggle: function() {          //toggles between disciplined and free modes
    if($("#toggle").is(":checked")) {     //free mode, enable all buttons
      $("#short").removeAttr("disabled");
      $("#long").removeAttr("disabled");
      $("#custom").removeAttr("disabled");
    } else {                              //disciplined mode, disable break and custom buttons
      $("#short").attr("disabled", "disabled");
      $("#long").attr("disabled", "disabled");
      $("#custom").attr("disabled", "disabled");
    }
  }
}

$(document).ready(function() {
  $("#pomodoro").click(pomodoro.pomo);  //pomodoro button
  $("#short").click(pomodoro.short);    //short break button
  $("#long").click(pomodoro.long);      //long break button
  $("#custom").click(pomodoro.custom);  //custom time length button
  
  $("#start").click(pomodoro.startStop);//start/stop timer button
  $("#reset").click(pomodoro.reset);    //reset timer button
  
  $("#toggle").click(pomodoro.toggle);  //switch between disciplined & free modes
  
  $(document).keydown(function(e) {     //key listener for keyboard shortcuts
    var key = String.fromCharCode(e.keyCode);
    switch (key) {
      case "P":
        pomodoro.pomo();
        break;
      case "S":
        if (!($("#short").attr("disabled")))
          pomodoro.short();
        break;
      case "L":
        if (!($("#long").attr("disabled")))
          pomodoro.long();
        break;
      case "C":
        if (!($("#custom").attr("disabled")))
          pomodoro.custom();
        break;
      case "R":
        pomodoro.reset();
        break;
      case " ":
        pomodoro.startStop();
        break;
    }
  });
  
  $(function () {
    $("#help").popover(); //initialize popover for help button
  });
});