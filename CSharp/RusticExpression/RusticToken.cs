using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression
{
    public class RusticToken
    {
        public RusticTokenMode mode;
        public object value;

        public RusticToken(RusticTokenMode mode, object value)
        {
            this.mode = mode;
            this.value = value;
        }

        public override string ToString() => $"RusticToken({mode}, \"{value}\")";
    }

    public enum RusticTokenMode
    {
        Ignored,
        Literal,
        VariableName,
        Operation,
        PriorityOffset,
    }
}
