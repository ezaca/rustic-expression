using System;

namespace ExpressionStack.RusticExpression.Evaluators
{
    class Literal : RusticValueEvaluator
    {
        object value;
        public Literal(object value) => this.value = value;
        public override object GetValue() => value;
        public override Type GetValueType() => value.GetType();
        public override string ToString() => $"{value}";
    }
}
