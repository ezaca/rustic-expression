using System.Collections.Generic;

namespace ExpressionStack.RusticExpression
{
    class RusticExpr
    {
        static bool PreferSimplifiedExpression = false;

        static public int GetVariableID(string name) => name.GetHashCode();

        public readonly List<RusticStack> stacks = new List<RusticStack>();

        private RusticContext context;

        public RusticExpr() => ResetExpression();

        public RusticExpr(RusticContext context) : this() => this.context = context;

        public RusticExpr(string expression) : this() => SetExpression(expression);

        public RusticExpr(string expression, RusticContext context) : this()
        {
            this.context = context;
            SetExpression(expression);
        }

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

        public object Execute()
        {
            for (int r = stacks.Count - 1; r >= 0; r--)
            {
                stacks[r].Execute();
            }

            return stacks[0].ResultValue;
        }
    }
}
