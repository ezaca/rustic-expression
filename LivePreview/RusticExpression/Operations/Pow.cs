using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression.Operations
{
    class Pow : RusticOperation
    {
        public override object Execute(object stored) => Math.Pow(Convert.ToDouble(stored), Convert.ToDouble(parameterValue));

        protected override Priority GetPriority() => Priority.Pow;

        public override Type PreviewResultType(Type incomingStoredType) => typeof(double);
#if UNITY_EDITOR
        PreviewResultType should consider float and double with Mathf.Pow.
#endif

        public override bool HasRightToLeftPrecedence() => true;

        public override string ToExpressionString() => $" ** ({ parameter?.ToString() })";
    }
}
