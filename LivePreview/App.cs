using Bridge;
using ExpressionStack.RusticExpression;
using System;
using Bridge.Html5;

namespace LivePreview
{
    public class App
    {
        static HTMLDivElement ResultBox;
        static HTMLInputElement InputExpression;

        public static void Main()
        {
            // HTML
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
                RusticContext context = new RusticContext()
                {
                    availableTypeCasts = new System.Collections.Generic.Dictionary<string, Type>()
                    {
                        { "int", typeof(int) },
                        { "float", typeof(float) },
                        { "double", typeof(double) },
                    },
                    variables = new System.Collections.Generic.Dictionary<string, object>()
                    {
                        { "PI", Math.PI },
                    },
                };
                RusticExpr expr = new RusticExpr(InputExpression.Value, context);
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