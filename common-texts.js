
// TxtPack prototype
function TxtPack(){
    this.categories = [];
    this.txtGroupSet = {};
}
TxtPack.prototype.categoryExists = function(catg){
	for (var i = 0, len = this.categories.length; i < len; i++) {
		if (this.categories[i] === catg){
			return true;
		} 
	}
	return false;
}
TxtPack.prototype.addCategoryIfNotExists = function(category){
	if (! this.categoryExists(category)){
		this.categories.push(category);
		this.txtGroupSet[category] = new TxtGroup(category);
	};
}
TxtPack.prototype.addTxtToCat = function(txt, category){
	this.addCategoryIfNotExists(category);
	this.txtGroupSet[category].addTxt(txt);
}

txtPack = new TxtPack();
tpvSet = [];
// TxtGroup prototype
function TxtGroup(name){
    this.name = name;
    this.id = name.replace(/\s/g,'_');
	console.log("Group ID: " + this.id);
    this.txtSet = [];
}

TxtGroup.prototype.addTxt = function (txt){
    this.txtSet.push(txt);
};
// end TxtGroup prototype

function TxtGroupView(txtGroup){
	this.groupBox = document.createElement('div') ;
	this.groupBox.setAttribute('class', 'txt-pack-box') ;
	this.groupBox.setAttribute('id', 'txt-pack-box-' + txtGroup.id) ;

	this.nameBox = document.createElement('h3') ;
	this.nameBox.setAttribute('class', 'txt-pack-name');
	this.nameBox.setAttribute('id', 'txt-pack-name-' + txtGroup.id ) ;
	this.nameBox.innerText = txtPack.name;
	this.groupBox.appendChild(this.nameBox) ;

	this.txtSetBox = document.createElement('div');
	this.txtSetBox.setAttribute('class', 'txtset-box');
	this.txtSetBox.setAttribute('id', 'txtset-box-' + txtGroup.id) ;
	this.groupBox.appendChild(this.txtSetBox) ;

	this.pgBoxSet = []

	if (txtGroup.txtSet != null ){
		var ntxt = txtGroup.txtSet.length;
		for (var i = 0; i < ntxt; i++) {
			this.pgBoxSet[i] = document.createElement('div');
			var pgid  ='pg-box-'+ txtGroup.id +'-'+ i;
			var txtid ='pg-txt-'+ txtGroup.id +'-'+ i;
			this.pgBoxSet[i].setAttribute('id', pgid);
			var pgclasses = 'pg-box ';
			pgclasses += (i%2 > 0 )? 'pg-odd':'pg-even';
			console.log('pg classes : ' + pgclasses)
			this.pgBoxSet[i].setAttribute('class', pgclasses);
			this.pgBoxSet[i].setAttribute('onclick','copyToClipboard("'+txtid+'")');
			this.pgBoxSet[i].innerHTML = [
					'<span class="pg-num">',i,'</span>',
					'<div id="',txtid,'" class="pg-txt">'
					,txtGroup.txtSet[i],'</div>'
            ].join("");
			this.txtSetBox.appendChild(this.pgBoxSet[i]);
		}
	}
}
TxtGroupView.prototype.makeToggleable = function(){
	var indocHeaderID = '#' + this.nameBox.getAttribute('id');
	var indocContentsID = '#' + this.txtSetBox.getAttribute('id');
	$(indocHeaderID).click(function (){
			$(indocContentsID).toggle('blind', 500);
	
	});
}

function copyToClipboard(pgID){
    var r = new Range();
	pgBox = document.getElementById(pgID); // paragraph div
    r.selectNode(pgBox);
    document.getSelection().addRange(r);
	document.execCommand("copy");
	console.log("Copy paragraph " + pgID  );
}

function createFromTextArea(taID){
    var txt = document.getElementById(taID).value;
	//reset txtPack
	if (txtPack.categories.length > 0){
		txtPack.categories = [];
		txtPack.txtPackSet = {};
		document.getElementById('samples-box').innerHTML = '';
	}
    parse(txt, txtPack);
	var nc = txtPack.categories.length;
	console.log('Found '+ nc + ' categories' );
	for (var i = 0 ; i < nc; i++ ){
		var cname = txtPack.categories[i];
		console.log('Generate view for category '+ cname );
		var gv = new TxtGroupView(txtPack.txtGroupSet[cname]);
		document.getElementById('samples-box').appendChild(gv.groupBox);
		gv.makeToggleable();
	}
}

function parse(text, txtPack){
	var sp = text.split('\n');
	var samplesBox = document.getElementById('samples-box');
	var count = 0;
    var catRegexp = /(?:^[\*#]+)(?:\s*)(([\w\/-_]*|\s*(?=\w))*)(?:\s*)(?:[\*#]*$)/g;
    var catCount = 0;
    var lastCatgFound = "";
    var isCatergory = function(txtLine){
        catRegexp.exec('');
        match = catRegexp.exec(txtLine);
        if ( match != null ){
            return true;
        } else {
            return false;
        }
    }
    var parseCatgFromLine = function(txtLine){
        catRegexp.exec('');
        var match = catRegexp.exec(txtLine);
		console.log("Category match : " + match);
        if ( match != null ){
            return match[1];
        } 
    }
	console.log('nlines' + sp.length)
	for(var i = 0, l = sp.length ; i < l ; i++ ){
		console.log('checking: ' + sp[i])
		if(sp[i].length > 0 ) {
            if (isCatergory(sp[i])){
                var lastCatgFound = parseCatgFromLine(sp[i]);
				console.log("Last Category Found :("+lastCatgFound +")");
                catCount++;
            } else {
                count++;
                txtPack.addTxtToCat(sp[i], lastCatgFound);
            }
		}
	}

}
