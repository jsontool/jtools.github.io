//import { Content } from "./content";
//const content = require('./content');

//global ace editor instance
let editor;
//global ace editor extension for beautify
let beautify;
//current activated editor
let currentEditorId= '0';
let editorList = ['0'];
//content of each tab
let contentList = [];
//current content of the current sheet.
let currentContent;

(
    function () {
        editor = ace.edit("editor");
        beautify = ace.require("ace/ext/beautify");
        editor.setTheme("ace/theme/crimson_editor");
        editor.setShowPrintMargin(false);
        editor.session.setMode("ace/mode/json");
        editor.session.setUseWrapMode(true);
        console.log('initializing the ace')
    }
)();

editor.session.on('change', function (delta) {
    console.log('Making changes to editor ' + currentEditorId)
    currentContent = editor.getValue();
    // delta.start, delta.end, delta.lines, delta.action
    //console.log(delta);
    //console.log(editor.getValue());
    
});

/**
 * Add editor button click
 */
$("#addEditor").click(function () {
    if (editorList.length >= 5) {
        console.log('Max allowed editor count is 5')
        return;
    }
    console.log('add button');
    var id = editorList.length;
    var r = $('<button type="button" class="pure-button editor-button" id="' + id + '">Tab - ' + (editorList.length + 1) + '</button>');
    editorList.push(id);

    $("#editorList").append(r);
});

$(document).on('click', '.editor-button', function ($event) {
    console.log('Current working sheet: ' + this.id);
    if (currentEditorId !== this.id) {
        console.log('previous editor ' + currentEditorId + ', new editor ' + this.id);
        //editor has changed, store data in the list
        contentList[currentEditorId] = currentContent;
    }
    //new editor id
    currentEditorId = this.id;
    //load content based on the selected editor id
    editor.session.setValue(contentList[currentEditorId]);
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
 * Remove all white spaces from the json.
 */
function minify() {
    let originalValue = editor.getValue();
    let minified = originalValue.replaceAll(' ', '').replaceAll('\n', '').replaceAll('\t', '');
    editor.setValue(minified);
}

/**
 * Format JSON and set value.
 */
function format() {
    //let originalValue = editor.getValue();
    //editor.setValue(JSON.stringify(originalValue, null, 4));
    beautify.beautify(editor.session);
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