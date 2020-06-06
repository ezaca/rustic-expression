using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression
{
    class RusticExpr
    {
        static bool PreferSimplifiedExpression = false;

        static public int GetVariableID(string name) => name.GetHashCode();

        public readonly List<RusticStack> stacks = new List<RusticStack>();

        RusticContext context;

        public RusticExpr() => ResetExpression();

        public RusticExpr(string expression) : this() => SetExpression(expression);

        public void ResetExpression()
        {
            stacks.Clear();
            context = new RusticContext();
        }

        public void SetExpression(string expression)
        {
            if (PreferSimplifiedExpression)
                new RusticExprBuilder(this, context, expression).FinalizeAndSimplify();
            else
                new RusticExprBuilder(this, context, expression).FinalizeExpression();
        }

        public object Execute(Dictionary<int, object> inputs = null)
        {
            context.variables = inputs;
            for (int r = stacks.Count - 1; r >= 0; r--)
            {
                stacks[r].Execute();
            }

            return stacks[0].ResultValue;
        }
    }
}
