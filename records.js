
var rgcount = 0; 
var sample = "Sample:";
var dateTime = new Date();

var groupSet = [];
var groupViewSet = [];
var svgIconSet = {
	'copy'    : '<img class="icon" src="./copy.svg" alt="Copy">',
	'new'     : '<img class="icon" src="./new.svg" alt="New">',
	'restore' : '<img class="icon" src="./restore.svg" alt="Restore">',
	'prev'    : '<img class="icon" src="./prev.svg" alt="Previous">',
	'next'    : '<img class="icon" src="./next.svg" alt="Next">'
}

var icount = 0;

//Records Group Prototype
function  RecordsGroup (gid){
	this.gid = gid;
	this.displayedIndex = 0;
	this.recordSet = [];
}
RecordsGroup.prototype.addRecord = function(record){
	this.recordSet.push(record)
}

/* Records Group View Prototype */
function RecordGroupView(groupID){
	this.groupID = groupID;
	// create box
	this.divRecordBox = document.createElement('div');
	this.divRecordBox.setAttribute('id','record-box-' + groupID);
	this.divRecordBox.setAttribute('class','record-grp');
	this.divRecordBox.setAttribute('onclick', 'bringToFront(' + groupID +')');

	// create header 
	this.divRecordHeader = document.createElement('div');
	this.divRecordHeader.setAttribute('class','record-header');
	this.idLabel = document.createElement('label');
	this.idLabel.setAttribute('class','id-label');
	this.idLabel.innerText = groupID + '.ID';
	this.idInput = document.createElement('input');
	this.idInput.setAttribute('id','id-in-'+groupID);
	this.idInput.setAttribute('class','id-input');
	this.idLabel.appendChild(this.idInput);
	this.divRecordHeader.appendChild(this.idLabel);
	this.divRecordBox.appendChild(this.divRecordHeader);

	// create textarea
	this.recordTextArea = document.createElement('textarea');
	this.recordTextArea.setAttribute('id','record-ta-' + groupID);
	this.recordTextArea.setAttribute('class','record-content');
	this.recordTextArea.value = sample;
	this.divRecordBox.appendChild(this.recordTextArea);

    // add saved date
    this.saveTimeBox = document.createElement('div');
    this.saveTimeBox.setAttribute('class', 'saved-date-box');
    this.saveTimeBox.setAttribute('id', 'sv-date-'+ groupID);
    this.saveTimeBox.innerHTML= "<p>No date</p>";
	this.divRecordBox.appendChild(this.saveTimeBox);

	// create record controls
	this.divControlBox = document.createElement('div');
	this.divControlBox.setAttribute('class','record-control');
	// add buttons
	this.copyBtn = document.createElement('button');
	this.copyBtn.setAttribute('class','control');
	this.copyBtn.setAttribute('title','Save');
	this.copyBtn.setAttribute('onclick', 'copyToClipboard(' + groupID +')');
	this.copyBtn.innerHTML = svgIconSet['copy'];
	this.divControlBox.appendChild(this.copyBtn);

	this.newBtn = document.createElement('button');
	this.newBtn.setAttribute('class','control');
	this.newBtn.setAttribute('title','New');
	this.newBtn.setAttribute('onclick', 'newRecord(' + groupID +')');
	this.newBtn.innerHTML = svgIconSet['new'];
	this.divControlBox.appendChild(this.newBtn);

	this.prevBtn = document.createElement('button');
	this.prevBtn.setAttribute('class','control');
	this.prevBtn.setAttribute('title','Prev');
	this.prevBtn.setAttribute('onclick', 'prev(' + groupID +')');
	this.prevBtn.innerHTML = svgIconSet['prev'];
	this.divControlBox.appendChild(this.prevBtn);

	this.nextBtn = document.createElement('button');
	this.nextBtn.setAttribute('class','control');
	this.nextBtn.setAttribute('title','Next');
	this.nextBtn.setAttribute('onclick', 'next(' + groupID +')');
	this.nextBtn.innerHTML = svgIconSet['next'];
	this.divControlBox.appendChild(this.nextBtn);

	// add controls
	this.divRecordBox.appendChild(this.divControlBox);
}
RecordGroupView.prototype.refreshDisplayedRecord = function() {
	var gs              = groupSet[this.groupID];
	indocTextArea       = document.getElementById('record-ta-'+ this.groupID);
	indocTextArea.value = gs.recordSet[gs.displayedIndex].record;
	indocIdInput        = document.getElementById('id-in-'+ this.groupID);
	indocIdInput.value  = gs.recordSet[gs.displayedIndex].associatedID ;
	indocDate        = document.getElementById('sv-date-'+ this.groupID);
    var d = new Date(gs.recordSet[gs.displayedIndex].savedAt);
    var ds = d.toLocaleTimeString();
    indocDate.innerHTML = '<p> Saved: <i>'+ds+'<i></p>'
    
}
RecordGroupView.prototype.getView = function() {
	return this.divRecordBox;
}

 RecordGroupView.prototype.placeBellow = function(rgID){
	 var refid = 'record-box-' + rgID;
	 var boxid = 'record-box-' + this.groupID;
	 var rec = document.getElementById(refid).getBoundingClientRect();
	 var left = document.getElementById(refid).style.left;
	 var box = document.getElementById(boxid).style.top = rec.bottom + 4;
	 var box = document.getElementById(boxid).style.left = left;
}
// Creates new RecordGroup and corresponding RecordGroupView
function newRecordsGroup(){
	groupSet[rgcount] = new  RecordsGroup(rgcount);
	var nr = new Record( "" , sample );
	groupSet[rgcount].addRecord(nr);
	groupSet[rgcount].displayedIndex = 0;

	groupViewSet[rgcount] = new RecordGroupView(rgcount);
	document.getElementById('content').appendChild(groupViewSet[rgcount].getView());

	groupID = rgcount;
	$(function(){
		grpBoxID =  '#record-box-' + groupID;
		taID =  '#record-ta-' + groupID;
		$( grpBoxID ).resizable({ handles: "n"});
		$( taID ).resizable({ alsoResize: grpBoxID });
		$( grpBoxID ).draggable();
	});
	rgcount++;
}

