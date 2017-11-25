
var rgcount = 0; 
var sample = "Sample:";

var groupSet = [];
var groupViewSet = [];
var interactions = {
	'A' :  [],
	'B' :  [],
};
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

//Records Group View Prototype
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
    this.idInput.setAttribute('class','id-input');
	this.idLabel.appendChild(this.idInput);
	this.divRecordHeader.appendChild(this.idLabel);
	this.divRecordBox.appendChild(this.divRecordHeader);

	// create textarea
	this.recordTextArea = document.createElement('textarea');
	this.recordTextArea.setAttribute('id','record-ta-' + groupID);
	this.recordTextArea.setAttribute('class','record-content');
    this.recordTextArea.innerText = sample;
	this.divRecordBox.appendChild(this.recordTextArea);

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
	this.newBtn.innerHTML = svgIconSet['new'];
	this.divControlBox.appendChild(this.newBtn);

	this.restoreBtn = document.createElement('button');
	this.restoreBtn.setAttribute('class','control');
	this.restoreBtn.setAttribute('title','Restore');
	this.restoreBtn.innerHTML = svgIconSet['restore'];
	this.divControlBox.appendChild(this.restoreBtn);

	this.prevBtn = document.createElement('button');
	this.prevBtn.setAttribute('class','control');
	this.prevBtn.setAttribute('title','Prev');
	this.prevBtn.innerHTML = svgIconSet['prev'];
	this.divControlBox.appendChild(this.prevBtn);

	this.nextBtn = document.createElement('button');
	this.nextBtn.setAttribute('class','control');
	this.nextBtn.setAttribute('title','Next');
	this.nextBtn.innerHTML = svgIconSet['next'];
	this.divControlBox.appendChild(this.nextBtn);

	// add controls
	this.divRecordBox.appendChild(this.divControlBox);
}
RecordGroupView.prototype.getView = function() {
	return this.divRecordBox;
}

function newRecordsGroup(){
    groupSet[rgcount] = new  RecordsGroup(rgcount);
	groupViewSet[rgcount] = new RecordGroupView(rgcount);
	document.getElementById('content').appendChild(groupViewSet[rgcount].getView());

    groupID = rgcount;
    $(function(){
            grpBoxID =  '#record-box-' + groupID;
            console.log("inside: " + grpBoxID);
            taID =  '#record-ta-' + groupID;
            console.log("resizable: " + grpBoxID);
            console.log("resizable: " + taID);
            $( grpBoxID ).resizable({ handles: "n"});
            $( taID ).resizable({ alsoResize: grpBoxID });
            $( grpBoxID ).draggable();
    });
	rgcount++;
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
    for (var i = 0  ; i < groupSet.length ; i++){
        document.getElementById('record-box-'+ i).style.zIndex = (rgID == i)? 1 : 0;
    }
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


window.onload = initialize;

// vim:set sw=4 ts=4 sts=2 noet:
