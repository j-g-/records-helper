
var rgcount = 0; 
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

function restore(rgID){
	id = 'record-ta-'+ rgID;
	ta = document.getElementById(id); //text area
	ov = interactions[rgID].pop();
	ta.value = ov;
}
function bringToFront(rgID){
	id = 'record-box-'+ rgID;
	console.log("bring to front " + id)
	db = document.getElementById(id); //db box
	db.style.position  = "absolute";
	db.style.zindex  = "-1";
}
function copyToClipboard(rgID){
	id = 'record-ta-'+ rgID;
	ta = document.getElementById(id); //text area
	ta.select();
	document.execCommand("Copy");
	console.log("Copied record " + rgID  );
}

function reset(rgID){
	id = 'record-ta-'+ rgID;
	console.log('reset ' + id);
	ta = document.getElementById(id); // textarea
	icount++;
	console.log('reset record ' + rgID);
	console.log('record lenght ' + ta.value.length);
	console.log('sample lenght ' + sample.length);

	if (ta.value.length > sample.length){
		switch (rgID){
			case 'A': 
				interactions['A'].push(ta.value); break;
			case 'B': 
				interactions['B'].push(ta.value); break;
		}
	}
	ta.value = sample;
}

function newRecordsGroup(){
	rgcount++;
	grpBox = createRecordBox(rgcount);
	document.getElementById('content').appendChild(grpBox);
}

function saveSample(){
	ta = document.getElementById("sample-ta");
	sample = ta.value;
	initialize();
}


function next(rgID){

}

function prev(rgID){

}

function initialize(){
	console.log("Starting Records");
	console.log(sample);
	ta = document.getElementsByClassName("record-content");
	for (i = 0; i < ta.length ; i++) {
		ta[i].value = sample;
	}
}

function createRecordBox(groupID){
	divRecordBox = document.createElement('div');
	divRecordBox.setAttribute('id','record-box-' + groupID);
	divRecordBox.setAttribute('class','record-grp');
	return divRecordBox;
}

window.onload = initialize;

// vim:set sw=4 ts=4 sts=2 noet:
