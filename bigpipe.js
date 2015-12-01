var http = require('http');

var server = http.createServer(function(req, res) {

    res.writeHead(200, {
       'Content-Type' : 'text/html',
        'Transfer-Encoding' : 'chunked'
    });

    res.write([
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="utf-8">',
        '<title>Node.js Bigpipe Demo</title>',
        '<style type="text/css">',
        ' * {margin: 0; padding:0;}',
        ' body {background-color:#fff;}',
        ' div{border:2px solid #4F81BD; margin:30px; padding: 10px;}',
        ' p {word-wrap:break-wrod; word-break:break-all; color: #666;}',
        ' .red {color: #f00;}',
        ' .blue {color:blue;}',
        ' .green {color:green;}',
        '</style>',
        '<script>',
        'var g_startTime = new Date();',
        'var g_renderArr = []',
        'function render(nodeID,html){',
        '   g_renderArr.push(new Date())',
        '    document.getElementById(nodeID).innerHTML=html;',
        '}',
        '</script>',
        '</head>',
        '<body>',
        '<div id="header"><p>Loading...</p></div>',
        '<div id="content"><p>Loading...</p></div>',
        '<div id="footer"><p>Loading...</p></div>'
    ].join('\r\n'));

    function out_header() {
        res.write("<script type='text/javascript'>render('header', '<p><span class=\"blue\">111111</span></p>');</script>\r\n");

        setTimeout(out_content, 4 * 1000);
    }

    function out_content() {
        res.write("<script type='text/javascript'>render('content', '<p><span class=\"red\">222222</span></p>');</script>\r\n");

        setTimeout(out_footer, 6 * 1000);
    }

    function out_footer() {
        res.write("<script type='text/javascript'>render('footer', '<p><span class=\"green\">333333</span></p>');</script>\r\n");

        setTimeout(out_end, 1 * 1000);
    }

    function out_end() {

        res.write([
            '<script>',
            'var str = [',
            '    "start:" + g_startTime.toGMTString(),',
            '    "header:" + g_renderArr[0].toGMTString() + "-" + (g_renderArr[0] - g_startTime) / 1000,',
            '    "content:" + g_renderArr[1].toGMTString() + "-" + (g_renderArr[1] - g_renderArr[0]) / 1000,',
            '    "footer:" + g_renderArr[2].toGMTString() + "-" + (g_renderArr[2] - g_renderArr[1]) / 1000,',
            '    "end:" + new Date().toGMTString() + "-" + (new Date() - g_renderArr[2]) / 1000 + "-" + (new Date() - g_startTime) / 1000',
            '].join("\\n");',
            'alert(str);',
            '</script>'
        ].join(''));

        res.end("\r\n</body></html>");
    }

    setTimeout(out_header, 2 * 1000);


}).listen(3002);