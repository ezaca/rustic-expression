using ExpressionStack.RusticExpression;
using Bridge;
using System;

namespace LivePreview
{
    static class BridgePrintHtml
    {
        static public string PrintToHtml(this RusticExpr expr)
        {
            string html = $"<div class=\"expr-result\">Result: {expr.stacks[0].ResultValue}</div>";
            html += "<table width=100%>";
            
            // Table Head
            html += "<thead>";
            html += "<tr>";
            html += "<th>Stack Register</th>";
            html += "<th width=50%>Operation</th>";
            html += "<th width=20%>Result</th>";
            html += "<th>Type</th>";
            html += "</tr>";
            html += "</thead>";

            // Table Body
            html += "<tbody>";

            foreach(var stack in expr.stacks)
            {
                bool isFirst = true;
                Type prevType = null;
                object resultValue = null;
                foreach(var operation in stack.operations)
                {
                    html += "<tr>";
                    if (isFirst)
                        // Stack Register column
                        html += $"<td rowspan='{stack.operations.Count + 1}'>R{stack.displayId}</td>";

                    Type opResultType = operation.PreviewResultType(prevType);
                    resultValue = operation.Execute(resultValue);
                    
                    // Operations column
                    html += $"<td>{operation.GetType().Name}{(operation.parameter != null ? " " + operation.parameter : "")}</td>";
                    
                    // Result column
                    html += $"<td>R{stack.displayId}: {resultValue}</td>";
                    
                    // Type column
                    html += $"<td style='white-space: nowrap'>{operation.GetType().Name}({prevType?.Name ?? "null"}, {(operation.parameter != null ? " " + operation.parameterType.Name : "null")}): {opResultType.Name}</td>";

                    html += "</tr>";
                    isFirst = false;
                    prevType = opResultType;
                }

                html += $"<tr style='font-weight:bold'><td>Return</td><td>R{stack.displayId}: {stack.ResultValue ?? "null"}</td><td>{stack.ResultValue?.GetType().Name ?? "null"}</td></tr>";

                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";
            return html;
        }
    }
}