/* Record Prototype */
function Record (associatedID, record ){
	this.associatedID = associatedID;
	this.savedAt =  Date.now();
	this.record = record;
}
Record.prototype.setAssociatedID = function (aid){
	this.associatedID = aid;
}

Record.prototype.setRecord = function (record){
	this.record = record;
	this.savedAt =  Date.now();
}

function bringToFront(rgID){
	for (var i = 0  ; i < groupSet.length ; i++){
		document.getElementById('record-box-'+ i).style.zIndex = (rgID == i)? 1 : 0;
	}
}

function copyToClipboard(rgID){
	saveDiplayedRecord(rgID);
	id = 'record-ta-'+ rgID;
	ta = document.getElementById(id); //text area
	ta.select();
	document.execCommand("Copy");
	console.log("Copied record " + rgID  );
}

function saveDiplayedRecord(rgID){
	var rs = groupSet[rgID].recordSet;
	var gs = groupSet[rgID];
	ta =  document.getElementById('record-ta-'+ rgID); // textarea
	idInput =  document.getElementById('id-in-'+ rgID); // textarea
	if ( ta.value.length != rs[gs.displayedIndex].record.length){ 
		rs[gs.displayedIndex].setRecord(ta.value);
	}
    if(idInput.value.length > 0){
        rs[gs.displayedIndex].setAssociatedID(idInput.value);
    }
}
function newRecord(rgID){
	var rs = groupSet[rgID].recordSet;
	var gs = groupSet[rgID];
	var lastIndex = rs.length -1;
	saveDiplayedRecord(rgID)
    gs.displayedIndex = lastIndex;
	if (rs[lastIndex].record.length != sample.length){
        gs.displayedIndex += 1;
		var nr = new Record( "" , sample );
		gs.addRecord(nr);
	}
    groupViewSet[rgID].refreshDisplayedRecord();
}


function saveSample(){
	ta = document.getElementById("sample-ta");
	oldSample = sample;
	sample = ta.value;
	for (var i = 0, len = groupSet.length; i < len; i++) {
		saveDiplayedRecord(i);
		var rs = groupSet[i].recordSet;
		var li = rs.length - 1;
		if (rs[li].record.length == oldSample.length){
			rs[li].record = sample;
		}
		groupViewSet[i].refreshDisplayedRecord();
	}
}

function next(rgID){
	saveDiplayedRecord(rgID);
	var rs = groupSet[rgID].recordSet;
	groupSet[rgID].displayedIndex += 1;
	if(  groupSet[rgID].displayedIndex < rs.length){
		groupViewSet[rgID].refreshDisplayedRecord();
	} else {
		groupSet[rgID].displayedIndex = rs.length -1;
	}
}

function prev(rgID){
	saveDiplayedRecord(rgID);
	var rs = groupSet[rgID].recordSet;
	groupSet[rgID].displayedIndex--;
	if(groupSet[rgID].displayedIndex > -1){
		groupViewSet[rgID].refreshDisplayedRecord();
	} else {
		groupSet[rgID].displayedIndex = 0;
	}
}

function initialize(){
	console.log("Starting Records");
	newRecordsGroup();
	newRecordsGroup();
	groupViewSet[1].placeBellow(0);
}
window.onload = initialize;

// vim:set sw=4 ts=4 sts=2 noet:
