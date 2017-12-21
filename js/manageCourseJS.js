$(document).ready(function () {
    $("body").append("<div id='treeboxbox_tree' style='display:none'>hello world</div>");
    var Coursetree = new dhtmlXTreeObject("treeboxbox_tree", "100%", "100%", 0);
    
    Coursetree.setSkin('dhx_skyblue');
    Coursetree.setImagePath("theme/codebase/imgs/dhxtree_skyblue/");
    Coursetree.enableSmartXMLParsing(true);
    Coursetree.loadXMLString(myXMLTree);
    var RootLevelsIds = new Array();
    RootLevelsIds = Coursetree.getSubItems("Course_" + courseId).split(',');
   

	var startPage = "LO" + Coursetree.getAttribute(RootLevelsIds[0], "myID") + "/index.html";
	
	$("#btn_start_topic").attr("href", startPage);

});


function startCourse(){
	window.location.href = 'LO/page.html';
}
