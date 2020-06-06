using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ExpressionStack.RusticExpression
{
    static class RusticParser
    {
        static readonly public List<OperationKind> MiddleOperators = new List<OperationKind>()
        {
            new OperationKind("**", new Operations.Pow()),
            new OperationKind("+", new Operations.Add()),
            new OperationKind("-", new Operations.Sub()),
            new OperationKind("*", new Operations.Mul()),
            new OperationKind("/", new Operations.Div()),
        };

        // LeftOperators

        // ValueHolders

        static public IEnumerable<RusticToken> GetTokenList(string expression, RusticContext context)
        {
            yield return null;
        }

        public class OperationKind {
            public string pattern;
            public RusticOperation operation;
            public OperationKind(string pattern, RusticOperation operation)
            {
                this.pattern = pattern;
                this.operation = operation;
            }
        }
    }
}
