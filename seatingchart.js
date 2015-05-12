var sChart = new Array(); // Used for location information
var dimension = 12; // Dimension of the seating chart grid
var classRoster = new Array(); // Used for list of students in class (prepare for placement in grid)
var numDesks = 0;
var chartRules = new Array();
var Rule = new Array();
var numRules = 0;


function seatingChart() {
    var count = 0;

    // Creates table for seating chart
	for (var i = 0; i < dimension; i++){
		var row = $("<tr>");
		$("table").append(row);
		sChart[i] = new Array();
		for (var j = 0; j < dimension; j++) {
			var cell = $("<td>");
			cell.addClass("nodesk unoccupied");
			cell.attr("title",undefined);
		    cell.attr("id", count);
		    count++;
			row.append(cell);
			sChart[i][j] = "nodesk";
		}
	}
	
	// Put in class roster. Store names in class 
	//roster list and use to randomly place in a seating chart
	var k = 0;
	
	$("input:text").change(function(){
  	    if ($("input:text[name=studentName]").val() != ""){
  	        var aStudent = $("<li>");
  	        aStudent.text($("input:text[name=studentName]").val());
  	        $("ul.classList").append(aStudent);
  	        classRoster[k] = $("input:text[name=studentName]").val();
  	        $("input:text[name=studentName]").val("");
  	        k++;
  	    }
  	            
  	    if (classRoster.length >=2) {     
  	        var pair = pickTwoStudents();
  	      	        
            $("input:radio").click(function(){
                var sname = $("input:radio[name=answer]:checked").val();
                if (sname != undefined) {
                    numRules++;
                    var studentRules = new Array();
                    studentRules[0] = pair[0];
                    studentRules[1] = pair[1];
                    studentRules[2] = sname;
                    
                    var test = new Array();
                    var flag = false;
                    for (var h = 0; h < chartRules.length; h++) {
                        test = chartRules[h];
                        // alert(test);
                        // alert(studentRules);
                        // alert(pair);
                        if ((test[0] == studentRules[0] && test[1] == studentRules[1]) ||
                        (test[0] == studentRules[1] && test[1] == studentRules[0])) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == false) {
                        chartRules[numRules-1] = studentRules;
                    }
                    else {
                        numRules--;
                    }
                    $('input:radio').attr('checked',false);
                }
          	});	 
        }
  	});

    // Lay out desks in the grid
	$("td").click(toggleDesk);
	
	$("button.arrange").click(function() {
	    
	    for (var i = 0; i < dimension; i++) {
	        for (var j = 0; j < dimension; j++) {
	            if (sChart[i][j] != "nodesk") {
	                sChart[i][j] = "desk";
	                id = i*dimension+j;
	                $("td#"+id).removeClass("occupied").addClass("unoccupied");
	                $("td#"+id).text("");
	                $("td#"+id).attr("title","");
	                
	            }
	        }
	    }
	    
	    if (numDesks >= classRoster.length) {
	        var rosterCopy = classRoster.slice(0);
	        for (var i = dimension-1; i >= 0; i--) {
    	        for (var j = dimension-1; j >= 0; j--) {
    	            if (sChart[i][j] == "desk") {
    	                studentIndex = Math.floor((Math.random()*rosterCopy.length));
    	                if (rosterCopy[studentIndex] != undefined) {
        	                sChart[i][j] = rosterCopy[studentIndex];
        	                rosterCopy.splice(studentIndex,1);
        	                id = i*dimension+j;
        	                $("td#"+id).text(sChart[i][j]);
        	                $("td#"+id).removeClass("unoccupied").addClass("occupied");
        	                $("td#"+id).attr("title",sChart[i][j]);
    	                }
    	            }
    	        }
    	    }
	    }
	    else {
	        alert("Not enough desks for students!");
	    }
	});
}

