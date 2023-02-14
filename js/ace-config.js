import { Content } from "./content.js";

//global ace editor instance
let editor;
//global ace editor extension for beautify
let beautify;
//current activated editor
let currentEditorId = 0;
//current content of the current sheet.
let currentContent = '';

//let KEY_TAB_COUNT = "tab_count";
let mode_xml = 'ace/mode/xml';
let mode_json = 'ace/mode/json';

let contents = [];

/**
 * Initialize the editor.
 */
(
    function () {
        editor = ace.edit("editor");
        beautify = ace.require("ace/ext/beautify");
        editor.setTheme("ace/theme/crimson_editor");
        editor.setShowPrintMargin(false);
        editor.session.setMode(mode_json);
        editor.session.setUseWrapMode(true);
        //previousTabCount = localStorage.getItem(KEY_TAB_COUNT);

        //add the initial editor with id 0.
        addTab(currentEditorId).then(
            function (value) {
                currentContent = contents.find(item => item.id == currentEditorId).value;
                selectEditor(currentEditorId);
                //remove the loader
                $('.loaderContainer').remove();
            },
            function (error) {
                console.error(error)
            }
        );
    }
)();

$(function() {
    $('#header').load('component/header.html');
    $('#footer').load('component/footer.html');
})

/**
 * Editor content change event.
 */
editor.session.on('change', function (delta) {
    currentContent = editor.getValue();
});

/**
 * Add editor button click event.
 */
$("#addEditor").click(function () {
    var id = contents[contents.length - 1].id + 1;
    addTab(id);
});

/**
 * User navigating though different editors.
 */
$(document).on('click', '.editor-button', function ($event) {
    let currentTabAvailable = contents.findIndex(item => item.id == this.id);
    if (currentEditorId != this.id && currentTabAvailable != -1) {
        document.getElementById(this.id).classList.add('active');
        document.getElementById(this.id).classList.remove('inactive');
        document.getElementById(currentEditorId).classList.add('inactive');
        document.getElementById(currentEditorId).classList.remove('active');

        //editor has changed, store data in the list
        //localStorage.setItem(currentEditorId, currentContent);
        contents.find(item => item.id == currentEditorId).value = currentContent;
        currentEditorId = this.id;
    } else if (currentEditorId == 0) {
        document.getElementById(currentEditorId).classList.add('active');
        document.getElementById(currentEditorId).classList.remove('inactive');
    }

    //load content based on the selected editor id
    currentContent = contents.find(item => item.id == currentEditorId).value;
    editor.session.setValue(currentContent);
});

/**
 * editor button's close button click event.
 */
$(document).on('click', '.close', function ($event) {
    const editorId = this.parentElement.id;

    deleteTab(editorId).then(() => {
    }, (error) => {
        console.error(error);
    });
});

/**
 * Format button click event.
 */
$("#format").click(function () {
    format();
});

/**
 * Minify button click event.
 */
$("#minify").click(function () {
    minify();
});

/**
 * Add a tab.
 */
async function addTab(id) {
    if (contents.length >= 5) {
        return;
    }
    var r = $('<div class="editor-button inactive" id="' + id + '">editor - ' + id + '<i class="close fa-solid fa-close"></i></div>');
    $("#editorList").append(r);
    contents.push(new Content(id, ""));
}

/**
 * Remove a tab.
 */
async function deleteTab(tabId) {
    if (contents.length == 1) {
        console.info('cannot remove all editors');
        return;
    }
    contents = contents.filter(item => item.id != tabId);
    let parent = document.getElementById(tabId);
    parent.remove();

    //set the current id
    currentEditorId = contents[contents.length - 1].id;
}

/**
 * Click on a tab
 */
function selectEditor(id) {
    document.getElementById(id).click();
}

/**
 * Remove all white spaces from the json.
 */
function minify() {
    let originalValue = editor.getValue();
    let json = JSON.parse(originalValue);
    editor.setValue(JSON.stringify(json));
}

/**
 * Format JSON and set value.
 */
function format() {
    //let originalValue = editor.getValue();
    //editor.setValue(JSON.stringify(originalValue, null, 4));
    beautify.beautify(editor.session);
}

/**
 * Stop propergation of events.
 * @param {event} e 
 */
function stopPropergation(e) {
    if (!e) e = window.event;

    if (e.stopPropagation) {
        //IE9 & Other Browsers
        e.stopPropagation();
    } else {
        //IE8 and Lower
        e.cancelBubble = true;
    }
}

function getDefaultData(type) {
    const headers = {
        'Access-Control-Allow-Origin': '*'
    };
    if (type == 'S') {
        fetch("./json/sample-small.json", { headers }).then(respose => {
            respose.json();
        }).then(json => {
            editor.setValue(json);
        });
    } else if (type == 'L') {
        fetch("./json/sample-large.json", { headers }).then(respose => {
            respose.json();
        }).then(json => {
            editor.setValue(json);
        });
    }
}