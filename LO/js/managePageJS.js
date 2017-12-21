function getParentWidth(_id) {
    var width = $("#" + _id).parent().width();

    return width;
}

function getParentHeight(_id) {
    var height = $("#" + _id).parent().height();
    return height;
}

function chnageDimentions(_id, _wd, _hg) {

    $("#" + _id).width(_wd);
    $("#" + _id).height(_hg);
    $("#" + _id).parent().height(_hg);

    reArrangeMain($("#divPreview"));
   // resizeContiner("myContin");
    //alert($("#" + _id).parent().height());


}

function controlMovie(flashMovie, _status) {
    alert(flashMovie);
    document.getElementById(flashMovie).sndToAS(_status);
}


$(document).ready(function () {
    $("body").append("<div id='treeboxbox_tree' style='display:none'>hello world</div>");
    var Coursetree = new dhtmlXTreeObject("treeboxbox_tree", "100%", "100%", 0);

    Coursetree.setSkin('dhx_skyblue');
    Coursetree.setImagePath("../theme/codebase/imgs/dhxtree_skyblue/");
    Coursetree.enableSmartXMLParsing(true);
    Coursetree.loadXMLString(myXMLTree);

    var LevelChildsIds = new Array();
    LevelChildsIds = Coursetree.getSubItems("Level_" + levelId).split(',');


    var PageParentId = Coursetree.getParentId(pageTreeId);///من اللمكن ان تتغير على حسب الtree

    document.title = courseName;
    $("#map_courseName").html(courseName);
    $("#map_courseName").prop("href","../index.html");

    $("#map_TopicName").html(levelName);
    $("#map_TopicName").prop("href", "index.html");

    
    //$("#H_lessonName").html(Coursetree.getAttribute(pageTreeId, "text"));
    $("#H_lessonName").html(Coursetree.getAttribute(PageParentId, "text"));

    $("#myContin").html("<div id=\"divPreview\">" + pageContent + "</div>");

    $("#MenulessonsList").html("");
  
    $("#topMenuLesson").html("");
    var lessonCount = 0;
    var sumCount = 0;
    var QCount = 0;

    for (var i = 0; i < LevelChildsIds.length; i++)//// links for subtobics
    {
        //console.log("item_id=" + Coursetree.getSubItems(RootLevelsIds[i]));///level الدروس
        var str = "";
        if (Coursetree.getAttribute(LevelChildsIds[i], "itemType") == "Level") { /////ده للدروس 
            var ChildPages = new Array();
            ChildPages = Coursetree.getSubItems(LevelChildsIds[i]).split(',');
            var firstPage = ChildPages[0];
            if (firstPage != "") {
                str = "<li><a href='page" + Coursetree.getAttribute(firstPage, "myID").split('_')[1] + ".html'>" + Coursetree.getAttribute(LevelChildsIds[i], "text") + "</a></li>";
                $("#MenulessonsList").append(str);
                //////////////////////build top menu///////////////////////

                if (Coursetree.getAttribute(LevelChildsIds[i], "myType") == "-1" || Coursetree.getAttribute(LevelChildsIds[i], "myType") == "1")//للشرح
                {
                    $("#topMenuLessonName").html((courseDir == "ltr" ? "Lessons" : "دروس الوحدة") + " <span class=\"caret\">");
                    $("#topMenuLesson").append(str);
                    lessonCount++;
                }
                else if (Coursetree.getAttribute(LevelChildsIds[i], "myType") == "2")//////Question
                {
                    var strQ = "<a href='page" + Coursetree.getAttribute(firstPage, "myID").split('_')[1] + ".html'>" + (courseDir == "ltr" ? "Question" : "الأسئلة") + "</a>";
                    $("#topMenuQues").html(strQ);
                    sumCount++;
                }
                else if (Coursetree.getAttribute(LevelChildsIds[i], "myType") == "3")//////Summary
                {
                    var strS = "<a href='page" + Coursetree.getAttribute(firstPage, "myID").split('_')[1] + ".html'>" + (courseDir == "ltr" ? "Summery" : "الملخص") + "</a>";
                    $("#topMenuSummary").html(strS);
                    QCount++;
                }

            }
            /////////////////////////////////////////////////////////////
        }
        else if (Coursetree.getAttribute(LevelChildsIds[i], "itemType") == "Page")
        {
            str = "<li><a href='page" + Coursetree.getAttribute(LevelChildsIds[i], "myID").split('_')[1] + ".html'>" + Coursetree.getAttribute(LevelChildsIds[i], "text") + "</a></li>";
            $("#MenulessonsList").append(str);
        }        
    }

    if (lessonCount <= 0) {
        $("#MenulessonsList").remove();
    }
    if (sumCount <= 0) {
        $("#topMenuQues").remove();
    }
    if (QCount <= 0) {
        $("#topMenuSummary").remove();
    }
    //////////////////////////get page count and index//////////////////////////////////////

    var allParentChilds = Coursetree.getAllSubItems(PageParentId).split(',');
    var allPagesInCurrentLevel = new Array();

    for (var i = 0; i < allParentChilds.length; i++)
    {
        if (Coursetree.getAttribute(allParentChilds[i], "itemType") == "Page")
        {
            allPagesInCurrentLevel.push(allParentChilds[i]);
        }
    }
    var currentPageIndex = allPagesInCurrentLevel.indexOf(pageTreeId);

    $("#pageCount").html((courseDir == "ltr" ? "page " : "") + (currentPageIndex + 1) + (courseDir == "ltr" ? " from " : " من ") + allPagesInCurrentLevel.length + "");

    if ((currentPageIndex) < allPagesInCurrentLevel.length - 1)
    {
        $("#btn_nextPage").attr("onclick", "location.href='page" + allPagesInCurrentLevel[currentPageIndex + 1].split('_')[1] + ".html'")
    }
    else{
        $("#btn_nextPage").prop('disabled', true);
    }

    if(currentPageIndex>0)
    {
        $("#btn_prevPage").attr("onclick", "location.href='page" + allPagesInCurrentLevel[currentPageIndex - 1].split('_')[1] + ".html'")
    }
    else
    {
        $("#btn_prevPage").prop('disabled', true);
    }
    //////////////////////////////////////////////////////////////////
    var currentSubTopicIndex = LevelChildsIds.indexOf(PageParentId);

    if ((currentSubTopicIndex) < LevelChildsIds.length - 1) {
         var ChildPages = new Array();
         ChildPages = Coursetree.getSubItems(LevelChildsIds[currentSubTopicIndex + 1]).split(',');
         var firstPage = ChildPages[0];
         if (firstPage != "") {
             $("#btn_nextSubTopic").attr("onclick", "location.href='page" + Coursetree.getAttribute(firstPage, "myID").split('_')[1] + ".html'")
         }
         else {
                $("#btn_nextSubTopic").prop('disabled', true);
            }
    }
    else {
        $("#btn_nextSubTopic").prop('disabled', true);
    }

    if (currentSubTopicIndex > 0) {

        var ChildPages = new Array();
        ChildPages = Coursetree.getSubItems(LevelChildsIds[currentSubTopicIndex - 1]).split(',');
        var firstPage = ChildPages[0];
          if (firstPage != "") {
              $("#btn_prevSubTopic").attr("onclick", "location.href='page" + Coursetree.getAttribute(firstPage, "myID").split('_')[1] + ".html'")
          }
          else {
              $("#btn_nextSubTopic").prop('disabled', true);
          }
    }
    else {
        $("#btn_prevSubTopic").prop('disabled', true);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////
   

    //var isPlayed = false;
    $(".parentFLASH").each(function () {
        if($(this).attr("havePlayer")=="true")
        {
            $(this).find(".flashPlayer").html("");
            var flashMovie = $(this).find("object").get(0);  
       }
    });

  
    /////////////////////////////////////////////////////////

    //$(".divTAB").tabs();
    //$(".TempClass").remove();
    //$(".classTemp").remove();
    //$("#panelSetting").remove();
    //$(".divACC").accordion({
    //    collapsible: true,
    //    autoHeight: true,
    //    heightStyle: "content"
    //});
   
});

$(window).load(function () {
    $("object").each(function () {
        if ($(this).is(":visible")) {
            var flashMovie = $(this).attr("id");
           // controlMovie(flashMovie, 'pause');
            document.getElementById(flashMovie).StopPlay();
            // $(this).get(0).Play();
            //Play(flashMovie);
            return;
        }
    });
    //resizeContiner("divPreview");
});

//function resizeContiner(_id)
//{
//    var maxWidth = 0;
//    var maxHeight = 0;
//    $("#" + _id)
//  .children()
//    .each(function () {
//        var currentTop = parseInt($(this).css("top").replace("px", ""));
//        if ($(this).height() + currentTop > maxHeight) {
//            maxHeight = $(this).height() + currentTop;
//        }

//        if ($(this).width() + $(this).position().left > maxWidth) {
//            maxWidth = $(this).width() + $(this).position().left;
//        }
//    });
//   // if ($("#" + _id).height() <= maxHeight) {
//    $("#" + _id).height(maxHeight + 10);
//    console.log($("#" + _id).height());
//   // }
//}
//$.noConflict();
//var mylist;
//var jql= jQuery.noConflict( true );
//jql( document ).ready(function(  ) {
//  // Code that uses jQuery's $ can follow here.
  
  

//    //mylist = new arrangedList(jql("#divPreview"), jql("#myContin"));
//    //mylist.sortByTop();
//    //mylist.Arrange();

//});
// Code that uses other library's $ can follow here.


/////////////////////////////////////////////////////////////////////////////////////////