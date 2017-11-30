var pgSet = [];

var catgSet = { 
    categories: [],
    packSet:{ }
    packViewSet:{ }
    var categoryExists = function(catg){
        for (var i = 0, len = categories.length; i < len; i++) {
            if (categories[i] === catg){
                return true;
            } 
        }
        return false;
    }

    var addCategory = function(catg){
        if (! categoryExists(catg)){
            categories.push(catg);
            catgSet[catg] = new TxtPack(catg);
        };
    }
    var addTxtToCat = function(txt, catg){
        if (! categoryExists(catg)){
            addCategory(catg);
        };
        catgSet[catg].addTxt(txt);
    }
};

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

    this.txtSetBox = document.createElement('div') ;
    this.txtBox.setAttribute('class', 'txtset-box) ;
    this.txtBox.setAttribute('id', 'txtset-box-' + txtPack.name) ;

    this.pgBoxSet = []
    
    var ntxt = txtPack.txtSet.length;
    for (var i = 0; i < ntxt; i++) {

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
    parse(txt, grpSetComTxt);
}

function parse(text, catgSet){
	var sp = text.split('\n');
	var samplesBox = document.getElementById('samples-box');
	var count = 0;
    var catRegexp = /(?:^[\*#]+)(?:\s*)((\w*|\s*(?=\w))*)(?:\s*)(?:[\*#]*$)/g;
    var catCount = 0;
    var lastCatgFound = "";
    var isCatergory = function(txtLine){
        console.log("checking for Category: "+ txtLine);
        match = catRegexp.exec(txtLine);
        if ( match != null ){
            console.log("New Category:("+ match[1]+")");
            return true;
        } else {
            return false;
        }
    }
    var parseCatgFromLine = function(txtLine){
        match = catRegexp.exec(txtLine);
        if ( match != null ){
            console.log("Found Category:("+ match[1]+")");
            return match[1];
        } 
    }
	for(var i = 0, l = sp.length ; i < l ; i++ ){
		if(sp[i].length > 0 ) {
            if (isCatergory(sp[i])){
                lastCatgFound = parseCatgFromLine(sp);
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