function pickTwoStudents() {
    var sIndex1 = 0;
	var sIndex2 = 0;
	var studentpair = new Array();
	
    while (sIndex1 == sIndex2) {
        sIndex1 = Math.floor((Math.random()*classRoster.length));
        sIndex2 = Math.floor((Math.random()*classRoster.length));
    }  
    studentpair[0]=classRoster[sIndex1];
    studentpair[1]=classRoster[sIndex2];
    
    /* Updating smartChart Form */
    $(".student1").text(studentpair[0]);
    $(".student2").text(studentpair[1]);
    
    return studentpair;
    
}

// Ask user questions about pairings of students
function smartSC () {
    var testStudents = new Array();
    
    for (var i = 0; i < classRoster.length; i++) {
          for (var j = 0; j < classRoster.length; j++) {
              if (classRoster[i] != classRoster[j]) {
                      testStudents[1] = classRoster[i];
                      testStudents[2] = classRoster[j];
                      return testStudents;

              }
          }
      }
}

function toggleDesk() {
    var id = $(this).attr("id");
    var r = (id - (id % dimension))/dimension;
    var c = id % dimension;
    
    // Toggle desk color
    $(this).toggleClass("desk");
    $(this).toggleClass("nodesk");
    
    // Toggle button
    if ($(this).hasClass("desk")) {
        sChart[r][c] = "desk";
        numDesks++;
    }
  
    // Remove desk and student if desk is deleted with student in desk
    if ($(this).hasClass("occupied")) {
        $(this).contents().remove();
        $(this).attr("title",undefined);
        $(this).removeClass("occupied").addClass("unoccupied");
        
        r = (id - (id % dimension))/dimension;
        c = id % dimension;
        sChart[r][c] = "nodesk";
        numDesks--;
        
        // Remove students from roster
        for (var i = 0; i < classRoster.length; i++) {
            if (classRoster[i] == sChart[r][c]) {
                classRoster.splice(i,1);
            }
        }
    }
}

function addStudent() {     
    var name = studentName();
    var r;
    var c;
    var id = $(this).parent().attr("id");
    
    if (name !== false) {
        $(this).parent().removeClass("unoccupied").addClass("occupied");
        $(this).parent().attr("title",name);
        $(this).parent().text(name);
        
        r = (id - (id % dimension))/dimension;
        c = id % dimension;
        sChart[r][c] = name;
    } 
    return false;
}

function studentName() { 
    var name = window.prompt("Student Name:","");
    
    if (name !== "") { 
        /* Updating smartChart Form */
        if (classRoster.length >= 2) {
    	    test = smartSC();
    	    $(".student1").text(test[1]);
            $(".student2").text(test[2]);
            $("input").click(function(){ alert("Hit line xyzzy");
          	    if ($("input:radio[name=answer]:checked").val() == "yes"){
          	        alert("you said yes!");
          	    }
          	    else if ($("input:radio[name=answer]:checked").val() == "no") {
          	        alert("you said no!");
          	    }
          	});
        }
        return name;
    }
    else {
        return false;
    }
}

// Determines whether two students are adjacent (next to or diagonal)
function isNextTo(aString1,aString2) { 
    var r1; var c1;
    var r2; var c2;
    
    for (var i = 0; i < dimension; i++){
		for (var j = 0; j < dimension; j++) {
			if (sChart[i][j] === aString1) {
			    r1 = i;
			    c1 = j;
			}
			if (sChart[i][j] === aString2) {
			    r2 = i;
			    c2 = j;
			}
		}
	}

    //same column, next to row
    if ( (c1 === c2 && (r1 + 1) === r2) || (c1 === c2 && (r1 - 1) === r2) ) {
        return true;
    }
    // same row, next to column
    else if ( (r1 === r2 && (c1 + 1) === c2) || (r1 === r2 && (c1 - 1) === c2) ) {
        return true;
    }
    // above row, column on either side
    else if ( ((r1 + 1) === r2 && (c1 + 1) === c2) || ((r1 + 1) === r2 && (c1 - 1) === c2) ) {
        return true;
    }
    // below row, column on other side
    else if ( ((r1 - 1) === r2 && (c1 + 1) === c2) || ((r1 - 1) === r2 && (c1 - 1) === c2) ) {
        return true;
    }
    else {
        return false;
    }
}

$(document).ready(seatingChart);
