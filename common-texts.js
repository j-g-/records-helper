
function CategorySet(){
    this.categories = [];
    this.txtPackSet = {};
}
CategorySet.prototype.categoryExists = function(catg){

	for (var i = 0, len = this.categories.length; i < len; i++) {
		if (this.categories[i] === catg){
			return true;
		} 
	}
	return false;
}
CategorySet.prototype.addCategoryIfNotExists = function(catg){
	if (! this.categoryExists(catg)){
		this.categories.push(catg);
		this.txtPackSet[catg] = new TxtPack(catg);
	};
}
CategorySet.prototype.addTxtToCat = function(txt, catg){
	this.addCategoryIfNotExists(catg);
	this.txtPackSet[catg].addTxt(txt);
}

categorySet = new CategorySet();
tpvSet = [];

function TxtPack(name){
    this.name = name;
    this.txtSet = [];
}

TxtPack.prototype.addTxt = function (txt){
    this.txtSet.push(txt);
};

function TxtPackView(txtPack){
	this.packBox = document.createElement('div') ;
	this.packBox.setAttribute('class', 'txt-pack-box') ;
	this.packBox.setAttribute('id', 'txt-pack-box-' + txtPack.name) ;

	this.nameBox = document.createElement('div') ;
	this.nameBox.setAttribute('class', 'txt-pack-name') ;
	this.nameBox.setAttribute('id', 'txt-pack-name-' + txtPack.name ) ;
	this.nameBox.innerText = txtPack.name;
	this.packBox.appendChild(this.nameBox) ;

	this.txtSetBox = document.createElement('div') ;
	this.txtSetBox.setAttribute('class', 'txtset-box');
	this.txtSetBox.setAttribute('id', 'txtset-box-' + txtPack.name) ;
	this.packBox.appendChild(this.txtSetBox) ;

	this.pgBoxSet = []

	if (txtPack != null ){
		var ntxt = txtPack.txtSet.length;
		for (var i = 0; i < ntxt; i++) {
			this.pgBoxSet[i] = document.createElement('div');
			var pgid ='pg-box-'+ txtPack.name+'-'+ i;
			var txtid ='pg-txt-'+ txtPack.name+'-'+ i;
			this.pgBoxSet[i].setAttribute('id', pgid);
			var pgclasses = 'pg-box ';
			pgclasses += (i%2 > 0 )? 'pg-odd':'pg-even';
			console.log('pg classes : ' + pgclasses)
			this.pgBoxSet[i].setAttribute('class', pgclasses);
			this.pgBoxSet[i].setAttribute('onclick','copyToClipboard("'+txtid+'")');
			this.pgBoxSet[i].innerHTML = [
                '<span class="pg-num">',i,'</span>',
                '<span id="',txtid,'" class="pg-txt">',txtPack.txtSet[i],'</span>'
            ].join("");
			this.txtSetBox.appendChild(this.pgBoxSet[i]);
		}
	}
}

function copyToClipboard(pgID){
    var r = new Range();
	pgBox = document.getElementById(pgID); //text area
    r.selectNode(pgBox);
    document.getSelection().addRange(r);
	document.execCommand("copy");
	console.log("Copy paragraph " + pgID  );
}

function createFromTextArea(taID){
    var txt = document.getElementById(taID).value;
    parse(txt, categorySet);
	var nc = categorySet.categories.length;
	console.log('Found '+ nc + ' categories' );
	for (var i = 0 ; i < nc; i++ ){
		var cname = categorySet.categories[i];
		console.log('Generate view for category '+ cname );
		var tv = new TxtPackView(categorySet.txtPackSet[cname]);
		document.getElementById('samples-box').appendChild(tv.packBox);
	}
}

function parse(text, catgSet){
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
                catgSet.addTxtToCat(sp[i], lastCatgFound);
            }
		}
	}

}
                //var np = document.createElement('div');
                //var npclass = ((count%2) > 0 )? 'odd': 'even';
                //np.setAttribute('class', 'sample-pg '+ 'sample-pg-'+ npclass);
                //np.setAttribute('id', 'sample-' + count);
                //np.setAttribute('onclick', 'copyToClipboard(' + count + ')');
                //np.innerText = sp[i];
                //samplesBox.appendChild(np);
