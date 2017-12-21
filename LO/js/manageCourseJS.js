var loName;
var currentSection = 0;
var currentScreen = 0;
var courseContent = new Array();
var topicId;
var self = this;



$(window).load(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('#media-controls').css("visibility", "hidden");
    closeLessonsMenu();
    $.ajax({
        type: "GET",
        url: "xml/course.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find('lo').each(function () {
                loName = $(this).attr("name");


                $(xml).find('obj').each(function () {
                    //console.log($(this).attr("name"));
                    var temp = new Array();
                    $(this).find('page').each(function () {
                        // console.log($(this).text());
                        temp.push(new Array($(this).attr("name"), $(this).text(), $(this).attr("video")));
                    });
                    courseContent.push(new Array("obj", $(this).attr("name"), temp));
                   
                });

                document.getElementById("lessonsMenuUl").innerHTML = "";
                topicId = 0;
                $(xml).find('topic').each(function () {
                    //console.log($(this).attr("name"));
                    topicId++;
                    var temp = new Array();
                    $(this).find('page').each(function () {
                        // console.log($(this).text());
                        temp.push(new Array($(this).attr("name"), $(this).text(), $(this).attr("video")));
                    });
                    courseContent.push(new Array("topic", $(this).attr("name"), temp));

                    document.getElementById("lessonsMenuUl").innerHTML += '<li class="col-lg-4 col-md-6 col-sm-12"><button   id="' + "link" + topicId + '">' + $(this).attr("name") + '</button></li>';



                });

                $(xml).find('sum').each(function () {
                    //console.log($(this).attr("name"));
                    var temp = new Array();
                    $(this).find('page').each(function () {
                        // console.log($(this).text());
                        temp.push(new Array($(this).attr("name"), $(this).text(), $(this).attr("video")));
                    });
                    courseContent.push(new Array("sum", $(this).attr("name"), temp));
                });

                $(xml).find('ques').each(function () {
                    //console.log($(this).attr("name"));
                    var temp = new Array();
                    $(this).find('page').each(function () {
                        // console.log($(this).text());
                        temp.push(new Array($(this).attr("name"), $(this).text(), $(this).attr("video")));
                    });
                    courseContent.push(new Array("ques", $(this).attr("name"), temp));
                    
                });

            });
            

            for (i = 1; i <= topicId; i++) {
                $('#link' + i).click(function (event) {
                    currentScreen = 0;
                    currentSection = Number(event.currentTarget.id.substring(4, 5));
                    //console.log(event.currentTarget.id.substring(4, 5));
                    loadScreen(courseContent[currentSection], 0);
                });
            }

            loadScreen(courseContent[currentSection], 0);
        },
        error: function () {
            alert("An error occurred while processing XML file.");
        }
    });



    function loadScreen(sectionArray) {
        console.log(sectionArray);

        closeLessonsMenu();
        //document.getElementById("lo-path").innerHTML = loName;
        document.getElementById("topic-path").innerHTML = sectionArray[1];
        document.getElementById("pageCount").innerHTML = currentScreen + 1;
        document.getElementById("pagesNumber").innerHTML = sectionArray[2].length;
        document.getElementById("pageTitle").innerHTML = sectionArray[2][currentScreen][1];

        if (currentSection == 0){
            $("#prevTopic").css("pointer-events", "none");
            $("#prevTopic").css("opacity", 0.6);
        } else {
            $("#prevTopic").css("pointer-events", "auto");
            $("#prevTopic").css("opacity", 1);
        }

        if (currentSection == courseContent.length - 1) {
            $("#nextTopic").css("pointer-events", "none");
            $("#nextTopic").css("opacity", 0.6);
        } else {
            $("#nextTopic").css("pointer-events", "auto");
            $("#nextTopic").css("opacity", 1);
        }


        if (currentScreen == 0){
            $("#prevPage").css("pointer-events", "none");
            $("#prevPage").css("opacity", 0.6);
        } else {
            $("#prevPage").css("pointer-events", "auto");
            $("#prevPage").css("opacity", 1);
        }

        if (currentScreen == sectionArray[2].length - 1) {
            $("#nextPage").css("pointer-events", "none");
            $("#nextPage").css("opacity", 0.6);
        } else {
            $("#nextPage").css("pointer-events", "auto");
            $("#nextPage").css("opacity", 1);
        }



        $("#objBtn").removeClass("selected");
        $("#topicBtn").removeClass("selected");
        $("#sumBtn").removeClass("selected");
        $("#quesBtn").removeClass("selected");
        console.log(sectionArray[0]);
        $("#" + sectionArray[0] + "Btn").addClass("selected");

        loadVideo(sectionArray);
    }



    function loadVideo(sectionArray) {
        $('#media-controls').css("visibility", "hidden");
        try {
            mediaPlayer.removeEventListener('timeupdate', updateProgressBar, false);
        } catch (err) {
        }

        jQuery('#myContentArea').load('video.html',
            function () {
                document.getElementById("videoDiv").innerHTML = "";
                document.getElementById("videoDiv").innerHTML = '<video id="vid" poster="videos/' + String(sectionArray[2][currentScreen][0]) + '.jpg?v1" controls width="100%"><source src= "videos/VTC-Cond-M01L03T01T01P01.mp4" type= "video/mp4" ><source src= "videos/VTC-Cond-M01L03T01T01P01.webm" type= "video/webm" ><source src= "videos/VTC-Cond-M01L03T01T01P01.ogv" type= "video/ogg" > </video > ';
                
                $('#media-controls').css("visibility", "visible");
                initialiseMediaPlayer();
            }
        );
    }


    
    

    $('#nextPage').click(function (event) {
       
        currentScreen++;
        
        loadScreen(courseContent[currentSection]);
    });

    $('#prevPage').click(function (event) {
        currentScreen --;
        loadScreen(courseContent[currentSection]);
    });

    $('#nextTopic').click(function (event) {
        currentSection++;
        currentScreen = 0;
        loadScreen(courseContent[currentSection]);
    });

    $('#prevTopic').click(function (event) {
        currentSection--;
        currentScreen = 0;
        loadScreen(courseContent[currentSection]);
    });

    $('#objBtn').click(function (event) {
        currentSection = 0;
        currentScreen = 0;
        loadScreen(courseContent[currentSection]);
    });

    $('#sumBtn').click(function (event) {
        currentSection = courseContent.length - 2;
        currentScreen = 0;
        loadScreen(courseContent[currentSection]);
    });

    $('#quesBtn').click(function (event) {
        currentSection = courseContent.length - 1;
        currentScreen = 0;
        loadScreen(courseContent[currentSection]);
    });


});



