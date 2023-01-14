
//global ace editor instance
let editor;
//global ace editor extension for beautify
let beautify;
//editor id list
let editorList = [];
//current activated editor
let currentEditor;

(
    function () {
        editor = ace.edit("editor");
        beautify = ace.require("ace/ext/beautify");
        editor.setTheme("ace/theme/crimson_editor");
        editor.session.setMode("ace/mode/json");
        editor.session.setUseWrapMode(true);
        console.log('initializing the ace')
        //getDefaultData("L")
        //Initial editor id.
        editorList.push("sheet1");

        //initialize current editor to the initial editor.
        currentEditor = editorList[0];
    }
)();

editor.session.on('change', function (delta) {
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
    var id = 'sheet' + (editorList.length + 1);
    var r = $('<button type="button" class="editor-button btn btn-success" id="' + id + '">Sheet-' + (editorList.length + 1) + '</button>');
    editorList.push(id);

    $("#editorList").append(r);
});

$(document).on('click', '.editor-button', function ($event) {
    alert(this.id);
    //todo
    //assign ace editor session to each button
    //load content based on the selected editor id
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