using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression
{
    public class RusticToken
    {
        public RustickTokenMode mode;
        public object value;

        public RusticToken(RustickTokenMode mode, object value)
        {
            this.mode = mode;
            this.value = value;
        }
    }

    public enum RustickTokenMode
    {
        Ignored,
        Literal,
        VariableName,
        Operation,
        PriorityOffset,
    }
}
