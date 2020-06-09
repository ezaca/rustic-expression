﻿using System.Collections.Generic;

namespace ExpressionStack.RusticExpression
{
    class RusticContext
    {
        public RusticExpr expression { get; private set; }
        public IReadOnlyList<RusticStack> stack => expression.stacks;
        public Dictionary<string, object> variables { get; set; }
    }
}