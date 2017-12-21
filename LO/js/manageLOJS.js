var topic = new Array ();

$(document).ready(function () {
    $("body").append("<div id='treeboxbox_tree' style='display:none'>hello world</div>");
    var Coursetree = new dhtmlXTreeObject("treeboxbox_tree", "100%", "100%", 0);

    Coursetree.setSkin('dhx_skyblue');
    Coursetree.setImagePath("../theme/codebase/imgs/dhxtree_skyblue/");
    Coursetree.enableSmartXMLParsing(true);
    Coursetree.loadXMLString(myXMLTree);

    var LevelChildsIds = new Array();
    LevelChildsIds = Coursetree.getSubItems("Level_" + levelId).split(',');


    document.title = courseName;
    $("#map_courseName").html(courseName);
    $("#map_courseName").prop("href", "../index.html");

    //$("#map_TopicName").html(levelName);
    //$("#map_TopicName").prop("href", "index.html");

    $("#H_lessonName").html(levelName);


    $("#MenulessonsList").html("");
    $("#topMenuLesson").html("");
    var lessonCount = 0;
    var sumCount = 0;
    var QCount = 0;
    var startPage = "";

    for (var i = 0; i < LevelChildsIds.length; i++)//// links for tobics
    {
        //console.log("item_id=" + Coursetree.getSubItems(RootLevelsIds[i]));///level الدروس
        var str = "";
        if (Coursetree.getAttribute(LevelChildsIds[i], "itemType") == "Level") { /////ده للدروس 
            var ChildPages = new Array();
            ChildPages = Coursetree.getSubItems(LevelChildsIds[i]).split(',');
            var firstPage = ChildPages[0];
            if (firstPage != "") {
                if (startPage == "")
                {
                    startPage = "'page" + Coursetree.getAttribute(firstPage, "myID").split('_')[1] + ".html'";
                    $("#btn_start_topic").attr("onclick", "location.href=" + startPage + "");
                }

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
    if (lessonCount <= 0)
    {
        $("#MenulessonsList").remove();
    }
    if (sumCount <= 0)
    {
        $("#topMenuQues").remove();
    }
    if(QCount<=0)
    {
        $("#topMenuSummary").remove();
    }
    /////////////////////////get all topic objectives////////////////////////////
    if (courseDir == "ltr")
    {
        $("#objectiveHeader").html("You will learn the following");
    }
    else
    {
        $("#objectiveHeader").html("سوف نتعلم من هذه الوحدة الآتي");
    }

    $("#MenuObjectivesList").html("");
    for (var i = 0; i < topicObjectives.length ; i++)
    {
        var str = "<li><a>" + topicObjectives[i]["ObjectName"] + "</a></li>";
        $("#MenuObjectivesList").append(str);
    }
    
});
