using Bridge;
using ExpressionStack.RusticExpression;
using System;
using Bridge.Html5;

namespace LivePreview
{
    public class App
    {
        static string HtmlContent = @"
<h1>RusticExpression</h1>

<main>
    <h2>Introduction</h2>
    <p>RusticExpression is a .NET code that allows you to parse and execute simple expressions. It was made for fun in dusk and weekends, but seems to have grow stable enough for me to share with people.</p>

    <h2>Yet to come</h2>
    </ul>
        <li>Add platform support: Unity;</li>
        <li>Add feature: right to left operator precedence;</li>
        <li>Add feature: left and right operators (like 'not', 'new' and ++)</li>
        <li>Add bug fix: new parser system that considers context and prevent confusing signals and operators;</li>
    </ul>
    <h2>Live preview <span>Bridge.NET</span></h2>
    <input type=""text"" id=""tExpression"" value=""1 + 2 * 3 - 4"">
    <small>Available operators: <code>+</code> (sum), <code>-</code> (subtraction), <code>*</code> (multiplication), <code>/</code> (division), <code>**</code> (power), <code>( )</code> (parenthesis).</small>
    <br /><small>Available literals: integer, double, float.</small>
    <div id=""expr-resultbox""></div>
<main>
";

        static string CssContent = @"
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap');

body, html{
    font-family: Montserrat, sans-serif;
    padding: 0px;
    margin: 0px;
}
h1{
    padding: 3em 0.5em 0.5em 1em;
    margin: 0px;
    font-size: 1.5rem;
    background-color: #4252BD;
    color: white;
    font-weight: 300;
    position: relative;
}
main{
    padding: 2rem;
}
input[type=text]{
    width: 100%;
    border: 1px solid #4252BD;
    padding: 0.5em;
    font: inherit;
}
code{
    padding: 4px 6px;
    border-radius: 4px;
    background: #FAE6E9;
    font-family: monospace;
}
#expr-resultbox{
    margin: 1rem 0;
}
.expr-result{
    margin: 1rem 0 2rem 0;
}
table{
    border-spacing: 0;
}
table td, table th{
    text-align: left;
    border-bottom: #E7E9F7 solid 1px;
    padding: 0.5rem;
    margin: 0;
}
table tr:nth-child(even) td{
    background-color: #F5F6FC;
}
table tr:hover td{
    background-color: #d6daf1;
}
table td:first-child:nth-last-child(4),
table td:first-child:nth-last-child(4) ~ td {
    border-top: 2rem solid white;
}
";

        static HTMLDivElement ResultBox;
        static HTMLInputElement InputExpression;

        public static void Main()
        {
            // HTML
            var H1 = new HTMLDivElement() { InnerHTML = HtmlContent.Trim() };
            var Style = new HTMLStyleElement() { InnerHTML = CssContent, Lang="text/css" };
            Document.Head.AppendChild(Style);
            Document.Body.AppendChild(H1);
            ResultBox = Document.GetElementById<HTMLDivElement>("expr-resultbox");
            InputExpression = Document.GetElementById<HTMLInputElement>("tExpression");

            InputExpression.OnInput = OnInputExpression;

            OnInputExpression(null);


            // INSTRUCTIONS
            // =============
            //
            // After building (Ctrl + Shift + B) this project, 
            // browse to the /bin/Debug or /bin/Release folder.
            //
            // A new bridge/ folder has been created and
            // contains your projects JavaScript files. 
            //
            // Open the bridge/index.html file in a browser by
            // Right-Click > Open With..., then choose a
            // web browser from the list.
            //
            // This application will then run in the browser
            // and you will be able to test it.
            //
        }

        static public void OnInputExpression(Event<HTMLInputElement> ev)
        {
            try
            {
                RusticExpr expr = new RusticExpr(InputExpression.Value);
                expr.Execute();
                ResultBox.InnerHTML = expr.PrintToHtml();
            } catch(Exception e)
            {
                ResultBox.InnerHTML = $"Fix your formula: {e.Message}";
            }
            //expr.PrintDebug(); // Console
        }
    }
}