using System.Collections.Generic;

namespace ExpressionStack.RusticExpression
{
    class RusticExpr
    {
        static bool PreferSimplifiedExpression = false;

        static public int GetVariableID(string name) => name.GetHashCode();

        public readonly List<RusticStack> stacks = new List<RusticStack>();

        public RusticContext context { get => _context; set => SetContext(value); }

        private RusticContext _context;

        public RusticExpr() { }

        public RusticExpr(RusticContext context) : this() => SetContext(context);

        public RusticExpr(string expression) : this() => SetExpression(expression);

        public RusticExpr(string expression, RusticContext context) : this()
        {
            SetContext(context);
            SetExpression(expression);
        }

        public void SetContext(RusticContext context)
        {
            _context = context;
            _context.expression = this;
        }

        public void SetExpression(string expression)
        {
            if (PreferSimplifiedExpression)
                new RusticExprBuilder(this, _context, expression).FinalizeAndSimplify();
            else
                new RusticExprBuilder(this, _context, expression).FinalizeExpression();
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
