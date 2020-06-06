using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression
{
    static class DebugExtension
    {
        static public void PrintDebug(this RusticExpr expression)
        {
            List<RusticStack> stacks = expression.stacks;
            for (int r = stacks.Count - 1; r >= 0; r--)
            {
                // "r99[p=99]:  "
                Console.WriteLine($"R{r} [P={stacks[r].priority}]:".PadRight(30) + stacks[r].ToExpressionString());
                if (stacks[r].operations.Count == 0)
                {
                    Console.WriteLine($"No operations found.");
                }
                else
                {
                    Type prevType = null;
                    for (int i = 0; i < stacks[r].operations.Count; i++)
                    {
                        RusticOperation operation = stacks[r].operations[i];
                        Console.WriteLine($"  {operation.GetType().Name} RX{(operation.parameter == null ? "" : ", " + operation.parameter)}".PadRight(30) + $"  # {operation.GetType().Name}({prevType?.Name ?? "null"}, {operation.parameterType?.Name ?? "null"}): {operation.PreviewResultType(prevType).Name}");
                        prevType = operation.PreviewResultType(prevType);
                    }
                }

                if (stacks[r].executed)
                {
                    Console.WriteLine($"  ResultValue {stacks[r].ResultValue}".PadRight(30) + $"  # {stacks[r].ResultValue?.GetType().Name ?? "null"}");
                }
                Console.WriteLine();
            }
        }
    }
}
