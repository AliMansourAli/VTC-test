var LargeDevice = 1140;//Large devices Desktops (≥1200px)

var MediumDevice = 970; //Medium devices Desktops (≥992px)

var SmallDevice = 750;//Small devices Tablets (≥768px)



function arrangedList(parentDiv/*Jquery Object*/, container)
{
    this.parentDiv = parentDiv;   
    this.sortedList = null;
    this.myContainer = container
}

arrangedList.prototype.sortByTop = function (MyDir, DirOption)
{
    if (MyDir == undefined || MyDir == "") {
        MyDir = "left";
    }
    if (DirOption == undefined || DirOption == "") {
        DirOption = "min";
    }
    this.myDir = MyDir;
    this.dirOption = DirOption;

    this.childs = this.parentDiv.children();
    for (i = 0; i < this.childs.length ; i++) {
        var child=$(this.childs[i]);
        child.attr("myStyle",child.attr("style"));
    }

    this.sortedList = this.childs.sort(function (a, b) {

        var positionA = $(a).position();
        var positionB = $(b).position();
        if (positionA.top > positionB.top ||  positionA.top < positionB.top)
        {
            return positionA.top > positionB.top
        }
        else //////////////////if positionA.top == positionB.top
        {
            if (MyDir == "left" && DirOption == "min") {
                return positionA.left > positionB.left;
            }
            else
            {
                return positionA.left < positionB.left;
            }
        }       
    });
}

arrangedList.prototype.Arrange = function ()
{
    var _width = $(this.myContainer).actual("outerWidth")//.replace(/[^\d.]/g, '');//$(".container").css("width").replace(/[^\d.]/g, '');
   
        if(_width>=LargeDevice)//////////normal case
        { 
           /* for (i = 0; i < this.sortedList.length ; i++) {
                var child = $(this.sortedList[i]);
                child.attr("style", child.attr("myStyle"));
            }*/
            this.myContainer.find("div").each(function (e) {
                if($(this).attr("myStyle")!=undefined)
                {
                    $(this).attr("style", $(this).attr("myStyle"));
                }
                if ($(this).hasClass("tempRelativeContainer")) {

                    $(this).removeClass("tempRelativeContainer")
                }
            });
        }
        else// if (_width >= MediumDevice)
        {
            $(".divContainer").each(function (e) {
                $(this).addClass("tempRelativeContainer");
            });
            var pervTop = 0;
            var prevLeft = 0;
            var merg_top = 10;
            var merg_left = 10;

            var topPadding = this.myContainer.css("padding-top").replace(/[^\d.]/g, '');
            var leftPadding = this.myContainer.css("padding-left").replace(/[^\d.]/g, '');

            var index = 0;
            prevTop = merg_top;// + Number(topPadding);
           
            prevLeft = merg_left;
            var maxHeight = 0;          

            //console.log(_width);

            var globalHeight = 0;

            for (i = 0; i < this.sortedList.length ; i++) {
                var child = $(this.sortedList[i]);

                if (/*child.is(":visible")*/true) {
                   

                    if (prevLeft + child.actual('outerWidth') >= _width - merg_left)
                    {                        
                       // if (prevLeft == merg_left)////this check for resizing object
                        if (child.outerWidth() + merg_left >= _width - merg_left)//////////////this check for resizing big object
                        {
                            var prevOuterWidth = child.outerWidth();
                            resizeElement(child);
                            ///////////////////////check for compound///////////////////////////
                           if (prevOuterWidth!=child.attr("outerWidth"))
                           {
                              reArrangeChild(child);
                           }
                        }
                        else ///reaarang div only 
                        {
                            prevTop += merg_top + maxHeight;
                            prevLeft = merg_left;
                        }                       
                      
                        maxHeight = 0;                       
                    }

                    if (child.actual('outerHeight') > maxHeight) {
                        maxHeight = child.actual('outerHeight');
                    }

                    child.css({ top: prevTop });
                    child.css({ left: prevLeft });


                    if (i + 1 < this.sortedList.length) {
                        var tempChild = $(this.sortedList[i + 1]);
                        var tempPos = child.position();

                        
                        if (tempPos.left + merg_left + tempChild.actual('outerWidth') >= _width) {
                            //prevTop += merg_top + child.outerHeight();                          
                            prevLeft = merg_left;
                            prevTop += merg_top + maxHeight;
                            
                        } else {
                            prevLeft += merg_left + child.actual('outerWidth');

                        }
                    }
                    index++;

                    //if (child.attr("id") == "2_10_31489031452587508903")
                    //{
                    //    console.log(child.innerHeight());
                    //    console.log(child.actual( 'outerHeight', { includeMargin : true }));
                    //}

                    if (globalHeight < child.position().top + child.actual('outerHeight', { includeMargin: true }) + merg_top) {
                        //console.log("child.position().top= " + child.position().top + " child.outerHeight()= " + child.outerHeight() + " merg_top= " + merg_top)
                        //console.log(globalHeight);
                        globalHeight = child.position().top + child.actual('outerHeight', { includeMargin: true }) + merg_top;
                        //this.myContainer.css("height", globalHeight);

                    }


                }
            }
            //console.log(this.myContainer.attr("id")+"  "+ globalHeight);
           
            this.myContainer.height(globalHeight);

            if (this.myContainer.attr("id") == "tabs-2_10_2904281452587340428")
            {
                console.log("this.myContainer = " + this.myContainer.outerHeight() + "     " + globalHeight);
            }
        }
        //alert($(this.sortedList[i]).attr("myStyle"));
    
}