$(window).resize(function () {
    if ($(window).width() <= 768) {
        $("#lessonsMenu").css("visibility", "hidden");
        $("#smallMenuBtn").addClass("collapsed");
        $("#myNavbar").removeClass("in");
        $("#topicBtn").removeClass("selected")
        $("#lessonsMenu").css("opacity", 0);
        $("#lessonsMenu").height("0px")
        $("#lessonsMenu").css("visibility", "hidden");
    }

    if ($("#lessonsMenu").height() > 1) {

        $("#lessonsMenu").height("auto");
    }

});




function toggleLessonsMenu() {
    var h;
    
    if ($("#lessonsMenu").height() > 1) {
        closeLessonsMenu();
    } else {
        //$("#topicBtn").addClass("selected");
        $("#lessonsMenu").css("opacity", 1);
        //$("#lessonsMenu").css("height","max-content");
        $("#lessonsMenu").height("auto");
        h = $("#lessonsMenu").height();
        $("#lessonsMenu").height("0px");
        $("#lessonsMenu").height(h)
        $("#lessonsMenu").css("visibility", "visible");
    }

}

function closeLessonsMenu() {
    $("#topicBtn").removeClass("selected");
    $("#lessonsMenu").css("opacity", 0);
    $("#lessonsMenu").height("0px")
    $("#lessonsMenu").css("visibility", "hidden");
}




$(document).click(function (event) {
    if (!$(event.target).closest('#smallMenuBtn').length &&
        !$(event.target).closest('#myNavbar').length &&
        !$(event.target).closest('#lessonsMenu').length &&
        $(window).width() <= 768) {

        $("#lessonsMenu").css("visibility", "hidden");
        $("#smallMenuBtn").addClass("collapsed");
        $("#myNavbar").removeClass("in");
        $("#topicBtn").removeClass("selected");
        $("#lessonsMenu").css("opacity", 0);
        $("#lessonsMenu").height("0px")
        $("#lessonsMenu").css("visibility", "hidden");

    }

});


