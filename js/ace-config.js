
let editor;
(
    function () {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/crimson_editor");
        editor.session.setMode("ace/mode/json");
        console.log('initializing the ace')
        //getDefaultData("L")

    }
)();

editor.session.on('change', function(delta) {
    // delta.start, delta.end, delta.lines, delta.action
    //console.log(delta);
    console.log(editor.getValue());
});

/**
 * Format JSON and set value.
 */
function format() {
    let originalValue = editor.getValue();
    editor.setValue(JSON.stringify(originalValue, null, 4));
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