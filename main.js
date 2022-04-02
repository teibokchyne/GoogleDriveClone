

(function(){
    
    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddTextFile = document.querySelector("#addTextFile");
    let divbreadcrumb = document.querySelector("#breadcrumb");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let aRootPath = divbreadcrumb.querySelector("a[purpose='path']");

    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");

    let resources = [];
    let rid = -1;
    let cfid = -1;

    aRootPath.addEventListener("click", viewFolderFromPath);
    btnAddFolder.addEventListener("click",addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);

    function addFolder(){
        let rname = prompt("Enter folder's name");
        if(!rname){
            alert("Empty name not valid");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists == true){
            alert(rname + "is already exists");
            return;
        }

        let pid = cfid;
        rid++;
        addFolderHTML(rname, rid, pid);
        resources.push({
            rid : rid,
            rname: rname,
            rtype: "folder",
            pid: cfid
        });
        saveToStorage();
    }

    function addFolderHTML(fname , rid, pid){
        let divFoldertemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFoldertemplate,true);

        let spanRename = divFolder.querySelector("[action=rename");
        let spanDelete = divFolder.querySelector("[action=delete");
        let spanView = divFolder.querySelector("[action=view");
        let divName = divFolder.querySelector("[purpose=name]");

        spanRename.addEventListener("click",renameFolder);
        spanDelete.addEventListener("click",deleteFolder);
        spanView.addEventListener("click",viewFolder);
        divName.innerHTML = fname;

        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    }

    function addTextFile(){
        let rname = prompt("Enter text file's name");
        if(!rname){
            alert("Empty name not valid");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists == true){
            alert(rname + "is already exists");
            return;
        }

        let pid = cfid;
        rid++;
        addTextFileHTML(rname, rid, pid);
        resources.push({
            rid : rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            isBold: false,
            isItalic: false,
            isUnderline: false,
            bgColor: "#000000",
            textColor: "#FFFFFF",
            fontFamily: "serif",
            fontSize: 12,
            content: "I am a new file"

        });
        saveToStorage();
    }

    function addTextFileHTML(fname , rid, pid){
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate,true);

        let spanRename = divTextFile.querySelector("[action=rename");
        let spanDelete = divTextFile.querySelector("[action=delete");
        let spanView = divTextFile.querySelector("[action=view");
        let divName = divTextFile.querySelector("[purpose=name]");

        spanRename.addEventListener("click",renameTextFile);
        spanDelete.addEventListener("click",deleteTextFile);
        spanView.addEventListener("click",viewTextFile);
        divName.innerHTML = fname;

        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        divContainer.appendChild(divTextFile);
    }

    function changeNotepadFontFamily(){
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }
    function changeNotepadFontSize(){
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize;
    }

    function changeNotepadBGColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }

    function changeNotepadTextColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }    

    function deleteFolder(){
        //delete all folders inside also aka recursively
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fidTBD = parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML; 

        let sure = confirm(`Are you sure you want to delete ${fname}`);
        if(!sure){
            return;
        }

        //html
        divContainer.removeChild(divFolder);
        //ram
        deleteHelper(fidTBD);
        //storage
        saveToStorage();
    }

    function deleteHelper(fidTBD){
        let children = resources.filter(r => r.pid == fidTBD);
        for(let i=0 ; i<children.length; ++i){
            deleteHelper(children[i].rid);//delete recursively
        }

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        console.log(resources[ridx].rname);
        resources.splice(ridx,1);
    }

    function deleteTextFile(){
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");

        let fidTBD = parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm(`Are you sure you want to deler ${fname}?`);
        if(!sure){
            return;
        }
        //html
        divContainer.removeChild(divTextFile);
        //ram
        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx, 1);
        //storage
        saveToStorage();
    }

    function downloadNotepad(){
        console.log("in download");
    }

    function makeNotepadBold(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }

    function makeNotepadItalic(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }
    
    function makeNotepadUnderline(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }

    function renameFolder(){
        let nrname = prompt("Enter folder's name");
        if(nrname != null){
            nrname = nrname.trim();
        }  

        if(!nrname){//empty name validation
            alert("Empty name is not allowed");
            return;
        }

        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose=name");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        if(nrname == orname){
            alert("Please enter a new name.");
            return;

        }

        let alreadyExists = resources.some(r => r.name == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists.");
            return;
        }
        //change html
        divName.innerHTML = nrname;
        //change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        //change storage
        saveToStorage(); 
    }

    function renameTextFile(){
        let nrname = prompt("Enter file's name");
        if(nrname != null){
            nrname = nrname.trim();
        }  

        if(!nrname){//empty name validation
            alert("Empty name is not allowed");
            return;
        }

        let spanRename = this;
        let divTextFile = spanRename.parentNode;
        let divName = divTextFile.querySelector("[purpose=name");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divTextFile.getAttribute("rid"));
        if(nrname == orname){
            alert("Please enter a new name.");
            return;

        }

        let alreadyExists = resources.some(r => r.name == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists.");
            return;
        }
        //change html
        divName.innerHTML = nrname;
        //change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        //change storage
        saveToStorage(); 
    }

    function saveNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();
    }

    function saveToStorage(){
        let rjson = JSON.stringify(resources);
        localStorage.setItem("data", rjson);
    }

    function uploadNotepad(){
        console.log("in upload");
    }

    function viewFolder(){
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        aPath.addEventListener("click", viewFolderFromPath);
        divbreadcrumb.appendChild(aPath);

        cfid = fid;
        divContainer.innerHTML = "";
        for(let i=0; i<resources.length; ++i){
            if(resources[i].pid == cfid){
                addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
            }
        }
    }

    function viewFolderFromPath(){
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        //set teh breadcrumb
        while(aPath.nextSibling){
            aPath.parentNode.removeChild(aPath.nextSibling);
        }

        //set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i=0; i<resources.length; ++i){
            if(resources[i].pid == cfid){
                addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid)
            }
        }
    }

    function viewTextFile(){
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]")
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate  = templates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let inputUpload = divAppMenuBar.querySelector("[action=upload]");
        let textArea = divAppBody.querySelector("textArea");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        inputUpload.addEventListener("change", uploadNotepad);

        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
        
    }

    function loadFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!!rjson){
            resources = JSON.parse(rjson);
            for(let i=0; i<resources.length; ++i){
                if(resources[i].pid == cfid){
                    if(resources[i].rtype == "folder"){
                        addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }else if(resources[i].rtype == "text-file"){
                        addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }
                }

                if(resources[i].rid > rid){
                    rid = resources[i].rid;
                }
            }
        }
    }

    loadFromStorage();

})();