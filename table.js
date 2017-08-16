function MyDataTable(idTable, tableData, tableHead, tableFooter, CSSClasses, pageL, pageOpt)
{
	this.tId = idTable;

	if (typeof(tableData)==='undefined') this.data = [];
	else this.data = tableData;

	if (typeof(tableHead)==='undefined') this.thead = null;
	else this.thead = tableHead;

	if (typeof(tableFooter)==='undefined') this.tfooter = null;
	else this.tfooter = tableFooter;
	
	if (typeof(CSSClasses)==='undefined') this.class = "";
	else this.class = CSSClasses;
	
	if (typeof(pageL)==='undefined') this.pageLen = 10;
	else this.pageLen = pageL;
	
	if (typeof(pageOpt)==='undefined') this.pageOptions = [10,25,50,100];
	else this.pageOptions = pageOpt;

	this.res = tableData;
	this.page = 0;
	this.searchID = idTable+"Search";

	this.startTable = function () 
	{
		var optString = "";
		optString = optString + "<div>";

		optString = optString + "<label for='"+this.searchID+"'>Search</label>";
		optString = optString + "<input type='text' id='"+this.searchID+"' name='' onkeyup='"+this.tId+".updateTable()' />";
		optString = optString + "\n<input style='border-radius: 50%' type='button' value='<' onclick='"+this.tId+".prevPage()' />";
		optString = optString + "<label id='"+this.tId+"_Page' > </label>";
		optString = optString + "<input style='border-radius: 50%' type='button' value='>' onclick='"+this.tId+".nextPage()' />";
		optString = optString + "\n<select name='pageLen' id='pageLen'>";

		for (var i =0; i < this.pageOptions.length; i++) {
			if (this.pageLen==this.pageOptions[i]) {
				optString = optString +"\n<option onclick='"+this.tId+".changePageLen("+this.pageOptions[i]+
				")' value='"+i+"' selected>"+this.pageOptions[i]+"</option>";
			} else {
				optString = optString +"\n<option onclick='"+this.tId+".changePageLen("+this.pageOptions[i]+
				")' value='"+i+"'>"+this.pageOptions[i]+"</option>";
			}
		}
		optString = optString + "\n</select>";
		optString = optString + "</div>";


		optString = optString + "<table id='_"+this.tId+"' class='"+this.class+"'>";

		optString = optString +	"</table>";

	    document.getElementById(this.tId).innerHTML = optString;
	    this.updateTable();
	}

	this.printTable = function (dataMatrix) 
	{
		document.getElementById(this.tId+"_Page").innerHTML = (this.page+1)+"-"+(Math.ceil(this.res.length/this.pageLen));

		var tableString = "";
		tableString = tableString +"\n<thead>\n<tr>";
		if (this.thead != null) {
			for (var i = 0; i<= this.thead.length - 1; i++) {
				tableString = tableString +"\n<th>"+ this.thead[i]+"</th>";
			}
		}
		tableString = tableString + "\n</tr>\n</thead>\n<tbody>";
		var i = 0;
		while (i < this.pageLen && i + (this.page*this.pageLen) < dataMatrix.length) {
			var linha = "\n<tr>";
			for (var j = 0; j <= dataMatrix[i+(this.page*this.pageLen)].length - 1; j++) {
				linha = linha + "\n\t<td>" + dataMatrix[i+(this.page*this.pageLen)][j] + "</td>";
			}
			linha = linha + "\n</tr>\n";
			tableString = tableString + linha;
			i++;
		}
		tableString = tableString + "\n</tbody>"
		if (this.tfooter != null) {
			tableString = tableString +"\n<tfooter>";
			tableString = tableString + "\n<tr>\n";
			for(var i = 0; i<= this.tfooter.length - 1; i++){
				tableString = tableString +"\n<td>"+ this.tfooter[i]+"</td>";
			}
			tableString = tableString + "\n</tr>";
			tableString = tableString + "\n</tfooter>";
		}

	    document.getElementById("_"+this.tId).innerHTML = tableString;

	};
	this.nextPageLen = function () 
	{
		var len = this.pageLen;
		for (var i = 0; i < this.pageOptions.length; i++) {
			if (this.pageOptions[i] > this.pageLen){
				len = this.pageOptions[i];
				break;
			}
		}
		this.pageLen = len;
		this.page = 0;
		this.printTable(this.res);
	};
	this.prevPageLen = function () 
	{
		var len = this.pageLen;
		for (var i = this.pageOptions.length; i >= 0; i--) {
			if (this.pageOptions[i] < this.pageLen){
				len = this.pageOptions[i];
				break;
			}
		}
		this.pageLen = len;
		this.page = 0;
		this.printTable(this.res);
	};
	this.changePageLen = function (len) 
	{
		this.pageLen = len;
		this.page = 0;
		this.printTable(this.res);
	};
	this.nextPage = function () 
	{
		if ((1+this.page)*this.pageLen < this.res.length) {
			this.page++;
			this.printTable(this.res);
		}
	};
	this.prevPage = function () 
	{
		if (this.page > 0) {
			this.page--;
			this.printTable(this.res);
		}
	};
	this.updateTable = function () 
	{
		this.page = 0;
		this.res = this.searchData();
		this.printTable(this.res);
	};
	this.searchData = function () 
	{
		//Busca na Tabela
		    var busca = document.getElementById(this.searchID).value;
		    var res = [null];
		    if (busca.length < 1) {
		    	res = this.data;
		    	this.dataFiltrados = res;
		    }else{
		    	//Percorre Linhas <tr>
			    for (var i = 0; i < this.data.length; i++) {
			    	//Percorre Colunas <td>
			    	var t = false;
			    	for (var j = 0; j < this.data[i].length; j++) {
			    		if(this.data[i][j].toLowerCase().indexOf(busca.toLowerCase()) != -1){
			    			t = true;
			    		}
			    	}
				    if (t) {
	    				if (res[0] == null) {
	    					res = [this.data[i]];
	    				} else {
	    					res[res.length] = this.data[i];
	    				}
    				}
			    }
			}
			if (res[0]==null) {res[0]="";}
		    return res;
	};
}