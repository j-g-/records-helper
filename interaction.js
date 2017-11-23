
var sample = "Sample:";

var groupSet = [];
var interactions = {
	'A' :  [],
	'B' :  [],
};

var icount = 0;

//Records Group Prototype
function  RecordsGroup (){
	this.displayedIndex = 0;
	this.recordSet = [];
}
RecordsGroup.prototype.addRecord = function(record){
	this.recordSet.push(record)
}

//Record Prototype
function Record (associatedID, record, dateTime ){
	this.associatedID = associatedID;
	this.savedAt =  dateTime;
	this.record = record;
}

function restore(interID){
	id = 'interaction-ta-'+ interID;
	ta = document.getElementById(id); //text area
	ov = interactions[interID].pop();
	ta.value = ov;
}
function bringToFront(interID){
	id = 'interaction-box-'+ interID;
	db = document.getElementById(id); //db box
	db.style.position  = "absolute";
	db.style.zindex  = "-1";
}
function copyToClipboard(interID){
	id = 'interaction-ta-'+ interID;
	ta = document.getElementById(id); //text area
	ta.select();
	document.execCommand("Copy");
	console.log("Copied interaction " + interID  );
}

function reset(interID){
	id = 'interaction-ta-'+ interID;
	console.log('reset ' + id);
	ta = document.getElementById(id); // textarea
	icount++;
	console.log('reset interaction ' + interID);
	console.log('interaction lenght ' + ta.value.length);
	console.log('sample lenght ' + sample.length);

	if (ta.value.length > sample.length){
		switch (interID){
			case 'A': 
				interactions['A'].push(ta.value); break;
			case 'B': 
				interactions['B'].push(ta.value); break;
		}
	}
	ta.value = sample;

}

function saveSample(){
	ta = document.getElementById("sample-ta");
	sample = ta.value;
	initialize();
}


function next(interID){

}

function prev(interID){

}

function initialize(){
	console.log("Starting Records");
	console.log(sample);
	ta = document.getElementsByClassName("interaction-content");
	for (i = 0; i < ta.length ; i++) {
		ta[i].value = sample;
	}
}

	window.onload = initialize;
