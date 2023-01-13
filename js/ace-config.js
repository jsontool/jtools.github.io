
let editor;
let beautify;
(
    function () {
        editor = ace.edit("editor");
        beautify = ace.require("ace/ext/beautify");
        editor.setTheme("ace/theme/crimson_editor");
        editor.session.setMode("ace/mode/json");
        editor.session.setUseWrapMode(true);
        console.log('initializing the ace')
        //getDefaultData("L")

    }
)();

editor.session.on('change', function (delta) {
    // delta.start, delta.end, delta.lines, delta.action
    //console.log(delta);
    //console.log(editor.getValue());
});

$("#format").click(function () {
    format();
});

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