using System;

namespace ExpressionStack.RusticExpression.Operations
{
    class Set : RusticOperation
    {
        public override object Execute(object stored) => parameterValue;
        protected override Priority GetPriority() => Priority.Ignored;
        public override Type PreviewResultType(Type incomingStoredType) => parameterType;
        public override string ToExpressionString() => $" {parameter?.ToString()}";
    }
}
