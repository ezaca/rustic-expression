using System;
using System.Collections.Generic;

namespace ExpressionStack.RusticExpression
{
    class RusticContext
    {
        public RusticExpr expression { get; set; }
        public IReadOnlyList<RusticStack> stack => expression.stacks;
        public Dictionary<string, object> variables { get; set; }
        public Dictionary<string, Type> availableTypeCasts { get; set; }
    }
}
