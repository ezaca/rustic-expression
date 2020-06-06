using System;

namespace ExpressionStack.RusticExpression.Evaluators
{
    class StackReference : RusticValueEvaluator
    {
        public RusticStack stack { get; }
        public StackReference(RusticStack stack)
        {
            this.stack = stack;
        }

        public override object GetValue() => stack.ResultValue;
        public override Type GetValueType() => stack.PreviewResultType();
        public override string ToString() => $"R{stack.displayId}";
    }
}
