"use strict";

function dropDownFW({
    dropHeaderStyle = "dropHeader",
    dropContentStyle = "dropContent",
    showStyle = "show",
    hideStyle = "hide"
}) {

    window.onclick = function (event) {

        // private function defined inside of another function
        function hide(ele) {
            ele.classList.remove(showStyle);
            ele.classList.add(hideStyle);
        }

        // private function defined inside of another function
        function show(ele) {
            ele.classList.remove(hideStyle);
            ele.classList.add(showStyle);
        }

        function hideSubMenusExcept(ele) {
            var dropContentList = document.getElementsByClassName(dropContentStyle);
            for (var i = 0; i < dropContentList.length; i++) {
                if (ele !== dropContentList[i]) {
                    hide(dropContentList[i]);
                }
            }
        }

        // this is the DOM element (anywhere on page) that was clicked.
        var clickedEle = event.target;
        // console.log("clickedEle on next line");
        // console.log(clickedEle);

        if (clickedEle.classList.contains(dropHeaderStyle)) {

            // The clicked element is a drop down header. From the parent  
            // of the clicked element, get the first dropContent element, 
            // which should be the sub menu.
            var subMenu = clickedEle.parentElement.getElementsByClassName(dropContentStyle)[0];
            // console.log("subMenu is on the next line");
            // console.log(subMenu);

            // Toggle the visibility of the submenu
            if (subMenu.classList.contains(showStyle)) {
                hide(subMenu);
            } else {
                show(subMenu);
            }

            // close down any other submenu (in case one is open). 
            hideSubMenusExcept(subMenu);

        } else {

            // When they click anywhere else on the page (i.e., not a dropHeader).
            // hide all SubMenus
            hideSubMenusExcept(null);
            // console.log("clicked ele is not a MenuHeader");
        }

    };  // window.onclick function 
}