function resizeElement(child)
{   
    child.css("width", "95%");
    if (child.hasClass("parentIMG"))
    {
        child.height("auto");
    }
    child.attr("outerWidth", child.outerWidth());
    //child.css("height", "auto");
}

function reArrangeChild(child)
{
    var TmaxHeight = 0;
    if (child.hasClass("parentTAB")) {       
        child.children(".divTAB").children(".ui-tabs-panel").each(function (e) {
            var mylistChild = new arrangedList($(this), $(this));
            mylistChild.sortByTop();
            mylistChild.Arrange();
           
            if (TmaxHeight < $(this).actual('outerHeight', { includeMargin: true })) {
                TmaxHeight = $(this).actual('outerHeight', { includeMargin: true });
            }
        });
       
       
        child.children("ul").each(function (e) {
           
            TmaxHeight += $(this).actual('outerHeight', { includeMargin: true });
        });
       
        child.height(TmaxHeight);
        console.log(child.actual('outerHeight', { includeMargin: true }))
    }
    else if (child.hasClass("parentACC"))
    {
        child.children(".divACC").children(".ui-accordion-content").each(function (e) {
            var mylistChild = new arrangedList($(this), $(this));
            mylistChild.sortByTop();
            mylistChild.Arrange();
        })
    }

    return true;
}

var mylist;

$(function () {
    $(".ui-rotatable-handle").remove();
    $(".ui-resizable-handle").remove();
    $(".ui-draggable").remove();


    $(".divTAB").tabs();
    $(".TempClass").remove();
    $(".classTemp").remove();
    $("#panelSetting").remove();
    $(".divACC").accordion({
        collapsible: true,
        autoHeight: true,
        heightStyle: "content"
    });
       
    mylist = new arrangedList($("#divPreview"), $("#myContin"));
    mylist.sortByTop();
    mylist.Arrange();
    reArrangeMain($("#divPreview"));

    $("*").click(function () {       
        mylist.Arrange();
    });
});

$(window).load(function()
{
    //mylist = new arrangedList($("#divPreview"), $("#myContin"));
    //mylist.sortByTop();
    mylist.Arrange();
    reArrangeMain($("#divPreview"));
})

$(window).resize(function () {
    mylist.Arrange();
    reArrangeMain($("#divPreview"));
});

function reArrangeMain(child) {
    var TmaxHeight = 0;
    child.children("*").each(function (e) {
        if (TmaxHeight < $(this).actual('outerHeight', { includeMargin: true }) + $(this).position().top) {
            TmaxHeight = $(this).actual('outerHeight', { includeMargin: true }) + $(this).position().top;
        }
    });
    console.log(TmaxHeight)
    child.height(TmaxHeight+10);
}